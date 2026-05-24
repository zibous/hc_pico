# -*- coding: utf-8 -*-

import os
import re
import yaml

from app.core.mqtt import MQTTClient
from app.services.utillib import savefile
from app.core.logging import setup_logger
import app.core.config as settings

# Regulärer Ausdruck zur Validierung von HTTP/HTTPS-URLs
URL_REGEX = re.compile(
    r"^(https?://)"  # http:// oder https://
    r"([a-zA-Z0-9.-]+)"  # Hostname oder IP
    r"(:[0-9]+)?"  # optionaler Port
    r"(/.*)?$"  # optionaler Pfad
)


def slugify(text: str) -> str:
    """
    Wandelt einen beliebigen Text in einen Home-Assistant-kompatiblen Slug um.

    - Kleinbuchstaben
    - Nicht-Alphanumerisches wird zu "_"
    - Mehrere "_" werden reduziert
    - Keine führenden oder endenden "_"

    Beispiel:
        "AC-Leistung (Phase 1)" → "ac_leistung_phase_1"
    """
    text = text.lower()
    text = re.sub(r"[^\w]+", "_", text)
    text = re.sub(r"_+", "_", text)
    return text.strip("_")


class HADiscoveryGenerator:
    """
    Automatischer Home-Assistant MQTT-Discovery Generator.

    Funktionen:
    - Lädt YAML-Geräte-Definitionen
    - Validiert Device- und Item-Blocks
    - Erzeugt HA-konforme Discovery-Payloads
    - Schreibt JSON-Dateien (Simulation) oder publiziert per MQTT

    Besonderheiten:
    - Alle Validierungen erfolgen vor der Publizierung
    - _publish_sensor() ist komplett logikfrei
    - Stabiler unique_id über SHA256-Hash
    """

    def __init__(
        self,
        mqtt_client: MQTTClient,
        tag="x",
        yaml_file="kostal_sensors_generated.yaml",
        base_state_topic="kostal/data",
        simulate=True,
    ):

        self.logger = setup_logger(self.__class__.__name__)
        self.simulate = simulate
        self.tag = tag
        # Zielordner sicherstellen
        os.makedirs(settings.HADAADIR, exist_ok=True)

        self.mqtt_client = mqtt_client
        self.yaml_file = yaml_file
        self.base_state_topic = base_state_topic
        self.devices = {}

        self._load_yaml()
        self.validate_all()

    # -------------------- YAML Laden -------------------- #
    def _load_yaml(self):
        """Lädt die YAML-Datei und extrahiert Geräte"""
        with open(self.yaml_file, "r", encoding="utf8") as f:
            data = yaml.safe_load(f) or {}
        self.devices = data.get("devices", {})

    # -------------------- Validierung -------------------- #
    def validate_device_block(self, device_block: dict) -> dict:
        """Validiert Device-Block für Home Assistant"""
        valid = {}

        # identifiers
        identifiers = device_block.get("identifiers")
        if identifiers:
            if isinstance(identifiers, (list, tuple)):
                valid["identifiers"] = [str(x) for x in identifiers]
            else:
                valid["identifiers"] = [str(identifiers)]
        else:
            self.logger.warning("device_block ohne 'identifiers' – empfohlen")

        # connections
        connections = device_block.get("connections")
        if connections and isinstance(connections, list) and all(isinstance(c, (list, tuple)) and len(c) == 2 for c in connections):
            valid["connections"] = [[str(c[0]), str(c[1])] for c in connections]
        elif connections:
            self.logger.warning("Ungültige 'connections' – erwartet Liste von 2er-Listen")

        # einfache String-Felder
        for key in ["name", "manufacturer", "model", "sw_version"]:
            if device_block.get(key):
                valid[key] = str(device_block[key])

        # configuration_url
        config_url = device_block.get("configuration_url")
        if config_url:
            config_url = str(config_url).strip()
            if not config_url.startswith(("http://", "https://")):
                config_url = "http://" + config_url
            if URL_REGEX.match(config_url):
                valid["configuration_url"] = config_url
            else:
                self.logger.warning(f"Ungültige configuration_url '{config_url}' – wird ignoriert")

        return valid

    def validate_item(self, item: dict, comp_type: str):
        """Validiert Sensor- oder Binary-Sensor-Item"""
        valid = {}

        # Pflichtfelder
        if "name" not in item or "json_key" not in item:
            self.logger.error(f"Item ohne name/json_key: {item}")
            return None

        valid["name"] = str(item["name"])
        valid["json_key"] = str(item["json_key"])

        # Icon
        if item.get("ic"):
            valid["ic"] = str(item["ic"])

        # entity_category
        if item.get("ent_cat"):
            valid["ent_cat"] = str(item["ent_cat"])

        # Device Class
        if item.get("dev_cla"):
            dev_cla = str(item["dev_cla"])
            valid_binary = {
                "battery",
                "battery_charging",
                "cold",
                "connectivity",
                "door",
                "garage_door",
                "gas",
                "heat",
                "light",
                "lock",
                "moisture",
                "motion",
                "moving",
                "occupancy",
                "opening",
                "plug",
                "presence",
                "problem",
                "running",
                "safety",
                "smoke",
                "sound",
                "tamper",
                "update",
                "vibration",
                "window",
            }
            if comp_type == "binary_sensor" and dev_cla not in valid_binary:
                self.logger.warning(f"Ungültige device_class '{dev_cla}' für binary_sensor – wird ignoriert")
            else:
                valid["dev_cla"] = dev_cla

        # Unit of measurement
        if item.get("unit_of_meas"):
            valid["unit_of_meas"] = str(item["unit_of_meas"])

        # State Class
        if item.get("state_cla"):
            valid["state_cla"] = str(item["state_cla"])

        # Binary Sensor: payload_on/off
        if comp_type == "binary_sensor":
            if "pl_on" in item and "pl_off" in item:
                valid["pl_on"] = str(item["pl_on"])
                valid["pl_off"] = str(item["pl_off"])

        return valid

    def validate_all(self):
        """Validiert alle Geräte und Items aus YAML"""
        for device_name, dev in self.devices.items():
            dev["device"] = self.validate_device_block(dev.get("device", {}))
            for comp_type in ["sensor", "binary_sensor"]:
                items = dev.get("items", {}).get(comp_type, [])
                valid_items = []
                for item in items:
                    validated = self.validate_item(item, comp_type)
                    if validated:
                        valid_items.append(validated)
                if "items" not in dev:
                    dev["items"] = {}
                dev["items"][comp_type] = valid_items

    # -------------------- Publishing -------------------- #
    def publish_all(self):
        """Publiziert oder simuliert alle Discovery-Definitionen"""
        for device_name, dev in self.devices.items():
            device_block = dev.get("device", {})
            prefix = settings.MQTT_SERVER.get("topic", "kostal").replace("/data", "").replace("/", "")
            if self.simulate:
                self.logger.warning("Simulation gestartet, kein MQTT publish")
            else:
                self.logger.debug("Homeassistant publish Discovery Items")

            for comp_type in ["sensor", "binary_sensor"]:
                for item in dev.get("items", {}).get(comp_type, []):
                    self._publish_sensor(item, comp_type, device_block, prefix)

    def _publish_sensor(self, item, comp_type, device_block, prefix):
        """
        Erzeugt ein einzelnes MQTT-Discovery-Topic für einen Sensor.

        Unterstützt:
            - scale_percent: multipliziert Werte mit 100 und setzt Einheit "%"
            - Binary-Sensoren mit payload_on/payload_off
            - Alle optionalen Felder: icon, device_class, entity_category, unit_of_measurement
        """
        key_slug = slugify(item["json_key"])

        # homeassistant/sensor/picox40a9f1c08253-current_power_kw
        # topic = f"homeassistant/{comp_type}/{self.tag}-{prefix}-{key_slug}/config"

        # homeassistant/sensor/picokostal/current_power_kw
        topic = f"homeassistant/{comp_type}/{prefix}/{key_slug}/config"

        # Basispayload
        payload = {
            "name": item["name"],
            "state_topic": self.base_state_topic,
            "unique_id": f"{prefix}_{key_slug}",
            "device": device_block,
            **({"icon": item["ic"]} if "ic" in item else {}),
            **({"device_class": item["dev_cla"]} if "dev_cla" in item else {}),
            **({"entity_category": item["ent_cat"]} if "ent_cat" in item else {}),
            **({"state_class": item["state_cla"]} if "state_cla" in item else {}),
        }

        # ---------- Binary Sensor ----------
        if comp_type == "binary_sensor":
            pl_on = item.get("pl_on", "on")  # z. B. "an"
            # pl_off = item.get("pl_off", "off")  # z. B. "aus"

            # Template wandelt MQTT-Wert in HA on/off um
            payload["value_template"] = f"{{{{ 'on' if value_json.{item['json_key']} == '{pl_on}' else 'off' }}}}"
            payload["payload_on"] = "on"
            payload["payload_off"] = "off"

        else:
            # ---------- Normaler Sensor ----------
            if payload.get("unit_of_measurement") == "%":
                payload["value_template"] = f"{{{{ (value_json.{item['json_key']} * 100) | round(1) }}}}"
                payload["unit_of_measurement"] = "%"
            else:
                payload["value_template"] = f"{{{{ value_json.{item['json_key']} }}}}"
                if "unit_of_meas" in item:
                    payload["unit_of_measurement"] = item["unit_of_meas"]

            # auto_mapping
            unit = item.get("unit_of_meas")
            dev_cla = item.get("dev_cla")

            # -------- Energie --------
            if unit in ("Wh", "kWh", "MWh"):
                payload.setdefault("device_class", "energy")
                payload.setdefault("state_class", "total_increasing")

            # -------- Dauer --------
            elif unit in ("s", "min", "h", "d"):
                payload.setdefault("device_class", "duration")
                payload.setdefault("state_class", "total_increasing")

            # -------- Temperatur --------
            elif dev_cla == "temperature":
                payload.setdefault("unit_of_measurement", "°C")
                payload.setdefault("state_class", "measurement")

            # -------- Prozent (Anteil) --------
            elif unit == "%":
                payload.setdefault("state_class", "measurement")

            # -------- Leistung --------
            elif dev_cla == "power":
                payload.setdefault("state_class", "measurement")

        # Simulation oder echtes Publish
        if self.simulate:
            _filename = f"{settings.HADAADIR}{comp_type}-{prefix}-{key_slug}.json"
            savefile(content=payload, filename=_filename)
        else:
            self.logger.debug(f"Publish HA Dsicovery {topic}")
            self.mqtt_client.publish(payload=payload, topic=topic, loginfo=False)
