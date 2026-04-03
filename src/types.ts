// ============================================================
// UP Maternal Health AI Platform — Type Definitions
// ============================================================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TrimesterStage = 1 | 2 | 3 | 'postpartum';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'escalated' | 'overdue';
export type AgentRole = 'asha' | 'anm' | 'doctor' | 'ambulance' | 'ai_callcenter' | 'district_officer';
export type EventType =
  | 'registration'
  | 'checkup_scheduled'
  | 'checkup_completed'
  | 'risk_detected'
  | 'task_assigned'
  | 'task_completed'
  | 'escalation'
  | 'ambulance_dispatched'
  | 'hospital_bed_reserved'
  | 'ai_call_made'
  | 'ai_call_followup'
  | 'delivery_planned'
  | 'delivery_completed'
  | 'vitals_alert'
  | 'missed_appointment'
  | 'medication_reminder'
  | 'nutrition_alert';

export interface Mother {
  id: string;
  name: string;
  age: number;
  village: string;
  block: string;
  district: string;
  phone?: string;
  hasSmartphone: boolean;
  gestationWeeks: number;
  trimester: TrimesterStage;
  riskLevel: RiskLevel;
  riskFactors: string[];
  assignedAsha: string;
  assignedAnm: string;
  lastCheckup: string;
  nextCheckup: string;
  hemoglobin: number;
  bloodPressure: string;
  weight: number;
  bloodGroup: string;
  previousDeliveries: number;
  registrationDate: string;
  expectedDeliveryDate: string;
  status: 'active' | 'delivered' | 'referred';
}

export interface Task {
  id: string;
  motherId: string;
  motherName: string;
  assignedTo: string;
  assignedRole: AgentRole;
  type: string;
  description: string;
  priority: RiskLevel;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  aiGenerated: boolean;
  escalationLevel: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: EventType;
  motherId?: string;
  motherName?: string;
  description: string;
  aiAction: string;
  agent?: AgentRole;
  agentName?: string;
  riskLevel?: RiskLevel;
  metadata?: Record<string, string>;
}

export interface Hospital {
  id: string;
  name: string;
  district: string;
  type: 'PHC' | 'CHC' | 'District' | 'Medical College';
  totalBeds: number;
  availableBeds: number;
  hasBloodBank: boolean;
  hasNICU: boolean;
  hasOperationTheater: boolean;
  distance: number;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  currentLocation: string;
  status: 'available' | 'dispatched' | 'en_route' | 'at_hospital';
  assignedMotherId?: string;
  eta?: number;
}

export interface AICallRecord {
  id: string;
  motherId: string;
  motherName: string;
  callType: 'outbound_checkup' | 'outbound_reminder' | 'outbound_followup' | 'emergency';
  status: 'scheduled' | 'in_progress' | 'completed' | 'no_answer' | 'rescheduled';
  language: 'Hindi' | 'Bhojpuri' | 'Awadhi';
  summary?: string;
  sentiment?: 'positive' | 'neutral' | 'concerned' | 'distressed';
  followUpRequired: boolean;
  timestamp: string;
  duration?: number;
}

export interface DistrictStats {
  district: string;
  totalRegistered: number;
  highRisk: number;
  criticalCases: number;
  deliveriesThisMonth: number;
  institutionalDeliveryRate: number;
  antenatalCoverage: number;
  aiCallsMade: number;
  tasksCompleted: number;
  escalations: number;
}

export interface SimulationState {
  isRunning: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  elapsedTime: number;
}
