import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';

const PATIENT_NAME_MAP: Record<string, string> = {
  'seema-devi': 'सीमा देवी',
  'rani-yadav': 'रानी यादव',
  'priya-devi': 'प्रिया देवी',
};

export function ClinicianJournalViewer() {
  const { state } = useDemoContext();
  const { journals } = state;
  const [selectedFilter, setSelectedFilter] = useState('All');

  const distinctActorTypes = Array.from(new Set(journals.map(j => j.actorType)));
  const filterOptions = ['All', ...distinctActorTypes];

  const filtered = selectedFilter === 'All'
    ? journals
    : journals.filter(j => j.actorType === selectedFilter);

  const sorted = [...filtered].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: 20,
    border: 'none',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 600,
    background: active ? '#5BBED3' : '#e5e7eb',
    color: active ? 'white' : '#374151',
  });

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1a3d44' }}>📋 Field Journal Viewer</p>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#5BBED3', background: '#D7EFF4', padding: '2px 8px', borderRadius: 10 }}>
          {sorted.length} प्रविष्टियाँ
        </span>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {filterOptions.map(opt => (
          <button key={opt} onClick={() => setSelectedFilter(opt)} style={chipStyle(selectedFilter === opt)}>
            {opt}
          </button>
        ))}
      </div>

      {/* Entry list */}
      {journals.length === 0 ? (
        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
          कोई जर्नल प्रविष्टि नहीं
        </p>
      ) : sorted.length === 0 ? (
        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
          इस श्रेणी में कोई प्रविष्टि नहीं
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((entry, idx) => {
            const patientName = PATIENT_NAME_MAP[entry.patientId] ?? entry.patientId;
            const time = new Date(entry.timestamp).toLocaleString('hi-IN', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            });
            return (
              <div key={idx} style={{
                background: '#D7EFF4', borderRadius: 10, padding: '12px 14px',
                border: '1px solid #b2dce8',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44' }}>{patientName}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                    background: '#5BBED3', color: 'white',
                  }}>{entry.actorType}</span>
                </div>
                {entry.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                    {entry.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                        background: 'white', color: '#1a3d44',
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
                {entry.note && (
                  <p style={{ margin: '0 0 4px', fontSize: 12, color: '#374151' }}>{entry.note}</p>
                )}
                <p style={{ margin: 0, fontSize: 10, color: '#6b7280' }}>{time}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
