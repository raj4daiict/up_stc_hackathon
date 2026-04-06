import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';
import { calculateAdherenceScore } from '../medicationUtils';

export function AIRecommendationPanel() {
  const { state, dispatch } = useDemoContext();
  const { aiRecommendationVisible, doctorDecision, medicationAdherence } = state;
  const [loading, setLoading] = useState(false);

  const score = calculateAdherenceScore(medicationAdherence.ifaTotal, medicationAdherence.ifaRemaining);
  const showMedicationInsight = score !== null && score < 50;

  const showWeightPanel = aiRecommendationVisible || doctorDecision !== 'pending';

  if (!showWeightPanel && !showMedicationInsight) return null;

  const handleAccept = () => {
    setLoading(true);
    setTimeout(() => { dispatch({ type: 'DOCTOR_ACCEPT' }); setLoading(false); }, 800);
  };

  return (
    <>
      {/* Weight insight panel */}
      {doctorDecision === 'accepted' && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#166534' }}>✅ BP monitoring added to care plan</p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#16a34a' }}>Patient notified · ASHA worker notified · Care plan updated</p>
        </div>
      )}

      {doctorDecision === 'pending' && aiRecommendationVisible && (
        <div style={{ background: '#fff', border: '2px solid #5BBED3', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#1a3d44' }}>
            🧠 AI Insight
          </p>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#374151' }}>
            Recent weight gain is significantly higher than expected.
          </p>
          <div style={{ background: '#fef3c7', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#92400e' }}>Possible indications:</p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li style={{ fontSize: 12, color: '#78350f' }}>Fluid retention</li>
              <li style={{ fontSize: 12, color: '#78350f' }}>Hypertension risk</li>
            </ul>
          </div>
          <div style={{ background: '#D7EFF4', borderRadius: 8, padding: '10px 12px', marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1a3d44' }}>
              💡 Suggested Action: Add blood pressure monitoring
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAccept} disabled={loading} style={{
              flex: 1, padding: '10px', borderRadius: 8, border: 'none',
              background: loading ? '#ccc' : '#10b981', color: 'white',
              fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? '⏳ Processing...' : '✅ Accept'}
            </button>
            <button onClick={() => dispatch({ type: 'DOCTOR_IGNORE' })} style={{
              flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e5e7eb',
              background: 'white', color: '#6b7280', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              ❌ Ignore
            </button>
          </div>
        </div>
      )}

      {/* Medication insight block */}
      {showMedicationInsight && (
        <div style={{ background: '#fff', border: '2px solid #ef4444', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: '#1a3d44' }}>
            🧠 AI Insight: Patient adherence to IFA is below 50%
          </p>
          <div style={{ background: '#fef2f2', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#b91c1c' }}>Possible risks:</p>
            <p style={{ margin: 0, fontSize: 12, color: '#7f1d1d' }}>Anemia, fatigue, pregnancy complications</p>
          </div>
          <div style={{ background: '#D7EFF4', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#1a3d44' }}>Suggested actions:</p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li style={{ fontSize: 12, color: '#1a3d44', marginBottom: 2 }}>Reinforce counseling via ASHA</li>
              <li style={{ fontSize: 12, color: '#1a3d44', marginBottom: 2 }}>Check for side effects</li>
              <li style={{ fontSize: 12, color: '#1a3d44' }}>Consider alternate prescription</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              flex: 1, padding: '10px', borderRadius: 8, border: 'none',
              background: '#5BBED3', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              Assign follow-up
            </button>
            <button onClick={() => dispatch({ type: 'NOTIFY_ASHA_MEDICATION' })} style={{
              flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #5BBED3',
              background: 'white', color: '#5BBED3', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              Notify ASHA
            </button>
          </div>
        </div>
      )}
    </>
  );
}
