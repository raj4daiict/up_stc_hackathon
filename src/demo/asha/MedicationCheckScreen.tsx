import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';
import { calculateAdherenceScore, classifyAdherence } from '../medicationUtils';

interface Props {
  patientName: string;
  onSave: () => void;
  onBack: () => void;
}

export function MedicationCheckScreen({ patientName, onSave, onBack }: Props) {
  const { dispatch } = useDemoContext();
  const [ifaRemaining, setIfaRemaining] = useState('');
  const [albendazoleTaken, setAlbendazoleTaken] = useState<boolean | null>(null);
  const [selfReportedRegularity, setSelfReportedRegularity] = useState<'yes' | 'no' | 'sometimes' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const ifaRemainingNum = ifaRemaining !== '' && !isNaN(Number(ifaRemaining)) ? Number(ifaRemaining) : null;
  const score = ifaRemainingNum !== null ? calculateAdherenceScore(30, ifaRemainingNum) : null;
  const status = classifyAdherence(score);

  const handleSave = () => {
    if (ifaRemaining.trim() === '') {
      setValidationError('कृपया बची हुई गोलियों की संख्या दर्ज करें');
      return;
    }
    if (Number(ifaRemaining) > 30) {
      setValidationError('बची हुई गोलियाँ कुल से अधिक नहीं हो सकतीं');
      return;
    }
    setValidationError(null);
    dispatch({
      type: 'RECORD_MEDICATION_CHECK',
      payload: {
        ifaRemaining: Number(ifaRemaining),
        albendazoleTaken,
        selfReportedRegularity,
      },
    });
    onSave();
  };

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 14px',
    borderRadius: 8,
    border: active ? 'none' : '1px solid #d1d5db',
    background: active ? '#5BBED3' : '#fff',
    color: active ? '#fff' : '#374151',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  });

  return (
    <div style={{ maxWidth: 390, width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>←</button>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>दवा जांच — {patientName}</p>
      </div>

      {/* IFA Section */}
      <div style={{ background: '#D7EFF4', borderRadius: 12, padding: '14px', marginBottom: 12 }}>
        <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>आयरन (IFA) टैबलेट</p>
        <p style={{ margin: '0 0 8px', fontSize: 12, color: '#374151' }}>कुल दी गई: 30</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: '#374151', whiteSpace: 'nowrap' }}>बची हुई:</label>
          <input
            type="number"
            value={ifaRemaining}
            onChange={e => setIfaRemaining(e.target.value)}
            style={{
              width: 70, padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db',
              fontSize: 12, color: '#374151',
            }}
          />
        </div>

        {ifaRemaining !== '' && ifaRemainingNum !== null && (
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#374151' }}>
            ली गई: {30 - ifaRemainingNum}
          </p>
        )}

        {score !== null && (
          <div style={{ marginBottom: 10 }}>
            {status === 'good' && (
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#10b981' }}>🟢 अच्छा</p>
            )}
            {status === 'caution' && (
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>🟡 ध्यान दें</p>
            )}
            {status === 'risk' && (
              <div>
                <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#ef4444' }}>🔴 जोखिम</p>
                <div style={{ background: '#fef2f2', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#b91c1c' }}>⚠ मरीज दवा सही से नहीं ले रही है</p>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li style={{ fontSize: 11, color: '#7f1d1d', marginBottom: 2 }}>दवा का महत्व समझाएं</li>
                    <li style={{ fontSize: 11, color: '#7f1d1d', marginBottom: 2 }}>रोज़ाना लेने के लिए प्रेरित करें</li>
                    <li style={{ fontSize: 11, color: '#7f1d1d' }}>परिवार को भी शामिल करें</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        <p style={{ margin: '0 0 6px', fontSize: 12, color: '#374151' }}>क्या मरीज नियमित दवा ले रही है?</p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setSelfReportedRegularity('yes')} style={btnStyle(selfReportedRegularity === 'yes')}>हाँ</button>
          <button onClick={() => setSelfReportedRegularity('no')} style={btnStyle(selfReportedRegularity === 'no')}>नहीं</button>
          <button onClick={() => setSelfReportedRegularity('sometimes')} style={btnStyle(selfReportedRegularity === 'sometimes')}>कभी-कभी</button>
        </div>
      </div>

      {/* Albendazole Section */}
      <div style={{ background: '#D7EFF4', borderRadius: 12, padding: '14px', marginBottom: 12 }}>
        <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>कीड़े की दवा (Albendazole)</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setAlbendazoleTaken(true)} style={btnStyle(albendazoleTaken === true)}>✔ हाँ</button>
          <button onClick={() => setAlbendazoleTaken(false)} style={btnStyle(albendazoleTaken === false)}>❌ नहीं</button>
        </div>
      </div>

      {validationError && (
        <p style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, margin: '0 0 8px' }}>{validationError}</p>
      )}

      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: '#5BBED3', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}
      >
        सहेजें
      </button>
    </div>
  );
}
