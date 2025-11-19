import { describe, it, expect } from 'vitest';
import { preMortemReducer, initialState } from '@/context/PreMortemReducer';
import { Scenario, MitigationStrategy } from '@/types/premortem';

describe('PreMortemReducer', () => {
  describe('INITIALIZE_ANALYSIS', () => {
    it('should create a new analysis with default values', () => {
      const action = { type: 'INITIALIZE_ANALYSIS' as const };
      const newState = preMortemReducer(initialState, action);

      expect(newState.currentAnalysis).toBeTruthy();
      expect(newState.currentAnalysis!.decision.title).toBe('');
      expect(newState.currentAnalysis!.decision.initialConfidence).toBe(50);
      expect(newState.currentAnalysis!.scenarios).toEqual([]);
      expect(newState.currentStep).toBe(1);
    });

    it('should generate unique ID for analysis', () => {
      const action = { type: 'INITIALIZE_ANALYSIS' as const };
      const state1 = preMortemReducer(initialState, action);
      const state2 = preMortemReducer(initialState, action);

      expect(state1.currentAnalysis!.id).not.toBe(state2.currentAnalysis!.id);
    });
  });

  describe('UPDATE_DECISION_INPUT', () => {
    it('should update decision data', () => {
      const stateWithAnalysis = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      const action = {
        type: 'UPDATE_DECISION_INPUT' as const,
        payload: {
          title: 'Launch AI feature',
          description: 'Implement new search',
          type: 'Feature Launch' as const,
          timeline: '6 months' as const,
          initialConfidence: 80,
        },
      };

      const newState = preMortemReducer(stateWithAnalysis, action);

      expect(newState.currentAnalysis!.decision.title).toBe('Launch AI feature');
      expect(newState.currentAnalysis!.decision.initialConfidence).toBe(80);
    });

    it('should update updatedAt timestamp', () => {
      const stateWithAnalysis = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      const originalUpdatedAt = stateWithAnalysis.currentAnalysis!.updatedAt;

      // Small delay to ensure timestamp changes
      const action = {
        type: 'UPDATE_DECISION_INPUT' as const,
        payload: stateWithAnalysis.currentAnalysis!.decision,
      };

      const newState = preMortemReducer(stateWithAnalysis, action);

      expect(newState.currentAnalysis!.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe('SET_AI_SCENARIOS', () => {
    it('should set scenarios from AI', () => {
      const stateWithAnalysis = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      const scenarios: Scenario[] = [
        {
          id: 'scenario-1',
          title: 'Poor user adoption',
          description: 'Users find feature confusing',
          likelihood: 'Medium',
          impact: 'High',
          category: 'Market',
          flaggedAsConcerning: false,
          userEdited: false,
          source: 'ai',
          reasoning: 'Based on similar launches',
          rootCauses: [],
        },
      ];

      const action = {
        type: 'SET_AI_SCENARIOS' as const,
        payload: scenarios,
      };

      const newState = preMortemReducer(stateWithAnalysis, action);

      expect(newState.currentAnalysis!.scenarios).toHaveLength(1);
      expect(newState.currentAnalysis!.scenarios[0].title).toBe(
        'Poor user adoption'
      );
    });
  });

  describe('FLAG_SCENARIO', () => {
    it('should toggle scenario flag', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, {
        type: 'ADD_SCENARIO',
        payload: {
          id: 'scenario-1',
          title: 'Test',
          description: 'Test',
          likelihood: 'Medium',
          impact: 'High',
          category: 'Technical',
          flaggedAsConcerning: false,
          userEdited: false,
          source: 'user',
          rootCauses: [],
        },
      });

      // Flag it
      state = preMortemReducer(state, {
        type: 'FLAG_SCENARIO',
        payload: 'scenario-1',
      });

      expect(state.currentAnalysis!.scenarios[0].flaggedAsConcerning).toBe(true);

      // Unflag it
      state = preMortemReducer(state, {
        type: 'FLAG_SCENARIO',
        payload: 'scenario-1',
      });

      expect(state.currentAnalysis!.scenarios[0].flaggedAsConcerning).toBe(
        false
      );
    });

    it('should not allow more than 3 flagged scenarios', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      // Add 4 scenarios
      for (let i = 1; i <= 4; i++) {
        state = preMortemReducer(state, {
          type: 'ADD_SCENARIO',
          payload: {
            id: `scenario-${i}`,
            title: `Scenario ${i}`,
            description: 'Test',
            likelihood: 'Medium',
            impact: 'High',
            category: 'Technical',
            flaggedAsConcerning: false,
            userEdited: false,
            source: 'user',
            rootCauses: [],
          },
        });
      }

      // Flag first 3
      for (let i = 1; i <= 3; i++) {
        state = preMortemReducer(state, {
          type: 'FLAG_SCENARIO',
          payload: `scenario-${i}`,
        });
      }

      const flaggedCount = state.currentAnalysis!.scenarios.filter(
        (s) => s.flaggedAsConcerning
      ).length;
      expect(flaggedCount).toBe(3);

      // Try to flag 4th - should not work
      state = preMortemReducer(state, {
        type: 'FLAG_SCENARIO',
        payload: 'scenario-4',
      });

      const stillFlaggedCount = state.currentAnalysis!.scenarios.filter(
        (s) => s.flaggedAsConcerning
      ).length;
      expect(stillFlaggedCount).toBe(3);
      expect(
        state.currentAnalysis!.scenarios.find((s) => s.id === 'scenario-4')!
          .flaggedAsConcerning
      ).toBe(false);
    });
  });

  describe('ADD_ROOT_CAUSES', () => {
    it('should add root causes to scenario', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, {
        type: 'ADD_SCENARIO',
        payload: {
          id: 'scenario-1',
          title: 'Test',
          description: 'Test',
          likelihood: 'Medium',
          impact: 'High',
          category: 'Technical',
          flaggedAsConcerning: false,
          userEdited: false,
          source: 'user',
          rootCauses: [],
        },
      });

      state = preMortemReducer(state, {
        type: 'ADD_ROOT_CAUSES',
        payload: {
          scenarioId: 'scenario-1',
          rootCauses: [
            {
              id: 'rc-1',
              cause: 'Insufficient testing',
              explanation: 'Not enough QA time',
              userEdited: false,
            },
          ],
        },
      });

      const scenario = state.currentAnalysis!.scenarios.find(
        (s) => s.id === 'scenario-1'
      );
      expect(scenario!.rootCauses).toHaveLength(1);
      expect(scenario!.rootCauses[0].cause).toBe('Insufficient testing');
    });
  });

  describe('SET_MITIGATION_STRATEGIES', () => {
    it('should replace all mitigation strategies', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      const strategies: MitigationStrategy[] = [
        {
          id: 'strat-1',
          rootCauseIds: ['rc-1'],
          title: 'Increase testing',
          description: 'Add more QA time',
          effort: 'Medium',
          impact: 'High',
          timing: 'Pre-decision',
          priority: false,
          userEdited: false,
        },
      ];

      state = preMortemReducer(state, {
        type: 'SET_MITIGATION_STRATEGIES',
        payload: strategies,
      });

      expect(state.currentAnalysis!.mitigationStrategies).toHaveLength(1);
      expect(state.currentAnalysis!.mitigationStrategies[0].title).toBe(
        'Increase testing'
      );
    });
  });

  describe('TOGGLE_STRATEGY_PRIORITY', () => {
    it('should toggle strategy priority', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, {
        type: 'ADD_MITIGATION_STRATEGY',
        payload: {
          id: 'strat-1',
          rootCauseIds: [],
          title: 'Test',
          description: 'Test',
          effort: 'Low',
          impact: 'High',
          timing: 'Pre-decision',
          priority: false,
          userEdited: false,
        },
      });

      state = preMortemReducer(state, {
        type: 'TOGGLE_STRATEGY_PRIORITY',
        payload: 'strat-1',
      });

      expect(state.currentAnalysis!.mitigationStrategies[0].priority).toBe(true);

      state = preMortemReducer(state, {
        type: 'TOGGLE_STRATEGY_PRIORITY',
        payload: 'strat-1',
      });

      expect(state.currentAnalysis!.mitigationStrategies[0].priority).toBe(
        false
      );
    });
  });

  describe('UPDATE_ADJUSTED_CONFIDENCE', () => {
    it('should update adjusted confidence', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, {
        type: 'UPDATE_ADJUSTED_CONFIDENCE',
        payload: 65,
      });

      expect(state.currentAnalysis!.adjustedConfidence).toBe(65);
    });
  });

  describe('ADD_KEY_INSIGHT', () => {
    it('should add key insight', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, {
        type: 'ADD_KEY_INSIGHT',
        payload: 'Need more user research',
      });

      expect(state.currentAnalysis!.keyInsight).toBe('Need more user research');
    });
  });

  describe('ADVANCE_STEP', () => {
    it('should advance to next step', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, { type: 'ADVANCE_STEP' });

      expect(state.currentStep).toBe(2);
      expect(state.currentAnalysis!.currentStep).toBe(2);
    });

    it('should not advance past step 8', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      // Advance to step 8
      for (let i = 1; i < 8; i++) {
        state = preMortemReducer(state, { type: 'ADVANCE_STEP' });
      }

      expect(state.currentStep).toBe(8);

      // Try to advance again
      state = preMortemReducer(state, { type: 'ADVANCE_STEP' });

      expect(state.currentStep).toBe(8); // Should stay at 8
    });
  });

  describe('GO_BACK_STEP', () => {
    it('should go back to previous step', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, { type: 'ADVANCE_STEP' });
      state = preMortemReducer(state, { type: 'ADVANCE_STEP' });

      expect(state.currentStep).toBe(3);

      state = preMortemReducer(state, { type: 'GO_BACK_STEP' });

      expect(state.currentStep).toBe(2);
    });

    it('should not go back past step 1', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, { type: 'GO_BACK_STEP' });

      expect(state.currentStep).toBe(1);
    });
  });

  describe('MARK_EXPORTED', () => {
    it('should mark analysis as completed and exported', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, { type: 'MARK_EXPORTED' });

      expect(state.currentAnalysis!.completionStatus).toBe('completed');
      expect(state.currentAnalysis!.exportedAt).toBeInstanceOf(Date);
    });
  });

  describe('RESET', () => {
    it('should reset to initial state', () => {
      let state = preMortemReducer(initialState, {
        type: 'INITIALIZE_ANALYSIS',
      });

      state = preMortemReducer(state, { type: 'ADVANCE_STEP' });

      state = preMortemReducer(state, { type: 'RESET' });

      expect(state).toEqual(initialState);
    });
  });
});
