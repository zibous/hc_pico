# app/services/summary_service.py
import calendar
import math
import os
import sqlite3
from datetime import datetime, date as _date

class SummaryService:
    def _get_isolated_db(self, db_path: str):
        """Öffnet die Datenbankverbindung exakt wie in deiner server.py."""
        conn = sqlite3.connect(db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA query_only=ON")
        return conn

    def _get_history_range(self, conn, period_type, from_key, to_key):
        """Originale Logikfunktion: Liefert eine Liste von Dictionaries."""
        rows = conn.execute("""
            SELECT period_type, period_key, energy_kwh, last_update
            FROM pv_history WHERE period_type = ? AND period_key BETWEEN ? AND ?
            ORDER BY period_key
        """, (period_type, from_key, to_key)).fetchall()
        return [dict(r) for r in rows]

    def get_summary_data(self, target_date_str: str = None) -> dict:
        from app.core.config import KOSTAL_SENSOR, DB_PATH

        conn = self._get_isolated_db(DB_PATH)

        if target_date_str:
            now = datetime.strptime(target_date_str, "%Y-%m-%d")
        else:
            now = datetime.now()

        today = now.strftime("%Y-%m-%d")
        this_year = now.strftime("%Y")

        # 🌟 GEFIXT: Greift jetzt wieder sicher auf das erste Listenelement [0] zu!
        def _kwh(pt, key):
            rows = self._get_history_range(conn, pt, key, key)
            return rows[0]["energy_kwh"] if rows else 0.0

        # Woche
        iso_year, iso_week, _ = now.isocalendar()
        week_monday = _date.fromisocalendar(iso_year, iso_week, 1)
        week_sunday = _date.fromisocalendar(iso_year, iso_week, 7)
        week_kwh = round(sum(r["energy_kwh"] for r in self._get_history_range(conn, "day", str(week_monday), str(week_sunday))), 1)

        # Monat
        this_month = now.strftime("%Y-%m")
        _y, _m = int(this_month[:4]), int(this_month[5:])
        month_end = f"{this_month}-{calendar.monthrange(_y, _m)[1]:02d}"
        month_kwh = round(sum(r["energy_kwh"] for r in self._get_history_range(conn, "day", f"{this_month}-01", month_end)), 1)

        # Jahr
        year_kwh = round(sum(r["energy_kwh"] for r in self._get_history_range(conn, "day", f"{this_year}-01-01", today)), 1)

        # Jahresvergleich
        year_keys_raw = conn.execute("""
            SELECT DISTINCT substr(period_key, 1, 4) as year_key
            FROM pv_history WHERE period_type = 'day' ORDER BY year_key
        """).fetchall()
        year_rows = [{"period_key": r["year_key"]} for r in year_keys_raw]
        years = []

        today_day_str = now.strftime("%m-%d")

        for r in year_rows:
            yr = r["period_key"]
            is_current = (yr == this_year)

            if is_current:
                day_rows = self._get_history_range(conn, "day", f"{yr}-01-01", today)
                kwh = round(sum(d["energy_kwh"] for d in day_rows), 1)

                prev_year = str(int(yr) - 1)
                prev_same_end = f"{prev_year}-{today_day_str}"
                prev_day_rows = self._get_history_range(conn, "day", f"{prev_year}-01-01", prev_same_end)
                prev_same_period = round(sum(d["energy_kwh"] for d in prev_day_rows), 1)

                years.append({
                    "year": yr,
                    "kwh": kwh,
                    "partial": True,
                    "prev_same_period": prev_same_period,
                })
            else:
                day_rows = self._get_history_range(conn, "day", f"{yr}-01-01", f"{yr}-12-31")
                kwh = round(sum(d["energy_kwh"] for d in day_rows), 1)
                years.append({"year": yr, "kwh": kwh})

        current_today_kwh = _kwh("day", today)
        conn.close()

        def _calc_metrics(kwh_val: float) -> dict:
            co2 = round(kwh_val * 0.22, 2)
            return {
                "kwh": kwh_val,
                "co2_kg": co2,
                "trees": round(co2 / 10, 1),
                "car_km": round(kwh_val * 6.5, 1)
            }

        return {
            "today_kwh": current_today_kwh,
            "week_kwh": week_kwh,
            "month_kwh": month_kwh,
            "year_kwh": year_kwh,
            "years": years,
            "env": {
                "today": _calc_metrics(current_today_kwh),
                "week": _calc_metrics(week_kwh),
                "month": _calc_metrics(month_kwh),
                "year": _calc_metrics(year_kwh)
            },
            "last_update": now.isoformat(timespec="seconds"),
        }
