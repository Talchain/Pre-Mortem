/**
 * ConversationalMode Component
 * Provides guided conversation prompts for exploring failure scenarios
 * Adapts suggestions based on session state and available data
 */

import { DecisionSession } from '@/types/sharedModels';
import styles from './ConversationalMode.module.css';

interface ConversationalModeProps {
  session: DecisionSession | null;
  onPromptSelect: (prompt: string) => void;
  className?: string;
}

interface PromptCategory {
  title: string;
  icon: string;
  prompts: PromptItem[];
}

interface PromptItem {
  text: string;
  condition?: (session: DecisionSession) => boolean;
}

export function ConversationalMode({ session, onPromptSelect, className }: ConversationalModeProps) {
  if (!session) return null;

  const hasScenarios = (session.premortem?.failure_scenarios.length || 0) > 0;
  const hasMitigations = (session.premortem?.mitigations.length || 0) > 0;
  const hasOptions = session.decision.options.length > 0;
  const hasStakeholders = session.decision.stakeholders.length > 0;

  // Define prompt categories with conditional prompts
  const categories: PromptCategory[] = [
    {
      title: 'Risk Exploration',
      icon: '🔍',
      prompts: [
        {
          text: 'Walk me through the top 3 risks',
          condition: () => hasScenarios,
        },
        {
          text: 'What are the most catastrophic scenarios?',
          condition: () => hasScenarios,
        },
        {
          text: 'Generate failure scenarios for my decision',
          condition: () => !hasScenarios,
        },
        {
          text: 'What risks haven\'t I considered yet?',
          condition: () => hasScenarios,
        },
        {
          text: 'Which scenarios are most likely to occur?',
          condition: () => hasScenarios,
        },
      ],
    },
    {
      title: 'Assumptions & Blind Spots',
      icon: '💡',
      prompts: [
        {
          text: 'What assumptions does this scenario make?',
          condition: () => hasScenarios,
        },
        {
          text: 'What am I not seeing here?',
          condition: () => true,
        },
        {
          text: 'What could invalidate my key assumptions?',
          condition: () => true,
        },
        {
          text: 'What would an expert critic say about this?',
          condition: () => true,
        },
      ],
    },
    {
      title: 'Timeline Analysis',
      icon: '⏰',
      prompts: [
        {
          text: 'How would this fail in 6 months vs 6 years?',
          condition: () => hasScenarios,
        },
        {
          text: 'What are the short-term vs long-term risks?',
          condition: () => hasScenarios,
        },
        {
          text: 'When would we first notice something going wrong?',
          condition: () => hasScenarios,
        },
        {
          text: 'What early warning signs should we monitor?',
          condition: () => hasScenarios,
        },
      ],
    },
    {
      title: 'Mitigation Strategy',
      icon: '🛡️',
      prompts: [
        {
          text: 'What are the top 3 scenarios I should focus on mitigating first?',
          condition: () => hasScenarios && !hasMitigations,
        },
        {
          text: 'How can I reduce the impact of high-risk scenarios?',
          condition: () => hasScenarios,
        },
        {
          text: 'What preventive measures should I take?',
          condition: () => hasScenarios,
        },
        {
          text: 'How can I monitor and respond to these risks?',
          condition: () => hasScenarios,
        },
        {
          text: 'Review my mitigation strategies - are they sufficient?',
          condition: () => hasMitigations,
        },
      ],
    },
    {
      title: 'Decision Options',
      icon: '🎲',
      prompts: [
        {
          text: 'Compare the risks across my decision options',
          condition: () => hasOptions && hasScenarios,
        },
        {
          text: 'What option has the lowest catastrophic risk?',
          condition: () => hasOptions && hasScenarios,
        },
        {
          text: 'Help me choose between my options',
          condition: () => hasOptions,
        },
        {
          text: 'What additional options should I consider?',
          condition: () => hasOptions,
        },
      ],
    },
    {
      title: 'Stakeholder Perspectives',
      icon: '👥',
      prompts: [
        {
          text: 'How would different stakeholders react to failure?',
          condition: () => hasStakeholders && hasScenarios,
        },
        {
          text: 'Which stakeholders are most affected by each risk?',
          condition: () => hasStakeholders && hasScenarios,
        },
        {
          text: 'What concerns would each stakeholder raise?',
          condition: () => hasStakeholders,
        },
      ],
    },
  ];

  // Filter prompts based on conditions and remove empty categories
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      prompts: category.prompts.filter(
        (prompt) => !prompt.condition || prompt.condition(session)
      ),
    }))
    .filter((category) => category.prompts.length > 0);

  const handlePromptClick = (promptText: string) => {
    onPromptSelect(promptText);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Guided Analysis</h3>
        <p className={styles.subtitle}>
          Click a question to explore your decision from different angles
        </p>
      </div>

      <div className={styles.categories}>
        {filteredCategories.map((category) => (
          <div key={category.title} className={styles.category}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon}>{category.icon}</span>
              <h4 className={styles.categoryTitle}>{category.title}</h4>
            </div>

            <div className={styles.prompts}>
              {category.prompts.map((prompt, index) => (
                <button
                  key={index}
                  className={styles.promptButton}
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <span className={styles.promptIcon}>💬</span>
                  <span className={styles.promptText}>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            Start by providing context about your decision to see guided prompts
          </p>
        </div>
      )}
    </div>
  );
}
