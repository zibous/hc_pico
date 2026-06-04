# app/services/kpi_service.py
"""KPI-Service für hc_scale – liefert Körperwaage-Übersicht für das zentrale Dashboard."""

import json
import logging
from datetime import datetime
from pathlib import Path

from app.core.config import cfg
from app.schemas.kpi import KpiHero, KpiIndicator, KpiResponse

logger = logging.getLogger(__name__)

# KPI-Metadaten (aus .env wäre overkill für die dataclass-Config, daher hier)
KPI_APP_ID = "hc_scale"
KPI_APP_NAME = "Körperwaage"
KPI_ICON = "fitness_center"
KPI_URL = "http://nuc:5000"


def _load_user_data(name: str) -> dict | None:
    """Lädt die letzte Messung eines Users aus der JSON-Datei."""
    path = Path(cfg.data_dir) / f"miscale-{name}.json"
    try:
        if path.is_file():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.warning(f"KPI: Fehler beim Laden von {path}: {e}")
    return None


class KpiService:
    """Aggregiert Waage-KPI-Daten aus den User-JSON-Dateien."""

    def get_kpis(self) -> KpiResponse:
        now = datetime.now()

        # Beide User laden
        peter = _load_user_data("Peter")
        reni = _load_user_data("Reni")

        users = []
        if peter:
            users.append(peter)
        if reni:
            users.append(reni)

        if not users:
            return KpiResponse(
                app_id=KPI_APP_ID,
                app_name=KPI_APP_NAME,
                icon=KPI_ICON,
                url=KPI_URL,
                status="error",
                ts=now.isoformat(timespec="seconds"),
                hero=KpiHero(value="–", unit="", label="Keine Daten"),
            )

        # Neueste Messung als Hero
        users.sort(key=lambda u: u.get("timestamp", ""), reverse=True)
        latest = users[0]
        other = users[1] if len(users) > 1 else None

        weight = latest.get("weight", 0)
        user_name = latest.get("user", "")
        bmi = latest.get("bmi", 0)
        fat = latest.get("fat", 0)

        # Label: der andere User + BMI
        label_parts = []
        if other:
            label_parts.append(f"{other['user']} {other.get('weight', 0)} kg")
        label_parts.append(f"BMI {bmi}")
        label_parts.append(f"Fett {fat} %")
        label = " · ".join(label_parts)

        # Detail: Zeitpunkt der letzten Messung
        ts_str = latest.get("timestamp", "")
        detail = f"{user_name} · {ts_str[:10]}" if ts_str else user_name

        # Gauge: BMI von 15 bis 35
        indicator = KpiIndicator(
            type="gauge",
            min=15,
            max=35,
            value=bmi,
            zones=[
                {"from": 15, "to": 18.5, "color": "#3b82f6"},
                {"from": 18.5, "to": 25, "color": "#22c55e"},
                {"from": 25, "to": 30, "color": "#f59e0b"},
                {"from": 30, "to": 35, "color": "#ef4444"},
            ],
        )

        return KpiResponse(
            app_id=KPI_APP_ID,
            app_name=KPI_APP_NAME,
            icon=KPI_ICON,
            url=KPI_URL,
            status="ok",
            ts=now.isoformat(timespec="seconds"),
            hero=KpiHero(
                value=round(weight, 1),
                unit="kg",
                label=label,
            ),
            detail=detail,
            indicator=indicator,
        )
