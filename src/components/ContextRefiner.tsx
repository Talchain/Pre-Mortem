/**
 * ContextRefiner Component
 * Shows extracted context from conversation and what's still needed
 * Provides visual feedback during AI-guided context gathering
 * Olumi Design System v1.2
 */

import { useDecisionSession } from '@/context/DecisionSessionContext';
import { hasMinimalContextForAnalysis } from '@/services/aiOrchestration';
import styles from './ContextRefiner.module.css';

export function ContextRefiner() {
  const { state } = useDecisionSession();
  const { session } = state;

  if (!session) return null;

  const hasQuestion = !!session.decision.question && session.decision.question.length > 10;
  const hasContext = !!session.decision.context && session.decision.context.length > 20;
  const hasOptions = session.decision.options.length > 0;
  const hasFactors = session.decision.factors.length > 0;
  const hasStakeholders = session.decision.stakeholders.length > 0;

  const isComplete = hasMinimalContextForAnalysis(session);

  // Calculate completeness percentage
  const completedItems = [hasQuestion, hasContext, hasOptions].filter(Boolean).length;
  const totalRequiredItems = 3; // question, context, and at least options OR factors
  const completeness = Math.round((completedItems / totalRequiredItems) * 100);

  return (
    <div className={styles.container}>
      {/* Progress Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Context Gathering</h3>
        <div className={styles.progressBadge}>
          <div className={styles.progressRing}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="var(--bg-subtle)"
                strokeWidth="3"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke={isComplete ? 'var(--mint-500)' : 'var(--sun-500)'}
                strokeWidth="3"
                strokeDasharray={`${completeness * 0.88} 88`}
                strokeDashoffset="22"
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>
            <span className={styles.progressPercent}>{completeness}%</span>
          </div>
        </div>
      </div>

      {/* Context Items */}
      <div className={styles.items}>
        {/* Decision Question */}
        <div className={`${styles.item} ${hasQuestion ? styles.itemComplete : styles.itemPending}`}>
          <div className={styles.itemIcon}>
            {hasQuestion ? '✓' : '○'}
          </div>
          <div className={styles.itemContent}>
            <div className={styles.itemLabel}>Decision Question</div>
            {hasQuestion ? (
              <div className={styles.itemValue}>{session.decision.question}</div>
            ) : (
              <div className={styles.itemPlaceholder}>Not yet defined</div>
            )}
          </div>
        </div>

        {/* Context/Background */}
        <div className={`${styles.item} ${hasContext ? styles.itemComplete : styles.itemPending}`}>
          <div className={styles.itemIcon}>
            {hasContext ? '✓' : '○'}
          </div>
          <div className={styles.itemContent}>
            <div className={styles.itemLabel}>Context & Background</div>
            {hasContext ? (
              <div className={styles.itemValue}>
                {session.decision.context.length > 100
                  ? `${session.decision.context.substring(0, 100)}...`
                  : session.decision.context}
              </div>
            ) : (
              <div className={styles.itemPlaceholder}>Ask Olumi for help gathering context</div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className={`${styles.item} ${hasOptions ? styles.itemComplete : styles.itemOptional}`}>
          <div className={styles.itemIcon}>
            {hasOptions ? '✓' : '○'}
          </div>
          <div className={styles.itemContent}>
            <div className={styles.itemLabel}>
              Options Considered
              <span className={styles.optionalBadge}>Optional</span>
            </div>
            {hasOptions ? (
              <div className={styles.itemList}>
                {session.decision.options.map((opt, i) => (
                  <div key={opt.id} className={styles.listItem}>
                    {i + 1}. {opt.title}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.itemPlaceholder}>Options can be discussed with Olumi</div>
            )}
          </div>
        </div>

        {/* Factors */}
        {hasFactors && (
          <div className={`${styles.item} ${styles.itemComplete}`}>
            <div className={styles.itemIcon}>✓</div>
            <div className={styles.itemContent}>
              <div className={styles.itemLabel}>Decision Factors</div>
              <div className={styles.itemList}>
                {session.decision.factors.slice(0, 3).map((factor, i) => (
                  <div key={factor.id} className={styles.listItem}>
                    {factor.name}
                  </div>
                ))}
                {session.decision.factors.length > 3 && (
                  <div className={styles.moreItems}>
                    +{session.decision.factors.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stakeholders */}
        {hasStakeholders && (
          <div className={`${styles.item} ${styles.itemComplete}`}>
            <div className={styles.itemIcon}>✓</div>
            <div className={styles.itemContent}>
              <div className={styles.itemLabel}>Stakeholders</div>
              <div className={styles.itemList}>
                {session.decision.stakeholders.slice(0, 3).map((stakeholder, i) => (
                  <div key={stakeholder.id} className={styles.listItem}>
                    {stakeholder.name} - {stakeholder.role}
                  </div>
                ))}
                {session.decision.stakeholders.length > 3 && (
                  <div className={styles.moreItems}>
                    +{session.decision.stakeholders.length - 3} more
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className={styles.status}>
        {isComplete ? (
          <div className={styles.statusComplete}>
            <span className={styles.statusIcon}>✓</span>
            <span>Ready for pre-mortem analysis! Ask Olumi to generate failure scenarios.</span>
          </div>
        ) : (
          <div className={styles.statusPending}>
            <span className={styles.statusIcon}>💬</span>
            <span>
              Continue chatting with Olumi to refine context. Olumi will ask targeted questions to
              fill any gaps.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
