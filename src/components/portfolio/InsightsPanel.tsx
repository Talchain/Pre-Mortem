/**
 * InsightsPanel Component
 * Pattern analysis and learnings
 */

import { PortfolioStats } from '@/types/sharedModels';
import styles from './InsightsPanel.module.css';

interface InsightsPanelProps {
  stats: PortfolioStats;
}

export function InsightsPanel({ stats }: InsightsPanelProps) {
  const hasScenarios = stats.most_common_scenarios.length > 0;
  const hasMitigations = stats.most_effective_mitigations.length > 0;
  const hasHeatmap = stats.risk_heatmap.length > 0;

  // Get heatmap data organized by likelihood and impact
  const getHeatmapValue = (
    likelihood: 'low' | 'medium' | 'high',
    impact: 'minor' | 'moderate' | 'major' | 'catastrophic'
  ) => {
    const cell = stats.risk_heatmap.find(
      (h) => h.likelihood_bucket === likelihood && h.impact_bucket === impact
    );
    return cell ? cell.count : 0;
  };

  const maxHeatmapValue = Math.max(...stats.risk_heatmap.map((h) => h.count), 1);

  const getHeatmapIntensity = (value: number): string => {
    const ratio = value / maxHeatmapValue;
    if (ratio === 0) return '';
    if (ratio < 0.25) return styles.heatmapCellLow;
    if (ratio < 0.5) return styles.heatmapCellMedium;
    if (ratio < 0.75) return styles.heatmapCellHigh;
    return styles.heatmapCellCritical;
  };

  return (
    <div className={styles.container}>
      {/* Most Common Scenarios */}
      {hasScenarios && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>⚠️</span>
            Most Common Failure Scenarios
          </h3>
          <p className={styles.sectionDescription}>
            Scenarios that occurred most frequently across your completed decisions. These
            patterns can inform future risk assessments.
          </p>
          <div className={styles.list}>
            {stats.most_common_scenarios.slice(0, 5).map((scenario, idx) => (
              <div key={idx} className={styles.listItem}>
                <div className={styles.listItemRank}>{idx + 1}</div>
                <div className={styles.listItemContent}>
                  <h4 className={styles.listItemTitle}>{scenario.title}</h4>
                  <p className={styles.listItemMeta}>
                    Occurred in {scenario.occurrence_count} decision
                    {scenario.occurrence_count !== 1 ? 's' : ''} (
                    {Math.round(scenario.occurrence_rate)}% of completed)
                  </p>
                </div>
                <div className={styles.listItemBar}>
                  <div
                    className={styles.listItemBarFill}
                    style={{ width: `${scenario.occurrence_rate}%` }}
                  />
                </div>
                <div className={styles.listItemValue}>
                  {Math.round(scenario.occurrence_rate)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Effective Mitigations */}
      {hasMitigations && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🛡️</span>
            Most Effective Mitigations
          </h3>
          <p className={styles.sectionDescription}>
            Mitigation strategies that have proven most effective when implemented. Higher
            ratings indicate consistent positive outcomes.
          </p>
          <div className={styles.list}>
            {stats.most_effective_mitigations.slice(0, 5).map((mitigation, idx) => (
              <div key={idx} className={styles.listItem}>
                <div className={styles.listItemRank}>{idx + 1}</div>
                <div className={styles.listItemContent}>
                  <h4 className={styles.listItemTitle}>{mitigation.strategy}</h4>
                  <p className={styles.listItemMeta}>
                    Implemented {mitigation.implementation_count} time
                    {mitigation.implementation_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className={styles.listItemBar}>
                  <div
                    className={styles.listItemBarFill}
                    style={{ width: `${mitigation.effectiveness_rating}%` }}
                  />
                </div>
                <div className={styles.listItemValue}>
                  {Math.round(mitigation.effectiveness_rating)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Heatmap */}
      {hasHeatmap && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔥</span>
            Risk Distribution Heatmap
          </h3>
          <p className={styles.sectionDescription}>
            Distribution of identified risks by likelihood and impact. Darker cells indicate
            more scenarios in that risk category.
          </p>
          <div className={styles.heatmap}>
            {/* Top row: Impact labels */}
            <div className={styles.heatmapLabel}></div>
            <div className={styles.heatmapColumnLabel}>Minor</div>
            <div className={styles.heatmapColumnLabel}>Moderate</div>
            <div className={styles.heatmapColumnLabel}>Major</div>
            <div className={styles.heatmapColumnLabel}>Critical</div>

            {/* High Likelihood Row */}
            <div className={styles.heatmapLabel}>High</div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('high', 'minor')
              )}`}
            >
              {getHeatmapValue('high', 'minor') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('high', 'moderate')
              )}`}
            >
              {getHeatmapValue('high', 'moderate') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('high', 'major')
              )}`}
            >
              {getHeatmapValue('high', 'major') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('high', 'catastrophic')
              )}`}
            >
              {getHeatmapValue('high', 'catastrophic') || '-'}
            </div>

            {/* Medium Likelihood Row */}
            <div className={styles.heatmapLabel}>Medium</div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('medium', 'minor')
              )}`}
            >
              {getHeatmapValue('medium', 'minor') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('medium', 'moderate')
              )}`}
            >
              {getHeatmapValue('medium', 'moderate') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('medium', 'major')
              )}`}
            >
              {getHeatmapValue('medium', 'major') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('medium', 'catastrophic')
              )}`}
            >
              {getHeatmapValue('medium', 'catastrophic') || '-'}
            </div>

            {/* Low Likelihood Row */}
            <div className={styles.heatmapLabel}>Low</div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('low', 'minor')
              )}`}
            >
              {getHeatmapValue('low', 'minor') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('low', 'moderate')
              )}`}
            >
              {getHeatmapValue('low', 'moderate') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('low', 'major')
              )}`}
            >
              {getHeatmapValue('low', 'major') || '-'}
            </div>
            <div
              className={`${styles.heatmapCell} ${getHeatmapIntensity(
                getHeatmapValue('low', 'catastrophic')
              )}`}
            >
              {getHeatmapValue('low', 'catastrophic') || '-'}
            </div>
          </div>
        </div>
      )}

      {!hasScenarios && !hasMitigations && !hasHeatmap && (
        <div className={styles.section}>
          <div className={styles.empty}>
            <p>
              Insights will appear once you have completed some decisions and recorded their
              outcomes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
