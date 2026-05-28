
// TESTCASE: Nginx übernimmt die Weiterleitung anhand dieses Pfades
// export const _B = 'http://10.1.1.119:5098/';
export const _B = '/picodb2';

export const $ = id => document.getElementById(id);
export const fmt = (v, d = 1) =>
  (v == null || v === '' || isNaN(Number(v))) ? '--' : Number(v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
export const fmtI = v =>
  (v == null || v === '' || isNaN(Number(v))) ? '--' : Math.round(Number(v)).toLocaleString('de-DE');
export const today = () => new Date().toISOString().slice(0, 10);
export const thisMonth = () => new Date().toISOString().slice(0, 7);
export const cv = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();


// Da Frontend und API auf demselben Server laufen, reicht ein leerer String oder der Unterpfad
// export const _B = (() => {
//   const p = window.location.pathname.replace(/\/+$/, '');
//   return (p === '' || p === '/index.html') ? '' : p;
// })();

// export const $ = id => document.getElementById(id);

// export const fmt = (v, d = 1) =>
//   (v == null || v === '' || isNaN(Number(v))) ? '--' : Number(v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

// export const fmtI = v =>
//   (v == null || v === '' || isNaN(Number(v))) ? '--' : Math.round(Number(v)).toLocaleString('de-DE');

// export const today = () => new Date().toISOString().slice(0, 10);
// export const thisMonth = () => new Date().toISOString().slice(0, 7);

// export const cv = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
