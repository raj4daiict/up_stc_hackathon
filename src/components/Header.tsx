import React from 'react';
import { Activity, Play, Pause, SkipForward, RotateCcw, Gauge } from 'lucide-react';
import type { SimulationState } from '../types';

interface HeaderProps {
  simulation: SimulationState;
  onToggle: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  eventCount: number;
  taskCount: number;
  callCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  simulation, onToggle, onStep, onReset, onSpeedChange, eventCount, taskCount, callCount
}) => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderBottom: '1px solid #334155',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, #f97316, #ef4444)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Activity size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
            UP Maternal Health AI Platform
          </h1>
          <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
            Agentic AI · Maternal Risk Governance · Every Pregnancy Visible, Every HRP Actionable
          </p>
        </div>
        <div style={{
          marginLeft: 16, padding: '4px 12px', borderRadius: 20,
          background: simulation.isRunning ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
          border: `1px solid ${simulation.isRunning ? '#10b981' : '#f59e0b'}`,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: simulation.isRunning ? '#10b981' : '#f59e0b',
            animation: simulation.isRunning ? 'blink 1s infinite' : 'none',
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: simulation.isRunning ? '#10b981' : '#f59e0b' }}>
            {simulation.isRunning ? 'SIMULATION LIVE' : 'PAUSED'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, marginRight: 12 }}>
          {[
            { label: 'Events', value: eventCount, color: '#3b82f6' },
            { label: 'Tasks', value: taskCount, color: '#8b5cf6' },
            { label: 'AI Calls', value: callCount, color: '#06b6d4' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)',
              border: '1px solid #334155', textAlign: 'center', minWidth: 70,
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid #334155' }}>
          <Gauge size={14} color="#94a3b8" />
          {[1, 2, 5, 10].map(s => (
            <button key={s} onClick={() => onSpeedChange(s)} style={{
              padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              background: simulation.speed === s ? '#3b82f6' : 'transparent',
              color: simulation.speed === s ? 'white' : '#94a3b8',
            }}>
              {s}x
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onToggle} style={{
            width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
            background: simulation.isRunning ? '#ef4444' : '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {simulation.isRunning ? <Pause size={16} color="white" /> : <Play size={16} color="white" />}
          </button>
          <button onClick={onStep} style={{
            width: 36, height: 36, borderRadius: 8, border: '1px solid #334155', cursor: 'pointer',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SkipForward size={16} color="#94a3b8" />
          </button>
          <button onClick={onReset} style={{
            width: 36, height: 36, borderRadius: 8, border: '1px solid #334155', cursor: 'pointer',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <RotateCcw size={16} color="#94a3b8" />
          </button>
        </div>

        <div style={{
          padding: '6px 14px', borderRadius: 8,
          background: 'linear-gradient(135deg, rgba(255,153,0,0.15), rgba(255,153,0,0.05))',
          border: '1px solid rgba(255,153,0,0.3)',
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#f59e0b' }}>Powered by</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#ff9900', marginLeft: 4 }}>AWS</span>
        </div>
      </div>
    </header>
  );
};
