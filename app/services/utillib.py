# -*- coding: utf-8 -*-

"""
utillib.py – Hilfsfunktionen

Enthält:
- parse_esphome_timestamp: ESPHome-Zeitstempel → ISO8601
- calcRunningTime: Minuten → lesbare Laufzeit
- DataWrapper: Attribut-Zugriff auf Dict-Daten
- flatten_dict: Verschachtelte Dicts CSV-tauglich flatten (None → "never")
- append_csv: Sichere CSV-Ausgabe (inkl. flatten + Fehlerbehandlung)
- savefile: Atomisches Speichern von JSON/Text
- loadjsondata: JSON laden mit Fallback
- deep_set: Sicheres Setzen in verschachtelten Dict/List-Strukturen
- deep_get: Sicheres Lesen aus verschachtelten Dict/List-Strukturen
"""

import os
import csv
import json
from typing import Any, Union, Optional
from datetime import datetime, timezone, timedelta
from app.core.logging import setup_logger

logger = setup_logger("utillib")

# ---------------------------------------------------------
# ESPHome Timestamp Parser
# ---------------------------------------------------------

def parse_esphome_timestamp(ts: str) -> Optional[str]:
    """
    Wandelt ESPHome-Timestamps wie:
        '2026-01-28T18:37:28 CET'
        '2026-01-28T18:37:28 CEST'

    in ISO8601 mit expliziter Zeitzone um.

    Returns:
        ISO8601 String oder None bei Fehlern
    """
    if not ts or not isinstance(ts, str):
        return None

    tz_map = {
        " CET": timezone(timedelta(hours=1)),
        " CEST": timezone(timedelta(hours=2)),
    }

    offset = timezone.utc
    for suffix, tz in tz_map.items():
        if ts.endswith(suffix):
            ts = ts.replace(suffix, "")
            offset = tz
            break

    try:
        dt = datetime.fromisoformat(ts)
        return dt.replace(tzinfo=offset).isoformat(timespec="seconds")
    except ValueError:
        logger.warning(f"Invalid ESPHome timestamp: {ts}")
        return None


# ---------------------------------------------------------
# Laufzeitberechnung
# ---------------------------------------------------------

def calcRunningTime(total_minutes: int) -> str:
    """
    Wandelt Minuten in eine lesbare Laufzeit um.
    """
    minutes = max(0, int(total_minutes))

    years, minutes = divmod(minutes, 12 * 30 * 24 * 60)
    months, minutes = divmod(minutes, 30 * 24 * 60)
    days, minutes = divmod(minutes, 24 * 60)
    hours, minutes = divmod(minutes, 60)

    def fmt(value, singular, plural):
        return f"{value} {singular if value == 1 else plural}" if value > 0 else None

    parts = [
        fmt(years, "Jahr", "Jahre"),
        fmt(months, "Monat", "Monate"),
        fmt(days, "Tag", "Tage"),
        fmt(hours, "Stunde", "Stunden"),
        fmt(minutes, "Minute", "Minuten"),
    ]

    parts = [p for p in parts if p]
    return ", ".join(parts) if parts else "0 Minuten"


# ---------------------------------------------------------
# DataWrapper
# ---------------------------------------------------------

class DataWrapper:
    """
    Ermöglicht Attribut-Zugriff auf Dictionary-Daten.
    """

    def __init__(self, data: dict):
        if not isinstance(data, dict):
            raise TypeError("DataWrapper erwartet ein dict")
        self._data = data

    def __getattr__(self, name):
        return self._data.get(name, 0.0)

    def __setattr__(self, name, value):
        if name == "_data":
            super().__setattr__(name, value)
        else:
            self._data[name] = value


# ---------------------------------------------------------
# flatten_dict
# ---------------------------------------------------------

def flatten_dict(d: dict, parent_key: str = "", sep: str = "_") -> dict:
    """
    Wandelt verschachtelte Dictionaries in ein flaches Dict um.

    Regeln:
    - Dicts werden rekursiv aufgelöst
    - Listen werden JSON-serialisiert (CSV-tauglich)
    - None-Werte werden explizit als String "never" gespeichert

    Beispiel:
        {"a": {"b": None}} → {"a_b": "never"}
    """
    if not isinstance(d, dict):
        raise TypeError("flatten_dict erwartet ein dict")

    items = {}

    for k, v in d.items():
        key = str(k)
        new_key = f"{parent_key}{sep}{key}" if parent_key else key

        if isinstance(v, dict):
            items.update(flatten_dict(v, new_key, sep))

        elif isinstance(v, list):
            items[new_key] = json.dumps(v, ensure_ascii=False)

        elif v is None:
            items[new_key] = "never"

        else:
            items[new_key] = v

    return items


