/**
 * AppHeader Component
 * Main application header with branding and help access
 * Olumi Design System v1.2
 */

import { useState } from 'react';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  onHelpClick?: () => void;
}

export function AppHeader({ onHelpClick }: AppHeaderProps) {
  const [showVersionInfo, setShowVersionInfo] = useState(false);
  const version = import.meta.env.VITE_APP_VERSION || '2.0.0';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo & Title */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🔮</span>
            <div className={styles.logoText}>
              <h1 className={styles.title}>Pre-Mortem Analysis</h1>
              <p className={styles.tagline}>Powered by Olumi</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Version Badge */}
          <button
            className={styles.versionBadge}
            onClick={() => setShowVersionInfo(!showVersionInfo)}
            aria-label="Version information"
          >
            v{version}
          </button>

          {/* Help Button */}
          {onHelpClick && (
            <button
              className={styles.helpButton}
              onClick={onHelpClick}
              aria-label="Open help"
            >
              <span className={styles.helpIcon}>?</span>
              <span className={styles.helpText}>Help</span>
            </button>
          )}
        </div>

        {/* Version Info Tooltip */}
        {showVersionInfo && (
          <div className={styles.versionTooltip}>
            <div className={styles.tooltipContent}>
              <strong>Pre-Mortem Analysis Tool</strong>
              <p>Version {version}</p>
              <p className={styles.tooltipHint}>
                AI-powered decision analysis with pre-mortem methodology
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
