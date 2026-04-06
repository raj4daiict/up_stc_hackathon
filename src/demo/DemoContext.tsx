import React, { createContext, useContext, useReducer } from 'react';
import type { DemoState, DemoAction, CarePlanTask } from './demoTypes';
import { detectWeightAnomaly } from './weightUtils';

const INITIAL_CARE_PLAN: CarePlanTask[] = [
  { id: 'weight-check', label: 'वजन जांचें', status: 'pending' },
  { id: 'bp-check',     label: 'BP जांचें',   status: 'pending' },
  { id: 'iron-tablet',  label: 'आयरन टैबलेट', status: 'pending' },
];

const INITIAL_MEDICATION = {
  ifaTotal: 30,
  ifaRemaining: null as number | null,
  albendazoleTaken: null as boolean | null,
  selfReportedRegularity: null as 'yes' | 'no' | 'sometimes' | null,
};

export const INITIAL_STATE: DemoState = {
  step: 0,
  weightHistory: [58, 59, 60, 62, 64, 66],
  weightLogged: false,
  anomalyDetected: false,
  doctorAlerted: false,
  aiRecommendationVisible: false,
  doctorDecision: 'pending',
  cascadeApplied: false,
  carePlanTasks: INITIAL_CARE_PLAN,
  ashaNotification: null,
  journals: [],
  ashaJournal: null,
  selectedPatientId: 'seema-devi',
  medicationAdherence: INITIAL_MEDICATION,
};

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'NEXT_STEP': {
      if (state.step >= 12) return state;
      const nextStep = state.step + 1;
      return {
        ...state,
        step: nextStep,
        weightLogged: nextStep >= 1,
        anomalyDetected: nextStep >= 2 ? detectWeightAnomaly(state.weightHistory) : state.anomalyDetected,
        doctorAlerted: nextStep >= 3,
        aiRecommendationVisible: nextStep >= 4 && state.doctorDecision === 'pending',
        medicationAdherence: nextStep >= 10
          ? { ifaTotal: 30, ifaRemaining: 18, albendazoleTaken: true, selfReportedRegularity: 'sometimes' }
          : state.medicationAdherence,
      };
    }
    case 'PREV_STEP': {
      if (state.step <= 0) return state;
      const prevStep = state.step - 1;
      return {
        ...state,
        step: prevStep,
        weightLogged: prevStep >= 1,
        anomalyDetected: prevStep >= 2 ? detectWeightAnomaly(state.weightHistory) : false,
        doctorAlerted: prevStep >= 3,
        aiRecommendationVisible: prevStep >= 4 && prevStep < 6 && state.doctorDecision === 'pending',
        medicationAdherence: prevStep >= 10
          ? { ifaTotal: 30, ifaRemaining: 18, albendazoleTaken: true, selfReportedRegularity: 'sometimes' }
          : INITIAL_MEDICATION,
      };
    }
    case 'LOG_WEIGHT': {
      const updated = [...state.weightHistory, action.payload];
      return {
        ...state,
        weightHistory: updated,
        weightLogged: true,
        anomalyDetected: detectWeightAnomaly(updated),
      };
    }
    case 'DOCTOR_ACCEPT': {
      if (state.cascadeApplied) return state;
      return {
        ...state,
        doctorDecision: 'accepted',
        cascadeApplied: true,
        aiRecommendationVisible: false,
        // Upgrade the existing bp-check task to AI-escalated instead of adding a duplicate
        carePlanTasks: state.carePlanTasks.map(t =>
          t.id === 'bp-check' ? { ...t, aiAdded: true, label: 'BP जांचें — रक्तचाप मॉनिटरिंग' } : t
        ),
        ashaNotification: '🔔 नई गतिविधि जोड़ी गई है — सीमा देवी के लिए रक्तचाप मॉनिटरिंग शुरू करें',
      };
    }
    case 'DOCTOR_IGNORE': {
      return { ...state, doctorDecision: 'ignored', aiRecommendationVisible: false };
    }
    case 'ASHA_SUBMIT_JOURNAL': {
      const updated = [...state.journals, action.payload];
      return { ...state, journals: updated, ashaJournal: updated[updated.length - 1] };
    }
    case 'RECORD_MEDICATION_CHECK': {
      return {
        ...state,
        medicationAdherence: {
          ...state.medicationAdherence,
          ifaRemaining: action.payload.ifaRemaining,
          albendazoleTaken: action.payload.albendazoleTaken,
          selfReportedRegularity: action.payload.selfReportedRegularity,
        },
      };
    }
    case 'NOTIFY_ASHA_MEDICATION': {
      return {
        ...state,
        ashaNotification: '🔔 डॉक्टर का संदेश: सीमा देवी की दवा अनुपालन जांचें',
      };
    }
    case 'RESET': {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
}

interface DemoContextValue {
  state: DemoState;
  dispatch: React.Dispatch<DemoAction>;
}

export const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemoContext(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoContext must be used within DemoProvider');
  return ctx;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, INITIAL_STATE);
  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  );
}
