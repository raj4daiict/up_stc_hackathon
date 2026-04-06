import React from 'react';

interface Props { anomalyDetected: boolean; onSelect: () => void; }

export function PatientListTable({ anomalyDetected, onSelect }: Props) {
  const patients = [
    { name: 'सीमा देवी', risk: 'high' as const, alert: anomalyDetected, last: '2 घंटे पहले' },
    { name: 'रानी यादव', risk: 'medium' as const, alert: false, last: '1 दिन पहले' },
    { name: 'प्रिया देवी', risk: 'low' as const, alert: false, last: '3 दिन पहले' },
  ];

  const riskLabel = { high: 'उच्च', medium: 'मध्यम', low: 'सामान्य' };
  const riskBg = { high: '#fef2f2', medium: '#fffbeb', low: '#f0fdf4' };
  const riskColor = { high: '#dc2626', medium: '#d97706', low: '#16a34a' };

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '12px 16px', background: '#D7EFF4', borderBottom: '1px solid #b8dce6' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>मरीज़ सूची</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            {['नाम', 'जोखिम', 'अलर्ट', 'अंतिम अपडेट'].map(h => (
              <th key={h} style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: '#6b7280', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map((p, i) => (
            <tr key={i} onClick={i === 0 ? onSelect : undefined}
              style={{ cursor: i === 0 ? 'pointer' : 'default', background: i === 0 && p.alert ? '#fef2f2' : 'white' }}>
              <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#1a3d44', borderBottom: '1px solid #f3f4f6' }}>{p.name}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: riskBg[p.risk], color: riskColor[p.risk] }}>
                  {riskLabel[p.risk]}
                </span>
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
                {p.alert && <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>🔴 वजन अलर्ट</span>}
              </td>
              <td style={{ padding: '10px 12px', fontSize: 11, color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>{p.last}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
