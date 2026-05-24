# -*- coding: utf-8 -*-
"""
PikoSensor-Klasse

Diese Version erfasst Kostal Piko-Wechselrichterdaten und berechnet:
- Leistungsfaktoren
- Theoretische PV-Leistung (Ost/West)
- Historie (hour/day/week/month/year)
- Laufzeit
- HomeAssistant-kompatible Zeitstempel

"""

import os
import json
import requests
import math
from datetime import datetime, timezone, timedelta
from lxml import html
from app.core.logging import setup_logger
from app.services.utillib import deep_get


class PikoSensor:
    """
    Klasse zum Auslesen eines Kostal Piko Wechselrichters.
    """

    def __init__(self, config, data):
        self.logger = setup_logger(self.__class__.__name__)
        self.historyfile = config.get("historyfile", "./data/history.json")
        os.makedirs(os.path.dirname(self.historyfile), exist_ok=True)

        self.config = config
        self.data = data

        self.status = "Offline"
        self.dataready = False

    # ---------------------------------------------------------
    # Hilfsfunktionen
    # ---------------------------------------------------------

    def calculate_power_factors(self):
        """Berechnet AC-Leistungsfaktoren pro Phase (cos phi = P / S)."""
        gen = self.data.get("generator", {})

        for phase in range(1, 4):
            # AC-Spannung und AC-Strom für Scheinleistung S = U * I
            # Näherung: string_ampere als AC-Strom (Piko gibt keinen separaten AC-Strom aus)
            voltage = deep_get(self.data, f"generator.output_l{phase}_voltage", 0.0, as_float=True)
            current = deep_get(self.data, f"generator.string{phase}_ampere",    0.0, as_float=True)
            power   = deep_get(self.data, f"generator.l{phase}_power",          0.0, as_float=True)
            apparent = voltage * current
            gen[f"powerfactor_l{phase}"] = round(power / apparent, 3) if apparent > 0 else 0.0

        pf_values = [gen[f"powerfactor_l{i}"] for i in range(1, 4) if gen[f"powerfactor_l{i}"] > 0]
        gen["powerfactor"] = round(sum(pf_values) / len(pf_values), 3) if pf_values else 0.0

    def calc_RunningTime(self):
        """Berechnet die Laufzeit seit Installation."""
        now = datetime.now()
        duration = now - self.config["installed"]
        total_seconds = duration.total_seconds()

        days, rem = divmod(total_seconds, 86400)
        hours, rem = divmod(rem, 3600)
        minutes, seconds = divmod(rem, 60)

        return {
            "running": f"{int(days)} days, {int(hours)} hours, {int(minutes)} minutes and {int(seconds)} seconds",
            "days": int(days),
            "hours": int(total_seconds // 3600),
        }

    def load_pv_model(self):
        _file = deep_get(self.config, "PVHisData", "./config/pv_model.json", as_float=False)
        defaults = {
            "exponent": 1.8, "peak_scale": 1.2,
            "shift_ost": -1.0, "shift_west": 1.0,
            "ost_weight": 0.5, "west_weight": 0.5,
        }
        if not os.path.exists(_file):
            return defaults
        try:
            with open(_file, "r") as f:
                return json.load(f)
        except (OSError, json.JSONDecodeError) as e:
            self.logger.warning("pv_model.json nicht lesbar (%s), nutze Defaults", e)
            return defaults

    def save_pv_model(self, model):
        _file = deep_get(self.config, "PVHisData", "./config/pv_model.json", as_float=False)
        try:
            with open(_file, "w") as f:
                json.dump(model, f, indent=2)
        except OSError as e:
            self.logger.warning("pv_model.json nicht schreibbar: %s", e)

    # ---------------------------------------------------------
    # Theoretische PV-Berechnung
    # ---------------------------------------------------------
    def calculate_theoretical_power_dual(self, steps=96):
        """
        Berechnet die theoretische PV-Momentanleistung und Tagesenergie
        basierend auf Sonnenstand und installierten Panelleistungen.

        Keine lernenden Parameter — rein physikalische Berechnung:
        - Sonnendeklination nach Spencer
        - Stundenwinkel für Sonnenaufgang/-untergang
        - Sinuskurve als Näherung für den Tagesverlauf
        - Ost-Panel: Peakleistung am Vormittag (shift -1.5h)
        - West-Panel: Peakleistung am Nachmittag (shift +1.5h)
        - Systemwirkungsgrad 80% (Wechselrichter + Leitungen + Verschmutzung)
        """
        try:
            lat      = deep_get(self.config, "latitude",  47.46, as_float=True)
            tz_name  = deep_get(self.config, "timezone", "Europe/Vaduz")

            try:
                import zoneinfo
                tz = zoneinfo.ZoneInfo(tz_name)
            except Exception:
                from datetime import timezone as _tz
                tz = _tz(timedelta(hours=2))

            now          = datetime.now(tz)
            day_of_year  = now.timetuple().tm_yday

            # UTC-Offset in Stunden (berücksichtigt Sommer-/Winterzeit)
            utc_offset   = now.utcoffset()
            tz_offset_h  = utc_offset.total_seconds() / 3600 if utc_offset else 2.0

            # Sonnendeklination (Spencer-Näherung)
            decl = 23.44 * math.sin(math.radians((360 / 365) * (day_of_year - 81)))

            # Stundenwinkel bei Sonnenaufgang/-untergang
            cos_ha = -math.tan(math.radians(lat)) * math.tan(math.radians(decl))
            cos_ha = max(-1.0, min(1.0, cos_ha))   # Clamp für Polarnacht/Mitternachtssonne
            hour_angle = math.degrees(math.acos(cos_ha))

            sunrise_h    = 12.0 - hour_angle / 15.0 + tz_offset_h
            sunset_h     = 12.0 + hour_angle / 15.0 + tz_offset_h
            daylight_h   = max(0.01, sunset_h - sunrise_h)

            sunrise = now.replace(
                hour=int(sunrise_h),
                minute=int((sunrise_h % 1) * 60),
                second=0, microsecond=0
            )
            sunset = now.replace(
                hour=min(int(sunset_h), 23),
                minute=int((sunset_h % 1) * 60),
                second=0, microsecond=0
            )

            # STC-Nennleistung in kW
            pv_ost_kw  = deep_get(self.config, "pv_ost.P_STC",  2500, as_float=True) * 0.001
            pv_west_kw = deep_get(self.config, "pv_west.P_STC", 2500, as_float=True) * 0.001

            # Systemwirkungsgrad — kalibriert aus realen Daten
            # Beste Sommertage: 46 kWh real / 51 kWh theo = 0.91
            eta = 0.91

            # Normierte Tageszeit 0..1 (0 = Sonnenaufgang, 1 = Sonnenuntergang)
            t_now = (now.hour + now.minute / 60.0 - sunrise_h) / daylight_h

            # Ost-Panel: Peak ~2h nach Sonnenaufgang (shift = -0.15 normiert)
            # West-Panel: Peak ~2h vor Sonnenuntergang (shift = +0.15 normiert)
            shift_ost  = -0.15
            shift_west = +0.15

            def pv_curve(t):
                """Sinuskurve 0..1 über den Tag, 0 ausserhalb Tageslicht."""
                if t <= 0 or t >= 1:
                    return 0.0
                return math.sin(math.pi * t)

            # Momentanleistung [kW]
            p_ost_now  = pv_ost_kw  * pv_curve(t_now + shift_ost)  * eta
            p_west_now = pv_west_kw * pv_curve(t_now + shift_west) * eta
            p_total_now = round(p_ost_now + p_west_now, 3)

            # Tagesenergie durch numerische Integration [kWh]
            def integrate_day(p_stc_kw, shift):
                dt    = daylight_h / steps
                energy = 0.0
                for i in range(steps):
                    t = i / steps
                    energy += p_stc_kw * pv_curve(t + shift) * dt * eta
                return energy

            energy_ost  = integrate_day(pv_ost_kw,  shift_ost)
            energy_west = integrate_day(pv_west_kw, shift_west)
            energy_total = round(energy_ost + energy_west, 2)

            return {
                "pv_ost":              round(p_ost_now,  3),
                "pv_west":             round(p_west_now, 3),
                "total":               p_total_now,
                "solar_time":          round(t_now, 4),
                "solar_factor_ost":    round(pv_curve(t_now + shift_ost),  4),
                "solar_factor_west":   round(pv_curve(t_now + shift_west), 4),
                "sunrise":             sunrise.isoformat(timespec="seconds"),
                "sunset":              sunset.isoformat(timespec="seconds"),
                "daily_energy_kWh":    energy_total,
                "daylight_hours":      round(daylight_h, 2),
                "eta":                 eta,
            }

        except Exception:
            self.logger.exception("PV-Berechnung fehlgeschlagen")
            return {
                "pv_ost": 0.0, "pv_west": 0.0, "total": 0.0,
                "solar_time": 0.0, "solar_factor_ost": 0.0, "solar_factor_west": 0.0,
                "sunrise": None, "sunset": None,
                "daily_energy_kWh": 0.0, "daylight_hours": 0.0, "eta": 0.0,
            }

    # ---------------------------------------------------------
    # Historie
    # ---------------------------------------------------------
    def load_history(self):
        """Lädt die Historie aus Datei."""
        defaults = {
            "power_hour": 0.0, "power_day": 0.0,
            "power_week": 0.0, "power_month": 0.0,
            "power_year": 0.0, "last_update": None,
        }
        try:
            with open(self.historyfile, "r") as f:
                return json.load(f)
        except (OSError, json.JSONDecodeError) as e:
            self.logger.warning("history.json nicht lesbar (%s), starte neu", e)
            return defaults

    def save_history(self, history):
        """Speichert die Historie atomisch (kein Datenverlust bei Absturz)."""
        tmp = self.historyfile + ".tmp"
        try:
            with open(tmp, "w") as f:
                json.dump(history, f, indent=2)
            os.replace(tmp, self.historyfile)
        except OSError as e:
            self.logger.error("history.json nicht schreibbar: %s", e)

    def update_history(self, daily_energy):
        """Aktualisiert die Energiehistorie."""
        history = self.load_history()
        now = datetime.now()

        last_update = deep_get(history, "last_update")
        last_current = deep_get(history, "power_day", 0.0, as_float=True)

        if daily_energy:
            if last_update:
                last_update_dt = datetime.fromisoformat(last_update)

                if now.hour != last_update_dt.hour:
                    history["power_hour"] = 0.0
                if now.day != last_update_dt.day:
                    history["power_day"] = 0.0
                if now.isocalendar()[1] != last_update_dt.isocalendar()[1]:
                    history["power_week"] = 0.0
                if now.month != last_update_dt.month:
                    history["power_month"] = 0.0
                if now.year != last_update_dt.year:
                    history["power_year"] = 0.0

            delta = max(0.0, round(daily_energy - last_current, 2))
            self.logger.debug(f"Delta Energie Wert: {delta}")

            for key in ["power_hour", "power_week", "power_month", "power_year"]:
                history[key] = round(history.get(key, 0.0) + delta, 2)

            history["power_day"] = daily_energy

        history["last_update"] = now.isoformat(timespec="seconds")
        self.save_history(history)
        return history

    # ---------------------------------------------------------
    # Hauptupdate
    # ---------------------------------------------------------
    def update(self):
        """Hauptfunktion: Ruft Daten ab, berechnet Werte und aktualisiert Historie."""
        self.dataready = False
        self.logger.info("Pikodaten werden abgerufen: %s", self.config["base_url"])

        user = self.config["user"]
        password = self.config["password"]

        if not user or not password:
            raise ValueError("Missing credentials")

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

        response = html.fromstring(r.content)
        status = [v.text.strip() for v in response.xpath("//td[@colspan='4']")]
        data = [v.text.strip() for v in response.xpath("//td[@bgcolor='#FFFFFF']")]

        if not data or not status:
            self.logger.warning("Kostal Device liefert keine Daten")
            return None

        result = self.data
        result["mode"] = status[0]
        self.status = result["mode"]

        # Generatorwerte einlesen
        i = 3
        for field_name in result["generator"]:
            if i >= len(data):
                break
            result["generator"][field_name] = deep_get({"d": data}, f"d.{i}", 0.0, as_float=True) if result["mode"] != self.config["state_off"] else 0.0
            i += 1

        # gen = result.get("generator", {})

        result["generator"]["gesamtleistung"] = round(
            sum(deep_get(result, f"generator.l{i}_power", 0.0, as_float=True) for i in range(1, 4)),
            2,
        )

        result["aktiv"] = "on" if result["mode"] != self.config["state_off"] else "off"

        # HTML-Daten sicher auslesen
        result["current_power"] = deep_get({"d": data}, "d.0", 0.0, as_float=True)
        result["current_power_kw"] = round(result["current_power"] * 0.001, 2)
        result["total_energy"] = deep_get({"d": data}, "d.1", 0.0, as_float=True)
        result["daily_energy"] = deep_get({"d": data}, "d.2", 0.0, as_float=True)

        if result["aktiv"] == "on":
            self.calculate_power_factors()

        # PV Ost/West — aus DC-String-Leistung berechnen (String = DC-Eingang)
        # String 1 Leistung = string1_voltage * string1_ampere  → Ost
        # String 2 Leistung = string2_voltage * string2_ampere  → West
        # l1/l2/l3_power sind AC-Ausgangsphasen, nicht DC-Strings
        s1_v = deep_get(result, "generator.string1_voltage", 0.0, as_float=True)
        s1_a = deep_get(result, "generator.string1_ampere",  0.0, as_float=True)
        s2_v = deep_get(result, "generator.string2_voltage", 0.0, as_float=True)
        s2_a = deep_get(result, "generator.string2_ampere",  0.0, as_float=True)

        pv_ost  = round(s1_v * s1_a, 2)   # DC-Leistung String 1 (Ost)
        pv_west = round(s2_v * s2_a, 2)   # DC-Leistung String 2 (West)

        result["power"] = {
            "theoretical": self.calculate_theoretical_power_dual(),
            "actual": {
                "pv_ost": round(pv_ost, 2),
                "pv_west": round(pv_west, 2),
                "total": round(pv_ost + pv_west, 2),
            },
        }

        actual_total = deep_get(result, "current_power_kw", 0.0, as_float=True)
        theoretical_total = deep_get(result, "power.theoretical.total", 0.0, as_float=True)

        result["power_factor_theoretical"] = round(actual_total / theoretical_total, 2) if theoretical_total > 0 else 0.0

        result["runningtime"] = self.calc_RunningTime()
        result["total"] = self.update_history(result["daily_energy"])

        now = datetime.now()
        iso_year, iso_week, _ = now.isocalendar()

        result.update(
            {
                "time": now.strftime("%H:%M"),
                "date": now.strftime("%Y-%m-%d"),
                "week": f"{iso_year}W{iso_week:02d}",
                "month": now.strftime("%Y-%m"),
                "year":  now.strftime("%Y"),
                "periode": now.strftime("%Y-%m-%d"),
                "last_update": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            }
        )

        if result["aktiv"] == self.config["state_off"]:
            self.logger.info("Kostal Device ist ausgeschaltet")

        self.dataready = True
        return result
