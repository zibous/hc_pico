// frontend/static/js/v3/tiles-data.js
import { AppleTile } from './tile.js';

export function createTilesConfiguration() {
  return {
    perf: new AppleTile('perf', 'Leistungsübersicht', 'curpower', 'var(--accent)', [
      { id: 'mode', label: 'Wechselrichter' },
      { id: 'now_w', label: 'Aktuelle Leistung', unit: 'W', trend: true, progress: true },
      { id: 'today', label: 'Ertrag Heute', unit: 'kWh', progress: true },
      { id: 'week', label: 'Ertrag Woche', unit: 'kWh' },
      { id: 'month', label: 'Ertrag Monat', unit: 'kWh' },
      { id: 'year', label: 'Ertrag Jahr', unit: 'kWh' }
    ]),
    grid: new AppleTile('grid', 'Netz-Analyse & Qualität', 'symmetry', 'var(--orange)', [
      { id: 'l1_v', label: 'Netzspannung L1', unit: 'V' },
      { id: 'l2_v', label: 'Netzspannung L2', unit: 'V' },
      { id: 'l3_v', label: 'Netzspannung L3', unit: 'V' },
      { id: 'imbalance', label: 'Schieflast (Symmetrie)', unit: 'W', trend: true },
      { id: 'apparent', label: 'Scheinleistung', unit: 'VA' },
      { id: 'reactive', label: 'Blindleistung', unit: 'var', trend: true }
    ]),
    // 🌟 ERWEITERT: Perfekt strukturiert ohne Code-Abbrüche
    wr: new AppleTile('wr', 'Wechselrichter-Analyse', 'efficiency', 'var(--accent)', [
      { id: 'dc_total', label: 'Gleichstrom DC-Input', unit: 'W' },
      { id: 'ac_total', label: 'Wechselstrom AC-Output', unit: 'W' },
      { id: 'loss', label: 'Verlustleistung', unit: 'W' },
      { id: 'eff_pct', label: 'Wirkungsgrad', unit: '%', trend: true, progress: true },
      { id: 'eff_soll', label: 'Tagesprognose (Soll)', unit: 'kWh' },
      { id: 'eff_ratio', label: 'Performance Ratio', unit: '%', progress: true },
      { id: 'weather', label: 'Himmel-Klarheit' }
    ]),
    env: new AppleTile('env', 'CO₂ Umwelt-Bilanz', 'co2', 'var(--green)', [
      { id: 'co2_today', label: 'Vermeidung Heute', unit: 'kg' },
      { id: 'co2_kg', label: 'Vermeidung Gesamt', unit: 'kg' },
      { id: 'co2_t', label: 'Vermeidung Gesamt', unit: 't' },
      { id: 'trees', label: 'Gepflanzte Bäume', unit: 'Stk' },
      { id: 'car_km', label: 'E-Auto Reichweite', unit: 'km' }
    ]),
    sys: new AppleTile('sys', 'System- & Metadaten', 'clock', 'var(--text-sub)', [
      { id: 'sys_time', label: 'Letztes API-Update' },
      { id: 'sys_vendor', label: 'Hersteller (Marke)' },
      { id: 'sys_name', label: 'Hardware (Modell)' },
      { id: 'sys_runtime', label: 'Laufzeit (Betrieb)' },
      { id: 'sys_hours', label: 'Produktionsstunden', unit: 'h' }
    ])
  };
}
