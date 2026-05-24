# home-picokostal (hc_pico)

Kostal Piko 5.5 Wechselrichter Datenlogger. Pollt den Inverter alle 5 Minuten,
berechnet theoretische PV-Leistung, speichert in SQLite und publiziert via MQTT
an Home Assistant.

## Features

- Kostal Piko HTTP Scraping (alle 5 Min)
- Theoretische PV-Berechnung (Sonnenstand, Ost/West Panels)
- SQLite Datenbank (pv_readings + pv_history)
- MQTT Publishing + HA Discovery (YAML-basiert)
- FastAPI Dashboard mit Chart.js
- Jahresvergleich, Stundenwerte, Tageswerte
- Wirkungsgrad-Berechnung (Actual vs. Theoretical)
- HA Webhook Notifications

## Quick Start

```bash
source ../.venv/bin/activate
make install
make dev
```

Dashboard: http://10.1.1.119:5098/

## API Endpoints

| Endpoint | Beschreibung |
|----------|-------------|
| `GET /` | Dashboard (HTML) |
| `GET /api/health` | Health Check |
| `GET /api/appstatus` | Status für Übersichtsdashboard |
| `GET /api/current` | Aktuelle Messwerte (Live) |
| `GET /api/summary` | Zusammenfassung (Heute/Woche/Monat/Jahr) |
| `GET /api/chart/hour?date=YYYY-MM-DD` | Stundenwerte + Theoretische Kurve |
| `GET /api/chart/day?from=&to=` | Tageswerte |
| `GET /api/chart/month?from=&to=` | Monatswerte |
| `GET /api/chart/year` | Jahreswerte |
| `GET /data/payload.json` | Rohdaten (letzter Polling-Zyklus) |

## Projektstruktur

```
hc_pico/
├── app/
│   ├── main.py                         # Entry Point (Controller + Dashboard)
│   ├── core/
│   │   ├── config.py                   # Konfiguration aus .env
│   │   ├── logging.py                  # Logger
│   │   ├── mqtt.py                     # MQTT Client
│   │   └── webhook.py                  # HA Webhook
│   ├── api/
│   │   ├── server.py                   # FastAPI App (Dashboard API)
│   │   └── routes/health.py            # /api/health + /api/appstatus
│   ├── integrations/kostal/
│   │   └── piko_sensor.py              # Kostal Inverter HTTP Scraping + PV-Berechnung
│   └── services/
│       ├── controller.py               # Polling-Loop + MQTT Publish
│       ├── db_manager.py               # SQLite (pv_readings + pv_history)
│       ├── hadiscovery.py              # HA MQTT Discovery (aus YAML)
│       └── utillib.py                  # Hilfsfunktionen
├── config/
│   ├── kostal_sensors.yaml             # HA Discovery Sensor-Definitionen
│   └── pv_model.json                   # PV Modell Parameter
├── data/                               # DB + payload.json + history.json
├── frontend/index.html                 # Dashboard UI
├── .env
├── Dockerfile
├── docker-compose.yml
└── Makefile
```

## Konfiguration (.env)

```env
PORT=5098
KOSTALURL=http://10.1.1.80
KOSTALUSER=pvserver
KOSTALPASSWORD=...
MQTT_HOST=10.1.1.119
MQTT_TOPIC=kostal/data
DATA_DELAY=300
PV_ETA=0.91
PV_SHIFT_OST=-1.0
PV_SHIFT_WEST=1.0
```

## Makefile

```bash
make dev        # Lokal mit DEBUG
make run        # Lokal normal
make build      # Docker Image
make up         # Docker starten (Port 5098)
make down       # Docker stoppen
make rebuild    # Rebuild ohne Cache
make logs       # Logs anzeigen
make backup     # DB Backup
```

## Docker

```bash
make build      # Image bauen
make up         # Container starten
make logs       # Logs anzeigen
make rebuild    # Rebuild ohne Cache
```

## Nginx Reverse Proxy

```nginx
location /dashboardpico/ {
    proxy_pass http://10.1.1.119:5098/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Migration von v1

Migriert aus `apps_v1/hc_pico` (Flask Dashboard → FastAPI).
Controller-Logik und PV-Berechnung 1:1 übernommen.

## Hinweise Dashboard

- Trendlinie (blau gestrichelt) wird nur bei **Tag** und **Monat** angezeigt (Design, nicht Bug)
- Jahresvergleich hat eigenen Trend in den Kacheln (≈ kWh Trend)
- Theoretische Kurve nur bei Stundenwerten (Sonnenstand-Berechnung)
- Wirkungsgrad = Produktion / Theoretisch (nur bei Stundenwerten)
