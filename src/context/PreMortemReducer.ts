import { v4 as uuidv4 } from 'uuid';
import {
  PreMortemAnalysis,
  Decision,
  Scenario,
  RootCause,
  MitigationStrategy,
  AIModel,
  AI_MODELS,
} from '@/types/premortem';

export interface AppState {
  currentAnalysis: PreMortemAnalysis | null;
  currentStep: number;
  isLoading: boolean;
  error: Error | null;
  aiCallsInProgress: {
    scenarios: boolean;
    rootCauses: Record<string, boolean>;
    mitigations: Record<string, boolean>;
    summary: boolean;
  };
}

export const initialState: AppState = {
  currentAnalysis: null,
  currentStep: 1,
  isLoading: false,
  error: null,
  aiCallsInProgress: {
    scenarios: false,
    rootCauses: {},
    mitigations: {},
    summary: false,
  },
};

export type Action =
  | { type: 'INITIALIZE_ANALYSIS' }
  | { type: 'LOAD_ANALYSIS'; payload: PreMortemAnalysis }
  | { type: 'UPDATE_DECISION_INPUT'; payload: Decision }
  | { type: 'ADD_USER_THOUGHTS'; payload: string }
  | { type: 'SET_AI_MODEL'; payload: AIModel }
  | { type: 'SET_AI_SCENARIOS'; payload: Scenario[] }
  | { type: 'ADD_SCENARIO'; payload: Scenario }
  | { type: 'EDIT_SCENARIO'; payload: { id: string; updates: Partial<Scenario> } }
  | { type: 'DELETE_SCENARIO'; payload: string }
  | { type: 'FLAG_SCENARIO'; payload: string }
  | { type: 'ADD_ROOT_CAUSES'; payload: { scenarioId: string; rootCauses: RootCause[] } }
  | { type: 'EDIT_ROOT_CAUSE'; payload: { scenarioId: string; rootCauseId: string; updates: Partial<RootCause> } }
  | { type: 'DELETE_ROOT_CAUSE'; payload: { scenarioId: string; rootCauseId: string } }
  | { type: 'SET_MITIGATION_STRATEGIES'; payload: MitigationStrategy[] }
  | { type: 'ADD_MITIGATION_STRATEGY'; payload: MitigationStrategy }
  | { type: 'EDIT_MITIGATION_STRATEGY'; payload: { id: string; updates: Partial<MitigationStrategy> } }
  | { type: 'DELETE_MITIGATION_STRATEGY'; payload: string }
  | { type: 'TOGGLE_STRATEGY_PRIORITY'; payload: string }
  | { type: 'UPDATE_ADJUSTED_CONFIDENCE'; payload: number }
  | { type: 'ADD_KEY_INSIGHT'; payload: string }
  | { type: 'ADVANCE_STEP' }
  | { type: 'GO_BACK_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_AI_SCENARIOS_LOADING'; payload: boolean }
  | { type: 'SET_AI_ROOT_CAUSES_LOADING'; payload: { scenarioId: string; loading: boolean } }
  | { type: 'SET_AI_MITIGATIONS_LOADING'; payload: { rootCauseId: string; loading: boolean } }
  | { type: 'SET_AI_SUMMARY_LOADING'; payload: boolean }
  | { type: 'MARK_EXPORTED' }
  | { type: 'RESET' };

