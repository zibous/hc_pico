/**
 * Berechnet die lineare Regression für eine Reihe von Werten.
 * @param {number[]} values - Array mit Produktionswerten
 * @returns {number[]|null} - Array mit Trendpunkten oder null
 */
export function linearRegression(values) {
  const n = values.length;
  if (n < 2) return null;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumXX += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return values.map((_, i) => Math.max(0, Math.round((slope * i + intercept) * 1000) / 1000));
}
