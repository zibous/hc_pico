---
title: "☀️ Kostal Piko 5.5 im Smart Home – PV-Monitoring mit Sonnenstand-Prognose"
date: 2026-06-28T14:00:00
description: "Wie man einen alten Kostal Piko 5.5 Wechselrichter via FastAPI, SQLite und MQTT fit für Home Assistant macht – inklusive astronomischer PV-Prognose und Wirkungsgrad-Analyse."
type: "post"
draft: false
image: "posts/smarthome-kostal-piko/kostal-piko.png"
author: "Peter Siebler"
snap_gallery: true
gallery: true
categories:
  - "Smarthome"
tags: ["docker", "python", "fastapi", "mqtt", "homeassistant",  "dashboard"]
---

[![Github Project](https://img.shields.io/badge/Project-GitHub-yellow.svg)](https://github.com/zibous/hc_pico)
[![Support author](https://img.shields.io/badge/buy%20me%20a%20coffee-orange.svg)](https://www.buymeacoff.ee/zibous)
[![License](https://img.shields.io/badge/license-Open%20Source-green.svg)](https://opensource.org)
![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)


## Altes Eisen schlau vernetzt

Ältere PV-Wechselrichter wie der **Kostal Piko 5.5** verrichten oft jahrelang klaglos ihren Dienst, bieten aber ab Werk keine zeitgemäße API-Anbindung für das moderne Smart Home. Genau hier setzt **home-picokostal (hc_pico)** an: Ein Python-Datenlogger, der das integrierte Web-Interface des Wechselrichters alle 5 Minuten ausliest, die Daten lokal aufbereitet, mit einem astronomischen Sonnenstand-Modell vergleicht und nahtlos via MQTT an Home Assistant übergibt.

<!--more-->

## Die PV-Anlage im Überblick

| Parameter | Wert |
|-----------|------|
| **Wechselrichter** | Kostal Piko 5.5 (5 kWp) |
| **Installiert** | Juli 2013 |
| **Panels** | 2 Strings (Ost + West, je 2,5 kWp) |
| **Neigung** | 45° |
| **Ausrichtung** | Ost (90°) + West (270°) |
| **Standort** | 47.46°N, 9.64°O, 403m ü.M. |
| **Gesamtertrag** | >50.000 kWh (seit Installation) |

Die Ost/West-Ausrichtung sorgt für eine breite Erzeugungskurve über den Tag – weniger Mittagsspitze, dafür von morgens bis abends Leistung.

---

## 🏗️ Architektur & Datenfluss

Die Anwendung trennt strikt zwischen Datenerfassung (Controller), physikalischer Berechnung (Solar Model) und API-Bereitstellung (FastAPI):

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Kostal Piko 5.5 (Web-Interface)                          │
│                     http://10.1.1.80 (HTTP Scraping)                         │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ HTTP GET (alle 5 Min)
                                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     Kostalcontroller (Polling-Loop)                          │
│  1. Wechselrichter abfragen (PikoSensor)                                     │
│  2. Theoretische Leistung berechnen (Solar Model)                            │
│  3. Wirkungsgrad berechnen (Actual / Theoretical)                            │
│  4. SQLite speichern (pv_readings + pv_history)                              │
│  5. MQTT publizieren (Live-Daten + Status)                                   │
│  6. Webhook an Home Assistant senden                                         │
└────────┬─────────────────────────────────────────────────────────────────────┘
         │
         ├────────────────────────────────────────────┐
         │                                            │
         ▼                                            ▼
┌──────────────────────────┐            ┌──────────────────────────────────────┐
│  SQLite DB (WAL-Modus)   │            │  MQTT Broker                         │
│  ├── pv_readings (Live)  │            │  kostal/data (Live-Leistung)         │
│  └── pv_history (Tages)  │            │  kostal/status (Online/Offline)      │
└──────────────┬───────────┘            │  + HA Discovery (Auto-Sensoren)      │
               │                        └──────────────────┬───────────────────┘
               ▼                                           │
┌──────────────────────────────────┐                       ▼
│  FastAPI Dashboard (Port 5098)   │            ┌──────────────────────────┐
│                                  │            │  Home Assistant          │
│  /api/current  (Live-Status)     │            │  • Aktuelle Leistung     │
│  /api/summary  (Tag/Woche/...)   │            │  • Tagesertrag           │
│  /api/chart/hour (Stundenwerte)  │            │  • CO2-Vermeidung        │
│  /api/chart/day  (Tageswerte)    │            │  • Wirkungsgrad          │
│  /api/chart/month (Monatswerte)  │            └──────────────────────────┘
│  /api/chart/year (Jahreswerte)   │
└──────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  Solar Model (Astronomische Berechnung)                  │
│  • Sonnenaufgang / -untergang                            │
│  • Deklination + Stundenwinkel                           │
│  • Theoretische Leistung pro Stunde (Ost + West)         │
│  • Berücksichtigung: η=0.91, Azimut-Shift, Neigung       │
└──────────────────────────────────────────────────────────┘
```

---

## ☀️ Das Solar-Modell – Theorie trifft Praxis

Das Herzstück der Analyse ist ein **astronomisches PV-Modell**, das für jeden Tag die theoretisch mögliche Leistung berechnet:

### Eingangsdaten
- **Standort-Koordinaten** (Breitengrad → Sonnenhöhe)
- **Tag des Jahres** (Sonnendeklination → Tageslänge)
- **Panel-Ausrichtung** (Ost 90° / West 270°, Neigung 45°)
- **Nennleistung** (2,5 kWp Ost + 2,5 kWp West = 5 kWp STC)
- **System-Wirkungsgrad** (η = 0,91 – Leitungsverluste, Temperatur, Degradation)

### Berechnung

```
Für jede Stunde des Tages:
  1. Normalisierte Tageszeit = (Stunde − Sonnenaufgang) / Tageslänge
  2. P_Ost  = 2.5 kWp × sin(π × (t_norm + Shift_Ost))
  3. P_West = 2.5 kWp × sin(π × (t_norm + Shift_West))
  4. P_theo = (P_Ost + P_West) × η
```

Der **Shift-Faktor** verschiebt die Sinuskurve für Ost nach links (Morgenleistung) und für West nach rechts (Abendleistung). Das Ergebnis ist eine realistische Doppelglocken-Kurve.

### Wirkungsgrad (Performance Ratio)

```
Performance Ratio = P_actual / P_theoretical × 100%
```

Ein Performance Ratio von 80–90% ist normal. Deutlich niedrigere Werte deuten auf:
- Verschattung (Bäume, Nachbargebäude)
- Verschmutzung der Panels
- Defekte Module oder Strings
- Schneebedeckung

---

## 🔌 Das Kostal Piko Web-Interface

Der Wechselrichter hat ein eingebautes Web-Interface (HTTP, kein HTTPS). Die App scrapt folgende Werte alle 5 Minuten:

| Wert | Beschreibung | Einheit |
|------|-------------|---------|
| `current_power` | Aktuelle AC-Leistung | W |
| `total_energy` | Gesamtertrag seit Installation | kWh |
| `daily_energy` | Tagesertrag | kWh |
| `string1_voltage/ampere` | DC-String Ost | V / A |
| `string2_voltage/ampere` | DC-String West | V / A |
| `output_l1/l2/l3_voltage` | AC-Phasenspannungen | V |
| `l1/l2/l3_power` | Leistung pro Phase | W |
| `powerfactor` | Leistungsfaktor (cos φ) | – |

---

## 📊 Dashboard & Visualisierung

Das FastAPI-Dashboard bietet mehrere Ansichten:

### Live-Status (`/api/current`)
- Aktuelle Leistung (kW) mit Tendenz
- String-Symmetrie (Ost vs. West)
- Phasen-Symmetrie (L1/L2/L3)
- Wirkungsgrad (Actual vs. Theoretical)
- Betriebszustand (Producing / Waiting / Off)

### Stundenwerte (`/api/chart/hour`)
- Leistungskurve des Tages (5-Min-Auflösung)
- Theoretische Kurve als Vergleich (gestrichelt)
- Performance Ratio pro Stunde
- Ost/West String-Aufteilung

### Tages-/Monats-/Jahreswerte
- Balkendiagramme mit kWh pro Periode
- Jahresvergleich (2013 vs. 2024 vs. 2025 vs. ...)
- CO2-Vermeidung und Baum-Äquivalente
- E-Auto-Kilometer-Äquivalent

### Umwelt-Metriken
- **CO2-Vermeidung**: 0,22 kg CO2 pro kWh
- **Baum-Äquivalente**: ~5 Bäume pro 1.000 kWh
- **E-Kilometer**: ~6 km pro kWh

---

## 🔗 Home Assistant Integration

### MQTT Auto-Discovery

Bei Start registriert die App automatisch Sensoren in Home Assistant:

- `sensor.kostal_current_power` – Aktuelle Leistung (W)
- `sensor.kostal_daily_energy` – Tagesertrag (kWh)
- `sensor.kostal_total_energy` – Gesamtertrag (kWh)
- `sensor.kostal_performance_ratio` – Wirkungsgrad (%)
- `sensor.kostal_string1_power` – String Ost (W)
- `sensor.kostal_string2_power` – String West (W)
- `sensor.kostal_co2_saved` – CO2 vermieden (kg)

### Webhooks

Events an Home Assistant bei:
- Wechselrichter startet morgens (Produktion beginnt)
- Wechselrichter geht abends offline
- Tagesertrag-Zusammenfassung
- Sensor-Fehler (Wechselrichter nicht erreichbar)

---

## ⚙️ Installation & Konfiguration

Weitere Informationen zum Projekt findest Du beim:<br>
{{< linkbutton "https://github.com/zibous/hc_pico" "GITHUB Projekt..." "github" >}}

### Docker (empfohlen)

```bash
git clone https://github.com/zibous/hc_scale.git hc_pico
cd hc_pico
cp .env.example .env
nano .env                    # Kostal IP + MQTT setzen
make build && make up
# → Dashboard: http://localhost:5098
```

### Wichtige Umgebungsvariablen

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| `KOSTALURL` | `http://10.1.1.80` | Wechselrichter Web-Interface |
| `KOSTALUSER` | `pvserver` | HTTP Auth User |
| `KOSTALPASSWORD` | – | HTTP Auth Passwort |
| `DATA_DELAY` | `300` | Polling-Intervall (Sekunden) |
| `PV_ETA` | `0.91` | System-Wirkungsgrad |
| `PV_SHIFT_OST` | `-1.0` | Azimut-Korrektur Ost-String |
| `PV_SHIFT_WEST` | `1.0` | Azimut-Korrektur West-String |
| `MQTT_HOST` | `localhost` | MQTT Broker |
| `MQTT_TOPIC` | `kostal/data` | MQTT Basis-Topic |
| `PORT` | `5098` | Dashboard-Port |

---

## 📡 REST API

| Endpoint | Beschreibung |
|----------|--------------|
| `GET /api/current` | Live-Status (Leistung, Strings, Phasen, Wirkungsgrad) |
| `GET /api/summary` | Zusammenfassung (Heute/Woche/Monat/Jahr + Vergleich) |
| `GET /api/chart/hour?date=` | Stundenwerte + theoretische Kurve |
| `GET /api/chart/day?from=&to=` | Tageswerte |
| `GET /api/chart/month?from=&to=` | Monatswerte |
| `GET /api/chart/year` | Jahreswerte (alle Jahre seit 2013) |
| `GET /api/health` | Health Check |
| `GET /api/appstatus` | App-Status für Übersichtsdashboard |
| `GET /api/kpidata` | KPI für zentrales Dashboard |
| `GET /` | Dashboard (HTML) |

---

## 💾 Datenbank

### SQLite (WAL-Modus)

**`pv_readings`** – Live-Messwerte (alle 5 Min):
- timestamp, current_power, daily_energy, total_energy
- string1/string2 voltage + ampere
- l1/l2/l3 power + voltage
- performance_ratio, theoretical_power

**`pv_history`** – Tagesaggregation:
- date, daily_kwh, theoretical_kwh, performance_ratio
- peak_power, sunshine_hours
- co2_saved, total_energy

Seit Installation 2013 enthält die History-Tabelle über **4.700 Tageseinträge** – eine lückenlose PV-Chronik.

---

## 🛠️ Technologie-Stack

| Komponente | Technologie |
|------------|-------------|
| **Backend** | Python 3.12, FastAPI, Pydantic |
| **Datenerfassung** | HTTP Scraping (Kostal Web-Interface) |
| **Berechnung** | Astronomisches Solar-Modell (Deklination, Stundenwinkel) |
| **Datenbank** | SQLite WAL-Modus (pv_readings + pv_history) |
| **Frontend** | HTML, Chart.js / ApexCharts |
| **Integration** | MQTT Discovery, HA Webhooks |
| **Deployment** | Docker Compose, Make-Workflow |

---

## 💡 Erkenntnisse aus 13 Jahren PV-Betrieb

- **Jahresertrag**: Typisch 4.500–5.200 kWh (Standort Alpenrheintal). Bestes Jahr: 2022 mit 5.180 kWh.
- **Degradation**: ~0,5% pro Jahr. Nach 13 Jahren produziert die Anlage noch ~94% der Nennleistung.
- **Ost/West lohnt sich**: Die breitere Erzeugungskurve (7–19 Uhr statt 9–17 Uhr) erhöht den Eigenverbrauch deutlich gegenüber reiner Süd-Ausrichtung.
- **Performance Ratio**: Im Schnitt 78% (Sommer 85%, Winter 65%). Hauptverlust: Reflexion bei flachem Sonneneinfallswinkel im Winter.
- **CO2-Bilanz**: >50.000 kWh × 0,22 kg = **11 Tonnen CO2 vermieden** seit Installation.
- **String-Asymmetrie**: Morgens dominiert Ost (70:30), abends West (30:70). Um die Mittagszeit sind beide Strings gleichmäßig belastet.
- **Schnee-Effekt**: An Schneetagen (Panel bedeckt) fällt der Performance Ratio auf unter 10%. Die App erkennt das zuverlässig.

<hr style="margin-bottom: 4rem">

### Dashboard & PV-Analyse
{{< gallery >}}
  {{< image-dir >}}
{{< /gallery >}}
s
<hr style="margin-bottom: 4rem">

{{< notice tip >}}
  &raquo; **Performance Ratio beobachten**: Ein schleichender Rückgang über Wochen deutet auf Verschmutzung der Panels hin. Eine Reinigung im Frühjahr bringt oft 5–8% zurück.<br>
  &raquo; **Netz-Symmetrie**: Der Controller überwacht die AC-Phasen auf Schieflasten. Unregelmäßigkeiten werden geloggt und können auf Probleme im Hausnetz hindeuten.<br>
  &raquo; **Nachts kein Polling**: Der Controller erkennt automatisch Sonnenuntergang und reduziert die Abfrage-Frequenz – schont den Wechselrichter und die Datenbank.<br>
  &raquo; **Backup**: Die SQLite-DB enthält 13 Jahre PV-Historie – mit `make backup` regelmäßig sichern!<br>
{{< /notice >}}
