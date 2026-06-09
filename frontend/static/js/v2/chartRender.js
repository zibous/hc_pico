// frontend/static/js/v3/chartRender.js
import { formatNum } from './utils.js';
import { linearRegression } from './chartBase.js';
import { renderChartSummaryFooter } from './chartSummary.js';

let chartInstance = null;

const APPLE_FONT = {
  family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  size: 11,
  weight: '500'
};

export function initCharts() {
  window.addEventListener('themeChanged', () => {
    if (!chartInstance) return;
    const isDark = document.body.classList.contains('apple-theme-dark');
    const gridColor = isDark ? '#2c2c2e' : '#e8e8ed';
    chartInstance.options.scales.x.grid.color = gridColor;
    chartInstance.options.scales.y.grid.color = gridColor;
    if (chartInstance.options.scales.y2) chartInstance.options.scales.y2.grid.color = gridColor;
    chartInstance.update();
  });
}

export function renderChartData(data, summaryData) { // 🌟 summaryData als Parameter ergänzt
  const canvas = document.getElementById('dashboardChart');
  if (!canvas || !data || !data.labels) return;

  const ctx = canvas.getContext('2d');
  const isDark = document.body.classList.contains('apple-theme-dark');
  const accentColor = getComputedStyle(document.body).getPropertyValue('--orange').trim() || '#ff9500';
  const blueColor = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#0071e3';
  const gridColor = isDark ? '#2c2c2e' : '#e8e8ed';
  const textSub = '#86868b';

  const grad = ctx.createLinearGradient(0, 0, 0, 320);
  grad.addColorStop(0, isDark ? 'rgba(255,159,10, 0.35)' : 'rgba(255,149,0, 0.25)');
  grad.addColorStop(1, 'rgba(255,149,0, 0.01)');

  let trendData = null;
  if ((data.period_type === 'day' || data.period_type === 'month') && data.values && data.values.length >= 5) {
    trendData = linearRegression(data.values);
  }

  const hasTheo = data.period_type === 'hour' && data.theoretical && data.theoretical.some(v => v > 0);
  const datasets = [{
    label: 'Produktion (kWh)', data: data.values || [], backgroundColor: grad, borderColor: accentColor,
    borderWidth: 1.5, borderRadius: 4, borderSkipped: false, type: 'bar', order: 2, yAxisID: 'y'
  }];

  if (hasTheo) {
    datasets.push({
      label: 'Theoretisch (kW)', data: data.theoretical, type: 'line', borderColor: blueColor,
      borderWidth: 2.5, borderDash: [4, 4], pointRadius: 0, fill: false, tension: 0.4, order: 1, yAxisID: 'y2'
    });
  }

  if (trendData) {
    datasets.push({
      label: 'Trend (kWh)', data: trendData, type: 'line', borderColor: blueColor,
      borderWidth: 2, borderDash: [4, 4], pointRadius: 0, fill: false, tension: 0.2, order: 1, yAxisID: 'y'
    });
  }

  // 🌟 KORREKTUR: Reicht das summary-Objekt mit den echten Jahres-Daten nach unten durch!
  renderChartSummaryFooter(data, summaryData);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new window.Chart(ctx, {
    type: 'bar', data: { labels: data.labels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: {
          display: data.period_type === 'day' || data.period_type === 'month' || hasTheo,
          labels: { color: textSub, font: APPLE_FONT }
        },
        tooltip: {
          backgroundColor: isDark ? '#1c1c1e' : '#ffffff', borderColor: gridColor, borderWidth: 1, padding: 12, cornerRadius: 10, intersect: false, mode: 'index',
          titleFont: APPLE_FONT, bodyFont: APPLE_FONT,
          callbacks: {
            label: (c) => c.dataset.label.startsWith('Theoretisch') ? ` ${c.dataset.label}: ${formatNum(c.raw, 2)} kW` : c.dataset.label.startsWith('Trend') ? ` ${c.dataset.label}: ${formatNum(c.raw, 2)} kWh` : ` Realer Ertrag: ${formatNum(c.raw, 2)} kWh`
          }
        }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textSub, font: APPLE_FONT, maxTicksLimit: data.labels.length > 31 ? 15 : undefined } },
        y: { grid: { color: gridColor }, ticks: { color: textSub, font: APPLE_FONT, callback: v => v + ' kWh' }, beginAtZero: true, position: 'left' },
        y2: hasTheo ? { grid: { drawOnChartArea: false }, ticks: { color: blueColor, font: { ...APPLE_FONT, size: 10, weight: '600' }, callback: v => v + ' kW' }, beginAtZero: true, position: 'right' } : { display: false }
      }
    }
  });
}
