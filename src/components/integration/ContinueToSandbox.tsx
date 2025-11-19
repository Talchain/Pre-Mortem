/**
 * ContinueToSandbox Component
 * Provides seamless handoff to Scenario Sandbox for continued analysis
 * Olumi Design System v1.2
 */

import { useState, useEffect } from 'react';
import { useDecisionSession } from '@/context/DecisionSessionContext';
import { scenarioSandbox } from '@/services/scenarioSandboxIntegration';
import styles from './ContinueToSandbox.module.css';

export function ContinueToSandbox() {
  const { state } = useDecisionSession();
  const { session } = state;

  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [version, setVersion] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show if pre-mortem is complete (scenarios analyzed)
  if (
    !session ||
    !session.scenarios ||
    session.scenarios.length === 0 ||
    session.postmortem // Don't show if post-mortem has started
  ) {
    return null;
  }

  // Check availability on mount
  useEffect(() => {
    checkSandboxAvailability();
  }, []);

  const checkSandboxAvailability = async () => {
    setChecking(true);
    setError(null);
    const result = await scenarioSandbox.checkAvailability();
    setAvailable(result.available);
    setVersion(result.version || '');
    if (result.error) {
      setError(result.error);
    }
    setChecking(false);
  };

  const handleContinueToSandbox = async () => {
    if (!session) return;

    setSending(true);
    setError(null);

    const result = await scenarioSandbox.sendToSandbox(session);

    if (result.success && result.sandboxUrl) {
      // Open Sandbox in new tab
      window.open(result.sandboxUrl, '_blank');
      setSending(false);
    } else {
      setError(result.error || 'Failed to connect to Scenario Sandbox');
      setSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Icon */}
        <div className={styles.icon}>🔬</div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>Continue to Scenario Sandbox</h3>
          <p className={styles.description}>
            Take your pre-mortem analysis further with advanced probabilistic modeling and
            second-order effect exploration in the Scenario Sandbox.
          </p>

          {/* Features */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📈</span>
              <div className={styles.featureContent}>
                <strong className={styles.featureTitle}>Probabilistic Modeling</strong>
                <p className={styles.featureDesc}>
                  Run Monte Carlo simulations to quantify risk probabilities
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔗</span>
              <div className={styles.featureContent}>
                <strong className={styles.featureTitle}>Second-Order Effects</strong>
                <p className={styles.featureDesc}>
                  Explore cascading impacts and unintended consequences
                </p>
              </div>
            </div>

            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎯</span>
              <div className={styles.featureContent}>
                <strong className={styles.featureTitle}>Decision Confidence</strong>
                <p className={styles.featureDesc}>
                  Calculate confidence intervals for your decision outcomes
                </p>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {checking && (
            <div className={styles.statusMessage}>
              <div className={styles.spinner} />
              <span>Checking Scenario Sandbox availability...</span>
            </div>
          )}

          {error && !checking && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              <div className={styles.errorContent}>
                <strong>Connection Error</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.actions}>
            {available && !checking && (
              <>
                <button
                  className={styles.primaryButton}
                  onClick={handleContinueToSandbox}
                  disabled={sending}
                >
                  {sending ? (
                    <>
                      <div className={styles.buttonSpinner} />
                      <span>Opening Scenario Sandbox...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Scenario Sandbox</span>
                      <span className={styles.buttonIcon}>→</span>
                    </>
                  )}
                </button>
                {version && (
                  <div className={styles.versionInfo}>Sandbox v{version} available</div>
                )}
              </>
            )}

            {!available && !checking && (
              <>
                <div className={styles.unavailableMessage}>
                  <p>Scenario Sandbox is currently unavailable.</p>
                  <p className={styles.unavailableHint}>
                    Make sure the Sandbox is running and configured in your environment settings.
                  </p>
                </div>
                <button className={styles.secondaryButton} onClick={checkSandboxAvailability}>
                  <span className={styles.retryIcon}>↻</span>
                  <span>Retry Connection</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
