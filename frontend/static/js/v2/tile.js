// frontend/static/js/v3/tile.js
import { getAppleIcon } from './icons.js';

export class AppleTile {
  constructor(id, title, iconName, iconColor, rows = []) {
    this.id = id;
    this.title = title;
    this.iconName = iconName;
    this.iconColor = iconColor;
    this.rows = rows;
  }

  render() {
    let rowsHtml = '';
    this.rows.forEach(row => {
      const sparklineCanvas = row.trend
        ? `<canvas id="spark-${row.id}" width="60" height="20" style="width:60px; height:20px; margin: 0 8px; flex-shrink:0; display: inline-block;"></canvas>`
        : '';

      const progressBar = row.progress
        ? `<div class="tile-progress-bg"><div id="progress-${row.id}" class="tile-progress-bar" style="width: 0%; background-color: ${this.iconColor};"></div></div>`
        : '';

      rowsHtml += `
        <div class="tile-row-wrapper">
          <div class="tile-row-item">
            <span class="tile-row-label">${row.label}</span>
            <span class="tile-row-value-container">
              ${sparklineCanvas}
              <span id="val-${row.id}" class="tile-row-value">--</span>
              <span class="tile-row-unit">${row.unit || ''}</span>
            </span>
          </div>
          ${progressBar}
        </div>
      `;
    });

    return `
      <div class="apple-card health-card-grouped" id="card-${this.id}">
        <div class="card-header-grouped">
          <div class="card-header-title-block">
            ${getAppleIcon(this.iconName, 18, 0.9, 6, this.iconColor)}
            <h3>${this.title}</h3>
          </div>
          <span id="status-${this.id}" class="card-status-badge"></span>
        </div>
        <div class="card-body-rows">
          ${rowsHtml}
        </div>
      </div>
    `;
  }

  updateValue(rowId, value, color = null) {
    const el = document.getElementById(`val-${rowId}`);
    if (el) {
      el.innerText = value;
      if (color) el.style.color = color;
    }
  }

  updateProgress(rowId, percent) {
    const bar = document.getElementById('progress-' + rowId);
    if (bar) {
      const checkedPercent = Math.max(0, Math.min(100, percent || 0));
      bar.style.width = `${checkedPercent}%`;
    }
  }

  updateStatus(statusText, color = 'var(--text-sub)') {
    const el = document.getElementById(`status-${this.id}`);
    if (el) {
      el.innerText = statusText ? statusText.toUpperCase() : '';
      el.style.backgroundColor = statusText ? `${color}15` : 'transparent';
      el.style.color = color;
    }
  }

  /**
   * Zeichnet den Trend pfadabhängig vom aktuellen Theme mit DOM-Sicherheit
   */
  drawTrend(rowId, dataHistory) {
    // 🌟 KORREKTUR: requestAnimationFrame wartet exakt darauf, dass der Browser das HTML im DOM verankert hat
    requestAnimationFrame(() => {
      const canvas = document.getElementById(`spark-${rowId}`);
      if (!canvas || !dataHistory || dataHistory.length < 2) return;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentThemeColor = getComputedStyle(document.body).getPropertyValue('--text-main').trim() || '#1d1d1f';
      const max = Math.max(...dataHistory);
      const min = Math.min(...dataHistory);
      const range = max - min || 1;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = currentThemeColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      dataHistory.forEach((val, index) => {
        const x = (index / (dataHistory.length - 1)) * canvas.width;
        const y = canvas.height - ((val - min) / range) * canvas.height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
    });
  }
}
