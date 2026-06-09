# app/services/dashboard_service.py
import logging
import os
import platform
from datetime import datetime

from app.services.chart_service import ChartService
from app.services.current_service import CurrentService
from app.services.summary_service import SummaryService

logger = logging.getLogger(__name__)


class DashboardService:

    def get_all_dashboard_data(self, period_type: str, query_params: dict) -> dict:
        """Sammelt alle PV-Daten zentral und reichert sie mit einmaligen Metadaten an."""
        # Lokale Imports zur Vermeidung zirkulärer Abhängigkeiten beim App-Start
        from app.core.config import APP_NAME, APP_VERSION, KOSTAL_SENSOR

        # 1. Daten-Services instanziieren
        current_service = CurrentService()
        summary_service = SummaryService()
        chart_service = ChartService()

        # 2. Reine Fachdaten aus den Sub-Services abrufen (ohne deren alten Meta-Ballast)
        current_data = current_service.get_current_data()
        chart_data = chart_service.get_chart_data(period_type, query_params)

        # 3. Logisches Zieldatum für die historischen Summary-Kacheln bestimmen
        target_date = query_params.get("date")

        if not target_date and query_params.get("to"):
            to_val = query_params.get("to")
            target_date = to_val if len(to_val) == 10 else f"{to_val}-01"

        if not target_date:
            target_date = datetime.now().strftime("%Y-%m-%d")

        summary_data = summary_service.get_summary_data(target_date_str=target_date)

        # 4. Zentrale System-Metadaten für die oberste JSON-Ebene generieren
        now = datetime.now()
        installed_dt = KOSTAL_SENSOR.get("installed", datetime(2013, 7, 1, 15, 0, 0))
        diff = now - installed_dt

        # Ermittlung des System-Status: Hat die DB Daten und antwortet der Controller?
        db_ok = summary_data and "years" in summary_data and len(summary_data["years"]) > 0
        dataservice_status = "ok" if (db_ok and current_data) else "no data"

        system_meta = {
            "servertime": now.strftime("%Y-%m-%d um %H:%M Uhr"),
            "apptitle": APP_NAME,
            "appversion": APP_VERSION,
            "language": "at-de",
            "name": KOSTAL_SENSOR.get("name", "KOSTAL PIKO5.5"),
            "hersteller": KOSTAL_SENSOR.get("hersteller", "KOSTAL Solar Electric"),
            "image": "static/kostal.png",
            "laufzeit": f"{diff.days // 365} Jahre und {diff.days % 365} Tage",
            "stunden": diff.days * 12,
            # 🌟 JETZT KORREKT: Reicht den echten Servernamen aus der docker-compose.yml ins JSON
            "hostname": os.getenv("APP_HOSTNAME") or platform.node(),
            "dataservice": dataservice_status,
        }

        # 5. Aggregiertes BFF-Datenpaket zurückgeben
        return {
            "meta_data": system_meta,
            "current": current_data,
            "summary": summary_data,
            "chart": chart_data,
        }
