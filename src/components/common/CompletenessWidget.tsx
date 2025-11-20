/**
 * CompletenessWidget Component
 * Shows analysis completeness score with actionable suggestions
 */

import { useState } from 'react';
import { DecisionSession } from '@/types/sharedModels';
import {
  calculateCompletenessScore,
  getCompletenessLevel,
  CompletenessScore,
} from '@/services/completenessScoring';
import styles from './CompletenessWidget.module.css';

interface CompletenessWidgetProps {
  session: DecisionSession | null;
  onSuggestionClick?: (suggestion: string) => void;
}

export function CompletenessWidget({ session, onSuggestionClick }: CompletenessWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const score = calculateCompletenessScore(session);
  const level = getCompletenessLevel(score.overall);

  const handleSuggestionClick = (action?: string) => {
    if (action && onSuggestionClick) {
      onSuggestionClick(action);
    }
  };

  return (
    <div className={styles.container}>
      {/* Compact View */}
      <button
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label={`Completeness score: ${score.overall}%. Click to ${isExpanded ? 'collapse' : 'expand'}`}
      >
        <div className={styles.headerContent}>
          <div className={styles.scoreRing} style={{ '--score': score.overall } as React.CSSProperties}>
            <svg className={styles.scoreRingSvg} viewBox="0 0 36 36">
              <path
                className={styles.scoreRingBg}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
              />
              <path
                className={styles.scoreRingFill}
                stroke={level.color}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${score.overall}, 100`}
              />
              <text x="18" y="20.5" className={styles.scoreRingText}>
                {score.overall}
              </text>
            </svg>
          </div>

          <div className={styles.headerText}>
            <div className={styles.title}>Analysis Completeness</div>
            <div className={styles.subtitle} style={{ color: level.color }}>
              {level.label} • {level.description}
            </div>
          </div>
        </div>

        <div className={styles.expandIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d={isExpanded ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className={styles.details}>
          {/* Category Breakdown */}
          <div className={styles.categories}>
            <h4 className={styles.sectionTitle}>Category Breakdown</h4>
            <div className={styles.categoryList}>
              {Object.entries(score.categories).map(([key, category]) => (
                <div key={key} className={styles.category}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryName}>
                      {formatCategoryName(key)}
                    </span>
                    <span className={styles.categoryScore}>{category.score}/100</span>
                  </div>
                  <div className={styles.categoryBar}>
                    <div
                      className={styles.categoryBarFill}
                      style={{
                        width: `${category.score}%`,
                        backgroundColor: getCategoryColor(category.score),
                      }}
                    />
                  </div>
                  <div className={styles.categoryItems}>
                    {category.items.map((item, idx) => (
                      <div key={idx} className={styles.item}>
                        <span className={`${styles.itemCheck} ${item.completed ? styles.itemCheckCompleted : ''}`}>
                          {item.completed ? '✓' : '○'}
                        </span>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemScore}>
                          {item.points}/{item.maxPoints}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {score.suggestions.length > 0 && (
            <div className={styles.suggestions}>
              <h4 className={styles.sectionTitle}>Suggested Improvements</h4>
              <div className={styles.suggestionList}>
                {score.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`${styles.suggestion} ${styles[`suggestion${capitalizeFirst(suggestion.priority)}`]}`}
                  >
                    <div className={styles.suggestionHeader}>
                      <span className={styles.suggestionPriority}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                      <span className={styles.suggestionCategory}>
                        {suggestion.category}
                      </span>
                    </div>
                    <div className={styles.suggestionMessage}>{suggestion.message}</div>
                    {suggestion.action && (
                      <button
                        className={styles.suggestionAction}
                        onClick={() => handleSuggestionClick(suggestion.action)}
                      >
                        {suggestion.action}
                        <span className={styles.suggestionActionIcon}>→</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {score.overall >= 90 && (
            <div className={styles.excellenceMessage}>
              <span className={styles.excellenceIcon}>🎯</span>
              <div>
                <div className={styles.excellenceTitle}>Excellent Work!</div>
                <div className={styles.excellenceText}>
                  Your pre-mortem analysis is comprehensive and thorough.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatCategoryName(key: string): string {
  const names: Record<string, string> = {
    decisionFraming: 'Decision Framing',
    scenarioAnalysis: 'Scenario Analysis',
    mitigationPlanning: 'Mitigation Planning',
    stakeholderConsideration: 'Stakeholder Consideration',
  };
  return names[key] || key;
}

function getCategoryColor(score: number): string {
  if (score >= 75) return '#67C89E'; // mint-500
  if (score >= 50) return '#63ADCF'; // sky-500
  if (score >= 25) return '#F5C433'; // sun-500
  return '#EA7B4B'; // carrot-500
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
