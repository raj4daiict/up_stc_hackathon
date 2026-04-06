/**
 * Detects abnormal weight gain in a pregnancy weight series.
 * Returns true if any consecutive pair has a delta > 2 kg.
 * Pure function — no side effects.
 */
export function detectWeightAnomaly(weights: number[]): boolean {
  if (weights.length < 2) return false;
  for (let i = 1; i < weights.length; i++) {
    if (weights[i] - weights[i - 1] > 2) return true;
  }
  return false;
}
