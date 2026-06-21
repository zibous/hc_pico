(()=>{function k(e,r=16,t=1,a=0,i="currentColor",s=""){let n=`width:${r}px; height:${r}px; stroke:${i}; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:text-bottom; flex-shrink:0; opacity:${t}; margin-right:${a}px;`,o=s?`class="${s}"`:"";return{logo:`<svg ${o} style="${n}" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M7 10h4M13 14h4M7 14l3-3M14 13l3-3M3 9h18M3 15h18"/></svg>`,energy:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,trend:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"/></svg>`,sync:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,calendar:`<svg ${o} style="${n}" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,sun:`<svg ${o} style="${n}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,moon:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,radar:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v20M2 12h20"/></svg>`,bar:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6M3 20h18"/></svg>`,signal:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.59 16.11a6 6 0 0 1 6.82 0M12 20h.01"/></svg>`,power:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,curpower:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,week:`<svg ${o} style="${n}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,clock:`<svg ${o} style="${n}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,co2:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5c.5 0 1 .1 1.5.4C6.5 10 8 8.5 10 8.5c2.2 0 4 1.8 4 4v4H4.5z"/><path d="M12 16.5h7.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5c-.5 0-1 .1-1.5.4c-.5-1.9-2-3.4-4-3.4c-1 0-2 .4-2.7 1"/></svg>`,tree:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="m12 2 8 13H4L12 2zM12 15v6M9 21h6"/></svg>`,voltage:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>`,ampere:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,efficiency:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M2 20h20M21 6l-7 7-4-4-6 6M21 6h-4M21 6v4"/></svg>`,reactive_power:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="m3 3 18 18M21 3v6M3 21h6"/></svg>`,symmetry:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5 19l14-14"/></svg>`,car:`<svg ${o} style="${n}" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/></svg>`}[e]||""}function D(){let e=document.body;if(!e)return;let r=k("logo",38,1,0,"var(--accent)");e.innerHTML=`
        <!-- HEADER -->
        <header class="app-header frosted-glass" style="position: sticky !important; top: 0 !important; width: 100%; height: 130px; z-index: 10000; border-bottom: 1px solid var(--border); background: var(--bg-card); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); padding-right: 24px;">
            <div class="header-inner" style="height: 100%; max-width: 1440px; margin: 0 auto; padding: 0 24px; display: flex !important; justify-content: space-between !important; align-items: center !important; position: relative;">

                <!-- \u{1F31F} LINKS: LOGO + TITLE UNTEREINANDERSTAPELUNG F\xDCR SUBTEXT -->
                <div class="brand" style="display: flex !important; flex-direction: row !important; align-items: center !important; gap: 14px !important;">
                    <div class="logo-wrapper" style="display: flex !important; align-items: center !important; justify-content: center !important; height: 38px !important;">
                        ${r}
                    </div>

                    <!-- \u{1F31F} FIX: Von "center" auf "column" und "flex-start" umgestellt, damit der Subtext nach unten bricht -->
                    <div class="brand-text" style="display: flex !important; flex-direction: column !important; align-items: flex-start !important; justify-content: center !important;">
                        <h1 id="app-title" style="margin: 0 !important; font-size: 2.5rem !important; font-weight: 700 !important; letter-spacing: -0.5px !important; line-height: 1.1 !important;">
                            <span style="color: #eab308;">Solar</span><span style="color: #06b6d4;">Power</span>
                        </h1>
                        <div class="subtext" style="font-size: 11px !important; font-weight: 600 !important; color: var(--text-sub) !important; margin-top: 4px !important; letter-spacing: 0.2px !important;">
                            PIKO KOSTAL mit 24 x Solarfabrik Premium L260 Wp
                        </div>
                    </div>
                </div>

                <!-- \u{1F31F} RECHTS: HINTERGRUND-SVG UND DARUNTER DIE STATUS-PILL -->
                <div class="header-right-wrapper" style="display: flex !important; flex-direction: column !important; align-items: flex-end !important; justify-content: center !important; gap: 4px !important; height: 100% !important; position: relative; z-index: 2;">

                    <!-- Das Solar-Hintergrundbild (Verh\xE4lt sich nun relativ innerhalb der rechten Box, 45% Deckkraft) -->
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

        <!-- \u{1F31F} OPTIMIERT: Der Umschalter zieht harmonisch auf die rechte Seite des Footers um -->
        <footer class="app-footer" style="user-select: none;">
            <div class="footer-left">
                <span>\xA9 ${new Date().getFullYear()} Siebler Home Network</span>
                <span class="footer-divider">|</span>
                <span>Photovoltaik Monitor (KOSTAL PIKO 5.5)</span>
            </div>
            <div class="footer-right" style="display: flex; align-items: center; gap: 12px;">
                <span id="themeToggleFooter" style="cursor: pointer; font-weight: 500; text-decoration: underline; margin-right: 4px;">\u{1F313} Design wechseln</span>
                <span class="footer-divider" style="opacity: 0.5;">|</span>
                <div id="footer-app-version">v2.2.0</div>
            </div>
        </footer>
  `}var V="apple-dashboard-theme";function H(){let e=localStorage.getItem("health-theme")||localStorage.getItem(V),r=window.matchMedia("(prefers-color-scheme: dark)").matches;P(e||"dark"),document.addEventListener("click",a=>{if(a.target&&a.target.id==="themeToggleFooter"){let s=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";P(s),localStorage.setItem(V,s),localStorage.setItem("health-theme",s),window.dispatchEvent(new Event("themeChanged"))}})}function P(e){document.documentElement.setAttribute("data-theme",e),document.body.classList.remove("apple-theme-dark","apple-theme-light"),document.body.classList.add(e==="dark"?"apple-theme-dark":"apple-theme-light"),Q(e)}function Q(e){let r=document.getElementById("themeToggleFooter");r!=null&&(r.innerHTML=e==="dark"?"\u2600\uFE0F Helles Design":"\u{1F319} Dunkles Design")}var $=class{constructor(r,t,a,i,s=[]){this.id=r,this.title=t,this.iconName=a,this.iconColor=i,this.rows=s}render(){let r="";return this.rows.forEach(t=>{let a=t.trend?`<canvas id="spark-${t.id}" width="60" height="20" style="width:60px; height:20px; margin: 0 8px; flex-shrink:0; display: inline-block;"></canvas>`:"",i=t.progress?`<div class="tile-progress-bg"><div id="progress-${t.id}" class="tile-progress-bar" style="width: 0%; background-color: ${this.iconColor};"></div></div>`:"";r+=`
        <div class="tile-row-wrapper">
          <div class="tile-row-item">
            <span class="tile-row-label">${t.label}</span>
            <span class="tile-row-value-container">
              ${a}
              <span id="val-${t.id}" class="tile-row-value">--</span>
              <span class="tile-row-unit">${t.unit||""}</span>
            </span>
          </div>
          ${i}
        </div>
      `}),`
      <div class="apple-card health-card-grouped" id="card-${this.id}">
        <div class="card-header-grouped">
          <div class="card-header-title-block">
            ${k(this.iconName,18,.9,6,this.iconColor)}
            <h3>${this.title}</h3>
          </div>
          <span id="status-${this.id}" class="card-status-badge"></span>
        </div>
        <div class="card-body-rows">
          ${r}
        </div>
      </div>
    `}updateValue(r,t,a=null){let i=document.getElementById(`val-${r}`);i&&(i.innerText=t,a&&(i.style.color=a))}updateProgress(r,t){let a=document.getElementById("progress-"+r);if(a){let i=Math.max(0,Math.min(100,t||0));a.style.width=`${i}%`}}updateStatus(r,t="var(--text-sub)"){let a=document.getElementById(`status-${this.id}`);a&&(a.innerText=r?r.toUpperCase():"",a.style.backgroundColor=r?`${t}15`:"transparent",a.style.color=t)}drawTrend(r,t){requestAnimationFrame(()=>{let a=document.getElementById(`spark-${r}`);if(!a||!t||t.length<2)return;let i=a.getContext("2d");i.clearRect(0,0,a.width,a.height);let s=getComputedStyle(document.body).getPropertyValue("--text-main").trim()||"#1d1d1f",n=Math.max(...t),o=Math.min(...t),d=n-o||1;i.beginPath(),i.lineWidth=2,i.strokeStyle=s,i.lineCap="round",i.lineJoin="round",t.forEach((l,h)=>{let m=h/(t.length-1)*a.width,g=a.height-(l-o)/d*a.height;h===0?i.moveTo(m,g):i.lineTo(m,g)}),i.stroke()})}};function F(){return{perf:new $("perf","Leistungs\xFCbersicht","curpower","var(--accent)",[{id:"mode",label:"Wechselrichter"},{id:"now_w",label:"Aktuelle Leistung",unit:"W",trend:!0,progress:!0},{id:"today",label:"Ertrag Heute",unit:"kWh",progress:!0},{id:"week",label:"Ertrag Woche",unit:"kWh"},{id:"month",label:"Ertrag Monat",unit:"kWh"},{id:"year",label:"Ertrag Jahr",unit:"kWh"}]),grid:new $("grid","Netz-Analyse & Qualit\xE4t","symmetry","var(--orange)",[{id:"l1_v",label:"Netzspannung L1",unit:"V"},{id:"l2_v",label:"Netzspannung L2",unit:"V"},{id:"l3_v",label:"Netzspannung L3",unit:"V"},{id:"imbalance",label:"Schieflast (Symmetrie)",unit:"W",trend:!0},{id:"apparent",label:"Scheinleistung",unit:"VA"},{id:"reactive",label:"Blindleistung",unit:"var",trend:!0}]),wr:new $("wr","Wechselrichter-Analyse","efficiency","var(--accent)",[{id:"dc_total",label:"Gleichstrom DC-Input",unit:"W"},{id:"ac_total",label:"Wechselstrom AC-Output",unit:"W"},{id:"loss",label:"Verlustleistung",unit:"W"},{id:"eff_pct",label:"Wirkungsgrad",unit:"%",trend:!0,progress:!0},{id:"eff_soll",label:"Tagesprognose (Soll)",unit:"kWh"},{id:"eff_ratio",label:"Performance Ratio",unit:"%",progress:!0},{id:"weather",label:"Himmel-Klarheit"}]),env:new $("env","CO\u2082 Umwelt-Bilanz","co2","var(--green)",[{id:"co2_today",label:"Vermeidung Heute",unit:"kg"},{id:"co2_kg",label:"Vermeidung Gesamt",unit:"kg"},{id:"co2_t",label:"Vermeidung Gesamt",unit:"t"},{id:"trees",label:"Gepflanzte B\xE4ume",unit:"Stk"},{id:"car_km",label:"E-Auto Reichweite",unit:"km"}]),sys:new $("sys","System- & Metadaten","clock","var(--text-sub)",[{id:"sys_time",label:"Letztes API-Update"},{id:"sys_vendor",label:"Hersteller (Marke)"},{id:"sys_name",label:"Hardware (Modell)"},{id:"sys_runtime",label:"Laufzeit (Betrieb)"},{id:"sys_hours",label:"Produktionsstunden",unit:"h"}])}}function p(e,r=2){return e==null||isNaN(e)?"0,00":new Intl.NumberFormat("de-AT",{minimumFractionDigits:r,maximumFractionDigits:r}).format(e)}function T(e){switch(e?.toLowerCase()){case"perfekt":case"ok":case"einspeisen mpp":return"var(--green)";case"gut":case"standby":return"var(--orange)";default:return"var(--text-sub)"}}var L={};function R(){let e=document.getElementById("tiles-render-bridge");if(!e)return;L=F();let r="";Object.values(L).forEach(t=>{r+=t.render()}),r+=`
    <div class="apple-card graphic-card" id="sun-animation-container">
      <div style="color: var(--text-sub); font-size: 13px; font-weight: 500;">Initialisiere Grafik...</div>
    </div>
  `,e.innerHTML=r}function N(e,r,t,a){if(!e||!r||Object.keys(L).length===0)return;let i=T(e.mode),s=t&&t.values?t.values:[],n=L.perf;n.updateStatus(e.mode||"Aus",i),n.updateValue("mode",e.mode||"Aus",i),n.updateValue("now_w",p(e.current_power_w,0)),n.updateProgress("now_w",e.perf?e.perf.utilization_pct:0),s.length>0&&n.drawTrend("now_w",s),n.updateValue("today",p(r.today_kwh,1)),n.updateProgress("today",e.perf?e.perf.daily_target_achievement_percent:r.today_kwh/10.84*100),n.updateValue("week",p(r.week_kwh,1)),n.updateValue("month",p(r.month_kwh,1)),n.updateValue("year",p(r.year_kwh,1));let o=L.grid,d=e.grid||{imbalance_w:0,status:"standby",apparent_va:0,reactive_var:0};o.updateStatus(d.status,T(d.status)),o.updateValue("l1_v",p(e.l1_voltage,0)),o.updateValue("l2_v",p(e.l2_voltage,0)),o.updateValue("l3_v",p(e.l3_voltage,0)),o.updateValue("imbalance",`${p(d.imbalance_w,0)} W`,d.imbalance_w>1e3?"var(--orange)":null),o.updateValue("apparent",p(d.apparent_va,0)),o.updateValue("reactive",p(d.reactive_var,0)),d.reactive_var!==void 0&&o.drawTrend("reactive",[150,280,d.reactive_var]),d.imbalance_w!==void 0&&o.drawTrend("imbalance",[500,200,d.imbalance_w]);let l=L.wr,h=e.wr||{dc_total_w:0,efficiency_pct:0,loss_w:0},m=e.perf?e.perf.utilization_pct:0,g=m>75?"Sonnig (Peak)":m>40?"Leicht bew\xF6lkt":m>5?"Stark bew\xF6lkt":"Standby";l.updateStatus(e.mode=="Einspeisen MPP"?"ONLINE":"STANDBY",i),l.updateValue("dc_total",p(h.dc_total_w,0)),l.updateValue("ac_total",p(e.gesamtleistung_w,0)),l.updateValue("loss",p(h.loss_w,0)),l.updateValue("eff_pct",p(h.efficiency_pct,2)),l.updateProgress("eff_pct",h.efficiency_pct),l.updateValue("weather",g,m>40?"var(--orange)":null),h.efficiency_pct>0&&l.drawTrend("eff_pct",[85,90,h.efficiency_pct]);let u=L.env,x=r.env?.today||{co2_kg:0},v=r.env?r.env.year:{co2_kg:0,trees:0,car_km:0};if(u.updateStatus("AKTUELL","var(--green)"),u.updateValue("co2_today",p(x.co2_kg,2)),u.updateValue("co2_kg",p(v.co2_kg,1)),u.updateValue("co2_t",p(v.co2_kg/1e3,3)),u.updateValue("trees",p(v.trees,0)),u.updateValue("car_km",p(v.car_km,0)),a){let c=L.sys;c.updateStatus(a.dataservice||"offline",T(a.dataservice)),c.updateValue("sys_time",a.servertime||"--"),c.updateValue("sys_vendor",a.hersteller||"KOSTAL"),c.updateValue("sys_name",a.name||"PIKO"),c.updateValue("sys_runtime",a.laufzeit||"--"),c.updateValue("sys_hours",p(a.stunden,0))}}function G(e){let r=document.getElementById("sun-animation-container");if(!r||!e)return;let t=e.pv_ost_w||0,a=e.pv_west_w||0,i=e.gesamtleistung_w||0,s=e.l1_power||0,n=e.l2_power||0,o=e.l3_power||0,d=t+a||1,l=a/d*100,h=t>30?"rgba(0, 113, 227, 0.12)":"none",m=a>30?"rgba(255, 149, 0, 0.12)":"none",g=i>10;r.innerHTML=`
    <!-- \u{1F31F} FIX: Kopfzeile gereinigt, damit der Titel im einheitlichen Solar-Orange leuchtet! -->
    <div class="card-header-grouped">
      <div class="card-header-title-block">
        ${k("sun",18,.9,6,"var(--orange)")}
        <h3>Dachseiten-Verh\xE4ltnis</h3>
      </div>
      <span class="card-status-badge" style="background-color: ${g?"var(--green)15":"var(--text-sub)15"}; color: ${g?"var(--green)":"var(--text-sub)"};">
        ${g?"LIVE":"STANDBY"}
      </span>
    </div>

    <div style="text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1;">
      <svg viewBox="0 0 400 150" style="width: 100%; max-width: 380px; overflow: visible;">
        <line x1="10" y1="130" x2="390" y2="130" stroke="var(--border)" stroke-width="3" stroke-linecap="round"/>
        <rect x="100" y="110" width="200" height="20" fill="var(--bg-app)" stroke="var(--border)" stroke-width="2"/>

        <path d="M 100 110 L 200 10 L 200 110 Z" stroke="var(--accent)" stroke-width="3" fill="${h}" style="transition: fill 0.5s ease;"/>
        <text x="135" y="95" fill="var(--text-sub)" font-size="11" font-weight="600" text-anchor="middle">OST</text>
        <text x="110" y="45" fill="var(--text-main)" font-size="14" font-weight="700" text-anchor="start">${p(t,0)} W</text>

        <path d="M 200 110 L 200 10 L 300 110 Z" stroke="var(--orange)" stroke-width="3" fill="${m}" style="transition: fill 0.5s ease;"/>
        <text x="265" y="95" fill="var(--text-sub)" font-size="11" font-weight="600" text-anchor="middle">WEST</text>
        <text x="290" y="45" fill="var(--text-main)" font-size="14" font-weight="700" text-anchor="end">${p(a,0)} W</text>

        <line x1="200" y1="10" x2="200" y2="110" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,3"/>
        <circle cx="${100+l*2}" cy="${110-(l<=50?l:100-l)*2}" r="6" fill="var(--green)" style="transition: cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"/>
      </svg>

      <div class="card-body-rows" style="margin-top: 14px; border-top: 1px solid var(--border); padding-top: 14px; width: 100%; display: flex; flex-direction: column; gap: 8px;">
        <div class="tile-row-item">
          <span class="tile-row-label" style="font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">AC Gesamtleistung</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value" style="font-size: 18px; font-weight: 800;">${p(i,0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L1</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${p(s,0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L2</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${p(n,0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L3</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${p(o,0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
      </div>
    </div>
  `}function _(e){if(!e||e.length===0)return null;let r=e.length,t=0,a=0,i=0,s=0;for(let l=0;l<r;l++)t+=l,a+=e[l],i+=l*e[l],s+=l*l;let n=(r*i-t*a)/(r*s-t*t),o=(a-n*t)/r,d=[];for(let l=0;l<r;l++)d.push(parseFloat((n*l+o).toFixed(3)));return d}function O(e,r){let t=document.getElementById("chart-kpi-container");if(!t||!e||!e.values)return;let a=e.values.filter(g=>g>0),i=e.total_kwh||0,s=a.length>0?Math.max(...a):0,n=a.length>0?Math.min(...a):0,o=a.length>0?i/a.length:0,d="--",l="var(--text-sub)";if(e.values.length>=3){let g=_(e.values);if(g&&g.length>=2){let u=g[g.length-1]-g;u>.05?(d="\u25B2 steigend",l="var(--green)"):u<-.05?(d="\u25BC fallend",l="var(--orange)"):d="\u27A1 stabil"}}let h=e.period_type==="hour"?"kW":"kWh",m=`
    <div style="width:100%; display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:16px; padding:12px 4px; background:var(--bg-app); border-radius:14px; margin-top:8px;">
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Gesamtertrag</span><span style="font-size:18px; font-weight:700; color:var(--orange); margin-top:2px;">${p(i,2)} kWh</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Mittelwert (\xD8)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${p(o,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Spitzenwert (Max)</span><span style="font-size:16px; font-weight:700; color:var(--green); margin-top:4px;">${p(s,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Tiefstwert (Min)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${p(n,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px;"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Verlaufstrend</span><span style="font-size:15px; font-weight:700; color:${l}; margin-top:4px;">${d}</span></div>
    </div>
  `;r&&r.years&&(m+=`
      <div style="margin-top:24px; border-top:1px solid var(--border); padding-top:16px; width:100%;">
        <h4 style="font-size:12px; font-weight:700; color:var(--orange); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">Jahresvergleich (Historie)</h4>
        <div class="yb-container-scroll" id="year-bars"></div>
      </div>
    `,setTimeout(()=>ee(r.years),20)),t.innerHTML=m}function ee(e){let r=document.getElementById("year-bars");if(!r||!e||e.length===0)return;let t=new Date().getFullYear().toString(),a=e.slice().sort((o,d)=>o.year-d.year),i=Math.max(...a.map(o=>o.kwh),1),s=a.length>=3?_(a.map(o=>o.kwh)):null,n=a.map((o,d)=>{let l=d>0?a[d-1]:null,h=o.year===t,m=(o.kwh/i*100).toFixed(1),g="";if(l&&l.kwh>0){let c=o.partial&&o.prev_same_period!=null?o.prev_same_period:l.kwh,b=o.partial?" (Zeitraum)":"",w=o.kwh-c,I=(w/c*100).toFixed(1),f=w>=0;g=`<span class="${f?"yb-gain":"yb-loss"}">${f?"\u25B2":"\u25BC"} ${p(Math.abs(w),0)} kWh (${f?"+":""}${I}%)${b}</span>`}let u="";s&&s[d]!=null&&(u=`<span class="yb-meta-text" style="color:${o.kwh-s[d]>=0?"var(--green)":"var(--text-sub)"}; margin-left:12px;">\u2248 ${p(s[d],0)} kWh Trend</span>`);let x=o.partial?'<span class="yb-meta-text" style="font-weight:700; color:var(--accent);"> \u25CF laufendes Jahr</span>':"",v=o.partial?"":`<span class="yb-meta-text" style="margin-left:auto;">${m}% von Best</span>`;return`
      <div class="yb-item${h?" yb-current":""}">
        <div class="yb-label">${o.year}${h?" \u25CF":""}</div>
        <div class="yb-val">${p(o.kwh,0)}</div>
        <div class="yb-unit"> kWh</div>
        <div class="yb-track">
          <div class="yb-fill" style="width:${m}%;"></div>
        </div>
        ${x}
        ${g}
        ${u}
        ${v}
      </div>
    `});r.innerHTML=n.reverse().join("")}var y=null,M={family:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',size:11,weight:"500"};function U(){window.addEventListener("themeChanged",()=>{if(!y)return;let r=document.body.classList.contains("apple-theme-dark")?"#2c2c2e":"#e8e8ed";y.options.scales.x.grid.color=r,y.options.scales.y.grid.color=r,y.options.scales.y2&&(y.options.scales.y2.grid.color=r),y.update()})}function B(e,r){let t=document.getElementById("dashboardChart");if(!t||!e||!e.labels)return;let a=t.getContext("2d"),i=document.body.classList.contains("apple-theme-dark"),s=getComputedStyle(document.body).getPropertyValue("--orange").trim()||"#ff9500",n=getComputedStyle(document.body).getPropertyValue("--accent").trim()||"#0071e3",o=i?"#2c2c2e":"#e8e8ed",d="#86868b",l=a.createLinearGradient(0,0,0,320);l.addColorStop(0,i?"rgba(255,159,10, 0.35)":"rgba(255,149,0, 0.25)"),l.addColorStop(1,"rgba(255,149,0, 0.01)");let h=null;(e.period_type==="day"||e.period_type==="month")&&e.values&&e.values.length>=5&&(h=_(e.values));let m=e.period_type==="hour"&&e.theoretical&&e.theoretical.some(u=>u>0),g=[{label:"Produktion (kWh)",data:e.values||[],backgroundColor:l,borderColor:s,borderWidth:1.5,borderRadius:4,borderSkipped:!1,type:"bar",order:2,yAxisID:"y"}];m&&g.push({label:"Theoretisch (kW)",data:e.theoretical,type:"line",borderColor:n,borderWidth:2.5,borderDash:[4,4],pointRadius:0,fill:!1,tension:.4,order:1,yAxisID:"y2"}),h&&g.push({label:"Trend (kWh)",data:h,type:"line",borderColor:n,borderWidth:2,borderDash:[4,4],pointRadius:0,fill:!1,tension:.2,order:1,yAxisID:"y"}),O(e,r),y&&y.destroy(),y=new window.Chart(a,{type:"bar",data:{labels:e.labels,datasets:g},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:e.period_type==="day"||e.period_type==="month"||m,labels:{color:d,font:M}},tooltip:{backgroundColor:i?"#1c1c1e":"#ffffff",borderColor:o,borderWidth:1,padding:12,cornerRadius:10,intersect:!1,mode:"index",titleFont:M,bodyFont:M,callbacks:{label:u=>u.dataset.label.startsWith("Theoretisch")?` ${u.dataset.label}: ${p(u.raw,2)} kW`:u.dataset.label.startsWith("Trend")?` ${u.dataset.label}: ${p(u.raw,2)} kWh`:` Realer Ertrag: ${p(u.raw,2)} kWh`}}},scales:{x:{grid:{color:o},ticks:{color:d,font:M,maxTicksLimit:e.labels.length>31?15:void 0}},y:{grid:{color:o},ticks:{color:d,font:M,callback:u=>u+" kWh"},beginAtZero:!0,position:"left"},y2:m?{grid:{drawOnChartArea:!1},ticks:{color:n,font:{...M,size:10,weight:"600"},callback:u=>u+" kW"},beginAtZero:!0,position:"right"}:{display:!1}}}})}var S=null;function j(){let e=document.getElementById("csv-export-btn");e&&e.addEventListener("click",()=>{if(!S||!S.labels)return;let r=S,t=r.theoretical&&r.theoretical.some(o=>o>0),a=[`Zeitraum;Produktion_kWh${t?";Theoretisch_kW":""}`];r.labels.forEach((o,d)=>{let l=`${o};${(r.values[d]||0).toFixed(3).replace(".",",")}`;t&&(l+=`;${(r.theoretical[d]||0).toFixed(3).replace(".",",")}`),a.push(l)});let i=new Blob(["\uFEFF"+a.join(`\r
`)],{type:"text/csv;charset=utf-8;"}),s=document.createElement("a");s.href=URL.createObjectURL(i);let n=new Date().toLocaleDateString("sv-SE");s.download=`pv_export_${r.period_type||"daten"}_${n}.csv`,document.body.appendChild(s),s.click(),document.body.removeChild(s),setTimeout(()=>URL.revokeObjectURL(s.href),100)})}function W(e){let r=document.getElementById("data-table-container");if(!r||!e||!e.labels)return;S=e;let t=e.theoretical&&e.theoretical.some(l=>l>0),a=e.efficiency&&e.efficiency.some(l=>l!=null),i='<tr><th>Zeitraum</th><th style="text-align:right;">Produktion (kWh)</th>';t&&(i+='<th style="text-align:right;">Theoretisch (kW)</th>'),a&&(i+='<th style="text-align:right;">Wirkungsgrad</th>'),i+="</tr>";let s=0,n=0,o="";e.labels.forEach((l,h)=>{let m=e.values[h]||0;s+=m;let g=`<td><strong>${l}</strong></td><td style="text-align:right;">${p(m,3)} kWh</td>`;if(t){let u=e.theoretical[h]||0;n+=u,g+=`<td style="text-align:right; color: var(--accent);">${p(u,3)} kW</td>`}if(a){let u=e.efficiency[h];if(u!=null){let x=Math.round(u*100),v=x>100?"var(--green)":x>=70?"var(--text-main)":"var(--orange)";g+=`<td style="text-align:right; font-weight:700; color:${v}">${x}%</td>`}else g+='<td style="text-align:right; color:var(--text-sub);">--</td>'}o+=`<tr>${g}</tr>`});let d='<tr style="border-top:2px solid var(--border); font-weight:800; background-color:var(--bg-app);">';d+=`<td>GESAMT</td><td style="text-align:right; color:var(--orange);">${p(s,2)} kWh</td>`,t&&(d+=`<td style="text-align:right; color:var(--accent);">${p(n,2)} kW</td>`),a&&(n>0?d+=`<td style="text-align:right; color:var(--green);">${Math.round(s/n*100)}%</td>`:d+="<td></td>"),d+="</tr>",r.innerHTML=`
    <table class="apple-table" style="width:100%; border-collapse:collapse;">
      <thead style="position:sticky; top:0; z-index:10; background-color:var(--bg-app); border-bottom:1px solid var(--border);">${i}</thead>
      <tbody>${o}</tbody>
      <tfoot style="position:sticky; bottom:0; z-index:10;">${d}</tfoot>
    </table>
  `}var K="em-period-label";function Y(e){let r=new Date,t=new Date,a=new Date;switch(t.setHours(0,0,0,0),a.setHours(23,59,59,999),e){case"today":break;case"gestern":t.setDate(r.getDate()-1),a.setDate(r.getDate()-1);break;case"woche":{let i=r.getDay();t.setDate(r.getDate()-i+(i===0?-6:1));break}case"7tage":t.setDate(r.getDate()-6);break;case"30tage":t.setDate(r.getDate()-29);break;case"monat":t.setDate(1);break}return{from:E(t),to:E(a)}}function E(e){return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function q(e,r){if(!e)return;let t=localStorage.getItem(K)||"Heute",a=new Date().getFullYear(),i="";for(let c=a;c>=2013;c--)i+=`<option value="${c}">Jahr ${c}</option>`;if(!document.getElementById("ds-styles")){let c=document.createElement("style");c.id="ds-styles",c.textContent=`
            .ds-wrap { position: relative; display: inline-flex; align-items: center; gap: 10px; }
            .ds-label { font-size: 13px; color: var(--text-sub); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .ds-btn {
                padding: 8px 16px; border-radius: 10px;
                border: 1px solid var(--border); background: var(--bg-card);
                color: var(--text-main); cursor: pointer; font-size: 14px; font-weight: 600; font-family: inherit;
                box-shadow: 0 2px 6px rgba(0,0,0,0.02); transition: background-color 0.2s, border-color 0.2s;
            }
            .ds-btn::after { content: " \u25BE"; opacity: .6; }
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
        `,document.head.appendChild(c)}let s=document.createElement("div");s.className="ds-wrap";let n=k("calendar",16,.7,5,"var(--text-sub)");s.innerHTML=`
        <span class="ds-label">${n}Zeitraum:</span>
        <button class="ds-btn" id="dsBtn">${t}</button>
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
                <option value="">Jahr ausw\xE4hlen\u2026</option>
                ${i}
            </select>
            <div class="ds-section" style="cursor:pointer; margin-top:5px;" id="dsCustomToggle">Individuell\u2026</div>
            <div class="ds-custom" id="dsCustom">
                <input type="date" id="dsFrom">
                <input type="date" id="dsTo">
                <button id="dsApply">Anwenden</button>
            </div>
        </div>
    `,e.appendChild(s);let o=s.querySelector("#dsBtn"),d=s.querySelector("#dsDrop"),l=s.querySelector("#dsYear"),h=s.querySelector("#dsCustomToggle"),m=s.querySelector("#dsCustom"),g=s.querySelector("#dsFrom"),u=s.querySelector("#dsTo"),x=s.querySelector("#dsApply");o.addEventListener("click",c=>{c.stopPropagation(),d.classList.toggle("hidden")}),document.addEventListener("click",()=>d.classList.add("hidden")),d.addEventListener("click",c=>c.stopPropagation()),h.addEventListener("click",()=>m.classList.toggle("show"));function v(c,b,w,I=null){t=c,localStorage.setItem(K,c),o.textContent=c,d.classList.add("hidden"),d.querySelectorAll(".ds-item").forEach(A=>{A.classList.toggle("active",A.textContent.trim()===c)});let f=I;f||(c==="Heute"||c==="Gestern"?f="hour":c==="Diese Woche"||c==="Letzte 7 Tage"||c==="Letzte 30 Tage"||c==="Dieser Monat"||c.startsWith("Individuell")?f="day":c.startsWith("Jahr")&&(f="month")),r(f,b,w)}d.querySelectorAll(".ds-item").forEach(c=>{c.addEventListener("click",()=>{let b=c.getAttribute("data-key"),w=Y(b);v(c.textContent.trim(),w.from,w.to)})}),l.addEventListener("change",()=>{if(!l.value)return;let c=l.value;v(`Jahr ${c}`,`${c}-01-01`,`${c}-12-31`,"month")}),x.addEventListener("click",()=>{!g.value||!u.value||v("Bereich",g.value,u.value,"day")}),setTimeout(()=>{if(t==="Heute"||t==="Gestern"||t==="Diese Woche"||t==="Dieser Monat"||t==="Letzte 7 Tage"||t==="Letzte 30 Tage"){let b=Y({Heute:"today",Gestern:"gestern","Diese Woche":"woche","Letzte 7 Tage":"7tage","Letzte 30 Tage":"30tage","Dieser Monat":"monat"}[t]);v(t,b.from,b.to)}else if(t.startsWith("Jahr ")){let c=t.replace("Jahr ","");v(t,`${c}-01-01`,`${c}-12-31`,"month")}else v("Heute",E(new Date),E(new Date),"hour")},50)}var C="hour",z=new Date().toLocaleDateString("sv-SE"),X=new Date().toLocaleDateString("sv-SE");async function J(){try{let e=C==="hour"?`date=${z}`:`from=${z}&to=${X}`,r=await fetch(`api/combined/${C}?${e}`);if(!r.ok)throw new Error("Fehler beim Laden des Archivs");let t=await r.json();B(t.chart,t.summary),W(t.chart)}catch(e){console.error("Archiv-Update fehlgeschlagen:",e)}}async function Z(){try{let e=new Date().toLocaleDateString("sv-SE"),r=await fetch(`api/combined/hour?date=${e}`);if(!r.ok)throw new Error("Live-API-Fehler");let t=await r.json(),a=document.getElementById("server-time");a&&(a.innerText=t["meta-data"].servertime);let i=document.getElementById("app-title");if(i&&!i.innerHTML.includes("span")&&t["meta-data"]?.apptitle&&(i.innerText=t["meta-data"].apptitle),N(t.current,t.summary,t.chart,t["meta-data"]),G(t.current),C==="hour"&&z===e&&(B(t.chart,t.summary),W(t.chart)),t["meta-data"]?.appversion){let s=document.getElementById("footer-app-version");s&&(s.innerText=`v${t["meta-data"].appversion} (BFF Architecture)`)}}catch(e){console.error("Live-Update fehlgeschlagen:",e)}}function te(){D(),H(),R(),U(),j();let e=document.getElementById("date-selector-container");e&&q(e,(r,t,a)=>{C=r,z=t,X=a,J()}),window.addEventListener("themeChanged",()=>{J()}),Z(),setInterval(Z,1e4)}te();console.info("%c \u26A1 Kostal Pico Dashboard %c ESM v2.5.0 ","color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px","color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px");})();
//# sourceMappingURL=main.bundle.js.map
