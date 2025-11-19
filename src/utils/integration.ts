/**
 * Integration Utilities
 * Handles data exchange with Scenario Sandbox
 * Ensures seamless handoff between Olumi tools
 */

import { v4 as uuidv4 } from 'uuid';
import {
  DecisionSession,
  ScenarioSandboxInput,
  ScenarioSandboxExport,
  DecisionOption,
  DecisionFactor,
} from '@/types/sharedModels';

/* ============================================
   EXPORT TO SCENARIO SANDBOX
   ============================================ */

/**
 * Prepare pre-mortem data for handoff to Scenario Sandbox
 */
export function prepareScenarioSandboxHandoff(
  session: DecisionSession
): ScenarioSandboxInput {
  return {
    type: 'pre-mortem-import',
    decision: {
      question: session.decision.question,
      context: session.decision.context,
      options: session.decision.options.map((opt) => ({
        name: opt.title,
        description: opt.description,
        confidence: opt.confidence / 100, // Normalize to 0-1
      })),
      factors: session.decision.factors.map((factor) => ({
        name: factor.name,
        type: mapFactorType(factor.type),
        importance: factor.importance,
      })),
      risks: session.premortem
        ? session.premortem.failure_scenarios.map((scenario) => ({
            title: scenario.title,
            description: scenario.description,
            likelihood: scenario.likelihood / 100, // Normalize to 0-1
            impact: scenario.impact,
            mitigations: session.premortem!.mitigations
              .filter((m) => m.scenario_id === scenario.id)
              .map((m) => m.strategy),
          }))
        : [],
    },
    metadata: {
      created_at: session.created_at,
      source: 'pre-mortem-tool',
      version: '2.0',
    },
  };
}

/**
 * Map internal factor type to Scenario Sandbox format
 */
function mapFactorType(type: DecisionSession['decision']['factors'][0]['type']): string {
  switch (type) {
    case 'risk':
      return 'risk-factor';
    case 'opportunity':
      return 'opportunity';
    case 'constraint':
      return 'constraint';
    case 'assumption':
      return 'assumption';
    default:
      return 'assumption';
  }
}

/* ============================================
   IMPORT FROM SCENARIO SANDBOX
   ============================================ */

/**
 * Import decision outcome from Scenario Sandbox for post-mortem
 */
export function importFromScenarioSandbox(
  scenarioData: ScenarioSandboxExport
): Partial<DecisionSession> {
  const now = new Date().toISOString();

  return {
    decision: {
      question: scenarioData.decision.question,
      context: scenarioData.decision.context || '',
      status: 'decided',
      options: scenarioData.decision.options.map((opt) => ({
        id: uuidv4(),
        title: opt.name,
        description: opt.description || '',
        confidence: opt.confidence * 100, // Denormalize from 0-1
        ai_generated: false,
        created_at: scenarioData.metadata.exported_at,
      })),
      factors: scenarioData.decision.factors.map((factor) => ({
        id: uuidv4(),
        name: factor.name,
        description: factor.description || '',
        importance: factor.importance,
        type: reverseMapFactorType(factor.type),
        ai_generated: false,
        created_at: scenarioData.metadata.exported_at,
      })),
      stakeholders: [],
    },
    handoff: {
      source: 'sandbox',
      data: scenarioData,
      timestamp: now,
    },
  };
}

/**
 * Reverse map factor type from Scenario Sandbox
 */
function reverseMapFactorType(type: string): DecisionSession['decision']['factors'][0]['type'] {
  switch (type) {
    case 'risk-factor':
      return 'risk';
    case 'opportunity':
      return 'opportunity';
    case 'constraint':
      return 'constraint';
    case 'assumption':
      return 'assumption';
    default:
      return 'assumption';
  }
}

/* ============================================
   VALIDATION
   ============================================ */

/**
 * Validate session data before export
 */
