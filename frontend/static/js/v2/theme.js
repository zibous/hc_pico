// frontend/static/js/v2/theme.js

const STORAGE_KEY = 'apple-dashboard-theme';

/**
 * Initialisiert das Theme (Hell-/Dunkelmodus).
 * Nutzt data-theme Attribut auf <html> für zentrales Theme-System.
 */
export function initTheme() {
  // Gespeichertes Theme, synchronisiertes health-theme oder System-Preference
  const saved = localStorage.getItem('health-theme') || localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (systemPrefersDark ? 'dark' : 'dark');

  applyTheme(theme);

  // 🌟 FIX: Globaler Klick-Abfänger für den neuen Footer-Link registrieren.
  // Verhindert Abstürze beim Neuaufbau oder Wechsel des HTML-Skeletts!
  document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'themeToggleFooter') {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      localStorage.setItem('health-theme', next); // Projektweite Synchronisation
      window.dispatchEvent(new Event('themeChanged'));
    }
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
  // 🌟 FIX: Aktualisiert jetzt das neue Footer-Element absolut null-pointer-sicher
  const btn = document.getElementById('themeToggleFooter');
  if (btn !== null && btn !== undefined) {
    btn.innerHTML = theme === 'dark' ? '☀️ Helles Design' : '🌙 Dunkles Design';
  }
}
