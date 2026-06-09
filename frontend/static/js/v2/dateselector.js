// frontend/static/js/v3/dateselector.js
import { getAppleIcon } from './icons.js';

const STORAGE_KEY = 'em-period-label';

/**
 * Hilfsfunktion: Berechnet Datumsbereiche basierend auf der Auswahl
 */
function calcRange(key) {
    const now = new Date();
    let f = new Date(), t = new Date();
    f.setHours(0, 0, 0, 0);
    t.setHours(23, 59, 59, 999);

    switch (key) {
        case 'today': break;
        case 'gestern':
            f.setDate(now.getDate() - 1);
            t.setDate(now.getDate() - 1);
            break;
        case 'woche': {
            const day = now.getDay();
            f.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
            break;
        }
        case '7tage': f.setDate(now.getDate() - 6); break;
        case '30tage': f.setDate(now.getDate() - 29); break;
        case 'monat': f.setDate(1); break;
    }
    return { from: fmtDate(f), to: fmtDate(t) };
}

function fmtDate(d) {
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
}

/**
 * Initialisiert den intelligenten Apple-Style DateSelector
 * @param {HTMLElement} container - Ziel-Div im Header
 * @param {Function} onPeriodChange - Callback liefert (periodType, dateOrFrom, optionalTo)
 */
