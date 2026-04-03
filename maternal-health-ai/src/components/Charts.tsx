import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import type { Mother, Task, TimelineEvent, AICallRecord } from '../types';

interface ChartsProps {
  mothers: Mother[];
  tasks: Task[];
  events: TimelineEvent[];
  calls: AICallRecord[];
}

/**
 * David McCandless design principles applied:
 * 1. Every chart tells ONE clear story — title IS the insight
 * 2. Color = meaning (risk spectrum, not rainbow)
 * 3. Context & comparison — benchmarks, not just raw numbers
 * 4. Minimal chart junk — no gridlines, no axis clutter
 * 5. Data-ink ratio maximized
 */
export const Charts: React.FC<ChartsProps> = ({ mothers, tasks, events }) => {

  // ── Risk Funnel: How many need attention? ──
  const riskData = useMemo(() => [
    { name: 'Low', value: mothers.filter(m => m.riskLevel === 'low').length, color: '#10b981' },
    { name: 'Medium', value: mothers.filter(m => m.riskLevel === 'medium').length, color: '#f59e0b' },
    { name: 'High', value: mothers.filter(m => m.riskLevel === 'high').length, color: '#f97316' },
    { name: 'Critical', value: mothers.filter(m => m.riskLevel === 'critical').length, color: '#ef4444' },
  ], [mothers]);

  // ── Accountability: Who's carrying the load? ──
  const roleData = useMemo(() => {
    const asha = tasks.filter(t => t.assignedRole === 'asha');
    const anm = tasks.filter(t => t.assignedRole === 'anm');
    const doctor = tasks.filter(t => t.assignedRole === 'doctor');
    const officer = tasks.filter(t => t.assignedRole === 'district_officer');
    return [
      { name: 'ASHA', total: asha.length, done: asha.filter(t => t.status === 'completed').length, pending: asha.filter(t => t.status === 'pending').length },
      { name: 'ANM', total: anm.length, done: anm.filter(t => t.status === 'completed').length, pending: anm.filter(t => t.status === 'pending').length },
      { name: 'Doctor', total: doctor.length, done: doctor.filter(t => t.status === 'completed').length, pending: doctor.filter(t => t.status === 'pending').length },
      { name: 'Officer', total: officer.length, done: officer.filter(t => t.status === 'completed').length, pending: officer.filter(t => t.status === 'pending').length },
    ];
  }, [tasks]);

  // ── Care Continuum: Where are mothers in their journey? ──
  const journeyData = useMemo(() => {
    const t1 = mothers.filter(m => m.trimester === 1);
    const t2 = mothers.filter(m => m.trimester === 2);
    const t3 = mothers.filter(m => m.trimester === 3);
    return [
      { name: 'T1 (1-12w)', total: t1.length, hrp: t1.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical').length },
      { name: 'T2 (13-28w)', total: t2.length, hrp: t2.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical').length },
      { name: 'T3 (29-40w)', total: t3.length, hrp: t3.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical').length },
    ];
  }, [mothers]);

  // ── AI Activity Pulse ──
  const activityPulse = useMemo(() => {
    if (events.length === 0) return [{ time: 'T1', events: 0, alerts: 0, calls: 0 }];
    const bucketSize = Math.max(1, Math.floor(events.length / 10));
    const trend = [];
    for (let i = 0; i < Math.min(10, events.length); i++) {
      const bucket = events.slice(i * bucketSize, (i + 1) * bucketSize);
      trend.push({
        time: `T${i + 1}`,
        events: bucket.length,
        alerts: bucket.filter(e => e.type === 'vitals_alert' || e.type === 'escalation' || e.type === 'missed_appointment').length,
        calls: bucket.filter(e => e.type === 'ai_call_made' || e.type === 'ai_call_followup').length,
      });
    }
    return trend;
  }, [events]);

  const tooltipStyle = {
    contentStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' },
    labelStyle: { color: '#94a3b8', fontWeight: 600 },
    cursor: { fill: 'rgba(255,255,255,0.03)' },
  };

  const ChartCard = ({ title, insight, children }: { title: string; insight: string; children: React.ReactNode }) => (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
      padding: '16px 18px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{insight}</div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );

  const total = mothers.length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, padding: '4px 24px 16px' }}>

      {/* 1. Risk Stratification — Donut with narrative */}
      <ChartCard title="Risk Stratification" insight={`${riskData[2].value + riskData[3].value} of ${total} need enhanced monitoring`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ResponsiveContainer width="50%" height={140}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" innerRadius={32} outerRadius={55} dataKey="value" stroke="none" isAnimationActive={false}>
                {riskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            {riskData.map(d => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 500 }}>{d.name}</span>
                      <span style={{ fontSize: 13, color: d.color, fontWeight: 700 }}>{d.value}</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', marginTop: 3 }}>
                      <div style={{ height: '100%', borderRadius: 2, background: d.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ChartCard>

      {/* 2. Accountability — Stacked bars showing done vs pending */}
      <ChartCard title="Task Accountability by Role" insight="Who's completing vs pending — SLA compliance">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={roleData} barGap={2}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={25} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="done" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} isAnimationActive={false} name="Completed" />
            <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[3, 3, 0, 0]} isAnimationActive={false} name="Pending" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981', display: 'inline-block' }} /> Completed
          </span>
          <span style={{ fontSize: 9, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /> Pending
          </span>
        </div>
      </ChartCard>

      {/* 3. Care Continuum — Trimester journey with HRP overlay */}
      <ChartCard title="Pregnancy Journey & HRP Load" insight="HRP concentration by trimester — T3 needs delivery prep">
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={journeyData} barGap={4}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={25} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="total" fill="rgba(59,130,246,0.3)" radius={[3, 3, 0, 0]} isAnimationActive={false} name="Total" />
            <Bar dataKey="hrp" fill="#ef4444" radius={[3, 3, 0, 0]} isAnimationActive={false} name="High Risk" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(59,130,246,0.5)', display: 'inline-block' }} /> All Mothers
          </span>
          <span style={{ fontSize: 9, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> HRP Cases
          </span>
        </div>
      </ChartCard>

      {/* 4. AI Activity Pulse — Area chart showing AI workload */}
      <ChartCard title="AI Orchestration Pulse" insight="Events, alerts & calls over simulation time">
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={activityPulse}>
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} width={25} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="events" stroke="#3b82f6" fill="rgba(59,130,246,0.08)" strokeWidth={2} isAnimationActive={false} name="Events" />
            <Area type="monotone" dataKey="alerts" stroke="#ef4444" fill="rgba(239,68,68,0.08)" strokeWidth={2} isAnimationActive={false} name="Alerts" />
            <Area type="monotone" dataKey="calls" stroke="#06b6d4" fill="rgba(6,182,212,0.08)" strokeWidth={2} isAnimationActive={false} name="AI Calls" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 4 }}>
          {[
            { label: 'Events', color: '#3b82f6' },
            { label: 'Alerts', color: '#ef4444' },
            { label: 'AI Calls', color: '#06b6d4' },
          ].map(l => (
            <span key={l.label} style={{ fontSize: 9, color: l.color, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 3, borderRadius: 2, background: l.color, display: 'inline-block' }} /> {l.label}
            </span>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};
