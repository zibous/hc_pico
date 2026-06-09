// frontend/static/js/v3/chartBase.js

/**
 * Berechnet die Lineare Regression für den Trendpfad (Sparklines/Charts)
 */
export function linearRegression(values) {
  if (!values || values.length === 0) return null;
  const n = values.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(parseFloat((slope * i + intercept).toFixed(3)));
  }
  return result;
}
