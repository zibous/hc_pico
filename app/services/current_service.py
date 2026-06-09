# app/services/current_service.py
import math
import os
import sqlite3
from datetime import datetime

class CurrentService:
    def _get_isolated_db(self, db_path: str):
        conn = sqlite3.connect(db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def get_current_data(self) -> dict:
        from app.core.config import KOSTAL_SENSOR, DB_PATH

        conn = self._get_isolated_db(DB_PATH)
        row = conn.execute("SELECT * FROM pv_readings ORDER BY timestamp DESC LIMIT 1").fetchone()
        conn.close()

        if not row:
            return {}

        r = dict(row)
        current_mode = r.get("mode", "")
        is_producing = (current_mode == "Einspeisen MPP")

        total_kwh = r.get("total_energy", 0)
        co2_saved_kg = round(total_kwh * 0.22, 2)

        pdc_string1_ost = round(r.get("string1_voltage", 0) * r.get("string1_ampere", 0), 2)
        pdc_string2_west = round(r.get("string2_voltage", 0) * r.get("string2_ampere", 0), 2)
        total_dc_w = pdc_string1_ost + pdc_string2_west
        total_ac_w = r.get("gesamtleistung", 0)

        wr_efficiency = 0.0
        loss_w = 0.0
        if is_producing and total_dc_w > 50:
            wr_efficiency = round((total_ac_w / total_dc_w) * 100, 2)
            wr_efficiency = min(wr_efficiency, 100.0)
            loss_w = round(max(total_dc_w - total_ac_w, 0), 2)

        l1_p = r.get("l1_power", 0)
        l2_p = r.get("l2_power", 0)
        l3_p = r.get("l3_power", 0)
        powers = [l1_p, l2_p, l3_p]

        if is_producing:
            schieflast_w = round(max(powers) - min(powers), 2)
            netz_symmetrie = "perfekt" if schieflast_w < 100 else "gut" if schieflast_w < 1000 else "asymmetrisch"
        else:
            schieflast_w = 0.0
            netz_symmetrie = "standby"

        pf = r.get("powerfactor", 1.0)
        if is_producing and pf > 0:
            scheinleistung_va = round(total_ac_w / pf, 2)
            try:
                blindleistung_var = round(math.sqrt(max(scheinleistung_va**2 - total_ac_w**2, 0)), 2)
            except ValueError:
                blindleistung_var = 0.0
        else:
            scheinleistung_va = 0.0
            blindleistung_var = 0.0
            pf = 1.0

        p_stc_kwp = KOSTAL_SENSOR.get("P_STC", 5000) / 1000
        current_capacity_utilization = round((total_ac_w / (p_stc_kwp * 1000)) * 100, 1) if is_producing and p_stc_kwp > 0 else 0.0

        string_ratio_ost_pct = round((pdc_string1_ost / total_dc_w) * 100, 1) if is_producing and total_dc_w > 10 else 0.0
        string_ratio_west_pct = round((pdc_string2_west / total_dc_w) * 100, 1) if is_producing and total_dc_w > 10 else 0.0

        # Rückgabe mit ultrakurzer Struktur
        return {
            "timestamp": r.get("timestamp"),
            "date": r.get("date"),
            "time": r.get("time"),
            "aktiv": r.get("aktiv"),
            "mode": current_mode,
            "current_power_w": r.get("current_power", 0),
            "current_power_kw": r.get("current_power_kw", 0),
            "daily_energy_kwh": r.get("daily_energy", 0),
            "total_energy_kwh": total_kwh,
            "pv_ost_w": r.get("pv_actual_ost", 0),
            "pv_west_w": r.get("pv_actual_west", 0),
            "gesamtleistung_w": total_ac_w,
            "l1_voltage": r.get("output_l1_voltage", 0),
            "l1_ampere": r.get("string1_ampere", 0),
            "l1_power": l1_p,
            "string1_voltage": r.get("string1_voltage", 0),
            "l2_voltage": r.get("output_l2_voltage", 0),
            "l2_ampere": r.get("string2_ampere", 0),
            "l2_power": l2_p,
            "string2_voltage": r.get("string2_voltage", 0),
            "l3_voltage": r.get("output_l3_voltage", 0),
            "l3_ampere": r.get("string3_ampere", 0),
            "l3_power": l3_p,
            "powerfactor": pf,
            "perf": {
                "utilization_pct": min(current_capacity_utilization, 100.0),
                "specific_yield_total": round(total_kwh / p_stc_kwp, 1) if p_stc_kwp > 0 else 0.0,
                "specific_yield_today": round(r.get("daily_energy", 0) / p_stc_kwp, 2) if p_stc_kwp > 0 else 0.0,
                "strings": {
                    "ost_w": pdc_string1_ost,
                    "west_w": pdc_string2_west,
                    "share_ost_pct": string_ratio_ost_pct,
                    "share_west_pct": string_ratio_west_pct
                }
            },
            "env": {
                "co2_kg": co2_saved_kg,
                "co2_tons": round(co2_saved_kg / 1000, 3),
                "trees": round(co2_saved_kg / 10, 1),
                "car_km": round(total_kwh * 6.5, 1)
            },
            "wr": {
                "dc_total_w": round(total_dc_w, 2),
                "efficiency_pct": wr_efficiency,
                "loss_w": loss_w
            },
            "grid": {
                "imbalance_w": schieflast_w,
                "status": netz_symmetrie,
                "apparent_va": scheinleistung_va,
                "reactive_var": blindleistung_var
            }
        }
