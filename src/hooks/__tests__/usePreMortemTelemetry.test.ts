/**
 * Tests for usePreMortemTelemetry Hook
 * Validates telemetry event emission and cardinality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePreMortemTelemetry, TELEMETRY_EVENTS, getDecisionMeta } from '../usePreMortemTelemetry';

describe('usePreMortemTelemetry', () => {
  beforeEach(() => {
    // Clear console mocks
    vi.clearAllMocks();
  });

  describe('Event Emission', () => {
    it('should emit events with correct structure', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('SESSION_STARTED', {
          decisionId: 'test-123',
        });
      });

      const summary = result.current.getSummary();

      expect(summary.totalEvents).toBe(1);
      expect(summary.eventsByName['premortem.session.started']).toBe(1);
    });

    it('should include sessionId in all events', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      const sessionId = result.current.sessionId;
      expect(sessionId).toBeDefined();
      expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should emit events with ISO timestamp', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('CONTEXT_SUBMITTED');
      });

      expect(consoleSpy).toHaveBeenCalled();
      const loggedEvent = JSON.parse(consoleSpy.mock.calls[0][1]);
      expect(loggedEvent.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      consoleSpy.mockRestore();
    });

    it('should include surface and trigger from event definition', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('SCENARIOS_GENERATED', {
          scenarioCount: 5,
        });
      });

      const loggedEvent = JSON.parse(consoleSpy.mock.calls[0][1]);

      expect(loggedEvent.surface).toBe('scenarios');
      expect(loggedEvent.trigger).toBe('ai.response');
      expect(loggedEvent.meta.scenarioCount).toBe(5);

      consoleSpy.mockRestore();
    });
  });

  describe('Privacy Compliance', () => {
    it('should never log decision content in meta', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('CONTEXT_SUBMITTED', {
          decisionId: 'test-123',
          // SHOULD NOT include: decision text, user input, etc.
        });
      });

      const loggedEvent = JSON.parse(consoleSpy.mock.calls[0][1]);

      // Check that meta only contains structure, no content
      expect(loggedEvent.meta).toBeDefined();
      expect(loggedEvent.meta.decisionId).toBe('test-123');

      // Ensure no content fields exist
      expect(loggedEvent.meta.decisionText).toBeUndefined();
      expect(loggedEvent.meta.userInput).toBeUndefined();
      expect(loggedEvent.meta.content).toBeUndefined();

      consoleSpy.mockRestore();
    });
  });

  describe('Cardinality Checking', () => {
    it('should detect violations of "once" cardinality', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('SESSION_STARTED');
        result.current.emit('SESSION_STARTED'); // Second emission (violation)
      });

      const cardinalityCheck = result.current.checkCardinality();

      expect(cardinalityCheck.valid).toBe(false);
      expect(cardinalityCheck.violations).toHaveLength(1);
      expect(cardinalityCheck.violations[0]).toContain('should occur once');
      expect(cardinalityCheck.violations[0]).toContain('occurred 2 times');
    });

    it('should allow "many" cardinality events to occur multiple times', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('SCENARIO_EXPANDED');
        result.current.emit('SCENARIO_EXPANDED');
        result.current.emit('SCENARIO_EXPANDED');
      });

      const cardinalityCheck = result.current.checkCardinality();

      expect(cardinalityCheck.valid).toBe(true);
      expect(cardinalityCheck.violations).toHaveLength(0);
    });

    it('should allow "optional" cardinality events', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('ERROR_OCCURRED');
        result.current.emit('ERROR_OCCURRED');
      });

      const cardinalityCheck = result.current.checkCardinality();

      expect(cardinalityCheck.valid).toBe(true);
    });
  });

  describe('Telemetry Summary', () => {
    it('should provide accurate event counts', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('SESSION_STARTED');
        result.current.emit('CONTEXT_SUBMITTED');
        result.current.emit('SCENARIO_EXPANDED');
        result.current.emit('SCENARIO_EXPANDED');
        result.current.emit('SCENARIO_EXPANDED');
      });

      const summary = result.current.getSummary();

      expect(summary.totalEvents).toBe(5);
      expect(summary.eventsByName['premortem.session.started']).toBe(1);
      expect(summary.eventsByName['premortem.context.submitted']).toBe(1);
      expect(summary.eventsByName['premortem.scenario.expanded']).toBe(3);
    });

    it('should group events by surface', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('CONTEXT_SUBMITTED'); // surface: context
        result.current.emit('CONTEXT_EDITED'); // surface: context
        result.current.emit('SCENARIOS_GENERATED'); // surface: scenarios
        result.current.emit('SCENARIO_EXPANDED'); // surface: scenarios
      });

      const summary = result.current.getSummary();

      expect(summary.eventsBySurface.context).toBe(2);
      expect(summary.eventsBySurface.scenarios).toBe(2);
    });

    it('should group events by trigger', () => {
      const { result } = renderHook(() => usePreMortemTelemetry());

      act(() => {
        result.current.emit('SESSION_STARTED'); // trigger: system.auto
        result.current.emit('CONTEXT_SUBMITTED'); // trigger: user.click
        result.current.emit('SCENARIOS_GENERATED'); // trigger: ai.response
      });

      const summary = result.current.getSummary();

      expect(summary.eventsByTrigger['system.auto']).toBe(1);
      expect(summary.eventsByTrigger['user.click']).toBe(1);
      expect(summary.eventsByTrigger['ai.response']).toBe(1);
    });
  });

  describe('Helper Functions', () => {
    it('getDecisionMeta should extract privacy-safe metadata', () => {
      const mockDecision = {
        decision: {
          id: 'decision-123',
          title: 'Should we launch?', // Should NOT be included
          description: 'Detailed description', // Should NOT be included
        },
        analysis: {
          scenarios: [{}, {}, {}],
          rootCauses: [{}],
          mitigations: [{}, {}],
        },
        evidence: [{}, {}, {}, {}],
        meta: {
          aiProvider: 'anthropic',
          aiModel: 'claude-3-5-sonnet',
          diagnostics: {
            degraded: false,
          },
        },
      };

      const meta = getDecisionMeta(mockDecision);

      // Should include structure
      expect(meta.decisionId).toBe('decision-123');
      expect(meta.scenarioCount).toBe(3);
      expect(meta.rootCauseCount).toBe(1);
      expect(meta.mitigationCount).toBe(2);
      expect(meta.evidenceCount).toBe(4);
      expect(meta.aiProvider).toBe('anthropic');
      expect(meta.aiModel).toBe('claude-3-5-sonnet');
      expect(meta.degraded).toBe(false);

      // Should NOT include content
      expect(meta.title).toBeUndefined();
      expect(meta.description).toBeUndefined();
    });
  });

  describe('Event Registry', () => {
    it('should have valid event definitions', () => {
      Object.entries(TELEMETRY_EVENTS).forEach(([key, eventDef]) => {
        expect(eventDef.name).toBeDefined();
        expect(eventDef.name).toMatch(/^premortem\./);
        expect(eventDef.surface).toBeDefined();
        expect(eventDef.trigger).toBeDefined();
        expect(eventDef.expectedCardinality).toMatch(/^(once|many|optional)$/);
        expect(eventDef.description).toBeDefined();
        expect(eventDef.description.length).toBeGreaterThan(10);
      });
    });

    it('should have consistent naming', () => {
      Object.entries(TELEMETRY_EVENTS).forEach(([key, eventDef]) => {
        // Event name should be lowercase with dots
        expect(eventDef.name).toMatch(/^[a-z_]+\.[a-z_]+(\.[a-z_]+)?$/);
      });
    });
  });
});
