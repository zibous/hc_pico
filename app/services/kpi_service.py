# app/services/kpi_service.py
"""KPI-Service für hc_pico – liefert PV-Übersicht für das zentrale Dashboard."""

import logging
import sqlite3
from datetime import datetime
from pathlib import Path

from app.core.config import APP_NAME, DB_PATH, KOSTAL_SENSOR, PORT
from app.schemas.kpi import KpiHero, KpiIndicator, KpiResponse

logger = logging.getLogger(__name__)

KPI_APP_ID = "hc_pico"
KPI_APP_NAME = "Piko Kostal"
KPI_ICON = "solar_power"
KPI_URL = f"http://nuc:{PORT}"


def _get_db() -> sqlite3.Connection:
    """Read-only Datenbankverbindung."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=5)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA query_only=ON")
    return conn


class KpiService:
    """Aggregiert PV-KPI-Daten aus der SQLite-Datenbank."""

    def get_kpis(self) -> KpiResponse:
        now = datetime.now()
        today = now.strftime("%Y-%m-%d")

        try:
            conn = _get_db()
        except Exception as e:
            logger.warning("KPI: DB nicht erreichbar: %s", e)
            return self._error_response(now, "DB nicht erreichbar")

        try:
            # Aktuelle Leistung (letzter Messwert)
            latest = conn.execute(
                "SELECT * FROM pv_readings ORDER BY timestamp DESC LIMIT 1"
            ).fetchone()

            if not latest:
                conn.close()
                return self._error_response(now, "Keine Messdaten")

            current_power_w = latest["current_power"] or 0.0
            daily_energy = latest["daily_energy"] or 0.0
            aktiv = latest["aktiv"] or "off"
            mode = latest["mode"] or ""

            # Tagesertrag aus pv_history (genauer als letzter daily_energy-Wert)
            day_row = conn.execute(
                "SELECT energy_kwh FROM pv_history WHERE period_type='day' AND period_key=?",
                (today,),
            ).fetchone()
            day_kwh = day_row["energy_kwh"] if day_row else daily_energy

            # Stundenwerte für Sparkline (heute)
            hour_rows = conn.execute(
                "SELECT period_key, energy_kwh FROM pv_history "
                "WHERE period_type='hour' AND period_key BETWEEN ? AND ? "
                "ORDER BY period_key",
                (f"{today} 00", f"{today} 23"),
            ).fetchall()

            sparkline = [0.0] * 24
            for row in hour_rows:
                # period_key format: "YYYY-MM-DD HH"
                try:
                    hour = int(row["period_key"].split(" ")[1])
                    sparkline[hour] = round(row["energy_kwh"], 2)
                except (IndexError, ValueError):
                    pass

            # Nur bis aktuelle Stunde + 1 (rest ist Zukunft)
            current_hour = min(now.hour + 1, 24)
            sparkline_trimmed = sparkline[:current_hour]

            conn.close()

            # Status bestimmen
            status = "ok" if aktiv == "on" else "idle"

            # Label: aktuelle Leistung + Modus
            power_display = (
                f"{int(current_power_w)} W"
                if current_power_w >= 1
                else "0 W"
            )
            label = f"Aktuell {power_display}"
            if mode and mode != "waiting":
                label += f" · {mode}"

            # Detail
            detail = f"Heute {now.strftime('%d.%m.%Y')}"

            return KpiResponse(
                app_id=KPI_APP_ID,
                app_name=KPI_APP_NAME,
                icon=KPI_ICON,
                url=KPI_URL,
                status=status,
                ts=now.isoformat(timespec="seconds"),
                hero=KpiHero(
                    value=round(day_kwh, 2),
                    unit="kWh",
                    label=label,
                ),
                detail=detail,
                indicator=KpiIndicator(
                    type="sparkline",
                    values=sparkline_trimmed,
                ),
            )

        except Exception as e:
            logger.exception("KPI: Fehler beim Erstellen der KPI-Daten: %s", e)
            try:
                conn.close()
            except Exception:
                pass
            return self._error_response(now, str(e))

    def _error_response(self, now: datetime, msg: str) -> KpiResponse:
        """Fallback bei Fehlern."""
        return KpiResponse(
            app_id=KPI_APP_ID,
            app_name=KPI_APP_NAME,
            icon=KPI_ICON,
            url=KPI_URL,
            status="error",
            ts=now.isoformat(timespec="seconds"),
            hero=KpiHero(value="–", unit="", label=msg),
        )
