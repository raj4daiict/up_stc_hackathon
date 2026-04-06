import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';
import { AshaNotification } from './AshaNotification';
import { VisitList } from './VisitList';
import { JournalScreen } from './JournalScreen';
import { MedicationCheckScreen } from './MedicationCheckScreen';
import { WeightChart } from '../patient/WeightChart';
import { calculateAdherenceScore, classifyAdherence } from '../medicationUtils';

const PATIENT_ID_MAP: Record<string, string> = {
  'सीमा देवी': 'seema-devi',
  'रानी यादव': 'rani-yadav',
  'प्रिया देवी': 'priya-devi',
};

type Screen = 'list' | 'visit-detail' | 'medication-check' | 'journal' | 'journal-from-med';

export function AshaView() {
  const { state } = useDemoContext();
  const { ashaNotification, weightHistory, medicationAdherence } = state;
  const [selected, setSelected] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('list');

  const score = calculateAdherenceScore(medicationAdherence.ifaTotal, medicationAdherence.ifaRemaining);
  const status = classifyAdherence(score);
  const riskCount = score !== null && score < 50 ? 1 : 0;

  const handleSelectPatient = (name: string) => {
    setSelected(name);
    setScreen('visit-detail');
  };

  const handleBack = () => {
    setSelected(null);
    setScreen('list');
  };

  const renderBody = () => {
    if (screen === 'medication-check' && selected) {
      return (
        <MedicationCheckScreen
          patientName={selected}
          onSave={() => setScreen('journal-from-med')}
          onBack={() => setScreen('visit-detail')}
        />
      );
    }

    if (screen === 'journal' && selected) {
      return (
        <JournalScreen
          patientName={selected}
          patientId={PATIENT_ID_MAP[selected] ?? selected}
          onClose={handleBack}
        />
      );
    }

    if (screen === 'journal-from-med' && selected) {
      return (
        <JournalScreen
          patientName={selected}
          patientId={PATIENT_ID_MAP[selected] ?? selected}
          onClose={handleBack}
          fromMedicationCheck={true}
        />
      );
    }

    if (screen === 'visit-detail' && selected) {
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>←</button>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>{selected} — विजिट विवरण</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => setScreen('medication-check')}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                background: '#5BBED3', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              💊 दवा जांच करें
            </button>
            <button
              onClick={() => setScreen('journal')}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #5BBED3',
                background: '#fff', color: '#5BBED3', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              📝 जर्नल लिखें
            </button>
          </div>
        </div>
      );
    }

    // list screen
    return (
      <>
        <VisitList onSelect={handleSelectPatient} selected={selected} />
        <div style={{ height: 1, background: '#e5e7eb', margin: '12px 0' }} />
        <p style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', margin: '0 0 8px' }}>सीमा देवी — वजन ग्राफ</p>
        <WeightChart weights={weightHistory} />
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#5BBED3', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
        👩‍⚕️ आशा कार्यकर्ता — सुनीता देवी
      </p>
      <div style={{
        maxWidth: 390, width: '100%',
        background: '#fff', borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minHeight: 600, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: '#5BBED3', padding: '20px 20px 16px' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#fff' }}>आज के कार्य</h2>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>5</p>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>विजिट</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fef08a' }}>2</p>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>उच्च जोखिम</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: riskCount > 0 ? '#fca5a5' : '#fff' }}>{riskCount}</p>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.8)' }}>दवा अनुपालन</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 16px 20px' }}>
          <AshaNotification message={ashaNotification} />
          {renderBody()}
        </div>
      </div>
    </div>
  );
}
