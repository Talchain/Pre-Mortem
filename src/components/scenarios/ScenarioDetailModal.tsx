/**
 * ScenarioDetailModal Component
 * Deep-dive view for individual failure scenarios
 * Shows full details, root causes, early warning signs, and related mitigations
 */

import { useState } from 'react';
import { FailureScenario } from '@/types/sharedModels';
import styles from './ScenarioDetailModal.module.css';

interface ScenarioDetailModalProps {
  scenario: FailureScenario;
  onClose: () => void;
  onUpdate?: (scenario: FailureScenario) => void;
}

export function ScenarioDetailModal({ scenario, onClose, onUpdate }: ScenarioDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScenario, setEditedScenario] = useState(scenario);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedScenario);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedScenario(scenario);
    setIsEditing(false);
  };

  const getImpactColor = (impact: string) => {
    const colors: Record<string, string> = {
      catastrophic: '#EA7B4B',
      major: '#F5C433',
      moderate: '#63ADCF',
      minor: '#67C89E',
    };
    return colors[impact] || '#737373';
  };

  const getImpactEmoji = (impact: string) => {
    const emojis: Record<string, string> = {
      catastrophic: '🔴',
      major: '🟠',
      moderate: '🟡',
      minor: '🟢',
    };
    return emojis[impact] || '⚪';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.impactIndicator}>
              <span className={styles.impactEmoji}>{getImpactEmoji(scenario.impact)}</span>
            </div>
            <div>
              <h2 className={styles.title}>
                {isEditing ? (
                  <input
                    type="text"
                    className={styles.titleInput}
                    value={editedScenario.title}
                    onChange={(e) =>
                      setEditedScenario({ ...editedScenario, title: e.target.value })
                    }
                  />
                ) : (
                  scenario.title
                )}
              </h2>
              <div className={styles.metaTags}>
                <span className={styles.tag}>Scenario #{scenario.id.substring(0, 8)}</span>
                <span className={styles.tag}>
                  Created {new Date(scenario.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Risk Assessment */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Risk Assessment</h3>
            <div className={styles.riskGrid}>
              {/* Impact */}
              <div className={styles.riskCard}>
                <div className={styles.riskLabel}>Impact</div>
                {isEditing ? (
                  <select
                    className={styles.impactSelect}
                    value={editedScenario.impact}
                    onChange={(e) =>
                      setEditedScenario({
                        ...editedScenario,
                        impact: e.target.value as any,
                      })
                    }
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="major">Major</option>
                    <option value="catastrophic">Catastrophic</option>
                  </select>
                ) : (
                  <div
                    className={styles.impactValue}
                    style={{ color: getImpactColor(scenario.impact) }}
                  >
                    {scenario.impact.toUpperCase()}
                  </div>
                )}
                <div className={styles.riskDescription}>
                  {scenario.impact === 'catastrophic' &&
                    'Could result in complete failure of the decision'}
                  {scenario.impact === 'major' && 'Significant negative consequences'}
                  {scenario.impact === 'moderate' && 'Noticeable but manageable impact'}
                  {scenario.impact === 'minor' && 'Limited scope, easily recoverable'}
                </div>
              </div>

              {/* Likelihood */}
              <div className={styles.riskCard}>
                <div className={styles.riskLabel}>Likelihood</div>
                {isEditing ? (
                  <div className={styles.likelihoodControl}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editedScenario.likelihood}
                      onChange={(e) =>
                        setEditedScenario({
                          ...editedScenario,
                          likelihood: parseInt(e.target.value),
                        })
                      }
                      className={styles.likelihoodSlider}
                    />
                    <div className={styles.likelihoodValue}>
                      {editedScenario.likelihood}%
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.likelihoodValue}>{scenario.likelihood}%</div>
                    <div className={styles.likelihoodBar}>
                      <div
                        className={styles.likelihoodFill}
                        style={{ width: `${scenario.likelihood}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>

              {/* Risk Score */}
              <div className={styles.riskCard}>
                <div className={styles.riskLabel}>Risk Score</div>
                <div className={styles.riskScoreValue}>
                  {calculateRiskScore(scenario).toFixed(1)}
                </div>
                <div className={styles.riskDescription}>
                  {calculateRiskScore(scenario) >= 75 && 'Critical - Immediate action required'}
                  {calculateRiskScore(scenario) >= 50 &&
                    calculateRiskScore(scenario) < 75 &&
                    'High - Priority mitigation needed'}
                  {calculateRiskScore(scenario) >= 25 &&
                    calculateRiskScore(scenario) < 50 &&
                    'Medium - Monitor and plan'}
                  {calculateRiskScore(scenario) < 25 && 'Low - Acceptable risk'}
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Scenario Description</h3>
            {isEditing ? (
              <textarea
                className={styles.descriptionTextarea}
                value={editedScenario.description}
                onChange={(e) =>
                  setEditedScenario({ ...editedScenario, description: e.target.value })
                }
                rows={4}
              />
            ) : (
              <p className={styles.description}>{scenario.description}</p>
            )}
          </section>

          {/* Root Causes */}
          {scenario.root_causes && scenario.root_causes.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Root Causes</h3>
              <ul className={styles.list}>
                {scenario.root_causes.map((cause, index) => (
                  <li key={index} className={styles.listItem}>
                    <span className={styles.listIcon}>🔍</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Early Warning Signs */}
          {scenario.early_warning_signs && scenario.early_warning_signs.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Early Warning Signs</h3>
              <ul className={styles.list}>
                {scenario.early_warning_signs.map((sign, index) => (
                  <li key={index} className={styles.listItem}>
                    <span className={styles.listIcon}>🚨</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Related Factors */}
          {scenario.related_factors && scenario.related_factors.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Related Factors</h3>
              <div className={styles.factorTags}>
                {scenario.related_factors.map((factor, index) => (
                  <span key={index} className={styles.factorTag}>
                    {factor}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* AI Reasoning (if available) */}
          {scenario.ai_reasoning && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>AI Analysis</h3>
              <div className={styles.aiReasoning}>
                <div className={styles.aiIcon}>🤖</div>
                <p>{scenario.ai_reasoning}</p>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {isEditing ? (
            <>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.saveButton} onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button className={styles.closeFooterButton} onClick={onClose}>
                Close
              </button>
              {onUpdate && (
                <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                  <span>✏️</span>
                  <span>Edit Scenario</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function calculateRiskScore(scenario: FailureScenario): number {
  const impactValues: Record<string, number> = {
    catastrophic: 1.0,
    major: 0.75,
    moderate: 0.5,
    minor: 0.25,
  };

  const impactValue = impactValues[scenario.impact] || 0.5;
  const likelihoodValue = scenario.likelihood / 100;

  return impactValue * likelihoodValue * 100;
}
