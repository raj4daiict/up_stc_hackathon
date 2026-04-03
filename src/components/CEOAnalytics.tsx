import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle, Phone,
  Heart, Users, ClipboardList, Building2, ArrowUpCircle, Bot
} from 'lucide-react';
import type { Mother, Task, TimelineEvent, AICallRecord, Hospital } from '../types';

type Period = 'week' | 'month' | 'year';

interface CEOAnalyticsProps {
  mothers: Mother[];
  tasks: Task[];
  events: TimelineEvent[];
  calls: AICallRecord[];
  hospitals: Hospital[];
}

// Simulated historical data generator for different periods
function generateHistorical(period: Period) {
  const labels = period === 'week'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : period === 'month'
    ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  const base = period === 'week' ? 1 : period === 'month' ? 4 : 30;
  return labels.map((label, i) => ({
    name: label,
    registrations: Math.round(12 * base + Math.random() * 8 * base + i * 2),
    hrpDetected: Math.round(3 * base + Math.random() * 3 * base),
    ancCompleted: Math.round(10 * base + Math.random() * 6 * base + i * 1.5),
    ancMissed: Math.round(2 * base + Math.random() * 2 * base - i * 0.3),
    aiCalls: Math.round(15 * base + Math.random() * 10 * base + i * 3),
    escalations: Math.round(1 * base + Math.random() * 2 * base),
    deliveries: Math.round(5 * base + Math.random() * 4 * base),
    institutionalDel: Math.round(4 * base + Math.random() * 3.5 * base),
  }));
}

function generateDistrictComparison() {
  return [
    { name: 'Lucknow', mmr: 145, ancCoverage: 78, hrpMonitored: 92, institutionalDel: 85, patientReach: 76 },
    { name: 'Varanasi', mmr: 168, ancCoverage: 65, hrpMonitored: 84, institutionalDel: 72, patientReach: 68 },
    { name: 'Agra', mmr: 172, ancCoverage: 61, hrpMonitored: 79, institutionalDel: 68, patientReach: 62 },
    { name: 'Kanpur', mmr: 155, ancCoverage: 70, hrpMonitored: 87, institutionalDel: 78, patientReach: 71 },
    { name: 'Prayagraj', mmr: 162, ancCoverage: 67, hrpMonitored: 82, institutionalDel: 74, patientReach: 65 },
    { name: 'Gorakhpur', mmr: 185, ancCoverage: 55, hrpMonitored: 72, institutionalDel: 62, patientReach: 55 },
  ];
}

