/**
 * ScenarioCard Component
 * Modern display for failure scenarios with Olumi Design System v1.2
 * Integrated with conversational interface
 */

import { useState } from 'react';
import { FailureScenario, ImpactLevel } from '@/types/sharedModels';
import styles from './ScenarioCard.module.css';

interface ScenarioCardProps {
  scenario: FailureScenario;
  onDiscuss?: (scenario: FailureScenario) => void;
}

export function ScenarioCard({ scenario, onDiscuss }: ScenarioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLikelihoodColor = (likelihood: number): string => {
    if (likelihood >= 75) return 'var(--carrot-500)';
    if (likelihood >= 50) return 'var(--sun-500)';
    return 'var(--mint-500)';
  };

  const getImpactLabel = (impact: ImpactLevel): string => {
    const labels: Record<ImpactLevel, string> = {
      catastrophic: 'Catastrophic',
      major: 'Major',
      moderate: 'Moderate',
      minor: 'Minor',
    };
    return labels[impact] || 'Unknown';
  };

  const getImpactColor = (impact: ImpactLevel): string => {
    const colors: Record<ImpactLevel, string> = {
      catastrophic: 'var(--carrot-600)',
      major: 'var(--carrot-500)',
      moderate: 'var(--sun-500)',
      minor: 'var(--mint-500)',
    };
    return colors[impact] || 'var(--text-secondary)';
  };

  const getImpactWeight = (impact: ImpactLevel): number => {
    const weights: Record<ImpactLevel, number> = {
      catastrophic: 4,
      major: 3,
      moderate: 2,
      minor: 1,
    };
    return weights[impact];
  };

  const riskScore = (scenario.likelihood * getImpactWeight(scenario.impact)) / 100;
  const isHighRisk = riskScore >= 2;

  return (
    <div className={`${styles.card} ${isHighRisk ? styles.highRisk : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>{scenario.title}</h3>
        {isHighRisk && <span className={styles.highRiskBadge}>High Risk</span>}
      </div>

      {/* Description */}
      <p className={styles.description}>{scenario.description}</p>

      {/* Metrics */}
      <div className={styles.metrics}>
        {/* Likelihood */}
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Likelihood</div>
          <div className={styles.metricBar}>
            <div
              className={styles.metricFill}
              style={{
                width: `${scenario.likelihood}%`,
                background: getLikelihoodColor(scenario.likelihood),
              }}
            />
          </div>
          <div className={styles.metricValue}>{scenario.likelihood}%</div>
        </div>

        {/* Impact */}
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Impact</div>
          <div className={styles.impactBadge} style={{ color: getImpactColor(scenario.impact) }}>
            {getImpactLabel(scenario.impact)}
          </div>
        </div>
      </div>

      {/* Root Causes */}
      {scenario.root_causes && scenario.root_causes.length > 0 && (
        <div className={styles.section}>
          <button
            className={styles.sectionToggle}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <span>Root Causes ({scenario.root_causes.length})</span>
            <svg
              className={`${styles.toggleIcon} ${isExpanded ? styles.toggleIconExpanded : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {isExpanded && (
            <div className={styles.sectionContent}>
              {scenario.root_causes.map((cause, i) => (
                <div key={i} className={styles.rootCause}>
                  <div className={styles.rootCauseTitle}>{cause}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Early Warning Signs */}
      {scenario.early_warning_signs && scenario.early_warning_signs.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Early Warning Signs</div>
          <div className={styles.warningList}>
            {scenario.early_warning_signs.slice(0, 3).map((warning, i) => (
              <div key={i} className={styles.warningItem}>
                <span className={styles.warningIcon}>⚠️</span>
                {warning}
              </div>
            ))}
            {scenario.early_warning_signs.length > 3 && !isExpanded && (
              <button className={styles.showMore} onClick={() => setIsExpanded(true)}>
                +{scenario.early_warning_signs.length - 3} more signs
              </button>
            )}
            {isExpanded &&
              scenario.early_warning_signs.slice(3).map((warning, i) => (
                <div key={i + 3} className={styles.warningItem}>
                  <span className={styles.warningIcon}>⚠️</span>
                  {warning}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {onDiscuss && (
          <button className={styles.discussButton} onClick={() => onDiscuss(scenario)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 5.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM5 13a4 4 0 018 0H5z"
                fill="currentColor"
              />
              <path
                d="M2 4h6M2 7h4M2 10h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Discuss with Olumi
          </button>
        )}

        <button
          className={styles.expandButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Show less' : 'Show more'}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </div>
  );
}