export function initDateSelector(container, onPeriodChange) {
    if (!container) return;

    let savedLabel = localStorage.getItem(STORAGE_KEY) || 'Heute';
    const currentYear = new Date().getFullYear();
    let yearOptions = '';

    // Dynamische Jahre generieren (Abhängig von deinem Anlagenstart 2013!)
    for (let y = currentYear; y >= 2013; y--) {
        yearOptions += `<option value="${y}">Jahr ${y}</option>`;
    }

    // 🌟 STYLES GEFIXT: Nutzt jetzt deine globalen Apple-Health CSS Variablen!
    if (!document.getElementById('ds-styles')) {
        const style = document.createElement('style');
        style.id = 'ds-styles';
        style.textContent = `
            .ds-wrap { position: relative; display: inline-flex; align-items: center; gap: 10px; }
            .ds-label { font-size: 13px; color: var(--text-sub); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .ds-btn {
                padding: 8px 16px; border-radius: 10px;
                border: 1px solid var(--border); background: var(--bg-card);
                color: var(--text-main); cursor: pointer; font-size: 14px; font-weight: 600; font-family: inherit;
                box-shadow: 0 2px 6px rgba(0,0,0,0.02); transition: background-color 0.2s, border-color 0.2s;
            }
            .ds-btn::after { content: " ▾"; opacity: .6; }
            .ds-dropdown {
                position: absolute; top: calc(100% + 8px); right: 0;
                min-width: 240px; border-radius: 16px; padding: 8px; z-index: 9999;
                max-height: 420px; overflow-y: auto;
                background: var(--bg-card); border: 1px solid var(--border);
                box-shadow: 0 4px 24px rgba(0,0,0,0.08); transition: background-color 0.2s;
            }
            .ds-dropdown.hidden { display: none; }
            .ds-section { font-size: 11px; font-weight: 700; color: var(--text-sub); padding: 8px 12px 4px; text-transform: uppercase; letter-spacing: .5px; }
            .ds-item { padding: 8px 12px; border-radius: 8px; font-size: 14px; color: var(--text-main); cursor: pointer; font-weight: 500; }
            .ds-item:hover { background: var(--bg-app); }
            .ds-item.active { background: var(--accent); color: #ffffff; font-weight: 600; }
            .ds-select { width: calc(100% - 24px); margin: 4px 12px; padding: 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-app); color: var(--text-main); font-size: 14px; outline: none; }
            .ds-custom { padding: 8px 12px; display: none; }
            .ds-custom.show { display: flex; flex-direction: column; gap: 8px; }
            .ds-custom input { padding: 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-app); color: var(--text-main); font-size: 14px; outline: none; }
            .ds-custom button { padding: 10px; border-radius: 10px; border: none; background: var(--accent); color: #ffffff; font-size: 14px; cursor: pointer; font-weight: 600; }
        `;
        document.head.appendChild(style);
    }

    const wrap = document.createElement('div');
    wrap.className = 'ds-wrap';
    const svgCalendar = getAppleIcon('calendar', 16, 0.7, 5, 'var(--text-sub)');

    wrap.innerHTML = `
        <span class="ds-label">${svgCalendar}Zeitraum:</span>
        <button class="ds-btn" id="dsBtn">${savedLabel}</button>
        <div class="ds-dropdown hidden" id="dsDrop">
            <div class="ds-section">Relativ</div>
            <div class="ds-item" data-key="today">Heute</div>
            <div class="ds-item" data-key="gestern">Gestern</div>
            <div class="ds-item" data-key="woche">Diese Woche</div>
            <div class="ds-item" data-key="7tage">Letzte 7 Tage</div>
            <div class="ds-item" data-key="30tage">Letzte 30 Tage</div>
            <div class="ds-item" data-key="monat">Dieser Monat</div>
            <div class="ds-section">Archiv</div>
            <select class="ds-select" id="dsYear">
                <option value="">Jahr auswählen…</option>
                ${yearOptions}
            </select>
            <div class="ds-section" style="cursor:pointer; margin-top:5px;" id="dsCustomToggle">Individuell…</div>
            <div class="ds-custom" id="dsCustom">
                <input type="date" id="dsFrom">
                <input type="date" id="dsTo">
                <button id="dsApply">Anwenden</button>
            </div>
        </div>
    `;

    container.appendChild(wrap);

    const btn = wrap.querySelector('#dsBtn');
    const drop = wrap.querySelector('#dsDrop');
    const yearSel = wrap.querySelector('#dsYear');
    const customToggle = wrap.querySelector('#dsCustomToggle');
    const customBox = wrap.querySelector('#dsCustom');
    const fromInput = wrap.querySelector('#dsFrom');
    const toInput = wrap.querySelector('#dsTo');
    const applyBtn = wrap.querySelector('#dsApply');

    btn.addEventListener('click', (e) => { e.stopPropagation(); drop.classList.toggle('hidden'); });
    document.addEventListener('click', () => drop.classList.add('hidden'));
    drop.addEventListener('click', (e) => e.stopPropagation());
    customToggle.addEventListener('click', () => customBox.classList.toggle('show'));

    /**
     * 🌟 DIE BRANDNEUE URUMSCHALT-LOGIK FÜR DIE API
     * Übersetzt das ausgewählte Label in den passenden combined-Pfadtyp
     */
    function fire(label, start, end, forcedPeriodType = null) {
        savedLabel = label;
        localStorage.setItem(STORAGE_KEY, label);
        btn.textContent = label;
        drop.classList.add('hidden');

        drop.querySelectorAll('.ds-item').forEach(el => {
            el.classList.toggle('active', el.textContent.trim() === label);
        });

        // Bestimmt den exakten API-Intervalltyp für den combined Endpoint
        let periodType = forcedPeriodType;
        if (!periodType) {
            if (label === 'Heute' || label === 'Gestern') periodType = 'hour';
            else if (label === 'Diese Woche' || label === 'Letzte 7 Tage') periodType = 'day';
            else if (label === 'Letzte 30 Tage' || label === 'Dieser Monat' || label.startsWith('Individuell')) periodType = 'day';
            else if (label.startsWith('Jahr')) periodType = 'month';
        }

        // Sendet den berechneten Befehl zurück an die Hauptschleife in main.js
        onPeriodChange(periodType, start, end);
    }

    // Event Listener für Klicks auf relative Zeiträume
    drop.querySelectorAll('.ds-item').forEach(item => {
        item.addEventListener('click', () => {
            const key = item.getAttribute('data-key');
            const range = calcRange(key);
            fire(item.textContent.trim(), range.from, range.to);
        });
    });

    // Event Listener für das Archiv-Jahresauswahlmenü
    yearSel.addEventListener('change', () => {
        if (!yearSel.value) return;
        const y = yearSel.value;
        fire(`Jahr ${y}`, `${y}-01-01`, `${y}-12-31`, 'month');
    });

    // Event Listener für individuelle Datumsbereiche
    applyBtn.addEventListener('click', () => {
        if (!fromInput.value || !toInput.value) return;
        fire(`Bereich`, fromInput.value, toInput.value, 'day');
    });

    // 🌟 KORREKTUR: Der asynchrone Initialisierungs-Trigger beim ersten Seitenaufruf
    setTimeout(() => {
        if (savedLabel === 'Heute' || savedLabel === 'Gestern' || savedLabel === 'Diese Woche' || savedLabel === 'Dieser Monat' || savedLabel === 'Letzte 7 Tage' || savedLabel === 'Letzte 30 Tage') {
            const relativeKeys = { 'Heute': 'today', 'Gestern': 'gestern', 'Diese Woche': 'woche', 'Letzte 7 Tage': '7tage', 'Letzte 30 Tage': '30tage', 'Dieser Monat': 'monat' };
            const range = calcRange(relativeKeys[savedLabel]);
            fire(savedLabel, range.from, range.to);
        } else if (savedLabel.startsWith('Jahr ')) {
            const y = savedLabel.replace('Jahr ', '');
            fire(savedLabel, `${y}-01-01`, `${y}-12-31`, 'month');
        } else {
            fire('Heute', fmtDate(new Date()), fmtDate(new Date()), 'hour');
        }
    }, 50);
}
