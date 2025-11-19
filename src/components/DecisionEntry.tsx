/**
 * DecisionEntry Component
 * Simplified single-input entry point for pre-mortem analysis
 * Replaces the old 7-step wizard with AI-guided conversation
 * Olumi Design System v1.2
 */

import { useState, FormEvent } from 'react';
import { useDecisionSession } from '@/context/DecisionSessionContext';
import styles from './DecisionEntry.module.css';

export function DecisionEntry() {
  const { startSession, sendMessage, state } = useDecisionSession();
  const [question, setQuestion] = useState('');
  const [quickContext, setQuickContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    setIsSubmitting(true);

    try {
      // Start session with question
      await startSession(question.trim());

      // If quick context provided, send it as first message
      if (quickContext.trim()) {
        await sendMessage(`Additional context: ${quickContext.trim()}`);
      }

      // Clear form
      setQuestion('');
      setQuickContext('');
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasActiveSession = state.session && state.session.decision.status === 'active';

  if (hasActiveSession) {
    // Show active session summary instead of entry form
    return (
      <div className={styles.activeSession}>
        <div className={styles.activeHeader}>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            Active Analysis
          </div>
        </div>

        <div className={styles.activeContent}>
          <h2 className={styles.activeQuestion}>{state.session!.decision.question}</h2>

          {state.session!.decision.context && (
            <p className={styles.activeContext}>{state.session!.decision.context}</p>
          )}

          <div className={styles.activeStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{state.session!.conversation.length}</span>
              <span className={styles.statLabel}>Messages</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{state.session!.decision.options.length}</span>
              <span className={styles.statLabel}>Options</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {state.session!.premortem?.failure_scenarios.length || 0}
              </span>
              <span className={styles.statLabel}>Scenarios</span>
            </div>
          </div>

          <p className={styles.activeHint}>
            Continue your analysis in the chat below, or{' '}
            <button
              className={styles.resetLink}
              onClick={() => {
                if (confirm('Start a new analysis? Your current session will be saved.')) {
                  // Archive current session and start fresh
                  window.location.reload();
                }
              }}
            >
              start a new analysis
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.title}>Pre-Mortem Analysis</h1>
        <p className={styles.subtitle}>
          Anticipate what could go wrong before you make your decision. Olumi will guide you through
          identifying risks and mitigation strategies using AI-powered analysis.
        </p>
      </div>

      {/* Entry Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="question" className={styles.label}>
            What decision are you considering?
            <span className={styles.required}>*</span>
          </label>
          <textarea
            id="question"
            className={styles.textarea}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., Should we migrate our infrastructure to Kubernetes?"
            rows={3}
            required
            disabled={isSubmitting}
            maxLength={500}
          />
          <div className={styles.hint}>
            Be specific. Olumi will ask follow-up questions to understand your context.
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quickContext" className={styles.label}>
            Quick context <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            id="quickContext"
            className={styles.textarea}
            value={quickContext}
            onChange={(e) => setQuickContext(e.target.value)}
            placeholder="E.g., We're a 50-person startup with a monolithic Rails app handling 10M requests/day..."
            rows={2}
            disabled={isSubmitting}
            maxLength={1000}
          />
          <div className={styles.hint}>
            Any quick context helps, but Olumi will ask targeted questions to fill gaps.
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!question.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner}></span>
              Starting Analysis...
            </>
          ) : (
            <>
              <svg
                className={styles.buttonIcon}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 3v14m7-7H3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Start Pre-Mortem Analysis
            </>
          )}
        </button>
      </form>

      {/* How It Works */}
      <div className={styles.howItWorks}>
        <h3 className={styles.howItWorksTitle}>How it works</h3>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Share Your Decision</h4>
              <p className={styles.stepText}>
                Tell Olumi what you're considering. No need for extensive details yet.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Guided Conversation</h4>
              <p className={styles.stepText}>
                Olumi asks 2-3 targeted questions to understand your context, constraints, and goals.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>AI Analysis</h4>
              <p className={styles.stepText}>
                Olumi generates failure scenarios from multiple perspectives (optimistic, pessimistic,
                realistic) and suggests mitigations.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h4 className={styles.stepTitle}>Refine & Act</h4>
              <p className={styles.stepText}>
                Discuss scenarios, explore risks, and export your analysis to share with stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🎯</div>
          <h4 className={styles.featureTitle}>Multi-Agent Reasoning</h4>
          <p className={styles.featureText}>
            Olumi considers optimistic, pessimistic, and realistic perspectives for balanced analysis
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>💬</div>
          <h4 className={styles.featureTitle}>Conversational</h4>
          <p className={styles.featureText}>
            Natural dialogue instead of rigid forms. Ask questions, explore scenarios dynamically.
          </p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>⚡</div>
          <h4 className={styles.featureTitle}>Fast & Focused</h4>
          <p className={styles.featureText}>
            70% fewer inputs than traditional pre-mortems. Get insights in minutes, not hours.
          </p>
        </div>
      </div>
    </div>
  );
}
