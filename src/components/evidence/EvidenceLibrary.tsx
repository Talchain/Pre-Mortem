/**
 * EvidenceLibrary Component
 * Manages and displays supporting evidence for pre-mortem analysis
 */

import { useState } from 'react';
import { Evidence, EvidenceType, EvidenceConfidence, DecisionSession } from '@/types/sharedModels';
import styles from './EvidenceLibrary.module.css';

interface EvidenceLibraryProps {
  session: DecisionSession | null;
  onAddEvidence?: () => void;
  onEditEvidence?: (evidence: Evidence) => void;
  onLinkEvidence?: (evidenceId: string) => void;
}

type FilterType = 'all' | EvidenceType;
type FilterConfidence = 'all' | EvidenceConfidence;

export function EvidenceLibrary({
  session,
  onAddEvidence,
  onEditEvidence,
  onLinkEvidence,
}: EvidenceLibraryProps) {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<FilterConfidence>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const evidence = session?.premortem?.evidence || [];

  // Filter evidence
  const filteredEvidence = evidence.filter((item) => {
    // Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;

    // Confidence filter
    if (confidenceFilter !== 'all' && item.confidence !== confidenceFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesDescription = item.description.toLowerCase().includes(query);
      const matchesTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesSource = item.source?.toLowerCase().includes(query);

      if (!matchesTitle && !matchesDescription && !matchesTags && !matchesSource) {
        return false;
      }
    }

    return true;
  });

  // Count by type
  const typeCounts = {
    research: evidence.filter((e) => e.type === 'research').length,
    data: evidence.filter((e) => e.type === 'data').length,
    assumption: evidence.filter((e) => e.type === 'assumption').length,
    observation: evidence.filter((e) => e.type === 'observation').length,
    document: evidence.filter((e) => e.type === 'document').length,
    stakeholder_input: evidence.filter((e) => e.type === 'stakeholder_input').length,
    historical_example: evidence.filter((e) => e.type === 'historical_example').length,
  };

  const getTypeLabel = (type: EvidenceType): string => {
    const labels: Record<EvidenceType, string> = {
      research: 'Research',
      data: 'Data',
      assumption: 'Assumption',
      observation: 'Observation',
      document: 'Document',
      stakeholder_input: 'Stakeholder Input',
      historical_example: 'Historical Example',
    };
    return labels[type];
  };

  const getTypeIcon = (type: EvidenceType): string => {
    const icons: Record<EvidenceType, string> = {
      research: '🔬',
      data: '📊',
      assumption: '💭',
      observation: '👁️',
      document: '📄',
      stakeholder_input: '💬',
      historical_example: '📖',
    };
    return icons[type];
  };

  const getConfidenceColor = (confidence: EvidenceConfidence): string => {
    const colors = {
      high: '#67C89E', // mint-500
      medium: '#F5C433', // sun-500
      low: '#EA7B4B', // carrot-500
    };
    return colors[confidence];
  };

  if (evidence.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📚</div>
          <h3 className={styles.emptyTitle}>No Evidence Yet</h3>
          <p className={styles.emptyText}>
            Build credibility by documenting research, data, and assumptions that support your analysis.
          </p>
          {onAddEvidence && (
            <button className={styles.emptyButton} onClick={onAddEvidence}>
              Add First Evidence
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Evidence Library</h2>
          <p className={styles.subtitle}>
            {evidence.length} piece{evidence.length !== 1 ? 's' : ''} of supporting evidence
          </p>
        </div>

        {onAddEvidence && (
          <button className={styles.addButton} onClick={onAddEvidence}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Add Evidence</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className={styles.search}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M10 10l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search evidence by title, description, tags, or source..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className={styles.searchClear} onClick={() => setSearchQuery('')}>
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Type:</label>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${typeFilter === 'all' ? styles.filterButtonActive : ''}`}
              onClick={() => setTypeFilter('all')}
            >
              All ({evidence.length})
            </button>
            {Object.entries(typeCounts).map(([type, count]) =>
              count > 0 ? (
                <button
                  key={type}
                  className={`${styles.filterButton} ${typeFilter === type ? styles.filterButtonActive : ''}`}
                  onClick={() => setTypeFilter(type as EvidenceType)}
                >
                  {getTypeIcon(type as EvidenceType)} {getTypeLabel(type as EvidenceType)} ({count})
                </button>
              ) : null
            )}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Confidence:</label>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${confidenceFilter === 'all' ? styles.filterButtonActive : ''}`}
              onClick={() => setConfidenceFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${confidenceFilter === 'high' ? styles.filterButtonActive : ''}`}
              onClick={() => setConfidenceFilter('high')}
            >
              High
            </button>
            <button
              className={`${styles.filterButton} ${confidenceFilter === 'medium' ? styles.filterButtonActive : ''}`}
              onClick={() => setConfidenceFilter('medium')}
            >
              Medium
            </button>
            <button
              className={`${styles.filterButton} ${confidenceFilter === 'low' ? styles.filterButtonActive : ''}`}
              onClick={() => setConfidenceFilter('low')}
            >
              Low
            </button>
          </div>
        </div>
      </div>

      {/* Evidence List */}
      <div className={styles.evidenceList}>
        {filteredEvidence.length === 0 ? (
          <div className={styles.noResults}>
            <p>No evidence matches your filters</p>
            <button
              className={styles.clearFiltersButton}
              onClick={() => {
                setTypeFilter('all');
                setConfidenceFilter('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredEvidence.map((item) => (
            <div key={item.id} className={styles.evidenceCard}>
              <div className={styles.evidenceHeader}>
                <div className={styles.evidenceType}>
                  <span className={styles.evidenceTypeIcon}>{getTypeIcon(item.type)}</span>
                  <span className={styles.evidenceTypeLabel}>{getTypeLabel(item.type)}</span>
                </div>

                <div className={styles.evidenceMeta}>
                  {item.verified && (
                    <span className={styles.verifiedBadge} title="Verified">
                      ✓
                    </span>
                  )}
                  <span
                    className={styles.confidenceBadge}
                    style={{ backgroundColor: getConfidenceColor(item.confidence) }}
                  >
                    {item.confidence}
                  </span>
                </div>
              </div>

              <h3 className={styles.evidenceTitle}>{item.title}</h3>
              <p className={styles.evidenceDescription}>{item.description}</p>

              {item.source && (
                <div className={styles.evidenceSource}>
                  <span className={styles.evidenceSourceLabel}>Source:</span>
                  <span className={styles.evidenceSourceValue}>{item.source}</span>
                </div>
              )}

              {item.tags.length > 0 && (
                <div className={styles.evidenceTags}>
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className={styles.evidenceTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {(item.linked_scenarios.length > 0 || item.linked_mitigations.length > 0) && (
                <div className={styles.evidenceLinks}>
                  {item.linked_scenarios.length > 0 && (
                    <span className={styles.evidenceLink}>
                      🔗 {item.linked_scenarios.length} scenario{item.linked_scenarios.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {item.linked_mitigations.length > 0 && (
                    <span className={styles.evidenceLink}>
                      🛡️ {item.linked_mitigations.length} mitigation{item.linked_mitigations.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}

              <div className={styles.evidenceActions}>
                {onEditEvidence && (
                  <button
                    className={styles.evidenceActionButton}
                    onClick={() => onEditEvidence(item)}
                  >
                    Edit
                  </button>
                )}
                {onLinkEvidence && (
                  <button
                    className={styles.evidenceActionButton}
                    onClick={() => onLinkEvidence(item.id)}
                  >
                    Link
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
