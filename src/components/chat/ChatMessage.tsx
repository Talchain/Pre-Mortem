/**
 * ChatMessage Component
 * Displays individual messages in the conversation
 * Uses Olumi design system for role-based styling
 */

import { Message } from '@/types/sharedModels';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
  showTimestamp?: boolean;
}

export function ChatMessage({ message, showTimestamp = false }: ChatMessageProps) {
  const isOlumi = message.role === 'olumi';
  const isSystem = message.role === 'system';

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isSystem) {
    return (
      <div className={styles.systemMessage}>
        <span className={styles.systemText}>{message.content}</span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.messageWrapper} ${isOlumi ? styles.olumiWrapper : styles.userWrapper}`}
    >
      <div className={`${styles.message} ${isOlumi ? styles.olumiMessage : styles.userMessage}`}>
        {/* Avatar */}
        {isOlumi && (
          <div className={styles.avatar}>
            <div className={styles.avatarIcon}>🎯</div>
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.sender}>{isOlumi ? 'Olumi' : 'You'}</span>
            {showTimestamp && (
              <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
            )}
          </div>

          {/* Message Text */}
          <div className={styles.text}>{message.content}</div>

          {/* Reasoning (only for Olumi, if available) */}
          {isOlumi && message.reasoning && (
            <details className={styles.reasoning}>
              <summary className={styles.reasoningSummary}>View AI reasoning</summary>
              <div className={styles.reasoningContent}>{message.reasoning}</div>
            </details>
          )}

          {/* Metadata (confidence, model used) */}
          {isOlumi && message.metadata && (
            <div className={styles.metadata}>
              {message.metadata.model_used && (
                <span className={styles.metadataItem}>
                  Model: {message.metadata.model_used}
                </span>
              )}
              {message.metadata.confidence && (
                <span className={styles.metadataItem}>
                  Confidence: {Math.round(message.metadata.confidence * 100)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* User Avatar (right side) */}
        {!isOlumi && (
          <div className={styles.avatar}>
            <div className={styles.avatarIcon}>👤</div>
          </div>
        )}
      </div>
    </div>
  );
}
