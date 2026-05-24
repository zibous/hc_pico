# -*- coding: utf-8 -*-
"""Zentrale Konfiguration für home-picokostal."""

import os
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
APP_NAME = os.getenv("APP_NAME", "home-picokostal")
APP_VERSION = os.getenv("APP_VERSION", "2.1.0")

# ----------- HTTP Server -----------
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 5098))

# ----------- Kostal Inverter -----------
KOSTAL_SENSOR = {
    "name": os.getenv("KOSTAL_NAME", "KOSTAL PIKO5.5"),
    "hersteller": os.getenv("KOSTAL_MANUFACTOR", "KOSTAL Solar Electric"),
    "base_url": os.getenv("KOSTALURL", "http://10.1.1.80"),
    "user": os.getenv("KOSTALUSER", ""),
    "password": os.getenv("KOSTALPASSWORD", ""),
    "installed": datetime(2013, 7, 1, 15, 0, 0),
    "state_off": "off",
    "latitude": float(os.getenv("LATITUDE", 47.4577805)),
    "longitude": float(os.getenv("LONGITUDE", 9.6358696)),
    "elevation": float(os.getenv("ELEVATION", 403)),
    "timezone": os.getenv("TIMEZONE", "Europe/Vaduz"),
    "P_STC": float(os.getenv("PANELPOWER", 5000)),
    "pv_ost": {"P_STC": 2500, "tilt": 45, "azimuth": 90},
    "pv_west": {"P_STC": 2500, "tilt": 45, "azimuth": 270},
    "datadir": str(PROJECT_ROOT / "data"),
    "datafile": str(PROJECT_ROOT / "data" / "payload.json"),
    "historyfile": str(PROJECT_ROOT / "data" / "history.json"),
    "hadiscovery": str(PROJECT_ROOT / "config" / "kostal_sensors.yaml"),
    "PVHisData": str(PROJECT_ROOT / "config" / "pv_model.json"),
}

KOSTAL_DATA = {
    "device": os.getenv("KOSTAL_NAME", "KOSTAL PIKO5.5"),
    "deviceid": os.getenv("KOSTAL_MODEL", "PIKO5.5"),
    "date": "",
    "time": "",
    "current_power": 0.000,
    "current_power_kw": 0.000,
    "total_energy": 0.000,
    "daily_energy": 0.000,
    "total": {
        "power_hour": 0.000,
        "power_day": 0.000,
        "power_week": 0.000,
        "power_month": 0.000,
        "power_year": 0.000,
    },
    "generator": {
        "string1_voltage": 0.000,
        "output_l1_voltage": 0.000,
        "string1_ampere": 0.000,
        "l1_power": 0.000,
        "string2_voltage": 0.000,
        "output_l2_voltage": 0.000,
        "string2_ampere": 0.000,
        "l2_power": 0.000,
        "string3_voltage": 0.000,
        "output_l3_voltage": 0.000,
        "string3_ampere": 0.000,
        "l3_power": 0.000,
        "powerfactor_l1": 0.00,
        "powerfactor_l2": 0.00,
        "powerfactor_l3": 0.00,
        "powerfactor": 0.00,
    },
    "aktiv": "Off",
    "mode": "waiting",
    "icon": "mdi:solar-power",
    "week": "",
    "month": "",
    "year": "",
    "last_update": "",
    "appversion": APP_VERSION,
    "dataservice": f"docker-services.{APP_NAME}",
    "runningtime": "",
}

# ----------- MQTT -----------
MQTT_SERVER = {
    "host": os.getenv("MQTT_HOST", "localhost"),
    "port": int(os.getenv("MQTT_PORT", 1883)),
    "client": os.getenv("MQTT_CLIENT", "kostal-service"),
    "user": os.getenv("MQTT_USER", ""),
    "password": os.getenv("MQTT_PASS", ""),
    "topic": os.getenv("MQTT_TOPIC", "kostal/data"),
    "status_topic": os.getenv("MQTT_STATUS", "kostal/status"),
    "keepalive": int(os.getenv("MQTT_KEEPALIVE", 60)),
}

# ----------- Logging -----------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_MODE = os.getenv("LOG_MODE", "console")
LOG_FILE = os.getenv("LOG_FILE", str(PROJECT_ROOT / "logs" / "picocontroller.log"))
LOG_MAX_BYTES = int(os.getenv("LOG_MAX_BYTES", 1_000_000))
LOG_BACKUP_COUNT = int(os.getenv("LOG_BACKUP_COUNT", 3))

# ----------- Webhook -----------
HA_WEBHOOK_URL = os.getenv("HA_WEBHOOK_URL", "")
HA_WEBHOOK_ID = os.getenv("HA_WEBHOOK_ID", "")

# ----------- HA DISCOVERY -----------
HA_BASETOPIC = os.getenv("HA_BASETOPIC", "").strip()
HA_DISCOVERY = os.getenv("HA_DISCOVERY", "").strip()
HA_DISCOVERY_ON = bool(HA_DISCOVERY)

# ----------- Database -----------
DB_PATH = os.getenv("DB_PATH", str(PROJECT_ROOT / "data" / "pv_data.db"))
DATADIR = str(PROJECT_ROOT / "data")
CONFIGDIR = str(PROJECT_ROOT / "config")
HADAADIR = str(PROJECT_ROOT / "data" / "homeassistant") + "/"

# ----------- Intervall -----------
INTERVALL = int(os.getenv("DATA_DELAY", 300))
DASHBOARD_PORT = int(os.getenv("PORT", 5098))

# ----------- PV Berechnungsparameter -----------
PV_ETA = float(os.getenv("PV_ETA", 0.91))
PV_SHIFT_OST = float(os.getenv("PV_SHIFT_OST", -1.0))
PV_SHIFT_WEST = float(os.getenv("PV_SHIFT_WEST", 1.0))
