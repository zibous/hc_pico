import { $, cv, fmt } from './config.js';
import { linearRegression } from './math-helpers.js';

let chart = null;

export function destroyChart() {
  if (chart) { chart.destroy(); chart = null; }
}

export function renderChart(data) {
  if (!data || !data.labels) return;
  const titles = { hour: 'Stundenwerte', day: 'Tageswerte', month: 'Monatswerte', year: 'Jahreswerte' };
  const titleEl = $('chart-title');
  if (titleEl) titleEl.textContent = titles[data.period_type] || 'Produktion';

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const accent = cv('--accent') || '#f59e0b', grid = cv('--grid') || '#e5e7eb', muted = cv('--muted') || '#94a3b8', blue = cv('--blue') || '#3b82f6';

  const chartCanvas = $('main-chart');
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 320);
  grad.addColorStop(0, isDark ? 'rgba(245,158,11,.4)' : 'rgba(217,119,6,.3)');
  grad.addColorStop(1, 'rgba(245,158,11,.02)');

  let trendData = null;
  if ((data.period_type === 'day' || data.period_type === 'month') && data.values && data.values.length >= 5) {
    trendData = linearRegression(data.values);
  }

  const hasTheo = data.period_type === 'hour' && data.theoretical && data.theoretical.some(v => v > 0);

  const datasets = [{
    label: 'Produktion (kWh)', data: data.values || [], backgroundColor: grad, borderColor: accent,
    borderWidth: 1.5, borderRadius: 5, borderSkipped: false, type: 'bar', order: 2, yAxisID: 'y'
  }];

  if (hasTheo) {
    datasets.push({
      label: 'Theoretisch (kW)', data: data.theoretical, type: 'line', borderColor: blue,
      borderWidth: 2, borderDash: [4, 4], pointRadius: 0, pointHoverRadius: 4, fill: false, tension: 0.4, order: 1, yAxisID: 'y2'
    });
  }

  if (trendData) {
    datasets.push({
      label: 'Trend', data: trendData, type: 'line', borderColor: blue, borderWidth: 2,
      borderDash: [4, 4], pointRadius: 0, pointHoverRadius: 4, fill: false, tension: 0.3, order: 1, yAxisID: 'y'
    });
  }

  const showLegend = data.period_type === 'day' || data.period_type === 'month' || hasTheo;

  if (chart && chart.data && chart.data.labels && chart.data.labels.length === data.labels.length && chart.data.datasets.length === datasets.length && chart.config.type === 'bar') {
    chart.data.labels = data.labels;
    chart.data.datasets[0].data = data.values;
    chart.data.datasets[0].backgroundColor = grad;
    if (chart.data.datasets[1]) chart.data.datasets[1].data = hasTheo ? data.theoretical : (trendData || []);
    chart.options.plugins.legend.display = showLegend;
    chart.options.scales.x.ticks.maxTicksLimit = data.labels.length > 60 ? 18 : undefined;
    chart.update('active');
    return;
  }

  if (chart) { chart.destroy(); chart = null; }

  chart = new window.Chart(ctx, {
    type: 'bar', data: { labels: data.labels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 400, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: showLegend, labels: { color: muted, boxWidth: 24, font: { size: 11 } } },
        tooltip: {
          backgroundColor: isDark ? '#1a1d27' : '#ffffff', borderColor: grid, borderWidth: 1,
          titleColor: isDark ? '#e2e8f0' : '#0f172a', bodyColor: isDark ? '#f59e0b' : '#92400e', padding: 10,
          callbacks: {
            label: (c) => {
              if (c.dataset.label === 'Theoretisch (kW)') return ' ' + fmt(c.parsed.y, 2) + ' kW';
              if (c.dataset.label === 'Trend') return ' ' + fmt(c.parsed.y, 2) + ' kWh Trend';
              let label = ' ' + fmt(c.parsed.y, 2) + ' kWh';
              if (hasTheo && data.efficiency && data.efficiency[c.dataIndex] != null) {
                label += ' (' + Math.round(data.efficiency[c.dataIndex] * 100) + '%)';
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: { grid: { color: grid }, ticks: { color: muted, maxRotation: 45, font: { size: 11 }, maxTicksLimit: data.labels.length > 60 ? 18 : undefined } },
        y: { grid: { color: grid }, ticks: { color: muted, callback: v => v + ' kWh' }, beginAtZero: true, position: 'left' },
        y2: hasTheo ? { grid: { drawOnChartArea: false }, ticks: { color: blue, callback: v => v + ' kW', font: { size: 10 } }, beginAtZero: true, position: 'right' } : { display: false }
      }
    }
  });
}

export function renderYearBars(years) {
  const container = $('year-bars');
  if (!container || !years || !years.length) return;

  const sorted = years.slice().sort((a, b) => a.year - b.year);
  const max = Math.max(...sorted.map(y => y.kwh || 0), 1); // 1 als Fallback gegen Division durch 0
  const currentYear = new Date().getFullYear().toString();
  const trendVals = sorted.length >= 3 ? linearRegression(sorted.map(y => y.kwh || 0)) : null;

  container.innerHTML = sorted.map((y, i) => {
    const prev = i > 0 ? sorted[i - 1] : null;
    const isCurrent = y.year === currentYear;
    const pct = ((y.kwh || 0) / max * 100).toFixed(1);

    let diffHtml = '';
    if (prev && prev.kwh > 0) {
      const compareBase = (y.partial && y.prev_same_period != null) ? y.prev_same_period : prev.kwh;
      const compareLabel = (y.partial && y.prev_same_period != null) ? ' (gleicher Zeitraum)' : '';
      const diff = (y.kwh || 0) - compareBase;
      const diffPct = compareBase > 0 ? (diff / compareBase * 100).toFixed(1) : '0';
      const isGain = diff >= 0;
      diffHtml = `<span class="${isGain ? 'yb-gain' : 'yb-loss'}">${isGain ? '▲' : '▼'} ${fmt(Math.abs(diff), 0)} kWh (${isGain ? '+' : ''}${diffPct}%)${compareLabel}</span>`;
    }

    const partialHtml = y.partial ? '<span class="yb-share"> laufendes Jahr</span>' : '';
    let trendHtml = '';
    if (trendVals && trendVals[i] != null) {
      trendHtml = `<span class="yb-trend-val ${ (y.kwh || 0) - trendVals[i] >= 0 ? 'yb-gain' : 'yb-loss'}">≈ ${fmt(trendVals[i], 0)} kWh Trend</span>`;
    }
    const shareHtml = y.partial ? '' : `<span class="yb-share">${pct}% von Best</span>`;

    return `<div class="yb-item${isCurrent ? ' yb-current' : ''}">
      <div class="yb-label">${y.year}${isCurrent ? ' ●' : ''}</div>
      <div class="yb-val">${fmt(y.kwh, 0)}</div>
      <div class="yb-unit"> kWh</div>
      <div class="yb-track"><div class="yb-fill" style="width:${pct}%"></div></div>
      ${partialHtml}${diffHtml}${trendHtml}${shareHtml}
    </div>`;
  }).join('');
}

export function renderChartStats(data) {
  const el = $('chart-stats');
  if (!el) return;
  const cs = (label, valHtml, raw) => `<div class="cs-item"><div class="cs-label">${label}</div>${raw ? valHtml : `<div class="cs-val">${valHtml}</div>`}</div>`;

  if (data.period_type === 'hour') {
    const theoSoFar = data.theo_so_far || data.theo_daily_kwh || 0;
    el.innerHTML = cs('Produktion', `<span class="cs-val c-accent">${fmt(data.total_kwh, 2)} kWh</span>`, true);
    if (theoSoFar > 0) {
      el.innerHTML += cs('Theoretisch', fmt(data.theo_daily_kwh || 0, 2) + ' kWh');
      const eff = Math.round(data.total_kwh / theoSoFar * 100);
      if (eff > 0 && eff <= 150) {
        el.innerHTML += cs('Wirkungsgrad', `<span class="cs-val ${eff >= 80 ? 'c-green' : eff >= 50 ? 'c-accent' : 'c-red'}">${eff}%</span>`, true);
      }
    }
    return;
  }

  if (data.period_type !== 'day' && data.period_type !== 'month') { el.innerHTML = ''; return; }
  const vals = data.values ? data.values.filter(v => v > 0) : [];
  if (!vals.length) { el.innerHTML = ''; return; }

  const total = data.total_kwh || 0, avg = total / vals.length, best = Math.max(...vals), worst = Math.min(...vals);
  let trendHtml = '';
  if (vals.length >= 3 && data.values) {
    const tr = linearRegression(data.values);
    if (tr && tr.length > 0) {
      const slope = tr[tr.length - 1] - tr[0];
      trendHtml = cs('Trend', `<span class="cs-val ${slope >= 0 ? 'c-green' : 'c-red'}">${slope >= 0 ? '▲ steigend' : '▼ fallend'}</span>`, true);
    }
  }

  el.innerHTML = cs('Zeitraum', data.count + (data.period_type === 'day' ? ' Tage' : ' Monate')) +
    cs('Gesamt', `<span class="cs-val c-accent">${fmt(total, 1)} kWh</span>`, true) +
    cs('Durchschnitt', fmt(avg, 1) + ' kWh') +
    cs('Bestwert', `${fmt(best, 1)} kWh<br><span style="font-size:.65rem;color:var(--muted)">${data.labels ? data.labels[data.values.indexOf(best)] : ''}</span>`) +
    cs('Schlechtester', `${fmt(worst, 1)} kWh<br><span style="font-size:.65rem;color:var(--muted)">${data.labels ? data.labels[data.values.indexOf(worst)] : ''}</span>`) + trendHtml;
}
