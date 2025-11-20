/**
 * ChatContainer Component
 * Resizable bottom-docked conversational interface
 * Three states: collapsed (64px), medium (400px), full (80vh)
 * Olumi Design System v1.2
 */

import { useEffect, useRef, useState, MouseEvent, TouchEvent } from 'react';
import { useDecisionSession } from '@/context/DecisionSessionContext';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { ConversationalMode } from './ConversationalMode';
import { useHaptics } from '../../hooks/useHaptics';
import styles from './ChatContainer.module.css';

type ChatState = 'collapsed' | 'medium' | 'full';

export function ChatContainer() {
  const { state, sendMessage, toggleChat } = useDecisionSession();
  const { session, isTyping, chatExpanded, chatHeight } = state;
  const haptic = useHaptics();

  const [chatState, setChatState] = useState<ChatState>('collapsed');
  const [isDragging, setIsDragging] = useState(false);
  const [customHeight, setCustomHeight] = useState<number | null>(null);
  const [showGuidedPrompts, setShowGuidedPrompts] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);

  /* ========================================
     HEIGHT MANAGEMENT
     ======================================== */

  const getHeight = (): number => {
    if (customHeight !== null) return customHeight;

    switch (chatState) {
      case 'collapsed':
        return 64;
      case 'medium':
        return 400;
      case 'full':
        return window.innerHeight * 0.8; // 80vh
      default:
        return 400;
    }
  };

  const currentHeight = getHeight();

  /* ========================================
     DRAG HANDLE LOGIC
     ======================================== */

  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
    dragStartHeight.current = currentHeight;
    document.body.style.userSelect = 'none';
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = dragStartY.current - clientY; // Inverted: drag up = increase height
    const newHeight = Math.max(64, Math.min(window.innerHeight * 0.9, dragStartHeight.current + deltaY));

    setCustomHeight(newHeight);

    // Update chat state based on height thresholds
    if (newHeight < 200) {
      setChatState('collapsed');
    } else if (newHeight < window.innerHeight * 0.6) {
      setChatState('medium');
    } else {
      setChatState('full');
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // Mouse events
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Touch events
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  /* ========================================
     AUTO-SCROLL TO BOTTOM
     ======================================== */

  useEffect(() => {
    if (messagesRef.current && chatState !== 'collapsed') {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [session?.conversation, isTyping, chatState]);

  /* ========================================
     KEYBOARD SHORTCUTS
     ======================================== */

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Escape to collapse
      if (e.key === 'Escape' && chatState !== 'collapsed') {
        setChatState('collapsed');
        setCustomHeight(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatState]);

  /* ========================================
     TOGGLE CHAT STATE
     ======================================== */

  const handleHeaderClick = () => {
    haptic.light();
    if (chatState === 'collapsed') {
      setChatState('medium');
      setCustomHeight(null);
    } else {
      setChatState('collapsed');
      setCustomHeight(null);
    }
  };

  const handleMaximize = () => {
    haptic.light();
    setChatState('full');
    setCustomHeight(null);
  };

  const handleMinimize = () => {
    haptic.light();
    setChatState('medium');
    setCustomHeight(null);
  };

  /* ========================================
     MESSAGE HANDLING
     ======================================== */

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  /* ========================================
     RENDER
     ======================================== */

  const messages = session?.conversation || [];
  const hasMessages = messages.length > 0;

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${styles[chatState]}`}
      style={{ height: `${currentHeight}px` }}
      role="complementary"
      aria-label="Conversational assistant"
    >
      {/* Drag Handle */}
      <div
        className={styles.dragHandle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="separator"
        aria-label="Resize chat"
        aria-valuenow={currentHeight}
        aria-valuemin={64}
        aria-valuemax={window.innerHeight * 0.9}
      >
        <div className={styles.dragIndicator} />
      </div>

      {/* Header */}
      <div className={styles.header} onClick={handleHeaderClick}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>🎯</div>
          <div className={styles.headerText}>
            <h2 className={styles.headerTitle}>Olumi Assistant</h2>
            {chatState === 'collapsed' && hasMessages && (
              <span className={styles.messageCount}>{messages.length} messages</span>
            )}
          </div>
        </div>

        {/* Header Actions */}
        {chatState !== 'collapsed' && (
          <div className={styles.headerActions}>
            <button
              className={`${styles.headerButton} ${showGuidedPrompts ? styles.headerButtonActive : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                haptic.light();
                setShowGuidedPrompts(!showGuidedPrompts);
              }}
              aria-label={showGuidedPrompts ? 'Hide guided prompts' : 'Show guided prompts'}
              title="Guided Analysis"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4h12M2 8h8M2 12h10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {chatState !== 'full' && (
              <button
                className={styles.headerButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMaximize();
                }}
                aria-label="Maximize chat"
                title="Maximize"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 2h5v2H4v3H2V2zm12 0h-5v2h3v3h2V2zM2 14h5v-2H4v-3H2v5zm12 0h-5v-2h3v-3h2v5z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            )}
            {chatState === 'full' && (
              <button
                className={styles.headerButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMinimize();
                }}
                aria-label="Minimize to medium size"
                title="Minimize"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12v2H2V8z" fill="currentColor" />
                </svg>
              </button>
            )}
            <button
              className={styles.headerButton}
              onClick={(e) => {
                e.stopPropagation();
                haptic.light();
                setChatState('collapsed');
                setCustomHeight(null);
              }}
              aria-label="Collapse chat"
              title="Collapse (Esc)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12.5 4.5l-1-1L8 7 4.5 3.5l-1 1L7 8l-3.5 3.5 1 1L8 9l3.5 3.5 1-1L9 8l3.5-3.5z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      {chatState !== 'collapsed' && (
        <>
          <div ref={messagesRef} className={styles.messages}>
            {!hasMessages && !showGuidedPrompts && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💬</div>
                <p className={styles.emptyText}>
                  Start a conversation with Olumi to analyze your decision
                </p>
                <p className={styles.emptyHint}>
                  Ask questions, provide context, or explore potential risks
                </p>
              </div>
            )}

            {!hasMessages && showGuidedPrompts && (
              <ConversationalMode session={session} onPromptSelect={handleSendMessage} />
            )}

            {hasMessages && showGuidedPrompts && chatState === 'full' && (
              <div className={styles.guidedPromptsPanel}>
                <ConversationalMode
                  session={session}
                  onPromptSelect={handleSendMessage}
                  className={styles.guidedPromptsPanelContent}
                />
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} showTimestamp={false} />
            ))}

            {isTyping && <TypingIndicator />}
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isTyping} />
        </>
      )}
    </div>
  );
}
