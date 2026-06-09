// frontend/static/js/v3/layout.js
import { getAppleIcon } from './icons.js';

/**
 * Erzeugt das statische HTML-Skelett der SPA direkt im Root-Container
 */
export function buildHTMLSkeleton() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const logoSVG = getAppleIcon('logo', 38, 1.0, 0, 'var(--accent)');

  root.innerHTML = `
    <div class="app-container">
        <!-- HEADER -->
        <header class="app-header frosted-glass">
            <div class="header-inner">
                <div class="brand">
                    <div class="logo-wrapper">${logoSVG}</div>
                    <div class="brand-text">
                        <h1 id="app-title">Solar</h1>
                        <div class="status-pill">
                            <span class="status-dot pulsed"></span>
                            <p id="server-time" class="subtext">Verbinde...</p>
                        </div>
                    </div>
                </div>
                <div class="header-controls">
                    <button id="theme-toggle" class="apple-btn-blur" title="Design wechseln">🌙</button>
                </div>
            </div>
        </header>

        <!-- KACHELN- & GRAFIK-GRID (Permanent Echtzeit) -->
        <main class="dashboard-grid">
            <div id="tiles-render-bridge" style="display: contents;"></div>
        </main>

        <!-- DIAGRAMME & HISTORIE -->
        <section class="history-section apple-card">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 4px; flex-wrap: wrap; gap: 12px;">
              <h2 style="font-size: 15px; font-weight: 700; color: var(--orange); text-transform: uppercase; letter-spacing: 0.5px;">Ertrags- & Prognosediagramm</h2>
              <div id="date-selector-container"></div>
            </div>
            <div class="chart-wrapper"><canvas id="dashboardChart"></canvas></div>
            <div class="chart-kpis" id="chart-kpi-container" style="display: flex; flex-direction: column; gap: 12px; width: 100%;"></div>
        </section>

        <!-- CSV TABELLE -->
        <section class="table-section apple-card">
            <div class="table-header">
                <h2>Datenhistorie</h2>
                <button id="csv-export-btn" class="apple-btn">Exportieren (CSV)</button>
            </div>
            <div class="table-wrapper" id="data-table-container"></div>
        </section>

        <footer class="app-footer">
            <div class="footer-left">
                <span>© ${new Date().getFullYear()} Siebler Home Network</span>
                <span class="footer-divider">|</span>
                <span>Photovoltaik Monitor (KOSTAL PIKO 5.5)</span>
            </div>
            <div class="footer-right" id="footer-app-version">v2.2.0</div>
        </footer>
    </div>
  `;
}
