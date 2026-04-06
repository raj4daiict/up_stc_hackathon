import React, { createContext, useContext, useReducer } from 'react';
import type { PreparednessState, PrepAction, ReadinessStatus } from './preparednessTypes';
import { INITIAL_PREP_STATE } from './preparednessTypes';

function deriveState(nextStep: number, current: PreparednessState): PreparednessState {
  const allTrue = Object.fromEntries(Object.keys(current.ashaChecklist).map(k => [k, true]));

  let hospital: ReadinessStatus = current.stakeholders.hospital;
  if (nextStep >= 7) hospital = 'escalated';
  if (nextStep >= 10) hospital = 'ready'; // overrides escalated

  return {
    ...current,
    step: nextStep,
    triggerFired: nextStep >= 1,
    ashaChecklist: nextStep >= 5 ? allTrue : current.ashaChecklist,
    supervisorNotified: nextStep >= 8 ? true : current.supervisorNotified,
    escalationResolved: nextStep >= 10 ? true : current.escalationResolved,
    stakeholders: {
      patient:    nextStep >= 11 ? 'ready' : current.stakeholders.patient,
      family:     nextStep >= 11 ? 'ready' : current.stakeholders.family,
      asha:       nextStep >= 5  ? 'ready' : current.stakeholders.asha,
      hospital,
      transport:  nextStep >= 6  ? 'ready' : current.stakeholders.transport,
      doctor:     nextStep >= 11 ? 'ready' : current.stakeholders.doctor,
      supervisor: nextStep >= 11 ? 'ready' : current.stakeholders.supervisor,
    },
  };
}

function preparednessReducer(state: PreparednessState, action: PrepAction): PreparednessState {
  switch (action.type) {
    case 'NEXT_STEP': {
      if (state.step >= 11) return state;
      return deriveState(state.step + 1, state);
    }
    case 'PREV_STEP': {
      if (state.step <= 0) return state;
      return deriveState(state.step - 1, INITIAL_PREP_STATE);
    }
    case 'CONFIRM_STAKEHOLDER': {
      return {
        ...state,
        stakeholders: { ...state.stakeholders, [action.payload]: 'ready' },
      };
    }
    case 'ESCALATE_HOSPITAL': {
      return {
        ...state,
        stakeholders: { ...state.stakeholders, hospital: 'escalated' },
        supervisorNotified: true,
      };
    }
    case 'RESOLVE_ESCALATION': {
      return {
        ...state,
        stakeholders: { ...state.stakeholders, hospital: 'ready' },
        escalationResolved: true,
      };
    }
    case 'SUBMIT_PREP_JOURNAL': {
      return { ...state, journals: [...state.journals, action.payload] };
    }
    case 'RESET_PREP': {
      return INITIAL_PREP_STATE;
    }
    default:
      return state;
  }
}

interface PreparednessContextValue {
  state: PreparednessState;
  dispatch: React.Dispatch<PrepAction>;
}

export const PreparednessContext = createContext<PreparednessContextValue | null>(null);

export function usePreparednessContext(): PreparednessContextValue {
  const ctx = useContext(PreparednessContext);
  if (!ctx) throw new Error('usePreparednessContext must be used within PreparednessProvider');
  return ctx;
}

export function PreparednessProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(preparednessReducer, INITIAL_PREP_STATE);
  return (
    <PreparednessContext.Provider value={{ state, dispatch }}>
      {children}
    </PreparednessContext.Provider>
  );
}
