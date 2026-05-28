# -*- coding: utf-8 -*-
"""FastAPI App für Dashboard + API."""

import logging
import os
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes.health import router as health_router
from app.core.config import APP_NAME, APP_VERSION, DB_PATH, KOSTAL_SENSOR, PROJECT_ROOT, PV_ETA, PV_SHIFT_OST, PV_SHIFT_WEST

log = logging.getLogger(__name__)

FRONTEND_DIR = PROJECT_ROOT / "frontend"


def create_app() -> FastAPI:
    import math

    def _calc_theoretical_day(date_str: str) -> dict:
        """Berechnet theoretische PV-Leistung für jeden Stundenmittelwert."""
        try:
            import zoneinfo
            tz = zoneinfo.ZoneInfo(KOSTAL_SENSOR.get("timezone", "Europe/Vaduz"))
        except Exception:
            from datetime import timezone as _tz
            tz = _tz(timedelta(hours=2))

        d = datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=tz)
        utc_offset = d.utcoffset()
        tz_offset_h = utc_offset.total_seconds() / 3600 if utc_offset else 2.0
        day_of_year = d.timetuple().tm_yday

        lat = float(KOSTAL_SENSOR.get("latitude", 47.46))
        pv_ost_kw = float(KOSTAL_SENSOR.get("pv_ost", {}).get("P_STC", 2500)) * 0.001
        pv_west_kw = float(KOSTAL_SENSOR.get("pv_west", {}).get("P_STC", 2500)) * 0.001
        eta = PV_ETA
        shift_ost_h = PV_SHIFT_OST
        shift_west_h = PV_SHIFT_WEST

        decl = 23.44 * math.sin(math.radians((360 / 365) * (day_of_year - 81)))
        cos_ha = max(-1.0, min(1.0, -math.tan(math.radians(lat)) * math.tan(math.radians(decl))))
        ha = math.degrees(math.acos(cos_ha))

        sunrise_h = 12.0 - ha / 15.0 + tz_offset_h
        sunset_h = 12.0 + ha / 15.0 + tz_offset_h
        daylight_h = max(0.01, sunset_h - sunrise_h)

        def pv_curve(t):
            if t <= 0 or t >= 1:
                return 0.0
            return math.sin(math.pi * t)

        def p_at_hour(h_decimal):
            samples = 6
            total = 0.0
            for s in range(samples):
                t_abs = h_decimal + (s * 10 + 5) / 60.0
                t_norm = (t_abs - sunrise_h) / daylight_h
                s_ost = shift_ost_h / daylight_h
                s_west = shift_west_h / daylight_h
                p_ost = pv_ost_kw * pv_curve(t_norm + s_ost) * eta
                p_west = pv_west_kw * pv_curve(t_norm + s_west) * eta
                total += p_ost + p_west
            return round(total / samples, 3)

        hourly_kw = [p_at_hour(h + 0.5) for h in range(24)]
        daily_kwh = round(sum(hourly_kw), 2)

        return {"hourly_kw": hourly_kw, "daily_kwh": daily_kwh, "sunrise_h": round(sunrise_h, 2), "sunset_h": round(sunset_h, 2)}

    app = FastAPI(
        title=APP_NAME,
        version=APP_VERSION,
        root_path=os.environ.get("ROOT_PATH", ""),
    )

    # --- Middleware: CORS + No-Cache für Static Files ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def add_no_cache_headers(request: Request, call_next):
        response = await call_next(request)
        if request.url.path.endswith((".html", ".js", ".css")):
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

    # Health + AppStatus
    app.include_router(health_router, prefix="/api", tags=["health"])

    # Static files
    if (FRONTEND_DIR / "static").exists():
        app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR / "static")), name="static")

    # Dashboard HTML (neues modulares Dashboard)
    @app.get("/", response_class=HTMLResponse)
    async def index():
        html_file = FRONTEND_DIR / "dashboard.html"
        if html_file.exists():
            return FileResponse(str(html_file))
        return HTMLResponse("<h1>Dashboard not found</h1>", status_code=404)

    # Legacy: altes Dashboard unter /v1
    @app.get("/v1", response_class=HTMLResponse)
    async def index_v1():
        html_file = FRONTEND_DIR / "index.html"
        if html_file.exists():
            return FileResponse(str(html_file))
        return HTMLResponse("<h1>Dashboard v1 not found</h1>", status_code=404)

    # Payload JSON (live data from controller)
    @app.get("/data/payload.json")
    async def payload_json():
        data_file = Path(KOSTAL_SENSOR.get("datafile", "./data/payload.json"))
        if data_file.exists():
            return FileResponse(str(data_file))
        return JSONResponse({"error": "Keine Daten"}, status_code=404)

    # --- Dashboard API (aus v1 dashboard/server.py) ---

    def _get_db():
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA query_only=ON")
        return conn

    def _get_history_range(conn, period_type, from_key, to_key):
        rows = conn.execute("""
            SELECT period_type, period_key, energy_kwh, last_update
            FROM pv_history WHERE period_type = ? AND period_key BETWEEN ? AND ?
            ORDER BY period_key
        """, (period_type, from_key, to_key)).fetchall()
        return [dict(r) for r in rows]

    def _get_history(conn, period_type, limit=10):
        rows = conn.execute("""
            SELECT period_type, period_key, energy_kwh, last_update
            FROM pv_history WHERE period_type = ? ORDER BY period_key DESC LIMIT ?
        """, (period_type, limit)).fetchall()
        return [dict(r) for r in rows]

    @app.get("/api/current")
    async def api_current():
        conn = _get_db()
        row = conn.execute("SELECT * FROM pv_readings ORDER BY timestamp DESC LIMIT 1").fetchone()
        conn.close()
        if not row:
            return JSONResponse({"error": "Keine Daten"}, status_code=404)
        r = dict(row)
        return {
            "timestamp": r.get("timestamp"),
            "date": r.get("date"),
            "time": r.get("time"),
            "aktiv": r.get("aktiv"),
            "mode": r.get("mode"),
            "current_power_w": r.get("current_power", 0),
            "current_power_kw": r.get("current_power_kw", 0),
            "daily_energy_kwh": r.get("daily_energy", 0),
            "total_energy_kwh": r.get("total_energy", 0),
            "pv_ost_w": r.get("pv_actual_ost", 0),
            "pv_west_w": r.get("pv_actual_west", 0),
            "pv_theoretical_kw": r.get("pv_theoretical_total", 0),
            "gesamtleistung_w": r.get("gesamtleistung", 0),
            "l1_voltage": r.get("output_l1_voltage", 0),
            "l1_ampere": r.get("string1_ampere", 0),
            "l1_power": r.get("l1_power", 0),
            "string1_voltage": r.get("string1_voltage", 0),
            "l2_voltage": r.get("output_l2_voltage", 0),
            "l2_ampere": r.get("string2_ampere", 0),
            "l2_power": r.get("l2_power", 0),
            "string2_voltage": r.get("string2_voltage", 0),
            "l3_voltage": r.get("output_l3_voltage", 0),
            "l3_ampere": r.get("string3_ampere", 0),
            "l3_power": r.get("l3_power", 0),
            "powerfactor": r.get("powerfactor", 0),
        }

    @app.get("/api/summary")
    async def api_summary():
        conn = _get_db()
        now = datetime.now()
        today = now.strftime("%Y-%m-%d")
        this_year = now.strftime("%Y")

        def _kwh(pt, key):
            rows = _get_history_range(conn, pt, key, key)
            return rows[0]["energy_kwh"] if rows else 0.0

        # Woche
        iso_year, iso_week, _ = now.isocalendar()
        from datetime import date as _date
        week_monday = _date.fromisocalendar(iso_year, iso_week, 1)
        week_sunday = _date.fromisocalendar(iso_year, iso_week, 7)
        week_kwh = round(sum(r["energy_kwh"] for r in _get_history_range(conn, "day", str(week_monday), str(week_sunday))), 1)

        # Monat
        this_month = now.strftime("%Y-%m")
        import calendar
        _y, _m = int(this_month[:4]), int(this_month[5:])
        month_end = f"{this_month}-{calendar.monthrange(_y, _m)[1]:02d}"
        month_kwh = round(sum(r["energy_kwh"] for r in _get_history_range(conn, "day", f"{this_month}-01", month_end)), 1)

        # Jahr
        year_kwh = round(sum(r["energy_kwh"] for r in _get_history_range(conn, "day", f"{this_year}-01-01", today)), 1)

        # Jahresvergleich (mit fairem Periodenvergleich für laufendes Jahr)
        year_rows = sorted(_get_history(conn, "year", limit=15), key=lambda r: r["period_key"])
        years = []

        # Aktueller Tag im Jahr für fairen Vergleich
        today_day_str = now.strftime("%m-%d")

        for r in year_rows:
            yr = r["period_key"]
            is_current = (yr == this_year)

            if is_current:
                # Laufendes Jahr: nur bis heute
                day_rows = _get_history_range(conn, "day", f"{yr}-01-01", today)
                kwh = round(sum(d["energy_kwh"] for d in day_rows), 1)

                # Gleicher Zeitraum im Vorjahr (Jan 1 bis gleicher Tag)
                prev_year = str(int(yr) - 1)
                prev_same_end = f"{prev_year}-{today_day_str}"
                prev_day_rows = _get_history_range(conn, "day", f"{prev_year}-01-01", prev_same_end)
                prev_same_period = round(sum(d["energy_kwh"] for d in prev_day_rows), 1)

                years.append({
                    "year": yr,
                    "kwh": kwh,
                    "partial": True,
                    "prev_same_period": prev_same_period,
                })
            else:
                day_rows = _get_history_range(conn, "day", f"{yr}-01-01", f"{yr}-12-31")
                kwh = round(sum(d["energy_kwh"] for d in day_rows), 1)
                years.append({"year": yr, "kwh": kwh})

        result = {
            "today_kwh": _kwh("day", today),
            "week_kwh": week_kwh,
            "month_kwh": month_kwh,
            "year_kwh": year_kwh,
            "years": years,
            "last_update": now.isoformat(timespec="seconds"),
        }
        conn.close()
        return result

    @app.get("/api/chart/{period_type}")
    async def api_chart(period_type: str, request: Request):
        if period_type not in ("hour", "day", "week", "month", "year"):
            return JSONResponse({"error": "Ungültiger Typ"}, status_code=400)

        conn = _get_db()
        now = datetime.now()
        params = request.query_params

        if period_type == "hour":
            date = params.get("date", now.strftime("%Y-%m-%d"))
            rows = _get_history_range(conn, "hour", f"{date} 00", f"{date} 23")

            # Stundenwerte aus pv_history
            hour_map = {r["period_key"]: r["energy_kwh"] for r in rows}
            values = [hour_map.get(f"{date} {h:02d}", 0.0) for h in range(24)]

            # Fehlende Stunden aus pv_readings berechnen (MAX-MIN pro Stunde)
            for h in range(24):
                if values[h] == 0.0:
                    row = conn.execute("""
                        SELECT MAX(daily_energy) - MIN(daily_energy) AS hour_kwh
                        FROM pv_readings
                        WHERE date = ? AND time LIKE ?
                          AND daily_energy > 0
                    """, (date, f"{h:02d}:%")).fetchone()
                    if row and row[0] and row[0] > 0:
                        values[h] = round(row[0], 3)

            labels = [f"{h:02d}:00" for h in range(24)]

            # Tageswert
            day_rows = _get_history_range(conn, "day", date, date)
            day_kwh = day_rows[0]["energy_kwh"] if day_rows else round(sum(values), 3)

            # Theoretische PV-Kurve berechnen
            theo = _calc_theoretical_day(date)
            theoretical = theo["hourly_kw"]
            theo_daily_kwh = theo["daily_kwh"]

            # Theoretisch bis aktuelle Stunde
            if date == now.strftime("%Y-%m-%d"):
                current_hour = now.hour + 1
                theo_so_far = round(sum(theoretical[:current_hour]), 2)
            else:
                theo_so_far = theo_daily_kwh

            # Wirkungsgrad
            efficiency = []
            for a, t in zip(values, theoretical):
                if t > 0.1:
                    efficiency.append(round(min(a / t, 1.5), 3))
                else:
                    efficiency.append(None)

            conn.close()
            return {
                "period_type": period_type,
                "labels": labels,
                "values": values,
                "theoretical": theoretical,
                "efficiency": efficiency,
                "theo_daily_kwh": theo_daily_kwh,
                "theo_so_far": theo_so_far,
                "total_kwh": day_kwh,
                "count": len(labels),
            }

        from_key = params.get("from")
        to_key = params.get("to")

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
            import calendar as _cal
            from_day = (from_key or "") + "-01"
            to_year, to_mon = int(to_key[:4]), int(to_key[5:7])
            to_day = f"{to_key}-{_cal.monthrange(to_year, to_mon)[1]:02d}"
            day_rows = _get_history_range(conn, "day", from_day, to_day)
            from collections import defaultdict
            monthly = defaultdict(float)
            for r in day_rows:
                monthly[r["period_key"][:7]] += r["energy_kwh"]
            rows = [{"period_key": k, "energy_kwh": round(v, 3)} for k, v in sorted(monthly.items())]
        elif period_type == "year":
            from collections import defaultdict
            year_keys = sorted(_get_history(conn, "year", limit=15), key=lambda r: r["period_key"])
            yearly = defaultdict(float)
            for r in year_keys:
                yr = r["period_key"]
                day_rows = _get_history_range(conn, "day", f"{yr}-01-01", f"{yr}-12-31")
                yearly[yr] = round(sum(d["energy_kwh"] for d in day_rows), 3)
            rows = [{"period_key": yr, "energy_kwh": kwh} for yr, kwh in sorted(yearly.items())]
        else:
            rows = _get_history_range(conn, period_type, from_key, to_key)

        labels = [r["period_key"] for r in rows]
        values = [r["energy_kwh"] for r in rows]
        conn.close()
        return {"period_type": period_type, "labels": labels, "values": values, "total_kwh": round(sum(values), 3), "count": len(rows)}

    return app
