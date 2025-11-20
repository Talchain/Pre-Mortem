/**
 * DegradedBanner Component
 * Displays a prominent banner when AI services are unavailable or degraded
 * Provides information about affected features and manual entry fallback
 */

import { useState } from 'react';
import styles from './DegradedBanner.module.css';

interface DegradedBannerProps {
  reason: string;
  affectedFeatures: string[];
  onEnableManualMode?: () => void;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function DegradedBanner({
  reason,
  affectedFeatures,
  onEnableManualMode,
  onRetry,
  onDismiss,
  className,
}: DegradedBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className={`${styles.banner} ${className || ''}`} role="alert">
      <div className={styles.iconSection}>
        <span className={styles.icon} aria-hidden="true">
          ⚠
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Analysis incomplete — AI service temporarily unavailable</h2>
          <button
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>

        <p className={styles.reason}>{reason}</p>

        {affectedFeatures.length > 0 && (
          <div className={styles.affectedSection}>
            <p className={styles.affectedLabel}>Affected features:</p>
            <ul className={styles.affectedList}>
              {affectedFeatures.map((feature, index) => (
                <li key={index} className={styles.affectedItem}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.actions}>
          {onEnableManualMode && (
            <button className={styles.primaryButton} onClick={onEnableManualMode}>
              Continue with Manual Entry
            </button>
          )}
          {onRetry && (
            <button className={styles.secondaryButton} onClick={onRetry}>
              Retry AI Analysis
            </button>
          )}
        </div>

        <p className={styles.helpText}>
          Your progress has been saved. You can continue manually or try again later when the
          service is available.
        </p>
      </div>
    </div>
  );
}
