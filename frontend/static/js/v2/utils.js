// frontend/static/js/v3/utils.js

/**
 * Formatiert Zahlen präzise nach österreichischem Standard (de-AT)
 * Beispiel: 1234.56 -> "1.234,56"
 */
export function formatNum(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '0,00';
  return new Intl.NumberFormat('de-AT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Ermittelt die farbliche Kennzeichnung für System-Zustände im Apple-Look
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'perfekt': case 'ok': case 'einspeisen mpp': return 'var(--green)';
    case 'gut': case 'standby': return 'var(--orange)';
    default: return 'var(--text-sub)';
  }
}
