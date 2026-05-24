# Home Assistant Webhook Integration – Kostal Piko

## Übersicht

Der Kostal-Controller kann Events per Webhook an Home Assistant senden.
Die Webhook-Infrastruktur (`notify_ha`) ist vorbereitet und unterstützt
folgende Events:

| Event | Auslöser | Payload |
|-------|----------|---------|
| `app_start` | Controller gestartet | `version` |
| `app_stop` | Controller gestoppt | `message` |
| `sensor_error` | Wechselrichter 3x nicht erreichbar | `message`, `severity`, `consecutive_errors` |
| `sensor_ok` | Wechselrichter wieder erreichbar | `message`, `after_errors` |
| `daily_summary` | Controller stoppt (letzte Werte) | `power_day`, `power_month`, `power_year` |
| `error` | Kritischer Fehler in der Automatik | `message`, `severity` |

## 1. .env Konfiguration

```env
HA_WEBHOOK_URL=http://10.1.1.217:8123
HA_WEBHOOK_ID=picokostal
```

## 2. Webhook-Aufrufe im Controller

Die Funktion `notify_ha` aus `utils/webhooks.py` kann an beliebiger Stelle
im Controller aufgerufen werden:

```python
from utils.webhooks import notify_ha

# App-Start
notify_ha("app_start", version="2.0.0")

# Sensor-Fehler
notify_ha("sensor_error", message="Wechselrichter nicht erreichbar", severity="warning")

# Sensor wieder OK
notify_ha("sensor_ok", message="Wechselrichter wieder erreichbar")

# Tagesübersicht
notify_ha("daily_summary", power_day=12.5, power_month=245.3, power_year=3120.8)
```

### Payload-Format

Jeder Webhook sendet automatisch:

```json
{
  "event": "<event_name>",
  "device": "dishwasher",
  "timestamp": "2026-05-02T15:30:00",
  ...weitere Felder
}
```

> **Hinweis**: Das `device`-Feld steht aktuell auf `"dishwasher"` und sollte
> auf `"picokostal"` geändert werden (in `utils/webhooks.py`).

## 3. automation.yaml – Webhook-Trigger

```yaml
automation:
  - alias: "Kostal Piko Webhook Empfänger"
    id: picokostal_webhook
    trigger:
      - platform: webhook
        webhook_id: picokostal
        allowed_methods:
          - POST
        local_only: true
    action:
      - choose:
          # ── App gestartet ──
          - conditions:
              - condition: template
                value_template: "{{ trigger.json.event == 'app_start' }}"
            sequence:
              - service: logbook.log
                data:
                  name: Kostal Piko
                  message: "Controller gestartet (v{{ trigger.json.version }})"

          # ── Sensor-Fehler ──
          - conditions:
              - condition: template
                value_template: "{{ trigger.json.event == 'sensor_error' }}"
            sequence:
              - service: persistent_notification.create
                data:
                  title: "⚡ Kostal Piko – Fehler"
                  message: "{{ trigger.json.message }}"
                  notification_id: piko_sensor_error
              - service: notify.notify
                data:
                  title: "⚡ Kostal Piko – Fehler"
                  message: "{{ trigger.json.message }}"

          # ── Sensor OK ──
          - conditions:
              - condition: template
                value_template: "{{ trigger.json.event == 'sensor_ok' }}"
            sequence:
              - service: persistent_notification.dismiss
                data:
                  notification_id: piko_sensor_error
              - service: logbook.log
                data:
                  name: Kostal Piko
                  message: "{{ trigger.json.message }} (nach {{ trigger.json.after_errors }} Fehlern)"

          # ── App gestoppt ──
          - conditions:
              - condition: template
                value_template: "{{ trigger.json.event == 'app_stop' }}"
            sequence:
              - service: logbook.log
                data:
                  name: Kostal Piko
                  message: "{{ trigger.json.message }}"

          # ── Kritischer Fehler ──
          - conditions:
              - condition: template
                value_template: "{{ trigger.json.event == 'error' }}"
            sequence:
              - service: persistent_notification.create
                data:
                  title: "🔴 Kostal Piko – Kritischer Fehler"
                  message: "{{ trigger.json.message }}"
                  notification_id: piko_critical_error
              - service: notify.notify
                data:
                  title: "🔴 Kostal Piko – Kritisch"
                  message: "{{ trigger.json.message }}"

          # ── Tagesübersicht ──
          - conditions:
              - condition: template
                value_template: "{{ trigger.json.event == 'daily_summary' }}"
            sequence:
              - service: logbook.log
                data:
                  name: Kostal Piko
                  message: >
                    Tag: {{ trigger.json.power_day }} kWh ·
                    Monat: {{ trigger.json.power_month }} kWh ·
                    Jahr: {{ trigger.json.power_year }} kWh
              - service: notify.notify
                data:
                  title: "☀️ PV Tagesübersicht"
                  message: >
                    Tag: {{ trigger.json.power_day }} kWh
                    Monat: {{ trigger.json.power_month }} kWh
                    Jahr: {{ trigger.json.power_year }} kWh
```

## 4. Webhook testen

```bash
# App-Start simulieren
curl -X POST http://10.1.1.217:8123/api/webhook/picokostal \
  -H "Content-Type: application/json" \
  -d '{"event": "app_start", "device": "picokostal", "version": "2.0.0"}'

# Sensor-Fehler simulieren
curl -X POST http://10.1.1.217:8123/api/webhook/picokostal \
  -H "Content-Type: application/json" \
  -d '{"event": "sensor_error", "device": "picokostal", "message": "Wechselrichter nicht erreichbar"}'

# Tagesübersicht simulieren
curl -X POST http://10.1.1.217:8123/api/webhook/picokostal \
  -H "Content-Type: application/json" \
  -d '{"event": "daily_summary", "device": "picokostal", "power_day": 12.5, "power_month": 245.3, "power_year": 3120.8}'
```

## 5. Benachrichtigungen anpassen

```yaml
# Beispiel: Mobile App
- service: notify.mobile_app_peter
  data:
    title: "☀️ PV Tagesübersicht"
    message: "{{ trigger.json.power_day }} kWh heute"
    data:
      priority: normal
      channel: solar
```

## Hinweis

Die Webhook-Events sind im Controller aktiv eingebaut:
- `app_start` / `app_stop`: beim Start und Stop der Automatik
- `sensor_error`: nach 3 aufeinanderfolgenden Fehlern (kein Spam bei einzelnen Aussetzern)
- `sensor_ok`: wenn der Wechselrichter nach Fehlern wieder erreichbar ist
- `daily_summary`: beim Stoppen des Controllers (letzte Tageswerte)
- `error`: bei kritischen, unerwarteten Fehlern
