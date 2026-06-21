// frontend/static/js/v3/layout.js
import { getAppleIcon } from './icons.js';

/**
 * Erzeugt das statische HTML-Skelett der SPA direkt im Body-Container (Fehlerfrei & Sticky-optimiert)
 */
export function buildHTMLSkeleton() {
  // 🌟 FIX: Schreibt das Skelett direkt in den Body, um das Sticky-Verhalten nicht zu blockieren
  const root = document.body;
  if (!root) return;

  const logoSVG = getAppleIcon('logo', 38, 1.0, 0, 'var(--accent)');

  root.innerHTML = `
        <!-- HEADER -->
        <header class="app-header frosted-glass" style="position: sticky !important; top: 0 !important; width: 100%; height: 130px; z-index: 10000; border-bottom: 1px solid var(--border); background: var(--bg-card); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); padding-right: 24px;">
            <div class="header-inner" style="height: 100%; max-width: 1440px; margin: 0 auto; padding: 0 24px; display: flex !important; justify-content: space-between !important; align-items: center !important; position: relative;">

                <!-- 🌟 LINKS: LOGO + TITLE UNTEREINANDERSTAPELUNG FÜR SUBTEXT -->
                <div class="brand" style="display: flex !important; flex-direction: row !important; align-items: center !important; gap: 14px !important;">
                    <div class="logo-wrapper" style="display: flex !important; align-items: center !important; justify-content: center !important; height: 38px !important;">
                        ${logoSVG}
                    </div>

                    <!-- 🌟 FIX: Von "center" auf "column" und "flex-start" umgestellt, damit der Subtext nach unten bricht -->
                    <div class="brand-text" style="display: flex !important; flex-direction: column !important; align-items: flex-start !important; justify-content: center !important;">
                        <h1 id="app-title" style="margin: 0 !important; font-size: 2.5rem !important; font-weight: 700 !important; letter-spacing: -0.5px !important; line-height: 1.1 !important;">
                            <span style="color: #eab308;">Solar</span><span style="color: #06b6d4;">Power</span>
                        </h1>
                        <div class="subtext" style="font-size: 11px !important; font-weight: 600 !important; color: var(--text-sub) !important; margin-top: 4px !important; letter-spacing: 0.2px !important;">
                            PIKO KOSTAL mit 24 x Solarfabrik Premium L260 Wp
                        </div>
                    </div>
                </div>

                <!-- 🌟 RECHTS: HINTERGRUND-SVG UND DARUNTER DIE STATUS-PILL -->
                <div class="header-right-wrapper" style="display: flex !important; flex-direction: column !important; align-items: flex-end !important; justify-content: center !important; gap: 4px !important; height: 100% !important; position: relative; z-index: 2;">

                    <!-- Das Solar-Hintergrundbild (Verhält sich nun relativ innerhalb der rechten Box, 45% Deckkraft) -->
                    <div class="header-bg-wrapper" style="pointer-events: none !important; display: flex !important; align-items: center !important;">
                        <svg style="width: auto; height: 65px; stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; opacity: 0.45;" viewBox="0 0 800 200">
                            <circle cx="150" cy="100" r="22" stroke="#eab308" stroke-width="4" fill="#eab308" fill-opacity="0.1" />
                            <path d="M 150 65 L 150 53 M 150 135 L 150 147 M 115 100 L 103 100 M 185 100 L 197 100 M 125 75 L 116 66 M 175 125 L 184 134 M 125 125 L 116 134 M 175 75 L 184 66" stroke="#eab308" stroke-width="3" />
                            <path d="M 50 100 L 95 100 M 205 100 L 290 100 L 305 100 L 315 45 L 330 155 L 345 25 L 360 135 L 370 100 L 410 100" stroke="currentColor" stroke-width="5" />
                            <rect x="420" y="55" width="90" height="90" rx="8" stroke="#06b6d4" stroke-width="3" fill="#06b6d4" fill-opacity="0.05" />
                            <line x1="450" y1="55" x2="450" y2="145" stroke="#06b6d4" stroke-width="2" />
                            <line x1="480" y1="55" x2="480" y2="145" stroke="#06b6d4" stroke-width="2" />
                            <line x1="420" y1="85" x2="510" y2="85" stroke="#06b6d4" stroke-width="2" />
                            <line x1="420" y1="115" x2="510" y2="115" stroke="#06b6d4" stroke-width="2" />
                            <path d="M 510 100 L 590 100" stroke="currentColor" stroke-width="5" />
                            <path d="M 655 35 L 620 110 L 650 110 L 635 175 L 680 95 L 650 95 Z" stroke="#ea580c" fill="#ea580c" fill-opacity="0.15" stroke-width="4" stroke-linejoin="miter" />
                            <path d="M 695 100 L 760 100" stroke="currentColor" stroke-width="5" />
                        </svg>
                    </div>

                    <!-- Die Status-Pill exakt unter dem SVG ausgerichtet -->
                    <div class="status-pill" style="display: inline-flex !important; align-items: center !important; gap: 6px !important; white-space: nowrap !important; background: rgba(128,128,128,0.08) !important; padding: 2px 8px !important; border-radius: 6px !important; border: 1px solid var(--border) !important; margin-right: 40px !important;">
                        <span class="status-dot pulsed"></span>
                        <p id="server-time" class="subtext" style="font-size: 11px !important; font-weight: 600 !important; color: var(--text-sub) !important; margin: 0 !important; letter-spacing: 0.2px !important;">Verbinde...</p>
                    </div>

                </div>
            </div>
        </header>


        <div class="dashboard-container">

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

        </div>

        <!-- 🌟 OPTIMIERT: Der Umschalter zieht harmonisch auf die rechte Seite des Footers um -->
        <footer class="app-footer" style="user-select: none;">
            <div class="footer-left">
                <span>© ${new Date().getFullYear()} Siebler Home Network</span>
                <span class="footer-divider">|</span>
                <span>Photovoltaik Monitor (KOSTAL PIKO 5.5)</span>
            </div>
            <div class="footer-right" style="display: flex; align-items: center; gap: 12px;">
                <span id="themeToggleFooter" style="cursor: pointer; font-weight: 500; text-decoration: underline; margin-right: 4px;">🌓 Design wechseln</span>
                <span class="footer-divider" style="opacity: 0.5;">|</span>
                <div id="footer-app-version">v2.2.0</div>
            </div>
        </footer>
  `;
}
