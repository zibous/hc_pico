import { $, fmt, fmtI } from './config.js';

/**
 * Berechnet die erweiterten Analysewerte und rendert sie in die Karten.
 * @param {Object} cur - Das aktuelle Datenobjekt der API
 * @param {Object} sum - Das Summary-Objekt der API für historische Werte
 */
export function renderAnalytics(cur, sum) {
  const pAC = Number(cur.current_power_w) || 0;
  const pOst = Number(cur.pv_ost_w) || 0;
  const pWest = Number(cur.pv_west_w) || 0;
  const pf = Number(cur.powerfactor) || 0;

  // 1. Wechselrichter Wirkungsgrad (DC zu AC)
  const totalDC = pOst + pWest;
  const efficiency = totalDC > 50 ? Math.min(100, (pAC / totalDC) * 100) : 0;

  // 2. Scheinleistung (S = P / cos phi)
  const apparent = (pAC > 0 && pf > 0) ? (pAC / pf) : 0;

  // 3. Blindleistung (Q = sqrt(S^2 - P^2))
  const reactive = (apparent > pAC) ? Math.sqrt(Math.pow(apparent, 2) - Math.pow(pAC, 2)) : 0;

  // 4. Netz-Symmetrie (Spannungsabweichung der Phasen)
  const v1 = Number(cur.l1_voltage) || 0;
  const v2 = Number(cur.l2_voltage) || 0;
  const v3 = Number(cur.l3_voltage) || 0;
  const vAvg = (v1 + v2 + v3) / 3;
  const maxDev = Math.max(Math.abs(v1 - vAvg), Math.abs(v2 - vAvg), Math.abs(v3 - vAvg));
  const unbalance = vAvg > 0 ? (maxDev / vAvg) * 100 : 0;

  // 5. CO2-Berechnung & Bäume (1 Baum bindet ~12.5 kg CO2/Jahr)
  const CO2_FACTOR = 0.380;
  const rawToday = cur && cur.daily_energy_kwh ? cur.daily_energy_kwh.toString().replace(',', '.') : '0';
  const kwhToday = parseFloat(rawToday) || 0;
  const kwhTotal = Number(cur.total_energy_kwh) || 0;
  const co2TodayKg = kwhToday * CO2_FACTOR;
  const co2TotalKg = kwhTotal * CO2_FACTOR;
  const treesPlanted = co2TotalKg / 12.5;

  // 6. Himmel-Klarheitsindex / Sonnenfaktor (Ist-Leistung kW zu Theorie-Leistung kW)
  const currentKW = pAC / 1000;
  const theoKW = Number(cur.pv_theoretical_kw) || 0;
  const weatherFactor = (theoKW > 0.1 && currentKW > 0.05) ? Math.min(100, (currentKW / theoKW) * 100) : 0;

  // --- DOM RENDERING ---

  // Karte 1: Wirkungsgrad & Wetterfaktor
  if ($('an-dc-in')) $('an-dc-in').textContent = fmtI(totalDC) + ' W';
  if ($('an-eff')) {
    $('an-eff').textContent = totalDC > 50 ? fmt(efficiency, 1) + ' %' : '--';
    $('an-eff').className = 'val ' + (efficiency >= 93 ? 'c-green' : efficiency >= 85 ? 'c-accent' : 'c-red');
  }
  if ($('an-weather')) {
    if (theoKW > 0.1 && pAC > 10) {
      $('an-weather').textContent = fmt(weatherFactor, 0) + ' % ' + (weatherFactor > 75 ? '☀️' : weatherFactor > 40 ? '⛅' : '☁️');
    } else {
      $('an-weather').textContent = 'Keine Sonne 🌙';
    }
  }

  // Karte 2: Blind- & Scheinleistung
  if ($('an-apparent')) $('an-apparent').textContent = fmtI(apparent) + ' VA';
  if ($('an-reactive')) $('an-reactive').textContent = fmtI(reactive) + ' var';

  // Karte 3: Symmetrie
  if ($('an-v-avg')) $('an-v-avg').textContent = fmt(vAvg, 1) + ' V';
  if ($('an-unbalance')) {
    $('an-unbalance').textContent = vAvg > 0 ? fmt(unbalance, 2) + ' %' : '--';
    $('an-unbalance').className = 'val ' + (unbalance < 1.0 ? 'c-green' : unbalance < 2.0 ? 'c-accent' : 'c-red');
  }

  // Karte 4: CO2-Einsparung & Bäume
  if ($('an-co2-today')) $('an-co2-today').textContent = fmt(co2TodayKg, 2) + ' kg';
  if ($('an-co2-total')) {
    if (co2TotalKg >= 1000) {
      $('an-co2-total').textContent = fmt(co2TotalKg / 1000, 2) + ' t';
    } else {
      $('an-co2-total').textContent = fmt(co2TotalKg, 1) + ' kg';
    }
  }
  if ($('an-trees')) {
    $('an-trees').textContent = treesPlanted > 0 ? fmtI(treesPlanted) + ' 🌳' : '0 🌳';
  }
}