# ---------------------------------------------------------
# CSV Writer
# ---------------------------------------------------------

def append_csv(filepath: str, row: dict):
    """
    Hängt eine Zeile an eine CSV-Datei an.

    Features:
    - akzeptiert verschachtelte Dicts
    - flatten_dict intern
    - stabile Header (alphabetisch sortiert)
    - Fehler werden geloggt
    """
    try:
        if not isinstance(row, dict):
            raise TypeError("append_csv erwartet ein dict")

        flat_row = flatten_dict(row)
        fieldnames = sorted(flat_row.keys())
        file_exists = os.path.isfile(filepath)

        with open(filepath, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(
                f,
                fieldnames=fieldnames,
                extrasaction="ignore"
            )

            if not file_exists:
                writer.writeheader()

            writer.writerow(flat_row)

    except Exception:
        logger.exception(f"CSV write failed ({filepath})")


# ---------------------------------------------------------
# savefile
# ---------------------------------------------------------

def savefile(content: Any = None, filename: str | None = None, datatype: str = "json") -> bool:
    """
    Speichert Daten atomisch als JSON oder Text.
    """
    if content is None or not filename:
        return False

    try:
        dir_path = os.path.dirname(filename)
        if dir_path:
            os.makedirs(dir_path, exist_ok=True)

        tmp_file = f"{filename}.tmp"

        with open(tmp_file, "w", encoding="utf8") as f:
            if datatype == "json":
                json.dump(content, f, indent=4, ensure_ascii=False)
            elif datatype == "text":
                f.write(str(content))
            else:
                return False

        os.replace(tmp_file, filename)
        return True

    except Exception as e:
        logger.error(f"savefile failed ({filename}): {e}")
        return False


# ---------------------------------------------------------
# loadjsondata
# ---------------------------------------------------------

def loadjsondata(filename: str | None = None, fallback: str = "") -> dict:
    """
    Lädt JSON-Daten aus einer Datei, optional mit Fallback.
    """
    if not filename:
        return {}

    if fallback and not os.path.isfile(filename):
        filename = filename[:-5] + fallback if filename.endswith(".json") else fallback

    if os.path.isfile(filename):
        with open(filename, "r", encoding="utf8") as f:
            return json.load(f)

    return {}


# ---------------------------------------------------------
# deep_set
# ---------------------------------------------------------

def deep_set(data: Union[dict, list], path: str, value: Any) -> Union[dict, list]:
    """
    Setzt einen Wert in einer verschachtelten Dict/List-Struktur
    anhand eines Dot-Pfades.
    """
    keys = path.split(".")
    current = data

    for i, key in enumerate(keys):
        is_last = i == len(keys) - 1

        if isinstance(current, list):
            index = int(key)
            while len(current) <= index:
                current.append({})

            if is_last:
                current[index] = value
                return data

            if not isinstance(current[index], (dict, list)):
                current[index] = {}

            current = current[index]
            continue

        if isinstance(current, dict):
            if is_last:
                current[key] = value
                return data

            if key not in current or not isinstance(current[key], (dict, list)):
                current[key] = [] if keys[i + 1].isdigit() else {}

            current = current[key]
            continue

        raise TypeError(f"deep_set kann nicht in Typ {type(current)} schreiben")

    return data


# ---------------------------------------------------------
# deep_get
# ---------------------------------------------------------

def deep_get(data: Any, path: str, default: Any = None, as_float: bool = False) -> Any:
    """
    Liest sicher einen Wert aus verschachtelten Dict/List-Strukturen.
    """
    keys = path.split(".")
    current = data

    for key in keys:
        if isinstance(current, dict):
            if key not in current:
                return default
            current = current[key]

        elif isinstance(current, list):
            try:
                current = current[int(key)]
            except (ValueError, IndexError):
                return default
        else:
            return default

    if as_float:
        try:
            return float(current)
        except (ValueError, TypeError):
            return default

    return current
