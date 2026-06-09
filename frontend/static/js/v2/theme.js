// frontend/static/js/v3/theme.js

/**
 * Initialisiert das Apple-Style Theme (Hell-/Dunkelmodus)
 */
export function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Gespeichertes Theme auslesen oder Systemeinstellung abfragen
  const savedTheme = localStorage.getItem('apple-dashboard-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.remove('apple-theme-light');
    document.body.classList.add('apple-theme-dark');
  } else {
    document.body.classList.remove('apple-theme-dark');
    document.body.classList.add('apple-theme-light');
  }

  updateToggleIcon();

  // Klick-Event für den Button
  toggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('apple-theme-dark')) {
      document.body.classList.remove('apple-theme-dark');
      document.body.classList.add('apple-theme-light');
      localStorage.setItem('apple-dashboard-theme', 'light');
    } else {
      document.body.classList.remove('apple-theme-dark');
      document.body.classList.add('apple-theme-dark');
      localStorage.setItem('apple-dashboard-theme', 'dark');
    }
    updateToggleIcon();

    // 🌟 Event triggern, damit installierte Charts ihre Gitterlinien-Farbe updaten
    window.dispatchEvent(new Event('themeChanged'));
  });
}

function updateToggleIcon() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const isDark = document.body.classList.contains('apple-theme-dark');
  // Nutzt ein einfaches Sonnen- oder Mond-Textsymbol/Icon im Apple-Button
  toggleBtn.innerHTML = isDark ? '<span>☀️</span>' : '<span>🌙</span>';
}
