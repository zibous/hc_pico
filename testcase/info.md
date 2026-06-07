# SQLite PV-Historie: Aggregations-Statements

Diese Dokumentation enthält die SQL-Statements zur Auswertung der stündlichen PV-Ertragsdaten (`period_type = 'hour'`) aus der Tabelle `pv_history`.

---

## 1. Reine Datenabfrage (SELECT)

Mit diesen Statements werden die stündlichen Werte live für die gewünschte Granularität zusammengerechnet und absteigend sortiert ausgegeben.

### Gesamtenergie pro Tag (Day)
Fasst die Stundenwerte im Format `YYYY-MM-DD` zusammen.
```sql
SELECT
    substr(period_key, 1, 10) AS Tag,
    round(sum(energy_kwh), 3) AS Gesamt_kWh
FROM pv_history
WHERE period_type = 'hour'
GROUP BY Tag
ORDER BY Tag DESC;
```

### Gesamtenergie pro Monat (Month)
Fasst die Stundenwerte im Format `YYYY-MM` zusammen.
```sql
SELECT
    substr(period_key, 1, 7) AS Monat,
    round(sum(energy_kwh), 3) AS Gesamt_kWh
FROM pv_history
WHERE period_type = 'hour'
GROUP BY Monat
ORDER BY Monat DESC;
```

### Gesamtenergie pro Jahr (Year)
Fasst die Stundenwerte im Format `YYYY` zusammen.
```sql
SELECT
    substr(period_key, 1, 4) AS Jahr,
    round(sum(energy_kwh), 3) AS Gesamt_kWh
FROM pv_history
WHERE period_type = 'hour'
GROUP BY Jahr
ORDER BY Jahr DESC;
```

---

## 2. Werte in die Tabelle zurückschreiben (UPSERT)

Diese Befehle berechnen die Summen und schreiben das Ergebnis mit dem korrekten `period_type` (`day`, `month`, `year`) direkt zurück in die Tabelle `pv_history`. Dank der `ON CONFLICT`-Logik werden bestehende Werte bei einer erneuten Ausführung aktualisiert statt dupliziert.

```sql
-- =====================================================================
-- 1. TAGE BEFÜLLEN (period_type = 'day')
-- =====================================================================
INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
SELECT
    'day',
    substr(period_key, 1, 10) as p_key,
    round(sum(energy_kwh), 3),
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
FROM pv_history
WHERE period_type = 'hour'
GROUP BY p_key
ON CONFLICT(period_type, period_key) DO UPDATE SET
    energy_kwh = excluded.energy_kwh,
    last_update = excluded.last_update;

-- =====================================================================
-- 2. MONATE BEFÜLLEN (period_type = 'month')
-- =====================================================================
INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
SELECT
    'month',
    substr(period_key, 1, 7) as p_key,
    round(sum(energy_kwh), 3),
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
FROM pv_history
WHERE period_type = 'hour'
GROUP BY p_key
ON CONFLICT(period_type, period_key) DO UPDATE SET
    energy_kwh = excluded.energy_kwh,
    last_update = excluded.last_update;

-- =====================================================================
-- 3. JAHRE BEFÜLLEN (period_type = 'year')
-- =====================================================================
INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
SELECT
    'year',
    substr(period_key, 1, 4) as p_key,
    round(sum(energy_kwh), 3),
    strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
FROM pv_history
WHERE period_type = 'hour'
GROUP BY p_key
ON CONFLICT(period_type, period_key) DO UPDATE SET
    energy_kwh = excluded.energy_kwh,
    last_update = excluded.last_update;
```
