/**
 * Pre-Mortem Telemetry Hook
 *
 * Structured telemetry following Scenario Sandbox R2 patterns
 *
 * PRIVACY-FIRST DESIGN:
 * - Structure only, NO decision content
 * - NO user input text
 * - NO personally identifiable information
 * - Console logging only (no actual backend calls)
 *
 * @version 1.0.0
 * @aligned-with Scenario Sandbox R2 Telemetry
 */

import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// TYPES
// ============================================

export type TelemetrySurface =
  | 'context'
  | 'scenarios'
  | 'rootcauses'
  | 'mitigations'
  | 'summary'
  | 'evidence'
  | 'export';

export type TelemetryTrigger =
  | 'user.click'
  | 'user.input'
  | 'ai.response'
  | 'system.auto';

export interface PreMortemEvent {
  // Core identification
  eventName: string;
  timestamp: string; // ISO 8601
  sessionId: string;

  // Context
  surface: TelemetrySurface;
  trigger: TelemetryTrigger;

  // Metadata (structure only, no PII, no content)
  meta: {
    decisionId?: string;
    scenarioCount?: number;
    rootCauseCount?: number;
    mitigationCount?: number;
    evidenceCount?: number;
    aiProvider?: string;
    aiModel?: string;
    processingTime?: number; // milliseconds
    degraded?: boolean;
    [key: string]: any; // Allow extensibility
  };
}

export interface TelemetryEventDefinition {
  name: string;
  surface: TelemetrySurface;
  trigger: TelemetryTrigger;
  expectedCardinality: 'once' | 'many' | 'optional';
  description: string;
}

// ============================================
// EVENT REGISTRY
// ============================================

export const TELEMETRY_EVENTS: Record<string, TelemetryEventDefinition> = {
  SESSION_STARTED: {
    name: 'premortem.session.started',
    surface: 'context',
    trigger: 'system.auto',
    expectedCardinality: 'once',
    description: 'New pre-mortem session initialized',
  },
  CONTEXT_SUBMITTED: {
    name: 'premortem.context.submitted',
    surface: 'context',
    trigger: 'user.click',
    expectedCardinality: 'once',
    description: 'User submitted decision context',
  },
  CONTEXT_EDITED: {
    name: 'premortem.context.edited',
    surface: 'context',
    trigger: 'user.input',
    expectedCardinality: 'many',
    description: 'User edited decision context',
  },
  SCENARIOS_GENERATED: {
    name: 'premortem.scenarios.generated',
    surface: 'scenarios',
    trigger: 'ai.response',
    expectedCardinality: 'once',
    description: 'AI generated failure scenarios',
  },
  SCENARIO_EXPANDED: {
    name: 'premortem.scenario.expanded',
    surface: 'scenarios',
    trigger: 'user.click',
    expectedCardinality: 'many',
    description: 'User expanded scenario details',
  },
  SCENARIO_COLLAPSED: {
    name: 'premortem.scenario.collapsed',
    surface: 'scenarios',
    trigger: 'user.click',
    expectedCardinality: 'many',
    description: 'User collapsed scenario details',
  },
  ROOTCAUSE_ANALYSED: {
    name: 'premortem.rootcause.analysed',
    surface: 'rootcauses',
    trigger: 'ai.response',
    expectedCardinality: 'many',
    description: 'AI analyzed root causes for scenario',
  },
  ROOTCAUSE_EXPANDED: {
    name: 'premortem.rootcause.expanded',
    surface: 'rootcauses',
    trigger: 'user.click',
    expectedCardinality: 'many',
    description: 'User expanded root cause details',
  },
  MITIGATION_CREATED: {
    name: 'premortem.mitigation.created',
    surface: 'mitigations',
    trigger: 'ai.response',
    expectedCardinality: 'many',
    description: 'AI generated mitigation strategy',
  },
  MITIGATION_EDITED: {
    name: 'premortem.mitigation.edited',
    surface: 'mitigations',
    trigger: 'user.input',
    expectedCardinality: 'many',
    description: 'User edited mitigation strategy',
  },
  MITIGATION_MARKED_IMPLEMENTED: {
    name: 'premortem.mitigation.marked_implemented',
    surface: 'mitigations',
    trigger: 'user.click',
    expectedCardinality: 'many',
    description: 'User marked mitigation as implemented',
  },
  CONFIDENCE_ADJUSTED: {
    name: 'premortem.confidence.adjusted',
    surface: 'summary',
    trigger: 'system.auto',
    expectedCardinality: 'once',
    description: 'Confidence score adjusted based on analysis',
  },
  EVIDENCE_ADDED: {
    name: 'premortem.evidence.added',
    surface: 'evidence',
    trigger: 'user.input',
    expectedCardinality: 'many',
    description: 'User added evidence to decision',
  },
  EVIDENCE_LINKED: {
    name: 'premortem.evidence.linked',
    surface: 'evidence',
    trigger: 'user.click',
    expectedCardinality: 'many',
    description: 'User linked evidence to scenario/root cause',
  },
  EXPORT_CLICKED: {
    name: 'premortem.export.clicked',
    surface: 'export',
    trigger: 'user.click',
    expectedCardinality: 'many',
    description: 'User clicked export button',
  },
  EXPORT_COMPLETED: {
    name: 'premortem.export.completed',
    surface: 'export',
    trigger: 'system.auto',
    expectedCardinality: 'many',
    description: 'Export successfully completed',
  },
  SANDBOX_HANDOFF_INITIATED: {
    name: 'premortem.sandbox_handoff.initiated',
    surface: 'export',
    trigger: 'user.click',
    expectedCardinality: 'optional',
    description: 'User initiated handoff to Scenario Sandbox',
  },
  SANDBOX_HANDOFF_COMPLETED: {
    name: 'premortem.sandbox_handoff.completed',
    surface: 'export',
    trigger: 'system.auto',
    expectedCardinality: 'optional',
    description: 'Handoff to Scenario Sandbox completed',
  },
  ERROR_OCCURRED: {
    name: 'premortem.error.occurred',
    surface: 'summary', // Errors can occur on any surface
    trigger: 'system.auto',
    expectedCardinality: 'optional',
    description: 'Error occurred during operation',
  },
  DEGRADED_MODE_ENTERED: {
    name: 'premortem.degraded_mode.entered',
    surface: 'summary',
    trigger: 'system.auto',
    expectedCardinality: 'optional',
    description: 'System entered degraded mode (AI unavailable)',
  },
};

