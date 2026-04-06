import React from 'react';

const REMINDERS = [
  { icon: '💊', text: 'आज सीमा को आयरन टैबलेट लेना है', color: '#D7EFF4' },
  { icon: '⚖️', text: 'कल वजन जांच का समय है', color: '#fef3c7' },
  { icon: '🏥', text: 'अगला डॉक्टर चेकअप: 15 अप्रैल', color: '#f0fdf4' },
];

export function FamilyView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#5BBED3', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
        👨‍👩‍👧 परिवार
      </p>
      <div style={{
        maxWidth: 390, width: '100%',
        background: '#fff', borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minHeight: 600, overflow: 'hidden',
      }}>
        <div style={{ background: '#5BBED3', padding: '20px 20px 16px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#fff' }}>सीमा की देखभाल</h2>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>परिवार का सहयोग जरूरी है 💛</p>
        </div>

        <div style={{ padding: '16px 16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', margin: '0 0 10px' }}>आज के अनुस्मारक</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {REMINDERS.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', borderRadius: 10, background: r.color }}>
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a3d44' }}>{r.text}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#fef2f2', borderRadius: 12, padding: '14px', marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#dc2626' }}>🚨 आपातकालीन संपर्क</p>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: '#1a3d44' }}>108 — एम्बुलेंस</p>
            <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>किसी भी आपात स्थिति में तुरंत कॉल करें</p>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '14px' }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#166534' }}>🏥 प्रसव की तैयारी</p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {['अस्पताल का बैग तैयार रखें', 'खून दाता की व्यवस्था करें', 'परिवहन की योजना बनाएं'].map((item, i) => (
                <li key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
