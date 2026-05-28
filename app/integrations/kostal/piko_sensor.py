# -*- coding: utf-8 -*-
"""
PikoSensor — Orchestrierung für den Kostal Piko Wechselrichter.

Refactored: Die monolithische Klasse wurde in spezialisierte Module aufgeteilt:
- models.py         → Pydantic-Datenmodelle (typsicher)
- calculator.py     → Statische Berechnungen (Leistungsfaktoren, Laufzeit, Analytics)
- pv_model.py       → Theoretische PV-Berechnung (Sonnenstand)
- history_tracker.py → Historien-Verwaltung mit Spike-Schutz
- html_parser.py    → HTML-Parsing des Wechselrichter-Webinterfaces

Diese Klasse bleibt die öffentliche API (rückwärtskompatibel zum Controller).
"""

import requests
from datetime import datetime, timezone

from app.core.logging import setup_logger
from app.integrations.kostal.models import GeneratorData, AdvancedAnalytics
from app.integrations.kostal.calculator import PikoCalculator
from app.integrations.kostal.pv_model import PikoPVModel
from app.integrations.kostal.history_tracker import PikoHistoryTracker
from app.integrations.kostal.html_parser import PikoHtmlParser


class PikoSensor:
    """
    Klasse zum Auslesen eines Kostal Piko Wechselrichters.

    Öffentliche API:
        - update() → dict | None
    """

    def __init__(self, config: dict, data: dict):
        self.logger = setup_logger(self.__class__.__name__)
        self.config = config
        self.data = data

        self.status = "Offline"
        self.dataready = False

        # Sub-Module instanziieren
        self.pv_model = PikoPVModel(config, self.logger)
        self.history_tracker = PikoHistoryTracker(config, self.logger)

    # ---------------------------------------------------------
    # Hauptupdate (rückwärtskompatibel zum Controller)
    # ---------------------------------------------------------
    def update(self) -> dict | None:
        """
        Hauptfunktion: Ruft Daten ab, berechnet Werte und aktualisiert Historie.

        Returns:
            dict mit allen Sensordaten oder None bei Fehler.
        """
        self.dataready = False
        self.logger.info("Pikodaten werden abgerufen: %s", self.config["base_url"])

        # --- HTTP-Request zum Wechselrichter ---
        user = self.config["user"]
        password = self.config["password"]

        if not user or not password:
            self.logger.error("Fehlende Zugangsdaten für Wechselrichter")
            return None

        try:
            r = requests.get(
                self.config["base_url"],
                auth=(user, password),
                timeout=15,
            )
            r.raise_for_status()
        except Exception:
            self.logger.exception("Fehler beim Abrufen der Piko-Daten")
            return None

        # --- HTML parsen ---
        parsed = PikoHtmlParser.parse_inverter_page(r.content)

        if not parsed or not parsed.get("generator"):
            self.logger.warning("Kostal Device liefert keine Daten")
            return None

        # --- Ergebnis-Dictionary aufbauen ---
        result = self.data
        result["mode"] = parsed["status"]
        self.status = result["mode"]

        # Werte aus Parser übernehmen
        result["current_power"] = parsed["current_power"]
        result["current_power_kw"] = round(parsed["current_power"] * 0.001, 2)
        result["total_energy"] = parsed["total_energy"]
        result["daily_energy"] = parsed["daily_energy"]

        # PLAUSIBILITÄTSPRÜFUNG
        max_daily = float(self.config.get("max_daily_kwh", 50.0))
        max_power = float(self.config.get("max_power_w", 10000.0))

        if result["daily_energy"] < 0 or result["daily_energy"] > max_daily:
            self.logger.warning(
                f"[PLAUSIBILITÄT] daily_energy={result['daily_energy']} kWh "
                f"außerhalb 0–{max_daily} → verworfen"
            )
            return None

        if result["current_power"] < 0 or result["current_power"] > max_power:
            self.logger.warning(
                f"[PLAUSIBILITÄT] current_power={result['current_power']} W "
                f"außerhalb 0–{max_power} → verworfen"
            )
            return None

        # SPIKE-SCHUTZ: WR liefert alten Tagesertrag bei current_power=0
        if result["daily_energy"] > 1.0 and result["current_power"] == 0:
            self.logger.warning(
                f"[SPIKE-SCHUTZ] daily_energy={result['daily_energy']} kWh bei "
                f"current_power=0 W → WR-Aufwach-Artefakt verworfen"
            )
            return None

        # --- Generator-Daten via Pydantic validieren ---
        gen_raw = parsed["generator"]
        # Status aus dem Modus übernehmen
        gen_raw["status"] = result["mode"]

        # Werte bei ausgeschaltetem WR auf 0 setzen
        if result["mode"] == self.config.get("state_off", "off"):
            for key in gen_raw:
                if key != "status":
                    gen_raw[key] = 0.0

        generator_model = GeneratorData(**gen_raw)

        # Gesamtleistung berechnen
        generator_model.gesamtleistung = round(
            generator_model.l1_power + generator_model.l2_power + generator_model.l3_power, 2
        )

        result["aktiv"] = "on" if result["mode"] != self.config.get("state_off", "off") else "off"

        # --- Leistungsfaktoren berechnen ---
        if result["aktiv"] == "on":
            generator_model = PikoCalculator.calculate_power_factors(generator_model)

        # --- Erweiterte Analysen ---
        advanced_data = PikoCalculator.calculate_advanced_analytics(
            generator_model, result["daily_energy"]
        )
        generator_model.analytics = AdvancedAnalytics(**advanced_data)

        # Generator-Daten ins Ergebnis schreiben
        result["generator"] = generator_model.model_dump()

        # --- PV Ost/West aus DC-String-Leistung ---
        s1_v = generator_model.string1_voltage
        s1_a = generator_model.string1_ampere
        s2_v = generator_model.string2_voltage
        s2_a = generator_model.string2_ampere

        pv_ost = round(s1_v * s1_a, 2)
        pv_west = round(s2_v * s2_a, 2)

        # --- Theoretische PV-Berechnung ---
        theoretical = self.pv_model.calculate_theoretical_power()

        result["power"] = {
            "theoretical": theoretical,
            "actual": {
                "pv_ost": pv_ost,
                "pv_west": pv_west,
                "total": round(pv_ost + pv_west, 2),
            },
        }

        theoretical_total = theoretical.get("total", 0.0)
        result["power_factor_theoretical"] = (
            round(result["current_power_kw"] / theoretical_total, 2) if theoretical_total > 0 else 0.0
        )

        # --- Laufzeit ---
        result["runningtime"] = PikoCalculator.calculate_running_time(self.config.get("installed"))

        # --- Historie aktualisieren ---
        result["total"] = self.history_tracker.update_metrics(result["daily_energy"])

        # --- Zeitstempel ---
        now = datetime.now()
        iso_year, iso_week, _ = now.isocalendar()

        result.update(
            {
                "time": now.strftime("%H:%M"),
                "date": now.strftime("%Y-%m-%d"),
                "week": f"{iso_year}W{iso_week:02d}",
                "month": now.strftime("%Y-%m"),
                "year": now.strftime("%Y"),
                "periode": now.strftime("%Y-%m-%d"),
                "last_update": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            }
        )

        if result["aktiv"] == "off":
            self.logger.info("Kostal Device ist ausgeschaltet")

        self.dataready = True
        return result
