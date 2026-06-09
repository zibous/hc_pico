import { $, fmt, today } from './config.js';

export function renderPvTable(data) {
  if (!data || !data.labels) return;
  const head = $('pv-table-head'), body = $('pv-table-body'), foot = $('pv-table-foot');
  if (!head || !body) return;

  $('table-title').textContent = { hour: 'Stundenwerte', day: 'Tageswerte', month: 'Monatswerte', year: 'Jahreswerte' }[data.period_type] || 'Daten';
  const hasTheo = data.theoretical && data.theoretical.some(v => v > 0);
  const hasEff = data.efficiency && data.efficiency.some(v => v != null);

  let h = '<th>Zeitraum</th><th class="num">Produktion kWh</th>';
  if (hasTheo) h += '<th class="num">Theoretisch kW</th>';
  if (hasEff) h += '<th class="num">Wirkungsgrad</th>';
  head.innerHTML = h;

  let totalProd = 0, totalTheo = 0;
  body.innerHTML = data.labels.map((lbl, i) => {
    const val = data.values[i] || 0; totalProd += val;
    let row = `<td>${lbl}</td><td class="num">${fmt(val, 3)}</td>`;
    if (hasTheo) { const tv = data.theoretical[i] || 0; totalTheo += tv; row += `<td class="num">${fmt(tv, 3)}</td>`; }
    if (hasEff) {
      const ev = data.efficiency[i];
      row += ev != null ? `<td class="num ${Math.round(ev * 100) > 100 ? 'c-green' : Math.round(ev * 100) >= 70 ? '' : 'c-red'}">${Math.round(ev * 100)}%</td>` : '<td class="num">--</td>';
    }
    return `<tr>${row}</tr>`;
  }).join('');

  let f = `<td>Gesamt</td><td class="num">${fmt(totalProd, 2)}</td>`;
  if (hasTheo) f += `<td class="num">${fmt(totalTheo, 2)}</td>`;
  if (hasEff && totalTheo > 0) f += `<td class="num">${Math.round(totalProd / totalTheo * 100)}%</td>`;
  else if (hasEff) f += '<td></td>';
  foot.innerHTML = f;
}

export function exportPvCSV(lastChartData) {
  if (!lastChartData || !lastChartData.labels) return;
  const d = lastChartData;
  const hasTheo = d.theoretical && d.theoretical.some(v => v > 0);
  const lines = ['Zeitraum;Produktion kWh' + (hasTheo ? ';Theoretisch kWh' : '')];

  d.labels.forEach((lbl, i) => {
    let row = lbl + ';' + (d.values[i] || 0).toFixed(3).replace('.', ',');
    if (hasTheo) row += ';' + (d.theoretical[i] || 0).toFixed(3).replace('.', ',');
    lines.push(row);
  });

  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pv_${d.period_type || 'data'}_${today()}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 100);
}