// ============================================
// TELEMETRY HOOK
// ============================================

export function usePreMortemTelemetry() {
  const sessionIdRef = useRef<string>(uuidv4());
  const eventsLog = useRef<PreMortemEvent[]>([]);

  /**
   * Emit a telemetry event
   *
   * @param eventKey - Key from TELEMETRY_EVENTS
   * @param meta - Event metadata (structure only, NO content)
   */
  const emit = useCallback((eventKey: keyof typeof TELEMETRY_EVENTS, meta: PreMortemEvent['meta'] = {}) => {
    const eventDef = TELEMETRY_EVENTS[eventKey];

    if (!eventDef) {
      console.warn(`[Telemetry] Unknown event: ${eventKey}`);
      return;
    }

    const event: PreMortemEvent = {
      eventName: eventDef.name,
      timestamp: new Date().toISOString(),
      sessionId: sessionIdRef.current,
      surface: eventDef.surface,
      trigger: eventDef.trigger,
      meta,
    };

    eventsLog.current.push(event);

    // Console logging only (privacy-first)
    if (import.meta.env.VITE_TELEMETRY_ENABLED !== 'false') {
      console.log('[PreMortem Telemetry]', JSON.stringify(event, null, 2));
    }

    // In production, this would send to analytics service
    // For now, just console log
  }, []);

  /**
   * Get telemetry summary for diagnostics
   */
  const getSummary = useCallback(() => {
    return {
      sessionId: sessionIdRef.current,
      totalEvents: eventsLog.current.length,
      eventsByName: eventsLog.current.reduce((acc, event) => {
        acc[event.eventName] = (acc[event.eventName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      eventsBySurface: eventsLog.current.reduce((acc, event) => {
        acc[event.surface] = (acc[event.surface] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      eventsByTrigger: eventsLog.current.reduce((acc, event) => {
        acc[event.trigger] = (acc[event.trigger] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, []);

  /**
   * Check cardinality assertions (for testing)
   */
  const checkCardinality = useCallback(() => {
    const violations: string[] = [];

    Object.entries(TELEMETRY_EVENTS).forEach(([key, eventDef]) => {
      const count = eventsLog.current.filter((e) => e.eventName === eventDef.name).length;

      if (eventDef.expectedCardinality === 'once' && count > 1) {
        violations.push(`${eventDef.name} should occur once, but occurred ${count} times`);
      }

      // Note: 'many' and 'optional' have no upper bound
    });

    return {
      valid: violations.length === 0,
      violations,
    };
  }, []);

  return {
    emit,
    getSummary,
    checkCardinality,
    sessionId: sessionIdRef.current,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get telemetry event metadata from decision session (privacy-safe)
 */
export function getDecisionMeta(decision: any): PreMortemEvent['meta'] {
  return {
    decisionId: decision?.decision?.id,
    scenarioCount: decision?.analysis?.scenarios?.length || 0,
    rootCauseCount: decision?.analysis?.rootCauses?.length || 0,
    mitigationCount: decision?.analysis?.mitigations?.length || 0,
    evidenceCount: decision?.evidence?.length || 0,
    aiProvider: decision?.meta?.aiProvider,
    aiModel: decision?.meta?.aiModel,
    degraded: decision?.meta?.diagnostics?.degraded || false,
  };
}

/**
 * Get processing time metadata
 */
export function getProcessingMeta(startTime: number): PreMortemEvent['meta'] {
  return {
    processingTime: Date.now() - startTime,
  };
}
