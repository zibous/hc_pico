# import os
# import sqlite3
# import pandas as pd
# from influxdb import InfluxDBClient

# # 1. Daten aus InfluxDB abfragen
# client = InfluxDBClient(
#     host="localhost", port=8086, username="username", password="password", database="pv"
# )

# query = """
# SELECT mean("value") FROM "Wh"
# WHERE ("entity_id" = 'kostal_watt_aktuell')
# AND time >= 1596232800000ms AND time <= 1777672799000ms
# GROUP BY time(1h) fill(null)
# """

# print("Lade Daten aus InfluxDB...")
# result = client.query(query)
# df = pd.DataFrame(list(result.get_points()))

# # 2. Daten bereinigen und transformieren
# df["Zeit"] = pd.to_datetime(df["time"])
# df["Verbrauch"] = df["mean"] / 1000

# # Null-Werte und leere Zeilen strikt löschen
# df = df.dropna(subset=["Verbrauch"])
# df["Verbrauch"] = df["Verbrauch"].round(3)
# df = df[df["Verbrauch"] > 0]

# # Nur die Zielspalten behalten und Zeit für SQLite als Text formatieren (YYYY-MM-DD HH:MM:SS)
# df_final = df[["Zeit", "Verbrauch"]].copy()
# df_final["Zeit"] = df_final["Zeit"].dt.strftime("%Y-%m-%d %H:%M:%S")

# # ==========================================
# # 3. IMPORT IN SQLITE DATENBANK
# # ==========================================
# db_pfad = "/dockerapps/apps_v2/hc_pico/data/datenbank.db"

# # Sicherstellen, dass das Verzeichnis existiert
# os.makedirs(os.path.dirname(db_pfad), exist_ok=True)

# # Verbindung zur SQLite-Datenbank herstellen
# conn = sqlite3.connect(db_pfad)

# print(f"Schreibe {len(df_final)} Datensätze in die SQLite-Datenbank...")

# # Daten in die Tabelle 'photovoltaik_stunden' schreiben
# # if_exists='append': Fügt Daten an. Nutze 'replace', wenn die Tabelle jedes Mal neu erstellt werden soll.
# df_final.to_sql(
#     name="photovoltaik_stunden", con=conn, if_exists="append", index=False
# )

# # Datenbank bereinigen und Speicherplatz optimieren
# print("Führe Datenbank-Bereinigung (VACUUM) durch...")
# conn.execute("VACUUM;")

# # Verbindung schließen
# conn.close()
# print("Import erfolgreich abgeschlossen!")




import os
import sqlite3
import pandas as pd
from influxdb import InfluxDBClient

# 1. Daten aus InfluxDB laden
client = InfluxDBClient(
    host="localhost", port=8086, username="username", password="password", database="pv"
)

query = """
SELECT mean("value") FROM "Wh"
WHERE ("entity_id" = 'kostal_watt_aktuell')
AND time >= 1596232800000ms AND time <= 1777672799000ms
GROUP BY time(1h) fill(null)
"""

print("Lade Daten aus InfluxDB...")
result = client.query(query)
points = list(result.get_points())

if not points:
    print("Keine Daten gefunden.")
    exit()

df = pd.DataFrame(points)

# 2. Daten bereinigen & in deine Struktur umwandeln
df["Zeit"] = pd.to_datetime(df["time"])
df["energy_kwh"] = (df["mean"] / 1000).round(3)

# Keine Nullwerte erlauben
df = df.dropna(subset=["energy_kwh"])
df = df[df["energy_kwh"] > 0]

# Ziel-DataFrame exakt für deine Spalten aufbauen
df_sqlite = pd.DataFrame()

# Festwerte zuweisen
df_sqlite["period_type"] = "hour"

# period_key formatieren: Z.B. '2023-04-02 09'
df_sqlite["period_key"] = df_sqlite["period_key"] = df["Zeit"].dt.strftime("%Y-%m-%d %H")

# Energiewert (Als echte SQL-Fließkommazahl, kein String mit Komma!)
df_sqlite["energy_kwh"] = df["energy_kwh"]

# last_update im ISO8601-Format (UTC-Z-Suffix, falls die DB das erwartet)
df_sqlite["last_update"] = df["Zeit"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")

# ==========================================
# 3. UPSERT IN DIE SQLITE-DATENBANK
# ==========================================
db_pfad = "/dockerapps/apps_v2/hc_pico/data/datenbank.db"
conn = sqlite3.connect(db_pfad)
cursor = conn.cursor()

# Sicherstellen, dass Tabelle und Index existieren
cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS pv_history (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        period_type     TEXT    NOT NULL,
        period_key      TEXT    NOT NULL,
        energy_kwh      REAL    NOT NULL DEFAULT 0.0,
        last_update     TEXT    NOT NULL,
        UNIQUE(period_type, period_key)
    );
"""
)
cursor.execute(
    "CREATE INDEX IF NOT EXISTS idx_history_period ON pv_history(period_type, period_key);"
)

print(f"Importiere {len(df_sqlite)} Zeilen via UPSERT...")

# Daten zeilenweise als UPSERT einfügen
# Falls (period_type, period_key) kollidiert, wird der Ertrag und das Update-Datum aktualisiert
upsert_sql = """
INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
VALUES (?, ?, ?, ?)
ON CONFLICT(period_type, period_key) DO UPDATE SET
    energy_kwh = excluded.energy_kwh,
    last_update = excluded.last_update;
"""

# Konvertiert das DataFrame in eine Liste von Tupeln für das Ausführen im Batch
daten_tupel = list(
    df_sqlite[
        ["period_type", "period_key", "energy_kwh", "last_update"]
    ].itertuples(index=False, name=None)
)

cursor.executemany(upsert_sql, daten_tupel)
conn.commit()

# Datenbank komprimieren
print("Führe VACUUM aus...")
cursor.execute("VACUUM;")
conn.commit()

conn.close()
print("Erfolgreich in 'pv_history' importiert!")
