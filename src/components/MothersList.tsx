import React, { useState } from 'react';
import { Users, Search, Smartphone, PhoneOff, ExternalLink } from 'lucide-react';
import type { Mother } from '../types';

const RISK_COLORS: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

interface MothersListProps {
  mothers: Mother[];
  selectedMotherId: string | null;
  onSelect: (id: string) => void;
  onOpenProfile?: (id: string) => void;
}

export const MothersList: React.FC<MothersListProps> = ({ mothers, selectedMotherId, onSelect, onOpenProfile }) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filtered = mothers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.village.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'all' || m.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Users size={16} color="#ec4899" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Beneficiaries</span>
          <span style={{ fontSize: 11, color: '#64748b', marginLeft: 'auto' }}>{filtered.length}/{mothers.length}</span>
        </div>
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <Search size={14} color="#64748b" style={{ position: 'absolute', left: 8, top: 7 }} />
          <input
            type="text" placeholder="Search name, village, ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '6px 8px 6px 28px', borderRadius: 6,
              border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9',
              fontSize: 11, outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['all', 'critical', 'high', 'medium', 'low'].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)} style={{
              padding: '2px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600,
              background: riskFilter === r ? (r === 'all' ? '#3b82f6' : RISK_COLORS[r]) : 'rgba(255,255,255,0.05)',
              color: riskFilter === r ? 'white' : '#94a3b8',
            }}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '4px 8px' }}>
        {filtered.map(m => (
          <div key={m.id} onClick={() => onSelect(m.id)} style={{
            padding: '8px 10px', marginBottom: 4, borderRadius: 8, cursor: 'pointer',
            background: selectedMotherId === m.id ? 'rgba(59,130,246,0.1)' : 'transparent',
            border: `1px solid ${selectedMotherId === m.id ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: `${RISK_COLORS[m.riskLevel]}15`,
                border: `2px solid ${RISK_COLORS[m.riskLevel]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: RISK_COLORS[m.riskLevel],
              }}>
                {m.name.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#e2e8f0' }}>{m.name}</span>
                  {m.hasSmartphone ? <Smartphone size={10} color="#64748b" /> : <PhoneOff size={10} color="#f59e0b" />}
                </div>
                <div style={{ fontSize: 9, color: '#64748b' }}>
                  {m.village} • {m.gestationWeeks}w • {m.age}y
                </div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: RISK_COLORS[m.riskLevel],
              }} />
              {onOpenProfile && (
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenProfile(m.id); }}
                  title="View full profile"
                  style={{
                    width: 22, height: 22, borderRadius: 4, border: 'none', cursor: 'pointer',
                    background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, opacity: 0.6, transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                >
                  <ExternalLink size={10} color="#3b82f6" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
