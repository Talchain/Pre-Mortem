/**
 * Portfolio Service
 * Aggregate analytics across all decision sessions
 */

import {
  DecisionSession,
  PortfolioStats,
  DecisionSummary,
  OutcomeType,
} from '@/types/sharedModels';

const PORTFOLIO_STORAGE_KEY = 'premortem-portfolio';
const SESSION_KEY_PREFIX = 'premortem-session-';

/**
 * Get all decision sessions from localStorage
 */
export function getAllSessions(): DecisionSession[] {
  const sessions: DecisionSession[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(SESSION_KEY_PREFIX)) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const session = JSON.parse(data) as DecisionSession;
          sessions.push(session);
        }
      } catch (error) {
        console.error(`Failed to parse session ${key}:`, error);
      }
    }
  }

  return sessions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Get decision summaries for list view
 */
export function getDecisionSummaries(): DecisionSummary[] {
  const sessions = getAllSessions();

  return sessions.map((session) => ({
    id: session.id,
    question: session.decision.question,
    created_at: session.created_at,
    status: session.decision.status,
    outcome: session.postmortem?.actual_outcome,
    scenario_count: session.premortem?.failure_scenarios.length || 0,
    mitigation_count: session.premortem?.mitigations.length || 0,
    template_used: undefined, // TODO: Extract from diagnostics if template was used
  }));
}

/**
 * Calculate comprehensive portfolio statistics
 */
export function calculatePortfolioStats(): PortfolioStats {
  const sessions = getAllSessions();

  const completedSessions = sessions.filter((s) => s.postmortem);

  // Overview stats
  const total_decisions = sessions.length;
  const completed_decisions = completedSessions.length;

  const totalScenarios = sessions.reduce(
    (sum, s) => sum + (s.premortem?.failure_scenarios.length || 0),
    0
  );
  const totalMitigations = sessions.reduce(
    (sum, s) => sum + (s.premortem?.mitigations.length || 0),
    0
  );

  const avg_scenarios_per_decision = total_decisions > 0 ? totalScenarios / total_decisions : 0;
  const avg_mitigations_per_decision =
    total_decisions > 0 ? totalMitigations / total_decisions : 0;

  // Outcome distribution
  const outcomes = {
    success: completedSessions.filter((s) => s.postmortem?.actual_outcome === 'success').length,
    failure: completedSessions.filter((s) => s.postmortem?.actual_outcome === 'failure').length,
    mixed: completedSessions.filter((s) => s.postmortem?.actual_outcome === 'mixed').length,
  };

  // Most common scenarios (by title similarity)
  const scenarioMap = new Map<string, { count: number; occurred: number }>();

  completedSessions.forEach((session) => {
    const scenarios = session.premortem?.failure_scenarios || [];
    const scenarioOutcomes = session.postmortem?.scenario_outcomes || [];

    scenarios.forEach((scenario) => {
      const key = normalizeScenarioTitle(scenario.title);
      const existing = scenarioMap.get(key) || { count: 0, occurred: 0 };

      existing.count += 1;

      // Check if this scenario actually occurred
      const outcome = scenarioOutcomes.find((o) => o.scenario_id === scenario.id);
      if (outcome?.occurred) {
        existing.occurred += 1;
      }

      scenarioMap.set(key, existing);
    });
  });

  const most_common_scenarios = Array.from(scenarioMap.entries())
    .map(([title, data]) => ({
      title,
      occurrence_count: data.occurred,
      occurrence_rate: completed_decisions > 0 ? (data.occurred / completed_decisions) * 100 : 0,
    }))
    .sort((a, b) => b.occurrence_count - a.occurrence_count)
    .slice(0, 10);

  // Most effective mitigations
  const mitigationMap = new Map<string, { implementations: number; effectiveness_sum: number }>();

  completedSessions.forEach((session) => {
    const mitigations = session.premortem?.mitigations || [];
    const effectiveness = session.postmortem?.mitigation_effectiveness || [];

    effectiveness.forEach((eff) => {
      if (!eff.implemented) return;

      const mitigation = mitigations.find((m) => m.id === eff.mitigation_id);
      if (!mitigation) return;

      const key = normalizeMitigationStrategy(mitigation.strategy);
      const existing = mitigationMap.get(key) || { implementations: 0, effectiveness_sum: 0 };

      existing.implementations += 1;
      if (eff.effectiveness) {
        const score = mapEffectivenessToScore(eff.effectiveness);
        existing.effectiveness_sum += score;
      }

      mitigationMap.set(key, existing);
    });
  });

  const most_effective_mitigations = Array.from(mitigationMap.entries())
    .map(([strategy, data]) => ({
      strategy,
      effectiveness_rating:
        data.implementations > 0 ? data.effectiveness_sum / data.implementations : 0,
      implementation_count: data.implementations,
    }))
    .sort((a, b) => b.effectiveness_rating - a.effectiveness_rating)
    .slice(0, 10);

  // Risk heatmap
  const heatmapData = new Map<string, number>();

  sessions.forEach((session) => {
    const scenarios = session.premortem?.failure_scenarios || [];

    scenarios.forEach((scenario) => {
      const likelihoodBucket = bucketLikelihood(scenario.likelihood);
      const impactBucket = scenario.impact;
      const key = `${likelihoodBucket}-${impactBucket}`;

      heatmapData.set(key, (heatmapData.get(key) || 0) + 1);
    });
  });

  const risk_heatmap = Array.from(heatmapData.entries()).map(([key, count]) => {
    const [likelihood, impact] = key.split('-') as [
      'low' | 'medium' | 'high',
      'minor' | 'moderate' | 'major' | 'catastrophic'
    ];
    return { likelihood_bucket: likelihood, impact_bucket: impact, count };
  });

  // Temporal analysis
  const monthMap = new Map<string, number>();

  sessions.forEach((session) => {
    const month = session.created_at.substring(0, 7); // YYYY-MM
    monthMap.set(month, (monthMap.get(month) || 0) + 1);
  });

  const decisions_by_month = Array.from(monthMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    total_decisions,
    completed_decisions,
    avg_scenarios_per_decision: Math.round(avg_scenarios_per_decision * 10) / 10,
    avg_mitigations_per_decision: Math.round(avg_mitigations_per_decision * 10) / 10,
    outcomes,
    most_common_scenarios,
    most_effective_mitigations,
    risk_heatmap,
    decisions_by_month,
  };
}

