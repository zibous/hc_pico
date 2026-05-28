# -*- coding: utf-8 -*-
import sys
import os
from pathlib import Path

# 1. Pfad-Fix (Bestehend)
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# =========================================================================
# 2. FIX: setup_logger aus Ihrer app.core.logging importieren
#    und global für alle Submodule injizieren
# =========================================================================
import builtins
try:
    from app.core.logging import setup_logger
    # Wir hängen die Funktion an die Builtins an (wie print oder len)
    builtins.setup_logger = setup_logger
except ImportError:
    # Fallback, falls der Importname in logging.py anders heißt
    import logging
    builtins.setup_logger = lambda name: logging.getLogger(name)
# =========================================================================

# 3. Jetzt folgen Ihre echten Projekt-Imports
from app.integrations.kostal.html_parser import PikoHtmlParser
from app.integrations.kostal.sensor import PikoSensor

# Standard-Imports
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

PIKO_URL = os.getenv("KOSTALURL", "")
PIKO_USER = os.getenv("KOSTALUSER", "")
PIKO_PASS = os.getenv("KOSTALPASSWORD", "")

# Pfad zu einer lokalen Test-Datenbank
DB_PATH = "./data/pv_data_test.db"
SIMULATED_TODAY_KWH = 15.4

def main():
    config = {
        "installed": datetime(2013, 7, 1, 15, 0, 0),
        "latitude": float(os.getenv("LATITUDE", 47.4577805)),
        "longitude": float(os.getenv("LONGITUDE", 9.6358696)),
        "timezone": os.getenv("TIMEZONE", "Europe/Vaduz"),
        "pv_ost": {"P_STC": 2500, "tilt": 45, "azimuth": 90},
        "pv_west": {"P_STC": 2500, "tilt": 45, "azimuth": 270}
    }

    # 1. Live-HTML vom echten Wechselrichter abrufen
    try:
        response = requests.get(PIKO_URL, auth=(PIKO_USER, PIKO_PASS), timeout=5)
        if response.status_code != 200:
            print(json.dumps({"error": f"HTTP Status {response.status_code}"}))
            return
        html_content = response.text
    except Exception as e:
        print(json.dumps({"error": f"Verbindungsfehler zum PIKO: {str(e)}"}))
        return

    # 2. HTML parsen mit Ihrer statischen Methode
    try:
        parsed_data = PikoHtmlParser.parse_inverter_page(html_content)
        raw_gen = parsed_data.get("generator", {})

        # A. AC-Leistungen sauber aufsummieren
        l1_p = float(raw_gen.get("l1_power", 0.0) or 0.0)
        l2_p = float(raw_gen.get("l2_power", 0.0) or 0.0)
        l3_p = float(raw_gen.get("l3_power", 0.0) or 0.0)
        calculated_ac_power = int(l1_p + l2_p + l3_p)
        raw_gen["current_power_w"] = calculated_ac_power

        # B. KORREKTUR: Den echten Gesamtertrag (ca. 51.000 kWh) zuweisen
        # Ihr Parser liefert ihn fälschlicherweise als 'daily_energy' benannt aus
        total_kwh = float(parsed_data.get("daily_energy", 0.0) or 0.0)
        raw_gen["total_energy_kwh"] = total_kwh

        # C. KORREKTUR FÜR DEN WIRKUNGSGRAD (Weil DC-Volt im HTML fehlen):
        # Wir simulieren den DC-Eingang für den Test (AC-Leistung + ca. 4% Verlust)
        # Dadurch bekommt der Inverter Futter für die Wirkungsgrad-Berechnung
        raw_gen["pv_actual_ost"] = int(calculated_ac_power * 0.51 / 0.96)
        raw_gen["pv_actual_west"] = int(calculated_ac_power * 0.49 / 0.96)

        # D. Maximalleistung für den Wetterindikator bereitstellen (5000 W = 5.0 kW)
        raw_gen["pv_theoretical_total"] = 5.0

        mock_data = {"generator": raw_gen}
    except Exception as e:
        print(json.dumps({"error": f"Parser-Fehler: {str(e)}"}))
        return


    # 3. Berechnungen durchführen & JSON ausgeben
    try:
        sensor = PikoSensor(config=config, data=mock_data)

        # Ermittelt alle Faktoren und wirft das Ergebnis aus
        final_payload = sensor.process_data(
            current_daily_energy=SIMULATED_TODAY_KWH,
            db_path=DB_PATH,
            today_kwh=SIMULATED_TODAY_KWH
        )
        print(json.dumps(final_payload, indent=2, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"error": f"Berechnungs-Fehler: {str(e)}"}))

if __name__ == "__main__":
    main()
