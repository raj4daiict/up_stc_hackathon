import React from 'react';
import type { VoiceState } from '../hooks/useVoiceRecorder';

interface Props {
  voiceState: VoiceState;
  onToggle: () => void;
  /** 'block' = full-width button (default), 'inline' = square icon button */
  variant?: 'block' | 'inline';
}

export function VoiceMicButton({ voiceState, onToggle, variant = 'block' }: Props) {
  const isRecording = voiceState === 'recording';
  const isUnsupported = voiceState === 'unsupported';

  if (variant === 'inline') {
    return (
      <button
        onClick={onToggle}
        title={isUnsupported ? 'Voice not supported in this browser' : isRecording ? 'रिकॉर्डिंग रोकें' : 'आवाज़ से दर्ज करें'}
        style={{
          width: 44, height: 44, borderRadius: 10, border: 'none',
          background: isRecording ? '#ef4444' : isUnsupported ? '#e5e7eb' : '#5BBED3',
          color: 'white', fontSize: 18, cursor: isUnsupported ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          animation: isRecording ? 'pulse 1s infinite' : 'none',
        }}
      >
        {isRecording ? '⏹' : '🎤'}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        disabled={isUnsupported}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 10,
          border: `2px dashed ${isRecording ? '#ef4444' : '#5BBED3'}`,
          background: isRecording ? '#fef2f2' : '#D7EFF4',
          color: isRecording ? '#ef4444' : '#5BBED3',
          fontSize: 14, fontWeight: 700,
          cursor: isUnsupported ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
          opacity: isUnsupported ? 0.5 : 1,
        }}
      >
        <span style={{ fontSize: 18 }}>{isRecording ? '⏹' : '🎤'}</span>
        {isUnsupported
          ? 'Voice not supported'
          : isRecording
          ? 'रिकॉर्डिंग रोकें...'
          : 'आवाज़ से रिकॉर्ड करें'}
      </button>
      {isRecording && (
        <p style={{ fontSize: 10, color: '#ef4444', textAlign: 'center', margin: '4px 0 0' }}>
          ● बोलें... (हिंदी में)
        </p>
      )}
      {isUnsupported && (
        <p style={{ fontSize: 10, color: '#f59e0b', margin: '4px 0 0' }}>
          Chrome browser में voice support उपलब्ध है
        </p>
      )}
    </div>
  );
}
