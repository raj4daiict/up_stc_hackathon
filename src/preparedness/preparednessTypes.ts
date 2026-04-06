export type ReadinessStatus = 'pending' | 'ready' | 'escalated';

export type StakeholderKey = 'patient' | 'family' | 'asha' | 'hospital' | 'transport' | 'doctor' | 'supervisor';

export interface PrepJournalEntry {
  text: string;
  timestamp: string;
}

export interface PrepHeroStep {
  step: number;
  label: string;
  activeActor: StakeholderKey;
}

export interface PreparednessState {
  step: number;
  triggerFired: boolean;
  edd: string;
  triggerDate: string;
  stakeholders: Record<StakeholderKey, ReadinessStatus>;
  supervisorNotified: boolean;
  escalationResolved: boolean;
  ashaChecklist: Record<string, boolean>;
  documentChecklist: Record<string, boolean>;
  journals: PrepJournalEntry[];
}

export type PrepAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'CONFIRM_STAKEHOLDER'; payload: StakeholderKey }
  | { type: 'ESCALATE_HOSPITAL' }
  | { type: 'RESOLVE_ESCALATION' }
  | { type: 'SUBMIT_PREP_JOURNAL'; payload: PrepJournalEntry }
  | { type: 'RESET_PREP' };

export const PREP_STEPS: PrepHeroStep[] = [
  { step: 0,  label: 'Step 0: Initial state — patient identified as HRP',              activeActor: 'patient'    },
  { step: 1,  label: 'Step 1: EDD - 30 days reached → system triggers alert',          activeActor: 'patient'    },
  { step: 2,  label: 'Step 2: All stakeholders receive notification simultaneously',    activeActor: 'doctor'     },
  { step: 3,  label: 'Step 3: Hospital bed pre-checked — AI confirms availability',     activeActor: 'doctor'     },
  { step: 4,  label: 'Step 4: Document checklist shown to patient and family',          activeActor: 'patient'    },
  { step: 5,  label: 'Step 5: ASHA confirms home visit and readiness',                  activeActor: 'asha'       },
  { step: 6,  label: 'Step 6: Transport pre-linked and confirmed',                      activeActor: 'transport'  },
  { step: 7,  label: 'Step 7: Hospital fails to acknowledge within SLA',                activeActor: 'hospital'   },
  { step: 8,  label: 'Step 8: System escalates to District Supervisor',                 activeActor: 'supervisor' },
  { step: 9,  label: 'Step 9: District Supervisor sees escalation alert',               activeActor: 'supervisor' },
  { step: 10, label: 'Step 10: Hospital acknowledges after escalation',                 activeActor: 'hospital'   },
  { step: 11, label: 'Step 11: All stakeholders confirmed — delivery ready',            activeActor: 'doctor'     },
];

const ASHA_CHECKLIST_INITIAL: Record<string, boolean> = {
  'घर विजिट किया': false,
  'दस्तावेज़ देखे': false,
  'परिवार को समझाया': false,
  'अस्पताल बताया': false,
  'परिवहन समझाया': false,
};

const DOCUMENT_CHECKLIST_INITIAL: Record<string, boolean> = {
  'आधार कार्ड': false,
  'जांच रिपोर्ट': false,
  'पंजीकरण कार्ड': false,
};

const STAKEHOLDERS_INITIAL: Record<StakeholderKey, ReadinessStatus> = {
  patient: 'pending', family: 'pending', asha: 'pending',
  hospital: 'pending', transport: 'pending', doctor: 'pending', supervisor: 'pending',
};

export const INITIAL_PREP_STATE: PreparednessState = {
  step: 0,
  triggerFired: false,
  edd: '2026-05-05',
  triggerDate: '2026-04-05',
  stakeholders: STAKEHOLDERS_INITIAL,
  supervisorNotified: false,
  escalationResolved: false,
  ashaChecklist: ASHA_CHECKLIST_INITIAL,
  documentChecklist: DOCUMENT_CHECKLIST_INITIAL,
  journals: [],
};
