import React from 'react';
import { useDemoContext } from '../DemoContext';
import { calculateAdherenceScore, classifyAdherence, STATUS_COLORS } from '../medicationUtils';

export function MedicationPanel() {
  const { state } = useDemoContext();
  const { medicationAdherence } = state;
  const { ifaTotal, ifaRemaining, albendazoleTaken } = medicationAdherence;

  const score = calculateAdherenceScore(ifaTotal, ifaRemaining);
  const status = classifyAdherence(score);

  const ifaStatusLabel = status === 'good' ? 'Good' : status === 'caution' ? 'Caution' : status === 'risk' ? 'Low' : '-';
  const ifaStatusColor = STATUS_COLORS[status];

  const albeStatusColor = albendazoleTaken === true ? STATUS_COLORS.good : albendazoleTaken === false ? STATUS_COLORS.risk : STATUS_COLORS.unknown;
  const albeStatusIcon = albendazoleTaken === true ? '🟢' : albendazoleTaken === false ? '🔴' : '—';

  const colStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: 12,
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  };

  const headerColStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: 11,
    fontWeight: 700,
    color: '#6b7280',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
      <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#1a3d44' }}>💊 Medication Adherence</p>

      {score !== null && score < 50 && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#b91c1c' }}>🔴 Low Medication Adherence Detected</p>
        </div>
      )}

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <div style={headerColStyle}>Medicine</div>
        <div style={headerColStyle}>Adherence</div>
        <div style={headerColStyle}>Status</div>

        {/* IFA row */}
        <div style={colStyle}>IFA (Iron)</div>
        <div style={colStyle}>{score !== null ? `${score}%` : '—'}</div>
        <div style={{ ...colStyle, color: ifaStatusColor, fontWeight: 700 }}>
          {status === 'good' ? '🟢' : status === 'caution' ? '🟡' : status === 'risk' ? '🔴' : ''} {ifaStatusLabel}
        </div>

        {/* Albendazole row */}
        <div style={{ ...colStyle, borderBottom: 'none' }}>Albendazole</div>
        <div style={{ ...colStyle, borderBottom: 'none' }}>
          {albendazoleTaken === true ? 'लिया गया' : albendazoleTaken === false ? 'नहीं लिया' : '—'}
        </div>
        <div style={{ ...colStyle, borderBottom: 'none', color: albeStatusColor, fontWeight: 700 }}>
          {albeStatusIcon}
        </div>
      </div>
    </div>
  );
}
