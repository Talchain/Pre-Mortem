/**
 * ChatInput Component
 * Multi-line input with send button, keyboard shortcuts, and auto-resize
 * Olumi Design System v1.2
 */

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask Olumi a question or provide more context...',
  maxLength = 2000,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ========================================
     AUTO-RESIZE TEXTAREA
     ======================================== */

  useEffect(() => {
    if (!textareaRef.current) return;

    // Reset height to auto to get the correct scrollHeight
    textareaRef.current.style.height = 'auto';

    // Set new height based on content
    const scrollHeight = textareaRef.current.scrollHeight;
    const maxHeight = 200; // Max height in pixels (about 8 lines)

    textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, [value]);

  /* ========================================
     KEYBOARD SHORTCUTS
     ======================================== */

  // Global keyboard shortcut: Ctrl/Cmd+K to focus
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  /* ========================================
     HANDLERS
     ======================================== */

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Enforce max length
    if (newValue.length <= maxLength) {
      setValue(newValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift = send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }

    // Shift+Enter = new line (default behavior, no action needed)
  };

  const handleSubmit = () => {
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue('');

    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  /* ========================================
     CHARACTER COUNT
     ======================================== */

  const remainingChars = maxLength - value.length;
  const showCharCount = value.length > maxLength * 0.8; // Show when 80% full

  const charCountClass = remainingChars < 100 ? styles.charCountWarning : styles.charCount;

  /* ========================================
     RENDER
     ======================================== */

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
          aria-describedby={showCharCount ? 'char-count' : undefined}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={styles.sendButton}
          aria-label="Send message"
          title="Send message (Enter)"
        >
          <svg
            className={styles.sendIcon}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Character Count */}
      {showCharCount && (
        <div id="char-count" className={charCountClass} role="status" aria-live="polite">
          {remainingChars} characters remaining
        </div>
      )}

      {/* Keyboard Hint */}
      <div className={styles.hint}>
        <span className={styles.hintText}>
          <kbd>Enter</kbd> to send, <kbd>Shift+Enter</kbd> for new line, <kbd>⌘K</kbd> to focus
        </span>
      </div>
    </div>
  );
}