/**
 * Helper: Normalize scenario titles for grouping
 */
function normalizeScenarioTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Helper: Normalize mitigation strategies for grouping
 */
function normalizeMitigationStrategy(strategy: string): string {
  // Take first sentence or first 100 chars
  const firstSentence = strategy.split(/[.!?]/)[0];
  return firstSentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .substring(0, 100);
}

/**
 * Helper: Map effectiveness labels to numeric scores
 */
function mapEffectivenessToScore(
  effectiveness: 'ineffective' | 'partially_effective' | 'very_effective'
): number {
  const map = {
    ineffective: 0,
    partially_effective: 50,
    very_effective: 100,
  };
  return map[effectiveness];
}

/**
 * Helper: Bucket likelihood values
 */
function bucketLikelihood(likelihood: number): 'low' | 'medium' | 'high' {
  if (likelihood < 33) return 'low';
  if (likelihood < 67) return 'medium';
  return 'high';
}

/**
 * Delete a session from portfolio
 */
export function deleteSession(sessionId: string): void {
  localStorage.removeItem(`${SESSION_KEY_PREFIX}${sessionId}`);
}

/**
 * Export portfolio data
 */
export function exportPortfolioData(): {
  sessions: DecisionSession[];
  stats: PortfolioStats;
  exported_at: string;
} {
  return {
    sessions: getAllSessions(),
    stats: calculatePortfolioStats(),
    exported_at: new Date().toISOString(),
  };
}
