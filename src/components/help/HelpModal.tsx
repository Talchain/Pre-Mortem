/**
 * HelpModal Component
 * Comprehensive help documentation and keyboard shortcuts
 * Olumi Design System v1.2
 */

import { useEffect } from 'react';
import styles from './HelpModal.module.css';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Help & Documentation</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close help">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* What is Pre-Mortem? */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>What is Pre-Mortem Analysis?</h3>
            <p className={styles.text}>
              Pre-mortem analysis is a strategic planning technique where you imagine your decision
              has already failed, then work backwards to identify what could go wrong. This helps
              you proactively address risks before making your decision.
            </p>
            <div className={styles.highlight}>
              <strong>Key Benefits:</strong>
              <ul className={styles.list}>
                <li>Identify blind spots and hidden risks</li>
                <li>Challenge optimistic assumptions</li>
                <li>Develop mitigation strategies</li>
                <li>Make more informed decisions</li>
              </ul>
            </div>
          </section>

          {/* How to Use */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>How to Use This Tool</h3>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Start a Decision Session</h4>
                  <p className={styles.stepText}>
                    Describe your decision, provide context, and list your options. The more
                    detail you provide, the better the analysis.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Chat with the AI</h4>
                  <p className={styles.stepText}>
                    Engage in a conversation to explore your decision. The AI will ask clarifying
                    questions and help you think through implications.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Review Failure Scenarios</h4>
                  <p className={styles.stepText}>
                    The AI generates realistic failure scenarios for each option. Review the risks,
                    warning signs, and mitigation strategies.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Make Your Decision</h4>
                  <p className={styles.stepText}>
                    Armed with comprehensive risk analysis, make an informed decision. Optionally,
                    continue to Scenario Sandbox for deeper modeling.
                  </p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>5</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Track Outcomes (Optional)</h4>
                  <p className={styles.stepText}>
                    After your decision plays out, record the actual outcome to learn from the
                    experience and improve future decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Key Features</h3>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🤖</span>
                <div className={styles.featureContent}>
                  <strong>Multi-AI Provider Support</strong>
                  <p>Choose between Claude (Anthropic) and GPT (OpenAI) models</p>
                </div>
              </div>

              <div className={styles.feature}>
                <span className={styles.featureIcon}>💬</span>
                <div className={styles.featureContent}>
                  <strong>Conversational Analysis</strong>
                  <p>Natural dialogue to explore your decision from multiple angles</p>
                </div>
              </div>

              <div className={styles.feature}>
                <span className={styles.featureIcon}>⚠️</span>
                <div className={styles.featureContent}>
                  <strong>Failure Scenario Generation</strong>
                  <p>AI-generated realistic failure scenarios with mitigation strategies</p>
                </div>
              </div>

              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔬</span>
                <div className={styles.featureContent}>
                  <strong>Scenario Sandbox Integration</strong>
                  <p>Export to Scenario Sandbox for probabilistic modeling</p>
                </div>
              </div>

              <div className={styles.feature}>
                <span className={styles.featureIcon}>📊</span>
                <div className={styles.featureContent}>
                  <strong>Post-Mortem Tracking</strong>
                  <p>Record actual outcomes to learn from your decisions</p>
                </div>
              </div>

              <div className={styles.feature}>
                <span className={styles.featureIcon}>💾</span>
                <div className={styles.featureContent}>
                  <strong>Local Data Storage</strong>
                  <p>All data stored locally in your browser - complete privacy</p>
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Keyboard Shortcuts</h3>
            <div className={styles.shortcuts}>
              <div className={styles.shortcut}>
                <kbd className={styles.kbd}>Esc</kbd>
                <span className={styles.shortcutDesc}>Close this help modal</span>
              </div>
              <div className={styles.shortcut}>
                <kbd className={styles.kbd}>?</kbd>
                <span className={styles.shortcutDesc}>Open help (when available)</span>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Privacy & Data</h3>
            <p className={styles.text}>
              Your decision data is stored locally in your browser using localStorage. Nothing is
              sent to our servers. AI API calls go directly to your chosen provider (Anthropic or
              OpenAI) using your API key.
            </p>
            <div className={styles.warning}>
              <strong>⚠️ Important:</strong> Keep your API keys secure. Never share them or commit
              them to version control.
            </div>
          </section>

          {/* Support */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Need More Help?</h3>
            <p className={styles.text}>
              For additional support, documentation, or to report issues:
            </p>
            <div className={styles.links}>
              <a
                href="https://olumi.ai/docs/pre-mortem"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                📖 Full Documentation
              </a>
              <a
                href="https://github.com/yourusername/pre-mortem-tool/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                🐛 Report an Issue
              </a>
              <a
                href="https://olumi.ai/contact"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                💬 Contact Support
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Pre-Mortem Analysis Tool · Powered by Olumi · v
            {import.meta.env.VITE_APP_VERSION || '2.0.0'}
          </p>
        </div>
      </div>
    </div>
  );
}
