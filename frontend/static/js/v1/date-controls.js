import { $, today, thisMonth } from './config.js';

/**
 * Generiert die passenden Datumswähler im DOM und bindet die Change-Events an loadChart.
 * @param {string} period - Das gewählte Intervall (hour, week, day, month, year)
 * @param {Function} loadChartCallback - Die loadChart-Funktion aus main.js
 */
export function renderDateControls(period, loadChartCallback) {
  const el = $('date-controls');
  if (!el || typeof loadChartCallback !== 'function') return;
  el.innerHTML = '';

  if (period === 'hour') {
    const inp = document.createElement('input');
    inp.type = 'date'; inp.value = today(); inp.max = today();
    inp.addEventListener('change', () => loadChartCallback('hour', { date: inp.value }));
    el.appendChild(inp);
  } else if (period === 'week') {
    const inp = document.createElement('input');
    inp.type = 'date'; inp.value = today(); inp.max = today();
    inp.addEventListener('change', () => {
      const d = new Date(inp.value), day = d.getDay() || 7;
      const mon = new Date(d); mon.setDate(d.getDate() - day + 1);
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      loadChartCallback('day', { from: mon.toISOString().slice(0, 10), to: sun.toISOString().slice(0, 10) });
    });
    el.appendChild(inp);
  } else if (period === 'day') {
    const d30 = new Date(); d30.setDate(d30.getDate() - 30);
    const from = document.createElement('input'); from.type = 'date'; from.value = d30.toISOString().slice(0, 10); from.max = today();
    const to = document.createElement('input'); to.type = 'date'; to.value = today(); to.max = today();
    const reload = () => loadChartCallback('day', { from: from.value, to: to.value });
    from.addEventListener('change', reload); to.addEventListener('change', reload);
    el.appendChild(from); el.appendChild(to);
  } else if (period === 'month') {
    const from = document.createElement('input'); from.type = 'month'; from.value = (new Date().getFullYear() - 1) + '-01'; from.max = thisMonth();
    const to = document.createElement('input'); to.type = 'month'; to.value = thisMonth(); to.max = thisMonth();
    const reload = () => loadChartCallback('month', { from: from.value, to: to.value });
    from.addEventListener('change', reload); to.addEventListener('change', reload);
    el.appendChild(from); el.appendChild(to);
  }
}
