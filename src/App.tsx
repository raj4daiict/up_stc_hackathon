import { useState, useCallback, useRef, useEffect } from 'react';
import type { Mother, Task, TimelineEvent, AICallRecord, Hospital, Ambulance, SimulationState } from './types';
import { generateMothers, generateHospitals, generateAmbulances, DISTRICTS } from './data/mockData';
import { pickRandomScenario } from './data/simulationEngine';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { EventTimeline } from './components/EventTimeline';
import { TaskBoard } from './components/TaskBoard';
import { MothersList } from './components/MothersList';
import { MotherDetail } from './components/MotherDetail';
import { Charts } from './components/Charts';
import { HospitalPanel } from './components/HospitalPanel';
import { AICallCenter } from './components/AICallCenter';
import { ArchitectureBanner } from './components/ArchitectureBanner';
import { PatientProfile } from './components/PatientProfile';
import { CEOAnalytics } from './components/CEOAnalytics';

const INITIAL_MOTHERS = generateMothers(40);
const INITIAL_HOSPITALS = generateHospitals();
const INITIAL_AMBULANCES = generateAmbulances();

type TabKey = 'dashboard' | 'calls' | 'hospitals' | 'patient' | 'ceo';

function App() {
  const [mothers, setMothers] = useState<Mother[]>(INITIAL_MOTHERS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [calls, setCalls] = useState<AICallRecord[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [selectedMotherId, setSelectedMotherId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false, speed: 1, currentStep: 0, totalSteps: 0, elapsedTime: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const toggleTheme = useCallback(() => { setTheme(p => p === 'dark' ? 'light' : 'dark'); }, []);

  const runStep = useCallback(() => {
    const mother = mothers[Math.floor(Math.random() * mothers.length)];
    const scenario = pickRandomScenario(mother);
    setEvents(prev => [...prev, ...scenario.events]);
    setTasks(prev => {
      const nt = [...prev, ...scenario.tasks];
      return nt.map(t => t.status === 'pending' && Math.random() < 0.08 ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() } : t);
    });
    if ('calls' in scenario && scenario.calls.length > 0) setCalls(prev => [...prev, ...scenario.calls]);
    setHospitals(prev => prev.map(h => ({ ...h, availableBeds: Math.max(0, Math.min(h.totalBeds, h.availableBeds + (Math.random() > 0.5 ? 1 : -1))) })));
    setAmbulances(prev => prev.map(a => Math.random() < 0.1 ? { ...a, status: (['available', 'dispatched', 'en_route', 'at_hospital'] as const)[Math.floor(Math.random() * 4)] } : a));
    setSimulation(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, [mothers]);

  const toggleSimulation = useCallback(() => { setSimulation(p => ({ ...p, isRunning: !p.isRunning })); }, []);
  const resetSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSimulation({ isRunning: false, speed: 1, currentStep: 0, totalSteps: 0, elapsedTime: 0 });
    setEvents([]); setTasks([]); setCalls([]);
    setHospitals(generateHospitals()); setAmbulances(generateAmbulances()); setMothers(generateMothers(40));
  }, []);
  const changeSpeed = useCallback((speed: number) => { setSimulation(p => ({ ...p, speed })); }, []);

  useEffect(() => {
    if (simulation.isRunning) { intervalRef.current = setInterval(runStep, 3000 / simulation.speed); }
    else { if (intervalRef.current) clearInterval(intervalRef.current); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [simulation.isRunning, simulation.speed, runStep]);

  const selectedMother = mothers.find(m => m.id === selectedMotherId) || null;

  // District filtering
  const fm = districtFilter === 'all' ? mothers : mothers.filter(m => m.district === districtFilter);
  const fids = new Set(fm.map(m => m.id));
  const ft = districtFilter === 'all' ? tasks : tasks.filter(t => fids.has(t.motherId));
  const fe = districtFilter === 'all' ? events : events.filter(e => !e.motherId || fids.has(e.motherId));
  const fc = districtFilter === 'all' ? calls : calls.filter(c => fids.has(c.motherId));
  const fh = districtFilter === 'all' ? hospitals : hospitals.filter(h => h.district === districtFilter);

  const handleSelectMother = useCallback((id: string) => { setSelectedMotherId(id); }, []);
  const handleOpenProfile = useCallback((id: string) => { setSelectedMotherId(id); setActiveTab('patient'); }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header simulation={simulation} onToggle={toggleSimulation} onStep={runStep} onReset={resetSimulation}
        onSpeedChange={changeSpeed} eventCount={events.length} taskCount={tasks.length} callCount={calls.length}
        activeTab={activeTab} onTabChange={setActiveTab} theme={theme} onThemeToggle={toggleTheme} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab !== 'ceo' && (
          <>
            <ArchitectureBanner />
            {/* District filter */}
            <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>District:</span>
              <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} style={{
                padding: '5px 28px 5px 10px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 500,
                cursor: 'pointer', outline: 'none', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
              }}>
                <option value="all">All Districts</option>
                {DISTRICTS.slice(0, 3).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {districtFilter !== 'all' && (
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  Showing {fm.length} of {mothers.length} beneficiaries
                </span>
              )}
            </div>
            <StatsCards mothers={fm} tasks={ft} calls={fc} hospitals={fh} ambulances={ambulances} />
            <Charts mothers={fm} tasks={ft} events={fe} calls={fc} />
          </>
        )}

        <div style={{ padding: activeTab === 'ceo' ? '16px 24px 24px' : '0 24px 24px' }}>
          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr 300px', gap: 12, height: 520 }}>
              <MothersList mothers={fm} selectedMotherId={selectedMotherId} onSelect={handleSelectMother} onOpenProfile={handleOpenProfile} />
              <EventTimeline events={fe} onOpenProfile={handleOpenProfile} />
              <TaskBoard tasks={ft} onOpenProfile={handleOpenProfile} />
              <MotherDetail mother={selectedMother} tasks={ft} events={fe} />
            </div>
          )}
          {activeTab === 'patient' && (
            <div style={{ height: 600 }}>
              <PatientProfile mother={selectedMother} tasks={tasks} events={events} calls={calls} onBack={() => setActiveTab('dashboard')} />
            </div>
          )}
          {activeTab === 'calls' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12, height: 520 }}>
              <MothersList mothers={fm} selectedMotherId={selectedMotherId} onSelect={handleSelectMother} onOpenProfile={handleOpenProfile} />
              <AICallCenter calls={fc} onOpenProfile={handleOpenProfile} />
            </div>
          )}
          {activeTab === 'hospitals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', gap: 12, height: 520 }}>
              <MothersList mothers={fm} selectedMotherId={selectedMotherId} onSelect={handleSelectMother} onOpenProfile={handleOpenProfile} />
              <HospitalPanel hospitals={fh} ambulances={ambulances} />
              <MotherDetail mother={selectedMother} tasks={ft} events={fe} />
            </div>
          )}
          {activeTab === 'ceo' && (
            <CEOAnalytics mothers={mothers} tasks={tasks} events={events} calls={calls} hospitals={hospitals} />
          )}
        </div>
      </div>

      <footer style={{
        padding: '8px 24px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          Every pregnancy visible · Every HRP actionable · Every follow-up traceable · Every delivery prepared
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            Step: {simulation.currentStep} | Events: {events.length} | Tasks: {tasks.length} | AI Calls: {calls.length}
          </span>
          <span style={{ fontSize: 10, color: '#ff9900', fontWeight: 600 }}>Powered by Amazon Web Services</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
