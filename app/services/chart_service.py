# app/services/chart_service.py
import calendar as _cal
import sqlite3
from collections import defaultdict
from datetime import datetime, timedelta
from app.core.solar_model import calc_theoretical_day


class ChartService:

    def _get_db_conn(self, db_path: str):
        """Öffnet die isolierte SQLite-Verbindung."""
        conn = sqlite3.connect(db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def get_chart_data(self, period_type: str, query_params: dict) -> dict:
        # Metadaten-Imports entfernt, da diese nun im DashboardService liegen
        from app.core.config import DB_PATH, KOSTAL_SENSOR, PV_ETA, PV_SHIFT_OST, PV_SHIFT_WEST

        conn = self._get_db_conn(DB_PATH)
        now = datetime.now()

        # --- 1. STÜNDLICHE AUSWERTUNG (HOUR MODE) ---
        if period_type == "hour":
            date = query_params.get("date", now.strftime("%Y-%m-%d"))

            # Basis-Stundenwerte aus der Historie laden
            rows = conn.execute(
                "SELECT period_key, energy_kwh FROM pv_history WHERE period_type='hour' AND period_key BETWEEN ? AND ?",
                (f"{date} 00", f"{date} 23")
            ).fetchall()

            hour_map = {r["period_key"]: r["energy_kwh"] for r in rows}
            values = [hour_map.get(f"{date} {h:02d}", 0.0) for h in range(24)]

            # Lückenfüller aus den Live-Rohdaten (MAX - MIN) berechnen
            for h in range(24):
                if values[h] == 0.0:
                    row = conn.execute(
                        "SELECT MAX(daily_energy) - MIN(daily_energy) AS hour_kwh FROM pv_readings WHERE date=? AND time LIKE ? AND daily_energy>0",
                        (date, f"{h:02d}:%")
                    ).fetchone()
                    if row and row["hour_kwh"] and row["hour_kwh"] > 0:
                        values[h] = round(row["hour_kwh"], 3)

            day_row = conn.execute(
                "SELECT energy_kwh FROM pv_history WHERE period_type='day' AND period_key=?",
                (date,)
            ).fetchone()

            # Astronomische Prognosekurve über das Solar-Modul ermitteln
            theo = calc_theoretical_day(date, KOSTAL_SENSOR, PV_ETA, PV_SHIFT_OST, PV_SHIFT_WEST)
            theoretical = theo["hourly_kw"]

            # Effizienzliste (Verhältnis Erzeugung zu Prognose) generieren
            efficiency = [
                round(min(a / t, 1.5), 3) if t > 0.1 else None
                for a, t in zip(values, theoretical)
            ]

            # Aktueller Fortschritt der Tagesprognose bis zur aktuellen Stunde
            if date == now.strftime("%Y-%m-%d"):
                theo_so_far = round(sum(theoretical[:now.hour + 1]), 2)
            else:
                theo_so_far = theo["daily_kwh"]

            conn.close()

            return {
                "period_type": period_type,
                "labels": [f"{h:02d}:00" for h in range(24)],
                "values": values,
                "theoretical": theoretical,
                "efficiency": efficiency,
                "theo_daily_kwh": theo["daily_kwh"],
                "theo_so_far": theo_so_far,
                "total_kwh": day_row["energy_kwh"] if day_row else round(sum(values), 3),
                "count": 24
            }

        # --- 2. HISTORISCHE AUSWERTUNGEN (DAY, WEEK, MONTH, YEAR) ---
        from_key = query_params.get("from")
        to_key = query_params.get("to")

        # Automatische Fallback-Berechnungen für die Filter-Zeiträume
        if not (from_key and to_key):
            if period_type == "day":
                from_key = (now - timedelta(days=30)).strftime("%Y-%m-%d")
                to_key = now.strftime("%Y-%m-%d")
            elif period_type == "week":
                from_key = f"{now.year - 1}W01"
                to_key = f"{now.year}W{now.isocalendar()[1]:02d}"
            elif period_type == "month":
                from_key = f"{now.year - 1}-01"
                to_key = now.strftime("%Y-%m")
            elif period_type == "year":
                from_key = "2013"
                to_key = now.strftime("%Y")

        if period_type == "month":
            # Monatsübersicht: Aggregation aller Einzeltage aus dem gewählten Zeitraum
            end_day = f"{to_key}-{_cal.monthrange(int(to_key[:4]), int(to_key[5:7]))[1]:02d}"
            day_rows = conn.execute(
                "SELECT period_key, energy_kwh FROM pv_history WHERE period_type='day' AND period_key BETWEEN ? AND ?",
                (from_key + "-01", end_day)
            ).fetchall()

            monthly = defaultdict(float)
            for r in day_rows:
                monthly[r["period_key"][:7]] += r["energy_kwh"]
            db_rows = [{"period_key": k, "energy_kwh": round(v, 3)} for k, v in sorted(monthly.items())]

        elif period_type == "year":
            # Jahresübersicht: Aggregation aller aufgezeichneten Einzeltage seit Anlagenstart
            all_days = conn.execute("SELECT period_key, energy_kwh FROM pv_history WHERE period_type='day'").fetchall()
            yearly = defaultdict(float)
            for r in all_days:
                yearly[r["period_key"][:4]] += r["energy_kwh"]
            db_rows = [{"period_key": yr, "energy_kwh": round(kwh, 3)} for yr, kwh in sorted(yearly.items())]

        else:
            # Standard-Intervall-Abfrage für Tage und Wochen
            db_rows = conn.execute(
                "SELECT period_key, energy_kwh FROM pv_history WHERE period_type=? AND period_key BETWEEN ? AND ? ORDER BY period_key",
                (period_type, from_key, to_key)
            ).fetchall()

        conn.close()

        return {
            "period_type": period_type,
            "labels": [r["period_key"] for r in db_rows],
            "values": [r["energy_kwh"] for r in db_rows],
            "total_kwh": round(sum(r["energy_kwh"] for r in db_rows), 3),
            "count": len(db_rows)
        }
