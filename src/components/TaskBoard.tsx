import React from 'react';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import type { Task } from '../types';

const ROLE_COLORS: Record<string, string> = {
  asha: '#10b981',
  anm: '#3b82f6',
  doctor: '#8b5cf6',
  ambulance: '#ec4899',
  ai_callcenter: '#06b6d4',
  district_officer: '#f59e0b',
};

const ROLE_LABELS: Record<string, string> = {
  asha: 'ASHA Worker',
  anm: 'ANM',
  doctor: 'Doctor',
  ambulance: 'Ambulance',
  ai_callcenter: 'AI Call Center',
  district_officer: 'District Officer',
};

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pending: { icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  in_progress: { icon: ClipboardList, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  completed: { icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  escalated: { icon: ArrowUpCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  overdue: { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

interface TaskBoardProps {
  tasks: Task[];
  onOpenProfile?: (motherId: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onOpenProfile }) => {
  const displayTasks = [...tasks].reverse().slice(0, 30);

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClipboardList size={16} color="#8b5cf6" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Task Assignments</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['pending', 'completed', 'escalated'].map(status => {
            const count = tasks.filter(t => t.status === status).length;
            const cfg = STATUS_CONFIG[status];
            return (
              <span key={status} style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                background: cfg.bg, color: cfg.color,
              }}>
                {count} {status}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
        {displayTasks.map((task, idx) => {
          const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
          const StatusIcon = statusCfg.icon;
          const roleColor = ROLE_COLORS[task.assignedRole] || '#94a3b8';
          return (
            <div key={task.id} className={idx === 0 ? 'animate-slide-in' : ''} style={{
              padding: '10px 12px', marginBottom: 6, borderRadius: 8,
              background: task.priority === 'critical' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${task.priority === 'critical' ? 'rgba(239,68,68,0.15)' : 'transparent'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <StatusIcon size={14} color={statusCfg.color} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{task.type}</span>
                {task.motherName && onOpenProfile && (
                  <span
                    onClick={() => onOpenProfile(task.motherId)}
                    style={{ fontSize: 10, color: '#3b82f6', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'rgba(59,130,246,0.3)', textUnderlineOffset: 2 }}
                  >
                    {task.motherName}
                  </span>
                )}
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                  background: task.priority === 'critical' ? 'rgba(239,68,68,0.2)' : task.priority === 'high' ? 'rgba(249,115,22,0.2)' : task.priority === 'medium' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)',
                  color: task.priority === 'critical' ? '#ef4444' : task.priority === 'high' ? '#f97316' : task.priority === 'medium' ? '#f59e0b' : '#10b981',
                }}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 6 }}>
                {task.description.length > 120 ? task.description.slice(0, 120) + '...' : task.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                    background: `${roleColor}15`, color: roleColor,
                  }}>
                    {ROLE_LABELS[task.assignedRole] || task.assignedRole}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{task.assignedTo}</span>
                </div>
                {task.aiGenerated && (
                  <span style={{ fontSize: 9, color: '#06b6d4', fontWeight: 500 }}>🤖 AI Generated</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
