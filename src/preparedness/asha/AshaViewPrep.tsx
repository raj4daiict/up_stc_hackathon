import React, { useState } from 'react';
import { usePreparednessContext } from '../PreparednessContext';
import type { ReadinessStatus } from '../preparednessTypes';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { VoiceMicButton } from '../../components/VoiceMicButton';

function statusColor(status: ReadinessStatus): string {
  if (status === 'ready') return '#10b981';
  if (status === 'escalated') return '#ef4444';
  return '#f59e0b';
}

function statusLabel(status: ReadinessStatus): string {
  if (status === 'ready') return '🟢 तैयार';
  if (status === 'escalated') return '🔴 तुरंत ध्यान दें';
  return '🟡 लंबित';
}

export function AshaViewPrep() {
  const { state, dispatch } = usePreparednessContext();
  const { step, stakeholders, ashaChecklist, journals } = state;
  const ashaStatus = stakeholders.asha;

  // Local checkbox state — initialized from context (auto-checked at step >= 5)
  const [localChecklist, setLocalChecklist] = useState<Record<string, boolean>>(ashaChecklist);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [journalText, setJournalText] = useState('');
  const [journalSubmitted, setJournalSubmitted] = useState(false);

  // Sync when hero flow auto-checks all items at step >= 5
  React.useEffect(() => {
    setLocalChecklist(ashaChecklist);
  }, [ashaChecklist]);

  const toggleItem = (item: string) => {
    setLocalChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const { voiceState, toggle: toggleVoice } = useVoiceRecorder((transcript) => {
    setJournalText(prev => prev ? `${prev} ${transcript}` : transcript);
  });

  const handleJournalSubmit = () => {
    if (!journalText.trim()) return;
    const entry = {
      text: journalText,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'SUBMIT_PREP_JOURNAL', payload: entry });
    dispatch({ type: 'CONFIRM_STAKEHOLDER', payload: 'asha' });
    setJournalSubmitted(true);
  };

  return (
    <div style={{
      maxWidth: 390, background: '#D7EFF4', borderRadius: 12,
      overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      fontFamily: 'sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: '#5BBED3', padding: '12px 16px',
        color: '#fff', fontWeight: 700, fontSize: 15,
      }}>
        👩‍⚕️ आशा — सुनीता देवी
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Task card */}
        {step >= 2 && (
          <div style={{
            background: '#fff', borderRadius: 8, padding: '10px 12px',
            border: '1px solid #b8dce6', fontSize: 13, fontWeight: 600, color: '#1a3d44',
          }}>
            📋 सीमा देवी – तैयारी जांचें
          </div>
        )}

        {/* Preparedness checklist */}
        <div style={{
          background: '#fff', borderRadius: 8, padding: '10px 12px',
          border: '1px solid #b8dce6',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', marginBottom: 8 }}>
            तैयारी चेकलिस्ट
          </div>
          {Object.entries(localChecklist).map(([item, checked]) => (
            <div
              key={item}
              onClick={() => toggleItem(item)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 4, cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(item)}
                style={{ accentColor: '#10b981', cursor: 'pointer' }}
              />
              <span style={{ color: checked ? '#065f46' : '#374151', textDecoration: checked ? 'line-through' : 'none' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Journal screen */}
        {confirmed === true && !journalSubmitted && (
          <div style={{
            background: '#fff', borderRadius: 8, padding: '10px 12px',
            border: '1px solid #b8dce6',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', marginBottom: 8 }}>
              📝 विजिट नोट लिखें
            </div>
            <textarea
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              placeholder="यहाँ नोट लिखें..."
              rows={3}
              style={{
                width: '100%', borderRadius: 6, border: '1px solid #b8dce6',
                padding: '6px 8px', fontSize: 12, resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <VoiceMicButton voiceState={voiceState} onToggle={toggleVoice} variant="block" />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={handleJournalSubmit}
                style={{
                  flex: 2, padding: '6px 0', borderRadius: 6,
                  border: 'none', background: '#5BBED3', color: '#fff',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >
                सबमिट करें
              </button>
            </div>
          </div>
        )}

        {journalSubmitted && (
          <div style={{
            background: '#d1fae5', borderRadius: 8, padding: '10px 12px',
            border: '1px solid #10b981', fontSize: 13, color: '#065f46', fontWeight: 600,
          }}>
            ✅ जर्नल सबमिट हो गया — तैयारी पूरी
          </div>
        )}

        {/* Confirmation prompt */}
        {confirmed === null && (
          <div style={{
            background: '#fff', borderRadius: 8, padding: '10px 12px',
            border: '1px solid #b8dce6',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a3d44', marginBottom: 8 }}>
              तैयारी पूरी है?
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setConfirmed(true)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 6,
                  border: 'none', background: '#10b981', color: '#fff',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                ✔ हाँ
              </button>
              <button
                onClick={() => setConfirmed(false)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 6,
                  border: 'none', background: '#ef4444', color: '#fff',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                ❌ नहीं
              </button>
            </div>
          </div>
        )}

        {confirmed === false && (
          <div style={{
            background: '#fee2e2', borderRadius: 8, padding: '10px 12px',
            border: '1px solid #ef4444', fontSize: 13, color: '#991b1b',
          }}>
            ⚠ तैयारी अधूरी है — कृपया सभी आइटम पूरे करें
          </div>
        )}

        {/* Status indicator */}
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: statusColor(ashaStatus),
        }}>
          {statusLabel(ashaStatus)}
        </div>

        {/* Journal count */}
        {journals.length > 0 && (
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            {journals.length} जर्नल एंट्री
          </div>
        )}
      </div>
    </div>
  );
}
