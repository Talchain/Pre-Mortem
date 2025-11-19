/**
 * ScenarioList Component
 * Displays all failure scenarios with filtering and actions
 * Olumi Design System v1.2
 */

import { useState } from 'react';
import { useDecisionSession } from '@/context/DecisionSessionContext';
import { FailureScenario, ImpactLevel } from '@/types/sharedModels';
import { ScenarioCard } from './ScenarioCard';
import styles from './ScenarioList.module.css';

type FilterType = 'all' | 'high-risk' | 'medium-risk' | 'low-risk';

export function ScenarioList() {
  const { state, sendMessage } = useDecisionSession();
  const [filter, setFilter] = useState<FilterType>('all');

  const scenarios = state.session?.premortem?.failure_scenarios || [];

  if (scenarios.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>No Scenarios Yet</h3>
        <p className={styles.emptyText}>
          Ask Olumi to generate failure scenarios based on your decision context. Olumi will analyze
          from multiple perspectives to identify potential risks.
        </p>
        <button
          className={styles.emptyButton}
          onClick={() => sendMessage('Generate failure scenarios for my decision')}
        >
          Generate Scenarios
        </button>
      </div>
    );
  }

  // Calculate risk level for each scenario
  const scenariosWithRisk = scenarios.map((scenario) => {
    const impactWeight: Record<ImpactLevel, number> = {
      minor: 1,
      moderate: 2,
      major: 3,
      catastrophic: 4,
    };
    const riskScore = (scenario.likelihood * impactWeight[scenario.impact]) / 100;

    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    if (riskScore >= 2) riskLevel = 'high';
    else if (riskScore >= 1) riskLevel = 'medium';

    return { ...scenario, riskLevel, riskScore };
  });

  // Filter scenarios
  const filteredScenarios = scenariosWithRisk.filter((scenario) => {
    if (filter === 'all') return true;
    if (filter === 'high-risk') return scenario.riskLevel === 'high';
    if (filter === 'medium-risk') return scenario.riskLevel === 'medium';
    if (filter === 'low-risk') return scenario.riskLevel === 'low';
    return true;
  });

  // Sort by risk score (highest first)
  const sortedScenarios = [...filteredScenarios].sort((a, b) => b.riskScore - a.riskScore);

  // Count scenarios by risk level
  const counts = {
    high: scenariosWithRisk.filter((s) => s.riskLevel === 'high').length,
    medium: scenariosWithRisk.filter((s) => s.riskLevel === 'medium').length,
    low: scenariosWithRisk.filter((s) => s.riskLevel === 'low').length,
  };

  const handleDiscussScenario = (scenario: FailureScenario) => {
    sendMessage(
      `I'd like to discuss this scenario: "${scenario.title}". What are the best ways to mitigate this risk?`
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Failure Scenarios</h2>
          <p className={styles.subtitle}>
            {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''} identified from
            multi-agent analysis
          </p>
        </div>

        {/* Risk Summary */}
        <div className={styles.riskSummary}>
          <div className={`${styles.riskBadge} ${styles.riskHigh}`}>
            {counts.high} High Risk
          </div>
          <div className={`${styles.riskBadge} ${styles.riskMedium}`}>
            {counts.medium} Medium
          </div>
          <div className={`${styles.riskBadge} ${styles.riskLow}`}>{counts.low} Low</div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({scenarios.length})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'high-risk' ? styles.filterActive : ''}`}
          onClick={() => setFilter('high-risk')}
        >
          High Risk ({counts.high})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'medium-risk' ? styles.filterActive : ''}`}
          onClick={() => setFilter('medium-risk')}
        >
          Medium ({counts.medium})
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'low-risk' ? styles.filterActive : ''}`}
          onClick={() => setFilter('low-risk')}
        >
          Low ({counts.low})
        </button>
      </div>

      {/* Scenarios */}
      <div className={styles.scenarios}>
        {sortedScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onDiscuss={handleDiscussScenario}
          />
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => sendMessage('Generate more failure scenarios')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Generate More Scenarios
        </button>

        <button
          className={styles.actionButton}
          onClick={() =>
            sendMessage('What are the top 3 scenarios I should focus on mitigating first?')
          }
        >
          Get Mitigation Recommendations
        </button>
      </div>
    </div>
  );
}
