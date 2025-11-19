/**
 * Decision Session Reducer - Olumi Pre-Mortem Tool v2.0
 * Manages conversational decision analysis state
 */

import { v4 as uuidv4 } from 'uuid';
import {
  DecisionSession,
  Message,
  DecisionOption,
  DecisionFactor,
  Stakeholder,
  FailureScenario,
  Mitigation,
  Lesson,
  ExtractedContext,
} from '@/types/sharedModels';
import { AIModel } from '@/types/premortem';

/* ============================================
   STATE INTERFACE
   ============================================ */

export interface SessionState {
  session: DecisionSession | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Chat State
  chatExpanded: boolean;
  chatHeight: number;
  isTyping: boolean;

  // AI Provider (maintain existing multi-provider support)
  selectedModel: AIModel | null;

  // Active Operations
  activeOperations: {
    framing: boolean;
    generating_scenarios: boolean;
    generating_mitigations: boolean;
    generating_summary: boolean;
    conducting_postmortem: boolean;
  };
}

export const initialState: SessionState = {
  session: null,
  isLoading: false,
  error: null,
  chatExpanded: true,
  chatHeight: 400,
  isTyping: false,
  selectedModel: null,
  activeOperations: {
    framing: false,
    generating_scenarios: false,
    generating_mitigations: false,
    generating_summary: false,
    conducting_postmortem: false,
  },
};

/* ============================================
   ACTION TYPES
   ============================================ */

export type SessionAction =
  // Session Management
  | { type: 'START_SESSION'; payload: { question: string; model: AIModel } }
  | { type: 'LOAD_SESSION'; payload: DecisionSession }
  | { type: 'RESET_SESSION' }

  // Decision Context
  | { type: 'UPDATE_CONTEXT'; payload: Partial<DecisionSession['decision']> }
  | { type: 'ADD_OPTION'; payload: DecisionOption }
  | { type: 'UPDATE_OPTION'; payload: { id: string; updates: Partial<DecisionOption> } }
  | { type: 'REMOVE_OPTION'; payload: string }
  | { type: 'ADD_FACTOR'; payload: DecisionFactor }
  | { type: 'UPDATE_FACTOR'; payload: { id: string; updates: Partial<DecisionFactor> } }
  | { type: 'REMOVE_FACTOR'; payload: string }
  | { type: 'ADD_STAKEHOLDER'; payload: Stakeholder }
  | { type: 'REMOVE_STAKEHOLDER'; payload: string }
  | { type: 'EXTRACT_CONTEXT'; payload: ExtractedContext }

  // Conversation
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } }
  | { type: 'SET_TYPING'; payload: boolean }

  // Pre-Mortem
  | { type: 'SET_PREMORTEM'; payload: DecisionSession['premortem'] }
  | { type: 'ADD_SCENARIO'; payload: FailureScenario }
  | { type: 'UPDATE_SCENARIO'; payload: { id: string; updates: Partial<FailureScenario> } }
  | { type: 'REMOVE_SCENARIO'; payload: string }
  | { type: 'ADD_MITIGATION'; payload: Mitigation }
  | { type: 'UPDATE_MITIGATION'; payload: { id: string; updates: Partial<Mitigation> } }
  | { type: 'REMOVE_MITIGATION'; payload: string }
  | { type: 'TOGGLE_MITIGATION_PRIORITY'; payload: string }

  // Post-Mortem
  | { type: 'START_POSTMORTEM'; payload: { outcome: 'success' | 'failure' | 'mixed'; description: string } }
  | { type: 'ADD_LESSON'; payload: Lesson }
  | { type: 'UPDATE_LESSON'; payload: { id: string; updates: Partial<Lesson> } }
  | { type: 'SET_ACCURACY_SCORE'; payload: number }

  // UI State
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_CHAT_HEIGHT'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_OPERATION'; payload: { operation: keyof SessionState['activeOperations']; active: boolean } }

  // AI Provider
  | { type: 'SET_MODEL'; payload: AIModel };

/* ============================================
   REDUCER
   ============================================ */

