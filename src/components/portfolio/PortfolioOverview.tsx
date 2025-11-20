/**
 * PortfolioOverview Component
 * High-level statistics and outcome distribution
 */

import { PortfolioStats, DecisionSummary } from '@/types/sharedModels';
import styles from './PortfolioOverview.module.css';

interface PortfolioOverviewProps {
  stats: PortfolioStats;
  decisions: DecisionSummary[];
}

export function PortfolioOverview({ stats, decisions }: PortfolioOverviewProps) {
  const totalWithOutcomes = stats.outcomes.success + stats.outcomes.failure + stats.outcomes.mixed;

  // Recent decisions (last 5)
  const recentDecisions = decisions.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Total Decisions</h3>
          <p className={styles.statValue}>{stats.total_decisions}</p>
          <p className={styles.statSubtext}>
            {stats.completed_decisions} with outcomes recorded
          </p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Avg Scenarios</h3>
          <p className={styles.statValue}>{stats.avg_scenarios_per_decision}</p>
          <p className={styles.statSubtext}>Per decision analysis</p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Avg Mitigations</h3>
          <p className={styles.statValue}>{stats.avg_mitigations_per_decision}</p>
          <p className={styles.statSubtext}>Per decision analysis</p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statLabel}>Completion Rate</h3>
          <p className={styles.statValue}>
            {stats.total_decisions > 0
              ? Math.round((stats.completed_decisions / stats.total_decisions) * 100)
              : 0}
            %
          </p>
          <p className={styles.statSubtext}>Decisions with outcomes</p>
        </div>
      </div>

      {/* Outcome Distribution */}
      {totalWithOutcomes > 0 && (
        <div className={styles.outcomes}>
          <h3 className={styles.outcomesTitle}>Outcome Distribution</h3>
          <div className={styles.outcomesGrid}>
            <div className={styles.outcomeCard}>
              <div className={styles.outcomeIcon}>✅</div>
              <p className={styles.outcomeValue}>{stats.outcomes.success}</p>
              <p className={styles.outcomeLabel}>Successful</p>
              <p className={styles.outcomePercentage}>
                {Math.round((stats.outcomes.success / totalWithOutcomes) * 100)}%
              </p>
            </div>

            <div className={styles.outcomeCard}>
              <div className={styles.outcomeIcon}>⚠️</div>
              <p className={styles.outcomeValue}>{stats.outcomes.mixed}</p>
              <p className={styles.outcomeLabel}>Mixed Results</p>
              <p className={styles.outcomePercentage}>
                {Math.round((stats.outcomes.mixed / totalWithOutcomes) * 100)}%
              </p>
            </div>

            <div className={styles.outcomeCard}>
              <div className={styles.outcomeIcon}>❌</div>
              <p className={styles.outcomeValue}>{stats.outcomes.failure}</p>
              <p className={styles.outcomeLabel}>Failed</p>
              <p className={styles.outcomePercentage}>
                {Math.round((stats.outcomes.failure / totalWithOutcomes) * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Decisions */}
      {recentDecisions.length > 0 && (
        <div className={styles.recent}>
          <h3 className={styles.recentTitle}>Recent Decisions</h3>
          <div className={styles.recentList}>
            {recentDecisions.map((decision) => (
              <div
                key={decision.id}
                className={styles.recentItem}
                onClick={() => (window.location.href = `/?session=${decision.id}`)}
              >
                <h4 className={styles.recentItemTitle}>
                  {decision.question}
                  {decision.outcome && (
                    <span
                      className={`${styles.recentItemBadge} ${
                        decision.outcome === 'success'
                          ? styles.badgeSuccess
                          : decision.outcome === 'failure'
                          ? styles.badgeFailure
                          : styles.badgeMixed
                      }`}
                    >
                      {decision.outcome}
                    </span>
                  )}
                </h4>
                <p className={styles.recentItemMeta}>
                  {formatDate(decision.created_at)} • {decision.scenario_count} scenarios •{' '}
                  {decision.mitigation_count} mitigations
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
