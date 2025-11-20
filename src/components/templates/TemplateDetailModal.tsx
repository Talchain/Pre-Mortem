/**
 * TemplateDetailModal Component
 * Detailed view of template with full information
 */

import { useEffect } from 'react';
import { PreMortemTemplate } from '@/types/premortem.v1';
import styles from './TemplateDetailModal.module.css';

interface TemplateDetailModalProps {
  template: PreMortemTemplate;
  onClose: () => void;
  onUseTemplate: () => void;
}

export function TemplateDetailModal({
  template,
  onClose,
  onUseTemplate,
}: TemplateDetailModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.badges}>
              <span className={styles.categoryBadge}>
                {template.category}
              </span>
              <span className={styles.difficultyBadge}>
                {capitalize(template.difficulty)}
              </span>
            </div>
            <h2 className={styles.title}>{template.title}</h2>
            <p className={styles.description}>{template.description}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Metadata */}
          <div className={styles.section}>
            <div className={styles.metadata}>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Estimated Time</span>
                <span className={styles.metadataValue}>{template.estimatedTime}</span>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Difficulty</span>
                <span className={styles.metadataValue}>{capitalize(template.difficulty)}</span>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Content</span>
                <span className={styles.metadataValue}>
                  {template.scenarioTemplates.length} scenarios,{' '}
                  {template.rootCauseTemplates.length} root causes,{' '}
                  {template.mitigationTemplates.length} mitigations
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🏷️</span>
                Tags
              </h3>
              <div className={styles.tags}>
                {template.tags.map((tag, idx) => (
                  <span key={idx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* When to Use */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>💡</span>
              When to Use This Template
            </h3>
            <p className={styles.listItemText}>{template.guidanceNotes.when_to_use}</p>
          </div>

          {/* Sample Scenarios */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⚠️</span>
              Sample Failure Scenarios ({template.scenarioTemplates.length})
            </h3>
            <div className={styles.list}>
              {template.scenarioTemplates.slice(0, 3).map((scenario, idx) => (
                <div key={idx} className={styles.listItem}>
                  <h4 className={styles.listItemTitle}>{scenario.title}</h4>
                  <p className={styles.listItemText}>{scenario.description}</p>
                </div>
              ))}
              {template.scenarioTemplates.length > 3 && (
                <p className={styles.listItemText}>
                  + {template.scenarioTemplates.length - 3} more scenarios included
                </p>
              )}
            </div>
          </div>

          {/* Sample Mitigations */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🛡️</span>
              Sample Mitigation Strategies ({template.mitigationTemplates.length})
            </h3>
            <div className={styles.list}>
              {template.mitigationTemplates.slice(0, 3).map((mitigation, idx) => (
                <div key={idx} className={styles.listItem}>
                  <h4 className={styles.listItemTitle}>{mitigation.strategy}</h4>
                  <ul className={styles.listItemBullets}>
                    {mitigation.bestPractices.map((practice, pidx) => (
                      <li key={pidx}>{practice}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {template.mitigationTemplates.length > 3 && (
                <p className={styles.listItemText}>
                  + {template.mitigationTemplates.length - 3} more mitigations included
                </p>
              )}
            </div>
          </div>

          {/* Common Pitfalls */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🚧</span>
              Common Pitfalls to Avoid
            </h3>
            <ul className={styles.listItemBullets}>
              {template.guidanceNotes.common_pitfalls.map((pitfall, idx) => (
                <li key={idx}>{pitfall}</li>
              ))}
            </ul>
          </div>

          {/* Success Patterns */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>✨</span>
              Success Patterns
            </h3>
            <ul className={styles.listItemBullets}>
              {template.guidanceNotes.success_patterns.map((pattern, idx) => (
                <li key={idx}>{pattern}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Back to Templates
          </button>
          <button className={styles.useButton} onClick={onUseTemplate}>
            <span>Use This Template</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
