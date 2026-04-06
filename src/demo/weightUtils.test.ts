import { detectWeightAnomaly } from './weightUtils';

// Feature: pregnancy-monitoring-demo, Property 1: No false negatives
// For any weight series with at least one delta > 2 kg, must return true
describe('detectWeightAnomaly — Property 1: no false negatives', () => {
  it('returns true for demo series [58,59,60,62,64,66] (delta +2 at weeks 4→5 and 5→6)', () => {
    expect(detectWeightAnomaly([58, 59, 60, 62, 64, 66])).toBe(true);
  });

  it('returns true for series with a single large jump', () => {
    expect(detectWeightAnomaly([60, 65])).toBe(true);
  });

  it('returns true when anomaly is at the start', () => {
    expect(detectWeightAnomaly([58, 62, 63, 64])).toBe(true);
  });

  it('returns true when anomaly is at the end', () => {
    expect(detectWeightAnomaly([58, 59, 60, 65])).toBe(true);
  });
});

// Feature: pregnancy-monitoring-demo, Property 2: No false positives
// For any weight series where all deltas ≤ 2 kg, must return false
describe('detectWeightAnomaly — Property 2: no false positives', () => {
  it('returns false for flat series [58,59,60]', () => {
    expect(detectWeightAnomaly([58, 59, 60])).toBe(false);
  });

  it('returns false for series with exactly 2 kg delta (boundary)', () => {
    expect(detectWeightAnomaly([58, 60, 62])).toBe(false);
  });

  it('returns false for decreasing series', () => {
    expect(detectWeightAnomaly([66, 64, 62])).toBe(false);
  });
});

// Edge cases
describe('detectWeightAnomaly — edge cases', () => {
  it('returns false for empty array', () => {
    expect(detectWeightAnomaly([])).toBe(false);
  });

  it('returns false for single element', () => {
    expect(detectWeightAnomaly([60])).toBe(false);
  });
});
