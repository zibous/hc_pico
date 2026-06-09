// frontend/static/js/v3/table.js
import { formatNum } from './utils.js';

let lastChartDataInstance = null;

/**
 * Initialisiert den Klick-Event für den CSV-Export
 */
export function initTable() {
  const exportBtn = document.getElementById('csv-export-btn');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', () => {
    if (!lastChartDataInstance || !lastChartDataInstance.labels) return;

    const d = lastChartDataInstance;
    const hasTheo = d.theoretical && d.theoretical.some(v => v > 0);

    // Header für den österreichischen Excel-Standard (Semikolon-getrennt)
    const lines = [`Zeitraum;Produktion_kWh${hasTheo ? ';Theoretisch_kW' : ''}`];

    d.labels.forEach((lbl, i) => {
      let row = `${lbl};${(d.values[i] || 0).toFixed(3).replace('.', ',')}`;
      if (hasTheo) {
        row += `;${(d.theoretical[i] || 0).toFixed(3).replace('.', ',')}`;
      }
      lines.push(row);
    });

    // \uFEFF stellt sicher, dass Excel Sonderzeichen und Umlaute auf Anhieb richtig liest
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);

    // Erzeugt einen sauberen Dateinamen mit dem aktuellen Tag
    const todayStr = new Date().toLocaleDateString('sv-SE');
    a.download = `pv_export_${d.period_type || 'daten'}_${todayStr}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 100);
  });
}

/**
 * Rendert die mehrspaltige Auswertungs-Tabelle inklusive Summen-Fußzeile
 * @param {Object} chartData - Das 'chart'-Unterobjekt der kombinierten API
 */
export function renderTable(chartData) {
  const container = document.getElementById('data-table-container');
  if (!container || !chartData || !chartData.labels) return;

  // Speichert die Instanz global für den CSV-Export-Button ab
  lastChartDataInstance = chartData;

  const hasTheo = chartData.theoretical && chartData.theoretical.some(v => v > 0);
  const hasEff = chartData.efficiency && chartData.efficiency.some(v => v != null);

  // 1. Tabellenkopf dynamisch aufbauen (Spalten werden nur gezeichnet, wenn Daten da sind)
  let headHtml = `<tr><th>Zeitraum</th><th style="text-align:right;">Produktion (kWh)</th>`;
  if (hasTheo) headHtml += `<th style="text-align:right;">Theoretisch (kW)</th>`;
  if (hasEff) headHtml += `<th style="text-align:right;">Wirkungsgrad</th>`;
  headHtml += `</tr>`;

  let totalProd = 0;
  let totalTheo = 0;
  let bodyHtml = '';

  // 2. Tabellenkörper mit Datenzeilen befüllen
  chartData.labels.forEach((lbl, i) => {
    const val = chartData.values[i] || 0;
    totalProd += val;

    let row = `<td><strong>${lbl}</strong></td><td style="text-align:right;">${formatNum(val, 3)} kWh</td>`;

    if (hasTheo) {
      const tv = chartData.theoretical[i] || 0;
      totalTheo += tv;
      row += `<td style="text-align:right; color: var(--accent);">${formatNum(tv, 3)} kW</td>`;
    }

    if (hasEff) {
      const ev = chartData.efficiency[i];
      if (ev != null) {
        const pct = Math.round(ev * 100);
        // Ampel-Farbkodierung für den Wirkungsgrad im Apple-Look
        const effColor = pct > 100 ? 'var(--green)' : pct >= 70 ? 'var(--text-main)' : 'var(--orange)';
        row += `<td style="text-align:right; font-weight:700; color:${effColor}">${pct}%</td>`;
      } else {
        row += `<td style="text-align:right; color:var(--text-sub);">--</td>`;
      }
    }

    bodyHtml += `<tr>${row}</tr>`;
  });

  // 3. Gesamtsummen-Fußzeile (tfoot) errechnen
  let footHtml = `<tr style="border-top:2px solid var(--border); font-weight:800; background-color:var(--bg-app);">`;
  footHtml += `<td>GESAMT</td><td style="text-align:right; color:var(--orange);">${formatNum(totalProd, 2)} kWh</td>`;

  if (hasTheo) {
    footHtml += `<td style="text-align:right; color:var(--accent);">${formatNum(totalTheo, 2)} kW</td>`;
  }
  if (hasEff) {
    if (totalTheo > 0) {
      footHtml += `<td style="text-align:right; color:var(--green);">${Math.round((totalProd / totalTheo) * 100)}%</td>`;
    } else {
      footHtml += `<td></td>`;
    }
  }
  footHtml += `</tr>`;

  // 4. Alles sauber strukturiert ins DOM injizieren
  container.innerHTML = `
    <table class="apple-table" style="width:100%; border-collapse:collapse;">
      <thead style="position:sticky; top:0; z-index:10; background-color:var(--bg-app); border-bottom:1px solid var(--border);">${headHtml}</thead>
      <tbody>${bodyHtml}</tbody>
      <tfoot style="position:sticky; bottom:0; z-index:10;">${footHtml}</tfoot>
    </table>
  `;
}
