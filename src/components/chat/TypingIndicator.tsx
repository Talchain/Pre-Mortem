/**
 * TypingIndicator Component
 * Animated indicator shown when Olumi is thinking/typing
 * Uses Olumi design system animations
 */

import styles from './TypingIndicator.module.css';

interface TypingIndicatorProps {
  message?: string;
}

export function TypingIndicator({ message = 'Olumi is thinking...' }: TypingIndicatorProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Avatar */}
        <div className={styles.avatar}>
          <div className={styles.avatarIcon}>🎯</div>
        </div>

        {/* Typing Animation */}
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.sender}>Olumi</span>
          </div>

          <div className={styles.typing}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>

          {message && <div className={styles.message}>{message}</div>}
        </div>
      </div>

      {/* Screen reader announcement */}
      <div className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </div>
  );
}
