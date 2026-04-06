import React from 'react';
import { usePreparednessContext } from '../PreparednessContext';

export function FacilityView() {
  const { state } = usePreparednessContext();
  const { step, stakeholders } = state;
  const hospitalStatus = stakeholders.hospital;

  const getStatusBadge = () => {
    if (step < 7) {
      return { label: '⏳ Pending', bg: '#fef3c7', color: '#92400e', border: '#f59e0b' };
    }
    if (step >= 7 && step < 10) {
      return { label: '🔴 Overdue — SLA Missed', bg: '#fee2e2', color: '#991b1b', border: '#ef4444' };
    }
    return { label: '✅ Acknowledged', bg: '#d1fae5', color: '#065f46', border: '#10b981' };
  };

  const badge = getStatusBadge();

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
        🏥 Facility / ANM — CHC Raebareli
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* HRP patient list */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3d44', marginBottom: 10 }}>
            HRP Patient List
          </div>
          <div style={{
            border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              background: '#f3f4f6', padding: '8px 14px',
              fontSize: 11, fontWeight: 700, color: '#374151',
              borderBottom: '1px solid #e5e7eb',
            }}>
              <span>Patient</span>
              <span>EDD</span>
              <span>Status</span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              padding: '10px 14px', fontSize: 12, alignItems: 'center',
            }}>
              <span>सीमा देवी</span>
              <span>05 May 2026</span>
              <span style={{
                padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                background: badge.bg, color: badge.color,
                border: `1px solid ${badge.border}`,
                display: 'inline-block',
              }}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* SLA */}
        <div style={{
          background: '#fef3c7', border: '1px solid #f59e0b',
          borderRadius: 8, padding: '10px 14px',
          fontSize: 13, color: '#92400e', fontWeight: 600,
        }}>
          ⏰ SLA: 24 घंटे में पुष्टि करें
        </div>

        {/* Hospital status detail */}
        <div style={{
          background: badge.bg, border: `1px solid ${badge.border}`,
          borderRadius: 8, padding: '10px 14px',
          fontSize: 13, color: badge.color, fontWeight: 600,
        }}>
          Hospital Acknowledgment: {badge.label}
        </div>
      </div>
    </div>
  );
}
