/**
 * App Component - Olumi Pre-Mortem Tool v2.0
 * Conversational AI-guided decision analysis
 * Replaces traditional 7-step wizard with simplified flow
 */

import { useState } from 'react';
import { DecisionSessionProvider } from '@/context/DecisionSessionContext';
import { DecisionEntry } from '@/components/DecisionEntry';
import { ContextRefiner } from '@/components/ContextRefiner';
import { ScenarioList } from '@/components/scenarios';
import { ChatContainer } from '@/components/chat';
import { ModelSelector } from '@/components/common/ModelSelector';
import { ContinueToSandbox } from '@/components/integration/ContinueToSandbox';
import { PostMortemTrigger } from '@/components/postmortem/PostMortemTrigger';
import { OutcomeEntry } from '@/components/postmortem/OutcomeEntry';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { HelpModal } from '@/components/help/HelpModal';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { DiagnosticsOverlay } from '@/components/common/DiagnosticsOverlay';
import { DegradedBanner } from '@/components/common/DegradedBanner';
import { ExportModal } from '@/components/export/ExportModal';
import { useDecisionSession } from '@/context/DecisionSessionContext';
import { AIModel } from '@/types/premortem';
import { exportSession, canExportSession } from '@/services/exportService';
import styles from './App.module.css';

function AppContent() {
  const { state, updateModel } = useDecisionSession();
  const { session, selectedModel } = state;
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const hasSession = !!session;
  const hasScenarios = (session?.premortem?.failure_scenarios.length || 0) > 0;
  const canExport = canExportSession(session);

  const handleModelChange = (model: AIModel) => {
    updateModel(model);
  };

  return (
    <div className={styles.app}>
      {/* App Header */}
      <AppHeader onHelpClick={() => setIsHelpOpen(true)} />

      {/* Model Selector Bar */}
      {selectedModel && (
        <div className={styles.modelSelectorBar}>
          <div className={styles.modelSelectorContent}>
            <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />

            {/* Export Button */}
            {canExport && (
              <button
                className={styles.exportButton}
                onClick={() => setIsExportOpen(true)}
                title="Export analysis"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Export</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Degraded Mode Banner */}
          {session?.diagnostics?.degraded && (
            <DegradedBanner
              reason={session.diagnostics.degradedReason || 'AI service temporarily unavailable'}
              affectedFeatures={[
                'Automatic scenario generation',
                'Root cause analysis',
                'Mitigation suggestions',
              ]}
              onRetry={() => {
                // Future: Implement retry logic
                console.log('Retry AI analysis');
              }}
            />
          )}

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

          {/* Continue to Sandbox (only show if scenarios complete) */}
          {hasScenarios && <ContinueToSandbox />}

          {/* Post-Mortem Trigger (only show if decision is made) */}
          <PostMortemTrigger />

          {/* Outcome Entry (only show if post-mortem started) */}
          <OutcomeEntry />

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

      {/* App Footer */}
      <AppFooter />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Export Modal */}
      {session && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          session={session}
          onExport={(format, options) => exportSession(session, format, options)}
        />
      )}

      {/* Diagnostics Overlay (only show if diagnostics exist) */}
      {session?.diagnostics && <DiagnosticsOverlay diagnostics={session.diagnostics} />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DecisionSessionProvider>
        <AppContent />
      </DecisionSessionProvider>
    </ErrorBoundary>
  );
}

export default App;
