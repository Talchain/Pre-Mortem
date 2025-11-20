/**
 * DecisionList Component
 * Sortable table of all decisions
 */

import { useState, useMemo } from 'react';
import { DecisionSummary } from '@/types/sharedModels';
import { deleteSession } from '@/services/portfolioService';
import styles from './DecisionList.module.css';

interface DecisionListProps {
  decisions: DecisionSummary[];
  onRefresh: () => void;
}

type SortField = 'question' | 'created_at' | 'status' | 'outcome';
type SortDirection = 'asc' | 'desc';

export function DecisionList({ decisions, onRefresh }: DecisionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort decisions
  const filteredDecisions = useMemo(() => {
    let filtered = decisions;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((d) => d.question.toLowerCase().includes(query));
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle missing values
      if (aVal === undefined) aVal = '';
      if (bVal === undefined) bVal = '';

      // String comparison
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      // Default comparison
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [decisions, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleView = (decisionId: string) => {
    window.location.href = `/?session=${decisionId}`;
  };

  const handleDelete = (decisionId: string, question: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${question}"? This cannot be undone.`
      )
    ) {
      deleteSession(decisionId);
      onRefresh();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  if (decisions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>No decisions found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Search */}
      <div className={styles.search}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search decisions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th
              className={`${styles.th} ${styles.thSortable}`}
              onClick={() => handleSort('question')}
            >
              Decision {sortField === 'question' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className={`${styles.th} ${styles.thSortable}`}
              onClick={() => handleSort('created_at')}
            >
              Date {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className={`${styles.th} ${styles.thSortable}`}
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className={`${styles.th} ${styles.thSortable}`}
              onClick={() => handleSort('outcome')}
            >
              Outcome {sortField === 'outcome' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {filteredDecisions.map((decision) => (
            <tr key={decision.id} className={styles.tr}>
              <td className={styles.td}>
                <h4 className={styles.decisionTitle}>{decision.question}</h4>
                <p className={styles.decisionMeta}>
                  {decision.scenario_count} scenarios • {decision.mitigation_count}{' '}
                  mitigations
                </p>
              </td>
              <td className={styles.td}>{formatDate(decision.created_at)}</td>
              <td className={styles.td}>
                <span
                  className={`${styles.statusBadge} ${
                    styles[`status${decision.status.charAt(0).toUpperCase() + decision.status.slice(1)}`]
                  }`}
                >
                  {decision.status}
                </span>
              </td>
              <td className={styles.td}>
                {decision.outcome ? (
                  <span
                    className={`${styles.outcomeBadge} ${
                      styles[`outcome${decision.outcome.charAt(0).toUpperCase() + decision.outcome.slice(1)}`]
                    }`}
                  >
                    {decision.outcome}
                  </span>
                ) : (
                  <span className={styles.outcomeNone}>Not recorded</span>
                )}
              </td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleView(decision.id)}
                  >
                    View
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(decision.id, decision.question)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredDecisions.length === 0 && searchQuery && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            No decisions match "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
