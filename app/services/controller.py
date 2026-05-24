# -*- coding: utf-8 -*-
"""
Kostalcontroller
================

Dieser Controller dient als zentrale Steuereinheit für das Auslesen eines
Kostal-Piko-Wechselrichters und das anschließende Veröffentlichen der Daten
über MQTT. Zusätzlich sendet er regelmäßige Status-/Health-Check-Informationen
an ein eigenes MQTT-Topic, damit externe Systeme (z. B. Home Assistant,
Node-RED, Grafana) jederzeit erkennen können, ob der Controller läuft und ob
die Sensordaten aktuell sind.

Hauptfunktionen
---------------

1. **Sensorabfrage**
   Der Controller nutzt ein `PikoSensor`-Objekt, um aktuelle Daten vom
   Wechselrichter abzurufen. Die Daten werden als Dictionary gespeichert und
   anschließend per MQTT veröffentlicht.

2. **MQTT-Datenübertragung**
   Alle Sensordaten werden an ein konfiguriertes MQTT-Topic gesendet.
   Zusätzlich wird ein zweites Topic für Status-/Health-Informationen genutzt.
   Dieses enthält:
       - running: ob die Automatik aktiv ist
       - pico_on: ob der Controller eingeschaltet wurde
       - last_update: Zeitstempel der letzten erfolgreichen Sensorabfrage
       - sensor_ok: ob gültige Sensordaten vorliegen

3. **Sofortiger Stop**
   Die Automatikschleife schläft nicht mehr für die gesamte Intervallzeit,
   sondern in kleinen Schritten (0.2 s). Dadurch reagiert der Controller
   praktisch sofort, wenn `stop()` aufgerufen wird.

4. **Fehlerrobustheit**
   Sensorfehler, MQTT-Fehler und unerwartete Ausnahmen werden abgefangen,
   geloggt und verhindern nicht den weiteren Betrieb.

5. **Logging**
   - INFO: kompakte Statusmeldungen
   - DEBUG: vollständige, formattierte JSON-Ausgabe der Sensordaten

Diese Klasse ist so aufgebaut, dass sie stabil im Dauerbetrieb laufen kann,
z.B. als Systemd-Service oder in einem Docker-Container.
"""

import time
from datetime import datetime
import socket

from app.integrations.kostal.piko_sensor import PikoSensor
from app.core.mqtt import MQTTClient

import app.core.config as settings

from app.core.logging import setup_logger
from app.services.utillib import savefile
from app.services.utillib import flatten_dict
from app.services.hadiscovery import HADiscoveryGenerator
from app.services.db_manager import DatabaseManager
from app.core.webhook import notify_ha


def get_system_identity():
    info: dict[str, str | None] = {"hostname": None, "fqdn": None, "ip": None}

    # Hostname
    info["hostname"] = socket.gethostname()

    # FQDN (vollständiger Hostname)
    info["fqdn"] = socket.getfqdn()

    # IP-Adresse ermitteln
    try:
        # Liefert Liste aller IPs → wir nehmen die erste brauchbare
        ips = socket.gethostbyname_ex(info["hostname"])[2]
        for ip in ips:
            if not ip.startswith("127."):
                info["ip"] = ip
                break
        if info["ip"] is None:
            info["ip"] = "127.0.0.1"
    except Exception:
        info["ip"] = "unbekannt"

    return info


