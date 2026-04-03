import React from 'react';
import { Building2, Truck, Droplets, Baby, Scissors } from 'lucide-react';
import type { Hospital, Ambulance } from '../types';

interface HospitalPanelProps {
  hospitals: Hospital[];
  ambulances: Ambulance[];
}

export const HospitalPanel: React.FC<HospitalPanelProps> = ({ hospitals, ambulances }) => {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Building2 size={16} color="#f59e0b" />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Hospitals & Ambulances</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
          Facility Status
        </div>
        {hospitals.map(h => {
          const occupancy = ((h.totalBeds - h.availableBeds) / h.totalBeds) * 100;
          const barColor = occupancy > 80 ? '#ef4444' : occupancy > 60 ? '#f59e0b' : '#10b981';
          return (
            <div key={h.id} style={{
              padding: '8px 10px', marginBottom: 6, borderRadius: 8,
              background: 'rgba(255,255,255,0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{h.name}</span>
                <span style={{
                  fontSize: 9, padding: '1px 6px', borderRadius: 4,
                  background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
                }}>
                  {h.type}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--bg-secondary)' }}>
                  <div style={{
                    width: `${occupancy}%`, height: '100%', borderRadius: 2,
                    background: barColor, transition: 'width 0.5s',
                  }} />
                </div>
                <span style={{ fontSize: 10, color: barColor, fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
                  {h.availableBeds}/{h.totalBeds} beds
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {h.hasBloodBank && (
                  <span style={{ fontSize: 8, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Droplets size={8} /> Blood Bank
                  </span>
                )}
                {h.hasNICU && (
                  <span style={{ fontSize: 8, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Baby size={8} /> NICU
                  </span>
                )}
                {h.hasOperationTheater && (
                  <span style={{ fontSize: 8, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Scissors size={8} /> OT
                  </span>
                )}
                <span style={{ fontSize: 8, color: 'var(--text-muted)', marginLeft: 'auto' }}>{h.distance} km</span>
              </div>
            </div>
          );
        })}

        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', margin: '12px 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>
          Ambulance Fleet
        </div>
        {ambulances.map(a => {
          const statusColors: Record<string, string> = {
            available: '#10b981', dispatched: '#f59e0b', en_route: '#3b82f6', at_hospital: '#8b5cf6',
          };
          return (
            <div key={a.id} style={{
              padding: '6px 10px', marginBottom: 4, borderRadius: 6,
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Truck size={14} color={statusColors[a.status]} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-primary)' }}>{a.vehicleNumber}</span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 8 }}>{a.currentLocation}</span>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                background: `${statusColors[a.status]}15`, color: statusColors[a.status],
              }}>
                {a.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
