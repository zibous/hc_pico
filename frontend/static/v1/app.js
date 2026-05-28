// umwandeln in // ES6-Module - ESM

var _B = (function () { var p = window.location.pathname.replace(/\/+$/, ''); return (p === '' || p === '/index.html') ? '' : p })();

/* Background Color Picker */
function applyBg(c) {
    document.documentElement.style.setProperty('--bg', c);
    document.body.style.setProperty('background', c);
    document.documentElement.style.setProperty('background', c);
    // Surface-Farben: leicht aufgehellt
    var r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
    var s1 = '#' + [r, g, b].map(function (v) { return Math.min(255, v + 15).toString(16).padStart(2, '0') }).join('');
    var s2 = '#' + [r, g, b].map(function (v) { return Math.min(255, v + 25).toString(16).padStart(2, '0') }).join('');
    document.documentElement.style.setProperty('--surface', s1);
    document.documentElement.style.setProperty('--surface2', s2);
    document.documentElement.style.setProperty('--shadow', 'none');
    localStorage.setItem('pv-bg', c);
    document.getElementById('bgReset').style.display = '';
}
function resetBg() {
    document.documentElement.style.removeProperty('--bg');
    document.documentElement.style.removeProperty('--surface');
    document.documentElement.style.removeProperty('--surface2');
    document.documentElement.style.removeProperty('--shadow');
    document.body.style.removeProperty('background');
    document.documentElement.style.removeProperty('background');
    localStorage.removeItem('pv-bg');
    document.getElementById('bgReset').style.display = 'none';
}
(function () { var c = localStorage.getItem('pv-bg'); if (c) { applyBg(c); document.addEventListener('DOMContentLoaded', function () { document.getElementById('bgReset').style.display = ''; }); } })();

