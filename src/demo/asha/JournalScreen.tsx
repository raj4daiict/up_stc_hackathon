import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';
import type { JournalEntry } from '../demoTypes';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { VoiceMicButton } from '../../components/VoiceMicButton';

const QUICK_TAGS = ['वजन बढ़ा', 'भूख कम', 'BP जांच आवश्यक'];

export function hasJournalForVisit(journals: JournalEntry[], patientId: string): boolean {
  return journals.some(j => j.patientId === patientId);
}

interface Props {
  patientName: string;
  patientId: string;
  onClose: () => void;
  fromMedicationCheck?: boolean;
}

export function JournalScreen({ patientName, patientId, onClose, fromMedicationCheck }: Props) {
  const { state, dispatch } = useDemoContext();
  const { journals } = state;

  const [tags, setTags] = useState<string[]>(fromMedicationCheck ? ['दवा जांच की गई'] : []);
  const [note, setNote] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [visitDone, setVisitDone] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { voiceState, toggle } = useVoiceRecorder((transcript) => {
    setNote(prev => prev ? `${prev} ${transcript}` : transcript);
  });

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSaveJournal = () => {
    if (tags.length === 0 && note.trim() === '') {
      setValidationError('कृपया कम से कम एक टैग या नोट जोड़ें');
      return;
    }
    setValidationError(null);
    dispatch({
      type: 'ASHA_SUBMIT_JOURNAL',
      payload: { patientId, tags, note, timestamp: new Date().toISOString(), actorType: 'ASHA' },
    });
    setJournalSaved(true);
  };

  const gateOpen = hasJournalForVisit(journals, patientId) || journalSaved;

  if (visitDone) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>विजिट पूर्ण हुई!</p>
        <p style={{ fontSize: 11, color: '#6b7280', margin: '4px 0 12px' }}>जर्नल सहेजा गया</p>
        <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#5BBED3', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          वापस जाएं
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>←</button>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>{patientName} — विजिट जर्नल</p>
      </div>

      <VoiceMicButton voiceState={voiceState} onToggle={toggle} variant="block" />

      <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', margin: '12px 0 8px' }}>त्वरित टैग</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {QUICK_TAGS.map(tag => (
          <button key={tag} onClick={() => toggleTag(tag)} style={{
            padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
            background: tags.includes(tag) ? '#5BBED3' : '#e5e7eb',
            color: tags.includes(tag) ? 'white' : '#374151',
          }}>{tag}</button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="नोट लिखें..."
        rows={3}
        style={{
          width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db',
          fontSize: 12, color: '#374151', resize: 'vertical', boxSizing: 'border-box', marginBottom: 8,
        }}
      />

      {validationError && <p style={{ fontSize: 11, color: '#ef4444', margin: '0 0 8px' }}>{validationError}</p>}
      {journalSaved && <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600, margin: '0 0 8px' }}>जर्नल सहेजा गया ✓</p>}

      <button onClick={handleSaveJournal} style={{
        width: '100%', padding: '12px', borderRadius: 10, border: 'none',
        background: '#5BBED3', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 10,
      }}>
        जर्नल सहेजें
      </button>

      {!gateOpen && (
        <p style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, margin: '0 0 6px' }}>
          यात्रा पूरी करने से पहले जर्नल प्रविष्टि आवश्यक है
        </p>
      )}

      <button onClick={() => { if (gateOpen) setVisitDone(true); }} disabled={!gateOpen} style={{
        width: '100%', padding: '12px', borderRadius: 10, border: 'none',
        background: '#1a3d44', color: 'white', fontSize: 14, fontWeight: 700,
        cursor: gateOpen ? 'pointer' : 'not-allowed', opacity: gateOpen ? 1 : 0.5,
      }}>
        विजिट पूर्ण करें
      </button>
    </div>
  );
}
