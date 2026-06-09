import { $, cv } from './config.js';

const html = document.documentElement;

export function applyBg(c) {
  html.style.setProperty('--bg', c);
  document.body.style.setProperty('background', c);
  html.style.setProperty('background', c);

  const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
  const s1 = '#' + [r, g, b].map(v => Math.min(255, v + 15).toString(16).padStart(2, '0')).join('');
  const s2 = '#' + [r, g, b].map(v => Math.min(255, v + 25).toString(16).padStart(2, '0')).join('');

  html.style.setProperty('--surface', s1);
  html.style.setProperty('--surface2', s2);
  html.style.setProperty('--shadow', 'none');
  localStorage.setItem('pv-bg', c);

  const resetBtn = $('bgReset');
  if (resetBtn) resetBtn.style.display = '';
}

export function resetBg() {
  html.style.removeProperty('--bg');
  html.style.removeProperty('--surface');
  html.style.removeProperty('--surface2');
  html.style.removeProperty('--shadow');
  document.body.style.removeProperty('background');
  html.style.removeProperty('background');
  localStorage.removeItem('pv-bg');
  $('bgReset').style.display = 'none';
}

export function setupThemeEngine(onThemeChanged) {
  let theme = html.getAttribute('data-theme') || 'dark';

  const applyTheme = (t) => {
    theme = t;
    html.setAttribute('data-theme', t);
    const btn = $('theme-btn');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('pv-theme', t);
    if (onThemeChanged) onThemeChanged();
  };

  // Gespeicherten Hintergrund laden
  const savedBg = localStorage.getItem('pv-bg');
  if (savedBg) applyBg(savedBg);

  // Klick-Event für Theme binden
  $('theme-btn').addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));

  // System-Farbwechsel überwachen
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('pv-theme')) applyTheme(e.matches ? 'dark' : 'light');
  });

  // Background Picker Events binden (Ersetzt die Inline-Attribute)
  const bgPick = $('bgPick');
  bgPick.addEventListener('input', (e) => applyBg(e.target.value));
  bgPick.addEventListener('change', (e) => applyBg(e.target.value));
  $('bgReset').addEventListener('click', resetBg);

  // HIER EINFÜGEN: Klick auf 🎨 triggert das unsichtbare Farb-Input
  $('palette-btn').addEventListener('click', () => $('bgPick').click());
}
