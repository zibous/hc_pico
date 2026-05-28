import { _B, $, fmt, fmtI } from './config.js';
import { renderAnalytics } from './analytics.js';

export async function loadCurrent(renderYearBarsCallback) {
  try {
    const urlCurrent = _B + '/api/current';
    const urlSummary = _B + '/api/summary';

    const [cur, sum] = await Promise.all([
      fetch(urlCurrent).then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }),
      fetch(urlSummary).then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }),
    ]);

    console.log("Antwort /api/current", cur);
    console.log("Antwort /api/summary", sum);

    // 1. Status-Header (Badge) befüllen
    const dot = $('status-dot');
    if (dot) dot.className = 'dot ' + (cur.aktiv === 'on' ? 'on' : 'off');
    if ($('status-text')) $('status-text').textContent = cur.mode || '--';
    if ($('status-time')) $('status-time').textContent = cur.time ? `· ${cur.date} ${cur.time}` : '';

    // 2. Kacheln (Live-Werte & Erträge) befüllen
    if ($('t-power')) $('t-power').textContent = fmtI(cur.current_power_w);
    if ($('t-today')) $('t-today').textContent = fmt(sum.today_kwh, 2);
    if ($('t-week')) $('t-week').textContent = fmt(sum.week_kwh, 2);
    if ($('t-month')) $('t-month').textContent = fmt(sum.month_kwh, 1);
    if ($('t-year')) $('t-year').textContent = fmt(sum.year_kwh, 0);
    if ($('t-total')) $('t-total').textContent = fmtI(cur.total_energy_kwh);
    if ($('t-ost')) $('t-ost').textContent = fmtI(cur.pv_ost_w);
    if ($('t-west')) $('t-west').textContent = fmtI(cur.pv_west_w);

    // 3. Phasenwerte befüllen
    if ($('l1-v')) $('l1-v').textContent = fmt(cur.l1_voltage) + ' V';
    if ($('l1-a')) $('l1-a').textContent = fmt(cur.l1_ampere, 2) + ' A';
    if ($('l1-p')) $('l1-p').textContent = fmtI(cur.l1_power) + ' W';
    if ($('s1-v')) $('s1-v').textContent = fmt(cur.string1_voltage) + ' V';
    if ($('s1-a')) $('s1-a').textContent = fmt(cur.l1_ampere, 2) + ' A';

    if ($('l2-v')) $('l2-v').textContent = fmt(cur.l2_voltage) + ' V';
    if ($('l2-a')) $('l2-a').textContent = fmt(cur.l2_ampere, 2) + ' A';
    if ($('l2-p')) $('l2-p').textContent = fmtI(cur.l2_power) + ' W';
    if ($('s2-v')) $('s2-v').textContent = fmt(cur.string2_voltage) + ' V';
    if ($('s2-a')) $('s2-a').textContent = fmt(cur.l2_ampere, 2) + ' A';

    if ($('l3-v')) $('l3-v').textContent = fmt(cur.l3_voltage) + ' V';
    if ($('l3-a')) $('l3-a').textContent = fmt(cur.l3_ampere, 2) + ' A';
    if ($('l3-p')) $('l3-p').textContent = fmtI(cur.l3_power) + ' W';
    if ($('pf')) $('pf').textContent = fmt(cur.powerfactor, 2);
    if ($('pv-theo')) $('pv-theo').textContent = fmt(cur.pv_theoretical_kw, 2) + ' kW';

    // 4. NEU: Die neue Status-Kachel befüllen
    const sTile = $('status-tile');
    const sIcon = $('status-tile-icon');
    const tStatus = $('t-status');
    const tStatusTime = $('t-status-time');

    if (tStatus) tStatus.textContent = cur.mode || 'Inaktiv';
    if (tStatusTime) tStatusTime.textContent = cur.time ? `Aktualisiert um ${cur.time}` : 'Keine Zeit';

    // Farbe der Status-Kachel dynamisch steuern (Grün bei "on")
    if (sTile && sIcon) {
      if (cur.aktiv === 'on') {
        sTile.classList.add('c-green');
        sIcon.style.color = 'var(--green)';
      } else {
        sTile.classList.remove('c-green');
        sIcon.style.color = 'var(--muted)';
      }
    }

    // 5. WICHTIG: Berechnete Analyse-Karten aktualisieren (MIT cur UND sum für CO2)
    renderAnalytics(cur, sum);

    // 6. Historischen Jahresbalken-Callback ausführen
    if (typeof renderYearBarsCallback === 'function') {
      renderYearBarsCallback(sum.years);
    }

    // 7. Progressbars befüllen
    const MAX_WR_POWER = 5000;
    const powerValue = Number(cur.current_power_w) || 0;
    const powerPct = Math.min(100, (powerValue / MAX_WR_POWER) * 100);
    const pPowerBar = $('p-power');
    if (pPowerBar) pPowerBar.style.width = `${powerPct}%`;

    const targetToday = Number(sum.theo_daily_kwh) > 0 ? Number(sum.theo_daily_kwh) : 25;
    const todayValue = parseFloat(sum.today_kwh ? sum.today_kwh.toString().replace(',', '.') : '0') || 0;
    const todayPct = Math.min(100, (todayValue / targetToday) * 100);
    const pTodayBar = $('p-today');
    if (pTodayBar) pTodayBar.style.width = `${todayPct}%`;

    // Last-Refresh Zeitstempel setzen
    const lr = $('last-refresh');
    if (lr) lr.textContent = 'aktualisiert ' + new Date().toLocaleTimeString('de-DE');

  } catch (e) {
    console.error('loadCurrent Error:', e);
  }
}