export function sessionReducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    /* ========================================
       SESSION MANAGEMENT
       ======================================== */

    case 'START_SESSION': {
      const now = new Date().toISOString();
      const newSession: DecisionSession = {
        id: uuidv4(),
        type: 'pre-mortem',
        created_at: now,
        updated_at: now,
        decision: {
          question: action.payload.question,
          context: '',
          status: 'framing',
          options: [],
          factors: [],
          stakeholders: [],
        },
        conversation: [
          {
            id: uuidv4(),
            role: 'system',
            content: `Session started: ${action.payload.question}`,
            timestamp: now,
          },
        ],
      };

      return {
        ...state,
        session: newSession,
        selectedModel: action.payload.model,
        error: null,
      };
    }

    case 'LOAD_SESSION': {
      return {
        ...state,
        session: action.payload,
        error: null,
      };
    }

    case 'RESET_SESSION': {
      return {
        ...initialState,
        selectedModel: state.selectedModel,
      };
    }

    /* ========================================
       DECISION CONTEXT
       ======================================== */

    case 'UPDATE_CONTEXT': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            ...action.payload,
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'ADD_OPTION': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            options: [...state.session.decision.options, action.payload],
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'UPDATE_OPTION': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            options: state.session.decision.options.map((opt) =>
              opt.id === action.payload.id
                ? { ...opt, ...action.payload.updates }
                : opt
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'REMOVE_OPTION': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            options: state.session.decision.options.filter(
              (opt) => opt.id !== action.payload
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'ADD_FACTOR': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            factors: [...state.session.decision.factors, action.payload],
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'UPDATE_FACTOR': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            factors: state.session.decision.factors.map((factor) =>
              factor.id === action.payload.id
                ? { ...factor, ...action.payload.updates }
                : factor
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'REMOVE_FACTOR': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            factors: state.session.decision.factors.filter(
              (factor) => factor.id !== action.payload
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'ADD_STAKEHOLDER': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            stakeholders: [...state.session.decision.stakeholders, action.payload],
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'REMOVE_STAKEHOLDER': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            stakeholders: state.session.decision.stakeholders.filter(
              (sh) => sh.id !== action.payload
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'EXTRACT_CONTEXT': {
      if (!state.session) return state;

      const now = new Date().toISOString();

      // Merge extracted entities with existing ones
      const newOptions: DecisionOption[] = action.payload.options.map((opt) => ({
        id: opt.id || uuidv4(),
        title: opt.title || '',
        description: opt.description || '',
        confidence: opt.confidence || 50,
        ai_generated: true,
        created_at: opt.created_at || now,
      }));

      const newFactors: DecisionFactor[] = action.payload.factors.map((factor) => ({
        id: factor.id || uuidv4(),
        name: factor.name || '',
        description: factor.description || '',
        importance: factor.importance || 'medium',
        type: factor.type || 'assumption',
        ai_generated: true,
        created_at: factor.created_at || now,
      }));

      const newStakeholders: Stakeholder[] = action.payload.stakeholders.map((sh) => ({
        id: sh.id || uuidv4(),
        name: sh.name || '',
        role: sh.role || '',
        influence: sh.influence || 'medium',
        ai_generated: true,
        created_at: sh.created_at || now,
      }));

      return {
        ...state,
        session: {
          ...state.session,
          decision: {
            ...state.session.decision,
            options: [...state.session.decision.options, ...newOptions],
            factors: [...state.session.decision.factors, ...newFactors],
            stakeholders: [...state.session.decision.stakeholders, ...newStakeholders],
            status: 'active',
          },
          updated_at: now,
        },
      };
    }

    /* ========================================
       CONVERSATION
       ======================================== */

    case 'ADD_MESSAGE': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          conversation: [...state.session.conversation, action.payload],
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'UPDATE_MESSAGE': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          conversation: state.session.conversation.map((msg) =>
            msg.id === action.payload.id
              ? { ...msg, ...action.payload.updates }
              : msg
          ),
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'SET_TYPING': {
      return {
        ...state,
        isTyping: action.payload,
      };
    }

    /* ========================================
       PRE-MORTEM
       ======================================== */

    case 'SET_PREMORTEM': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: action.payload,
          decision: {
            ...state.session.decision,
            status: 'active',
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'ADD_SCENARIO': {
      if (!state.session || !state.session.premortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: {
            ...state.session.premortem,
            failure_scenarios: [
              ...state.session.premortem.failure_scenarios,
              action.payload,
            ],
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'UPDATE_SCENARIO': {
      if (!state.session || !state.session.premortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: {
            ...state.session.premortem,
            failure_scenarios: state.session.premortem.failure_scenarios.map(
              (scenario) =>
                scenario.id === action.payload.id
                  ? { ...scenario, ...action.payload.updates }
                  : scenario
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'REMOVE_SCENARIO': {
      if (!state.session || !state.session.premortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: {
            ...state.session.premortem,
            failure_scenarios: state.session.premortem.failure_scenarios.filter(
              (scenario) => scenario.id !== action.payload
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'ADD_MITIGATION': {
      if (!state.session || !state.session.premortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: {
            ...state.session.premortem,
            mitigations: [...state.session.premortem.mitigations, action.payload],
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'UPDATE_MITIGATION': {
      if (!state.session || !state.session.premortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: {
            ...state.session.premortem,
            mitigations: state.session.premortem.mitigations.map((mitigation) =>
              mitigation.id === action.payload.id
                ? { ...mitigation, ...action.payload.updates }
                : mitigation
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'REMOVE_MITIGATION': {
      if (!state.session || !state.session.premortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: {
            ...state.session.premortem,
            mitigations: state.session.premortem.mitigations.filter(
              (mitigation) => mitigation.id !== action.payload
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'TOGGLE_MITIGATION_PRIORITY': {
      if (!state.session || !state.session.premortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          premortem: {
            ...state.session.premortem,
            mitigations: state.session.premortem.mitigations.map((mitigation) =>
              mitigation.id === action.payload
                ? { ...mitigation, priority: !mitigation.priority }
                : mitigation
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    /* ========================================
       POST-MORTEM
       ======================================== */

    case 'START_POSTMORTEM': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          postmortem: {
            actual_outcome: action.payload.outcome,
            outcome_description: action.payload.description,
            lessons_learned: [],
            accuracy_score: 0,
            reviewed_at: new Date().toISOString(),
          },
          decision: {
            ...state.session.decision,
            status: 'reviewed',
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'ADD_LESSON': {
      if (!state.session || !state.session.postmortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          postmortem: {
            ...state.session.postmortem,
            lessons_learned: [
              ...state.session.postmortem.lessons_learned,
              action.payload,
            ],
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'UPDATE_LESSON': {
      if (!state.session || !state.session.postmortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          postmortem: {
            ...state.session.postmortem,
            lessons_learned: state.session.postmortem.lessons_learned.map(
              (lesson) =>
                lesson.id === action.payload.id
                  ? { ...lesson, ...action.payload.updates }
                  : lesson
            ),
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    case 'SET_ACCURACY_SCORE': {
      if (!state.session || !state.session.postmortem) return state;

      return {
        ...state,
        session: {
          ...state.session,
          postmortem: {
            ...state.session.postmortem,
            accuracy_score: action.payload,
          },
          updated_at: new Date().toISOString(),
        },
      };
    }

    /* ========================================
       UI STATE
       ======================================== */

    case 'TOGGLE_CHAT': {
      return {
        ...state,
        chatExpanded: !state.chatExpanded,
      };
    }

    case 'SET_CHAT_HEIGHT': {
      return {
        ...state,
        chatHeight: action.payload,
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }

    case 'SET_OPERATION': {
      return {
        ...state,
        activeOperations: {
          ...state.activeOperations,
          [action.payload.operation]: action.payload.active,
        },
      };
    }

    /* ========================================
       AI PROVIDER
       ======================================== */

    case 'SET_MODEL': {
      return {
        ...state,
        selectedModel: action.payload,
      };
    }

    default:
      return state;
  }
}
