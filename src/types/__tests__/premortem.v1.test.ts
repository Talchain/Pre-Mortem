/**
 * Tests for PreMortemDecision.v1 Schema
 * Validates golden fixtures and schema compliance
 */

import { describe, it, expect } from 'vitest';
import {
  validatePreMortemDecision,
  validatePartialPreMortemDecision,
  PreMortemDecisionSchema,
} from '../premortem.v1.schema';
import type { PreMortemDecision } from '../premortem.v1';

// Import golden fixtures
import decisionComplete from '../../../fixtures/premortem/decision-complete.v1.json';
import decisionMinimal from '../../../fixtures/premortem/decision-minimal.v1.json';

describe('PreMortemDecision.v1 Schema', () => {
  describe('Golden Fixtures Validation', () => {
    it('should validate decision-complete.v1.json', () => {
      const result = validatePreMortemDecision(decisionComplete);

      if (!result.success) {
        console.error('Validation errors:', JSON.stringify(result.error.issues, null, 2));
      }

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.decision.id).toBe('550e8400-e29b-41d4-a716-446655440000');
        expect(result.data.analysis.scenarios).toHaveLength(5);
        expect(result.data.analysis.rootCauses).toHaveLength(7);
        expect(result.data.analysis.mitigations).toHaveLength(6);
        expect(result.data.evidence).toHaveLength(4);
      }
    });

    it('should validate decision-minimal.v1.json', () => {
      const result = validatePreMortemDecision(decisionMinimal);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.decision.id).toBe('660e8400-e29b-41d4-a716-446655440000');
        expect(result.data.analysis.scenarios).toHaveLength(3);
        expect(result.data.evidence).toHaveLength(0);
      } else {
        console.error('Validation errors:', result.error.issues);
      }
    });
  });

  describe('Schema Validation Rules', () => {
    it('should require minimum scenario count', () => {
      const invalidDecision = {
        ...decisionComplete,
        analysis: {
          ...decisionComplete.analysis,
          scenarios: decisionComplete.analysis.scenarios.slice(0, 2), // Only 2 scenarios
        },
      };

      const result = validatePreMortemDecision(invalidDecision);

      expect(result.success).toBe(false);
      if (!result.success) {
        const scenarioError = result.error.issues.find((issue) =>
          issue.path.includes('scenarios')
        );
        expect(scenarioError).toBeDefined();
      }
    });

    it('should validate UUID format for IDs', () => {
      const invalidDecision = {
        ...decisionComplete,
        decision: {
          ...decisionComplete.decision,
          id: 'not-a-uuid',
        },
      };

      const result = validatePreMortemDecision(invalidDecision);

      expect(result.success).toBe(false);
    });

    it('should validate enum values for likelihood', () => {
      const invalidDecision = {
        ...decisionComplete,
        analysis: {
          ...decisionComplete.analysis,
          scenarios: [
            {
              ...decisionComplete.analysis.scenarios[0],
              likelihood: 'invalid-level',
            },
            ...decisionComplete.analysis.scenarios.slice(1),
          ],
        },
      };

      const result = validatePreMortemDecision(invalidDecision);

      expect(result.success).toBe(false);
    });

    it('should validate datetime format', () => {
      const invalidDecision = {
        ...decisionComplete,
        meta: {
          ...decisionComplete.meta,
          createdAt: 'not-a-datetime',
        },
      };

      const result = validatePreMortemDecision(invalidDecision);

      expect(result.success).toBe(false);
    });

    it('should validate confidence values are 0-100', () => {
      const invalidDecision = {
        ...decisionComplete,
        analysis: {
          ...decisionComplete.analysis,
          confidenceAdjustment: {
            ...decisionComplete.analysis.confidenceAdjustment,
            initial: 150, // Invalid: > 100
          },
        },
      };

      const result = validatePreMortemDecision(invalidDecision);

      expect(result.success).toBe(false);
    });
  });

  describe('Partial Decision Validation', () => {
    it('should allow incomplete analysis for in-progress decisions', () => {
      const partialDecision = {
        decision: {
          id: '770e8400-e29b-41d4-a716-446655440000',
          title: 'Should we pivot to B2B?',
        },
        meta: {
          version: '1.0.0',
          createdAt: '2025-11-20T12:00:00Z',
        },
      };

      const result = validatePartialPreMortemDecision(partialDecision);

      expect(result.success).toBe(true);
    });

    it('should require id in partial decision', () => {
      const invalidPartial = {
        decision: {
          title: 'Should we pivot to B2B?',
          // Missing id
        },
        meta: {
          version: '1.0.0',
          createdAt: '2025-11-20T12:00:00Z',
        },
      };

      const result = validatePartialPreMortemDecision(invalidPartial);

      expect(result.success).toBe(false);
    });
  });

  describe('Data Integrity', () => {
    it('should have consistent root cause references in scenarios', () => {
      const decision = decisionComplete as PreMortemDecision;

      const allRootCauseIds = new Set(
        decision.analysis.rootCauses.map((rc) => rc.id)
      );

      decision.analysis.scenarios.forEach((scenario) => {
        scenario.rootCauseIds.forEach((rcId) => {
          expect(allRootCauseIds.has(rcId)).toBe(true);
        });
      });
    });

    it('should have consistent mitigation references in root causes', () => {
      const decision = decisionComplete as PreMortemDecision;

      const allMitigationIds = new Set(
        decision.analysis.mitigations.map((m) => m.id)
      );

      decision.analysis.rootCauses.forEach((rootCause) => {
        rootCause.mitigationIds.forEach((mId) => {
          expect(allMitigationIds.has(mId)).toBe(true);
        });
      });
    });

    it('should have valid evidence linkages', () => {
      const decision = decisionComplete as PreMortemDecision;

      const allScenarioIds = new Set(
        decision.analysis.scenarios.map((s) => s.id)
      );
      const allRootCauseIds = new Set(
        decision.analysis.rootCauses.map((rc) => rc.id)
      );
      const allMitigationIds = new Set(
        decision.analysis.mitigations.map((m) => m.id)
      );

      decision.evidence.forEach((evidence) => {
        evidence.linkedToScenarioIds.forEach((sId) => {
          expect(allScenarioIds.has(sId)).toBe(true);
        });
        evidence.linkedToRootCauseIds.forEach((rcId) => {
          expect(allRootCauseIds.has(rcId)).toBe(true);
        });
        evidence.linkedToMitigationIds.forEach((mId) => {
          expect(allMitigationIds.has(mId)).toBe(true);
        });
      });
    });
  });

  describe('Diagnostics Metadata', () => {
    it('should have valid diagnostics in complete fixture', () => {
      const decision = decisionComplete as PreMortemDecision;

      expect(decision.meta.diagnostics).toBeDefined();
      expect(decision.meta.diagnostics?.totalTokens).toBeGreaterThan(0);
      expect(decision.meta.diagnostics?.processingTime).toBeGreaterThan(0);
      expect(decision.meta.diagnostics?.degraded).toBe(false);
      expect(decision.meta.diagnostics?.apiCalls).toHaveLength(3);
    });

    it('should track API call success/failure', () => {
      const decision = decisionComplete as PreMortemDecision;

      decision.meta.diagnostics?.apiCalls?.forEach((call) => {
        expect(call.success).toBe(true);
        expect(call.provider).toMatch(/^(anthropic|openai)$/);
        expect(call.tokens).toBeGreaterThan(0);
        expect(call.duration).toBeGreaterThan(0);
      });
    });
  });

  describe('Integration Handoff Preparation', () => {
    it('should support Sandbox R3 evidence format', () => {
      const decision = decisionComplete as PreMortemDecision;

      decision.evidence.forEach((evidence) => {
        // Required fields for Sandbox R3
        expect(evidence.title).toBeDefined();
        expect(evidence.type).toBeDefined();
        expect(evidence.content).toBeDefined();

        // Type must be one of the allowed values
        expect(['research', 'data', 'expert', 'historical', 'assumption']).toContain(
          evidence.type
        );

        // Linkages should be arrays
        expect(Array.isArray(evidence.linkedToScenarioIds)).toBe(true);
        expect(Array.isArray(evidence.linkedToRootCauseIds)).toBe(true);
        expect(Array.isArray(evidence.linkedToMitigationIds)).toBe(true);
      });
    });

    it('should have response hash for determinism', () => {
      const decision = decisionComplete as PreMortemDecision;

      expect(decision.meta.responseHash).toBeDefined();
      expect(decision.meta.responseHash).toMatch(/^[a-f0-9]{32}$/);
    });
  });
});
