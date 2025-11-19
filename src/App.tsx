/**
 * App Component - Olumi Pre-Mortem Tool v2.0
 * Conversational AI-guided decision analysis
 * Replaces traditional 7-step wizard with simplified flow
 */

import { DecisionSessionProvider } from '@/context/DecisionSessionContext';
import { DecisionEntry } from '@/components/DecisionEntry';
import { ContextRefiner } from '@/components/ContextRefiner';
import { ScenarioList } from '@/components/scenarios';
import { ChatContainer } from '@/components/chat';
import { ModelSelector } from '@/components/common/ModelSelector';
import { useDecisionSession } from '@/context/DecisionSessionContext';
import { AIModel } from '@/types/premortem';
import styles from './App.module.css';

function AppContent() {
  const { state, updateModel } = useDecisionSession();
  const { session, selectedModel } = state;

  const hasSession = !!session;
  const hasScenarios = (session?.premortem?.failure_scenarios.length || 0) > 0;

  const handleModelChange = (model: AIModel) => {
    updateModel(model);
  };

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.branding}>
            <div className={styles.logo}>🎯</div>
            <div className={styles.brandText}>
              <h1 className={styles.brandTitle}>Olumi Pre-Mortem</h1>
              <p className={styles.brandSubtitle}>AI-powered decision analysis</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {selectedModel && (
              <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Decision Entry or Session Summary */}
          <DecisionEntry />

          {/* Context Refiner (only show if session active) */}
          {hasSession && (
            <div className={styles.section}>
              <ContextRefiner />
            </div>
          )}

          {/* Scenario List (only show if scenarios exist) */}
          {hasScenarios && (
            <div className={styles.section}>
              <ScenarioList />
            </div>
          )}

          {/* Informational Content (only show if no active session) */}
          {!hasSession && (
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>What is Pre-Mortem Analysis?</h2>
                <p className={styles.infoText}>
                  A pre-mortem is a proactive risk assessment technique where you imagine your
                  decision has failed, then work backward to identify what could have caused that
                  failure. This "prospective hindsight" helps surface risks that might otherwise be
                  overlooked.
                </p>
              </div>

              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>How Olumi Helps</h2>
                <p className={styles.infoText}>
                  Olumi uses AI with multi-agent reasoning (optimistic, pessimistic, and realistic
                  perspectives) to help you identify failure scenarios, root causes, and mitigation
                  strategies. The conversational interface guides you through context gathering with
                  minimal input required.
                </p>
              </div>

              <div className={styles.infoCard}>
                <h2 className={styles.infoTitle}>Privacy First</h2>
                <p className={styles.infoText}>
                  Your decision data is stored locally in your browser. Nothing is sent to external
                  servers except AI API calls (which don't store your data). You can export your
                  analysis at any time and clear your data with one click.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Chat Container (always rendered, manages its own visibility) */}
      <ChatContainer />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            🔒 Data stored locally • No server transmission • Privacy-first design
          </p>
          <p className={styles.footerText}>
            v2.0 • Powered by Anthropic Claude & OpenAI
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <DecisionSessionProvider>
      <AppContent />
    </DecisionSessionProvider>
  );
}

export default App;
