import type { AdherenceStatus } from './demoTypes';

export function calculateAdherenceScore(total: number, remaining: number | null): number | null {
  if (remaining === null) return null;
  if (remaining > total) return 0;
  return Math.round(((total - remaining) / total) * 100);
}

export function classifyAdherence(score: number | null): AdherenceStatus {
  if (score === null) return 'unknown';
  if (score > 80) return 'good';
  if (score >= 50) return 'caution';
  return 'risk';
}

export const STATUS_COLORS: Record<AdherenceStatus, string> = {
  good:    '#10b981',
  caution: '#f59e0b',
  risk:    '#ef4444',
  unknown: '#9ca3af',
};
