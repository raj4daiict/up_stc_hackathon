import React from 'react';

interface Props { show: boolean; }

export function AlertBanner({ show }: Props) {
  if (!show) return null;
  return (
    <div style={{
      background: '#fef2f2', border: '1px solid #fca5a5',
      borderRadius: 10, padding: '10px 14px', marginBottom: 12,
    }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
        🔴 ध्यान दें: आपका वजन तेजी से बढ़ रहा है
      </p>
      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#7f1d1d' }}>
        कृपया अपना वजन दर्ज करें या डॉक्टर से संपर्क करें
      </p>
    </div>
  );
}
