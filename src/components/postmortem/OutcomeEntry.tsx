/**
 * OutcomeEntry Component
 * Record actual outcome of the decision
 * Olumi Design System v1.2
 */

import { useState, FormEvent } from 'react';
import { useDecisionSession } from '@/context/DecisionSessionContext';
import styles from './OutcomeEntry.module.css';

type OutcomeType = 'success' | 'failure' | 'mixed';

export function OutcomeEntry() {
  const { state, dispatch } = useDecisionSession();
  const { session } = state;

  const [outcome, setOutcome] = useState<OutcomeType | null>(null);
  const [description, setDescription] = useState('');

  // Only show if decision is made but no post-mortem started yet
  if (!session || session.decision.status !== 'decided' || session.postmortem) {
    return null;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!outcome || !description.trim()) return;

    dispatch({
      type: 'START_POSTMORTEM',
      payload: {
        outcome,
        description: description.trim(),
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Record Decision Outcome</h2>
        <p className={styles.subtitle}>
          What actually happened with your decision: "{session.decision.question}"?
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Outcome Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Outcome Type</label>
            <div className={styles.outcomeOptions}>
              <button
                type="button"
                className={`${styles.outcomeButton} ${outcome === 'success' ? styles.outcomeSelected : ''} ${styles.outcomeSuccess}`}
                onClick={() => setOutcome('success')}
              >
                <span className={styles.outcomeIcon}>✓</span>
                <div className={styles.outcomeContent}>
                  <span className={styles.outcomeLabel}>Success</span>
                  <span className={styles.outcomeDesc}>Achieved desired results</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.outcomeButton} ${outcome === 'mixed' ? styles.outcomeSelected : ''} ${styles.outcomeMixed}`}
                onClick={() => setOutcome('mixed')}
              >
                <span className={styles.outcomeIcon}>~</span>
                <div className={styles.outcomeContent}>
                  <span className={styles.outcomeLabel}>Mixed</span>
                  <span className={styles.outcomeDesc}>Some success, some failure</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.outcomeButton} ${outcome === 'failure' ? styles.outcomeSelected : ''} ${styles.outcomeFailure}`}
                onClick={() => setOutcome('failure')}
              >
                <span className={styles.outcomeIcon}>✗</span>
                <div className={styles.outcomeContent}>
                  <span className={styles.outcomeLabel}>Failure</span>
                  <span className={styles.outcomeDesc}>Did not achieve goals</span>
                </div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              What happened?
              <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the actual outcome in detail. What worked? What didn't? What surprised you?"
              rows={5}
              required
              maxLength={2000}
            />
            <div className={styles.hint}>
              Be specific and honest. This helps identify lessons for future decisions.
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!outcome || !description.trim()}
          >
            Save Outcome & Continue to Lessons
          </button>
        </form>
      </div>
    </div>
  );
}
