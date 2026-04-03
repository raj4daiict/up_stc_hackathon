import React, { useState } from 'react';
import {
  User, MapPin, Phone, Calendar, Droplets, Activity, Weight, Baby,
  Smartphone, PhoneOff, Shield, AlertTriangle, ClipboardList, Bot,
  PhoneCall, Clock, CheckCircle2, ArrowUpCircle, ChevronLeft,
  Heart, Truck, Building2, Bell, Stethoscope, UserPlus
} from 'lucide-react';
import type { Mother, Task, TimelineEvent, AICallRecord, EventType } from '../types';

const RISK_COLORS: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

const EVENT_ICON_MAP: Partial<Record<EventType, { icon: React.ElementType; color: string }>> = {
  registration: { icon: UserPlus, color: '#3b82f6' },
  checkup_scheduled: { icon: Calendar, color: '#8b5cf6' },
  checkup_completed: { icon: Stethoscope, color: '#10b981' },
  risk_detected: { icon: AlertTriangle, color: '#ef4444' },
  task_assigned: { icon: ClipboardList, color: '#8b5cf6' },
  task_completed: { icon: CheckCircle2, color: '#10b981' },
  escalation: { icon: ArrowUpCircle, color: '#ef4444' },
  ambulance_dispatched: { icon: Truck, color: '#ec4899' },
  hospital_bed_reserved: { icon: Building2, color: '#f59e0b' },
  ai_call_made: { icon: PhoneCall, color: '#06b6d4' },
  ai_call_followup: { icon: PhoneCall, color: '#06b6d4' },
  delivery_planned: { icon: Heart, color: '#ec4899' },
  delivery_completed: { icon: Heart, color: '#10b981' },
  vitals_alert: { icon: AlertTriangle, color: '#f97316' },
  missed_appointment: { icon: Bell, color: '#f59e0b' },
  medication_reminder: { icon: Bell, color: '#8b5cf6' },
  nutrition_alert: { icon: AlertTriangle, color: '#f97316' },
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', in_progress: '#3b82f6', completed: '#10b981', escalated: '#ef4444', overdue: '#ef4444',
};

const ROLE_LABELS: Record<string, string> = {
  asha: 'ASHA Worker', anm: 'ANM', doctor: 'Doctor', ambulance: 'Ambulance',
  ai_callcenter: 'AI Call Center', district_officer: 'District Officer',
};

