import { $, _B, today, thisMonth, fmt } from './config.js';
import { setupThemeEngine } from './theme.js';
import { loadCurrent } from './api.js';
import { renderChart, renderYearBars, renderChartStats, destroyChart } from './chart-renderer.js';
import { renderPvTable, exportPvCSV } from './table-renderer.js';

// Neu: Das schlanke Kontroll-Modul importieren
import { renderDateControls } from './date-controls.js';

let lastChartData = null;
let currentPeriod = 'hour';

async function loadChart(period, params = {}) {
  currentPeriod = period;
  let url = `${_B}/api/chart/${period}`;
  const qs = new URLSearchParams(params).toString();
  if (qs) url += '?' + qs;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();

    lastChartData = data;
    renderChart(data);
    renderPvTable(data);

    const totalEl = $('chart-total');
    if (totalEl) totalEl.textContent = fmt(data.total_kwh, 1);

    renderChartStats(data);
  } catch (e) {
    console.error('Fehler in loadChart:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupThemeEngine(() => {
    destroyChart();
    if (lastChartData) { renderChart(lastChartData); renderChartStats(lastChartData); }
  });

  const tabs = document.querySelectorAll('.tabs .tab');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const period = btn.getAttribute('data-period');
      if (!period) return;
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Das neue Modul aufrufen und loadChart als Ausführungs-Callback übergeben
      renderDateControls(period, loadChart);
      loadChart(period);
    });
  });

  const csvBtn = document.querySelector('button[data-noperiod="true"]');
  if (csvBtn) csvBtn.addEventListener('click', () => exportPvCSV(lastChartData));

  // Erststart
  loadCurrent(renderYearBars);
  renderDateControls('hour', loadChart);
  loadChart('hour', { date: today() });

  // Polling-Schleife (Alle 60s)
  setInterval(() => {
    loadCurrent(renderYearBars);
    const inp1 = document.querySelector('#date-controls input:first-child');
    const inp2 = document.querySelector('#date-controls input:last-child');

    if (currentPeriod === 'hour') {
      if ((inp1 ? inp1.value : today()) === today()) loadChart('hour', { date: today() });
    } else if (currentPeriod === 'day') {
      loadChart('day', inp1 && inp2 ? { from: inp1.value, to: inp2.value } : {});
    } else if (currentPeriod === 'month') {
      loadChart('month', inp1 && inp2 ? { from: inp1.value, to: inp2.value } : {});
    } else if (currentPeriod === 'year') {
      loadChart('year');
    }
  }, 60000);
});

// ─── App Info ───────────────────────────────────────────
console.info(
  '%c ⚡ Kostal Pico Dashboard %c ESM v2.3.0 ',
  'color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px',
  'color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px'
);