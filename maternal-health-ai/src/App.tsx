import { useState, useCallback, useRef, useEffect } from 'react';
import type { Mother, Task, TimelineEvent, AICallRecord, Hospital, Ambulance, SimulationState } from './types';
import { generateMothers, generateHospitals, generateAmbulances } from './data/mockData';
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

const INITIAL_MOTHERS = generateMothers(40);
const INITIAL_HOSPITALS = generateHospitals();
const INITIAL_AMBULANCES = generateAmbulances();

type TabKey = 'dashboard' | 'calls' | 'hospitals' | 'patient';

function App() {
  const [mothers, setMothers] = useState<Mother[]>(INITIAL_MOTHERS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [calls, setCalls] = useState<AICallRecord[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [selectedMotherId, setSelectedMotherId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false, speed: 1, currentStep: 0, totalSteps: 0, elapsedTime: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runStep = useCallback(() => {
    const mother = mothers[Math.floor(Math.random() * mothers.length)];
    const scenario = pickRandomScenario(mother);

    setEvents(prev => [...prev, ...scenario.events]);
    setTasks(prev => {
      const newTasks = [...prev, ...scenario.tasks];
      return newTasks.map(t => {
        if (t.status === 'pending' && Math.random() < 0.08) {
          return { ...t, status: 'completed' as const, completedAt: new Date().toISOString() };
        }
        return t;
      });
    });
    if ('calls' in scenario && scenario.calls.length > 0) {
      setCalls(prev => [...prev, ...scenario.calls]);
    }

    setHospitals(prev => prev.map(h => ({
      ...h,
      availableBeds: Math.max(0, Math.min(h.totalBeds, h.availableBeds + (Math.random() > 0.5 ? 1 : -1))),
    })));

    setAmbulances(prev => prev.map(a => {
      if (Math.random() < 0.1) {
        const statuses = ['available', 'dispatched', 'en_route', 'at_hospital'] as const;
        return { ...a, status: statuses[Math.floor(Math.random() * statuses.length)] };
      }
      return a;
    }));

    setSimulation(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, [mothers]);

  const toggleSimulation = useCallback(() => {
    setSimulation(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const resetSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSimulation({ isRunning: false, speed: 1, currentStep: 0, totalSteps: 0, elapsedTime: 0 });
    setEvents([]);
    setTasks([]);
    setCalls([]);
    setHospitals(generateHospitals());
    setAmbulances(generateAmbulances());
    setMothers(generateMothers(40));
  }, []);

  const changeSpeed = useCallback((speed: number) => {
    setSimulation(prev => ({ ...prev, speed }));
  }, []);

  useEffect(() => {
    if (simulation.isRunning) {
      intervalRef.current = setInterval(runStep, 3000 / simulation.speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [simulation.isRunning, simulation.speed, runStep]);

  const selectedMother = mothers.find(m => m.id === selectedMotherId) || null;

  const handleSelectMother = useCallback((id: string) => {
    setSelectedMotherId(id);
  }, []);

  const handleOpenPatientProfile = useCallback((id: string) => {
    setSelectedMotherId(id);
    setActiveTab('patient');
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header
        simulation={simulation}
        onToggle={toggleSimulation}
        onStep={runStep}
        onReset={resetSimulation}
        onSpeedChange={changeSpeed}
        eventCount={events.length}
        taskCount={tasks.length}
        callCount={calls.length}
      />

      {/* Scrollable content area between header and footer */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ArchitectureBanner />

        <StatsCards
          mothers={mothers}
          tasks={tasks}
          calls={calls}
          hospitals={hospitals}
          ambulances={ambulances}
        />

        <Charts mothers={mothers} tasks={tasks} events={events} calls={calls} />

        {/* Tab Navigation */}
        <div style={{ padding: '0 24px 12px', display: 'flex', gap: 4 }}>
          {([
            { key: 'dashboard' as TabKey, label: '📊 Live Dashboard' },
            { key: 'patient' as TabKey, label: '👤 Patient Profile' },
            { key: 'calls' as TabKey, label: '📞 AI Call Center' },
            { key: 'hospitals' as TabKey, label: '🏥 Hospitals & Ambulances' },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '8px 18px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              background: activeTab === tab.key ? '#3b82f6' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.key ? 'white' : '#94a3b8',
              transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ padding: '0 24px 24px', minHeight: 0 }}>
          {activeTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 1fr 300px', gap: 12, height: 520 }}>
              <MothersList mothers={mothers} selectedMotherId={selectedMotherId} onSelect={handleSelectMother} onOpenProfile={handleOpenPatientProfile} />
              <EventTimeline events={events} />
              <TaskBoard tasks={tasks} />
              <MotherDetail mother={selectedMother} tasks={tasks} events={events} />
            </div>
          )}
          {activeTab === 'patient' && (
            <div style={{ height: 600 }}>
              <PatientProfile
                mother={selectedMother}
                tasks={tasks}
                events={events}
                calls={calls}
                onBack={() => setActiveTab('dashboard')}
              />
            </div>
          )}
          {activeTab === 'calls' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 12, height: 520 }}>
              <MothersList mothers={mothers} selectedMotherId={selectedMotherId} onSelect={handleSelectMother} onOpenProfile={handleOpenPatientProfile} />
              <AICallCenter calls={calls} />
            </div>
          )}
          {activeTab === 'hospitals' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', gap: 12, height: 520 }}>
              <MothersList mothers={mothers} selectedMotherId={selectedMotherId} onSelect={handleSelectMother} onOpenProfile={handleOpenPatientProfile} />
              <HospitalPanel hospitals={hospitals} ambulances={ambulances} />
              <MotherDetail mother={selectedMother} tasks={tasks} events={events} />
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <footer style={{
        padding: '10px 24px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, color: '#64748b' }}>
          Every pregnancy visible · Every HRP actionable · Every follow-up traceable · Every delivery prepared
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: '#64748b' }}>
            Step: {simulation.currentStep} | Events: {events.length} | Tasks: {tasks.length} | AI Calls: {calls.length}
          </span>
          <span style={{ fontSize: 10, color: '#ff9900', fontWeight: 600 }}>
            Powered by Amazon Web Services
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
