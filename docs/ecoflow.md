

## EcoFlow Delta Pro 3: Lokales Überschussladen

```yaml
alias: "EcoFlow Delta Pro 3: Lokales Überschussladen (Ohne Cloud)"
description: "Regelt die AC-Ladeleistung stufenlos via Bluetooth basierend auf dem HomeWizard P1 Meter."
trigger:
  - platform: time_pattern
    seconds: "/15" # Kurzer lokaler Takt für schnelle Reaktion bei Wolkenwechseln
condition:
  # Die Automation läuft nur, wenn die Powerstation via Bluetooth erreichbar ist
  - condition: not
    conditions:
      - condition: state
        entity_id: number.ecoflow_ac_charging_power_ble
        state: "unavailable"
action:
  - service: number.set_value
    target:
      entity_id: number.ecoflow_ac_charging_power_ble # Die lokale BLE-Entität deiner Delta Pro 3
    data:
      value: >
        {# Aktuellen Netzbezug/Einspeisung auslesen (Negativ = Überschuss) #}
        {% set p1_wert = states('sensor.p1_meter_active_power') | float(0) %}

        {# Aktuelle Ladeleistung der Delta Pro 3 auslesen #}
        {% set aktuelle_ladung = states('sensor.ecoflow_ac_input_power_ble') | float(0) %}

        {# Überschuss umrechnen: Negativer P1-Wert wird zu positivem Watt-Überschuss #}
        {% set ueberschuss = p1_wert * -1 %}

        {# Verfügbares Gesamtbudget für die Ladung berechnen #}
        {% set neues_ladeziel = aktuelle_ladung + ueberschuss %}

        {# Technische Grenzen der Delta Pro 3 absichern #}
        {# Das minimale AC-Limit liegt meist bei 200W, das Maximum bei 3000W #}
        {% if neues_ladeziel > 3000 %}
          3000
        {% elif neues_ladeziel < 200 %}
          {# Unter 200W stoppen wir das Laden über den Schalter, um Eigenverbrauch zu minimieren #}
          200
        {% else %}
          {{ neues_ladeziel | int }}
        {% endif %}

  # Optionaler Schutz: Schaltet das AC-Laden komplett ab, wenn nicht einmal 200W Überschuss da sind
  - choose:
      - conditions:
          - condition: template
            value_template: "{{ (states('sensor.p1_meter_active_power') | float(0)) > 50 and (states('sensor.ecoflow_ac_input_power_ble') | float(0)) <= 200 }}"
        sequence:
          - service: switch.turn_off
            target:
              entity_id: switch.ecoflow_ac_charging_switch_ble # Optionaler lokaler Ladeschalter
    default:
      - conditions:
          - condition: numeric_state
            entity_id: sensor.p1_meter_active_power
            below: -250 # Schaltet das Laden wieder ein, sobald stabil Überschuss anliegt
        sequence:
          - service: switch.turn_on
            target:
              entity_id: switch.ecoflow_ac_charging_switch_ble

```

Damit Home Assistant die Watt-Zahl überhaupt verändern darf, musst du den physischen Kippschalter
an der Rückseite der Delta Pro 3 (neben dem Kaltgeräte-Wechselstromeingang) zwingend auf die Position "ADJUST" stellen.
Steht dieser Schalter auf "FAST", ignoriert die Elektronik der Powerstation jegliche externen Softwarebefehle
zur Leistungsbegrenzung und zieht stattdessen dauerhaft.

https://github.com/rabits/ha-ef-ble