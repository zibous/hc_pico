// frontend/static/js/v3/main.js
import { buildHTMLSkeleton } from './layout.js';
import { initTheme } from './theme.js';
import { initTilesContainer, renderTiles } from './tiles.js';
import { updateSunAnimation } from './tile_status.js';
import { initCharts, renderChartData } from './chartRender.js';
import { initTable, renderTable } from './table.js';
import { initDateSelector } from './dateselector.js';

// Archiv-Zustand (Exklusiv für das Diagramm & Tabelle unten)
let currentPeriod = 'hour';
let dateFrom = new Date().toLocaleDateString('sv-SE');
let dateTo = new Date().toLocaleDateString('sv-SE');

/**
 * 🌟 OPTIMIERT: Lädt die historischen Daten exklusiv für Chart & Tabelle
 */
async function fetchHistoricalData() {
  try {
    const queryParam = currentPeriod === 'hour' ? `date=${dateFrom}` : `from=${dateFrom}&to=${dateTo}`;
    const response = await fetch(`api/combined/${currentPeriod}?${queryParam}`);
    if (!response.ok) throw new Error('Fehler beim Laden des Archivs');
    const data = await response.json();

    // Aktualisiert punktgenau NUR die unteren Archiv-Komponenten
    renderChartData(data.chart, data.summary);
    renderTable(data.chart);
  } catch (error) {
    console.error("Archiv-Update fehlgeschlagen:", error);
  }
}

/**
 * 🌟 OPTIMIERT: Der permanente Echtzeit-Kanal (Läuft alle 10 Sek. für Kacheln & Header)
 */
async function fetchRealtimeLiveData() {
  try {
    // Holt immer die Daten der aktuellen Stunde für den Ist-Zustand deines Hauses
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const response = await fetch(`api/combined/hour?date=${todayStr}`);
    if (!response.ok) throw new Error('Live-API-Fehler');
    const data = await response.json();

    // Globaler Header-Zustand (Zeit)
    const serverTimeEl = document.getElementById('server-time');
    if (serverTimeEl) serverTimeEl.innerText = data['meta-data'].servertime;

    // 🌟 FIX: Verhindert das Überschreiben unserer farbigen CSS-Spans im Header!
    const titleEl = document.getElementById('app-title');
    if (titleEl && !titleEl.innerHTML.includes('span') && data['meta-data']?.apptitle) {
      titleEl.innerText = data['meta-data'].apptitle;
    }

    // Obere Kacheln & Dach-Animation live updaten
    renderTiles(data.current, data.summary, data.chart, data['meta-data']);
    updateSunAnimation(data.current);

    // Falls das Diagramm gerade auf "Heute" steht, aktualisieren wir es live mit!
    if (currentPeriod === 'hour' && dateFrom === todayStr) {
      renderChartData(data.chart, data.summary);
      renderTable(data.chart);
    }

    if (data['meta-data']?.appversion) {
        const footerVer = document.getElementById('footer-app-version');
        if (footerVer) {
            footerVer.innerText = `v${data['meta-data'].appversion} (BFF Architecture)`;
        }
    }

  } catch (error) {
    console.error("Live-Update fehlgeschlagen:", error);
  }
}

function initApp() {
  buildHTMLSkeleton();
  initTheme();
  initTilesContainer();
  initCharts();
  initTable();

  // 🌟 INITIALISIERUNG DES KALENDERS DIREKT IM GRAFIK-KASTEN
  const dsContainer = document.getElementById('date-selector-container');
  if (dsContainer) {
    initDateSelector(dsContainer, (periodType, fromKey, toKey) => {
        currentPeriod = periodType;
        dateFrom = fromKey;
        dateTo = toKey;
        fetchHistoricalData(); // Lädt sofort die Vergangenheit exklusiv unten
    });
  }

  // 🌟 FIX: Zwingt die Charts zum sofortigen Farbwechsel, wenn im Footer geklickt wird
  window.addEventListener('themeChanged', () => {
    fetchHistoricalData();
  });

  // Ersten Live-Durchlauf für die Kacheln triggern
  fetchRealtimeLiveData();

  // Zyklischer Intervall läuft unbemerkt im Hintergrund AUSSCHLIESSLICH für die Live-Werte
  setInterval(fetchRealtimeLiveData, 10000);
}

initApp();

// ─── App Info ───────────────────────────────────────────
console.info(
  '%c ⚡ Kostal Pico Dashboard %c ESM v2.5.0 ',
  'color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px',
  'color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px'
);
