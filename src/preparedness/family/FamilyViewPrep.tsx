import React from 'react';
import { usePreparednessContext } from '../PreparednessContext';
import type { ReadinessStatus } from '../preparednessTypes';

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

export function FamilyViewPrep() {
  const { state, dispatch } = usePreparednessContext();
  const { step, stakeholders } = state;
  const familyStatus = stakeholders.family;

  const checklistItems = ['अस्पताल तय करें', 'दस्तावेज़ तैयार रखें', 'एम्बुलेंस नंबर सेव करें'];

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
        👨‍👩‍👧 परिवार — सीमा देवी
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Checklist */}
        {step >= 4 && (
          <div style={{
            background: '#fff', borderRadius: 8, padding: '10px 12px',
            border: '1px solid #b8dce6',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', marginBottom: 8 }}>
              📋 डिलीवरी तैयारी चेकलिस्ट
            </div>
            {checklistItems.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 4 }}>
                <input type="checkbox" checked readOnly style={{ accentColor: '#10b981' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Status indicator */}
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: statusColor(familyStatus),
        }}>
          {statusLabel(familyStatus)}
        </div>

        {/* CTA button */}
        <button
          onClick={() => dispatch({ type: 'CONFIRM_STAKEHOLDER', payload: 'family' })}
          style={{
            background: '#5BBED3', color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 0', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', width: '100%',
          }}
        >
          तैयारी पूरी की पुष्टि करें
        </button>
      </div>
    </div>
  );
}