export function preMortemReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INITIALIZE_ANALYSIS': {
      const newAnalysis: PreMortemAnalysis = {
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        decision: {
          title: '',
          description: '',
          type: 'Product Strategy',
          timeline: '6 months',
          initialConfidence: 50,
        },
        scenarios: [],
        mitigationStrategies: [],
        adjustedConfidence: 50,
        completionStatus: 'in-progress',
        currentStep: 1,
        aiModel: AI_MODELS.anthropic[0], // Default to Claude Sonnet 4
      };

      return {
        ...state,
        currentAnalysis: newAnalysis,
        currentStep: 1,
      };
    }

    case 'LOAD_ANALYSIS': {
      return {
        ...state,
        currentAnalysis: action.payload,
        currentStep: action.payload.currentStep,
      };
    }

    case 'UPDATE_DECISION_INPUT': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          decision: action.payload,
          updatedAt: new Date(),
        },
      };
    }

    case 'ADD_USER_THOUGHTS': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          userInitialThoughts: action.payload,
          updatedAt: new Date(),
        },
      };
    }

    case 'SET_AI_MODEL': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          aiModel: action.payload,
          updatedAt: new Date(),
        },
      };
    }

    case 'SET_AI_SCENARIOS': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: action.payload,
          updatedAt: new Date(),
        },
      };
    }

    case 'ADD_SCENARIO': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: [...state.currentAnalysis.scenarios, action.payload],
          updatedAt: new Date(),
        },
      };
    }

    case 'EDIT_SCENARIO': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: state.currentAnalysis.scenarios.map((scenario) =>
            scenario.id === action.payload.id
              ? { ...scenario, ...action.payload.updates, userEdited: true }
              : scenario
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'DELETE_SCENARIO': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: state.currentAnalysis.scenarios.filter(
            (scenario) => scenario.id !== action.payload
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'FLAG_SCENARIO': {
      if (!state.currentAnalysis) return state;

      const flaggedCount = state.currentAnalysis.scenarios.filter(
        (s) => s.flaggedAsConcerning
      ).length;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: state.currentAnalysis.scenarios.map((scenario) => {
            if (scenario.id === action.payload) {
              // Toggle flag
              const newFlagState = !scenario.flaggedAsConcerning;

              // Check if we're exceeding max 3 flags
              if (newFlagState && flaggedCount >= 3) {
                // Don't allow more than 3 flags
                return scenario;
              }

              return { ...scenario, flaggedAsConcerning: newFlagState };
            }
            return scenario;
          }),
          updatedAt: new Date(),
        },
      };
    }

    case 'ADD_ROOT_CAUSES': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: state.currentAnalysis.scenarios.map((scenario) =>
            scenario.id === action.payload.scenarioId
              ? {
                  ...scenario,
                  rootCauses: [
                    ...scenario.rootCauses,
                    ...action.payload.rootCauses,
                  ],
                }
              : scenario
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'EDIT_ROOT_CAUSE': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: state.currentAnalysis.scenarios.map((scenario) =>
            scenario.id === action.payload.scenarioId
              ? {
                  ...scenario,
                  rootCauses: scenario.rootCauses.map((rc) =>
                    rc.id === action.payload.rootCauseId
                      ? { ...rc, ...action.payload.updates, userEdited: true }
                      : rc
                  ),
                }
              : scenario
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'DELETE_ROOT_CAUSE': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          scenarios: state.currentAnalysis.scenarios.map((scenario) =>
            scenario.id === action.payload.scenarioId
              ? {
                  ...scenario,
                  rootCauses: scenario.rootCauses.filter(
                    (rc) => rc.id !== action.payload.rootCauseId
                  ),
                }
              : scenario
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'SET_MITIGATION_STRATEGIES': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          mitigationStrategies: action.payload,
          updatedAt: new Date(),
        },
      };
    }

    case 'ADD_MITIGATION_STRATEGY': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          mitigationStrategies: [
            ...state.currentAnalysis.mitigationStrategies,
            action.payload,
          ],
          updatedAt: new Date(),
        },
      };
    }

    case 'EDIT_MITIGATION_STRATEGY': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          mitigationStrategies: state.currentAnalysis.mitigationStrategies.map(
            (strategy) =>
              strategy.id === action.payload.id
                ? { ...strategy, ...action.payload.updates, userEdited: true }
                : strategy
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'DELETE_MITIGATION_STRATEGY': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          mitigationStrategies: state.currentAnalysis.mitigationStrategies.filter(
            (strategy) => strategy.id !== action.payload
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'TOGGLE_STRATEGY_PRIORITY': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          mitigationStrategies: state.currentAnalysis.mitigationStrategies.map(
            (strategy) =>
              strategy.id === action.payload
                ? { ...strategy, priority: !strategy.priority }
                : strategy
          ),
          updatedAt: new Date(),
        },
      };
    }

    case 'UPDATE_ADJUSTED_CONFIDENCE': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          adjustedConfidence: action.payload,
          updatedAt: new Date(),
        },
      };
    }

    case 'ADD_KEY_INSIGHT': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          keyInsight: action.payload,
          updatedAt: new Date(),
        },
      };
    }

    case 'ADVANCE_STEP': {
      const nextStep = Math.min(state.currentStep + 1, 8);

      return {
        ...state,
        currentStep: nextStep,
        currentAnalysis: state.currentAnalysis
          ? {
              ...state.currentAnalysis,
              currentStep: nextStep,
              updatedAt: new Date(),
            }
          : null,
      };
    }

    case 'GO_BACK_STEP': {
      const prevStep = Math.max(state.currentStep - 1, 1);

      return {
        ...state,
        currentStep: prevStep,
        currentAnalysis: state.currentAnalysis
          ? {
              ...state.currentAnalysis,
              currentStep: prevStep,
              updatedAt: new Date(),
            }
          : null,
      };
    }

    case 'GO_TO_STEP': {
      const step = Math.max(1, Math.min(action.payload, 8));

      return {
        ...state,
        currentStep: step,
        currentAnalysis: state.currentAnalysis
          ? {
              ...state.currentAnalysis,
              currentStep: step,
              updatedAt: new Date(),
            }
          : null,
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

    case 'SET_AI_SCENARIOS_LOADING': {
      return {
        ...state,
        aiCallsInProgress: {
          ...state.aiCallsInProgress,
          scenarios: action.payload,
        },
      };
    }

    case 'SET_AI_ROOT_CAUSES_LOADING': {
      return {
        ...state,
        aiCallsInProgress: {
          ...state.aiCallsInProgress,
          rootCauses: {
            ...state.aiCallsInProgress.rootCauses,
            [action.payload.scenarioId]: action.payload.loading,
          },
        },
      };
    }

    case 'SET_AI_MITIGATIONS_LOADING': {
      return {
        ...state,
        aiCallsInProgress: {
          ...state.aiCallsInProgress,
          mitigations: {
            ...state.aiCallsInProgress.mitigations,
            [action.payload.rootCauseId]: action.payload.loading,
          },
        },
      };
    }

    case 'SET_AI_SUMMARY_LOADING': {
      return {
        ...state,
        aiCallsInProgress: {
          ...state.aiCallsInProgress,
          summary: action.payload,
        },
      };
    }

    case 'MARK_EXPORTED': {
      if (!state.currentAnalysis) return state;

      return {
        ...state,
        currentAnalysis: {
          ...state.currentAnalysis,
          exportedAt: new Date(),
          completionStatus: 'completed',
          updatedAt: new Date(),
        },
      };
    }

    case 'RESET': {
      return initialState;
    }

    default:
      return state;
  }
}
