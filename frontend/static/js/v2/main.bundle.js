(()=>{function k(e,a=16,t=1,r=0,n="currentColor",d=""){let s=`width:${a}px; height:${a}px; stroke:${n}; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:text-bottom; flex-shrink:0; opacity:${t}; margin-right:${r}px;`,o=d?`class="${d}"`:"";return{logo:`<svg ${o} style="${s}" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M7 10h4M13 14h4M7 14l3-3M14 13l3-3M3 9h18M3 15h18"/></svg>`,energy:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,trend:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"/></svg>`,sync:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,calendar:`<svg ${o} style="${s}" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,sun:`<svg ${o} style="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,moon:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,radar:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v20M2 12h20"/></svg>`,bar:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6M3 20h18"/></svg>`,signal:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.59 16.11a6 6 0 0 1 6.82 0M12 20h.01"/></svg>`,power:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,curpower:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,week:`<svg ${o} style="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,clock:`<svg ${o} style="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,co2:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5c.5 0 1 .1 1.5.4C6.5 10 8 8.5 10 8.5c2.2 0 4 1.8 4 4v4H4.5z"/><path d="M12 16.5h7.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5c-.5 0-1 .1-1.5.4c-.5-1.9-2-3.4-4-3.4c-1 0-2 .4-2.7 1"/></svg>`,tree:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="m12 2 8 13H4L12 2zM12 15v6M9 21h6"/></svg>`,voltage:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>`,ampere:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,efficiency:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M2 20h20M21 6l-7 7-4-4-6 6M21 6h-4M21 6v4"/></svg>`,reactive_power:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="m3 3 18 18M21 3v6M3 21h6"/></svg>`,symmetry:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5 19l14-14"/></svg>`,car:`<svg ${o} style="${s}" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/></svg>`}[e]||""}function V(){let e=document.getElementById("app-root");if(!e)return;let a=k("logo",38,1,0,"var(--accent)");e.innerHTML=`
    <div class="app-container">
        <!-- HEADER -->
        <header class="app-header frosted-glass">
            <div class="header-inner">
                <div class="brand">
                    <div class="logo-wrapper">${a}</div>
                    <div class="brand-text">
                        <h1 id="app-title">Solar</h1>
                        <div class="status-pill">
                            <span class="status-dot pulsed"></span>
                            <p id="server-time" class="subtext">Verbinde...</p>
                        </div>
                    </div>
                </div>
                <div class="header-controls">
                    <button id="theme-toggle" class="apple-btn-blur" title="Design wechseln">\u{1F319}</button>
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
                <span>\xA9 ${new Date().getFullYear()} Siebler Home Network</span>
                <span class="footer-divider">|</span>
                <span>Photovoltaik Monitor (KOSTAL PIKO 5.5)</span>
            </div>
            <div class="footer-right" id="footer-app-version">v2.2.0</div>
        </footer>
    </div>
  `}var D="apple-dashboard-theme";function H(){let e=document.getElementById("theme-toggle"),a=localStorage.getItem(D),t=window.matchMedia("(prefers-color-scheme: dark)").matches;P(a||"dark"),e&&e.addEventListener("click",()=>{let d=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";P(d),localStorage.setItem(D,d),window.dispatchEvent(new Event("themeChanged"))})}function P(e){document.documentElement.setAttribute("data-theme",e),document.body.classList.remove("apple-theme-dark","apple-theme-light"),document.body.classList.add(e==="dark"?"apple-theme-dark":"apple-theme-light"),X(e)}function X(e){let a=document.getElementById("theme-toggle");a&&(a.innerHTML=e==="dark"?"<span>\u2600\uFE0F</span>":"<span>\u{1F319}</span>")}var $=class{constructor(a,t,r,n,d=[]){this.id=a,this.title=t,this.iconName=r,this.iconColor=n,this.rows=d}render(){let a="";return this.rows.forEach(t=>{let r=t.trend?`<canvas id="spark-${t.id}" width="60" height="20" style="width:60px; height:20px; margin: 0 8px; flex-shrink:0; display: inline-block;"></canvas>`:"",n=t.progress?`<div class="tile-progress-bg"><div id="progress-${t.id}" class="tile-progress-bar" style="width: 0%; background-color: ${this.iconColor};"></div></div>`:"";a+=`
        <div class="tile-row-wrapper">
          <div class="tile-row-item">
            <span class="tile-row-label">${t.label}</span>
            <span class="tile-row-value-container">
              ${r}
              <span id="val-${t.id}" class="tile-row-value">--</span>
              <span class="tile-row-unit">${t.unit||""}</span>
            </span>
          </div>
          ${n}
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
          ${a}
        </div>
      </div>
    `}updateValue(a,t,r=null){let n=document.getElementById(`val-${a}`);n&&(n.innerText=t,r&&(n.style.color=r))}updateProgress(a,t){let r=document.getElementById("progress-"+a);if(r){let n=Math.max(0,Math.min(100,t||0));r.style.width=`${n}%`}}updateStatus(a,t="var(--text-sub)"){let r=document.getElementById(`status-${this.id}`);r&&(r.innerText=a?a.toUpperCase():"",r.style.backgroundColor=a?`${t}15`:"transparent",r.style.color=t)}drawTrend(a,t){requestAnimationFrame(()=>{let r=document.getElementById(`spark-${a}`);if(!r||!t||t.length<2)return;let n=r.getContext("2d");n.clearRect(0,0,r.width,r.height);let d=getComputedStyle(document.body).getPropertyValue("--text-main").trim()||"#1d1d1f",s=Math.max(...t),o=Math.min(...t),l=s-o||1;n.beginPath(),n.lineWidth=2,n.strokeStyle=d,n.lineCap="round",n.lineJoin="round",t.forEach((i,h)=>{let v=h/(t.length-1)*r.width,g=r.height-(i-o)/l*r.height;h===0?n.moveTo(v,g):n.lineTo(v,g)}),n.stroke()})}};function F(){return{perf:new $("perf","Leistungs\xFCbersicht","curpower","var(--accent)",[{id:"mode",label:"Wechselrichter"},{id:"now_w",label:"Aktuelle Leistung",unit:"W",trend:!0,progress:!0},{id:"today",label:"Ertrag Heute",unit:"kWh",progress:!0},{id:"week",label:"Ertrag Woche",unit:"kWh"},{id:"month",label:"Ertrag Monat",unit:"kWh"},{id:"year",label:"Ertrag Jahr",unit:"kWh"}]),grid:new $("grid","Netz-Analyse & Qualit\xE4t","symmetry","var(--orange)",[{id:"l1_v",label:"Netzspannung L1",unit:"V"},{id:"l2_v",label:"Netzspannung L2",unit:"V"},{id:"l3_v",label:"Netzspannung L3",unit:"V"},{id:"imbalance",label:"Schieflast (Symmetrie)",unit:"W",trend:!0},{id:"apparent",label:"Scheinleistung",unit:"VA"},{id:"reactive",label:"Blindleistung",unit:"var",trend:!0}]),wr:new $("wr","Wechselrichter-Analyse","efficiency","var(--accent)",[{id:"dc_total",label:"Gleichstrom DC-Input",unit:"W"},{id:"ac_total",label:"Wechselstrom AC-Output",unit:"W"},{id:"loss",label:"Verlustleistung",unit:"W"},{id:"eff_pct",label:"Wirkungsgrad",unit:"%",trend:!0,progress:!0},{id:"eff_soll",label:"Tagesprognose (Soll)",unit:"kWh"},{id:"eff_ratio",label:"Performance Ratio",unit:"%",progress:!0},{id:"weather",label:"Himmel-Klarheit"}]),env:new $("env","CO\u2082 Umwelt-Bilanz","co2","var(--green)",[{id:"co2_today",label:"Vermeidung Heute",unit:"kg"},{id:"co2_kg",label:"Vermeidung Gesamt",unit:"kg"},{id:"co2_t",label:"Vermeidung Gesamt",unit:"t"},{id:"trees",label:"Gepflanzte B\xE4ume",unit:"Stk"},{id:"car_km",label:"E-Auto Reichweite",unit:"km"}]),sys:new $("sys","System- & Metadaten","clock","var(--text-sub)",[{id:"sys_time",label:"Letztes API-Update"},{id:"sys_vendor",label:"Hersteller (Marke)"},{id:"sys_name",label:"Hardware (Modell)"},{id:"sys_runtime",label:"Laufzeit (Betrieb)"},{id:"sys_hours",label:"Produktionsstunden",unit:"h"}])}}function p(e,a=2){return e==null||isNaN(e)?"0,00":new Intl.NumberFormat("de-AT",{minimumFractionDigits:a,maximumFractionDigits:a}).format(e)}function S(e){switch(e?.toLowerCase()){case"perfekt":case"ok":case"einspeisen mpp":return"var(--green)";case"gut":case"standby":return"var(--orange)";default:return"var(--text-sub)"}}var _={};function R(){let e=document.getElementById("tiles-render-bridge");if(!e)return;_=F();let a="";Object.values(_).forEach(t=>{a+=t.render()}),a+=`
    <div class="apple-card graphic-card" id="sun-animation-container">
      <div style="color: var(--text-sub); font-size: 13px; font-weight: 500;">Initialisiere Grafik...</div>
    </div>
  `,e.innerHTML=a}function N(e,a,t,r){if(!e||!a||Object.keys(_).length===0)return;let n=S(e.mode),d=t&&t.values?t.values:[],s=_.perf;s.updateStatus(e.mode||"Aus",n),s.updateValue("mode",e.mode||"Aus",n),s.updateValue("now_w",p(e.current_power_w,0)),s.updateProgress("now_w",e.perf?e.perf.utilization_pct:0),d.length>0&&s.drawTrend("now_w",d),s.updateValue("today",p(a.today_kwh,1)),s.updateProgress("today",e.perf?e.perf.daily_target_achievement_percent:a.today_kwh/10.84*100),s.updateValue("week",p(a.week_kwh,1)),s.updateValue("month",p(a.month_kwh,1)),s.updateValue("year",p(a.year_kwh,1));let o=_.grid,l=e.grid||{imbalance_w:0,status:"standby",apparent_va:0,reactive_var:0};o.updateStatus(l.status,S(l.status)),o.updateValue("l1_v",p(e.l1_voltage,0)),o.updateValue("l2_v",p(e.l2_voltage,0)),o.updateValue("l3_v",p(e.l3_voltage,0)),o.updateValue("imbalance",`${p(l.imbalance_w,0)} W`,l.imbalance_w>1e3?"var(--orange)":null),o.updateValue("apparent",p(l.apparent_va,0)),o.updateValue("reactive",p(l.reactive_var,0)),l.reactive_var!==void 0&&o.drawTrend("reactive",[150,280,l.reactive_var]),l.imbalance_w!==void 0&&o.drawTrend("imbalance",[500,200,l.imbalance_w]);let i=_.wr,h=e.wr||{dc_total_w:0,efficiency_pct:0,loss_w:0},v=e.perf?e.perf.utilization_pct:0,g=v>75?"Sonnig (Peak)":v>40?"Leicht bew\xF6lkt":v>5?"Stark bew\xF6lkt":"Standby";i.updateStatus(e.mode=="Einspeisen MPP"?"ONLINE":"STANDBY",n),i.updateValue("dc_total",p(h.dc_total_w,0)),i.updateValue("ac_total",p(e.gesamtleistung_w,0)),i.updateValue("loss",p(h.loss_w,0)),i.updateValue("eff_pct",p(h.efficiency_pct,2)),i.updateProgress("eff_pct",h.efficiency_pct),i.updateValue("weather",g,v>40?"var(--orange)":null),h.efficiency_pct>0&&i.drawTrend("eff_pct",[85,90,h.efficiency_pct]);let u=_.env,x=a.env?.today||{co2_kg:0},m=a.env?a.env.year:{co2_kg:0,trees:0,car_km:0};if(u.updateStatus("AKTUELL","var(--green)"),u.updateValue("co2_today",p(x.co2_kg,2)),u.updateValue("co2_kg",p(m.co2_kg,1)),u.updateValue("co2_t",p(m.co2_kg/1e3,3)),u.updateValue("trees",p(m.trees,0)),u.updateValue("car_km",p(m.car_km,0)),r){let c=_.sys;c.updateStatus(r.dataservice||"offline",S(r.dataservice)),c.updateValue("sys_time",r.servertime||"--"),c.updateValue("sys_vendor",r.hersteller||"KOSTAL"),c.updateValue("sys_name",r.name||"PIKO"),c.updateValue("sys_runtime",r.laufzeit||"--"),c.updateValue("sys_hours",p(r.stunden,0))}}function G(e){let a=document.getElementById("sun-animation-container");if(!a||!e)return;let t=e.pv_ost_w||0,r=e.pv_west_w||0,n=e.gesamtleistung_w||0,d=e.l1_power||0,s=e.l2_power||0,o=e.l3_power||0,l=t+r||1,i=r/l*100,h=t>30?"rgba(0, 113, 227, 0.12)":"none",v=r>30?"rgba(255, 149, 0, 0.12)":"none",g=n>10;a.innerHTML=`
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

        <path d="M 200 110 L 200 10 L 300 110 Z" stroke="var(--orange)" stroke-width="3" fill="${v}" style="transition: fill 0.5s ease;"/>
        <text x="265" y="95" fill="var(--text-sub)" font-size="11" font-weight="600" text-anchor="middle">WEST</text>
        <text x="290" y="45" fill="var(--text-main)" font-size="14" font-weight="700" text-anchor="end">${p(r,0)} W</text>

        <line x1="200" y1="10" x2="200" y2="110" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,3"/>
        <circle cx="${100+i*2}" cy="${i<=50?110-i*2:10+(i-50)*2}" r="6" fill="var(--green)" style="transition: cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"/>
      </svg>

      <div class="card-body-rows" style="margin-top: 14px; border-top: 1px solid var(--border); padding-top: 14px; width: 100%; display: flex; flex-direction: column; gap: 8px;">
        <div class="tile-row-item">
          <span class="tile-row-label" style="font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">AC Gesamtleistung</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value" style="font-size: 18px; font-weight: 800;">${p(n,0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L1</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${p(d,0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
        <div class="tile-row-item">
          <span class="tile-row-label">Einspeisung Phase L2</span>
          <span class="tile-row-value-container">
            <span class="tile-row-value">${p(s,0)}</span>
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
  `}function L(e){if(!e||e.length===0)return null;let a=e.length,t=0,r=0,n=0,d=0;for(let i=0;i<a;i++)t+=i,r+=e[i],n+=i*e[i],d+=i*i;let s=(a*n-t*r)/(a*d-t*t),o=(r-s*t)/a,l=[];for(let i=0;i<a;i++)l.push(parseFloat((s*i+o).toFixed(3)));return l}function O(e,a){let t=document.getElementById("chart-kpi-container");if(!t||!e||!e.values)return;let r=e.values.filter(g=>g>0),n=e.total_kwh||0,d=r.length>0?Math.max(...r):0,s=r.length>0?Math.min(...r):0,o=r.length>0?n/r.length:0,l="--",i="var(--text-sub)";if(e.values.length>=3){let g=L(e.values);if(g&&g.length>=2){let u=g[g.length-1]-g;u>.05?(l="\u25B2 steigend",i="var(--green)"):u<-.05?(l="\u25BC fallend",i="var(--orange)"):l="\u27A1 stabil"}}let h=e.period_type==="hour"?"kW":"kWh",v=`
    <div style="width:100%; display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:16px; padding:12px 4px; background:var(--bg-app); border-radius:14px; margin-top:8px;">
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Gesamtertrag</span><span style="font-size:18px; font-weight:700; color:var(--orange); margin-top:2px;">${p(n,2)} kWh</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Mittelwert (\xD8)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${p(o,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Spitzenwert (Max)</span><span style="font-size:16px; font-weight:700; color:var(--green); margin-top:4px;">${p(d,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Tiefstwert (Min)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${p(s,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px;"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Verlaufstrend</span><span style="font-size:15px; font-weight:700; color:${i}; margin-top:4px;">${l}</span></div>
    </div>
  `;a&&a.years&&(v+=`
      <div style="margin-top:24px; border-top:1px solid var(--border); padding-top:16px; width:100%;">
        <h4 style="font-size:12px; font-weight:700; color:var(--orange); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">Jahresvergleich (Historie)</h4>
        <div class="yb-container-scroll" id="year-bars"></div>
      </div>
    `,setTimeout(()=>Q(a.years),20)),t.innerHTML=v}function Q(e){let a=document.getElementById("year-bars");if(!a||!e||e.length===0)return;let t=new Date().getFullYear().toString(),r=e.slice().sort((o,l)=>o.year-l.year),n=Math.max(...r.map(o=>o.kwh),1),d=r.length>=3?L(r.map(o=>o.kwh)):null,s=r.map((o,l)=>{let i=l>0?r[l-1]:null,h=o.year===t,v=(o.kwh/n*100).toFixed(1),g="";if(i&&i.kwh>0){let c=o.partial&&o.prev_same_period!=null?o.prev_same_period:i.kwh,b=o.partial?" (Zeitraum)":"",w=o.kwh-c,B=(w/c*100).toFixed(1),f=w>=0;g=`<span class="${f?"yb-gain":"yb-loss"}">${f?"\u25B2":"\u25BC"} ${p(Math.abs(w),0)} kWh (${f?"+":""}${B}%)${b}</span>`}let u="";d&&d[l]!=null&&(u=`<span class="yb-meta-text" style="color:${o.kwh-d[l]>=0?"var(--green)":"var(--text-sub)"}; margin-left:12px;">\u2248 ${p(d[l],0)} kWh Trend</span>`);let x=o.partial?'<span class="yb-meta-text" style="font-weight:700; color:var(--accent);"> \u25CF laufendes Jahr</span>':"",m=o.partial?"":`<span class="yb-meta-text" style="margin-left:auto;">${v}% von Best</span>`;return`
      <div class="yb-item${h?" yb-current":""}">
        <div class="yb-label">${o.year}${h?" \u25CF":""}</div>
        <div class="yb-val">${p(o.kwh,0)}</div>
        <div class="yb-unit"> kWh</div>
        <div class="yb-track">
          <div class="yb-fill" style="width:${v}%;"></div>
        </div>
        ${x}
        ${g}
        ${u}
        ${m}
      </div>
    `});a.innerHTML=s.reverse().join("")}var y=null,M={family:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',size:11,weight:"500"};function Y(){window.addEventListener("themeChanged",()=>{if(!y)return;let a=document.body.classList.contains("apple-theme-dark")?"#2c2c2e":"#e8e8ed";y.options.scales.x.grid.color=a,y.options.scales.y.grid.color=a,y.options.scales.y2&&(y.options.scales.y2.grid.color=a),y.update()})}function W(e,a){let t=document.getElementById("dashboardChart");if(!t||!e||!e.labels)return;let r=t.getContext("2d"),n=document.body.classList.contains("apple-theme-dark"),d=getComputedStyle(document.body).getPropertyValue("--orange").trim()||"#ff9500",s=getComputedStyle(document.body).getPropertyValue("--accent").trim()||"#0071e3",o=n?"#2c2c2e":"#e8e8ed",l="#86868b",i=r.createLinearGradient(0,0,0,320);i.addColorStop(0,n?"rgba(255,159,10, 0.35)":"rgba(255,149,0, 0.25)"),i.addColorStop(1,"rgba(255,149,0, 0.01)");let h=null;(e.period_type==="day"||e.period_type==="month")&&e.values&&e.values.length>=5&&(h=L(e.values));let v=e.period_type==="hour"&&e.theoretical&&e.theoretical.some(u=>u>0),g=[{label:"Produktion (kWh)",data:e.values||[],backgroundColor:i,borderColor:d,borderWidth:1.5,borderRadius:4,borderSkipped:!1,type:"bar",order:2,yAxisID:"y"}];v&&g.push({label:"Theoretisch (kW)",data:e.theoretical,type:"line",borderColor:s,borderWidth:2.5,borderDash:[4,4],pointRadius:0,fill:!1,tension:.4,order:1,yAxisID:"y2"}),h&&g.push({label:"Trend (kWh)",data:h,type:"line",borderColor:s,borderWidth:2,borderDash:[4,4],pointRadius:0,fill:!1,tension:.2,order:1,yAxisID:"y"}),O(e,a),y&&y.destroy(),y=new window.Chart(r,{type:"bar",data:{labels:e.labels,datasets:g},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:e.period_type==="day"||e.period_type==="month"||v,labels:{color:l,font:M}},tooltip:{backgroundColor:n?"#1c1c1e":"#ffffff",borderColor:o,borderWidth:1,padding:12,cornerRadius:10,intersect:!1,mode:"index",titleFont:M,bodyFont:M,callbacks:{label:u=>u.dataset.label.startsWith("Theoretisch")?` ${u.dataset.label}: ${p(u.raw,2)} kW`:u.dataset.label.startsWith("Trend")?` ${u.dataset.label}: ${p(u.raw,2)} kWh`:` Realer Ertrag: ${p(u.raw,2)} kWh`}}},scales:{x:{grid:{color:o},ticks:{color:l,font:M,maxTicksLimit:e.labels.length>31?15:void 0}},y:{grid:{color:o},ticks:{color:l,font:M,callback:u=>u+" kWh"},beginAtZero:!0,position:"left"},y2:v?{grid:{drawOnChartArea:!1},ticks:{color:s,font:{...M,size:10,weight:"600"},callback:u=>u+" kW"},beginAtZero:!0,position:"right"}:{display:!1}}}})}var T=null;function K(){let e=document.getElementById("csv-export-btn");e&&e.addEventListener("click",()=>{if(!T||!T.labels)return;let a=T,t=a.theoretical&&a.theoretical.some(o=>o>0),r=[`Zeitraum;Produktion_kWh${t?";Theoretisch_kW":""}`];a.labels.forEach((o,l)=>{let i=`${o};${(a.values[l]||0).toFixed(3).replace(".",",")}`;t&&(i+=`;${(a.theoretical[l]||0).toFixed(3).replace(".",",")}`),r.push(i)});let n=new Blob(["\uFEFF"+r.join(`\r
`)],{type:"text/csv;charset=utf-8;"}),d=document.createElement("a");d.href=URL.createObjectURL(n);let s=new Date().toLocaleDateString("sv-SE");d.download=`pv_export_${a.period_type||"daten"}_${s}.csv`,document.body.appendChild(d),d.click(),document.body.removeChild(d),setTimeout(()=>URL.revokeObjectURL(d.href),100)})}function A(e){let a=document.getElementById("data-table-container");if(!a||!e||!e.labels)return;T=e;let t=e.theoretical&&e.theoretical.some(i=>i>0),r=e.efficiency&&e.efficiency.some(i=>i!=null),n='<tr><th>Zeitraum</th><th style="text-align:right;">Produktion (kWh)</th>';t&&(n+='<th style="text-align:right;">Theoretisch (kW)</th>'),r&&(n+='<th style="text-align:right;">Wirkungsgrad</th>'),n+="</tr>";let d=0,s=0,o="";e.labels.forEach((i,h)=>{let v=e.values[h]||0;d+=v;let g=`<td><strong>${i}</strong></td><td style="text-align:right;">${p(v,3)} kWh</td>`;if(t){let u=e.theoretical[h]||0;s+=u,g+=`<td style="text-align:right; color: var(--accent);">${p(u,3)} kW</td>`}if(r){let u=e.efficiency[h];if(u!=null){let x=Math.round(u*100),m=x>100?"var(--green)":x>=70?"var(--text-main)":"var(--orange)";g+=`<td style="text-align:right; font-weight:700; color:${m}">${x}%</td>`}else g+='<td style="text-align:right; color:var(--text-sub);">--</td>'}o+=`<tr>${g}</tr>`});let l='<tr style="border-top:2px solid var(--border); font-weight:800; background-color:var(--bg-app);">';l+=`<td>GESAMT</td><td style="text-align:right; color:var(--orange);">${p(d,2)} kWh</td>`,t&&(l+=`<td style="text-align:right; color:var(--accent);">${p(s,2)} kW</td>`),r&&(s>0?l+=`<td style="text-align:right; color:var(--green);">${Math.round(d/s*100)}%</td>`:l+="<td></td>"),l+="</tr>",a.innerHTML=`
    <table class="apple-table" style="width:100%; border-collapse:collapse;">
      <thead style="position:sticky; top:0; z-index:10; background-color:var(--bg-app); border-bottom:1px solid var(--border);">${n}</thead>
      <tbody>${o}</tbody>
      <tfoot style="position:sticky; bottom:0; z-index:10;">${l}</tfoot>
    </table>
  `}var q="em-period-label";function j(e){let a=new Date,t=new Date,r=new Date;switch(t.setHours(0,0,0,0),r.setHours(23,59,59,999),e){case"today":break;case"gestern":t.setDate(a.getDate()-1),r.setDate(a.getDate()-1);break;case"woche":{let n=a.getDay();t.setDate(a.getDate()-n+(n===0?-6:1));break}case"7tage":t.setDate(a.getDate()-6);break;case"30tage":t.setDate(a.getDate()-29);break;case"monat":t.setDate(1);break}return{from:E(t),to:E(r)}}function E(e){return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function U(e,a){if(!e)return;let t=localStorage.getItem(q)||"Heute",r=new Date().getFullYear(),n="";for(let c=r;c>=2013;c--)n+=`<option value="${c}">Jahr ${c}</option>`;if(!document.getElementById("ds-styles")){let c=document.createElement("style");c.id="ds-styles",c.textContent=`
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
        `,document.head.appendChild(c)}let d=document.createElement("div");d.className="ds-wrap";let s=k("calendar",16,.7,5,"var(--text-sub)");d.innerHTML=`
        <span class="ds-label">${s}Zeitraum:</span>
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
                ${n}
            </select>
            <div class="ds-section" style="cursor:pointer; margin-top:5px;" id="dsCustomToggle">Individuell\u2026</div>
            <div class="ds-custom" id="dsCustom">
                <input type="date" id="dsFrom">
                <input type="date" id="dsTo">
                <button id="dsApply">Anwenden</button>
            </div>
        </div>
    `,e.appendChild(d);let o=d.querySelector("#dsBtn"),l=d.querySelector("#dsDrop"),i=d.querySelector("#dsYear"),h=d.querySelector("#dsCustomToggle"),v=d.querySelector("#dsCustom"),g=d.querySelector("#dsFrom"),u=d.querySelector("#dsTo"),x=d.querySelector("#dsApply");o.addEventListener("click",c=>{c.stopPropagation(),l.classList.toggle("hidden")}),document.addEventListener("click",()=>l.classList.add("hidden")),l.addEventListener("click",c=>c.stopPropagation()),h.addEventListener("click",()=>v.classList.toggle("show"));function m(c,b,w,B=null){t=c,localStorage.setItem(q,c),o.textContent=c,l.classList.add("hidden"),l.querySelectorAll(".ds-item").forEach(I=>{I.classList.toggle("active",I.textContent.trim()===c)});let f=B;f||(c==="Heute"||c==="Gestern"?f="hour":c==="Diese Woche"||c==="Letzte 7 Tage"||c==="Letzte 30 Tage"||c==="Dieser Monat"||c.startsWith("Individuell")?f="day":c.startsWith("Jahr")&&(f="month")),a(f,b,w)}l.querySelectorAll(".ds-item").forEach(c=>{c.addEventListener("click",()=>{let b=c.getAttribute("data-key"),w=j(b);m(c.textContent.trim(),w.from,w.to)})}),i.addEventListener("change",()=>{if(!i.value)return;let c=i.value;m(`Jahr ${c}`,`${c}-01-01`,`${c}-12-31`,"month")}),x.addEventListener("click",()=>{!g.value||!u.value||m("Bereich",g.value,u.value,"day")}),setTimeout(()=>{if(t==="Heute"||t==="Gestern"||t==="Diese Woche"||t==="Dieser Monat"||t==="Letzte 7 Tage"||t==="Letzte 30 Tage"){let b=j({Heute:"today",Gestern:"gestern","Diese Woche":"woche","Letzte 7 Tage":"7tage","Letzte 30 Tage":"30tage","Dieser Monat":"monat"}[t]);m(t,b.from,b.to)}else if(t.startsWith("Jahr ")){let c=t.replace("Jahr ","");m(t,`${c}-01-01`,`${c}-12-31`,"month")}else m("Heute",E(new Date),E(new Date),"hour")},50)}var C="hour",z=new Date().toLocaleDateString("sv-SE"),Z=new Date().toLocaleDateString("sv-SE");async function ee(){try{let e=C==="hour"?`date=${z}`:`from=${z}&to=${Z}`,a=await fetch(`api/combined/${C}?${e}`);if(!a.ok)throw new Error("Fehler beim Laden des Archivs");let t=await a.json();W(t.chart,t.summary),A(t.chart)}catch(e){console.error("Archiv-Update fehlgeschlagen:",e)}}async function J(){try{let e=new Date().toLocaleDateString("sv-SE"),a=await fetch(`api/combined/hour?date=${e}`);if(!a.ok)throw new Error("Live-API-Fehler");let t=await a.json();if(document.getElementById("server-time").innerText=t["meta-data"].servertime,document.getElementById("app-title").innerText=t["meta-data"].apptitle,N(t.current,t.summary,t.chart,t["meta-data"]),G(t.current),C==="hour"&&z===e&&(W(t.chart,t.summary),A(t.chart)),t["meta-data"]?.appversion){let r=document.getElementById("footer-app-version");r&&(r.innerText=`v${t["meta-data"].appversion} (BFF Architecture)`)}}catch(e){console.error("Live-Update fehlgeschlagen:",e)}}function te(){V(),H(),R(),Y(),K(),U(document.getElementById("date-selector-container"),(e,a,t)=>{C=e,z=a,Z=t,ee()}),J(),setInterval(J,1e4)}te();console.info("%c \u26A1 Kostal Pico Dashboard %c ESM v2.5.0 ","color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px","color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px");})();
//# sourceMappingURL=main.bundle.js.map