(function () {
    // ── Theme (sofort, vor allem anderen) ───────────────────────
    const html = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = localStorage.getItem('pv-theme') || (prefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);

    // ── State ────────────────────────────────────────────────────
    let chart = null;
    let lastChartData = null;
    let currentPeriod = 'hour';

    // ── Helpers ──────────────────────────────────────────────────
    const $ = id => document.getElementById(id);
    const fmt = (v, d = 1) => (v == null || v === '' || isNaN(Number(v))) ? '--' : Number(v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
    const fmtI = v => (v == null || v === '' || isNaN(Number(v))) ? '--' : Math.round(Number(v)).toLocaleString('de-DE');
    const today = () => new Date().toISOString().slice(0, 10);
    const thisMonth = () => new Date().toISOString().slice(0, 7);
    const cv = name => getComputedStyle(html).getPropertyValue(name).trim();

    // ── Theme-Toggle ─────────────────────────────────────────────
    function applyTheme(t) {
    theme = t;
    html.setAttribute('data-theme', t);
    const btn = $('theme-btn');
    if (btn) btn.textContent = t === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    localStorage.setItem('pv-theme', t);
    // Chart komplett neu erstellen (Gridlines brauchen neue Farben)
    if (chart) { chart.destroy(); chart = null; }
    if (lastChartData) {
        renderChart(lastChartData);
        renderChartStats(lastChartData);
    }
    }

    // Button erst nach DOM-Ready verfügbar
    document.addEventListener('DOMContentLoaded', function () {
    applyTheme(theme); // Button-Text setzen
    $('theme-btn').addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('pv-theme')) applyTheme(e.matches ? 'dark' : 'light');
    });

    // ── API ──────────────────────────────────────────────────────
    async function loadCurrent() {
    try {
        const [cur, sum] = await Promise.all([
        fetch(_B + '/api/current').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
        fetch(_B + '/api/summary').then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
        ]);

        // Status-Header
        const dot = $('status-dot');
        dot.className = 'dot ' + (cur.aktiv === 'on' ? 'on' : 'off');
        $('status-text').textContent = cur.mode || '--';
        $('status-time').textContent = cur.time ? '\u00B7 ' + cur.date + ' ' + cur.time : '';

        // Kacheln
        $('t-power').textContent = fmtI(cur.current_power_w);
        $('t-today').textContent = fmt(sum.today_kwh, 2);
        $('t-week').textContent = fmt(sum.week_kwh, 2);
        $('t-month').textContent = fmt(sum.month_kwh, 1);
        $('t-year').textContent = fmt(sum.year_kwh, 0);
        $('t-total').textContent = fmtI(cur.total_energy_kwh);
        $('t-ost').textContent = fmtI(cur.pv_ost_w);
        $('t-west').textContent = fmtI(cur.pv_west_w);

        // Phasen
        $('l1-v').textContent = fmt(cur.l1_voltage) + ' V';
        $('l1-a').textContent = fmt(cur.l1_ampere, 2) + ' A';
        $('l1-p').textContent = fmtI(cur.l1_power) + ' W';
        $('s1-v').textContent = fmt(cur.string1_voltage) + ' V';
        $('s1-a').textContent = fmt(cur.l1_ampere, 2) + ' A';

        $('l2-v').textContent = fmt(cur.l2_voltage) + ' V';
        $('l2-a').textContent = fmt(cur.l2_ampere, 2) + ' A';
        $('l2-p').textContent = fmtI(cur.l2_power) + ' W';
        $('s2-v').textContent = fmt(cur.string2_voltage) + ' V';
        $('s2-a').textContent = fmt(cur.l2_ampere, 2) + ' A';

        $('l3-v').textContent = fmt(cur.l3_voltage) + ' V';
        $('l3-a').textContent = fmt(cur.l3_ampere, 2) + ' A';
        $('l3-p').textContent = fmtI(cur.l3_power) + ' W';
        $('pf').textContent = fmt(cur.powerfactor, 2);
        $('pv-theo').textContent = fmt(cur.pv_theoretical_kw, 2) + ' kW';

        renderYearBars(sum.years);

        // Refresh-Timestamp
        var lr = $('last-refresh');
        if (lr) lr.textContent = 'aktualisiert ' + new Date().toLocaleTimeString('de-DE');

    } catch (e) {
        console.error('loadCurrent:', e);
    }
    }

    async function loadChart(period, params) {
    currentPeriod = period;
    params = params || {};
    let url = _B + '/api/chart/' + period;
    const qs = new URLSearchParams(params).toString();
    if (qs) url += '?' + qs;
    try {
        const data = await fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
        lastChartData = data;
        renderChart(data);
        $('chart-total').textContent = fmt(data.total_kwh, 1);
        renderChartStats(data);
        renderPvTable(data);
    } catch (e) { console.error('loadChart:', e); }
    }

    // ── Lineare Regression ───────────────────────────────────────
    function linearRegression(values) {
    var n = values.length;
    if (n < 2) return null;
    var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (var i = 0; i < n; i++) {
        sumX += i;
        sumY += values[i];
        sumXY += i * values[i];
        sumXX += i * i;
    }
    var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    var intercept = (sumY - slope * sumX) / n;
    return values.map(function (_, i) {
        return Math.max(0, Math.round((slope * i + intercept) * 1000) / 1000);
    });
    }

    function renderChart(data) {
    if (!data) return;
    const titles = { hour: 'Stundenwerte', day: 'Tageswerte', month: 'Monatswerte', year: 'Jahreswerte' };
    $('chart-title').textContent = titles[data.period_type] || 'Produktion';

    const isDark = theme === 'dark';
    const accent = cv('--accent');
    const grid = cv('--grid');
    const muted = cv('--muted');
    const tipBg = cv('--tip-bg');
    const text = cv('--text');
    const blue = cv('--blue');

    const ctx = $('main-chart').getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 320);
    grad.addColorStop(0, isDark ? 'rgba(245,158,11,.4)' : 'rgba(217,119,6,.3)');
    grad.addColorStop(1, 'rgba(245,158,11,.02)');

    // Trendlinie bei Tages- und Monatswerten
    var trendData = null;
    if ((data.period_type === 'day' || data.period_type === 'month') && data.values.length >= 5) {
        trendData = linearRegression(data.values);
    }

    // Theoretische Leistung bei Stundenwerten
    var hasTheo = data.period_type === 'hour' && data.theoretical && data.theoretical.some(function (v) { return v > 0; });

    var datasets = [{
        label: 'Produktion (kWh)',
        data: data.values,
        backgroundColor: grad,
        borderColor: accent,
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
        type: 'bar',
        order: 2,
        yAxisID: 'y',
    }];

    if (hasTheo) {
        datasets.push({
        label: 'Theoretisch (kW)',
        data: data.theoretical,
        type: 'line',
        borderColor: blue,
        borderWidth: 2,
        borderDash: [4, 3],
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
        tension: 0.4,
        order: 1,
        yAxisID: 'y2',
        });
    }

    if (trendData) {
        datasets.push({
        label: 'Trend',
        data: trendData,
        type: 'line',
        borderColor: blue,
        borderWidth: 2,
        borderDash: [6, 3],
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
        tension: 0.3,
        order: 1,
        yAxisID: 'y',
        });
    }

    var showLegend = data.period_type === 'day' || data.period_type === 'month' || hasTheo;

    // Existierenden Chart updaten statt destroy+neu — kein Flackern
    var sameType = chart &&
        chart.data.labels.length === data.labels.length &&
        chart.data.datasets.length === datasets.length &&
        chart.config.type === 'bar';

    if (sameType) {
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.values;
        chart.data.datasets[0].backgroundColor = grad;
        if (chart.data.datasets[1]) {
        chart.data.datasets[1].data = hasTheo ? data.theoretical : (trendData || []);
        }
        chart.options.plugins.legend.display = showLegend;
        chart.options.scales.x.ticks.maxTicksLimit = data.labels.length > 60 ? 18 : undefined;
        chart.update('active');
        return;
    }

    // Erstmalig oder Typ-Wechsel: neu erstellen
    if (chart) { chart.destroy(); chart = null; }

    chart = new Chart(ctx, {
        type: 'bar',
        data: { labels: data.labels, datasets: datasets },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeInOutQuart' },
        plugins: {
            legend: {
            display: showLegend,
            labels: { color: muted, boxWidth: 24, font: { size: 11 } }
            },
            tooltip: {
            backgroundColor: isDark ? '#1a1d27' : '#ffffff',
            borderColor: grid,
            borderWidth: 1,
            titleColor: isDark ? '#e2e8f0' : '#0f172a',
            bodyColor: isDark ? '#f59e0b' : '#92400e',
            padding: 10,
            callbacks: {
                label: function (c) {
                if (c.dataset.label === 'Theoretisch (kW)') {
                    return ' ' + fmt(c.parsed.y, 2) + ' kW';
                }
                if (c.dataset.label === 'Trend') {
                    return ' ' + fmt(c.parsed.y, 2) + ' kWh Trend';
                }
                var label = ' ' + fmt(c.parsed.y, 2) + ' kWh';
                if (hasTheo && data.efficiency && data.efficiency[c.dataIndex] != null) {
                    label += '  (' + Math.round(data.efficiency[c.dataIndex] * 100) + '%)';
                }
                return label;
                }
            }
            }
        },
        scales: {
            x: { grid: { color: grid }, ticks: { color: muted, maxRotation: 45, font: { size: 11 }, maxTicksLimit: data.labels.length > 60 ? 18 : undefined } },
            y: { grid: { color: grid }, ticks: { color: muted, callback: function (v) { return v + ' kWh'; } }, beginAtZero: true, position: 'left' },
            y2: hasTheo ? {
            grid: { drawOnChartArea: false },
            ticks: { color: blue, callback: function (v) { return v + ' kW'; }, font: { size: 10 } },
            beginAtZero: true,
            position: 'right'
            } : { display: false }
        }
        }
    });
    }

    function renderYearBars(years) {
    if (!years || !years.length) return;
    var sorted = years.slice().sort(function (a, b) { return a.year - b.year; });
    var max = Math.max.apply(null, sorted.map(function (y) { return y.kwh; }).concat([1]));
    var currentYear = new Date().getFullYear().toString();

    // Trendberechnung über alle Jahre
    var trendVals = null;
    if (sorted.length >= 3) {
        trendVals = linearRegression(sorted.map(function (y) { return y.kwh; }));
    }

    $('year-bars').innerHTML = sorted.map(function (y, i) {
        var prev = i > 0 ? sorted[i - 1] : null;
        var isCurrent = y.year === currentYear;
        var pct = (y.kwh / max * 100).toFixed(1);

        // Vergleich zum Vorjahr
        var diffHtml = '';
        if (prev && prev.kwh > 0) {
        // Laufendes Jahr: Vergleich mit Vorjahr gleicher Zeitraum
        var compareBase = (y.partial && y.prev_same_period != null) ? y.prev_same_period : prev.kwh;
        var compareLabel = (y.partial && y.prev_same_period != null) ? ' (gleicher Zeitraum)' : '';
        var diff = y.kwh - compareBase;
        var diffPct = compareBase > 0 ? (diff / compareBase * 100).toFixed(1) : '0';
        var isGain = diff >= 0;
        var arrow = isGain ? '&#9650;' : '&#9660;';
        var cls = isGain ? 'yb-gain' : 'yb-loss';
        diffHtml = '<span class="' + cls + '">' + arrow + ' ' +
            fmt(Math.abs(diff), 0) + ' kWh (' + (isGain ? '+' : '') + diffPct + '%)' +
            compareLabel + '</span>';
        }
        // Hinweis bei laufendem Jahr
        var partialHtml = y.partial ? '<span class="yb-share">laufendes Jahr</span>' : '';

        // Trendwert für dieses Jahr
        var trendHtml = '';
        if (trendVals && trendVals[i] != null) {
        var trendDiff = y.kwh - trendVals[i];
        var trendCls = trendDiff >= 0 ? 'yb-gain' : 'yb-loss';
        trendHtml = '<span class="yb-trend-val ' + trendCls + '">&#8776; ' +
            fmt(trendVals[i], 0) + ' kWh Trend</span>';
        }

        // Anteil am Maximalwert
        var shareHtml = y.partial ? '' : '<span class="yb-share">' + pct + '% von Best</span>';

        return '<div class="yb-item' + (isCurrent ? ' yb-current' : '') + '">' +
        '<div class="yb-label">' + y.year + (isCurrent ? ' &#9679;' : '') + '</div>' +
        '<div class="yb-val">' + fmt(y.kwh, 0) + '</div>' +
        '<div class="yb-unit">kWh</div>' +
        '<div class="yb-track"><div class="yb-fill" style="width:' + pct + '%"></div></div>' +
        partialHtml +
        diffHtml +
        trendHtml +
        shareHtml +
        '</div>';
    }).join('');
    }

    function renderChartStats(data) {
    var el = $('chart-stats');
    if (!el) return;

    function cs(label, valHtml, raw) {
        return '<div class="cs-item"><div class="cs-label">' + label + '</div>' +
        (raw ? valHtml : '<div class="cs-val">' + valHtml + '</div>') + '</div>';
    }

    // Stundenwerte: Produktion + theoretische Tagesenergie (kWh vs kWh)
    if (data.period_type === 'hour') {
        var theoSoFar = data.theo_so_far || data.theo_daily_kwh || 0;
        var theoFull = data.theo_daily_kwh || 0;
        el.innerHTML = cs('Produktion', '<span class="cs-val c-accent">' + fmt(data.total_kwh, 2) + ' kWh</span>', true);
        if (theoSoFar > 0) {
        el.innerHTML += cs('Theoretisch', fmt(theoFull, 2) + ' kWh');
        var eff = Math.round(data.total_kwh / theoSoFar * 100);
        if (eff > 0 && eff <= 150) {
            var effCls = eff >= 80 ? 'c-green' : eff >= 50 ? 'c-accent' : 'c-red';
            el.innerHTML += cs('Wirkungsgrad', '<span class="cs-val ' + effCls + '">' + eff + '%</span>', true);
        }
        }
        return;
    }

    // Nur bei day und month
    if (data.period_type !== 'day' && data.period_type !== 'month') {
        el.innerHTML = ''; return;
    }

    var vals = data.values.filter(function (v) { return v > 0; });
    if (!vals.length) { el.innerHTML = ''; return; }

    var total = data.total_kwh;
    var avg = total / vals.length;
    var best = Math.max.apply(null, vals);
    var worst = Math.min.apply(null, vals);
    var bestLbl = data.labels[data.values.indexOf(best)] || '';
    var wrstLbl = data.labels[data.values.indexOf(worst)] || '';

    var trendHtml = '';
    if (vals.length >= 3) {
        var tr = linearRegression(data.values);
        if (tr) {
        var slope = tr[tr.length - 1] - tr[0];
        var trendCls = slope >= 0 ? 'c-green' : 'c-red';
        var trendTxt = slope >= 0 ? '&#9650; steigend' : '&#9660; fallend';
        trendHtml = cs('Trend', '<span class="cs-val ' + trendCls + '">' + trendTxt + '</span>', true);
        }
    }

    el.innerHTML =
        cs('Zeitraum', data.count + (data.period_type === 'day' ? ' Tage' : ' Monate')) +
        cs('Gesamt', '<span class="cs-val c-accent">' + fmt(total, 1) + ' kWh</span>', true) +
        cs('Durchschnitt', fmt(avg, 1) + ' kWh') +
        cs('Bestwert', fmt(best, 1) + ' kWh<br><span style="font-size:.65rem;color:var(--muted)">' + bestLbl + '</span>') +
        cs('Schlechtester', fmt(worst, 1) + ' kWh<br><span style="font-size:.65rem;color:var(--muted)">' + wrstLbl + '</span>') +
        trendHtml;
    }

    function renderDateControls(period) {
    const el = $('date-controls');
    el.innerHTML = '';
    if (period === 'hour') {
        const inp = document.createElement('input');
        inp.type = 'date'; inp.value = today(); inp.max = today();
        inp.addEventListener('change', function () { loadChart('hour', { date: inp.value }); });
        el.appendChild(inp);
    } else if (period === 'week') {
        // Woche: Datum-Picker, zeigt Mo-So der gewählten Woche
        const inp = document.createElement('input');
        inp.type = 'date'; inp.value = today(); inp.max = today();
        inp.addEventListener('change', function () {
        var d = new Date(inp.value);
        var day = d.getDay() || 7; // So=0 → 7
        var mon = new Date(d); mon.setDate(d.getDate() - day + 1);
        var sun = new Date(mon); sun.setDate(mon.getDate() + 6);
        loadChart('day', { from: mon.toISOString().slice(0, 10), to: sun.toISOString().slice(0, 10) });
        });
        el.appendChild(inp);
        // Sofort aktuelle Woche laden
        var now = new Date();
        var day = now.getDay() || 7;
        var mon = new Date(now); mon.setDate(now.getDate() - day + 1);
        var sun = new Date(mon); sun.setDate(mon.getDate() + 6);
        loadChart('day', { from: mon.toISOString().slice(0, 10), to: sun.toISOString().slice(0, 10) });
    } else if (period === 'day') {
        const d30 = new Date(); d30.setDate(d30.getDate() - 30);
        const from = document.createElement('input'); from.type = 'date'; from.value = d30.toISOString().slice(0, 10); from.max = today();
        const to = document.createElement('input'); to.type = 'date'; to.value = today(); to.max = today();
        function reload() { loadChart('day', { from: from.value, to: to.value }); }
        from.addEventListener('change', reload); to.addEventListener('change', reload);
        el.appendChild(from); el.appendChild(to);
    } else if (period === 'month') {
        const from = document.createElement('input'); from.type = 'month'; from.value = (new Date().getFullYear() - 1) + '-01'; from.max = thisMonth();
        const to = document.createElement('input'); to.type = 'month'; to.value = thisMonth(); to.max = thisMonth();
        function reload() { loadChart('month', { from: from.value, to: to.value }); }
        from.addEventListener('change', reload); to.addEventListener('change', reload);
        el.appendChild(from); el.appendChild(to);
    }
    }

    // ── Tabs ─────────────────────────────────────────────────────
    document.querySelectorAll('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var period = btn.getAttribute('data-period');
        if (!period) return;  // CSV-Button hat kein data-period
        renderDateControls(period);
        loadChart(period);
    });
    });

    // ── Tabelle ──────────────────────────────────────────────────
    function renderPvTable(data) {
    if (!data || !data.labels) return;
    var head = $('pv-table-head');
    var body = $('pv-table-body');
    var foot = $('pv-table-foot');
    if (!head || !body) return;

    var titles = { hour: 'Stundenwerte', day: 'Tageswerte', month: 'Monatswerte', year: 'Jahreswerte' };
    var el = $('table-title');
    if (el) el.textContent = titles[data.period_type] || 'Daten';

    var hasTheo = data.theoretical && data.theoretical.some(function (v) { return v > 0; });
    var hasEff = data.efficiency && data.efficiency.some(function (v) { return v != null; });

    // Header
    var h = '<th>Zeitraum</th><th class="num">Produktion kWh</th>';
    if (hasTheo) h += '<th class="num">Theoretisch kW</th>';
    if (hasEff) h += '<th class="num">Wirkungsgrad</th>';
    head.innerHTML = h;

    // Body
    var totalProd = 0, totalTheo = 0;
    body.innerHTML = data.labels.map(function (lbl, i) {
        var val = data.values[i] || 0;
        totalProd += val;
        var row = '<td>' + lbl + '</td><td class="num">' + fmt(val, 3) + '</td>';
        if (hasTheo) {
        var tv = data.theoretical[i] || 0;
        totalTheo += tv;
        row += '<td class="num">' + fmt(tv, 3) + '</td>';
        }
        if (hasEff) {
        var ev = data.efficiency[i];
        if (ev != null) {
            var pct = Math.round(ev * 100);
            var cls = pct > 100 ? 'c-green' : pct >= 70 ? '' : 'c-red';
            row += '<td class="num ' + cls + '">' + pct + '%</td>';
        } else {
            row += '<td class="num">--</td>';
        }
        }
        return '<tr>' + row + '</tr>';
    }).join('');

    // Footer
    var f = '<td>Gesamt</td><td class="num">' + fmt(totalProd, 2) + '</td>';
    if (hasTheo) f += '<td class="num">' + fmt(totalTheo, 2) + '</td>';
    if (hasEff && totalTheo > 0) f += '<td class="num">' + Math.round(totalProd / totalTheo * 100) + '%</td>';
    else if (hasEff) f += '<td></td>';
    foot.innerHTML = f;
    }

    window.exportPvCSV = function () {
    if (!lastChartData || !lastChartData.labels) return;
    var d = lastChartData;
    var hasTheo = d.theoretical && d.theoretical.some(function (v) { return v > 0; });
    var header = 'Zeitraum;Produktion kWh' + (hasTheo ? ';Theoretisch kWh' : '');
    var lines = [header];
    d.labels.forEach(function (lbl, i) {
        var row = lbl + ';' + (d.values[i] || 0).toFixed(3).replace('.', ',');
        if (hasTheo) row += ';' + (d.theoretical[i] || 0).toFixed(3).replace('.', ',');
        lines.push(row);
    });
    // BOM für Excel UTF-8 Erkennung + Semikolon-Trennung für DE
    var bom = '\uFEFF';
    var blob = new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pv_' + (d.period_type || 'data') + '_' + today() + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 100);
    }

    // ── Init ─────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
    loadCurrent();
    renderDateControls('hour');
    loadChart('hour', { date: today() });

    setInterval(function () {
        // Kacheln + Phasen immer aktualisieren
        loadCurrent();

        // Chart: aktuelle Auswahl neu laden
        var inp1 = document.querySelector('#date-controls input:first-child');
        var inp2 = document.querySelector('#date-controls input:last-child');

        if (currentPeriod === 'hour') {
        var date = inp1 ? inp1.value : today();
        // Nur heute auto-refresh (historische Tage ändern sich nicht)
        if (date === today()) loadChart('hour', { date: date });

        } else if (currentPeriod === 'day') {
        if (inp1 && inp2) loadChart('day', { from: inp1.value, to: inp2.value });
        else loadChart('day');

        } else if (currentPeriod === 'month') {
        if (inp1 && inp2) loadChart('month', { from: inp1.value, to: inp2.value });
        else loadChart('month');

        } else if (currentPeriod === 'year') {
        loadChart('year');
        }
    }, 60000);
    });

})();