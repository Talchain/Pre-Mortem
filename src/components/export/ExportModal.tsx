/**
 * ExportModal Component
 * Allows users to export their pre-mortem analysis as PDF or Markdown
 * Includes format selection, preview, and branding options
 */

import { useState } from 'react';
import { DecisionSession } from '@/types/sharedModels';
import styles from './ExportModal.module.css';

export type ExportFormat = 'pdf' | 'markdown';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: DecisionSession;
  onExport: (format: ExportFormat, options: ExportOptions) => Promise<void>;
}

export interface ExportOptions {
  includeConversation: boolean;
  includeDiagnostics: boolean;
  includeBranding: boolean;
  fileName?: string;
}

export function ExportModal({ isOpen, onClose, session, onExport }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [options, setOptions] = useState<ExportOptions>({
    includeConversation: false,
    includeDiagnostics: false,
    includeBranding: true,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      await onExport(selectedFormat, options);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const getFileName = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedQuestion = session.decision.question
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .substring(0, 50);
    return `premortem-${sanitizedQuestion}-${timestamp}`;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Export Pre-Mortem Analysis</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            disabled={isExporting}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Format Selection */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Export Format</h3>
            <div className={styles.formatGrid}>
              <button
                className={`${styles.formatCard} ${
                  selectedFormat === 'pdf' ? styles.formatCardActive : ''
                }`}
                onClick={() => setSelectedFormat('pdf')}
                disabled={isExporting}
              >
                <div className={styles.formatIcon}>📄</div>
                <div className={styles.formatInfo}>
                  <div className={styles.formatName}>PDF Document</div>
                  <div className={styles.formatDesc}>
                    Professional report with Olumi branding
                  </div>
                </div>
                {selectedFormat === 'pdf' && (
                  <div className={styles.formatCheck}>✓</div>
                )}
              </button>

              <button
                className={`${styles.formatCard} ${
                  selectedFormat === 'markdown' ? styles.formatCardActive : ''
                }`}
                onClick={() => setSelectedFormat('markdown')}
                disabled={isExporting}
              >
                <div className={styles.formatIcon}>📝</div>
                <div className={styles.formatInfo}>
                  <div className={styles.formatName}>Markdown</div>
                  <div className={styles.formatDesc}>
                    Plain text for docs, Notion, or GitHub
                  </div>
                </div>
                {selectedFormat === 'markdown' && (
                  <div className={styles.formatCheck}>✓</div>
                )}
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Include in Export</h3>
            <div className={styles.optionsList}>
              <label className={styles.optionItem}>
                <input
                  type="checkbox"
                  checked={options.includeConversation}
                  onChange={(e) =>
                    setOptions({ ...options, includeConversation: e.target.checked })
                  }
                  disabled={isExporting}
                />
                <div className={styles.optionInfo}>
                  <div className={styles.optionName}>Conversation History</div>
                  <div className={styles.optionDesc}>
                    Include the full AI conversation ({session.conversation.length} messages)
                  </div>
                </div>
              </label>

              <label className={styles.optionItem}>
                <input
                  type="checkbox"
                  checked={options.includeDiagnostics}
                  onChange={(e) =>
                    setOptions({ ...options, includeDiagnostics: e.target.checked })
                  }
                  disabled={isExporting}
                />
                <div className={styles.optionInfo}>
                  <div className={styles.optionName}>Diagnostics</div>
                  <div className={styles.optionDesc}>
                    Include processing time, API calls, and metadata
                  </div>
                </div>
              </label>

              <label className={styles.optionItem}>
                <input
                  type="checkbox"
                  checked={options.includeBranding}
                  onChange={(e) =>
                    setOptions({ ...options, includeBranding: e.target.checked })
                  }
                  disabled={isExporting}
                />
                <div className={styles.optionInfo}>
                  <div className={styles.optionName}>Olumi Branding</div>
                  <div className={styles.optionDesc}>
                    Include Olumi logo and attribution
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Export Summary</h3>
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Decision:</span>
                <span className={styles.summaryValue}>
                  {session.decision.question}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Scenarios:</span>
                <span className={styles.summaryValue}>
                  {session.premortem?.failure_scenarios.length || 0}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Mitigations:</span>
                <span className={styles.summaryValue}>
                  {session.premortem?.mitigations.length || 0}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>File name:</span>
                <span className={styles.summaryValue}>
                  {getFileName()}.{selectedFormat}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}>⚠</span>
              <span className={styles.errorMessage}>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            className={styles.exportButton}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className={styles.spinner}></span>
                Exporting...
              </>
            ) : (
              <>
                <span className={styles.exportIcon}>↓</span>
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
