import { useState, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    onresult: ((e: SpeechRecognitionEvent) => void) | null;
    start(): void;
    stop(): void;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  // eslint-disable-next-line no-var
  var SpeechRecognition: { new(): SpeechRecognition };
}

export type VoiceState = 'idle' | 'recording' | 'unsupported';

export function useVoiceRecorder(onTranscript: (text: string) => void) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
