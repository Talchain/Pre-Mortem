/**
 * DiagnosticsOverlay Component
 * Displays AI processing diagnostics in a collapsible overlay
 * Shows processing time, token usage, model info, and warnings
 */

import { useState } from 'react';
import { Diagnostics } from '@/types/sharedModels';
import styles from './DiagnosticsOverlay.module.css';

interface DiagnosticsOverlayProps {
  diagnostics: Diagnostics;
  className?: string;
}

export function DiagnosticsOverlay({ diagnostics, className }: DiagnosticsOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    apiCalls,
    totalProcessingTimeMs,
    degraded,
    degradedReason,
    warnings,
  } = diagnostics;

  const totalTokens = apiCalls.reduce((sum, call) => sum + (call.tokensUsed || 0), 0);
  const successfulCalls = apiCalls.filter((call) => call.status === 'success').length;
  const failedCalls = apiCalls.filter((call) => call.status === 'error').length;

  return (
    <div className={`${styles.overlay} ${className || ''}`}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label="Toggle diagnostics panel"
      >
        <span className={styles.icon}>
          {isExpanded ? '▼' : '▶'}
        </span>
        <span className={styles.label}>
          Diagnostics
        </span>
        <span className={styles.badge}>
          {degraded ? (
            <span className={styles.degradedBadge}>⚠ Degraded</span>
          ) : (
            <span className={styles.healthyBadge}>✓ Healthy</span>
          )}
        </span>
      </button>

      {isExpanded && (
        <div className={styles.panel}>
          {/* Summary Stats */}
          <div className={styles.summarySection}>
            <h3 className={styles.sectionTitle}>Summary</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Processing Time</span>
                <span className={styles.statValue}>
                  {(totalProcessingTimeMs / 1000).toFixed(2)}s
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>API Calls</span>
                <span className={styles.statValue}>
                  {apiCalls.length} ({successfulCalls} success, {failedCalls} failed)
                </span>
              </div>
              {totalTokens > 0 && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Total Tokens</span>
                  <span className={styles.statValue}>{totalTokens.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Degraded State */}
          {degraded && (
            <div className={styles.degradedSection}>
              <h3 className={styles.sectionTitle}>⚠ Degraded Mode</h3>
              <p className={styles.degradedReason}>{degradedReason}</p>
            </div>
          )}

          {/* Warnings */}
          {warnings && warnings.length > 0 && (
            <div className={styles.warningsSection}>
              <h3 className={styles.sectionTitle}>Warnings</h3>
              <ul className={styles.warningsList}>
                {warnings.map((warning, index) => (
                  <li key={index} className={styles.warningItem}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* API Call Details */}
          <div className={styles.apiCallsSection}>
            <h3 className={styles.sectionTitle}>API Call Details</h3>
            <div className={styles.callsList}>
              {apiCalls.map((call, index) => (
                <div key={index} className={styles.callItem}>
                  <div className={styles.callHeader}>
                    <span className={styles.callStep}>Step {index + 1}</span>
                    <span
                      className={`${styles.callStatus} ${
                        call.status === 'success'
                          ? styles.statusSuccess
                          : styles.statusError
                      }`}
                    >
                      {call.status === 'success' ? '✓' : '✗'} {call.status}
                    </span>
                  </div>
                  <div className={styles.callDetails}>
                    <div className={styles.callDetail}>
                      <span className={styles.detailLabel}>Model:</span>
                      <span className={styles.detailValue}>{call.model}</span>
                    </div>
                    <div className={styles.callDetail}>
                      <span className={styles.detailLabel}>Time:</span>
                      <span className={styles.detailValue}>
                        {(call.durationMs / 1000).toFixed(2)}s
                      </span>
                    </div>
                    {call.tokensUsed && (
                      <div className={styles.callDetail}>
                        <span className={styles.detailLabel}>Tokens:</span>
                        <span className={styles.detailValue}>
                          {call.tokensUsed.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {call.errorMessage && (
                      <div className={styles.callError}>
                        <span className={styles.errorLabel}>Error:</span>
                        <span className={styles.errorMessage}>{call.errorMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