export const CEOAnalytics: React.FC<CEOAnalyticsProps> = ({ hospitals }) => {
  const [period, setPeriod] = useState<Period>('month');

  const historical = useMemo(() => generateHistorical(period), [period]);
  const districts = useMemo(() => generateDistrictComparison(), []);

  const totalReg = historical.reduce((s, d) => s + d.registrations, 0);
  const totalHRP = historical.reduce((s, d) => s + d.hrpDetected, 0);
  const totalANC = historical.reduce((s, d) => s + d.ancCompleted, 0);
  const totalMissed = historical.reduce((s, d) => s + d.ancMissed, 0);
  const totalCalls = historical.reduce((s, d) => s + d.aiCalls, 0);
  const totalEsc = historical.reduce((s, d) => s + d.escalations, 0);
  const totalDel = historical.reduce((s, d) => s + d.deliveries, 0);
  const totalInstDel = historical.reduce((s, d) => s + d.institutionalDel, 0);
  const instDelRate = totalDel > 0 ? Math.round((totalInstDel / totalDel) * 100) : 0;
  const ancCoverageRate = (totalANC + totalMissed) > 0 ? Math.round((totalANC / (totalANC + totalMissed)) * 100) : 0;

  const tooltipStyle = {
    contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, boxShadow: 'var(--shadow-lg)', color: 'var(--text-primary)' },
    labelStyle: { color: 'var(--text-secondary)', fontWeight: 600 as const },
  };

  const periodLabel = period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'This Year';

  // Cause of maternal death distribution (from TN document data)
  const deathCauses = [
    { name: 'Haemorrhage', value: 20, color: '#ef4444' },
    { name: 'Hypertension', value: 19, color: '#f97316' },
    { name: 'Heart Disease', value: 9, color: '#ec4899' },
    { name: 'Sepsis', value: 10, color: '#f59e0b' },
    { name: 'Others', value: 42, color: 'var(--text-muted)' },
  ];

  const KPI = ({ icon: Icon, label, value, sub, trend, trendUp, color }: {
    icon: React.ElementType; label: string; value: string; sub: string;
    trend?: string; trendUp?: boolean; color: string;
  }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color}08, transparent)`,
      borderRadius: 12, padding: '16px 18px', border: `1px solid ${color}15`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: `${color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={color} />
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sub}</span>
        {trend && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
            background: trendUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: trendUp ? '#10b981' : '#ef4444',
            display: 'flex', alignItems: 'center', gap: 2,
          }}>
            {trendUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {trend}
          </span>
        )}
      </div>
    </div>
  );

  const ChartCard = ({ title, subtitle, children, span = 1 }: { title: string; subtitle: string; children: React.ReactNode; span?: number }) => (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
      padding: '16px 18px', display: 'flex', flexDirection: 'column',
      gridColumn: span > 1 ? `span ${span}` : undefined,
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {/* Period Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            MatrAI Monitoring Dashboard — {periodLabel}
          </h2>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Statewide maternal health governance overview for leadership review
          </p>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
          {([
            { key: 'week' as Period, label: 'Last 7 Days' },
            { key: 'month' as Period, label: 'Last 30 Days' },
            { key: 'year' as Period, label: 'Last 12 Months' },
          ]).map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} style={{
              padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              background: period === p.key ? '#3b82f6' : 'transparent',
              color: period === p.key ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s',
            }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <KPI icon={Users} label="Pregnancies Registered" value={totalReg.toLocaleString()} sub={periodLabel} trend="+12%" trendUp={true} color="#3b82f6" />
        <KPI icon={AlertTriangle} label="HRP Cases Detected" value={totalHRP.toLocaleString()} sub={`${totalReg > 0 ? Math.round((totalHRP / totalReg) * 100) : 0}% of registrations`} trend="+8%" trendUp={false} color="#f97316" />
        <KPI icon={Heart} label="Institutional Delivery Rate" value={`${instDelRate}%`} sub={`${totalInstDel} of ${totalDel} deliveries`} trend="+5%" trendUp={true} color="#ec4899" />
        <KPI icon={Phone} label="Patients Contacted" value={totalCalls.toLocaleString()} sub="Amazon Connect outbound" trend="+23%" trendUp={true} color="#06b6d4" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <KPI icon={ClipboardList} label="ANC Coverage" value={`${ancCoverageRate}%`} sub={`${totalANC} completed, ${totalMissed} missed`} trend="+3%" trendUp={true} color="#10b981" />
        <KPI icon={ArrowUpCircle} label="Escalations" value={totalEsc.toLocaleString()} sub="Cases requiring leadership action" trend="-15%" trendUp={true} color="#ef4444" />
        <KPI icon={Building2} label="Facility Readiness" value={`${hospitals.reduce((s, h) => s + h.availableBeds, 0)}`} sub={`beds available across ${hospitals.length} facilities`} color="#f59e0b" />
        <KPI icon={Bot} label="AI Automation Rate" value="94%" sub="Actions handled without human intervention" trend="+7%" trendUp={true} color="#8b5cf6" />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <ChartCard title="Registration & HRP Detection Trend" subtitle={`New pregnancies and high-risk cases identified — ${periodLabel}`} span={1}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={historical}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="registrations" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" strokeWidth={2} isAnimationActive={false} name="Registrations" />
              <Area type="monotone" dataKey="hrpDetected" stroke="#ef4444" fill="rgba(239,68,68,0.1)" strokeWidth={2} isAnimationActive={false} name="HRP Detected" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maternal Death Causes" subtitle="Distribution based on clinical data (reference: TN model)">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deathCauses} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" stroke="none" isAnimationActive={false}>
                {deathCauses.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {deathCauses.map(d => (
              <span key={d.name} style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: d.color, display: 'inline-block' }} />
                {d.name} {d.value}%
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="ANC Compliance" subtitle="Completed vs missed antenatal checkups">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={historical}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={25} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="ancCompleted" stackId="a" fill="#10b981" isAnimationActive={false} name="Completed" />
              <Bar dataKey="ancMissed" stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} isAnimationActive={false} name="Missed" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <ChartCard title="District Performance Comparison" subtitle="Key indicators across districts — identify hotspots">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={districts} layout="vertical" barGap={2}>
              <XAxis type="number" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="ancCoverage" fill="#10b981" isAnimationActive={false} name="ANC Coverage %" barSize={6} radius={[0, 3, 3, 0]} />
              <Bar dataKey="hrpMonitored" fill="#f97316" isAnimationActive={false} name="HRP Monitored %" barSize={6} radius={[0, 3, 3, 0]} />
              <Bar dataKey="patientReach" fill="#06b6d4" isAnimationActive={false} name="Patient Reach Rate %" barSize={6} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 4 }}>
            {[
              { label: 'ANC Coverage', color: '#10b981' },
              { label: 'HRP Monitored', color: '#f97316' },
              { label: 'Patient Reach Rate', color: '#06b6d4' },
            ].map(l => (
              <span key={l.label} style={{ fontSize: 9, color: l.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 6, borderRadius: 2, background: l.color, display: 'inline-block' }} /> {l.label}
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="AI Orchestration & Escalation Trend" subtitle="AI calls, escalations, and deliveries over time">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={historical}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="aiCalls" stroke="#06b6d4" fill="rgba(6,182,212,0.08)" strokeWidth={2} isAnimationActive={false} name="Patients Contacted" />
              <Area type="monotone" dataKey="deliveries" stroke="#ec4899" fill="rgba(236,72,153,0.08)" strokeWidth={2} isAnimationActive={false} name="Deliveries" />
              <Area type="monotone" dataKey="escalations" stroke="#ef4444" fill="rgba(239,68,68,0.08)" strokeWidth={2} isAnimationActive={false} name="Escalations" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 4 }}>
            {[
              { label: 'Patients Contacted', color: '#06b6d4' },
              { label: 'Deliveries', color: '#ec4899' },
              { label: 'Escalations', color: '#ef4444' },
            ].map(l => (
              <span key={l.label} style={{ fontSize: 9, color: l.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 3, borderRadius: 2, background: l.color, display: 'inline-block' }} /> {l.label}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* District MMR Table */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
        padding: '16px 18px', marginBottom: 16,
      }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>District-wise MMR & Key Metrics</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            Maternal Mortality Ratio per 100,000 live births · UP state average: 167 · India: 97 · Tamil Nadu: 35 (target benchmark)
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['District', 'MMR', 'ANC Coverage', 'HRP Monitored', 'Institutional Del.', 'Patient Reach Rate'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {districts.map(d => (
                <tr key={d.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.name}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      fontWeight: 700,
                      color: d.mmr > 170 ? '#ef4444' : d.mmr > 150 ? '#f97316' : d.mmr > 100 ? '#f59e0b' : '#10b981',
                    }}>
                      {d.mmr}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 4 }}>per 100k</span>
                  </td>
                  {[d.ancCoverage, d.hrpMonitored, d.institutionalDel, d.patientReach].map((val, i) => {
                    const color = val >= 80 ? '#10b981' : val >= 60 ? '#f59e0b' : '#ef4444';
                    return (
                      <td key={i} style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', maxWidth: 80 }}>
                            <div style={{ height: '100%', borderRadius: 2, background: color, width: `${val}%`, transition: 'width 0.6s' }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 600, color, minWidth: 32 }}>{val}%</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
