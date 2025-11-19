/**
 * Migration Utilities
 * Converts legacy PreMortemAnalysis to new DecisionSession format
 * Ensures backward compatibility during refactor
 */

import { v4 as uuidv4 } from 'uuid';
import { PreMortemAnalysis } from '@/types/premortem';
import {
  DecisionSession,
  DecisionOption,
  DecisionFactor,
  FailureScenario,
  Mitigation,
} from '@/types/sharedModels';

/**
 * Convert legacy PreMortemAnalysis to DecisionSession
 */
export function migrateFromLegacy(
  legacy: PreMortemAnalysis
): DecisionSession {
  const now = new Date().toISOString();

  // Convert decision to new format
  const decision = {
    question: legacy.decision.title,
    context: legacy.decision.description || '',
    status: 'active' as const,
    options: convertLegacyOptions(legacy),
    factors: convertLegacyFactors(legacy),
    stakeholders: (legacy.decision.stakeholders || []).map((name) => ({
      id: uuidv4(),
      name,
      role: '',
      influence: 'medium' as const,
      ai_generated: false,
      created_at: legacy.createdAt.toISOString(),
    })),
  };

  // Convert scenarios
  const failure_scenarios: FailureScenario[] = legacy.scenarios.map(
    (scenario) => ({
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      likelihood: mapLikelihood(scenario.likelihood),
      impact: mapImpact(scenario.impact),
      root_causes: scenario.rootCauses.map((rc) => rc.cause),
      early_warning_signs: [], // Not in legacy format
      related_factors: [],      // Not in legacy format
      ai_reasoning: scenario.reasoning,
      created_at: legacy.createdAt.toISOString(),
    })
  );

  // Convert mitigations
  const mitigations: Mitigation[] = legacy.mitigationStrategies.map(
    (strategy) => ({
      id: strategy.id,
      scenario_id: strategy.rootCauseIds[0] || '', // Map to first root cause's scenario
      strategy: strategy.title,
      actions: [strategy.description],
      effort: strategy.effort.toLowerCase() as 'low' | 'medium' | 'high',
      effectiveness: mapImpactToNumber(strategy.impact),
      timing: mapTiming(strategy.timing),
      owner: strategy.owner,
      priority: strategy.priority,
      created_at: legacy.createdAt.toISOString(),
    })
  );

  return {
    id: legacy.id,
    type: 'pre-mortem',
    created_at: legacy.createdAt.toISOString(),
    updated_at: legacy.updatedAt.toISOString(),
    decision,
    premortem: {
      failure_scenarios,
      mitigations,
      confidence_level: legacy.adjustedConfidence,
      generated_at: legacy.createdAt.toISOString(),
    },
    conversation: [
      {
        id: uuidv4(),
        role: 'system',
        content: `Migrated from legacy format: ${legacy.decision.title}`,
        timestamp: legacy.createdAt.toISOString(),
      },
    ],
  };
}

/**
 * Convert legacy format to options
 */
function convertLegacyOptions(legacy: PreMortemAnalysis): DecisionOption[] {
  // Legacy format didn't explicitly have options
  // Create a single option from the decision
  return [
    {
      id: uuidv4(),
      title: legacy.decision.title,
      description: legacy.decision.description,
      confidence: legacy.decision.initialConfidence,
      ai_generated: false,
      created_at: legacy.createdAt.toISOString(),
    },
  ];
}

/**
 * Convert legacy factors/context to structured factors
 */
function convertLegacyFactors(legacy: PreMortemAnalysis): DecisionFactor[] {
  const factors: DecisionFactor[] = [];

  // Extract factors from context if available
  if (legacy.decision.context) {
    factors.push({
      id: uuidv4(),
      name: 'Context',
      description: legacy.decision.context,
      importance: 'high',
      type: 'assumption',
      ai_generated: false,
      created_at: legacy.createdAt.toISOString(),
    });
  }

  // Extract factors from success criteria
  if (legacy.decision.successCriteria) {
    factors.push({
      id: uuidv4(),
      name: 'Success Criteria',
      description: legacy.decision.successCriteria,
      importance: 'critical',
      type: 'constraint',
      ai_generated: false,
      created_at: legacy.createdAt.toISOString(),
    });
  }

  return factors;
}

/**
 * Map legacy likelihood to number (0-100)
 */
function mapLikelihood(likelihood: 'Low' | 'Medium' | 'High'): number {
  switch (likelihood) {
    case 'Low':
      return 25;
    case 'Medium':
      return 50;
    case 'High':
      return 75;
    default:
      return 50;
  }
}

/**
 * Map legacy impact to new impact level
 */
function mapImpact(
  impact: 'Low' | 'Medium' | 'High'
): 'catastrophic' | 'major' | 'moderate' | 'minor' {
  switch (impact) {
    case 'High':
      return 'catastrophic';
    case 'Medium':
      return 'major';
    case 'Low':
      return 'moderate';
    default:
      return 'moderate';
  }
}

/**
 * Map impact to effectiveness number
 */
