import type { Mother, Task, TimelineEvent, AICallRecord } from '../types';
import { ASHA_WORKERS } from './mockData';

let eventCounter = 0;
let taskCounter = 0;
let callCounter = 0;

function nextEventId() { return `EVT-${String(++eventCounter).padStart(5, '0')}`; }
function nextTaskId() { return `TSK-${String(++taskCounter).padStart(5, '0')}`; }
function nextCallId() { return `CALL-${String(++callCounter).padStart(4, '0')}`; }

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomBetween(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function now() { return new Date().toISOString(); }

// ── Scenario generators ──────────────────────────────────────

export function generateRegistrationScenario(mother: Mother): { events: TimelineEvent[]; tasks: Task[]; calls: AICallRecord[] } {
  const events: TimelineEvent[] = [];
  const tasks: Task[] = [];
  const calls: AICallRecord[] = [];

  events.push({
    id: nextEventId(), timestamp: now(), type: 'registration',
    motherId: mother.id, motherName: mother.name,
    description: `New beneficiary registered: ${mother.name}, Age ${mother.age}, Village ${mother.village}, ${mother.gestationWeeks} weeks gestation`,
    aiAction: `AI analyzed profile → Risk Level: ${mother.riskLevel.toUpperCase()}. ${mother.riskFactors.length > 0 ? 'Risk factors: ' + mother.riskFactors.join(', ') : 'No risk factors identified.'}`,
    riskLevel: mother.riskLevel,
  });

  tasks.push({
    id: nextTaskId(), motherId: mother.id, motherName: mother.name,
    assignedTo: mother.assignedAsha, assignedRole: 'asha',
    type: 'Initial Home Visit', description: `Conduct first home visit for ${mother.name} at ${mother.village}. Verify registration details, check vitals, counsel on nutrition.`,
    priority: mother.riskLevel, status: 'pending', createdAt: now(),
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(), aiGenerated: true, escalationLevel: 0,
  });

  if (!mother.hasSmartphone) {
    calls.push({
      id: nextCallId(), motherId: mother.id, motherName: mother.name,
      callType: 'outbound_checkup', status: 'scheduled', language: randomFrom(['Hindi', 'Bhojpuri', 'Awadhi']),
      followUpRequired: true, timestamp: now(),
    });
    events.push({
      id: nextEventId(), timestamp: now(), type: 'ai_call_made',
      motherId: mother.id, motherName: mother.name,
      description: `AI Call Center (Amazon Connect) scheduled outbound call to ${mother.name} — no smartphone detected, using voice-based engagement in local dialect`,
      aiAction: 'Amazon Connect IVR configured for health assessment in Bhojpuri/Hindi. AI will collect vitals feedback, remind about iron tablets, and schedule next checkup.',
      agent: 'ai_callcenter',
    });
  }

  if (mother.riskLevel === 'high' || mother.riskLevel === 'critical') {
    tasks.push({
      id: nextTaskId(), motherId: mother.id, motherName: mother.name,
      assignedTo: mother.assignedAnm, assignedRole: 'anm',
      type: 'Priority Clinical Assessment', description: `HIGH PRIORITY: ${mother.name} flagged as ${mother.riskLevel} risk. Conduct detailed clinical assessment. Risk factors: ${mother.riskFactors.join(', ')}`,
      priority: mother.riskLevel, status: 'pending', createdAt: now(),
      dueDate: new Date(Date.now() + 86400000).toISOString(), aiGenerated: true, escalationLevel: 0,
    });
    events.push({
      id: nextEventId(), timestamp: now(), type: 'task_assigned',
      motherId: mother.id, motherName: mother.name,
      description: `AI auto-assigned priority clinical assessment to ${mother.assignedAnm} for ${mother.riskLevel}-risk case`,
      aiAction: `Bedrock Agent analyzed ${mother.riskFactors.length} risk factors and determined immediate ANM intervention required. Task auto-created with ${mother.riskLevel === 'critical' ? '24hr' : '48hr'} SLA.`,
      agent: 'anm', agentName: mother.assignedAnm, riskLevel: mother.riskLevel,
    });
  }

  return { events, tasks, calls };
}

export function generateVitalsAlertScenario(mother: Mother): { events: TimelineEvent[]; tasks: Task[]; calls: AICallRecord[] } {
  const events: TimelineEvent[] = [];
  const tasks: Task[] = [];
  const calls: AICallRecord[] = [];
  const alertType = randomFrom(['low_hemoglobin', 'high_bp', 'weight_loss', 'fever']);
  const alertDescriptions: Record<string, { desc: string; action: string; taskType: string }> = {
    low_hemoglobin: {
      desc: `VITALS ALERT: ${mother.name}'s hemoglobin dropped to ${(mother.hemoglobin - 1.5).toFixed(1)} g/dL — severe anemia detected`,
      action: `AI correlated Hb trend (3 readings declining) with gestation week ${mother.gestationWeeks}. Auto-escalating to ANM for iron sucrose injection assessment. Nutrition counseling task created for ASHA worker.`,
      taskType: 'Anemia Management',
    },
    high_bp: {
      desc: `VITALS ALERT: ${mother.name}'s BP reading 158/102 mmHg — possible pre-eclampsia at ${mother.gestationWeeks} weeks`,
      action: `AI detected BP spike pattern over last 2 readings. Pre-eclampsia risk model score: 0.82. Auto-referring to District Hospital. Ambulance on standby. Doctor consultation scheduled.`,
      taskType: 'Pre-eclampsia Protocol',
    },
    weight_loss: {
      desc: `NUTRITION ALERT: ${mother.name} lost 2.3 kg in 2 weeks — inadequate weight gain for trimester ${mother.trimester}`,
      action: `AI nutrition model flagged insufficient caloric intake. Cross-referenced with socioeconomic data. Auto-enrolling in supplementary nutrition program. ASHA counseling task created.`,
      taskType: 'Nutrition Intervention',
    },
    fever: {
      desc: `VITALS ALERT: ${mother.name} reported fever (101.2°F) during AI call — possible infection at ${mother.gestationWeeks} weeks`,
      action: `Amazon Connect AI detected distress in voice sentiment analysis. Auto-escalating to ANM for immediate assessment. If UTI/malaria suspected, referral to CHC will be triggered.`,
      taskType: 'Fever Assessment',
    },
  };

  const alert = alertDescriptions[alertType];
  events.push({
    id: nextEventId(), timestamp: now(), type: 'vitals_alert',
    motherId: mother.id, motherName: mother.name,
    description: alert.desc, aiAction: alert.action, riskLevel: 'high',
  });

  tasks.push({
    id: nextTaskId(), motherId: mother.id, motherName: mother.name,
    assignedTo: mother.assignedAnm, assignedRole: 'anm',
    type: alert.taskType, description: `URGENT: ${alert.desc}. Assess and initiate treatment protocol.`,
    priority: 'high', status: 'pending', createdAt: now(),
    dueDate: new Date(Date.now() + 86400000).toISOString(), aiGenerated: true, escalationLevel: 0,
  });

  if (alertType === 'high_bp') {
    tasks.push({
      id: nextTaskId(), motherId: mother.id, motherName: mother.name,
      assignedTo: 'Dr. Sharma (District Hospital)', assignedRole: 'doctor',
      type: 'Specialist Consultation', description: `Pre-eclampsia suspected for ${mother.name}. Review vitals trend and advise on management/referral.`,
      priority: 'critical', status: 'pending', createdAt: now(),
      dueDate: new Date(Date.now() + 43200000).toISOString(), aiGenerated: true, escalationLevel: 1,
    });
    events.push({
      id: nextEventId(), timestamp: now(), type: 'escalation',
      motherId: mother.id, motherName: mother.name,
      description: `AI escalated ${mother.name}'s case to Dr. Sharma — pre-eclampsia protocol activated`,
      aiAction: 'Bedrock Agent triggered Level-2 escalation. Doctor notified via SMS + app push. Hospital bed pre-reserved at District Women Hospital.',
      agent: 'doctor', agentName: 'Dr. Sharma', riskLevel: 'critical',
    });
  }

  return { events, tasks, calls };
}

export function generateMissedAppointmentScenario(mother: Mother): { events: TimelineEvent[]; tasks: Task[]; calls: AICallRecord[] } {
  const events: TimelineEvent[] = [];
  const tasks: Task[] = [];
  const calls: AICallRecord[] = [];

  events.push({
    id: nextEventId(), timestamp: now(), type: 'missed_appointment',
    motherId: mother.id, motherName: mother.name,
    description: `${mother.name} missed scheduled ANC checkup (was due ${mother.nextCheckup})`,
    aiAction: `AI detected missed appointment. Initiating 3-tier follow-up: 1) Immediate AI call via Amazon Connect, 2) ASHA worker home visit task, 3) Auto-reschedule within 48hrs.`,
    riskLevel: mother.riskLevel === 'critical' ? 'critical' : 'medium',
  });

  calls.push({
    id: nextCallId(), motherId: mother.id, motherName: mother.name,
    callType: 'outbound_followup', status: 'completed', language: 'Hindi',
    summary: `AI called ${mother.name}. She reported difficulty traveling to PHC. Husband away for work. No transport available.`,
    sentiment: 'concerned', followUpRequired: true, timestamp: now(), duration: randomBetween(120, 300),
  });

  events.push({
    id: nextEventId(), timestamp: now(), type: 'ai_call_followup',
    motherId: mother.id, motherName: mother.name,
    description: `AI call completed — ${mother.name} cited transport difficulty. AI analyzing alternative solutions...`,
    aiAction: `Amazon Connect AI completed follow-up call (${randomBetween(2, 5)} min). Sentiment: Concerned. Root cause: Transport barrier. AI auto-arranging: 1) ASHA home visit with portable BP monitor, 2) If high-risk, ambulance pickup for hospital visit.`,
    agent: 'ai_callcenter',
  });

  tasks.push({
    id: nextTaskId(), motherId: mother.id, motherName: mother.name,
    assignedTo: mother.assignedAsha, assignedRole: 'asha',
    type: 'Home Visit - Missed Appointment', description: `${mother.name} missed ANC checkup due to transport issues. Conduct home visit with portable vitals kit. Check BP, weight, fetal heart rate.`,
    priority: mother.riskLevel === 'high' || mother.riskLevel === 'critical' ? 'high' : 'medium',
    status: 'pending', createdAt: now(),
    dueDate: new Date(Date.now() + 86400000).toISOString(), aiGenerated: true, escalationLevel: 0,
  });

  return { events, tasks, calls };
}

export function generateDeliveryPlanningScenario(mother: Mother): { events: TimelineEvent[]; tasks: Task[]; calls: AICallRecord[] } {
  const events: TimelineEvent[] = [];
  const tasks: Task[] = [];
  const calls: AICallRecord[] = [];

  const hospital = mother.riskLevel === 'critical' || mother.riskLevel === 'high'
    ? 'District Women Hospital, Lucknow' : 'CHC Mohanlalganj';
  const needsAmbulance = mother.riskLevel === 'critical' || mother.riskLevel === 'high' || Math.random() > 0.5;

  events.push({
    id: nextEventId(), timestamp: now(), type: 'delivery_planned',
    motherId: mother.id, motherName: mother.name,
    description: `AI initiated birth preparedness plan for ${mother.name} — EDD: ${mother.expectedDeliveryDate}, ${mother.gestationWeeks} weeks gestation`,
    aiAction: `Bedrock Agent created comprehensive delivery plan: Hospital: ${hospital} (bed pre-reserved), Blood group ${mother.bloodGroup} units arranged, ${needsAmbulance ? 'Ambulance pre-booked' : 'Transport confirmed'}, Emergency contacts notified. ASHA & ANM briefed.`,
    riskLevel: mother.riskLevel,
  });

  if (needsAmbulance) {
    events.push({
      id: nextEventId(), timestamp: now(), type: 'ambulance_dispatched',
      motherId: mother.id, motherName: mother.name,
      description: `Ambulance pre-booked for ${mother.name} — pickup from ${mother.village}, destination: ${hospital}`,
      aiAction: `AI checked 108 Ambulance Service availability. Nearest ambulance: UP32-T-1082 (${randomBetween(5, 20)} km away). ETA: ${randomBetween(15, 45)} minutes. GPS tracking enabled.`,
      agent: 'ambulance',
    });
  }

  events.push({
    id: nextEventId(), timestamp: now(), type: 'hospital_bed_reserved',
    motherId: mother.id, motherName: mother.name,
    description: `Hospital bed reserved at ${hospital} for ${mother.name}`,
    aiAction: `AI queried hospital bed management system. ${hospital}: ${randomBetween(3, 8)} beds available in maternity ward. ${mother.riskLevel === 'critical' ? 'OT and NICU on standby.' : ''} Blood bank notified for ${mother.bloodGroup} compatibility.`,
  });

  tasks.push({
    id: nextTaskId(), motherId: mother.id, motherName: mother.name,
    assignedTo: mother.assignedAsha, assignedRole: 'asha',
    type: 'Birth Preparedness Counseling', description: `Brief ${mother.name} and family on delivery plan. Hospital: ${hospital}. Ensure documents ready (Aadhaar, MCH card). Pack hospital bag.`,
    priority: mother.riskLevel, status: 'pending', createdAt: now(),
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(), aiGenerated: true, escalationLevel: 0,
  });

  return { events, tasks, calls };
}

export function generateEscalationScenario(mother: Mother): { events: TimelineEvent[]; tasks: Task[]; calls: AICallRecord[] } {
  const events: TimelineEvent[] = [];
  const tasks: Task[] = [];
  const calls: AICallRecord[] = [];

  events.push({
    id: nextEventId(), timestamp: now(), type: 'escalation',
    motherId: mother.id, motherName: mother.name,
    description: `ESCALATION: ASHA worker task overdue for ${mother.name} (critical case). No response in 48 hours.`,
    aiAction: `AI escalation engine activated: Level 1 (ASHA) → FAILED. Escalating to Level 2 (ANM Supervisor). If no response in 12hrs, auto-escalate to Level 3 (Block Medical Officer). District CMO dashboard flagged.`,
    agent: 'district_officer', riskLevel: 'critical',
  });

  tasks.push({
    id: nextTaskId(), motherId: mother.id, motherName: mother.name,
    assignedTo: 'Block Medical Officer', assignedRole: 'district_officer',
    type: 'Escalation - Unattended Critical Case', description: `CRITICAL: ${mother.name} (${mother.riskFactors.join(', ')}) has not been visited in 48+ hours. ASHA ${mother.assignedAsha} unresponsive. Immediate intervention required.`,
    priority: 'critical', status: 'pending', createdAt: now(),
    dueDate: new Date(Date.now() + 43200000).toISOString(), aiGenerated: true, escalationLevel: 2,
  });

  events.push({
    id: nextEventId(), timestamp: now(), type: 'task_assigned',
    motherId: mother.id, motherName: mother.name,
    description: `AI re-assigned ${mother.name}'s care to alternate ASHA worker and notified Block Medical Officer`,
    aiAction: `Bedrock Agent performed intelligent re-assignment. Original ASHA (${mother.assignedAsha}) marked for supervisor review. Alternate ASHA ${randomFrom(ASHA_WORKERS)} assigned. SMS + WhatsApp notification sent to BMO.`,
    agent: 'district_officer', riskLevel: 'critical',
  });

  return { events, tasks, calls };
}

export function generateAICallScenario(mother: Mother): { events: TimelineEvent[]; tasks: Task[]; calls: AICallRecord[] } {
  const events: TimelineEvent[] = [];
  const tasks: Task[] = [];
  const calls: AICallRecord[] = [];

  const callOutcome = randomFrom(['positive', 'concerned', 'distressed', 'no_answer'] as const);

  if (callOutcome === 'no_answer') {
    calls.push({
      id: nextCallId(), motherId: mother.id, motherName: mother.name,
      callType: 'outbound_checkup', status: 'no_answer', language: randomFrom(['Hindi', 'Bhojpuri']),
      followUpRequired: true, timestamp: now(),
    });
    events.push({
      id: nextEventId(), timestamp: now(), type: 'ai_call_made',
      motherId: mother.id, motherName: mother.name,
      description: `AI call to ${mother.name} — No answer (attempt 1/3)`,
      aiAction: `Amazon Connect: Call unanswered. AI scheduling retry in 2 hours. After 3 failed attempts, ASHA worker home visit will be auto-triggered. If critical case, immediate ASHA dispatch.`,
      agent: 'ai_callcenter',
    });
  } else {
    const summaries: Record<string, string> = {
      positive: `${mother.name} reports feeling well. Taking iron tablets regularly. No complaints. Baby movement normal.`,
      concerned: `${mother.name} reports mild swelling in feet and occasional headaches. Has been taking rest. Needs ANM assessment.`,
      distressed: `${mother.name} reports severe abdominal pain and spotting. Voice analysis indicates high distress. EMERGENCY PROTOCOL ACTIVATED.`,
    };
    calls.push({
      id: nextCallId(), motherId: mother.id, motherName: mother.name,
      callType: 'outbound_checkup', status: 'completed', language: randomFrom(['Hindi', 'Bhojpuri', 'Awadhi']),
      summary: summaries[callOutcome], sentiment: callOutcome as 'positive' | 'concerned' | 'distressed',
      followUpRequired: callOutcome !== 'positive', timestamp: now(), duration: randomBetween(90, 360),
    });
    events.push({
      id: nextEventId(), timestamp: now(), type: 'ai_call_made',
      motherId: mother.id, motherName: mother.name,
      description: `AI health check call completed with ${mother.name} — Sentiment: ${callOutcome.toUpperCase()}`,
      aiAction: callOutcome === 'distressed'
        ? `EMERGENCY: Amazon Connect AI detected distress. Voice sentiment score: 0.91 (critical). Auto-dispatching ambulance. ANM and doctor notified. Hospital bed being reserved.`
        : callOutcome === 'concerned'
        ? `Amazon Connect AI noted health concerns. Auto-creating ANM assessment task. Symptoms logged in health record. Follow-up call scheduled in 24hrs.`
        : `Routine check completed successfully. All parameters normal. Next AI call scheduled per protocol. Data synced to health record.`,
      agent: 'ai_callcenter', riskLevel: callOutcome === 'distressed' ? 'critical' : callOutcome === 'concerned' ? 'medium' : 'low',
    });

    if (callOutcome === 'distressed') {
      events.push({
        id: nextEventId(), timestamp: now(), type: 'ambulance_dispatched',
        motherId: mother.id, motherName: mother.name,
        description: `EMERGENCY: Ambulance dispatched for ${mother.name} from ${mother.village}`,
        aiAction: `AI emergency protocol: Nearest ambulance identified and dispatched. ETA: ${randomBetween(10, 30)} min. District Hospital notified. OT on standby. Blood bank alerted for ${mother.bloodGroup}.`,
        agent: 'ambulance', riskLevel: 'critical',
      });
    }
    if (callOutcome === 'concerned') {
      tasks.push({
        id: nextTaskId(), motherId: mother.id, motherName: mother.name,
        assignedTo: mother.assignedAnm, assignedRole: 'anm',
        type: 'Post-Call Assessment', description: `AI call flagged concerns for ${mother.name}: swelling and headaches. Assess for pre-eclampsia signs. Check BP and urine protein.`,
        priority: 'medium', status: 'pending', createdAt: now(),
        dueDate: new Date(Date.now() + 86400000).toISOString(), aiGenerated: true, escalationLevel: 0,
      });
    }
  }

  return { events, tasks, calls };
}

export function generateTaskCompletionScenario(task: Task, mother: Mother): { events: TimelineEvent[]; tasks: Task[] } {
  const events: TimelineEvent[] = [];
  const tasks: Task[] = [];

  events.push({
    id: nextEventId(), timestamp: now(), type: 'task_completed',
    motherId: mother.id, motherName: mother.name,
    description: `${task.assignedTo} completed: "${task.type}" for ${mother.name}`,
    aiAction: `AI verified task completion. Updated health record. ${mother.riskLevel === 'high' || mother.riskLevel === 'critical' ? 'Re-evaluating risk score based on new data...' : 'Next follow-up scheduled per protocol.'}`,
    agent: task.assignedRole, agentName: task.assignedTo,
  });

  if (Math.random() > 0.5) {
    tasks.push({
      id: nextTaskId(), motherId: mother.id, motherName: mother.name,
      assignedTo: mother.assignedAsha, assignedRole: 'asha',
      type: 'Follow-up Visit', description: `Routine follow-up for ${mother.name} after ${task.type}. Check compliance and vitals.`,
      priority: 'low', status: 'pending', createdAt: now(),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(), aiGenerated: true, escalationLevel: 0,
    });
  }

  return { events, tasks };
}

// ── Master scenario picker ───────────────────────────────────

const SCENARIOS = [
  { weight: 15, fn: generateRegistrationScenario },
  { weight: 25, fn: generateVitalsAlertScenario },
  { weight: 20, fn: generateMissedAppointmentScenario },
  { weight: 15, fn: generateDeliveryPlanningScenario },
  { weight: 10, fn: generateEscalationScenario },
  { weight: 15, fn: generateAICallScenario },
];

export function pickRandomScenario(mother: Mother) {
  const total = SCENARIOS.reduce((s, sc) => s + sc.weight, 0);
  let r = Math.random() * total;
  for (const sc of SCENARIOS) {
    r -= sc.weight;
    if (r <= 0) return sc.fn(mother);
  }
  return SCENARIOS[0].fn(mother);
}
