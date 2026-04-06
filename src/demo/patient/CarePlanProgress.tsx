import React from 'react';
import type { CarePlanTask } from '../demoTypes';

interface Props {
  tasks: CarePlanTask[];
  week: number;
}

export function CarePlanProgress({ tasks, week }: Props) {
  const total = 40;
  const pct = Math.round((week / total) * 100);
  const trimester = week <= 12 ? '1' : week <= 28 ? '2' : '3';

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#5BBED3', fontWeight: 600 }}>तिमाही {trimester}</span>
          <span style={{ fontSize: 11, color: '#6b7280' }}>{week}/40 सप्ताह</span>
        </div>
        <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#5BBED3', borderRadius: 4, transition: 'width 0.5s' }} />
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', margin: '0 0 8px' }}>आज का कार्य</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {tasks.map(task => (
          <div key={task.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: task.aiAdded ? '#fef3c7' : '#D7EFF4',
            border: task.aiAdded ? '1px solid #f59e0b' : '1px solid #b8dce6',
          }}>
            <span style={{ fontSize: 16 }}>{task.status === 'completed' ? '✅' : task.aiAdded ? '🤖' : '📋'}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a3d44', flex: 1 }}>{task.label}</span>
            {task.aiAdded && <span style={{ fontSize: 9, color: '#d97706', fontWeight: 700 }}>AI</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
