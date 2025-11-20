/**
 * PortfolioDashboard Component
 * Main portfolio analytics view
 */

import { useState, useEffect } from 'react';
import { PortfolioStats, DecisionSummary } from '@/types/sharedModels';
import { calculatePortfolioStats, getDecisionSummaries } from '@/services/portfolioService';
import { PortfolioOverview } from './PortfolioOverview';
import { DecisionList } from './DecisionList';
import { InsightsPanel } from './InsightsPanel';
import styles from './PortfolioDashboard.module.css';

type Tab = 'overview' | 'decisions' | 'insights';

export function PortfolioDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [decisions, setDecisions] = useState<DecisionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Load portfolio data on mount
  useEffect(() => {
    try {
      const portfolioStats = calculatePortfolioStats();
      const decisionSummaries = getDecisionSummaries();

      setStats(portfolioStats);
      setDecisions(decisionSummaries);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data (called after changes)
  const refreshData = () => {
    try {
      const portfolioStats = calculatePortfolioStats();
      const decisionSummaries = getDecisionSummaries();

      setStats(portfolioStats);
      setDecisions(decisionSummaries);
    } catch (error) {
      console.error('Failed to refresh portfolio data:', error);
    }
  };

  const hasData = stats && stats.total_decisions > 0;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Portfolio Analytics</h1>
          <p className={styles.subtitle}>Loading your decision history...</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Portfolio Analytics</h1>
          <p className={styles.subtitle}>
            Track outcomes and learn from your decisions over time
          </p>
        </div>

        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📊</div>
          <h3 className={styles.emptyTitle}>No Decisions Yet</h3>
          <p className={styles.emptyText}>
            Your portfolio will show aggregate insights once you've completed some pre-mortem
            analyses. Start by creating your first decision analysis.
          </p>
          <button className={styles.emptyButton} onClick={() => (window.location.href = '/')}>
            Start New Pre-Mortem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Portfolio Analytics</h1>
        <p className={styles.subtitle}>
          {stats.total_decisions} decision{stats.total_decisions !== 1 ? 's' : ''} tracked •{' '}
          {stats.completed_decisions} with outcomes recorded
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'decisions' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('decisions')}
        >
          Decisions ({decisions.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'insights' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'overview' && <PortfolioOverview stats={stats} decisions={decisions} />}
        {activeTab === 'decisions' && (
          <DecisionList decisions={decisions} onRefresh={refreshData} />
        )}
        {activeTab === 'insights' && <InsightsPanel stats={stats} />}
      </div>
    </div>
  );
}
