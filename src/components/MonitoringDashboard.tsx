import React, { useMemo } from 'react';
import type { Mother, Task, TimelineEvent, AICallRecord, Hospital, Ambulance } from '../types';
import { UPDistrictMap } from './UPDistrictMap';
import { DISTRICTS } from '../data/mockData';

interface MonitoringDashboardProps {
  mothers: Mother[];
  tasks: Task[];
  events: TimelineEvent[];
  calls: AICallRecord[];
  hospitals: Hospital[];
  ambulances: Ambulance[];
  districtFilter: string;
  onDistrictFilterChange: (district: string) => void;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  mothers, tasks, events, calls, hospitals, ambulances, districtFilter, onDistrictFilterChange,
}) => {
  // Filtered data
  const fm = districtFilter === 'all' ? mothers : mothers.filter(m => m.district === districtFilter);
  const fids = new Set(fm.map(m => m.id));
  const ft = districtFilter === 'all' ? tasks : tasks.filter(t => fids.has(t.motherId));
  const fe = districtFilter === 'all' ? events : events.filter(e => !e.motherId || fids.has(e.motherId));
  const fc = districtFilter === 'all' ? calls : calls.filter(c => fids.has(c.motherId));

  const stats = useMemo(() => {
    const total = fm.length;
    const hrp = fm.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical').length;
    const critical = fm.filter(m => m.riskLevel === 'critical').length;
    const dueThisWeek = fm.filter(m => {
      const edd = new Date(m.expectedDeliveryDate);
      const now = new Date();
      const diff = (edd.getTime() - now.getTime()) / 86400000;
      return diff >= 0 && diff <= 7;
    }).length;
    const escalations = ft.filter(t => t.status === 'escalated' || t.escalationLevel > 0).length;
    return { total, hrp, critical, dueThisWeek, escalations };
  }, [fm, ft]);

  // Risk distribution for donut
  const riskDist = useMemo(() => {
    const low = fm.filter(m => m.riskLevel === 'low').length;
    const medium = fm.filter(m => m.riskLevel === 'medium').length;
    const high = fm.filter(m => m.riskLevel === 'high').length;
    const critical = fm.filter(m => m.riskLevel === 'critical').length;
    return { low, medium, high, critical };
  }, [fm]);

  // Weekly delivery forecast (next 4 weeks)
  const weeklyForecast = useMemo(() => {
    const now = new Date();
    const weeks = [0, 1, 2, 3].map(w => {
      const start = new Date(now.getTime() + w * 7 * 86400000);
      const end = new Date(start.getTime() + 7 * 86400000);
      const count = fm.filter(m => {
        const edd = new Date(m.expectedDeliveryDate);
        return edd >= start && edd < end;
      }).length;
      return { label: w === 0 ? 'This Week' : `Week ${w + 1}`, count };
    });
    return weeks;
  }, [fm]);

  const handleDistrictClick = (district: string) => {
    onDistrictFilterChange(districtFilter === district ? 'all' : district);
  };

  // Recent events for live feed (last 10)
  const recentEvents = fe.slice(-10).reverse();

  const maxForecast = Math.max(...weeklyForecast.map(w => w.count), 1);

  return (
    <div style={{ padding: '16px 24px 24px', height: '100%', overflow: 'auto' }}>
      {/* Top KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <KPICard
          value={stats.total}
          label="Active Pregnancies"
          trend={`${DISTRICTS.slice(0, 3).length} districts`}
          color="#3b82f6"
          icon="👶"
        />
        <KPICard
          value={stats.hrp}
          label="High-Risk (HRP)"
          trend={`${stats.total > 0 ? Math.round((stats.hrp / stats.total) * 100) : 0}% of total`}
          color="#f97316"
          icon="⚠️"
          alert={stats.critical > 0}
          subValue={`${stats.critical} critical`}
        />
        <KPICard
          value={stats.dueThisWeek}
          label="Deliveries Due (7d)"
          trend="Birth preparedness active"
          color="#ec4899"
          icon="🏥"
        />
        <KPICard
          value={stats.escalations}
          label="Unresolved Alerts"
          trend={stats.escalations > 0 ? 'Needs attention' : 'All within SLA'}
          color={stats.escalations > 0 ? '#ef4444' : '#10b981'}
          icon={stats.escalations > 0 ? '🚨' : '✅'}
        />
      </div>

      {/* Main Content: Map + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, minHeight: 380 }}>
        {/* Map */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden', minHeight: 360,
        }}>
          {districtFilter !== 'all' && (
            <button
              onClick={() => onDistrictFilterChange('all')}
              style={{
                position: 'absolute', top: 12, right: 16, zIndex: 5,
                padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                fontSize: 10, fontWeight: 600, cursor: 'pointer',
              }}
            >
              ✕ Clear filter: {districtFilter}
            </button>
          )}
          <UPDistrictMap
            mothers={mothers}
            onDistrictClick={handleDistrictClick}
            selectedDistrict={districtFilter !== 'all' ? districtFilter : undefined}
          />
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Live Activity Feed */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)', padding: '14px 16px', flex: 1, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
              Live Activity
            </div>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentEvents.length === 0 ? (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                  Start simulation to see live events
                </div>
              ) : (
                recentEvents.map(ev => (
                  <div key={ev.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                      background: ev.type === 'escalation' || ev.type === 'vitals_alert' ? '#ef4444'
                        : ev.type === 'risk_detected' ? '#f97316'
                        : ev.type === 'delivery_completed' ? '#10b981'
                        : '#3b82f6',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-primary)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.description.slice(0, 80)}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Donut + Bar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {/* Risk Distribution Donut */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)', padding: '16px 20px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Risk Distribution
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <DonutChart data={riskDist} total={fm.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Low Risk', count: riskDist.low, color: '#22c55e' },
                { label: 'Medium', count: riskDist.medium, color: '#f59e0b' },
                { label: 'High', count: riskDist.high, color: '#f97316' },
                { label: 'Critical', count: riskDist.critical, color: '#ef4444' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', minWidth: 60 }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Delivery Forecast */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)', padding: '16px 20px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Delivery Forecast (4 Weeks)
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 100 }}>
            {weeklyForecast.map((week, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{week.count}</span>
                <div style={{
                  width: '100%', borderRadius: 6,
                  height: `${Math.max(20, (week.count / maxForecast) * 70)}px`,
                  background: i === 0 ? 'linear-gradient(180deg, #ec4899, #be185d)' : 'linear-gradient(180deg, #3b82f6, #1d4ed8)',
                  transition: 'height 0.5s ease',
                }} />
                <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>{week.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────

function KPICard({ value, label, trend, color, icon, alert, subValue }: {
  value: number; label: string; trend: string; color: string; icon: string; alert?: boolean; subValue?: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 12, padding: '16px 18px',
      border: '1px solid var(--border)', borderLeft: `4px solid ${color}`,
      boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 14,
      position: 'relative', overflow: 'hidden',
    }}>
      {alert && (
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 40, height: 40,
          background: `radial-gradient(circle at top right, ${color}22, transparent)`,
        }} />
      )}
      <div style={{ fontSize: 24, lineHeight: 1 }}>{icon}</div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, letterSpacing: -1 }}>
            {value.toLocaleString()}
          </span>
          {subValue && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>{subValue}</span>
          )}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginTop: 3 }}>{label}</div>
        <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{trend}</div>
      </div>
    </div>
  );
}

function DonutChart({ data, total }: { data: { low: number; medium: number; high: number; critical: number }; total: number }) {
  const size = 100;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  const segments = [
    { count: data.low, color: '#22c55e' },
    { count: data.medium, color: '#f59e0b' },
    { count: data.high, color: '#f97316' },
    { count: data.critical, color: '#ef4444' },
  ];

  let offset = 0;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const pct = total > 0 ? seg.count / total : 0;
        const dashLen = pct * circ;
        const dashOffset = -offset;
        offset += dashLen;
        return (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dashLen} ${circ - dashLen}`}
            strokeDashoffset={dashOffset}
            style={{ transition: 'all 0.5s ease' }}
          />
        );
      })}
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fill="var(--text-primary)" fontSize="16" fontWeight="800"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {total}
      </text>
    </svg>
  );
}
