import os
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
df_hourly["Verbrauch"] = (
    df_hourly["day_power"] * solar_profile[df_hourly["stunde"].to_numpy()]
)
df_hourly["Verbrauch"] = df_hourly["Verbrauch"].round(3)

# 3. Hilfsspalten für die Ordnerstruktur extrahieren
df_hourly["Jahr"] = df_hourly["pure_date"].dt.strftime("%Y")
df_hourly["Monat"] = df_hourly["pure_date"].dt.strftime("%m")
df_hourly["Tag"] = df_hourly["pure_date"].dt.strftime("%d")

# Basis-Verzeichnis für den Export definieren
basis_ordner = "./data"

# COUNTER für die Erfolgsmeldung
gespeicherte_dateien = 0

# 4. Daten nach Jahr, Monat und Tag gruppieren und einzeln speichern
for (jahr, monat, tag), gruppe in df_hourly.groupby(["Jahr", "Monat", "Tag"]):
    # Zielordner erstellen (z.B. /dockerapps/apps_v2/hc_pico/data/2024/01)
    ziel_ordner = os.path.join(basis_ordner, jahr, monat)
    os.makedirs(ziel_ordner, exist_ok=True)

    # Dateiname definieren (z.B. 01.csv)
    datei_name = f"{tag}.csv"
    voller_speicher_pfad = os.path.join(ziel_ordner, datei_name)

    # Nur die relevanten Spalten filtern
    export_df = gruppe[["Zeit", "Verbrauch"]].reset_index(drop=True)

    # Speichern mit Semikolon (;) und Dezimal-Komma (,)
    export_df.to_csv(voller_speicher_pfad, sep=";", decimal=",", index=False)
    gespeicherte_dateien += 1

print(
    f"Herausforderung gemeistert! Insgesamt {gespeicherte_dateien} Tages-Dateien in '{basis_ordner}/YYYY/MM/DD.csv' erstellt."
)
