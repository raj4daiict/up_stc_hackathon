import React from 'react';
import { usePreparednessContext } from '../PreparednessContext';

export function SupervisorView() {
  const { state } = usePreparednessContext();
  const { supervisorNotified, escalationResolved, step } = state;

  const notifiedAt = supervisorNotified
    ? new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      fontFamily: 'sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: '#1a3d44', padding: '12px 20px',
        color: '#fff', fontWeight: 700, fontSize: 15,
      }}>
        🏛 District Supervisor — Escalation Dashboard
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* No escalations */}
        {!supervisorNotified && (
          <div style={{
            background: '#d1fae5', border: '1px solid #10b981',
            borderRadius: 8, padding: '14px 16px',
            color: '#065f46', fontSize: 13, fontWeight: 600,
          }}>
            ✅ No active escalations
          </div>
        )}

        {/* Active escalation */}
        {supervisorNotified && !escalationResolved && (
          <div style={{
            border: '2px solid #ef4444', borderRadius: 8, padding: '16px',
            background: '#fff5f5',
          }}>
            <div style={{
              fontSize: 14, fontWeight: 800, color: '#991b1b', marginBottom: 12,
            }}>
              🔴 ESCALATION ALERT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
              <div>
                <span style={{ fontWeight: 600, color: '#374151' }}>Patient: </span>
                <span>सीमा देवी</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#374151' }}>EDD: </span>
                <span>05 May 2026</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#374151' }}>Unconfirmed: </span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>Hospital (CHC Raebareli)</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#374151' }}>SLA breached: </span>
                <span style={{ color: '#ef4444' }}>24 hours</span>
              </div>
              {notifiedAt && (
                <div style={{ color: '#6b7280', fontSize: 11, marginTop: 4 }}>
                  Notified at: {notifiedAt}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resolved */}
        {escalationResolved && (
          <div style={{
            background: '#d1fae5', border: '1px solid #10b981',
            borderRadius: 8, padding: '14px 16px',
            color: '#065f46', fontSize: 13, fontWeight: 600,
          }}>
            ✅ Escalation resolved — Hospital confirmed post-escalation
          </div>
        )}
      </div>
    </div>
  );
}
