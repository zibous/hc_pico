// frontend/static/js/v3/tile_status.js
import { getAppleIcon } from './icons.js';
import { formatNum } from './utils.js';

export function updateSunAnimation(currentData) {
  const container = document.getElementById('sun-animation-container');
  if (!container || !currentData) return;

  const ost = currentData.pv_ost_w || 0;
  const west = currentData.pv_west_w || 0;
  const total = currentData.gesamtleistung_w || 0;

  const l1 = currentData.l1_power || 0;
  const l2 = currentData.l2_power || 0;
  const l3 = currentData.l3_power || 0;

  const total_dc = ost + west || 1;
  const west_pct = (west / total_dc) * 100;

  const ostFill = ost > 30 ? 'rgba(0, 113, 227, 0.12)' : 'none';
  const westFill = west > 30 ? 'rgba(255, 149, 0, 0.12)' : 'none';
  const isProducing = total > 10;

  container.innerHTML = `
    <!-- 🌟 FIX: Kopfzeile gereinigt, damit der Titel im einheitlichen Solar-Orange leuchtet! -->
    <div class="card-header-grouped">
      <div class="card-header-title-block">
        ${getAppleIcon('sun', 18, 0.9, 6, 'var(--orange)')}
        <h3>Dachseiten-Verhältnis</h3>
      </div>
      <span class="card-status-badge" style="background-color: ${isProducing ? 'var(--green)15' : 'var(--text-sub)15'}; color: ${isProducing ? 'var(--green)' : 'var(--text-sub)'};">
        ${isProducing ? 'LIVE' : 'STANDBY'}
      </span>
    </div>

    <div style="text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1;">
      <svg viewBox="0 0 400 150" style="width: 100%; max-width: 380px; overflow: visible;">
        <line x1="10" y1="130" x2="390" y2="130" stroke="var(--border)" stroke-width="3" stroke-linecap="round"/>
        <rect x="100" y="110" width="200" height="20" fill="var(--bg-app)" stroke="var(--border)" stroke-width="2"/>

        <path d="M 100 110 L 200 10 L 200 110 Z" stroke="var(--accent)" stroke-width="3" fill="${ostFill}" style="transition: fill 0.5s ease;"/>
        <text x="135" y="95" fill="var(--text-sub)" font-size="11" font-weight="600" text-anchor="middle">OST</text>
        <text x="110" y="45" fill="var(--text-main)" font-size="14" font-weight="700" text-anchor="start">${formatNum(ost, 0)} W</text>

        <path d="M 200 110 L 200 10 L 300 110 Z" stroke="var(--orange)" stroke-width="3" fill="${westFill}" style="transition: fill 0.5s ease;"/>
        <text x="265" y="95" fill="var(--text-sub)" font-size="11" font-weight="600" text-anchor="middle">WEST</text>
        <text x="290" y="45" fill="var(--text-main)" font-size="14" font-weight="700" text-anchor="end">${formatNum(west, 0)} W</text>

        <line x1="200" y1="10" x2="200" y2="110" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,3"/>
        <circle cx="${100 + (west_pct * 2.0)}" cy="${west_pct <= 50 ? 110 - (west_pct * 2.0) : 10 + ((west_pct - 50) * 2.0)}" r="6" fill="var(--green)" style="transition: cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"/>
      </svg>

      <div class="card-body-rows" style="margin-top: 14px; border-top: 1px solid var(--border); padding-top: 14px; width: 100%; display: flex; flex-direction: column; gap: 8px;">
        <div class="tile-row-item">
          <span class="tile-row-label" style="font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">AC Gesamtleistung</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value" style="font-size: 18px; font-weight: 800;">${formatNum(total, 0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L1</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${formatNum(l1, 0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L2</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${formatNum(l2, 0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L3</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${formatNum(l3, 0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
      </div>
    </div>
  `;
}