class Kostalcontroller:

    def __init__(self, intervall=60):
        self.logger = setup_logger(self.__class__.__name__)

        self.kostalpiko = PikoSensor(settings.KOSTAL_SENSOR, settings.KOSTAL_DATA)
        self.intervall = intervall

        self.runCount = 0
        self.appStart = time.time()

        self.pico_an = False
        self.picodata = {}
        self.running = False
        self.last_update = None

        self.hostinfo = get_system_identity()
        self.payloadFile = settings.KOSTAL_SENSOR.get("datafile", "./data/payload.json")

        mqtt_cfg = settings.MQTT_SERVER
        auth_user = mqtt_cfg.get("user")

        self.mqtt = MQTTClient(
            host=mqtt_cfg["host"],
            port=mqtt_cfg.get("port", 1883),
            clientId=mqtt_cfg.get("client", "piko_sensor"),
            auth=({"username": auth_user, "password": mqtt_cfg.get("password")} if auth_user else None),
        )

        self.data_topic = mqtt_cfg["topic"]
        self.status_topic = mqtt_cfg.get("status_topic", "piko/status")

        self.db = DatabaseManager()

        # Webhook-Tracking
        self._sensor_error_sent = False
        self._consecutive_errors = 0

        self.logger.info("Kostalcontroller initialisiert")

    # ---------------- Steuerung ----------------

    def kostal_ein(self):
        self.pico_an = True
        self.logger.debug("Piko Controller eingeschaltet")

    def kostal_aus(self):
        self.pico_an = False
        self.logger.debug("Piko Controller ausgeschaltet")

    # ---------------- Sensoren aktualisieren ----------------

    def sensoren_aktualisieren(self):
        self.logger.debug("Sensoren werden aktualisiert...")
        self.kostal_aus()
        try:
            # daten publishen
            data = self.kostalpiko.update()

            if data is None:
                self.logger.warning("PikoSensor lieferte keine Daten (None)")
                self.picodata = {}
                self._consecutive_errors += 1
                # Webhook nach 3 aufeinanderfolgenden Fehlern (vermeidet Spam)
                if self._consecutive_errors >= 3 and not self._sensor_error_sent:
                    notify_ha("sensor_error",
                              message="Wechselrichter nicht erreichbar",
                              severity="warning",
                              consecutive_errors=self._consecutive_errors)
                    self._sensor_error_sent = True
                return False
            else:
                # Sensor wieder OK nach Fehler
                if self._sensor_error_sent:
                    notify_ha("sensor_ok",
                              message="Wechselrichter wieder erreichbar",
                              after_errors=self._consecutive_errors)
                    self._sensor_error_sent = False
                self._consecutive_errors = 0

                self.picodata = data
                self.last_update = datetime.now().isoformat()

                if self.payloadFile and self.picodata:

                    self.kostal_ein()

                    if self.runCount == 0 and settings.HA_DISCOVERY_ON:
                        # ha discovery erstellen
                        hadiscovery = HADiscoveryGenerator(
                            mqtt_client=self.mqtt,
                            yaml_file=settings.KOSTAL_SENSOR["hadiscovery"],
                            base_state_topic=settings.MQTT_SERVER["topic"],
                            simulate=False,
                        )
                        hadiscovery.publish_all()
                        self.logger.info("HA Discovery wurde erstellt")

                    savefile(content=self.picodata, filename=self.payloadFile)

                # Datenbank aktualisieren
                try:
                    rowid = self.db.insert_reading(self.picodata)
                    self.db.upsert_history(self.picodata)
                    self.logger.info(
                        "DB gespeichert: reading rowid=%s | "
                        "tag=%.3f kWh | monat=%.3f kWh | jahr=%.3f kWh",
                        rowid,
                        self.picodata.get("total", {}).get("power_day", 0.0),
                        self.picodata.get("total", {}).get("power_month", 0.0),
                        self.picodata.get("total", {}).get("power_year", 0.0),
                    )
                except Exception as e:
                    self.logger.error("Datenbankfehler: %s", e, exc_info=True)

                self.runCount += 1

                return True

        except Exception as e:
            self.logger.error("Fehler beim Aktualisieren der Sensoren: %s", e, exc_info=True)
            self.picodata = {}
            return False

    # ---------------- Status ----------------
    def status(self):
        end = time.time()
        laufzeit = (end - self.appStart) / 60
        return {
            "running": self.running,
            "runcount": self.runCount,
            "pico_on": self.pico_an,
            "last_update": self.last_update,
            "sensor_ok": bool(self.picodata),
            "dockerapp": settings.APP_NAME,
            "host": self.hostinfo,
            "laufzeit": f"{laufzeit:.3f} min",
            "update": datetime.now().isoformat(timespec="seconds"),
        }

    def publish_status(self):
        try:
            self.mqtt.publish(payload=self.status(), topic=self.status_topic)
        except Exception as e:
            self.logger.error("MQTT Status-Publish fehlgeschlagen: %s", e)

    # ---------------- Automatikbetrieb ----------------

    def start_automatik(self):
        if self.running:
            self.logger.warning("Automatik läuft bereits")
            return

        self.running = True
        self.logger.info("Automatik gestartet")
        notify_ha("app_start", version=settings.APP_VERSION if hasattr(settings, 'APP_VERSION') else "2.0.0")

        try:
            while self.running:
                start_time = time.time()

                sensor_ok = self.sensoren_aktualisieren()

                if sensor_ok:
                    try:
                        data = flatten_dict(d=self.picodata)
                        if data:
                            self.mqtt.publish(payload=data, topic=self.data_topic)
                            self.logger.debug("MQTT Daten veröffentlicht")
                        else:
                            self.logger.error("MQTT Publish fehlgeschlagen - keine Daten")
                    except Exception as e:
                        self.logger.error("MQTT Publish fehlgeschlagen: %s", e)
                else:
                    self.logger.info("Keine Sensordaten verfügbar")

                # Status-Topic senden
                self.publish_status()

                # Sofortiger Stop durch kurze Sleep-Schritte
                elapsed = time.time() - start_time
                remaining = self.intervall - elapsed

                while remaining > 0 and self.running:
                    time.sleep(min(0.2, remaining))
                    remaining -= 0.2

        except KeyboardInterrupt:
            self.logger.info("Automatik durch Benutzer beendet")
        except Exception as e:
            self.logger.error("Unerwarteter Fehler in der Automatik: %s", e, exc_info=True)
            notify_ha("error", message=str(e), severity="critical")
        finally:
            self.running = False
            self.publish_status()
            # Tagesübersicht senden
            total = self.picodata.get("total", {})
            if total:
                notify_ha("daily_summary",
                          power_day=total.get("power_day", 0.0),
                          power_month=total.get("power_month", 0.0),
                          power_year=total.get("power_year", 0.0))
            notify_ha("app_stop", message="Controller gestoppt")
            self.db.close()
            self.logger.info("Automatik gestoppt")

    # ---------------- Stop ----------------

    def stop(self):
        self.running = False
        self.logger.info("Stop-Signal empfangen")
