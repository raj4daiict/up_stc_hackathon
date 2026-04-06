import React from 'react';
import type { JournalEntry } from '../demoTypes';

interface Props { journal: JournalEntry | null; }

export function AshaJournalTimeline({ journal }: Props) {
  if (!journal) return null;
  const time = new Date(journal.timestamp).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px' }}>
      <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>📋 ASHA Journal — सुनीता देवी</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 2, background: '#5BBED3', borderRadius: 2, flexShrink: 0 }} />
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6b7280' }}>आज {time} — सीमा देवी की विजिट</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
            {journal.tags.map(tag => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: '#D7EFF4', color: '#1a3d44' }}>{tag}</span>
            ))}
          </div>
          {journal.note && <p style={{ margin: 0, fontSize: 12, color: '#374151' }}>{journal.note}</p>}
        </div>
      </div>
    </div>
  );
}
