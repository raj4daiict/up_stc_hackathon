import React from 'react';
import { Activity, Play, Pause, SkipForward, RotateCcw, Gauge, Sun, Moon, Palette } from 'lucide-react';
import type { SimulationState } from '../types';

export type MainTab = 'monitoring' | 'command' | 'careflow' | 'preparedness';
export type Theme = 'dark' | 'light' | 'upstc';

interface HeaderProps {
  simulation: SimulationState;
  onToggle: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  eventCount: number;
  taskCount: number;
  callCount: number;
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onOpenRegistration?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  simulation, onToggle, onStep, onReset, onSpeedChange,
  eventCount, taskCount, callCount,
  activeTab, onTabChange, theme, onThemeChange, onOpenRegistration,
}) => {
  const isUPSTC = theme === 'upstc';
  const headerTextColor = isUPSTC ? '#ffffff' : 'var(--text-primary)';
  const headerSubColor = isUPSTC ? 'rgba(255,255,255,0.75)' : 'var(--text-secondary)';
  const headerMutedColor = isUPSTC ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)';

  return (
    <header style={{ flexShrink: 0, zIndex: 100 }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--header-bg)', borderBottom: '1px solid var(--header-border)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {isUPSTC ? (
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: '#fff', border: '2px solid rgba(255,255,255,0.3)',
              letterSpacing: -0.5,
            }}>M</div>
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={20} color="white" />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: headerTextColor, lineHeight: 1.2 }}>
              {isUPSTC ? 'MatrAI' : 'MatrAI'}
            </h1>
            <p style={{ fontSize: 10, color: headerSubColor, fontWeight: 500 }}>
              {isUPSTC ? 'AI-Powered Maternal Health Platform · Government of Uttar Pradesh' : 'Agentic AI · Maternal Risk Governance · Every Pregnancy Visible'}
            </p>
          </div>
          <div style={{
            marginLeft: 12, padding: '3px 10px', borderRadius: 20,
            background: simulation.isRunning ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
            border: `1px solid ${simulation.isRunning ? '#10b981' : '#f59e0b'}`,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: simulation.isRunning ? '#10b981' : '#f59e0b', animation: simulation.isRunning ? 'blink 1s infinite' : 'none' }} />
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
              { label: 'Patients Contacted', value: callCount, color: '#06b6d4' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '3px 10px', borderRadius: 6,
                background: isUPSTC ? 'rgba(255,255,255,0.15)' : 'var(--tab-bg)',
                border: `1px solid ${isUPSTC ? 'rgba(255,255,255,0.2)' : 'var(--border)'}`,
                textAlign: 'center', minWidth: 56,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isUPSTC ? '#fff' : s.color }}>{s.value}</div>
                <div style={{ fontSize: 7, color: headerMutedColor, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 6px', borderRadius: 6, background: isUPSTC ? 'rgba(255,255,255,0.15)' : 'var(--tab-bg)', border: `1px solid ${isUPSTC ? 'rgba(255,255,255,0.2)' : 'var(--border)'}` }}>
            <Gauge size={12} color={headerMutedColor} />
            {[0.5, 1, 2, 5, 10].map(s => (
              <button key={s} onClick={() => onSpeedChange(s)} style={{
                padding: '2px 6px', borderRadius: 3, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600,
                background: simulation.speed === s ? (isUPSTC ? 'rgba(255,255,255,0.3)' : '#3b82f6') : 'transparent',
                color: simulation.speed === s ? 'white' : headerMutedColor,
              }}>{s}x</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 3 }}>
            <button onClick={onToggle} style={{ width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer', background: simulation.isRunning ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {simulation.isRunning ? <Pause size={14} color="white" /> : <Play size={14} color="white" />}
            </button>
            <button onClick={onStep} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${isUPSTC ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`, cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SkipForward size={14} color={headerMutedColor} />
            </button>
            <button onClick={onReset} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${isUPSTC ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`, cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={14} color={headerMutedColor} />
            </button>
          </div>

          {/* Theme selector */}
          <div style={{ display: 'flex', gap: 2 }}>
            <button onClick={() => onThemeChange('dark')} title="Dark" style={{ width: 28, height: 28, borderRadius: 5, border: theme === 'dark' ? '2px solid #3b82f6' : `1px solid ${isUPSTC ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`, cursor: 'pointer', background: theme === 'dark' ? 'rgba(59,130,246,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Moon size={12} color={theme === 'dark' ? '#3b82f6' : headerMutedColor} />
            </button>
            <button onClick={() => onThemeChange('light')} title="Light" style={{ width: 28, height: 28, borderRadius: 5, border: theme === 'light' ? '2px solid #3b82f6' : `1px solid ${isUPSTC ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`, cursor: 'pointer', background: theme === 'light' ? 'rgba(59,130,246,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sun size={12} color={theme === 'light' ? '#f59e0b' : headerMutedColor} />
            </button>
            <button onClick={() => onThemeChange('upstc')} title="UP STC" style={{ width: 28, height: 28, borderRadius: 5, border: theme === 'upstc' ? '2px solid #fff' : `1px solid ${isUPSTC ? 'rgba(255,255,255,0.3)' : 'var(--border)'}`, cursor: 'pointer', background: theme === 'upstc' ? 'rgba(255,255,255,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Palette size={12} color={theme === 'upstc' ? '#fff' : headerMutedColor} />
            </button>
          </div>

          <div style={{ padding: '5px 12px', borderRadius: 6, background: isUPSTC ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, rgba(255,153,0,0.15), rgba(255,153,0,0.05))', border: `1px solid ${isUPSTC ? 'rgba(255,255,255,0.3)' : 'rgba(255,153,0,0.3)'}` }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: isUPSTC ? 'rgba(255,255,255,0.8)' : '#f59e0b' }}>Powered by</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: isUPSTC ? '#fff' : '#ff9900', marginLeft: 3 }}>AWS</span>
          </div>
        </div>
      </div>

      {/* Main tab bar — 2 tabs */}
      <div style={{
        background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', alignItems: 'center', gap: 2,
      }}>
        {([
          { key: 'monitoring' as MainTab, label: '📊 Monitoring Dashboard' },
          { key: 'command' as MainTab, label: '🎯 Active Command Centre' },
          { key: 'careflow' as MainTab, label: '🤰 Care Flow' },
          { key: 'preparedness' as MainTab, label: '🏥 Preparedness' },
        ]).map(tab => {
          const isActive = activeTab === tab.key;
          const activeColor = isUPSTC ? '#ea580c' : '#3b82f6';
          return (
            <button key={tab.key} onClick={() => onTabChange(tab.key)} style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: 'transparent', color: isActive ? activeColor : 'var(--tab-color)',
              borderBottom: isActive ? `3px solid ${activeColor}` : '3px solid transparent',
              transition: 'all 0.2s', marginBottom: -1,
            }}>{tab.label}</button>
          );
        })}
        {onOpenRegistration && (
          <button onClick={onOpenRegistration} style={{
            marginLeft: 'auto', padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, background: '#5BBED3', color: 'white',
          }}>+ New Registration</button>
        )}
      </div>
    </header>
  );
};
