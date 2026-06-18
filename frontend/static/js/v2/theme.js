// frontend/static/js/v2/theme.js

const STORAGE_KEY = 'apple-dashboard-theme';

/**
 * Initialisiert das Theme (Hell-/Dunkelmodus).
 * Nutzt data-theme Attribut auf <html> für zentrales Theme-System.
 */
export function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');

  // Gespeichertes Theme oder System-Preference, Default: dark
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (systemPrefersDark ? 'dark' : 'dark');

  applyTheme(theme);

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event('themeChanged'));
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  // Rückwärtskompatibilität: body-Klasse für bestehende CSS-Regeln
  document.body.classList.remove('apple-theme-dark', 'apple-theme-light');
  document.body.classList.add(theme === 'dark' ? 'apple-theme-dark' : 'apple-theme-light');
  updateToggleIcon(theme);
}

function updateToggleIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? '<span>☀️</span>' : '<span>🌙</span>';
}
