import React from 'react';
import { Phone, PhoneCall, PhoneMissed, Clock, MessageSquare } from 'lucide-react';
import type { AICallRecord } from '../types';

interface AICallCenterProps {
  calls: AICallRecord[];
  onOpenProfile?: (motherId: string) => void;
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  scheduled: { icon: Clock, color: '#f59e0b', label: 'Scheduled' },
  in_progress: { icon: PhoneCall, color: '#3b82f6', label: 'In Progress' },
  completed: { icon: Phone, color: '#10b981', label: 'Completed' },
  no_answer: { icon: PhoneMissed, color: '#ef4444', label: 'No Answer' },
  rescheduled: { icon: Clock, color: '#8b5cf6', label: 'Rescheduled' },
};

const SENTIMENT_CONFIG: Record<string, { color: string; emoji: string }> = {
  positive: { color: '#10b981', emoji: '😊' },
  neutral: { color: '#94a3b8', emoji: '😐' },
  concerned: { color: '#f59e0b', emoji: '😟' },
  distressed: { color: '#ef4444', emoji: '😰' },
};

export const AICallCenter: React.FC<AICallCenterProps> = ({ calls, onOpenProfile }) => {
  const displayCalls = [...calls].reverse().slice(0, 20);
  const completed = calls.filter(c => c.status === 'completed').length;
  const noAnswer = calls.filter(c => c.status === 'no_answer').length;
  const scheduled = calls.filter(c => c.status === 'scheduled').length;

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Phone size={16} color="#06b6d4" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>AI Call Center</span>
          <span style={{ fontSize: 9, color: '#06b6d4', marginLeft: 4, fontWeight: 500 }}>Amazon Connect</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600 }}>
            ✓ {completed} completed
          </span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 600 }}>
            ✗ {noAnswer} missed
          </span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 600 }}>
            ◷ {scheduled} queued
          </span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
        {displayCalls.map((call, idx) => {
          const statusCfg = STATUS_CONFIG[call.status] || STATUS_CONFIG.scheduled;
          const StatusIcon = statusCfg.icon;
          const sentimentCfg = call.sentiment ? SENTIMENT_CONFIG[call.sentiment] : null;
          return (
            <div key={call.id} className={idx === 0 ? 'animate-slide-in' : ''} style={{
              padding: '8px 10px', marginBottom: 6, borderRadius: 8,
              background: call.sentiment === 'distressed' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${call.sentiment === 'distressed' ? 'rgba(239,68,68,0.15)' : 'transparent'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <StatusIcon size={14} color={statusCfg.color} />
                <span
                  onClick={() => onOpenProfile?.(call.motherId)}
                  style={{ fontSize: 11, fontWeight: 600, color: '#3b82f6', flex: 1, cursor: onOpenProfile ? 'pointer' : 'default', textDecoration: onOpenProfile ? 'underline' : 'none', textDecorationColor: 'rgba(59,130,246,0.3)', textUnderlineOffset: 2 }}
                >
                  {call.motherName}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                  background: `${statusCfg.color}15`, color: statusCfg.color,
                }}>
                  {statusCfg.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, color: '#64748b' }}>
                <span>📞 {call.callType.replace(/_/g, ' ')}</span>
                <span>🗣️ {call.language}</span>
                {call.duration && <span>⏱️ {Math.floor(call.duration / 60)}m {call.duration % 60}s</span>}
                {sentimentCfg && (
                  <span style={{ color: sentimentCfg.color }}>
                    {sentimentCfg.emoji} {call.sentiment}
                  </span>
                )}
              </div>
              {call.summary && (
                <div style={{
                  marginTop: 4, padding: '4px 8px', borderRadius: 4,
                  background: 'rgba(6,182,212,0.06)', borderLeft: '2px solid rgba(6,182,212,0.3)',
                  fontSize: 10, color: '#94a3b8', lineHeight: 1.4,
                }}>
                  <MessageSquare size={8} style={{ marginRight: 4, verticalAlign: 'middle' }} color="#06b6d4" />
                  {call.summary}
                </div>
              )}
            </div>
          );
        })}
        {calls.length === 0 && (
          <div style={{ textAlign: 'center', padding: 30, color: '#64748b', fontSize: 11 }}>
            AI calls will appear here during simulation
          </div>
        )}
      </div>
    </div>
  );
};
