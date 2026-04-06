// ============================================================
// Pregnancy Monitoring Demo — Type Definitions
// ============================================================

export type AdherenceStatus = 'good' | 'caution' | 'risk' | 'unknown';

export interface MedicationAdherenceRecord {
  ifaTotal: number;
  ifaRemaining: number | null;
  albendazoleTaken: boolean | null;
  selfReportedRegularity: 'yes' | 'no' | 'sometimes' | null;
}

export interface CarePlanTask {
  id: string;
  label: string;       // Hindi label
  status: 'pending' | 'completed';
  aiAdded?: boolean;
}

export interface JournalEntry {
  patientId: string;
  tags: string[];
  note: string;
  timestamp: string;
  actorType: string;
}

export interface HeroStep {
  step: number;
  label: string;
  activeActor: 'patient' | 'asha' | 'family' | 'doctor';
}

export interface DemoState {
  step: number;
  weightHistory: number[];
  weightLogged: boolean;
  anomalyDetected: boolean;
  doctorAlerted: boolean;
  aiRecommendationVisible: boolean;
  doctorDecision: 'pending' | 'accepted' | 'ignored';
  cascadeApplied: boolean;
  carePlanTasks: CarePlanTask[];
  ashaNotification: string | null;
  journals: JournalEntry[];
  ashaJournal: JournalEntry | null;
  selectedPatientId: string;
  medicationAdherence: MedicationAdherenceRecord;
}

export type DemoAction =
  | { type: 'LOG_WEIGHT'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'DOCTOR_ACCEPT' }
  | { type: 'DOCTOR_IGNORE' }
  | { type: 'ASHA_SUBMIT_JOURNAL'; payload: JournalEntry }
  | { type: 'RECORD_MEDICATION_CHECK'; payload: { ifaRemaining: number; albendazoleTaken: boolean | null; selfReportedRegularity: 'yes' | 'no' | 'sometimes' | null } }
  | { type: 'NOTIFY_ASHA_MEDICATION' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };

export const HERO_STEPS: HeroStep[] = [
  { step: 0, label: 'Step 0: Initial state — patient sees care plan',        activeActor: 'patient' },
  { step: 1, label: 'Step 1: Patient logs weight (66 kg)',                   activeActor: 'patient' },
  { step: 2, label: 'Step 2: Weight graph shows abnormal gain',              activeActor: 'patient' },
  { step: 3, label: 'Step 3: Doctor sees alert in patient list',             activeActor: 'doctor'  },
  { step: 4, label: 'Step 4: AI recommendation panel appears',               activeActor: 'doctor'  },
  { step: 5, label: 'Step 5: Doctor clicks Accept',                          activeActor: 'doctor'  },
  { step: 6, label: 'Step 6: Cascade fires — all 3 effects applied',         activeActor: 'doctor'  },
  { step: 7, label: 'Step 7: Patient sees new BP monitoring task',           activeActor: 'patient' },
  { step: 8, label: 'Step 8: ASHA sees notification + visits patient',       activeActor: 'asha'    },
  { step: 9, label: 'Step 9: ASHA submits journal → Doctor sees it',         activeActor: 'asha'    },
  { step: 10, label: 'Step 10: ASHA checks IFA pills — adherence < 50% detected', activeActor: 'asha' },
  { step: 11, label: 'Step 11: Doctor sees weight issue + medication non-adherence', activeActor: 'doctor' },
  { step: 12, label: 'Step 12: AI shows combined risk — Doctor takes action', activeActor: 'doctor' },
];
