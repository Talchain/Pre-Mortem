/**
 * TemplateCard Component
 * Displays individual template in card format
 */

import { PreMortemTemplate } from '@/types/premortem.v1';
import styles from './TemplateCard.module.css';

interface TemplateCardProps {
  template: PreMortemTemplate;
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const getDifficultyLabel = (difficulty: PreMortemTemplate['difficulty']): string => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      {/* Header */}
      <div className={styles.header}>
        <span className={`${styles.categoryBadge} ${styles[`category${capitalize(template.category)}`]}`}>
          {template.category}
        </span>
        <span className={`${styles.difficultyBadge} ${styles[`difficulty${capitalize(template.difficulty)}`]}`}>
          {getDifficultyLabel(template.difficulty)}
        </span>
      </div>

      {/* Content */}
      <h3 className={styles.title}>{template.title}</h3>
      <p className={styles.description}>{template.description}</p>

      {/* Tags */}
      {template.tags.length > 0 && (
        <div className={styles.tags}>
          {template.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              {tag}
            </span>
          ))}
          {template.tags.length > 4 && (
            <span className={styles.tag}>+{template.tags.length - 4} more</span>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className={styles.metadata}>
        <div className={styles.metadataItem}>
          <span className={styles.metadataIcon}>⏱️</span>
          <span>{template.estimatedTime}</span>
        </div>
        <div className={styles.metadataItem}>
          <span className={styles.metadataIcon}>📋</span>
          <span>
            {template.scenarioTemplates.length} scenarios,{' '}
            {template.mitigationTemplates.length} mitigations
          </span>
        </div>
      </div>

      {/* Action */}
      <button className={styles.action}>
        <span>Use Template</span>
        <span className={styles.actionIcon}>→</span>
      </button>
    </div>
  );
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
