# -*- coding: utf-8 -*-
"""
Theoretische PV-Berechnung

Berechnet die theoretische PV-Momentanleistung und Tagesenergie
basierend auf Sonnenstand und installierten Panelleistungen.
"""

import os
import json
import math
from datetime import datetime, timezone, timedelta
from app.integrations.kostal.models import PVConfig, PVModelParameters

class PikoPVModel:
    def __init__(self, config_dict, logger):
        self.logger = logger
        # Konfiguration direkt beim Start via Pydantic validieren
        self.config = PVConfig(**config_dict)
        self.model_file = config_dict.get("PVHisData", "./config/pv_model.json")

    def load_model(self) -> PVModelParameters:
        """Lädt die Parameter des PV-Modells typsicher."""
        if not os.path.exists(self.model_file):
            return PVModelParameters()
        try:
            with open(self.model_file, "r") as f:
                data = json.load(f)
                return PVModelParameters(**data)
        except (OSError, json.JSONDecodeError) as e:
            self.logger.warning("pv_model.json nicht lesbar (%s), nutze Defaults", e)
            return PVModelParameters()

    def calculate_theoretical_power(self, steps=96):
        """
        Berechnet die theoretische PV-Momentanleistung und Tagesenergie
        basierend auf Sonnenstand und installierten Panelleistungen.

        Keine lernenden Parameter — rein physikalische Berechnung:
        - Sonnendeklination nach Spencer
        - Stundenwinkel für Sonnenaufgang/-untergang
        - Sinuskurve als Näherung für den Tagesverlauf
        - Ost-Panel: Peakleistung am Vormittag
        - West-Panel: Peakleistung am Nachmittag
        - Systemwirkungsgrad (Wechselrichter + Leitungen + Verschmutzung)
        """
        try:
            lat = self.config.latitude
            lon = self.config.longitude
            tz_name = self.config.timezone

            try:
                import zoneinfo
                tz = zoneinfo.ZoneInfo(tz_name)
            except Exception:
                tz = timezone(timedelta(hours=2))

            now = datetime.now(tz)
            day_of_year = now.timetuple().tm_yday

            # Zeitgleichung (Equation of Time) & Längengrad-Korrektur für wahren Mittag
            b = math.radians((360 / 365) * (day_of_year - 81))
            eot = 9.87 * math.sin(2 * b) - 7.53 * math.cos(b) - 1.5 * math.sin(b)

            utc_offset = now.utcoffset()
            tz_offset_h = utc_offset.total_seconds() / 3600 if utc_offset else 2.0
            local_meridian = tz_offset_h * 15.0
            time_corr_min = 4.0 * (lon - local_meridian) + eot

            # Sonnendeklination (Spencer-Näherung)
            decl = 23.44 * math.sin(b)

            # Stundenwinkel bei Sonnenaufgang/-untergang
            cos_ha = -math.tan(math.radians(lat)) * math.tan(math.radians(decl))
            cos_ha = max(-1.0, min(1.0, cos_ha))   # Clamp für Polarnacht/Mitternachtssonne
            hour_angle = math.degrees(math.acos(cos_ha))

            # Sonnenaufgang / Untergang unter Einbeziehung des Längengrads
            sunrise_h = 12.0 - (hour_angle / 15.0) - (time_corr_min / 60.0)
            sunset_h  = 12.0 + (hour_angle / 15.0) - (time_corr_min / 60.0)
            daylight_h = max(0.01, sunset_h - sunrise_h)

            # STC-Nennleistung in kW direkt aus dem Modell ziehen
            pv_ost_kw  = self.config.pv_ost.P_STC * 0.001
            pv_west_kw = self.config.pv_west.P_STC * 0.001

            # Modell-Lernparameter via Pydantic laden
            model_params = self.load_model()
            eta       = model_params.eta
            exponent  = model_params.exponent
            shift_ost = model_params.shift_ost
            shift_west = model_params.shift_west

            # Aktuelle relative Tageszeit (0 = Sonnenaufgang, 1 = Sonnenuntergang)
            current_local_hour = now.hour + now.minute / 60.0 + now.second / 3600.0
            t_now = (current_local_hour - sunrise_h) / daylight_h

            def pv_curve(t, shift):
                """Sinuskurve über den Tag unter Beachtung der harten Tagesgrenzen (Spike-Schutz)."""
                if t <= 0.0 or t >= 1.0 or (t + shift) <= 0.0 or (t + shift) >= 1.0:
                    return 0.0
                return math.pow(math.sin(math.pi * (t + shift)), exponent)

            # Momentanleistung [kW] absolut zeitsicher berechnen
            p_ost_now   = pv_ost_kw  * pv_curve(t_now, shift_ost)  * eta
            p_west_now  = pv_west_kw * pv_curve(t_now, shift_west) * eta
            p_total_now = round(p_ost_now + p_west_now, 3)

            # Tagesenergie durch numerische Integration [kWh]
            def integrate_day(p_stc_kw, shift):
                dt = daylight_h / steps
                energy = 0.0
                for i in range(steps):
                    t = i / steps
                    energy += p_stc_kw * pv_curve(t, shift) * dt * eta
                return energy

            energy_ost   = integrate_day(pv_ost_kw,  shift_ost)
            energy_west  = integrate_day(pv_west_kw, shift_west)
            energy_total = round(energy_ost + energy_west, 2)

            return {
                "pv_ost":              round(p_ost_now,  3),
                "pv_west":             round(p_west_now, 3),
                "total":               p_total_now,
                "solar_time":          round(t_now, 4),
                "solar_factor_ost":    round(pv_curve(t_now, shift_ost),  4),
                "solar_factor_west":   round(pv_curve(t_now, shift_west), 4),
                "energy_ost_kwh":      round(energy_ost, 2),
                "energy_west_kwh":     round(energy_west, 2),
                "energy_total_kwh":    energy_total
            }

        except Exception as e:
            self.logger.error("Fehler bei PV-Berechnung: %s", e)
            return {
                "pv_ost": 0.0, "pv_west": 0.0, "total": 0.0, "solar_time": 0.0,
                "solar_factor_ost": 0.0, "solar_factor_west": 0.0,
                "energy_ost_kwh": 0.0, "energy_west_kwh": 0.0, "energy_total_kwh": 0.0
            }
