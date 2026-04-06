import React, { useState, useEffect, useRef } from 'react';
import { useDemoContext } from './DemoContext';
import { HERO_STEPS } from './demoTypes';

const STEP_DURATION_MS = 2500; // time between auto-steps

export function DemoStepController() {
  const { state, dispatch } = useDemoContext();
  const { step } = state;
  const current = HERO_STEPS[step];
  const maxStep = HERO_STEPS.length - 1;

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // progress bar animation
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

  // stop when we hit the last step
  useEffect(() => {
    if (step >= maxStep && playing) stopPlay();
  }, [step]);

  const handlePlayPause = () => {
    if (step >= maxStep) return;
    if (playing) { stopPlay(); } else { setPlaying(true); }
  };

  const handleReset = () => {
    stopPlay();
    dispatch({ type: 'RESET' });
  };

  const isFinished = step >= maxStep;

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
        {/* Overall story progress */}
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
          {step + 1} / {HERO_STEPS.length}
        </div>

        {/* Step label */}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a3d44', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current.label}
        </span>

        {/* Actor badge */}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap',
          background: current.activeActor === 'patient' ? '#fef3c7'
            : current.activeActor === 'asha' ? '#d1fae5'
            : current.activeActor === 'doctor' ? '#dbeafe'
            : '#f3f4f6',
          color: current.activeActor === 'patient' ? '#92400e'
            : current.activeActor === 'asha' ? '#065f46'
            : current.activeActor === 'doctor' ? '#1e40af'
            : '#374151',
        }}>
          {current.activeActor === 'patient' ? '👩 Patient'
            : current.activeActor === 'asha' ? '👩‍⚕️ ASHA'
            : current.activeActor === 'doctor' ? '👨‍⚕️ Doctor'
            : '👨‍👩‍👧 Family'}
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

          {/* Step back */}
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

          {/* Play / Pause */}
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

          {/* Step forward */}
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
