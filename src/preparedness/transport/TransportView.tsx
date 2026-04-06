import React from 'react';
import { usePreparednessContext } from '../PreparednessContext';

export function TransportView() {
  const { state } = usePreparednessContext();
  const { step, stakeholders } = state;
  const transportStatus = stakeholders.transport;

  const isConfirmed = step >= 6;

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
        🚑 Transport Desk
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Upcoming deliveries */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3d44', marginBottom: 10 }}>
            Upcoming Deliveries
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
              <span>Transport</span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              padding: '10px 14px', fontSize: 12, alignItems: 'center',
            }}>
              <span>Seema Devi</span>
              <span>2026-05-05</span>
              <span style={{
                padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                background: isConfirmed ? '#d1fae5' : '#fef3c7',
                color: isConfirmed ? '#065f46' : '#92400e',
                border: `1px solid ${isConfirmed ? '#10b981' : '#f59e0b'}`,
                display: 'inline-block',
              }}>
                {isConfirmed ? '✅ Pre-linked & Confirmed' : '⏳ Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Ambulance info */}
        <div style={{
          background: '#f0f9ff', border: '1px solid #bae6fd',
          borderRadius: 8, padding: '12px 14px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0c4a6e', marginBottom: 6 }}>
            🚑 Ambulance Assignment
          </div>
          <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>
            108 Ambulance — UP-32-AB-1234
          </div>
          <div style={{ fontSize: 12, color: '#374151' }}>
            Route: NH-30 via Raebareli bypass
          </div>
        </div>

        {/* Status */}
        <div style={{
          background: isConfirmed ? '#d1fae5' : '#fef3c7',
          border: `1px solid ${isConfirmed ? '#10b981' : '#f59e0b'}`,
          borderRadius: 8, padding: '10px 14px',
          fontSize: 13, fontWeight: 600,
          color: isConfirmed ? '#065f46' : '#92400e',
        }}>
          {isConfirmed ? '✅ Pre-linked & Confirmed' : '⏳ Pending'}
        </div>
      </div>
    </div>
  );
}
