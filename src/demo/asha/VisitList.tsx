import React, { useState } from 'react';

interface Patient { name: string; risk: 'high' | 'medium' | 'low'; pending: string; }

const PATIENTS: Patient[] = [
  { name: 'सीमा देवी', risk: 'high', pending: 'वजन जांच' },
  { name: 'रानी यादव', risk: 'medium', pending: 'वजन जांच लंबित' },
  { name: 'प्रिया देवी', risk: 'low', pending: 'आयरन टैबलेट' },
];

const riskColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const riskLabel = { high: 'उच्च जोखिम', medium: 'मध्यम', low: 'सामान्य' };

interface Props { onSelect: (name: string) => void; selected: string | null; }

export function VisitList({ onSelect, selected }: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', margin: '0 0 8px' }}>आज की विजिट – रायबरेली</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PATIENTS.map(p => (
          <button key={p.name} onClick={() => onSelect(p.name)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
            background: selected === p.name ? '#D7EFF4' : '#f9fafb',
            borderLeft: `4px solid ${riskColor[p.risk]}`,
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>{p.name}</p>
              <p style={{ margin: 0, fontSize: 10, color: '#6b7280' }}>{p.pending}</p>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: riskColor[p.risk], background: `${riskColor[p.risk]}20`, padding: '2px 6px', borderRadius: 10 }}>
              {riskLabel[p.risk]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