export function validateForExport(session: DecisionSession): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check decision
  if (!session.decision.question || session.decision.question.trim() === '') {
    errors.push('Decision question is required');
  }

  if (session.decision.options.length === 0) {
    errors.push('At least one decision option is required');
  }

  // Check pre-mortem data
  if (!session.premortem) {
    errors.push('Pre-mortem analysis is required');
  } else {
    if (session.premortem.failure_scenarios.length === 0) {
      errors.push('At least one failure scenario is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate imported data from Scenario Sandbox
 */
export function validateImport(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.session_id) {
    errors.push('Missing session_id');
  }

  if (!data.decision?.question) {
    errors.push('Missing decision question');
  }

  if (!data.final_decision?.chosen) {
    errors.push('Missing final decision');
  }

  if (!data.metadata?.exported_at) {
    errors.push('Missing export timestamp');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* ============================================
   COMPATIBILITY CHECKS
   ============================================ */

/**
 * Check if Scenario Sandbox is available/compatible
 */
export async function checkScenarioSandboxCompatibility(): Promise<{
  available: boolean;
  version?: string;
  compatible?: boolean;
}> {
  try {
    // This would check an API endpoint in production
    // For now, return mock data
    return {
      available: false, // Set to true when Sandbox is deployed
      version: '1.0.0',
      compatible: true,
    };
  } catch (error) {
    return {
      available: false,
    };
  }
}

/* ============================================
   HELPER FUNCTIONS
   ============================================ */

/**
 * Generate shareable link for session
 */
export function generateShareableLink(sessionId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/session/${sessionId}`;
}

/**
 * Parse session ID from URL
 */
export function parseSessionIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('session') || null;
}

/**
 * Create deep clone of session (for safety)
 */
export function cloneSession(session: DecisionSession): DecisionSession {
  return JSON.parse(JSON.stringify(session));
}

/**
 * Compare two sessions for changes
 */
export function hasSessionChanged(
  session1: DecisionSession,
  session2: DecisionSession
): boolean {
  return session1.updated_at !== session2.updated_at;
}

/**
 * Get session summary for display
 */
export function getSessionSummary(session: DecisionSession): {
  question: string;
  status: string;
  scenarios: number;
  mitigations: number;
  hasPostMortem: boolean;
  lastUpdated: string;
} {
  return {
    question: session.decision.question,
    status: session.decision.status,
    scenarios: session.premortem?.failure_scenarios.length || 0,
    mitigations: session.premortem?.mitigations.length || 0,
    hasPostMortem: !!session.postmortem,
    lastUpdated: session.updated_at,
  };
}

/**
 * Calculate session completeness score
 */
export function calculateCompleteness(session: DecisionSession): {
  score: number;
  breakdown: {
    decision: number;
    context: number;
    scenarios: number;
    mitigations: number;
  };
} {
  let score = 0;
  const breakdown = {
    decision: 0,
    context: 0,
    scenarios: 0,
    mitigations: 0,
  };

  // Decision (25 points)
  if (session.decision.question) breakdown.decision += 15;
  if (session.decision.options.length > 0) breakdown.decision += 10;

  // Context (25 points)
  if (session.decision.context) breakdown.context += 10;
  if (session.decision.factors.length > 0) breakdown.context += 10;
  if (session.decision.stakeholders.length > 0) breakdown.context += 5;

  // Scenarios (25 points)
  if (session.premortem) {
    const scenarioCount = session.premortem.failure_scenarios.length;
    breakdown.scenarios = Math.min(25, scenarioCount * 4);
  }

  // Mitigations (25 points)
  if (session.premortem) {
    const mitigationCount = session.premortem.mitigations.length;
    breakdown.mitigations = Math.min(25, mitigationCount * 3);
  }

  score =
    breakdown.decision +
    breakdown.context +
    breakdown.scenarios +
    breakdown.mitigations;

  return {
    score,
    breakdown,
  };
}
