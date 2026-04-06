import React from 'react';
import { WeightChart } from '../patient/WeightChart';

interface Props { weights: number[]; }

export function WeightTrendPanel({ weights }: Props) {
  const delta = weights.length >= 2 ? weights[weights.length - 1] - weights[weights.length - 3] : 0;
  const isHigh = delta > 2;

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>वजन ट्रेंड — सीमा देवी</p>
        {isHigh && (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '3px 10px', borderRadius: 20 }}>
            +{delta.toFixed(1)} kg (2 सप्ताह) — High Risk
          </span>
        )}
      </div>
      <WeightChart weights={weights} />
    </div>
  );
}