function mapImpactToNumber(impact: 'Low' | 'Medium' | 'High'): number {
  switch (impact) {
    case 'Low':
      return 30;
    case 'Medium':
      return 60;
    case 'High':
      return 90;
    default:
      return 60;
  }
}

/**
 * Map legacy timing to new timing
 */
function mapTiming(
  timing: 'Pre-decision' | 'During execution' | 'Monitoring'
): 'pre-decision' | 'during-execution' | 'monitoring' {
  switch (timing) {
    case 'Pre-decision':
      return 'pre-decision';
    case 'During execution':
      return 'during-execution';
    case 'Monitoring':
      return 'monitoring';
    default:
      return 'pre-decision';
  }
}

/**
 * Convert DecisionSession back to legacy format (for compatibility)
 */
export function convertToLegacy(
  session: DecisionSession
): Partial<PreMortemAnalysis> {
  // This is a simplified conversion for backward compatibility
  // May not preserve all new features
  return {
    id: session.id,
    createdAt: new Date(session.created_at),
    updatedAt: new Date(session.updated_at),
    decision: {
      title: session.decision.question,
      description: session.decision.context,
      type: 'Other',
      timeline: '6 months',
      initialConfidence: session.decision.options[0]?.confidence || 50,
      stakeholders: session.decision.stakeholders.map((sh) => sh.name),
      successCriteria: session.decision.factors
        .filter((f) => f.type === 'constraint')
        .map((f) => f.description)
        .join('; '),
      context: session.decision.factors
        .filter((f) => f.type !== 'constraint')
        .map((f) => f.description)
        .join('; '),
    },
    scenarios: session.premortem
      ? session.premortem.failure_scenarios.map((scenario) => ({
          id: scenario.id,
          title: scenario.title,
          description: scenario.description,
          likelihood: reverseLikelihood(scenario.likelihood),
          impact: reverseImpact(scenario.impact),
          category: 'Strategic' as const,
          flaggedAsConcerning: false,
          userEdited: false,
          source: 'ai' as const,
          reasoning: scenario.ai_reasoning,
          rootCauses: scenario.root_causes.map((cause) => ({
            id: uuidv4(),
            cause,
            explanation: '',
            userEdited: false,
          })),
        }))
      : [],
    mitigationStrategies: session.premortem
      ? session.premortem.mitigations.map((mitigation) => ({
          id: mitigation.id,
          rootCauseIds: [mitigation.scenario_id],
          title: mitigation.strategy,
          description: mitigation.actions.join('; '),
          effort: capitalizeFirst(mitigation.effort) as 'Low' | 'Medium' | 'High',
          impact: reverseEffectiveness(mitigation.effectiveness),
          timing: reverseTiming(mitigation.timing),
          owner: mitigation.owner,
          priority: mitigation.priority,
          userEdited: false,
        }))
      : [],
    adjustedConfidence: session.premortem?.confidence_level || 50,
    completionStatus: 'completed' as const,
    currentStep: 8,
  };
}

// Helper functions for reverse mapping
function reverseLikelihood(likelihood: number): 'Low' | 'Medium' | 'High' {
  if (likelihood < 33) return 'Low';
  if (likelihood < 67) return 'Medium';
  return 'High';
}

function reverseImpact(
  impact: 'catastrophic' | 'major' | 'moderate' | 'minor'
): 'Low' | 'Medium' | 'High' {
  switch (impact) {
    case 'catastrophic':
      return 'High';
    case 'major':
      return 'High';
    case 'moderate':
      return 'Medium';
    case 'minor':
      return 'Low';
    default:
      return 'Medium';
  }
}

function reverseEffectiveness(effectiveness: number): 'Low' | 'Medium' | 'High' {
  if (effectiveness < 40) return 'Low';
  if (effectiveness < 70) return 'Medium';
  return 'High';
}

function reverseTiming(
  timing: 'pre-decision' | 'during-execution' | 'monitoring'
): 'Pre-decision' | 'During execution' | 'Monitoring' {
  switch (timing) {
    case 'pre-decision':
      return 'Pre-decision';
    case 'during-execution':
      return 'During execution';
    case 'monitoring':
      return 'Monitoring';
    default:
      return 'Pre-decision';
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if localStorage has legacy data
 */
export function hasLegacyData(): boolean {
  try {
    const legacyKey = 'olumi_premortem_analysis';
    const data = localStorage.getItem(legacyKey);
    return data !== null;
  } catch {
    return false;
  }
}

/**
 * Migrate legacy data and clear old storage
 */
export function migrateLegacyStorage(): DecisionSession | null {
  try {
    const legacyKey = 'olumi_premortem_analysis';
    const data = localStorage.getItem(legacyKey);

    if (!data) return null;

    const legacy = JSON.parse(data) as PreMortemAnalysis;

    // Convert dates from ISO strings
    legacy.createdAt = new Date(legacy.createdAt);
    legacy.updatedAt = new Date(legacy.updatedAt);

    const migrated = migrateFromLegacy(legacy);

    // Clear legacy storage
    localStorage.removeItem(legacyKey);
    localStorage.removeItem('olumi_premortem_archive');

    return migrated;
  } catch (error) {
    console.error('Migration failed:', error);
    return null;
  }
}
