import os
import pandas as pd
from influxdb import InfluxDBClient

# 1. Verbindung zur InfluxDB herstellen
client = InfluxDBClient(
    host="zeusus.siebler.home",
    port=8086,
    username="hauser",
    password="xJs8VFB4F6f4Sg2GT7qg",
    database="home_assistant",
)

# Deine exakte Query aus Grafana
query = """
SELECT mean("value") FROM "Wh"
WHERE ("entity_id" = 'kostal_watt_aktuell')
AND time >= 1596232800000ms AND time <= 1777672799000ms
GROUP BY time(1h) fill(null)
"""

print("Starte Abfrage an InfluxDB...")
result = client.query(query)
points = list(result.get_points())

if not points:
    print("Keine Daten gefunden.")
    exit()

df = pd.DataFrame(points)

# Zeitstempel konvertieren
df["Zeit"] = pd.to_datetime(df["time"])

# Umrechnung in kWh (Watt / 1000)
df["Verbrauch"] = df["mean"] / 1000

# ==========================================
# FILTER: STRANGEST KEINE NULL-WERTE ODER LEERZEILEN
# ==========================================
# 1. Löscht alle Zeilen, die durch 'fill(null)' leer sind (NaN)
df = df.dropna(subset=["Verbrauch"])

# 2. Rundung auf 3 Nachkommastellen erst NACH dem Löschen der NaNs
df["Verbrauch"] = df["Verbrauch"].round(3)

# 3. Filtert alle echten Nullen (0.0, 0.000) und negativen Werte heraus
df = df[df["Verbrauch"] > 0]

# 4. Hilfsspalten für die Ordnerstruktur extrahieren
df["Jahr"] = df["Zeit"].dt.strftime("%Y")
df["Monat"] = df["Zeit"].dt.strftime("%m")
df["Tag"] = df["Zeit"].dt.strftime("%d")

basis_ordner = "./data2"
gespeicherte_dateien = 0

# 5. Daten nach Jahr, Monat und Tag gruppieren und speichern
for (jahr, monat, tag), gruppe in df.groupby(["Jahr", "Monat", "Tag"]):
    # Zielordner erstellen
    ziel_ordner = os.path.join(basis_ordner, jahr, monat)
    os.makedirs(ziel_ordner, exist_ok=True)

    # Dateiname definieren
    datei_name = f"{tag}.csv"
    voller_speicher_pfad = os.path.join(ziel_ordner, datei_name)

    # Spalten für Ausgabe vorbereiten
    export_df = gruppe[["Zeit", "Verbrauch"]].copy()
    export_df["Zeit"] = export_df["Zeit"].dt.strftime("%Y-%m-%d %H:%M:%S")

    # Als CSV speichern mit Semikolon (;) und Dezimal-Komma (,)
    export_df.to_csv(voller_speicher_pfad, sep=";", decimal=",", index=False)
    gespeicherte_dateien += 1

print(
    f"\nFertig! {gespeicherte_dateien} Tages-Dateien ohne jegliche Null-Werte generiert."
)
