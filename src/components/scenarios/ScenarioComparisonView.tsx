/**
 * ScenarioComparisonView Component
 * Interactive risk matrix for comparing and prioritizing failure scenarios
 * Features 2x2 matrix (likelihood vs impact) with drill-down capabilities
 */

import { useState } from 'react';
import { FailureScenario } from '@/types/sharedModels';
import { ScenarioDetailModal } from './ScenarioDetailModal';
import styles from './ScenarioComparisonView.module.css';

interface ScenarioComparisonViewProps {
  scenarios: FailureScenario[];
  onScenarioUpdate?: (scenario: FailureScenario) => void;
}

type ImpactLevel = 'catastrophic' | 'major' | 'moderate' | 'minor';
type LikelihoodRange = 'high' | 'medium' | 'low';

interface RiskScore {
  scenario: FailureScenario;
  riskScore: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export function ScenarioComparisonView({ scenarios, onScenarioUpdate }: ScenarioComparisonViewProps) {
  const [selectedScenario, setSelectedScenario] = useState<FailureScenario | null>(null);
  const [sortBy, setSortBy] = useState<'risk' | 'likelihood' | 'impact'>('risk');

  // Calculate risk scores
  const scoredScenarios = scenarios.map(calculateRiskScore).sort((a, b) => {
    switch (sortBy) {
      case 'risk':
        return b.riskScore - a.riskScore;
      case 'likelihood':
        return b.scenario.likelihood - a.scenario.likelihood;
      case 'impact':
        return getImpactValue(b.scenario.impact) - getImpactValue(a.scenario.impact);
      default:
        return 0;
    }
  });

  // Categorize scenarios for matrix
  const matrixData = categorizeForMatrix(scoredScenarios);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Scenario Risk Analysis</h2>
          <p className={styles.subtitle}>
            {scenarios.length} scenarios identified • {matrixData.critical.length} critical risks
          </p>
        </div>

        {/* Sort Controls */}
        <div className={styles.sortControls}>
          <label className={styles.sortLabel}>Sort by:</label>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="risk">Risk Score</option>
            <option value="likelihood">Likelihood</option>
            <option value="impact">Impact</option>
          </select>
        </div>
      </div>

      {/* Risk Matrix */}
      <div className={styles.matrixSection}>
        <h3 className={styles.sectionTitle}>Risk Matrix</h3>
        <div className={styles.matrixContainer}>
          {/* Y-axis label */}
          <div className={styles.yAxisLabel}>
            <span>Likelihood</span>
          </div>

          {/* Matrix Grid */}
          <div className={styles.matrix}>
            {/* High Likelihood Row */}
            <div className={styles.matrixRow}>
              <div className={styles.matrixLabel}>High</div>
              <div className={`${styles.matrixCell} ${styles.mediumRisk}`}>
                {renderMatrixScenarios(matrixData.highLikelihood.lowImpact)}
              </div>
              <div className={`${styles.matrixCell} ${styles.highRisk}`}>
                {renderMatrixScenarios(matrixData.highLikelihood.mediumImpact)}
              </div>
              <div className={`${styles.matrixCell} ${styles.criticalRisk}`}>
                {renderMatrixScenarios(matrixData.highLikelihood.highImpact)}
              </div>
            </div>

            {/* Medium Likelihood Row */}
            <div className={styles.matrixRow}>
              <div className={styles.matrixLabel}>Medium</div>
              <div className={`${styles.matrixCell} ${styles.lowRisk}`}>
                {renderMatrixScenarios(matrixData.mediumLikelihood.lowImpact)}
              </div>
              <div className={`${styles.matrixCell} ${styles.mediumRisk}`}>
                {renderMatrixScenarios(matrixData.mediumLikelihood.mediumImpact)}
              </div>
              <div className={`${styles.matrixCell} ${styles.highRisk}`}>
                {renderMatrixScenarios(matrixData.mediumLikelihood.highImpact)}
              </div>
            </div>

            {/* Low Likelihood Row */}
            <div className={styles.matrixRow}>
              <div className={styles.matrixLabel}>Low</div>
              <div className={`${styles.matrixCell} ${styles.lowRisk}`}>
                {renderMatrixScenarios(matrixData.lowLikelihood.lowImpact)}
              </div>
              <div className={`${styles.matrixCell} ${styles.lowRisk}`}>
                {renderMatrixScenarios(matrixData.lowLikelihood.mediumImpact)}
              </div>
              <div className={`${styles.matrixCell} ${styles.mediumRisk}`}>
                {renderMatrixScenarios(matrixData.lowLikelihood.highImpact)}
              </div>
            </div>

            {/* X-axis labels */}
            <div className={styles.xAxisLabels}>
              <div></div>
              <div className={styles.xAxisLabel}>Low</div>
              <div className={styles.xAxisLabel}>Medium</div>
              <div className={styles.xAxisLabel}>High</div>
            </div>
          </div>

          {/* X-axis title */}
          <div className={styles.xAxisTitle}>Impact</div>
        </div>

        {/* Matrix Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.criticalRisk}`}></div>
            <span>Critical Risk</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.highRisk}`}></div>
            <span>High Risk</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.mediumRisk}`}></div>
            <span>Medium Risk</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendBox} ${styles.lowRisk}`}></div>
            <span>Low Risk</span>
          </div>
        </div>
      </div>

      {/* Prioritized List */}
      <div className={styles.listSection}>
        <h3 className={styles.sectionTitle}>Prioritized Scenarios</h3>
        <div className={styles.scenarioList}>
          {scoredScenarios.map((scored, index) => (
            <button
              key={scored.scenario.id}
              className={styles.scenarioCard}
              onClick={() => setSelectedScenario(scored.scenario)}
            >
              <div className={styles.scenarioHeader}>
                <div className={styles.scenarioRank}>#{index + 1}</div>
                <div className={styles.scenarioTitle}>{scored.scenario.title}</div>
                <div className={`${styles.priorityBadge} ${styles[scored.priority]}`}>
                  {scored.priority.toUpperCase()}
                </div>
              </div>

              <div className={styles.scenarioMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Likelihood:</span>
                  <div className={styles.metricBar}>
                    <div
                      className={styles.metricFill}
                      style={{ width: `${scored.scenario.likelihood}%` }}
                    ></div>
                  </div>
                  <span className={styles.metricValue}>{scored.scenario.likelihood}%</span>
                </div>

                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Impact:</span>
                  <span className={styles.impactBadge}>
                    {getImpactEmoji(scored.scenario.impact)} {scored.scenario.impact}
                  </span>
                </div>

                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Risk Score:</span>
                  <span className={styles.riskScore}>{scored.riskScore.toFixed(1)}</span>
                </div>
              </div>

              <div className={styles.scenarioPreview}>
                {scored.scenario.description.substring(0, 120)}...
              </div>

              <div className={styles.scenarioFooter}>
                <span className={styles.rootCauseCount}>
                  {scored.scenario.root_causes?.length || 0} root causes
                </span>
                <span className={styles.expandHint}>Click to view details →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedScenario && (
        <ScenarioDetailModal
          scenario={selectedScenario}
          onClose={() => setSelectedScenario(null)}
          onUpdate={onScenarioUpdate}
        />
      )}
    </div>
  );

  function renderMatrixScenarios(scenarios: RiskScore[]) {
    if (scenarios.length === 0) {
      return <div className={styles.emptyCell}>—</div>;
    }

    return (
      <div className={styles.cellScenarios}>
        {scenarios.map((scored) => (
          <button
            key={scored.scenario.id}
            className={styles.scenarioDot}
            onClick={() => setSelectedScenario(scored.scenario)}
            title={scored.scenario.title}
          >
            <span className={styles.dotNumber}>{scenarios.indexOf(scored) + 1}</span>
          </button>
        ))}
      </div>
    );
  }
}

// Helper Functions

function calculateRiskScore(scenario: FailureScenario): RiskScore {
  const impactValue = getImpactValue(scenario.impact);
  const likelihoodValue = scenario.likelihood / 100;

  // Risk Score = Impact × Likelihood (normalized to 0-100)
  const riskScore = impactValue * likelihoodValue * 100;

  // Determine priority
  let priority: RiskScore['priority'];
  if (riskScore >= 75) priority = 'critical';
  else if (riskScore >= 50) priority = 'high';
  else if (riskScore >= 25) priority = 'medium';
  else priority = 'low';

  return { scenario, riskScore, priority };
}

function getImpactValue(impact: ImpactLevel): number {
  const impactMap = {
    catastrophic: 1.0,
    major: 0.75,
    moderate: 0.5,
    minor: 0.25,
  };
  return impactMap[impact] || 0.5;
}

function getImpactEmoji(impact: ImpactLevel): string {
  const emojiMap = {
    catastrophic: '🔴',
    major: '🟠',
    moderate: '🟡',
    minor: '🟢',
  };
  return emojiMap[impact] || '⚪';
}

function getLikelihoodRange(likelihood: number): LikelihoodRange {
  if (likelihood >= 67) return 'high';
  if (likelihood >= 34) return 'medium';
  return 'low';
}

function categorizeForMatrix(scoredScenarios: RiskScore[]) {
  const matrix = {
    critical: [] as RiskScore[],
    highLikelihood: {
      lowImpact: [] as RiskScore[],
      mediumImpact: [] as RiskScore[],
      highImpact: [] as RiskScore[],
    },
    mediumLikelihood: {
      lowImpact: [] as RiskScore[],
      mediumImpact: [] as RiskScore[],
      highImpact: [] as RiskScore[],
    },
    lowLikelihood: {
      lowImpact: [] as RiskScore[],
      mediumImpact: [] as RiskScore[],
      highImpact: [] as RiskScore[],
    },
  };

  scoredScenarios.forEach((scored) => {
    const likelihood = getLikelihoodRange(scored.scenario.likelihood);
    const impactValue = getImpactValue(scored.scenario.impact);

    let impactCategory: 'lowImpact' | 'mediumImpact' | 'highImpact';
    if (impactValue >= 0.75) impactCategory = 'highImpact';
    else if (impactValue >= 0.5) impactCategory = 'mediumImpact';
    else impactCategory = 'lowImpact';

    if (scored.priority === 'critical') {
      matrix.critical.push(scored);
    }

    if (likelihood === 'high') {
      matrix.highLikelihood[impactCategory].push(scored);
    } else if (likelihood === 'medium') {
      matrix.mediumLikelihood[impactCategory].push(scored);
    } else {
      matrix.lowLikelihood[impactCategory].push(scored);
    }
  });

  return matrix;
}
