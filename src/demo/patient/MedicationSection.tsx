import React from 'react';
import { useDemoContext } from '../DemoContext';
import { calculateAdherenceScore, classifyAdherence } from '../medicationUtils';

export function MedicationSection() {
  const { state } = useDemoContext();
  const { medicationAdherence } = state;
  const { ifaTotal, ifaRemaining, albendazoleTaken } = medicationAdherence;

  const score = calculateAdherenceScore(ifaTotal, ifaRemaining);
  const showReminder = score === null || score < 80;

  const ifaStatus = () => {
    if (ifaRemaining === null) return { label: '⚠ लंबित', color: '#f59e0b' };
    if (score !== null && score >= 50) return { label: '✔ लिया गया', color: '#10b981' };
    return { label: '❌ नहीं लिया', color: '#ef4444' };
  };

  const albeStatus = () => {
    if (albendazoleTaken === null) return { label: '⚠ लंबित', color: '#f59e0b' };
    if (albendazoleTaken === true) return { label: '✔ लिया गया', color: '#10b981' };
    return { label: '❌ नहीं लिया', color: '#ef4444' };
  };

  const ifa = ifaStatus();
  const albe = albeStatus();

  const rowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid #e5e7eb',
  };

  return (
    <div style={{ maxWidth: 390, width: '100%', marginBottom: 16 }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', margin: '0 0 10px' }}>दवा ट्रैकिंग</p>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '0 14px' }}>
        <div style={rowStyle}>
          <p style={{ margin: 0, fontSize: 12, color: '#374151' }}>आयरन (IFA) टैबलेट – रोज़ाना</p>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: ifa.color }}>{ifa.label}</p>
        </div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#374151' }}>कीड़े की दवा (Albendazole) – एक बार (दूसरी तिमाही)</p>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: albe.color }}>{albe.label}</p>
        </div>
      </div>

      {showReminder && (
        <div style={{ background: '#D7EFF4', borderRadius: 10, padding: '10px 14px', marginTop: 10 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1a3d44' }}>
            📅 आज का कार्य: आयरन टैबलेट लें
          </p>
        </div>
      )}
    </div>
  );
}
