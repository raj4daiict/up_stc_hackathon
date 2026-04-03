import React, { useState, useCallback, useRef } from 'react';
import { ArrowLeft, Mic, ChevronRight, Check, User, Users, Heart, Building2, Volume2, X } from 'lucide-react';

const C = { primary: '#5BBED3', light: '#D7EFF4', white: '#FFFFFF', text: '#1e293b', muted: '#64748b', border: '#e2e8f0', success: '#10b981' };

type Step = 'welcome' | 'role' | 'voice' | 'identity' | 'pregnancy' | 'aadhaar' | 'address' | 'review' | 'success' | 'next_steps';
type Role = 'self' | 'family' | 'asha' | 'facility';

interface FormData {
  firstName: string; lastName: string; dob: string; pregnant: string; hasAadhaar: string;
  aadhaarNumber: string; address1: string; address2: string; state: string; city: string;
  pincode: string; mobile: string; village: string;
}

const INITIAL: FormData = {
  firstName: '', lastName: '', dob: '', pregnant: '', hasAadhaar: '', aadhaarNumber: '',
  address1: '', address2: '', state: '', city: '', pincode: '', mobile: '', village: '',
};

const STEPS: Step[] = ['welcome', 'role', 'voice', 'identity', 'pregnancy', 'aadhaar', 'address', 'review', 'success', 'next_steps'];

// ── Web Speech API hook ──
function useSpeechRecognition() {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  const startListening = useCallback((field: string, onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input is not supported in this browser. Please use Chrome.'); return; }

    if (recognitionRef.current) { recognitionRef.current.abort(); }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { setListening(true); setActiveField(field); };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setListening(false); setActiveField(null);
    };
    recognition.onerror = () => { setListening(false); setActiveField(null); };
    recognition.onend = () => { setListening(false); setActiveField(null); };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.abort(); }
    setListening(false); setActiveField(null);
  }, []);

  return { listening, activeField, startListening, stopListening };
}

// ── Text-to-Speech ──
function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'hi-IN'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
}

interface Props { onClose: () => void; }

