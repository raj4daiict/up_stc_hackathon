import React from 'react';
import { usePreparednessContext } from '../PreparednessContext';
import type { ReadinessStatus, StakeholderKey } from '../preparednessTypes';

function statusColor(status: ReadinessStatus): string {
  if (status === 'ready') return '#10b981';
  if (status === 'escalated') return '#ef4444';
  return '#f59e0b';
}

function statusIcon(status: ReadinessStatus): string {
  if (status === 'ready') return '✔';
  if (status === 'escalated') return '🔴';
  return '⏳';
}

const STAKEHOLDER_LABELS: Record<StakeholderKey, string> = {
  patient:    'Patient (Seema Devi)',
  family:     'Family',
  asha:       'ASHA (Sunita Devi)',
  hospital:   'Hospital (CHC Raebareli)',
  transport:  'Transport',
  doctor:     'Doctor (Dr. Priya Sharma)',
  supervisor: 'District Supervisor',
};

const STAKEHOLDER_ORDER: StakeholderKey[] = [
  'patient', 'family', 'asha', 'hospital', 'transport', 'doctor', 'supervisor',
];

export function DoctorViewPrep() {
  const { state } = usePreparednessContext();
  const { step, stakeholders, supervisorNotified, escalationResolved, edd } = state;

  const allReady = STAKEHOLDER_ORDER.every(k => stakeholders[k] === 'ready');
  const nonReadyStakeholders = STAKEHOLDER_ORDER.filter(k => stakeholders[k] !== 'ready');

  const patientStatus = stakeholders.patient;
  const hospitalStatus = stakeholders.hospital;

  const patientStatusBadge = () => {
    if (allReady) return { label: 'Delivery Ready', bg: '#d1fae5', color: '#065f46' };
    if (hospitalStatus === 'escalated') return { label: 'Escalated', bg: '#fee2e2', color: '#991b1b' };
    return { label: 'In Progress', bg: '#fef3c7', color: '#92400e' };
  };

  const badge = patientStatusBadge();

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
        👨‍⚕️ Doctor — Dr. Priya Sharma · HRP Preparedness Dashboard
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* 1. HRP Preparedness Panel */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3d44', marginBottom: 10 }}>
            HRP Preparedness Panel
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                {['Patient', 'EDD', 'Status', 'Hospital', 'Alerts'].map(col => (
                  <th key={col} style={{
                    padding: '8px 10px', textAlign: 'left',
                    fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>सीमा देवी</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>05 May 2026</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                    background: badge.bg, color: badge.color,
                  }}>
                    {badge.label}
                  </span>
                </td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>CHC Raebareli</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>
                  {hospitalStatus === 'escalated' && (
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>⚠ SLA Missed</span>
                  )}
                  {hospitalStatus !== 'escalated' && '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Stakeholder Acknowledgment Matrix */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3d44', marginBottom: 10 }}>
            Stakeholder Acknowledgment Matrix
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
            {STAKEHOLDER_ORDER.map((key, i) => {
              const status = stakeholders[key];
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 14px',
                  background: i % 2 === 0 ? '#fff' : '#f9fafb',
                  borderBottom: i < STAKEHOLDER_ORDER.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}>
                  <span style={{ fontSize: 12, color: '#374151' }}>{STAKEHOLDER_LABELS[key]}</span>
                  <span style={{ fontSize: 14, color: statusColor(status), fontWeight: 700 }}>
                    {statusIcon(status)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. AI Resource Panel */}
        {step >= 3 && (
          <div style={{
            background: '#f0f9ff', border: '1px solid #bae6fd',
            borderRadius: 8, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0c4a6e', marginBottom: 10 }}>
              🧠 AI Insight: Bed availability confirmed at CHC Raebareli for delivery window
            </div>
            <div style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>
              🏥 Hospital: CHC Raebareli 12km &nbsp;|&nbsp; Backup: PHC Dalmau 18km &nbsp;|&nbsp; Route: NH-30 via Raebareli bypass
            </div>
            <div style={{ marginTop: 10 }}>
              {allReady ? (
                <div style={{ fontSize: 12, color: '#065f46', fontWeight: 600 }}>
                  ✅ All resources confirmed — patient is delivery ready
                </div>
              ) : (
                nonReadyStakeholders.map(key => (
                  <div key={key} style={{ fontSize: 12, color: '#92400e', marginBottom: 2 }}>
                    ⚠ Gap: {STAKEHOLDER_LABELS[key]} not confirmed
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. Escalation alert */}
        {hospitalStatus === 'escalated' && (
          <div style={{
            background: '#fee2e2', border: '1px solid #ef4444',
            borderRadius: 8, padding: '12px 16px',
            color: '#991b1b', fontSize: 13, fontWeight: 600,
          }}>
            🔴 Hospital readiness not confirmed — Escalated to District Supervisor
          </div>
        )}

        {/* 5. Resolution */}
        {escalationResolved && (
          <div style={{
            background: '#d1fae5', border: '1px solid #10b981',
            borderRadius: 8, padding: '12px 16px',
            color: '#065f46', fontSize: 13, fontWeight: 600,
          }}>
            ✅ Hospital confirmed after escalation
          </div>
        )}

        {/* 6. Final */}
        {allReady && (
          <div style={{
            background: '#d1fae5', border: '1px solid #10b981',
            borderRadius: 8, padding: '12px 16px',
            color: '#065f46', fontSize: 14, fontWeight: 700, textAlign: 'center',
          }}>
            ✅ सभी तैयार — डिलीवरी के लिए तैयार
          </div>
        )}
      </div>
    </div>
  );
}
