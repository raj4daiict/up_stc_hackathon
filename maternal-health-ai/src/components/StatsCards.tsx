import React, { useMemo } from 'react';
import type { Mother, Task, AICallRecord, Hospital, Ambulance } from '../types';

interface StatsCardsProps {
  mothers: Mother[];
  tasks: Task[];
  calls: AICallRecord[];
  hospitals: Hospital[];
  ambulances: Ambulance[];
}

/**
 * David McCandless–style hero stats:
 * - Big bold number tells the story
 * - Contextual subtitle gives meaning
 * - Color encodes risk/status, not decoration
 * - Progress rings for rates/percentages
 */
export const StatsCards: React.FC<StatsCardsProps> = ({ mothers, tasks, calls, hospitals, ambulances }) => {
  const stats = useMemo(() => {
    const total = mothers.length;
    const hrp = mothers.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical').length;
    const critical = mothers.filter(m => m.riskLevel === 'critical').length;
    const t3 = mothers.filter(m => m.trimester === 3).length;
    const ancCovered = mothers.filter(m => {
      const last = new Date(m.lastCheckup);
      const now = new Date();
      const diffDays = (now.getTime() - last.getTime()) / 86400000;
      return diffDays < 30;
    }).length;
    const ancRate = total > 0 ? Math.round((ancCovered / total) * 100) : 0;
    const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    const escalations = tasks.filter(t => t.status === 'escalated' || t.escalationLevel > 0).length;
    const callsCompleted = calls.filter(c => c.status === 'completed').length;
    const callsNoAnswer = calls.filter(c => c.status === 'no_answer').length;
    const callReachRate = calls.length > 0 ? Math.round((callsCompleted / calls.length) * 100) : 0;
    const totalBeds = hospitals.reduce((s, h) => s + h.totalBeds, 0);
    const availBeds = hospitals.reduce((s, h) => s + h.availableBeds, 0);
    const bedOccupancy = totalBeds > 0 ? Math.round(((totalBeds - availBeds) / totalBeds) * 100) : 0;
    const ambReady = ambulances.filter(a => a.status === 'available').length;
    const noSmartphone = mothers.filter(m => !m.hasSmartphone).length;

    return { total, hrp, critical, t3, ancRate, activeTasks, completedTasks, taskCompletionRate, escalations, callsCompleted, callsNoAnswer, callReachRate, availBeds, totalBeds, bedOccupancy, ambReady, noSmartphone };
  }, [mothers, tasks, calls, hospitals, ambulances]);

  // Progress ring SVG
  const Ring = ({ pct, color, size = 44, stroke = 4 }: { pct: number; color: string; size?: number; stroke?: number }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={11} fontWeight={700} style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
          {pct}%
        </text>
      </svg>
    );
  };

  return (
    <div style={{ padding: '16px 24px 8px' }}>
      {/* Row 1: Hero numbers — the story at a glance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 12 }}>
        {/* Total Pregnancies */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
          borderRadius: 14, padding: '20px 20px 16px', border: '1px solid rgba(59,130,246,0.15)',
        }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#3b82f6', lineHeight: 1, letterSpacing: -1 }}>
            {stats.total.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>Registered Pregnancies</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
            {stats.noSmartphone} without smartphone · AI calls active
          </div>
        </div>

        {/* HRP Cases — the critical metric */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.05))',
          borderRadius: 14, padding: '20px 20px 16px', border: '1px solid rgba(249,115,22,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#f97316', lineHeight: 1, letterSpacing: -1 }}>
              {stats.hrp}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>
              {stats.critical} critical
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>High-Risk Pregnancies</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
            {stats.total > 0 ? Math.round((stats.hrp / stats.total) * 100) : 0}% of total · Enhanced monitoring active
          </div>
        </div>

        {/* Delivery Window — T3 mothers approaching EDD */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(236,72,153,0.02))',
          borderRadius: 14, padding: '20px 20px 16px', border: '1px solid rgba(236,72,153,0.15)',
        }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#ec4899', lineHeight: 1, letterSpacing: -1 }}>
            {stats.t3}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>In Delivery Window (T3)</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
            30-day pre-delivery alerts active
          </div>
        </div>

        {/* AI Engagement */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(6,182,212,0.02))',
          borderRadius: 14, padding: '20px 20px 16px', border: '1px solid rgba(6,182,212,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#06b6d4', lineHeight: 1, letterSpacing: -1 }}>
              {stats.callsCompleted}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
              /{calls.length}
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>AI Calls Completed</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
            {stats.callsNoAnswer} unreachable · Auto-retry scheduled
          </div>
        </div>

        {/* Escalations */}
        <div style={{
          background: stats.escalations > 0
            ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.03))'
            : 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
          borderRadius: 14, padding: '20px 20px 16px',
          border: `1px solid ${stats.escalations > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.15)'}`,
        }}>
          <div style={{
            fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: -1,
            color: stats.escalations > 0 ? '#ef4444' : '#10b981',
          }}>
            {stats.escalations}
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>Active Escalations</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 6 }}>
            {stats.escalations > 0 ? 'Requires leadership attention' : 'All cases within SLA'}
          </div>
        </div>
      </div>

      {/* Row 2: Rate indicators with progress rings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          {
            label: 'ANC Coverage', pct: stats.ancRate,
            color: stats.ancRate >= 80 ? '#10b981' : stats.ancRate >= 60 ? '#f59e0b' : '#ef4444',
            sub: 'Checkup within 30 days',
            target: 'Target: 100%',
          },
          {
            label: 'Task Completion', pct: stats.taskCompletionRate,
            color: stats.taskCompletionRate >= 80 ? '#10b981' : stats.taskCompletionRate >= 50 ? '#f59e0b' : '#ef4444',
            sub: `${stats.completedTasks} of ${tasks.length} tasks`,
            target: `${stats.activeTasks} active`,
          },
          {
            label: 'Call Reach Rate', pct: stats.callReachRate,
            color: stats.callReachRate >= 70 ? '#10b981' : stats.callReachRate >= 40 ? '#f59e0b' : '#ef4444',
            sub: 'Amazon Connect outbound',
            target: 'TN benchmark: 43%',
          },
          {
            label: 'Bed Occupancy', pct: stats.bedOccupancy,
            color: stats.bedOccupancy <= 60 ? '#10b981' : stats.bedOccupancy <= 80 ? '#f59e0b' : '#ef4444',
            sub: `${stats.availBeds} of ${stats.totalBeds} available`,
            target: `${stats.ambReady} ambulances ready`,
          },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--bg-card)', borderRadius: 12, padding: '14px 16px',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <Ring pct={item.pct} color={item.color} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{item.label}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.sub}</div>
              <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>{item.target}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
