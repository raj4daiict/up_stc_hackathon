import React, { useRef, useEffect } from 'react';
import {
  UserPlus, AlertTriangle, Phone, ClipboardCheck, ArrowUpCircle,
  Truck, Building2, Calendar, Heart, Stethoscope, Bell, Utensils, Bot
} from 'lucide-react';
import type { TimelineEvent, EventType } from '../types';

const EVENT_CONFIG: Record<EventType, { icon: React.ElementType; color: string; label: string }> = {
  registration: { icon: UserPlus, color: '#3b82f6', label: 'Registration' },
  checkup_scheduled: { icon: Calendar, color: '#8b5cf6', label: 'Checkup Scheduled' },
  checkup_completed: { icon: Stethoscope, color: '#10b981', label: 'Checkup Done' },
  risk_detected: { icon: AlertTriangle, color: '#ef4444', label: 'Risk Detected' },
  task_assigned: { icon: ClipboardCheck, color: '#8b5cf6', label: 'Task Assigned' },
  task_completed: { icon: ClipboardCheck, color: '#10b981', label: 'Task Completed' },
  escalation: { icon: ArrowUpCircle, color: '#ef4444', label: 'Escalation' },
  ambulance_dispatched: { icon: Truck, color: '#ec4899', label: 'Ambulance' },
  hospital_bed_reserved: { icon: Building2, color: '#f59e0b', label: 'Bed Reserved' },
  ai_call_made: { icon: Phone, color: '#06b6d4', label: 'AI Call' },
  ai_call_followup: { icon: Phone, color: '#06b6d4', label: 'AI Follow-up' },
  delivery_planned: { icon: Heart, color: '#ec4899', label: 'Delivery Plan' },
  delivery_completed: { icon: Heart, color: '#10b981', label: 'Delivered' },
  vitals_alert: { icon: AlertTriangle, color: '#f97316', label: 'Vitals Alert' },
  missed_appointment: { icon: Bell, color: '#f59e0b', label: 'Missed Appt' },
  medication_reminder: { icon: Bell, color: '#8b5cf6', label: 'Medication' },
  nutrition_alert: { icon: Utensils, color: '#f97316', label: 'Nutrition' },
};

interface EventTimelineProps {
  events: TimelineEvent[];
  onOpenProfile?: (motherId: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, onOpenProfile }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events.length]);

  const displayEvents = [...events].reverse().slice(0, 50);

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
          <Bot size={16} color="#3b82f6" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Activity Feed</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{events.length} events</span>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
        {displayEvents.map((event, idx) => {
          const config = EVENT_CONFIG[event.type] || { icon: Bot, color: 'var(--text-secondary)', label: event.type };
          const Icon = config.icon;
          return (
            <div key={event.id} className={idx === 0 ? 'animate-slide-in' : ''} style={{
              padding: '10px 12px', marginBottom: 8, borderRadius: 8,
              background: idx === 0 ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${idx === 0 ? 'rgba(59,130,246,0.2)' : 'transparent'}`,
              transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: `${config.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={14} color={config.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                      background: `${config.color}20`, color: config.color, textTransform: 'uppercase',
                    }}>
                      {config.label}
                    </span>
                    {event.riskLevel && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                        background: event.riskLevel === 'critical' ? 'rgba(239,68,68,0.2)' : event.riskLevel === 'high' ? 'rgba(249,115,22,0.2)' : 'rgba(245,158,11,0.2)',
                        color: event.riskLevel === 'critical' ? '#ef4444' : event.riskLevel === 'high' ? '#f97316' : '#f59e0b',
                      }}>
                        {event.riskLevel.toUpperCase()}
                      </span>
                    )}
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 4 }}>
                    {event.motherName && event.motherId && onOpenProfile ? (
                      <>
                        {event.description.split(event.motherName).map((part, pi, arr) => (
                          <React.Fragment key={pi}>
                            {part}
                            {pi < arr.length - 1 && (
                              <span
                                onClick={(e) => { e.stopPropagation(); onOpenProfile(event.motherId!); }}
                                style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'rgba(59,130,246,0.3)', textUnderlineOffset: 2 }}
                              >
                                {event.motherName}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    ) : event.description}
                  </p>
                  <div style={{
                    fontSize: 10, color: '#06b6d4', lineHeight: 1.4,
                    padding: '4px 8px', borderRadius: 4, background: 'rgba(6,182,212,0.06)',
                    borderLeft: '2px solid rgba(6,182,212,0.3)',
                  }}>
                    🤖 {event.aiAction}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <Bot size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
            <p style={{ fontSize: 12 }}>Press Play to start the simulation</p>
          </div>
        )}
      </div>
    </div>
  );
};
