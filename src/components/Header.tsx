import React from 'react';
import { Activity, Play, Pause, SkipForward, RotateCcw, Gauge, Sun, Moon } from 'lucide-react';
import type { SimulationState } from '../types';

type TabKey = 'dashboard' | 'calls' | 'hospitals' | 'patient' | 'ceo';

interface HeaderProps {
  simulation: SimulationState;
  onToggle: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  eventCount: number;
  taskCount: number;
  callCount: number;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'dashboard', label: '📊 Live Dashboard' },
  { key: 'patient', label: '👤 Patient Profile' },
  { key: 'calls', label: '📞 AI Call Center' },
  { key: 'hospitals', label: '🏥 Hospitals' },
  { key: 'ceo', label: '📈 CEO Analytics' },
];

export const Header: React.FC<HeaderProps> = ({
  simulation, onToggle, onStep, onReset, onSpeedChange,
  eventCount, taskCount, callCount,
  activeTab, onTabChange, theme, onThemeToggle,
}) => {
  return (
    <header style={{ flexShrink: 0, zIndex: 100 }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg, #f97316, #ef4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              UP Maternal Health AI Platform
            </h1>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
              Agentic AI · Maternal Risk Governance · Every Pregnancy Visible, Every HRP Actionable
            </p>
          </div>
          <div style={{
            marginLeft: 12, padding: '3px 10px', borderRadius: 20,
            background: simulation.isRunning ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            border: `1px solid ${simulation.isRunning ? '#10b981' : '#f59e0b'}`,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: simulation.isRunning ? '#10b981' : '#f59e0b',
              animation: simulation.isRunning ? 'blink 1s infinite' : 'none',
            }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: simulation.isRunning ? '#10b981' : '#f59e0b' }}>
              {simulation.isRunning ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Events', value: eventCount, color: '#3b82f6' },
              { label: 'Tasks', value: taskCount, color: '#8b5cf6' },
              { label: 'Calls', value: callCount, color: '#06b6d4' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '3px 10px', borderRadius: 6, background: 'var(--tab-bg)',
                border: '1px solid var(--border)', textAlign: 'center', minWidth: 56,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 6px', borderRadius: 6, background: 'var(--tab-bg)', border: '1px solid var(--border)' }}>
            <Gauge size={12} color="var(--text-muted)" />
            {[0.5, 1, 2, 5, 10].map(s => (
              <button key={s} onClick={() => onSpeedChange(s)} style={{
                padding: '2px 6px', borderRadius: 3, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600,
                background: simulation.speed === s ? '#3b82f6' : 'transparent',
                color: simulation.speed === s ? 'white' : 'var(--text-muted)',
              }}>
                {s}x
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 3 }}>
            <button onClick={onToggle} style={{
              width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer',
              background: simulation.isRunning ? '#ef4444' : '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {simulation.isRunning ? <Pause size={14} color="white" /> : <Play size={14} color="white" />}
            </button>
            <button onClick={onStep} style={{
              width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
              background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SkipForward size={14} color="var(--text-muted)" />
            </button>
            <button onClick={onReset} style={{
              width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
              background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <RotateCcw size={14} color="var(--text-muted)" />
            </button>
          </div>

          {/* Theme toggle */}
          <button onClick={onThemeToggle} style={{
            width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
            background: 'var(--tab-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#6366f1" />}
          </button>

          <div style={{
            padding: '5px 12px', borderRadius: 6,
            background: 'linear-gradient(135deg, rgba(255,153,0,0.15), rgba(255,153,0,0.05))',
            border: '1px solid rgba(255,153,0,0.3)',
          }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: '#f59e0b' }}>Powered by</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ff9900', marginLeft: 3 }}>AWS</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => onTabChange(tab.key)} style={{
              padding: '10px 18px', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              background: 'transparent',
              color: isActive ? '#3b82f6' : 'var(--tab-color)',
              borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
              transition: 'all 0.2s',
              marginBottom: -1,
            }}>
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
