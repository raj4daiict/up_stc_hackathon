import React from 'react';
import {
  User, MapPin, Phone, Calendar, Droplets, Activity,
  Weight, Baby, Smartphone, PhoneOff, Shield, AlertTriangle
} from 'lucide-react';
import type { Mother, Task, TimelineEvent } from '../types';

const RISK_COLORS: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

interface MotherDetailProps {
  mother: Mother | null;
  tasks: Task[];
  events: TimelineEvent[];
}

export const MotherDetail: React.FC<MotherDetailProps> = ({ mother, tasks, events }) => {
  if (!mother) {
    return (
      <div style={{
        background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
        color: 'var(--text-muted)', fontSize: 12,
      }}>
        Select a beneficiary to view details
      </div>
    );
  }

  const motherTasks = tasks.filter(t => t.motherId === mother.id).slice(-5);
  const motherEvents = events.filter(e => e.motherId === mother.id).slice(-5);
  const riskColor = RISK_COLORS[mother.riskLevel];

  const InfoRow = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <Icon size={12} color={color || '#64748b'} />
      <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 80 }}>{label}</span>
      <span style={{ fontSize: 11, color: color || 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px', borderBottom: '1px solid var(--border)',
        background: `linear-gradient(135deg, ${riskColor}08, transparent)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `${riskColor}15`, border: `2px solid ${riskColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: riskColor,
          }}>
            {mother.name.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{mother.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{mother.id}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '1px 8px', borderRadius: 10,
                background: `${riskColor}20`, color: riskColor, textTransform: 'uppercase',
              }}>
                {mother.riskLevel} RISK
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', flex: 1 }}>
        {/* Vitals */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Patient Information
          </div>
          <InfoRow icon={User} label="Age" value={`${mother.age} years`} />
          <InfoRow icon={MapPin} label="Location" value={`${mother.village}, ${mother.block}`} />
          <InfoRow icon={Phone} label="Phone" value={mother.phone || 'Not available'} />
          <InfoRow icon={mother.hasSmartphone ? Smartphone : PhoneOff} label="Device" value={mother.hasSmartphone ? 'Smartphone' : 'Basic phone / No phone'} color={mother.hasSmartphone ? '#10b981' : '#f59e0b'} />
          <InfoRow icon={Baby} label="Gestation" value={`${mother.gestationWeeks} weeks (T${mother.trimester})`} />
          <InfoRow icon={Calendar} label="EDD" value={mother.expectedDeliveryDate} />
          <InfoRow icon={Droplets} label="Hemoglobin" value={`${mother.hemoglobin} g/dL`} color={mother.hemoglobin < 7 ? '#ef4444' : mother.hemoglobin < 10 ? '#f59e0b' : '#10b981'} />
          <InfoRow icon={Activity} label="Blood Pressure" value={mother.bloodPressure} />
          <InfoRow icon={Weight} label="Weight" value={`${mother.weight} kg`} />
          <InfoRow icon={Droplets} label="Blood Group" value={mother.bloodGroup} />
          <InfoRow icon={Shield} label="ASHA" value={mother.assignedAsha} />
          <InfoRow icon={Shield} label="ANM" value={mother.assignedAnm} />
        </div>

        {/* Risk Factors */}
        {mother.riskFactors.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              Risk Factors
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {mother.riskFactors.map((rf, i) => (
                <span key={i} style={{
                  fontSize: 9, padding: '2px 8px', borderRadius: 4,
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 500,
                  border: '1px solid rgba(239,68,68,0.2)',
                }}>
                  <AlertTriangle size={8} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                  {rf}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        {motherTasks.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              Recent Tasks
            </div>
            {motherTasks.map(t => (
              <div key={t.id} style={{
                padding: '6px 8px', marginBottom: 4, borderRadius: 6,
                background: 'rgba(255,255,255,0.02)', fontSize: 10,
              }}>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.type}</div>
                <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{t.assignedTo} • {t.status}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Events */}
        {motherEvents.length > 0 && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              AI Activity Log
            </div>
            {motherEvents.map(e => (
              <div key={e.id} style={{
                padding: '6px 8px', marginBottom: 4, borderRadius: 6,
                background: 'rgba(6,182,212,0.04)', fontSize: 10,
                borderLeft: '2px solid rgba(6,182,212,0.3)',
              }}>
                <div style={{ color: 'var(--text-primary)' }}>{e.description.slice(0, 80)}...</div>
                <div style={{ color: '#06b6d4', marginTop: 2 }}>🤖 {e.aiAction.slice(0, 80)}...</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
