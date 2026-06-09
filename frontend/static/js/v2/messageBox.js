// /static/js/v3/messageBox.js
import { getAppleIcon } from './icons.js';

if (!document.getElementById('health-msg-styles')) {
  const style = document.createElement('style');
  style.id = 'health-msg-styles';
  style.textContent = `
    /* Schwebender Container zentriert am unteren Rand */
    .health-snackbar-wrap {
        position: fixed !important;
        bottom: 35px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 999999 !important;
        display: flex !important;
        flex-direction: column-reverse !important;
        gap: 12px !important;
        pointer-events: none !important;
        width: max-content !important;
    }

    /* Die schwebende Apple-Säule */
    .health-toast-box {
        min-width: 320px !important;
        max-width: 450px !important;
        padding: 14px 22px !important;
        border-radius: 16px !important;

        /* LIGHTMODE STANDARD (Solides Weiß mit leichtem Schatten) */
        background-color: #ffffff !important;
        border: 1px solid #e5e5ea !important;
        color: #000000 !important;

        font-size: 14px !important;
        font-weight: 600 !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
        pointer-events: auto !important;
        display: flex !important;
        align-items: center !important;
        gap: 14px !important;
        animation: healthToastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
        transition: opacity 0.3s, transform 0.3s !important;
    }

    /* 🔧 100% BRUTALER DARKMODE ADAPTER */
    [data-theme="dark"] .health-toast-box {
        background-color: #010101 !important;
        border: 1px solid #2c2c2e !important;
        color: #ffffff !important;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6) !important;
    }

    /* Farbige Statusbalken links */
    .h-msg-info { border-left: 5px solid #0a84ff !important; }
    .h-msg-success { border-left: 5px solid #30d158 !important; }
    .h-msg-error { border-left: 5px solid #ff453a !important; }

    @keyframes healthToastIn {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .health-toast-out {
        opacity: 0 !important;
        transform: translateY(10px) scale(0.95) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Zeigt eine elegante iOS-Style MessageBox überlagert am unteren Bildschirmrand an
 */
export function showMessage(text, type = 'info') {
  let container = document.getElementById('healthUniqueSnackbarContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'healthUniqueSnackbarContainer';
    container.className = 'health-snackbar-wrap';
    document.body.appendChild(container);
  }

  // 🌟 EMOMJIS GEGEN APPLE LINE-ICONS ERSETZT
  // Info nutzt das Trend-Auge, Success das Waagen-Häkchen, Error den Energie-Blitz
  const iconName = type === 'success' ? 'weight' : (type === 'error' ? 'energy' : 'trend');
  const iconColor = type === 'success' ? 'var(--apple-green)' : (type === 'error' ? 'var(--apple-red)' : 'var(--apple-blue)');
  const svgIcon = getAppleIcon(iconName, 18, iconColor);

  const box = document.createElement('div');
  box.className = `health-toast-box h-msg-${type}`;
  box.innerHTML = `${svgIcon}<div style="flex:1; line-height: 1.4;">${text}</div>`;

  container.appendChild(box);

  // Erfolgsmeldungen verschwinden super knackig nach 500ms, Fehler bleiben 4s
  const displayDuration = type === 'success' ? 1500 : 4000;

  setTimeout(() => {
    if (box) {
      box.classList.add('health-toast-out');
      box.addEventListener('transitionend', () => box.remove());
    }
  }, displayDuration);
}
