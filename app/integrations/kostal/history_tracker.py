# -*- coding: utf-8 -*-
"""
History Tracker für Kostal Piko Wechselrichter.

Verwaltet historische Energieintervalle (hour, day, week, month, year)
mit integriertem Spike- und Zähler-Reset-Schutz.
"""

import os
import json
from datetime import datetime

from app.integrations.kostal.models import HistoryMetrics


class PikoHistoryTracker:
    def __init__(self, config_dict: dict, logger):
        self.logger = logger
        self.config_dict = config_dict
        self.history_file = config_dict.get("historyfile", "./data/history.json")
        os.makedirs(os.path.dirname(self.history_file), exist_ok=True)

    def load_history(self) -> HistoryMetrics:
        """Lädt die Historie typsicher in ein Pydantic-Modell."""
        if not os.path.exists(self.history_file):
            return HistoryMetrics()
        try:
            with open(self.history_file, "r") as f:
                data = json.load(f)
                return HistoryMetrics(**data)
        except (OSError, json.JSONDecodeError):
            return HistoryMetrics()

    def save_history(self, history_model: HistoryMetrics):
        """Speichert das Pydantic-Modell der Historie als JSON ab."""
        tmp = self.history_file + ".tmp"
        try:
            with open(tmp, "w") as f:
                json.dump(history_model.model_dump(), f, indent=2)
            os.replace(tmp, self.history_file)
        except OSError as e:
            self.logger.error("history.json nicht schreibbar: %s", e)

    def update_metrics(self, daily_energy) -> dict:
        """Aktualisiert historische Zählerintervalle mit vollständigem Spike-Schutz."""
        if not daily_energy:
            return self.load_history().model_dump()

        now = datetime.now()
        history = self.load_history()

        last_current = history.power_day
        last_update = history.last_update

        delta = 0.0
        is_new_day = False
        is_counter_reset = False

        if last_update:
            last_update_dt = datetime.fromisoformat(last_update)

            # Zeit-Intervalle bei Wechsel nullen
            if now.day != last_update_dt.day:
                history.power_day = 0.0
                history.power_hour = 0.0  # Ein neuer Tag nullt IMMER auch die Stunde
                is_new_day = True

            if now.hour != last_update_dt.hour:
                history.power_hour = 0.0
            if now.isocalendar() != last_update_dt.isocalendar():
                history.power_week = 0.0
            if now.month != last_update_dt.month:
                history.power_month = 0.0
            if now.year != last_update_dt.year:
                history.power_year = 0.0

        # ZÄHLER-RESETS ERKENNEN (Wechselrichter-Neustart unter tags)
        if daily_energy < last_current and not is_new_day:
            self.logger.warning(
                f"[ZÄHLER-RESET] Wechselrichter wurde offenbar neu gestartet. "
                f"Letzter Wert: {last_current} kWh, Neuer Wert: {daily_energy} kWh. Setze Basis zurück."
            )
            last_current = 0.0
            is_counter_reset = True

        # DELTA-BERECHNUNG NACH SZENARIO
        if is_new_day or is_counter_reset:
            delta = daily_energy
        else:
            delta = round(daily_energy - last_current, 2)

        if delta < 0:
            delta = 0.0

        # SPIKE-SCHUTZ: Max. erlaubtes Delta pro Intervall (kWh)
        max_delta = float(self.config_dict.get("max_delta_kwh", 2.0))

        if last_update:
            time_since_last_update = now - last_update_dt
            if time_since_last_update.total_seconds() > 7200:
                self.logger.warning(
                    f"[SPIKE-SCHUTZ] Letztes Update ist zu lange her ({time_since_last_update}). "
                    f"Verwerfe Delta von {delta} kWh für Kurzzeit-Historie."
                )
                delta = 0.0

        if delta > max_delta:
            self.logger.warning(
                f"[SPIKE-SCHUTZ] Delta {delta} kWh blockiert (max erlaubt: {max_delta}). "
                f"daily_energy={daily_energy}, last_current={last_current}"
            )
            delta = 0.0

        self.logger.debug(f"Sicheres Delta Energie Wert: {delta}")

        # Delta auf historische Intervalle aufaddieren
        history.power_hour = round(history.power_hour + delta, 2)
        history.power_week = round(history.power_week + delta, 2)
        history.power_month = round(history.power_month + delta, 2)
        history.power_year = round(history.power_year + delta, 2)

        # Aktuellen Wert und Zeitstempel fixieren
        history.power_day = daily_energy
        history.last_update = now.isoformat(timespec="seconds")

        self.save_history(history)
        return history.model_dump()
