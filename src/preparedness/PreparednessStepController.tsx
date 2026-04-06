import React, { useState, useEffect, useRef } from 'react';
import { usePreparednessContext } from './PreparednessContext';
import { PREP_STEPS } from './preparednessTypes';

const STEP_DURATION_MS = 2500;

export function PreparednessStepController() {
  const { state, dispatch } = usePreparednessContext();
  const { step } = state;
  const current = PREP_STEPS[step];
  const maxStep = PREP_STEPS.length - 1;

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPlay = () => {
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
  };

  const startProgressBar = () => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const tick = 50;
    const duration = STEP_DURATION_MS / speed;
    progressRef.current = setInterval(() => {
      setProgress(p => {
        const next = p + (tick / duration) * 100;
        return next >= 100 ? 100 : next;
      });
    }, tick);
  };

  useEffect(() => {
    if (!playing) return;
    if (step >= maxStep) { stopPlay(); return; }

    startProgressBar();
    intervalRef.current = setInterval(() => {
      dispatch({ type: 'NEXT_STEP' });
      startProgressBar();
    }, STEP_DURATION_MS / speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [playing, speed, step]);

  useEffect(() => {
    if (step >= maxStep && playing) stopPlay();
  }, [step]);

  const handlePlayPause = () => {
    if (step >= maxStep) return;
    if (playing) { stopPlay(); } else { setPlaying(true); }
  };

  const handleReset = () => {
    stopPlay();
    dispatch({ type: 'RESET_PREP' });
  };

  const isFinished = step >= maxStep;

  const actorBg = (actor: string) => {
    switch (actor) {
      case 'patient':    return '#fef3c7';
      case 'asha':       return '#d1fae5';
      case 'doctor':     return '#dbeafe';
      case 'family':     return '#f3f4f6';
      case 'hospital':   return '#fed7aa'; // orange bg
      case 'transport':  return '#ede9fe'; // purple bg
      case 'supervisor': return '#fee2e2'; // red bg
      default:           return '#f3f4f6';
    }
  };

  const actorColor = (actor: string) => {
    switch (actor) {
      case 'patient':    return '#92400e';
      case 'asha':       return '#065f46';
      case 'doctor':     return '#1e40af';
      case 'family':     return '#374151';
      case 'hospital':   return '#9a3412';
      case 'transport':  return '#5b21b6';
      case 'supervisor': return '#991b1b';
      default:           return '#374151';
    }
  };

  const actorLabel = (actor: string) => {
    switch (actor) {
      case 'patient':    return '👩 Patient';
      case 'asha':       return '👩‍⚕️ ASHA';
      case 'doctor':     return '👨‍⚕️ Doctor';
      case 'family':     return '👨‍👩‍👧 Family';
      case 'hospital':   return '🏥 Hospital';
      case 'transport':  return '🚑 Transport';
      case 'supervisor': return '🏛 Supervisor';
      default:           return actor;
    }
  };

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: '#b8dce6' }}>
        {playing && (
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#5BBED3',
            transition: 'width 0.05s linear',
          }} />
        )}
        <div style={{
          height: '100%',
          width: `${(step / maxStep) * 100}%`,
          background: 'rgba(91,190,211,0.25)',
          marginTop: -3,
        }} />
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 24px', background: '#D7EFF4',
        borderBottom: '1px solid #b8dce6',
      }}>
        {/* Step badge */}
        <div style={{
          padding: '3px 10px', borderRadius: 20,
          background: '#5BBED3', color: '#fff',
          fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
        }}>
          {step + 1} / {PREP_STEPS.length}
        </div>

        {/* Step label */}
        <span style={{
          fontSize: 13, fontWeight: 600, color: '#1a3d44',
          flex: 1, minWidth: 0, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {current.label}
        </span>

        {/* Actor badge */}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap',
          background: actorBg(current.activeActor),
          color: actorColor(current.activeActor),
        }}>
          {actorLabel(current.activeActor)}
        </span>

        {/* Speed selector */}
        <select
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          style={{
            padding: '4px 8px', borderRadius: 6, border: '1px solid #b8dce6',
            background: 'white', fontSize: 11, color: '#1a3d44', cursor: 'pointer',
          }}
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
          <option value={3}>3×</option>
        </select>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handleReset}
            title="Reset"
            style={{
              padding: '6px 12px', borderRadius: 6, border: '1px solid #5BBED3',
              background: 'white', color: '#5BBED3', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↺
          </button>

          <button
            onClick={() => { stopPlay(); if (step > 0) dispatch({ type: 'PREV_STEP' }); }}
            disabled={step === 0}
            title="Previous step"
            style={{
              padding: '6px 10px', borderRadius: 6, border: '1px solid #b8dce6',
              background: step === 0 ? '#f3f4f6' : 'white',
              color: step === 0 ? '#ccc' : '#1a3d44',
              fontSize: 13, cursor: step === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ‹
          </button>

          <button
            onClick={handlePlayPause}
            disabled={isFinished}
            title={playing ? 'Pause' : 'Play'}
            style={{
              padding: '6px 18px', borderRadius: 6, border: 'none',
              background: isFinished ? '#ccc' : playing ? '#1a3d44' : '#5BBED3',
              color: 'white', fontSize: 14, fontWeight: 700,
              cursor: isFinished ? 'not-allowed' : 'pointer',
              minWidth: 64,
            }}
          >
            {isFinished ? '✓' : playing ? '⏸' : '▶'}
          </button>

          <button
            onClick={() => { stopPlay(); dispatch({ type: 'NEXT_STEP' }); }}
            disabled={isFinished}
            title="Next step"
            style={{
              padding: '6px 10px', borderRadius: 6, border: '1px solid #b8dce6',
              background: isFinished ? '#f3f4f6' : 'white',
              color: isFinished ? '#ccc' : '#1a3d44',
              fontSize: 13, cursor: isFinished ? 'not-allowed' : 'pointer',
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
