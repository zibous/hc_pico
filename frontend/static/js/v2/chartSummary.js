// frontend/static/js/v3/chartSummary.js
import { formatNum } from './utils.js';
import { linearRegression } from './chartBase.js';

export function renderChartSummaryFooter(chartData, summaryData) {
  const container = document.getElementById('chart-kpi-container');
  if (!container || !chartData || !chartData.values) return;

  const validValues = chartData.values.filter(v => v > 0);
  const total = chartData.total_kwh || 0;
  const max = validValues.length > 0 ? Math.max(...validValues) : 0;
  const min = validValues.length > 0 ? Math.min(...validValues) : 0;
  const avg = validValues.length > 0 ? (total / validValues.length) : 0;

  let trendDirection = '--';
  let trendColor = 'var(--text-sub)';
  if (chartData.values.length >= 3) {
    const reg = linearRegression(chartData.values);
    if (reg && reg.length >= 2) {
      const slope = reg[reg.length - 1] - reg;
      if (slope > 0.05) { trendDirection = '▲ steigend'; trendColor = 'var(--green)'; }
      else if (slope < -0.05) { trendDirection = '▼ fallend'; trendColor = 'var(--orange)'; }
      else { trendDirection = '➡ stabil'; }
    }
  }

  const unit = chartData.period_type === 'hour' ? 'kW' : 'kWh';

  // 🌟 OPTIMIERT: Reines, sauberes Haupt-Statistikgrid unter der Grafik!
  let html = `
    <div style="width:100%; display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:16px; padding:12px 4px; background:var(--bg-app); border-radius:14px; margin-top:8px;">
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Gesamtertrag</span><span style="font-size:18px; font-weight:700; color:var(--orange); margin-top:2px;">${formatNum(total, 2)} kWh</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Mittelwert (Ø)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${formatNum(avg, 2)} ${unit}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Spitzenwert (Max)</span><span style="font-size:16px; font-weight:700; color:var(--green); margin-top:4px;">${formatNum(max, 2)} ${unit}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Tiefstwert (Min)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${formatNum(min, 2)} ${unit}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px;"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Verlaufstrend</span><span style="font-size:15px; font-weight:700; color:${trendColor}; margin-top:4px;">${trendDirection}</span></div>
    </div>
  `;

  // Das isolierte Banner wurde restlos gelöscht!

  // Jahresvergleich anhängen
  if (summaryData && summaryData.years) {
    html += `
      <div style="margin-top:24px; border-top:1px solid var(--border); padding-top:16px; width:100%;">
        <h4 style="font-size:12px; font-weight:700; color:var(--orange); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">Jahresvergleich (Historie)</h4>
        <div class="yb-container-scroll" id="year-bars"></div>
      </div>
    `;
    setTimeout(() => renderYearBars(summaryData.years), 20);
  }

  container.innerHTML = html;
}

export function renderYearBars(yearsArray) {
  const container = document.getElementById('year-bars');
  if (!container || !yearsArray || yearsArray.length === 0) return;

  const currentYear = new Date().getFullYear().toString();
  const sorted = yearsArray.slice().sort((a, b) => a.year - b.year);
  const max = Math.max(...sorted.map(y => y.kwh), 1);
  const trendVals = sorted.length >= 3 ? linearRegression(sorted.map(y => y.kwh)) : null;

  const computedRows = sorted.map((y, i) => {
    const prev = i > 0 ? sorted[i - 1] : null;
    const isCurrent = y.year === currentYear;
    const pct = ((y.kwh / max) * 100).toFixed(1);

    let diffHtml = '';
    if (prev && prev.kwh > 0) {
      const compareBase = (y.partial && y.prev_same_period != null) ? y.prev_same_period : prev.kwh;
      const compareLabel = y.partial ? ' (Zeitraum)' : '';
      const diff = y.kwh - compareBase;
      const diffPct = ((diff / compareBase) * 100).toFixed(1);
      const isGain = diff >= 0;
      diffHtml = `<span class="${isGain ? 'yb-gain' : 'yb-loss'}">${isGain ? '▲' : '▼'} ${formatNum(Math.abs(diff), 0)} kWh (${isGain ? '+' : ''}${diffPct}%)${compareLabel}</span>`;
    }

    let trendHtml = '';
    if (trendVals && trendVals[i] != null) {
      const isAboveTrend = y.kwh - trendVals[i] >= 0;
      trendHtml = `<span class="yb-meta-text" style="color:${isAboveTrend ? 'var(--green)' : 'var(--text-sub)'}; margin-left:12px;">≈ ${formatNum(trendVals[i], 0)} kWh Trend</span>`;
    }

    const partialHtml = y.partial ? '<span class="yb-meta-text" style="font-weight:700; color:var(--accent);"> ● laufendes Jahr</span>' : '';
    const shareHtml = y.partial ? '' : `<span class="yb-meta-text" style="margin-left:auto;">${pct}% von Best</span>`;

    return `
      <div class="yb-item${isCurrent ? ' yb-current' : ''}">
        <div class="yb-label">${y.year}${isCurrent ? ' ●' : ''}</div>
        <div class="yb-val">${formatNum(y.kwh, 0)}</div>
        <div class="yb-unit"> kWh</div>
        <div class="yb-track">
          <div class="yb-fill" style="width:${pct}%;"></div>
        </div>
        ${partialHtml}
        ${diffHtml}
        ${trendHtml}
        ${shareHtml}
      </div>
    `;
  });

  container.innerHTML = computedRows.reverse().join('');
}
