// frontend/static/js/v3/tiles.js
import { createTilesConfiguration } from './tiles-data.js';
import { formatNum, getStatusColor } from './utils.js';

let tilesInstances = {};

export function initTilesContainer() {
  const container = document.getElementById('tiles-render-bridge');
  if (!container) return;

  tilesInstances = createTilesConfiguration();
  let gridHtml = '';
  Object.values(tilesInstances).forEach(tile => { gridHtml += tile.render(); });

  gridHtml += `
    <div class="apple-card graphic-card" id="sun-animation-container">
      <div style="color: var(--text-sub); font-size: 13px; font-weight: 500;">Initialisiere Grafik...</div>
    </div>
  `;
  container.innerHTML = gridHtml;
}

export function renderTiles(current, summary, chart, meta) {
  if (!current || !summary || Object.keys(tilesInstances).length === 0) return;

  const modeColor = getStatusColor(current.mode);
  const valuesHistory = chart && chart.values ? chart.values : [];

  // 1. Kachel: Leistungsübersicht
  const tPerf = tilesInstances.perf;
  tPerf.updateStatus(current.mode || 'Aus', modeColor);
  tPerf.updateValue('mode', current.mode || 'Aus', modeColor);
  tPerf.updateValue('now_w', formatNum(current.current_power_w, 0));
  tPerf.updateProgress('now_w', current.perf ? current.perf.utilization_pct : 0);
  if (valuesHistory.length > 0) tPerf.drawTrend('now_w', valuesHistory);
  tPerf.updateValue('today', formatNum(summary.today_kwh, 1));
  tPerf.updateProgress('today', current.perf ? current.perf.daily_target_achievement_percent : (summary.today_kwh / 10.84) * 100);
  tPerf.updateValue('week', formatNum(summary.week_kwh, 1));
  tPerf.updateValue('month', formatNum(summary.month_kwh, 1));
  tPerf.updateValue('year', formatNum(summary.year_kwh, 1));

  // 2. Kachel: Netz-Analyse & Qualität (Kombiniert mit Netz-Symmetrie!)
  const tGrid = tilesInstances.grid;
  const gridData = current.grid || { imbalance_w: 0, status: 'standby', apparent_va: 0, reactive_var: 0 };
  tGrid.updateStatus(gridData.status, getStatusColor(gridData.status));
  tGrid.updateValue('l1_v', formatNum(current.l1_voltage, 0));
  tGrid.updateValue('l2_v', formatNum(current.l2_voltage, 0));
  tGrid.updateValue('l3_v', formatNum(current.l3_voltage, 0));
  tGrid.updateValue('imbalance', `${formatNum(gridData.imbalance_w, 0)} W`, gridData.imbalance_w > 1000 ? 'var(--orange)' : null);
  tGrid.updateValue('apparent', formatNum(gridData.apparent_va, 0));
  tGrid.updateValue('reactive', formatNum(gridData.reactive_var, 0));
  if (gridData.reactive_var !== undefined) tGrid.drawTrend('reactive', [150, 280, gridData.reactive_var]);
  if (gridData.imbalance_w !== undefined) tGrid.drawTrend('imbalance', [500, 200, gridData.imbalance_w]);

  // 3. Kachel: Wechselrichter-Analyse (Kombiniert mit Wirkungsgrad & Sonnen-Rating!)
  const tWr = tilesInstances.wr;
  const wrData = current.wr || { dc_total_w: 0, efficiency_pct: 0, loss_w: 0 };
  const utilization = current.perf ? current.perf.utilization_pct : 0;
  const sunRating = utilization > 75 ? 'Sonnig (Peak)' : utilization > 40 ? 'Leicht bewölkt' : utilization > 5 ? 'Stark bewölkt' : 'Standby';

  tWr.updateStatus(current.mode == "Einspeisen MPP" ? "ONLINE" : "STANDBY", modeColor);
  tWr.updateValue('dc_total', formatNum(wrData.dc_total_w, 0));
  tWr.updateValue('ac_total', formatNum(current.gesamtleistung_w, 0));
  tWr.updateValue('loss', formatNum(wrData.loss_w, 0));
  tWr.updateValue('eff_pct', formatNum(wrData.efficiency_pct, 2));
  tWr.updateProgress('eff_pct', wrData.efficiency_pct);
  tWr.updateValue('weather', sunRating, utilization > 40 ? 'var(--orange)' : null);
  if (wrData.efficiency_pct > 0) tWr.drawTrend('eff_pct', [85, 90, wrData.efficiency_pct]);

  // 4. Kachel: CO₂ Umwelt-Bilanz (Kombiniert mit Heute + Gesamtwerten!)
  const tEnv = tilesInstances.env;
  const envToday = summary.env?.today || { co2_kg: 0 };
  const envYear = summary.env ? summary.env.year : { co2_kg: 0, trees: 0, car_km: 0 };
  tEnv.updateStatus("AKTUELL", 'var(--green)');
  tEnv.updateValue('co2_today', formatNum(envToday.co2_kg, 2));
  tEnv.updateValue('co2_kg', formatNum(envYear.co2_kg, 1));
  tEnv.updateValue('co2_t', formatNum(envYear.co2_kg / 1000, 3));
  tEnv.updateValue('trees', formatNum(envYear.trees, 0));
  tEnv.updateValue('car_km', formatNum(envYear.car_km, 0));

  // 5. Kachel: System-Metadaten
  if (meta) {
    const tSys = tilesInstances.sys;
    tSys.updateStatus(meta.dataservice || 'offline', getStatusColor(meta.dataservice));
    tSys.updateValue('sys_time', meta.servertime || '--');
    tSys.updateValue('sys_vendor', meta.hersteller || 'KOSTAL');
    tSys.updateValue('sys_name', meta.name || 'PIKO');
    tSys.updateValue('sys_runtime', meta.laufzeit || '--');
    tSys.updateValue('sys_hours', formatNum(meta.stunden, 0));
  }
}
