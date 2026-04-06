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

export function PatientViewPrep() {
  const { state, dispatch } = usePreparednessContext();
  const { step, stakeholders } = state;
  const patientStatus = stakeholders.patient;

  const docItems = ['आधार कार्ड', 'जांच रिपोर्ट', 'पंजीकरण कार्ड'];

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
        👩 मरीज़ — सीमा देवी
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Alert banner */}
        {step >= 1 && (
          <div style={{
            background: '#fee2e2', border: '1px solid #ef4444',
            borderRadius: 8, padding: '10px 12px',
            color: '#991b1b', fontSize: 13, fontWeight: 600,
          }}>
            🔴 आपकी डिलीवरी की तैयारी शुरू करें (30 दिन शेष)
          </div>
        )}

        {/* Hospital card */}
        <div style={{
          background: '#fff', borderRadius: 8, padding: '10px 12px',
          border: '1px solid #b8dce6', fontSize: 13,
        }}>
          🏥 CHC Raebareli · 12 km
        </div>

        {/* Document checklist */}
        {step >= 4 && (
          <div style={{
            background: '#fff', borderRadius: 8, padding: '10px 12px',
            border: '1px solid #b8dce6',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', marginBottom: 8 }}>
              📄 दस्तावेज़ चेकलिस्ट
            </div>
            {docItems.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 4 }}>
                <input type="checkbox" checked readOnly style={{ accentColor: '#10b981' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Transport card */}
        <div style={{
          background: '#fff', borderRadius: 8, padding: '10px 12px',
          border: '1px solid #b8dce6', fontSize: 13,
        }}>
          🚑 एम्बुलेंस पहले से जोड़ी गई
        </div>

        {/* Status indicator */}
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: statusColor(patientStatus),
        }}>
          {statusLabel(patientStatus)}
        </div>

        {/* CTA button */}
        <button
          onClick={() => dispatch({ type: 'CONFIRM_STAKEHOLDER', payload: 'patient' })}
          style={{
            background: '#5BBED3', color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 0', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', width: '100%',
          }}
        >
          मैं तैयार हूँ
        </button>
      </div>
    </div>
  );
}
