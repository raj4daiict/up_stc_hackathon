import { useState, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export type VoiceState = 'idle' | 'recording' | 'unsupported';

export function useVoiceRecorder(onTranscript: (text: string) => void) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);

  const toggle = () => {
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!API) { setVoiceState('unsupported'); return; }

    if (voiceState === 'recording') {
      recognitionRef.current?.stop();
      return;
    }

    const rec = new API();
    rec.lang = 'hi-IN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setVoiceState('recording');
    rec.onend = () => setVoiceState('idle');
    rec.onerror = () => setVoiceState('idle');
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[0][0].transcript;
      onTranscript(t);
    };
    recognitionRef.current = rec;
    rec.start();
  };

  return { voiceState, toggle };
}