export const RegistrationFlow: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState<Step>('welcome');
  const [role, setRole] = useState<Role | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL);
  const { listening, activeField, startListening, stopListening } = useSpeechRecognition();

  const stepIndex = STEPS.indexOf(step);
  const totalSteps = STEPS.length - 2;
  const progress = Math.min((stepIndex / (totalSteps - 1)) * 100, 100);

  const set = (field: keyof FormData, value: string) => setForm(p => ({ ...p, [field]: value }));
  const goNext = () => { const i = STEPS.indexOf(step); if (i < STEPS.length - 1) setStep(STEPS[i + 1]); };
  const goBack = () => { const i = STEPS.indexOf(step); if (i > 0) setStep(STEPS[i - 1]); };

  // Styles
  const card: React.CSSProperties = { background: C.white, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16 };
  const cardLight: React.CSSProperties = { ...card, background: C.light, border: `1px solid ${C.primary}30` };
  const btnStyle = (primary = true): React.CSSProperties => ({
    width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
    fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: primary ? C.primary : C.light, color: primary ? C.white : C.text,
  });
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`,
    fontSize: 15, color: C.text, outline: 'none', background: C.white,
  };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: C.primary, marginBottom: 6, display: 'block' };

  const MicBtn = ({ field }: { field: string }) => {
    const isActive = listening && activeField === field;
    return (
      <button
        onClick={() => isActive ? stopListening() : startListening(field, (text) => set(field as keyof FormData, text))}
        style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          border: `2px solid ${isActive ? C.primary : C.border}`,
          background: isActive ? `${C.primary}20` : C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: isActive ? 'blink 0.8s infinite' : 'none',
        }}
        title={isActive ? 'सुन रहा है... (Listening)' : 'बोलकर भरें (Speak)'}
      >
        <Mic size={20} color={isActive ? C.primary : C.muted} />
      </button>
    );
  };

  const InputWithMic = ({ lbl, field, placeholder, type = 'text' }: { lbl: string; field: keyof FormData; placeholder: string; type?: string }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{lbl}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type={type} value={form[field]} onChange={e => set(field, e.target.value)} placeholder={placeholder}
          style={{ ...inputStyle, flex: 1, borderColor: listening && activeField === field ? C.primary : C.border }}
          onFocus={e => (e.target.style.borderColor = C.primary)} onBlur={e => { if (activeField !== field) e.target.style.borderColor = C.border; }} />
        {voiceMode && <MicBtn field={field} />}
      </div>
      {listening && activeField === field && (
        <div style={{ fontSize: 11, color: C.primary, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.primary, animation: 'blink 0.6s infinite' }} />
          सुन रहा है... बोलें
        </div>
      )}
    </div>
  );

  const OptionCard = ({ icon, title, subtitle, selected, onClick }: { icon: React.ReactNode; title: string; subtitle?: string; selected?: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      ...card, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', width: '100%', textAlign: 'left',
      border: `2px solid ${selected ? C.primary : C.border}`, background: selected ? C.light : C.white, padding: '16px 18px',
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: selected ? C.primary : C.light, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {selected && <Check size={20} color={C.primary} />}
    </button>
  );

  const ProgressBar = () => step !== 'welcome' && step !== 'success' && step !== 'next_steps' ? (
    <div style={{ padding: '0 20px 12px' }}>
      <div style={{ height: 4, borderRadius: 2, background: C.light }}>
        <div style={{ height: '100%', borderRadius: 2, background: C.primary, width: `${progress}%`, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  ) : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#f8fafb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: C.white, borderBottom: `1px solid ${C.border}` }}>
        {step !== 'welcome' && step !== 'success' && step !== 'next_steps' && (
          <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ArrowLeft size={22} color={C.text} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.primary }}>MatrAI</div>
          <div style={{ fontSize: 10, color: C.muted }}>गर्भावस्था पंजीकरण · Pregnancy Registration</div>
        </div>
        <button onClick={onClose} style={{ fontSize: 12, color: C.muted, background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <X size={14} /> बंद करें
        </button>
      </div>
      <ProgressBar />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px 100px' }}>

        {/* WELCOME */}
        {step === 'welcome' && (
          <div style={{ textAlign: 'center', paddingTop: 30 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.light, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={36} color={C.primary} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>गर्भावस्था पंजीकरण में<br />आपका स्वागत है</h1>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 30, lineHeight: 1.6 }}>सुरक्षित मातृत्व की दिशा में पहला कदम</p>
            <div style={cardLight}>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                आप स्वयं, परिवार का सदस्य, आशा कार्यकर्ता या अस्पताल कर्मचारी — कोई भी यह पंजीकरण कर सकते हैं।
              </p>
            </div>
            <button onClick={goNext} style={btnStyle()}>पंजीकरण शुरू करें <ChevronRight size={18} /></button>
            <button onClick={() => { speak('गर्भावस्था पंजीकरण में आपका स्वागत है। पंजीकरण शुरू करने के लिए बटन दबाएं।'); }} style={{ ...btnStyle(false), marginTop: 10 }}><Volume2 size={18} color={C.primary} /> आवाज़ से सहायता लें</button>
          </div>
        )}

        {/* ROLE */}
        {step === 'role' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>आप किसके लिए पंजीकरण कर रहे हैं?</h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Who are you registering for?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <OptionCard icon={<User size={22} color={role === 'self' ? C.white : C.primary} />} title="मैं अपने लिए पंजीकरण कर रही हूँ" subtitle="I am registering for myself" selected={role === 'self'} onClick={() => { setRole('self'); goNext(); }} />
              <OptionCard icon={<Users size={22} color={role === 'family' ? C.white : C.primary} />} title="पत्नी / परिवार की सदस्य के लिए" subtitle="For my wife / family member" selected={role === 'family'} onClick={() => { setRole('family'); goNext(); }} />
              <OptionCard icon={<Heart size={22} color={role === 'asha' ? C.white : C.primary} />} title="मैं आशा / स्वास्थ्य कार्यकर्ता हूँ" subtitle="I am an ASHA / health worker" selected={role === 'asha'} onClick={() => { setRole('asha'); goNext(); }} />
              <OptionCard icon={<Building2 size={22} color={role === 'facility' ? C.white : C.primary} />} title="मैं अस्पताल / सुविधा केंद्र से हूँ" subtitle="Hospital / facility staff" selected={role === 'facility'} onClick={() => { setRole('facility'); goNext(); }} />
            </div>
          </div>
        )}

        {/* VOICE MODE */}
        {step === 'voice' && (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: C.light, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mic size={32} color={C.primary} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>क्या आप आवाज़ के माध्यम से फॉर्म भरना चाहेंगे?</h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 6, lineHeight: 1.5 }}>आप हर सवाल सुन सकते हैं और बोलकर जवाब दे सकते हैं।</p>
            <p style={{ fontSize: 11, color: C.muted, marginBottom: 24 }}>Uses your device microphone · Hindi voice recognition</p>
            <button onClick={() => { setVoiceMode(true); goNext(); }} style={btnStyle()}>हाँ, आवाज़ से भरें <Mic size={18} /></button>
            <button onClick={() => { setVoiceMode(false); goNext(); }} style={{ ...btnStyle(false), marginTop: 10 }}>नहीं, मैं टाइप करूँगा / करूँगी</button>
          </div>
        )}

        {/* IDENTITY */}
        {step === 'identity' && (
          <div>
            <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, marginBottom: 4 }}>चरण 1 / 4 — व्यक्तिगत जानकारी</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>बुनियादी जानकारी</h2>
            <div style={card}>
              <InputWithMic lbl="पहला नाम * (First Name)" field="firstName" placeholder="पहला नाम बोलें या टाइप करें" />
              <InputWithMic lbl="अंतिम नाम * (Last Name)" field="lastName" placeholder="अंतिम नाम बोलें या टाइप करें" />
              <InputWithMic lbl="जन्म तिथि * (Date of Birth)" field="dob" placeholder="dd/mm/yyyy" type="date" />
              <InputWithMic lbl="मोबाइल नंबर (Mobile)" field="mobile" placeholder="+91 XXXXX XXXXX" type="tel" />
            </div>
          </div>
        )}

        {/* PREGNANCY */}
        {step === 'pregnancy' && (
          <div>
            <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, marginBottom: 4 }}>चरण 2 / 4 — गर्भावस्था</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>क्या आप गर्भवती हैं?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <OptionCard icon={<Check size={20} color={form.pregnant === 'yes' ? C.white : C.success} />} title="हाँ (Yes)" selected={form.pregnant === 'yes'} onClick={() => { set('pregnant', 'yes'); goNext(); }} />
              <OptionCard icon={<span style={{ fontSize: 18 }}>❓</span>} title="पक्का नहीं (Not sure)" selected={form.pregnant === 'unsure'} onClick={() => { set('pregnant', 'unsure'); goNext(); }} />
              <OptionCard icon={<span style={{ fontSize: 18 }}>✕</span>} title="नहीं (No)" selected={form.pregnant === 'no'} onClick={() => set('pregnant', 'no')} />
            </div>
            {form.pregnant === 'no' && (
              <div style={{ ...cardLight, marginTop: 16 }}>
                <p style={{ fontSize: 13, color: C.text }}>यदि आप गर्भवती नहीं हैं, तो कृपया अपने नजदीकी स्वास्थ्य केंद्र से संपर्क करें।</p>
              </div>
            )}
          </div>
        )}

        {/* AADHAAR */}
        {step === 'aadhaar' && (
          <div>
            <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, marginBottom: 4 }}>चरण 3 / 4 — पहचान</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>क्या आपके पास आधार नंबर है?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <OptionCard icon={<Check size={20} color={form.hasAadhaar === 'yes' ? C.white : C.success} />} title="हाँ (Yes)" selected={form.hasAadhaar === 'yes'} onClick={() => set('hasAadhaar', 'yes')} />
              <OptionCard icon={<span style={{ fontSize: 16 }}>✕</span>} title="नहीं (No)" selected={form.hasAadhaar === 'no'} onClick={() => set('hasAadhaar', 'no')} />
              <OptionCard icon={<span style={{ fontSize: 16 }}>⏳</span>} title="अभी उपलब्ध नहीं है (Not available now)" selected={form.hasAadhaar === 'later'} onClick={() => set('hasAadhaar', 'later')} />
            </div>
            {form.hasAadhaar === 'yes' && (
              <div style={{ ...card, marginTop: 16 }}>
                <InputWithMic lbl="आधार नंबर दर्ज करें (Aadhaar Number)" field="aadhaarNumber" placeholder="XXXX XXXX XXXX" />
              </div>
            )}
            {(form.hasAadhaar === 'no' || form.hasAadhaar === 'later') && (
              <div style={{ ...cardLight, marginTop: 16 }}>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  ✅ कोई बात नहीं। आप अभी पंजीकरण जारी रख सकते हैं।<br />
                  आधार बाद में जोड़ा जा सकता है। स्वास्थ्य कार्यकर्ता आपकी सहायता करेंगे।
                </p>
              </div>
            )}
          </div>
        )}

        {/* ADDRESS */}
        {step === 'address' && (
          <div>
            <div style={{ fontSize: 11, color: C.primary, fontWeight: 600, marginBottom: 4 }}>चरण 4 / 4 — पता</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>पता विवरण (Address)</h2>
            <div style={card}>
              <InputWithMic lbl="पता पंक्ति 1 * (Address Line 1)" field="address1" placeholder="Street address, building" />
              <InputWithMic lbl="पता पंक्ति 2 (Address Line 2)" field="address2" placeholder="Apartment, suite (optional)" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>राज्य * (State)</label>
                  <select value={form.state} onChange={e => set('state', e.target.value)} style={{ ...inputStyle, appearance: 'none' as const }}>
                    <option value="">Select state</option>
                    <option value="UP">उत्तर प्रदेश</option>
                  </select>
                </div>
                <InputWithMic lbl="शहर / जिला * (City)" field="city" placeholder="City / District" />
              </div>
              <InputWithMic lbl="पिन कोड * (Pin Code)" field="pincode" placeholder="Pin code" />
              {role === 'asha' && <InputWithMic lbl="गाँव / मोहल्ला (Village)" field="village" placeholder="Village / Mohalla" />}
            </div>
          </div>
        )}

        {/* REVIEW */}
        {step === 'review' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4 }}>कृपया अपनी जानकारी जाँच लें</h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Please review your information before submitting</p>
            <div style={card}>
              {[
                { l: 'नाम (Name)', v: `${form.firstName} ${form.lastName}`.trim() },
                { l: 'जन्म तिथि (DOB)', v: form.dob },
                { l: 'मोबाइल (Mobile)', v: form.mobile || '—' },
                { l: 'गर्भावस्था (Pregnancy)', v: form.pregnant === 'yes' ? 'हाँ' : form.pregnant === 'unsure' ? 'पक्का नहीं' : 'नहीं' },
                { l: 'आधार (Aadhaar)', v: form.hasAadhaar === 'yes' ? (form.aadhaarNumber || 'हाँ') : form.hasAadhaar === 'no' ? 'नहीं' : 'बाद में' },
                { l: 'पता (Address)', v: [form.address1, form.city, form.state, form.pincode].filter(Boolean).join(', ') },
              ].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.muted }}>{r.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: 'right', maxWidth: '55%' }}>{r.v || '—'}</span>
                </div>
              ))}
            </div>
            {voiceMode && (
              <button onClick={() => speak(`आपका नाम ${form.firstName} ${form.lastName}। पता ${form.address1}, ${form.city}। कृपया जमा करें बटन दबाएं।`)}
                style={{ ...btnStyle(false), marginBottom: 12 }}><Volume2 size={18} color={C.primary} /> जानकारी सुनें (Read aloud)</button>
            )}
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.light, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={40} color={C.primary} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>बधाई हो! 🎉</h1>
            <p style={{ fontSize: 15, color: C.text, marginBottom: 8 }}>आपका गर्भावस्था पंजीकरण सफलतापूर्वक पूरा हो गया है।</p>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>अब आपकी देखभाल यात्रा शुरू हो चुकी है।<br />स्वास्थ्य कार्यकर्ता या अस्पताल आपसे संपर्क करेंगे।</p>
            <div style={{ ...cardLight, textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.primary, marginBottom: 6 }}>पंजीकरण ID (Registration ID)</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>UP-MCH-{String(Math.floor(Math.random() * 90000 + 10000))}</div>
            </div>
            <button onClick={goNext} style={{ ...btnStyle(), marginTop: 16 }}>आगे क्या होगा देखें <ChevronRight size={18} /></button>
            <button onClick={onClose} style={{ ...btnStyle(false), marginTop: 10 }}>होम पर जाएँ (Go Home)</button>
          </div>
        )}

        {/* NEXT STEPS */}
        {step === 'next_steps' && (
          <div style={{ paddingTop: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>अब आगे क्या होगा? (What happens next?)</h2>
            {[
              { n: '1', t: 'जानकारी सुरक्षित', s: 'आपकी जानकारी सुरक्षित रूप से दर्ज हो गई है', e: 'Your information has been securely recorded' },
              { n: '2', t: 'कार्यकर्ता संपर्क', s: 'आशा / स्वास्थ्य कार्यकर्ता आपसे संपर्क करेंगे', e: 'ASHA / health worker will contact you' },
              { n: '3', t: 'देखभाल योजना', s: 'आपको जांच, देखभाल और सलाह की जानकारी मिलेगी', e: 'You will receive checkup and care guidance' },
            ].map(item => (
              <div key={item.n} style={{ ...card, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primary, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{item.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.t}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.s}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1, fontStyle: 'italic' }}>{item.e}</div>
                </div>
              </div>
            ))}
            <div style={cardLight}>
              <p style={{ fontSize: 13, color: C.text, textAlign: 'center' }}>🤝 आपकी देखभाल टीम जल्द ही जुड़ेगी</p>
            </div>
            <button onClick={onClose} style={{ ...btnStyle(), marginTop: 16 }}>होम पर जाएँ (Go Home)</button>
          </div>
        )}
      </div>

      {/* Sticky bottom CTA for form steps */}
      {['identity', 'aadhaar', 'address', 'review'].includes(step) && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 20px', background: C.white, borderTop: `1px solid ${C.border}`, boxShadow: '0 -4px 12px rgba(0,0,0,0.06)' }}>
          <button onClick={step === 'review' ? () => setStep('success') : goNext} style={btnStyle()}>
            {step === 'review' ? '✅ पंजीकरण जमा करें (Submit)' : 'आगे बढ़ें (Next)'} <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Floating voice indicator when listening */}
      {listening && (
        <div style={{
          position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
          padding: '8px 20px', borderRadius: 20, background: C.primary, color: C.white,
          fontSize: 13, fontWeight: 600, boxShadow: '0 4px 16px rgba(91,190,211,0.4)',
          display: 'flex', alignItems: 'center', gap: 8, zIndex: 1001,
        }}>
          <Mic size={16} /> सुन रहा है... (Listening)
        </div>
      )}
    </div>
  );
};
