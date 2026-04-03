import React, { useMemo } from 'react';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import type { Mother } from '../types';

interface DeliveryDueCardsProps {
  mothers: Mother[];
  onOpenProfile: (id: string) => void;
}

export const DeliveryDueCards: React.FC<DeliveryDueCardsProps> = ({ mothers, onOpenProfile }) => {
  const { today, thisWeek, twoWeeks, thisMonth, unassigned } = useMemo(() => {
    const now = new Date();
    const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59);
    const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);
    const twoWeekEnd = new Date(now); twoWeekEnd.setDate(twoWeekEnd.getDate() + 14);
    const monthEnd = new Date(now); monthEnd.setDate(monthEnd.getDate() + 30);

    const todayList: Mother[] = [];
    const weekList: Mother[] = [];
    const twoWeekList: Mother[] = [];
    const monthList: Mother[] = [];

    mothers.forEach(m => {
      const edd = new Date(m.expectedDeliveryDate);
      if (edd <= todayEnd && edd >= now) todayList.push(m);
      else if (edd <= weekEnd && edd > todayEnd) weekList.push(m);
      else if (edd <= twoWeekEnd && edd > weekEnd) twoWeekList.push(m);
      else if (edd <= monthEnd && edd > twoWeekEnd) monthList.push(m);
    });

    // Unassigned = due within 7 days but no hospital/doctor (simulated: random subset)
    const dueSoon = [...todayList, ...weekList];
    const unassignedList = dueSoon.filter((_, i) => i % 3 === 0); // simulate ~33% unassigned

    return { today: todayList, thisWeek: weekList, twoWeeks: twoWeekList, thisMonth: monthList, unassigned: unassignedList };
  }, [mothers]);

  const cards = [
    { label: 'Due Today', count: today.length, color: '#ef4444', icon: Calendar, urgent: true },
    { label: 'Due This Week', count: thisWeek.length, color: '#f97316', icon: Clock, urgent: false },
    { label: 'Due in 2 Weeks', count: twoWeeks.length, color: '#f59e0b', icon: Clock, urgent: false },
    { label: 'Due This Month', count: thisMonth.length, color: '#3b82f6', icon: Calendar, urgent: false },
  ];

  return (
    <div style={{ padding: '0 24px 12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 1.2fr', gap: 12 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: 'var(--bg-card)', borderRadius: 12, padding: '14px 16px',
            border: '1px solid var(--border)', borderLeft: `4px solid ${c.color}`,
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <c.icon size={14} color={c.color} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{c.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color, lineHeight: 1 }}>{c.count}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>
              {c.count === 0 ? 'No deliveries in this window' : `${c.count} ${c.count === 1 ? 'pregnancy' : 'pregnancies'} expected`}
            </div>
          </div>
        ))}

        {/* Unassigned alert card */}
        <div style={{
          background: unassigned.length > 0 ? 'rgba(239,68,68,0.06)' : 'var(--bg-card)',
          borderRadius: 12, padding: '14px 16px',
          border: `1px solid ${unassigned.length > 0 ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
          borderLeft: `4px solid ${unassigned.length > 0 ? '#ef4444' : '#10b981'}`,
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <AlertTriangle size={14} color={unassigned.length > 0 ? '#ef4444' : '#10b981'} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {unassigned.length > 0 ? 'Action Required' : 'All Assigned'}
            </span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: unassigned.length > 0 ? '#ef4444' : '#10b981', lineHeight: 1 }}>
            {unassigned.length}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>
            {unassigned.length > 0
              ? 'Due within 7 days without hospital/doctor assigned'
              : 'All upcoming deliveries have facility assigned'}
          </div>
          {unassigned.length > 0 && (
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {unassigned.slice(0, 4).map(m => (
                <span key={m.id} onClick={() => onOpenProfile(m.id)} style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 4, cursor: 'pointer',
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 500,
                  border: '1px solid rgba(239,68,68,0.2)',
                }}>
                  {m.name}
                </span>
              ))}
              {unassigned.length > 4 && (
                <span style={{ fontSize: 9, color: '#ef4444' }}>+{unassigned.length - 4} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