interface PatientProfileProps {
  mother: Mother | null;
  tasks: Task[];
  events: TimelineEvent[];
  calls: AICallRecord[];
  onBack: () => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ mother, tasks, events, calls, onBack }) => {
  const [section, setSection] = useState<'overview' | 'timeline' | 'tasks' | 'calls'>('overview');

  if (!mother) {
    return (
      <div style={{
        background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
        color: 'var(--text-muted)', fontSize: 13,
      }}>
        Select a beneficiary from the list, then open Patient Profile tab to view full history
      </div>
    );
  }

  const motherTasks = tasks.filter(t => t.motherId === mother.id);
  const motherEvents = events.filter(e => e.motherId === mother.id);
  const motherCalls = calls.filter(c => c.motherId === mother.id);
  const riskColor = RISK_COLORS[mother.riskLevel];

  const InfoRow = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color?: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <Icon size={14} color={color || '#64748b'} />
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 120 }}>{label}</span>
      <span style={{ fontSize: 12, color: color || 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );

  const SectionTab = ({ id, label, count }: { id: typeof section; label: string; count: number }) => (
    <button onClick={() => setSection(id)} style={{
      padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
      fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
      background: section === id ? '#3b82f6' : 'rgba(255,255,255,0.05)',
      color: section === id ? 'white' : 'var(--text-secondary)',
      transition: 'all 0.2s',
    }}>
      {label}
      <span style={{
        fontSize: 10, padding: '1px 6px', borderRadius: 8,
        background: section === id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
        color: section === id ? 'white' : 'var(--text-muted)',
      }}>
        {count}
      </span>
    </button>
  );

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%' }}>
      {/* Left: Patient Info Card */}
      <div style={{
        width: 320, flexShrink: 0, background: 'var(--bg-card)', borderRadius: 12,
        border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'auto',
      }}>
        {/* Back + Header */}
        <div style={{
          padding: 16, borderBottom: '1px solid var(--border)',
          background: `linear-gradient(135deg, ${riskColor}10, transparent)`,
        }}>
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, marginBottom: 12, padding: 0,
          }}>
            <ChevronLeft size={14} /> Back to Dashboard
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `${riskColor}15`, border: `3px solid ${riskColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: riskColor,
            }}>
              {mother.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{mother.name}</h2>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{mother.id}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10,
                  background: `${riskColor}20`, color: riskColor, textTransform: 'uppercase',
                }}>
                  {mother.riskLevel} Risk
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 10,
                  background: 'rgba(59,130,246,0.1)', color: '#3b82f6',
                }}>
                  T{mother.trimester} • {mother.gestationWeeks}w
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div style={{ padding: 16, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Demographics
          </div>
          <InfoRow icon={User} label="Age" value={`${mother.age} years`} />
          <InfoRow icon={MapPin} label="Village" value={mother.village} />
          <InfoRow icon={MapPin} label="Block / District" value={`${mother.block}, ${mother.district}`} />
          <InfoRow icon={Phone} label="Phone" value={mother.phone || 'Not available'} />
          <InfoRow icon={mother.hasSmartphone ? Smartphone : PhoneOff} label="Device Type" value={mother.hasSmartphone ? 'Smartphone' : 'Basic / No phone'} color={mother.hasSmartphone ? '#10b981' : '#f59e0b'} />

          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Clinical Information
          </div>
          <InfoRow icon={Baby} label="Gestation" value={`${mother.gestationWeeks} weeks (Trimester ${mother.trimester})`} />
          <InfoRow icon={Calendar} label="EDD" value={mother.expectedDeliveryDate} />
          <InfoRow icon={Calendar} label="Registered" value={mother.registrationDate} />
          <InfoRow icon={Droplets} label="Hemoglobin" value={`${mother.hemoglobin} g/dL`} color={mother.hemoglobin < 7 ? '#ef4444' : mother.hemoglobin < 10 ? '#f59e0b' : '#10b981'} />
          <InfoRow icon={Activity} label="Blood Pressure" value={mother.bloodPressure} />
          <InfoRow icon={Weight} label="Weight" value={`${mother.weight} kg`} />
          <InfoRow icon={Droplets} label="Blood Group" value={mother.bloodGroup} />
          <InfoRow icon={Baby} label="Previous Deliveries" value={String(mother.previousDeliveries)} />

          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Assigned Care Team
          </div>
          <InfoRow icon={Shield} label="ASHA Worker" value={mother.assignedAsha} color="#10b981" />
          <InfoRow icon={Shield} label="ANM" value={mother.assignedAnm} color="#3b82f6" />

          {mother.riskFactors.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Risk Factors ({mother.riskFactors.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {mother.riskFactors.map((rf, i) => (
                  <span key={i} style={{
                    fontSize: 10, padding: '3px 10px', borderRadius: 6,
                    background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 500,
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}>
                    <AlertTriangle size={9} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {rf}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Summary Stats */}
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            AI Engagement Summary
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Events', value: motherEvents.length, color: '#3b82f6' },
              { label: 'Tasks', value: motherTasks.length, color: '#8b5cf6' },
              { label: 'AI Calls', value: motherCalls.length, color: '#06b6d4' },
            ].map(s => (
              <div key={s.label} style={{
                padding: 8, borderRadius: 8, background: `${s.color}08`,
                border: `1px solid ${s.color}20`, textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Tabbed History */}
      <div style={{
        flex: 1, background: 'var(--bg-card)', borderRadius: 12,
        border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Section Tabs */}
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border)',
          display: 'flex', gap: 6,
        }}>
          <SectionTab id="overview" label="Full Timeline" count={motherEvents.length} />
          <SectionTab id="tasks" label="All Tasks" count={motherTasks.length} />
          <SectionTab id="calls" label="AI Calls" count={motherCalls.length} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>

          {/* FULL TIMELINE */}
          {section === 'overview' && (
            motherEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 12 }}>
                <Bot size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p>No AI activity recorded yet for this patient.</p>
                <p style={{ fontSize: 11, marginTop: 4 }}>Start the simulation to see events appear here.</p>
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: 24 }}>
                {/* Vertical timeline line */}
                <div style={{
                  position: 'absolute', left: 11, top: 0, bottom: 0, width: 2,
                  background: 'linear-gradient(to bottom, #334155, transparent)',
                }} />
                {[...motherEvents].reverse().map((event, idx) => {
                  const cfg = EVENT_ICON_MAP[event.type] || { icon: Bot, color: 'var(--text-secondary)' };
                  const Icon = cfg.icon;
                  return (
                    <div key={event.id} className={idx === 0 ? 'animate-slide-in' : ''} style={{
                      position: 'relative', marginBottom: 16, paddingLeft: 20,
                    }}>
                      {/* Timeline dot */}
                      <div style={{
                        position: 'absolute', left: -16, top: 4,
                        width: 24, height: 24, borderRadius: '50%',
                        background: `${cfg.color}15`, border: `2px solid ${cfg.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={11} color={cfg.color} />
                      </div>
                      <div style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: idx === 0 ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${idx === 0 ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)'}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: '1px 8px', borderRadius: 4,
                            background: `${cfg.color}15`, color: cfg.color, textTransform: 'uppercase',
                          }}>
                            {event.type.replace(/_/g, ' ')}
                          </span>
                          {event.riskLevel && (
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                              background: `${RISK_COLORS[event.riskLevel]}20`,
                              color: RISK_COLORS[event.riskLevel],
                            }}>
                              {event.riskLevel.toUpperCase()}
                            </span>
                          )}
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 6 }}>
                          {event.description}
                        </p>
                        <div style={{
                          padding: '6px 10px', borderRadius: 6,
                          background: 'rgba(6,182,212,0.06)', borderLeft: '3px solid rgba(6,182,212,0.3)',
                        }}>
                          <span style={{ fontSize: 11, color: '#06b6d4', lineHeight: 1.5 }}>
                            🤖 {event.aiAction}
                          </span>
                        </div>
                        {event.agentName && (
                          <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-secondary)' }}>
                            Assigned to: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{event.agentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ALL TASKS */}
          {section === 'tasks' && (
            motherTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 12 }}>
                <ClipboardList size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p>No tasks assigned yet for this patient.</p>
              </div>
            ) : (
              [...motherTasks].reverse().map((task, idx) => {
                const statusColor = STATUS_COLORS[task.status] || '#94a3b8';
                return (
                  <div key={task.id} className={idx === 0 ? 'animate-slide-in' : ''} style={{
                    padding: '12px 16px', marginBottom: 10, borderRadius: 10,
                    background: task.priority === 'critical' ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${task.priority === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{task.type}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 6,
                        background: `${statusColor}15`, color: statusColor, textTransform: 'uppercase',
                      }}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 6,
                        background: `${RISK_COLORS[task.priority]}15`, color: RISK_COLORS[task.priority], textTransform: 'uppercase',
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                      {task.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11 }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        <Shield size={10} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        {ROLE_LABELS[task.assignedRole] || task.assignedRole}: <span style={{ color: 'var(--text-primary)' }}>{task.assignedTo}</span>
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {task.aiGenerated && (
                        <span style={{ color: '#06b6d4', marginLeft: 'auto' }}>🤖 AI Generated</span>
                      )}
                    </div>
                    {task.escalationLevel > 0 && (
                      <div style={{
                        marginTop: 6, padding: '4px 8px', borderRadius: 4,
                        background: 'rgba(239,68,68,0.08)', fontSize: 10, color: '#ef4444',
                      }}>
                        <ArrowUpCircle size={10} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                        Escalation Level {task.escalationLevel}
                      </div>
                    )}
                  </div>
                );
              })
            )
          )}

          {/* AI CALLS */}
          {section === 'calls' && (
            motherCalls.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 12 }}>
                <PhoneCall size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p>No AI calls recorded yet for this patient.</p>
                {!mother.hasSmartphone && (
                  <p style={{ fontSize: 11, marginTop: 4, color: '#f59e0b' }}>
                    This patient has no smartphone — AI calls via Amazon Connect will be the primary engagement channel.
                  </p>
                )}
              </div>
            ) : (
              [...motherCalls].reverse().map((call, idx) => {
                const sentimentColors: Record<string, { color: string; emoji: string }> = {
                  positive: { color: '#10b981', emoji: '😊' },
                  neutral: { color: 'var(--text-secondary)', emoji: '😐' },
                  concerned: { color: '#f59e0b', emoji: '😟' },
                  distressed: { color: '#ef4444', emoji: '😰' },
                };
                const statusColors: Record<string, string> = {
                  scheduled: '#f59e0b', in_progress: '#3b82f6', completed: '#10b981',
                  no_answer: '#ef4444', rescheduled: '#8b5cf6',
                };
                const sColor = statusColors[call.status] || '#94a3b8';
                const sentCfg = call.sentiment ? sentimentColors[call.sentiment] : null;

                return (
                  <div key={call.id} className={idx === 0 ? 'animate-slide-in' : ''} style={{
                    padding: '12px 16px', marginBottom: 10, borderRadius: 10,
                    background: call.sentiment === 'distressed' ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${call.sentiment === 'distressed' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <PhoneCall size={16} color={sColor} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                        {call.callType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 6,
                        background: `${sColor}15`, color: sColor, textTransform: 'uppercase',
                      }}>
                        {call.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <span>🗣️ {call.language}</span>
                      {call.duration && <span>⏱️ {Math.floor(call.duration / 60)}m {call.duration % 60}s</span>}
                      <span>📅 {new Date(call.timestamp).toLocaleString()}</span>
                      {sentCfg && (
                        <span style={{ color: sentCfg.color, fontWeight: 600 }}>
                          {sentCfg.emoji} Sentiment: {call.sentiment}
                        </span>
                      )}
                    </div>
                    {call.summary && (
                      <div style={{
                        padding: '8px 12px', borderRadius: 6,
                        background: 'rgba(6,182,212,0.06)', borderLeft: '3px solid rgba(6,182,212,0.3)',
                        fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.5,
                      }}>
                        {call.summary}
                      </div>
                    )}
                    {call.followUpRequired && (
                      <div style={{ marginTop: 6, fontSize: 10, color: '#f59e0b' }}>
                        ⚠️ Follow-up required
                      </div>
                    )}
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
};
