import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { VoiceMicButton } from '../../components/VoiceMicButton';

export function WeightEntryForm() {
  const { dispatch } = useDemoContext();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { voiceState, toggle } = useVoiceRecorder((transcript) => {
    // Extract first number found in transcript
    const match = transcript.match(/\d+(\.\d+)?/);
    if (match) setValue(match[0]);
  });

  const handleSubmit = () => {
    const num = parseFloat(value);
    if (!value || isNaN(num) || num <= 0) {
      setError('कृपया सही वजन दर्ज करें');
      return;
    }
    setError('');
    dispatch({ type: 'LOG_WEIGHT', payload: num });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>वजन सफलतापूर्वक दर्ज किया गया!</p>
        <p style={{ fontSize: 12, color: '#6b7280' }}>{value} किलोग्राम</p>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#1a3d44', margin: '0 0 10px' }}>वजन दर्ज करें</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="किलोग्राम में"
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 10, fontSize: 18, fontWeight: 700,
            border: `2px solid ${error ? '#ef4444' : '#5BBED3'}`, outline: 'none',
            textAlign: 'center',
          }}
        />
        <VoiceMicButton voiceState={voiceState} onToggle={toggle} variant="inline" />
      </div>
      {error && <p style={{ fontSize: 11, color: '#ef4444', margin: '0 0 8px' }}>{error}</p>}
      <button
        onClick={handleSubmit}
        style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none',
          background: '#5BBED3', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}
      >
        जमा करें
      </button>
    </div>
  );
}
