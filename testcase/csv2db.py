import glob
import os
import sqlite3
import pandas as pd

# ==========================================
# 1. ALLE CSV-DATEIEN SUCHEN
# ==========================================
# Sucht rekursiv nach allen CSV-Dateien im Verzeichnis und allen Unterordnern
basis_such_ordner = "./data"
basis_such_ordner = "./data2"

such_muster = os.path.join(basis_such_ordner, "**", "*.csv")
csv_dateien = glob.glob(such_muster, recursive=True)

print(f"Es wurden {len(csv_dateien)} CSV-Dateien zum Importieren gefunden.")

if not csv_dateien:
    print("Keine Dateien gefunden. Skript wird beendet.")
    exit()

# Liste zum Sammeln aller Datenzeilen vor dem Datenbank-Import
alle_daten = []

# ==========================================
# 2. DATEIEN EINLESEN & VERARBEITEN
# ==========================================
for datei in csv_dateien:
    try:
        # CSV einlesen (erwartet Semikolon als Trenner und Komma als Dezimalzeichen)
        df = pd.read_csv(datei, sep=";", decimal=",")

        # Spaltennamen zur Sicherheit bereinigen (Leerzeichen entfernen)
        df.columns = df.columns.str.strip()

        # Prüfen, ob die benötigten Spalten existieren
        if "Zeit" not in df.columns or "Verbrauch" not in df.columns:
            print(f"Überspringe {datei}: Falsches Spaltenformat.")
            continue

        # Konvertiere Zeit-Spalte in ein echtes Datum
        df["Zeit_parsed"] = pd.to_datetime(df["Zeit"])

        # Zeilen mit 0 oder leere Werte (NaN) direkt aussortieren
        df = df.dropna(subset=["Verbrauch"])
        df = df[df["Verbrauch"] > 0]

        # In deine Zielstruktur für die SQLite-Datenbank überführen
        for _, row in df.iterrows():
            alle_daten.append(
                {
                    "period_type": "hour",
                    # Kürzt '2020-08-01 04:00:00' zu '2020-08-01 04'
                    "period_key": row["Zeit_parsed"].strftime("%Y-%m-%d %H"),
                    "energy_kwh": round(float(row["Verbrauch"]), 3),
                    "last_update": pd.Timestamp.now().strftime(
                        "%Y-%m-%dT%H:%M:%SZ"
                    ),
                }
            )

    except Exception as e:
        print(f"Fehler beim Lesen der Datei {datei}: {e}")

# Wenn nach dem Filtern Daten übrig bleiben, ab in die Datenbank
if not alle_daten:
    print("Keine gültigen Datenpunkte (> 0) in den CSV-Dateien gefunden.")
    exit()

# Umwandlung in ein finales Pandas DataFrame für den Import
df_import = pd.DataFrame(alle_daten)

# ==========================================
# 3. UPSERT-IMPORT IN DIE SQLITE-DATENBANK
# ==========================================
db_pfad = "./data/picodata.db"
conn = sqlite3.connect(db_pfad)
cursor = conn.cursor()

# Tabelle und Index anlegen (falls noch nicht vorhanden)
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

print(f"Starte UPSERT von {len(df_import)} Datensätzen in die Datenbank...")

upsert_sql = """
INSERT INTO pv_history (period_type, period_key, energy_kwh, last_update)
VALUES (?, ?, ?, ?)
ON CONFLICT(period_type, period_key) DO UPDATE SET
    energy_kwh = excluded.energy_kwh,
    last_update = excluded.last_update;
"""

# Konvertierung in Tupel-Liste für schnellen Batch-Import
daten_tupel = list(
    df_import[
        ["period_type", "period_key", "energy_kwh", "last_update"]
    ].itertuples(index=False, name=None)
)

# Batch-Import ausführen
cursor.executemany(upsert_sql, daten_tupel)
conn.commit()

# Speicherplatz optimieren
print("Führe abschließendes VACUUM aus...")
cursor.execute("VACUUM;")
conn.commit()

conn.close()
print("Import aller CSV-Dateien erfolgreich abgeschlossen!")
