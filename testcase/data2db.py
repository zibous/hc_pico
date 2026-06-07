import os
import sqlite3
import numpy as np
import pandas as pd


def generate_east_west_profile():
    """Erzeugt ein normiertes 24-Stunden-PV-Profil für eine Ost/West-Anlage."""
    hours = np.arange(24)

    # Ost-Dach (Peak um 10:00 Uhr)
    peak_east = 10.0
    std_east = 2.2
    profile_east = np.exp(-0.5 * ((hours - peak_east) / std_east) ** 2)
    profile_east[hours < 9] = 0
    profile_east[hours > 15] = 0

    # West-Dach (Peak um 16:00 Uhr)
    peak_west = 16.0
    std_west = 2.2
    profile_west = np.exp(-0.5 * ((hours - peak_west) / std_west) ** 2)
    profile_west[hours < 11] = 0
    profile_west[hours > 18] = 0

    # Kombinieren (50% Ost / 50% West) und normieren
    p_east_n = profile_east / profile_east.sum()
    p_west_n = profile_west / profile_west.sum()
    return (p_east_n * 0.5) + (p_west_n * 0.5)


# 1. Datei laden & bereinigen
datei_pfad = "/dockerapps/apps_v2/hc_pico/data/influx/kostal.csv"
df = pd.read_csv(datei_pfad)

df = df.dropna(subset=["day_power"])
df["time"] = pd.to_datetime(df["time"], unit="ns")
df["pure_date"] = df["time"].dt.normalize()

# Nur den letzten gemeldeten Tageswert behalten
df_daily = df.sort_values("time").groupby(["pure_date"]).last().reset_index()

# 2. Vektorisierte stündliche Verteilung
solar_profile = generate_east_west_profile()
total_days = len(df_daily)

df_hourly = df_daily.loc[df_daily.index.repeat(24)].copy()
df_hourly["stunde"] = np.tile(np.arange(24), total_days)

# Den neuen, exakten stündlichen Zeitstempel berechnen
df_hourly["Zeit"] = df_hourly["pure_date"] + pd.to_timedelta(
    df_hourly["stunde"], unit="h"
)

# Ertrag berechnen
df_hourly["energy_kwh"] = (
    df_hourly["day_power"] * solar_profile[df_hourly["stunde"].to_numpy()]
)
df_hourly["energy_kwh"] = df_hourly["energy_kwh"].round(3)

# ==========================================
# FILTER & STRUKTURIERUNG FÜR DEINE SQLITE DB
# ==========================================
# 1. Alle Zeilen löschen, bei denen der berechnete Ertrag 0 ist (z.B. Nachtstunden)
df_hourly = df_hourly[df_hourly["energy_kwh"] > 0]

# 2. Ziel-DataFrame exakt für dein Datenbankschema aufbauen
df_sqlite = pd.DataFrame()
df_sqlite["period_type"] = "hour"

# period_key exakt formatiert (z.B. '2023-04-02 09')
df_sqlite["period_key"] = df_hourly["Zeit"].dt.strftime("%Y-%m-%d %H")

# Ertrag als mathematische Fließkommazahl (REAL) mit Punkt hinterlegen
df_sqlite["energy_kwh"] = df_hourly["energy_kwh"]

# last_update im ISO8601-Format (UTC/Z-Format oder lokal, je nach Systemzeit)
# Verwendet die aktuelle Echtzeit des Skript-Ausführens als Update-Zeitstempel
df_sqlite["last_update"] = pd.Timestamp.now().strftime("%Y-%m-%dT%H:%M:%SZ")

# ==========================================
# 3. VERBINDUNG ZU SQLITE & UPSERT-IMPORT
# ==========================================
db_pfad = "/dockerapps/apps_v2/hc_pico/data/datenbank.db"

# Sicherstellen, dass der Ordner der DB existiert
os.makedirs(os.path.dirname(db_pfad), exist_ok=True)

conn = sqlite3.connect(db_pfad)
cursor = conn.cursor()

# Tabelle und Index anlegen, falls noch nicht vorhanden
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

print(f"Starte Import von {len(df_sqlite)} stündlichen Datensätzen...")

# UPSERT-Logik: Bei Duplikaten (period_type + period_key) wird der Wert überschrieben
upsert_sql = """
INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
VALUES (?, ?, ?, ?)
ON CONFLICT(period_type, period_key) DO UPDATE SET
    energy_kwh = excluded.energy_kwh,
    last_update = excluded.last_update;
"""

# DataFrame in Tupel-Liste für schnellen Batch-Import konvertieren
daten_tupel = list(
    df_sqlite[
        ["period_type", "period_key", "energy_kwh", "last_update"]
    ].itertuples(index=False, name=None)
)

# Alle Zeilen hocheffizient in einem Rutsch ausführen
cursor.executemany(upsert_sql, daten_tupel)
conn.commit()

# Datenbank bereinigen und defragmentieren
print("Führe abschließendes VACUUM aus...")
cursor.execute("VACUUM;")
conn.commit()

conn.close()
print("Erfolgreich beendet! Alle PV-Stundenprofile importiert.")
