(()=>{function k(e,a=16,t=1,o=0,i="currentColor",c=""){let s=`width:${a}px; height:${a}px; stroke:${i}; stroke-width:2; fill:none; stroke-linecap:round; stroke-linejoin:round; display:inline-block; vertical-align:text-bottom; flex-shrink:0; opacity:${t}; margin-right:${o}px;`,r=c?`class="${c}"`:"";return{logo:`<svg ${r} style="${s}" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M7 10h4M13 14h4M7 14l3-3M14 13l3-3M3 9h18M3 15h18"/></svg>`,energy:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,trend:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"/></svg>`,sync:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,calendar:`<svg ${r} style="${s}" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,sun:`<svg ${r} style="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,moon:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>`,radar:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v20M2 12h20"/></svg>`,bar:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6M3 20h18"/></svg>`,signal:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.59 16.11a6 6 0 0 1 6.82 0M12 20h.01"/></svg>`,power:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,curpower:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,week:`<svg ${r} style="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,clock:`<svg ${r} style="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,co2:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5c.5 0 1 .1 1.5.4C6.5 10 8 8.5 10 8.5c2.2 0 4 1.8 4 4v4H4.5z"/><path d="M12 16.5h7.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5c-.5 0-1 .1-1.5.4c-.5-1.9-2-3.4-4-3.4c-1 0-2 .4-2.7 1"/></svg>`,tree:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="m12 2 8 13H4L12 2zM12 15v6M9 21h6"/></svg>`,voltage:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>`,ampere:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,efficiency:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M2 20h20M21 6l-7 7-4-4-6 6M21 6h-4M21 6v4"/></svg>`,reactive_power:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="m3 3 18 18M21 3v6M3 21h6"/></svg>`,symmetry:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M5 19l14-14"/></svg>`,car:`<svg ${r} style="${s}" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="15" cy="17" r="2"/></svg>`}[e]||""}function V(){let e=document.getElementById("app-root");if(!e)return;let a=k("logo",38,1,0,"var(--accent)");e.innerHTML=`
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
  `}function P(){let e=document.getElementById("theme-toggle");if(!e)return;let a=localStorage.getItem("apple-dashboard-theme"),t=window.matchMedia("(prefers-color-scheme: dark)").matches;a==="dark"||!a&&t?(document.body.classList.remove("apple-theme-light"),document.body.classList.add("apple-theme-dark")):(document.body.classList.remove("apple-theme-dark"),document.body.classList.add("apple-theme-light")),D(),e.addEventListener("click",()=>{document.body.classList.contains("apple-theme-dark")?(document.body.classList.remove("apple-theme-dark"),document.body.classList.add("apple-theme-light"),localStorage.setItem("apple-dashboard-theme","light")):(document.body.classList.remove("apple-theme-dark"),document.body.classList.add("apple-theme-dark"),localStorage.setItem("apple-dashboard-theme","dark")),D(),window.dispatchEvent(new Event("themeChanged"))})}function D(){let e=document.getElementById("theme-toggle");if(!e)return;let a=document.body.classList.contains("apple-theme-dark");e.innerHTML=a?"<span>\u2600\uFE0F</span>":"<span>\u{1F319}</span>"}var $=class{constructor(a,t,o,i,c=[]){this.id=a,this.title=t,this.iconName=o,this.iconColor=i,this.rows=c}render(){let a="";return this.rows.forEach(t=>{let o=t.trend?`<canvas id="spark-${t.id}" width="60" height="20" style="width:60px; height:20px; margin: 0 8px; flex-shrink:0; display: inline-block;"></canvas>`:"",i=t.progress?`<div class="tile-progress-bg"><div id="progress-${t.id}" class="tile-progress-bar" style="width: 0%; background-color: ${this.iconColor};"></div></div>`:"";a+=`
        <div class="tile-row-wrapper">
          <div class="tile-row-item">
            <span class="tile-row-label">${t.label}</span>
            <span class="tile-row-value-container">
              ${o}
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
          ${a}
        </div>
      </div>
    `}updateValue(a,t,o=null){let i=document.getElementById(`val-${a}`);i&&(i.innerText=t,o&&(i.style.color=o))}updateProgress(a,t){let o=document.getElementById("progress-"+a);if(o){let i=Math.max(0,Math.min(100,t||0));o.style.width=`${i}%`}}updateStatus(a,t="var(--text-sub)"){let o=document.getElementById(`status-${this.id}`);o&&(o.innerText=a?a.toUpperCase():"",o.style.backgroundColor=a?`${t}15`:"transparent",o.style.color=t)}drawTrend(a,t){requestAnimationFrame(()=>{let o=document.getElementById(`spark-${a}`);if(!o||!t||t.length<2)return;let i=o.getContext("2d");i.clearRect(0,0,o.width,o.height);let c=getComputedStyle(document.body).getPropertyValue("--text-main").trim()||"#1d1d1f",s=Math.max(...t),r=Math.min(...t),l=s-r||1;i.beginPath(),i.lineWidth=2,i.strokeStyle=c,i.lineCap="round",i.lineJoin="round",t.forEach((n,h)=>{let v=h/(t.length-1)*o.width,g=o.height-(n-r)/l*o.height;h===0?i.moveTo(v,g):i.lineTo(v,g)}),i.stroke()})}};function H(){return{perf:new $("perf","Leistungs\xFCbersicht","curpower","var(--accent)",[{id:"mode",label:"Wechselrichter"},{id:"now_w",label:"Aktuelle Leistung",unit:"W",trend:!0,progress:!0},{id:"today",label:"Ertrag Heute",unit:"kWh",progress:!0},{id:"week",label:"Ertrag Woche",unit:"kWh"},{id:"month",label:"Ertrag Monat",unit:"kWh"},{id:"year",label:"Ertrag Jahr",unit:"kWh"}]),grid:new $("grid","Netz-Analyse & Qualit\xE4t","symmetry","var(--orange)",[{id:"l1_v",label:"Netzspannung L1",unit:"V"},{id:"l2_v",label:"Netzspannung L2",unit:"V"},{id:"l3_v",label:"Netzspannung L3",unit:"V"},{id:"imbalance",label:"Schieflast (Symmetrie)",unit:"W",trend:!0},{id:"apparent",label:"Scheinleistung",unit:"VA"},{id:"reactive",label:"Blindleistung",unit:"var",trend:!0}]),wr:new $("wr","Wechselrichter-Analyse","efficiency","var(--accent)",[{id:"dc_total",label:"Gleichstrom DC-Input",unit:"W"},{id:"ac_total",label:"Wechselstrom AC-Output",unit:"W"},{id:"loss",label:"Verlustleistung",unit:"W"},{id:"eff_pct",label:"Wirkungsgrad",unit:"%",trend:!0,progress:!0},{id:"eff_soll",label:"Tagesprognose (Soll)",unit:"kWh"},{id:"eff_ratio",label:"Performance Ratio",unit:"%",progress:!0},{id:"weather",label:"Himmel-Klarheit"}]),env:new $("env","CO\u2082 Umwelt-Bilanz","co2","var(--green)",[{id:"co2_today",label:"Vermeidung Heute",unit:"kg"},{id:"co2_kg",label:"Vermeidung Gesamt",unit:"kg"},{id:"co2_t",label:"Vermeidung Gesamt",unit:"t"},{id:"trees",label:"Gepflanzte B\xE4ume",unit:"Stk"},{id:"car_km",label:"E-Auto Reichweite",unit:"km"}]),sys:new $("sys","System- & Metadaten","clock","var(--text-sub)",[{id:"sys_time",label:"Letztes API-Update"},{id:"sys_vendor",label:"Hersteller (Marke)"},{id:"sys_name",label:"Hardware (Modell)"},{id:"sys_runtime",label:"Laufzeit (Betrieb)"},{id:"sys_hours",label:"Produktionsstunden",unit:"h"}])}}function p(e,a=2){return e==null||isNaN(e)?"0,00":new Intl.NumberFormat("de-AT",{minimumFractionDigits:a,maximumFractionDigits:a}).format(e)}function S(e){switch(e?.toLowerCase()){case"perfekt":case"ok":case"einspeisen mpp":return"var(--green)";case"gut":case"standby":return"var(--orange)";default:return"var(--text-sub)"}}var _={};function F(){let e=document.getElementById("tiles-render-bridge");if(!e)return;_=H();let a="";Object.values(_).forEach(t=>{a+=t.render()}),a+=`
    <div class="apple-card graphic-card" id="sun-animation-container">
      <div style="color: var(--text-sub); font-size: 13px; font-weight: 500;">Initialisiere Grafik...</div>
    </div>
  `,e.innerHTML=a}function R(e,a,t,o){if(!e||!a||Object.keys(_).length===0)return;let i=S(e.mode),c=t&&t.values?t.values:[],s=_.perf;s.updateStatus(e.mode||"Aus",i),s.updateValue("mode",e.mode||"Aus",i),s.updateValue("now_w",p(e.current_power_w,0)),s.updateProgress("now_w",e.perf?e.perf.utilization_pct:0),c.length>0&&s.drawTrend("now_w",c),s.updateValue("today",p(a.today_kwh,1)),s.updateProgress("today",e.perf?e.perf.daily_target_achievement_percent:a.today_kwh/10.84*100),s.updateValue("week",p(a.week_kwh,1)),s.updateValue("month",p(a.month_kwh,1)),s.updateValue("year",p(a.year_kwh,1));let r=_.grid,l=e.grid||{imbalance_w:0,status:"standby",apparent_va:0,reactive_var:0};r.updateStatus(l.status,S(l.status)),r.updateValue("l1_v",p(e.l1_voltage,0)),r.updateValue("l2_v",p(e.l2_voltage,0)),r.updateValue("l3_v",p(e.l3_voltage,0)),r.updateValue("imbalance",`${p(l.imbalance_w,0)} W`,l.imbalance_w>1e3?"var(--orange)":null),r.updateValue("apparent",p(l.apparent_va,0)),r.updateValue("reactive",p(l.reactive_var,0)),l.reactive_var!==void 0&&r.drawTrend("reactive",[150,280,l.reactive_var]),l.imbalance_w!==void 0&&r.drawTrend("imbalance",[500,200,l.imbalance_w]);let n=_.wr,h=e.wr||{dc_total_w:0,efficiency_pct:0,loss_w:0},v=e.perf?e.perf.utilization_pct:0,g=v>75?"Sonnig (Peak)":v>40?"Leicht bew\xF6lkt":v>5?"Stark bew\xF6lkt":"Standby";n.updateStatus(e.mode=="Einspeisen MPP"?"ONLINE":"STANDBY",i),n.updateValue("dc_total",p(h.dc_total_w,0)),n.updateValue("ac_total",p(e.gesamtleistung_w,0)),n.updateValue("loss",p(h.loss_w,0)),n.updateValue("eff_pct",p(h.efficiency_pct,2)),n.updateProgress("eff_pct",h.efficiency_pct),n.updateValue("weather",g,v>40?"var(--orange)":null),h.efficiency_pct>0&&n.drawTrend("eff_pct",[85,90,h.efficiency_pct]);let u=_.env,x=a.env?.today||{co2_kg:0},m=a.env?a.env.year:{co2_kg:0,trees:0,car_km:0};if(u.updateStatus("AKTUELL","var(--green)"),u.updateValue("co2_today",p(x.co2_kg,2)),u.updateValue("co2_kg",p(m.co2_kg,1)),u.updateValue("co2_t",p(m.co2_kg/1e3,3)),u.updateValue("trees",p(m.trees,0)),u.updateValue("car_km",p(m.car_km,0)),o){let d=_.sys;d.updateStatus(o.dataservice||"offline",S(o.dataservice)),d.updateValue("sys_time",o.servertime||"--"),d.updateValue("sys_vendor",o.hersteller||"KOSTAL"),d.updateValue("sys_name",o.name||"PIKO"),d.updateValue("sys_runtime",o.laufzeit||"--"),d.updateValue("sys_hours",p(o.stunden,0))}}function N(e){let a=document.getElementById("sun-animation-container");if(!a||!e)return;let t=e.pv_ost_w||0,o=e.pv_west_w||0,i=e.gesamtleistung_w||0,c=e.l1_power||0,s=e.l2_power||0,r=e.l3_power||0,l=t+o||1,n=o/l*100,h=t>30?"rgba(0, 113, 227, 0.12)":"none",v=o>30?"rgba(255, 149, 0, 0.12)":"none",g=i>10;a.innerHTML=`
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
        <text x="290" y="45" fill="var(--text-main)" font-size="14" font-weight="700" text-anchor="end">${p(o,0)} W</text>

        <line x1="200" y1="10" x2="200" y2="110" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,3"/>
        <circle cx="${100+n*2}" cy="${n<=50?110-n*2:10+(n-50)*2}" r="6" fill="var(--green)" style="transition: cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"/>
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
            <span class="tile-row-value">${p(c,0)}</span>
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
            <span class="tile-row-value">${p(r,0)}</span>
            <span class="tile-row-unit">W</span>
          </span>
        </div>
      </div>
    </div>
  `}function L(e){if(!e||e.length===0)return null;let a=e.length,t=0,o=0,i=0,c=0;for(let n=0;n<a;n++)t+=n,o+=e[n],i+=n*e[n],c+=n*n;let s=(a*i-t*o)/(a*c-t*t),r=(o-s*t)/a,l=[];for(let n=0;n<a;n++)l.push(parseFloat((s*n+r).toFixed(3)));return l}function G(e,a){let t=document.getElementById("chart-kpi-container");if(!t||!e||!e.values)return;let o=e.values.filter(g=>g>0),i=e.total_kwh||0,c=o.length>0?Math.max(...o):0,s=o.length>0?Math.min(...o):0,r=o.length>0?i/o.length:0,l="--",n="var(--text-sub)";if(e.values.length>=3){let g=L(e.values);if(g&&g.length>=2){let u=g[g.length-1]-g;u>.05?(l="\u25B2 steigend",n="var(--green)"):u<-.05?(l="\u25BC fallend",n="var(--orange)"):l="\u27A1 stabil"}}let h=e.period_type==="hour"?"kW":"kWh",v=`
    <div style="width:100%; display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:16px; padding:12px 4px; background:var(--bg-app); border-radius:14px; margin-top:8px;">
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Gesamtertrag</span><span style="font-size:18px; font-weight:700; color:var(--orange); margin-top:2px;">${p(i,2)} kWh</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Mittelwert (\xD8)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${p(r,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Spitzenwert (Max)</span><span style="font-size:16px; font-weight:700; color:var(--green); margin-top:4px;">${p(c,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px; border-right:1px solid var(--border);"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Tiefstwert (Min)</span><span style="font-size:16px; font-weight:700; color:var(--text-main); margin-top:4px;">${p(s,2)} ${h}</span></div>
      <div style="display:flex; flex-direction:column; padding:0 12px;"><span style="font-size:11px; color:var(--text-sub); font-weight:600; text-transform:uppercase;">Verlaufstrend</span><span style="font-size:15px; font-weight:700; color:${n}; margin-top:4px;">${l}</span></div>
    </div>
  `;a&&a.years&&(v+=`
      <div style="margin-top:24px; border-top:1px solid var(--border); padding-top:16px; width:100%;">
        <h4 style="font-size:12px; font-weight:700; color:var(--orange); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">Jahresvergleich (Historie)</h4>
        <div class="yb-container-scroll" id="year-bars"></div>
      </div>
    `,setTimeout(()=>Z(a.years),20)),t.innerHTML=v}function Z(e){let a=document.getElementById("year-bars");if(!a||!e||e.length===0)return;let t=new Date().getFullYear().toString(),o=e.slice().sort((r,l)=>r.year-l.year),i=Math.max(...o.map(r=>r.kwh),1),c=o.length>=3?L(o.map(r=>r.kwh)):null,s=o.map((r,l)=>{let n=l>0?o[l-1]:null,h=r.year===t,v=(r.kwh/i*100).toFixed(1),g="";if(n&&n.kwh>0){let d=r.partial&&r.prev_same_period!=null?r.prev_same_period:n.kwh,b=r.partial?" (Zeitraum)":"",w=r.kwh-d,B=(w/d*100).toFixed(1),f=w>=0;g=`<span class="${f?"yb-gain":"yb-loss"}">${f?"\u25B2":"\u25BC"} ${p(Math.abs(w),0)} kWh (${f?"+":""}${B}%)${b}</span>`}let u="";c&&c[l]!=null&&(u=`<span class="yb-meta-text" style="color:${r.kwh-c[l]>=0?"var(--green)":"var(--text-sub)"}; margin-left:12px;">\u2248 ${p(c[l],0)} kWh Trend</span>`);let x=r.partial?'<span class="yb-meta-text" style="font-weight:700; color:var(--accent);"> \u25CF laufendes Jahr</span>':"",m=r.partial?"":`<span class="yb-meta-text" style="margin-left:auto;">${v}% von Best</span>`;return`
      <div class="yb-item${h?" yb-current":""}">
        <div class="yb-label">${r.year}${h?" \u25CF":""}</div>
        <div class="yb-val">${p(r.kwh,0)}</div>
        <div class="yb-unit"> kWh</div>
        <div class="yb-track">
          <div class="yb-fill" style="width:${v}%;"></div>
        </div>
        ${x}
        ${g}
        ${u}
        ${m}
      </div>
    `});a.innerHTML=s.reverse().join("")}var y=null,M={family:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',size:11,weight:"500"};function O(){window.addEventListener("themeChanged",()=>{if(!y)return;let a=document.body.classList.contains("apple-theme-dark")?"#2c2c2e":"#e8e8ed";y.options.scales.x.grid.color=a,y.options.scales.y.grid.color=a,y.options.scales.y2&&(y.options.scales.y2.grid.color=a),y.update()})}function W(e,a){let t=document.getElementById("dashboardChart");if(!t||!e||!e.labels)return;let o=t.getContext("2d"),i=document.body.classList.contains("apple-theme-dark"),c=getComputedStyle(document.body).getPropertyValue("--orange").trim()||"#ff9500",s=getComputedStyle(document.body).getPropertyValue("--accent").trim()||"#0071e3",r=i?"#2c2c2e":"#e8e8ed",l="#86868b",n=o.createLinearGradient(0,0,0,320);n.addColorStop(0,i?"rgba(255,159,10, 0.35)":"rgba(255,149,0, 0.25)"),n.addColorStop(1,"rgba(255,149,0, 0.01)");let h=null;(e.period_type==="day"||e.period_type==="month")&&e.values&&e.values.length>=5&&(h=L(e.values));let v=e.period_type==="hour"&&e.theoretical&&e.theoretical.some(u=>u>0),g=[{label:"Produktion (kWh)",data:e.values||[],backgroundColor:n,borderColor:c,borderWidth:1.5,borderRadius:4,borderSkipped:!1,type:"bar",order:2,yAxisID:"y"}];v&&g.push({label:"Theoretisch (kW)",data:e.theoretical,type:"line",borderColor:s,borderWidth:2.5,borderDash:[4,4],pointRadius:0,fill:!1,tension:.4,order:1,yAxisID:"y2"}),h&&g.push({label:"Trend (kWh)",data:h,type:"line",borderColor:s,borderWidth:2,borderDash:[4,4],pointRadius:0,fill:!1,tension:.2,order:1,yAxisID:"y"}),G(e,a),y&&y.destroy(),y=new window.Chart(o,{type:"bar",data:{labels:e.labels,datasets:g},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:e.period_type==="day"||e.period_type==="month"||v,labels:{color:l,font:M}},tooltip:{backgroundColor:i?"#1c1c1e":"#ffffff",borderColor:r,borderWidth:1,padding:12,cornerRadius:10,intersect:!1,mode:"index",titleFont:M,bodyFont:M,callbacks:{label:u=>u.dataset.label.startsWith("Theoretisch")?` ${u.dataset.label}: ${p(u.raw,2)} kW`:u.dataset.label.startsWith("Trend")?` ${u.dataset.label}: ${p(u.raw,2)} kWh`:` Realer Ertrag: ${p(u.raw,2)} kWh`}}},scales:{x:{grid:{color:r},ticks:{color:l,font:M,maxTicksLimit:e.labels.length>31?15:void 0}},y:{grid:{color:r},ticks:{color:l,font:M,callback:u=>u+" kWh"},beginAtZero:!0,position:"left"},y2:v?{grid:{drawOnChartArea:!1},ticks:{color:s,font:{...M,size:10,weight:"600"},callback:u=>u+" kW"},beginAtZero:!0,position:"right"}:{display:!1}}}})}var T=null;function Y(){let e=document.getElementById("csv-export-btn");e&&e.addEventListener("click",()=>{if(!T||!T.labels)return;let a=T,t=a.theoretical&&a.theoretical.some(r=>r>0),o=[`Zeitraum;Produktion_kWh${t?";Theoretisch_kW":""}`];a.labels.forEach((r,l)=>{let n=`${r};${(a.values[l]||0).toFixed(3).replace(".",",")}`;t&&(n+=`;${(a.theoretical[l]||0).toFixed(3).replace(".",",")}`),o.push(n)});let i=new Blob(["\uFEFF"+o.join(`\r
`)],{type:"text/csv;charset=utf-8;"}),c=document.createElement("a");c.href=URL.createObjectURL(i);let s=new Date().toLocaleDateString("sv-SE");c.download=`pv_export_${a.period_type||"daten"}_${s}.csv`,document.body.appendChild(c),c.click(),document.body.removeChild(c),setTimeout(()=>URL.revokeObjectURL(c.href),100)})}function I(e){let a=document.getElementById("data-table-container");if(!a||!e||!e.labels)return;T=e;let t=e.theoretical&&e.theoretical.some(n=>n>0),o=e.efficiency&&e.efficiency.some(n=>n!=null),i='<tr><th>Zeitraum</th><th style="text-align:right;">Produktion (kWh)</th>';t&&(i+='<th style="text-align:right;">Theoretisch (kW)</th>'),o&&(i+='<th style="text-align:right;">Wirkungsgrad</th>'),i+="</tr>";let c=0,s=0,r="";e.labels.forEach((n,h)=>{let v=e.values[h]||0;c+=v;let g=`<td><strong>${n}</strong></td><td style="text-align:right;">${p(v,3)} kWh</td>`;if(t){let u=e.theoretical[h]||0;s+=u,g+=`<td style="text-align:right; color: var(--accent);">${p(u,3)} kW</td>`}if(o){let u=e.efficiency[h];if(u!=null){let x=Math.round(u*100),m=x>100?"var(--green)":x>=70?"var(--text-main)":"var(--orange)";g+=`<td style="text-align:right; font-weight:700; color:${m}">${x}%</td>`}else g+='<td style="text-align:right; color:var(--text-sub);">--</td>'}r+=`<tr>${g}</tr>`});let l='<tr style="border-top:2px solid var(--border); font-weight:800; background-color:var(--bg-app);">';l+=`<td>GESAMT</td><td style="text-align:right; color:var(--orange);">${p(c,2)} kWh</td>`,t&&(l+=`<td style="text-align:right; color:var(--accent);">${p(s,2)} kW</td>`),o&&(s>0?l+=`<td style="text-align:right; color:var(--green);">${Math.round(c/s*100)}%</td>`:l+="<td></td>"),l+="</tr>",a.innerHTML=`
    <table class="apple-table" style="width:100%; border-collapse:collapse;">
      <thead style="position:sticky; top:0; z-index:10; background-color:var(--bg-app); border-bottom:1px solid var(--border);">${i}</thead>
      <tbody>${r}</tbody>
      <tfoot style="position:sticky; bottom:0; z-index:10;">${l}</tfoot>
    </table>
  `}var K="em-period-label";function q(e){let a=new Date,t=new Date,o=new Date;switch(t.setHours(0,0,0,0),o.setHours(23,59,59,999),e){case"today":break;case"gestern":t.setDate(a.getDate()-1),o.setDate(a.getDate()-1);break;case"woche":{let i=a.getDay();t.setDate(a.getDate()-i+(i===0?-6:1));break}case"7tage":t.setDate(a.getDate()-6);break;case"30tage":t.setDate(a.getDate()-29);break;case"monat":t.setDate(1);break}return{from:E(t),to:E(o)}}function E(e){return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function j(e,a){if(!e)return;let t=localStorage.getItem(K)||"Heute",o=new Date().getFullYear(),i="";for(let d=o;d>=2013;d--)i+=`<option value="${d}">Jahr ${d}</option>`;if(!document.getElementById("ds-styles")){let d=document.createElement("style");d.id="ds-styles",d.textContent=`
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
        `,document.head.appendChild(d)}let c=document.createElement("div");c.className="ds-wrap";let s=k("calendar",16,.7,5,"var(--text-sub)");c.innerHTML=`
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
                ${i}
            </select>
            <div class="ds-section" style="cursor:pointer; margin-top:5px;" id="dsCustomToggle">Individuell\u2026</div>
            <div class="ds-custom" id="dsCustom">
                <input type="date" id="dsFrom">
                <input type="date" id="dsTo">
                <button id="dsApply">Anwenden</button>
            </div>
        </div>
    `,e.appendChild(c);let r=c.querySelector("#dsBtn"),l=c.querySelector("#dsDrop"),n=c.querySelector("#dsYear"),h=c.querySelector("#dsCustomToggle"),v=c.querySelector("#dsCustom"),g=c.querySelector("#dsFrom"),u=c.querySelector("#dsTo"),x=c.querySelector("#dsApply");r.addEventListener("click",d=>{d.stopPropagation(),l.classList.toggle("hidden")}),document.addEventListener("click",()=>l.classList.add("hidden")),l.addEventListener("click",d=>d.stopPropagation()),h.addEventListener("click",()=>v.classList.toggle("show"));function m(d,b,w,B=null){t=d,localStorage.setItem(K,d),r.textContent=d,l.classList.add("hidden"),l.querySelectorAll(".ds-item").forEach(A=>{A.classList.toggle("active",A.textContent.trim()===d)});let f=B;f||(d==="Heute"||d==="Gestern"?f="hour":d==="Diese Woche"||d==="Letzte 7 Tage"||d==="Letzte 30 Tage"||d==="Dieser Monat"||d.startsWith("Individuell")?f="day":d.startsWith("Jahr")&&(f="month")),a(f,b,w)}l.querySelectorAll(".ds-item").forEach(d=>{d.addEventListener("click",()=>{let b=d.getAttribute("data-key"),w=q(b);m(d.textContent.trim(),w.from,w.to)})}),n.addEventListener("change",()=>{if(!n.value)return;let d=n.value;m(`Jahr ${d}`,`${d}-01-01`,`${d}-12-31`,"month")}),x.addEventListener("click",()=>{!g.value||!u.value||m("Bereich",g.value,u.value,"day")}),setTimeout(()=>{if(t==="Heute"||t==="Gestern"||t==="Diese Woche"||t==="Dieser Monat"||t==="Letzte 7 Tage"||t==="Letzte 30 Tage"){let b=q({Heute:"today",Gestern:"gestern","Diese Woche":"woche","Letzte 7 Tage":"7tage","Letzte 30 Tage":"30tage","Dieser Monat":"monat"}[t]);m(t,b.from,b.to)}else if(t.startsWith("Jahr ")){let d=t.replace("Jahr ","");m(t,`${d}-01-01`,`${d}-12-31`,"month")}else m("Heute",E(new Date),E(new Date),"hour")},50)}var C="hour",z=new Date().toLocaleDateString("sv-SE"),J=new Date().toLocaleDateString("sv-SE");async function X(){try{let e=C==="hour"?`date=${z}`:`from=${z}&to=${J}`,a=await fetch(`api/combined/${C}?${e}`);if(!a.ok)throw new Error("Fehler beim Laden des Archivs");let t=await a.json();W(t.chart,t.summary),I(t.chart)}catch(e){console.error("Archiv-Update fehlgeschlagen:",e)}}async function U(){try{let e=new Date().toLocaleDateString("sv-SE"),a=await fetch(`api/combined/hour?date=${e}`);if(!a.ok)throw new Error("Live-API-Fehler");let t=await a.json();if(document.getElementById("server-time").innerText=t["meta-data"].servertime,document.getElementById("app-title").innerText=t["meta-data"].apptitle,R(t.current,t.summary,t.chart,t["meta-data"]),N(t.current),C==="hour"&&z===e&&(W(t.chart,t.summary),I(t.chart)),t["meta-data"]?.appversion){let o=document.getElementById("footer-app-version");o&&(o.innerText=`v${t["meta-data"].appversion} (BFF Architecture)`)}}catch(e){console.error("Live-Update fehlgeschlagen:",e)}}function Q(){V(),P(),F(),O(),Y(),j(document.getElementById("date-selector-container"),(e,a,t)=>{C=e,z=a,J=t,X()}),U(),setInterval(U,1e4)}Q();console.info("%c \u26A1 Kostal Pico Dashboard %c ESM v2.5.0 ","color:#fff;background:#e94560;padding:4px 8px;border-radius:4px 0 0 4px;font-size:11px","color:#1a1a2e;background:#a8dadc;padding:4px 8px;border-radius:0 4px 4px 0;font-size:11px");})();
//# sourceMappingURL=main.bundle.js.map
