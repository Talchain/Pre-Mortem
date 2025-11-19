/**
 * PostMortemTrigger Component
 * Prompts user to start post-mortem analysis after decision is made
 * Olumi Design System v1.2
 */

import { useDecisionSession } from '@/context/DecisionSessionContext';
import styles from './PostMortemTrigger.module.css';

export function PostMortemTrigger() {
  const { state } = useDecisionSession();
  const { session } = state;

  if (!session) return null;

  const isDecided = session.decision.status === 'decided';
  const hasPostMortem = !!session.postmortem;

  // Only show if decision is made but no post-mortem yet
  if (!isDecided || hasPostMortem) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>📊</div>
        <div className={styles.content}>
          <h3 className={styles.title}>Ready for Post-Mortem Analysis?</h3>
          <p className={styles.description}>
            Now that you've made your decision, track the actual outcome to learn from this
            experience. Compare what happened to your pre-mortem predictions and capture lessons
            for future decisions.
          </p>

          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>✓</span>
              <span>Track actual vs predicted outcomes</span>
            </div>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>✓</span>
              <span>Identify lessons learned</span>
            </div>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>✓</span>
              <span>Improve future decision-making</span>
            </div>
          </div>

          <p className={styles.scrollHint}>
            ↓ Fill out the outcome form below ↓
          </p>
        </div>
      </div>
    </div>
  );
}
