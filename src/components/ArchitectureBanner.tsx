import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cloud, Bot, Phone, Database, Shield, Users, Brain, Workflow } from 'lucide-react';

export const ArchitectureBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const services = [
    { icon: Brain, name: 'Amazon Bedrock', desc: 'Agentic AI Orchestration', color: '#8b5cf6' },
    { icon: Phone, name: 'Amazon Connect', desc: 'AI Voice Call Center', color: '#06b6d4' },
    { icon: Bot, name: 'Bedrock Agents', desc: 'Task Assignment & Monitoring', color: '#3b82f6' },
    { icon: Database, name: 'Amazon DynamoDB', desc: 'Health Records Store', color: '#f59e0b' },
    { icon: Workflow, name: 'AWS Step Functions', desc: 'Escalation Workflows', color: '#ec4899' },
    { icon: Shield, name: 'Amazon Cognito', desc: 'Role-based Access', color: '#10b981' },
    { icon: Cloud, name: 'AWS Lambda', desc: 'Serverless Processing', color: '#f97316' },
    { icon: Users, name: 'Amazon SNS', desc: 'Multi-channel Notifications', color: '#ef4444' },
  ];

  return (
    <div style={{ padding: '0 24px 12px' }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', padding: '10px 16px', borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.08))',
        border: '1px solid rgba(139,92,246,0.2)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Cloud size={16} color="#8b5cf6" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>
            AWS Architecture: Agentic AI Maternal Health Platform
          </span>
          <span style={{ fontSize: 10, color: '#64748b' }}>
            {expanded ? 'Click to collapse' : 'Click to view AWS services powering this platform'}
          </span>
        </div>
        {expanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
      </button>

      {expanded && (
        <div className="animate-fade-in" style={{
          marginTop: 8, padding: 16, borderRadius: 10,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {services.map(s => (
              <div key={s.name} style={{
                padding: '12px', borderRadius: 8,
                background: `${s.color}08`, border: `1px solid ${s.color}20`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={18} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              AI-Driven Workflow
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              {[
                'Pregnancy Identification',
                '→ Auto-Assignment (ASHA/ANM)',
                '→ Verification & Case Creation',
                '→ ANC Timeline (1-9+)',
                '→ HRP Risk Flagging (Bedrock)',
                '→ AI Voice Follow-up (Connect)',
                '→ 30-Day Pre-Delivery Alert',
                '→ Transport & Bed Readiness',
                '→ Delivery & Outcome Capture',
                '→ Postpartum Surveillance',
              ].map((step, i) => (
                <span key={i} style={{
                  fontSize: 9, padding: '3px 8px', borderRadius: 4,
                  background: i === 0 ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                  color: i === 0 ? '#3b82f6' : '#94a3b8',
                  border: `1px solid ${i === 0 ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                  fontWeight: step.startsWith('→') ? 400 : 600,
                }}>
                  {step}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'rgba(255,153,0,0.06)', border: '1px solid rgba(255,153,0,0.15)' }}>
            <p style={{ fontSize: 10, color: '#f59e0b', lineHeight: 1.5 }}>
              💡 This demo simulates the AI orchestration layer. In production, Amazon Bedrock Agents will autonomously manage the full continuum of care —
              from early pregnancy identification through ANC tracking, HRP monitoring, 30-day pre-delivery preparedness, transport/bed coordination, to outcome capture.
              Amazon Connect handles multilingual outbound calls (Hindi, Bhojpuri, Awadhi) for mothers without smartphones. Tamil Nadu's war room achieved 43% call reach rate;
              AI-powered approach targets 90%+. Human intervention is only required for escalated cases — every other action is AI-orchestrated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
