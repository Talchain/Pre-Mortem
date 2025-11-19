import { useEffect } from 'react';
import { usePreMortem } from '@/context/PreMortemContext';
import { ProgressIndicator } from '@/components/common/ProgressIndicator';
import { ModelSelector } from '@/components/common/ModelSelector';
import { WelcomeStep } from '@/components/steps/WelcomeStep';
import { DecisionInputStep } from '@/components/steps/DecisionInputStep';
import { TemporalProjectionStep } from '@/components/steps/TemporalProjectionStep';
import { ScenariosStep } from '@/components/steps/ScenariosStep';
import { RootCauseStep } from '@/components/steps/RootCauseStep';
import { MitigationStep } from '@/components/steps/MitigationStep';
import { RecalibrationStep } from '@/components/steps/RecalibrationStep';
import { SummaryStep } from '@/components/steps/SummaryStep';
import { AIModel, AI_MODELS } from '@/types/premortem';

const STEP_LABELS = [
  'Welcome',
  'Decision',
  'Projection',
  'Scenarios',
  'Root Causes',
  'Mitigations',
  'Recalibrate',
  'Summary',
];

function App() {
  const { state, dispatch } = usePreMortem();

  // Initialize analysis on first load if none exists
  useEffect(() => {
    if (!state.currentAnalysis) {
      dispatch({ type: 'INITIALIZE_ANALYSIS' });
    }
  }, [state.currentAnalysis, dispatch]);

  const handleStartAnalysis = () => {
    if (!state.currentAnalysis) {
      dispatch({ type: 'INITIALIZE_ANALYSIS' });
    }
    dispatch({ type: 'ADVANCE_STEP' });
  };

  const handleAdvanceStep = () => {
    dispatch({ type: 'ADVANCE_STEP' });
  };

  const handleGoBack = () => {
    dispatch({ type: 'GO_BACK_STEP' });
  };

  const handleUpdateDecision = (decision: NonNullable<typeof state.currentAnalysis>['decision']) => {
    dispatch({ type: 'UPDATE_DECISION_INPUT', payload: decision });
  };

  const handleUpdateUserThoughts = (thoughts: string) => {
    dispatch({ type: 'ADD_USER_THOUGHTS', payload: thoughts });
  };

  const handleUpdateScenarios = (scenarios: NonNullable<typeof state.currentAnalysis>['scenarios']) => {
    if (!state.currentAnalysis) return;

    // Replace all scenarios
    dispatch({ type: 'SET_AI_SCENARIOS', payload: scenarios });
  };

  const handleUpdateStrategies = (strategies: NonNullable<typeof state.currentAnalysis>['mitigationStrategies']) => {
    if (!state.currentAnalysis) return;

    dispatch({ type: 'SET_MITIGATION_STRATEGIES', payload: strategies });
  };

  const handleUpdateConfidence = (confidence: number) => {
    dispatch({ type: 'UPDATE_ADJUSTED_CONFIDENCE', payload: confidence });
  };

  const handleUpdateInsight = (insight: string) => {
    dispatch({ type: 'ADD_KEY_INSIGHT', payload: insight });
  };

  const handleMarkExported = () => {
    dispatch({ type: 'MARK_EXPORTED' });
  };

  const handleSetScenariosLoading = (loading: boolean) => {
    dispatch({ type: 'SET_AI_SCENARIOS_LOADING', payload: loading });
  };

  const handleSetRootCausesLoading = (scenarioId: string, loading: boolean) => {
    dispatch({
      type: 'SET_AI_ROOT_CAUSES_LOADING',
      payload: { scenarioId, loading },
    });
  };

  const handleSetMitigationsLoading = (rootCauseId: string, loading: boolean) => {
    dispatch({
      type: 'SET_AI_MITIGATIONS_LOADING',
      payload: { rootCauseId, loading },
    });
  };

  const handleModelChange = (model: AIModel) => {
    dispatch({ type: 'SET_AI_MODEL', payload: model });
  };

  if (!state.currentAnalysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <WelcomeStep onStart={handleStartAnalysis} />;

      case 2:
        return (
          <DecisionInputStep
            decision={state.currentAnalysis!.decision}
            onUpdate={handleUpdateDecision}
            onNext={handleAdvanceStep}
            onBack={handleGoBack}
          />
        );

      case 3:
        return (
          <TemporalProjectionStep
            decision={state.currentAnalysis!.decision}
            userThoughts={state.currentAnalysis!.userInitialThoughts || ''}
            onUpdate={handleUpdateUserThoughts}
            onNext={handleAdvanceStep}
          />
        );

      case 4:
        return (
          <ScenariosStep
            decision={state.currentAnalysis!.decision}
            userThoughts={state.currentAnalysis!.userInitialThoughts || ''}
            scenarios={state.currentAnalysis!.scenarios}
            aiModel={state.currentAnalysis!.aiModel || AI_MODELS.anthropic[0]}
            onUpdateScenarios={handleUpdateScenarios}
            onNext={handleAdvanceStep}
            isLoading={state.aiCallsInProgress.scenarios}
            onSetLoading={handleSetScenariosLoading}
          />
        );

      case 5:
        return (
          <RootCauseStep
            scenarios={state.currentAnalysis!.scenarios}
            aiModel={state.currentAnalysis!.aiModel || AI_MODELS.anthropic[0]}
            onUpdateScenarios={handleUpdateScenarios}
            onNext={handleAdvanceStep}
            aiCallsInProgress={state.aiCallsInProgress.rootCauses}
            onSetAILoading={handleSetRootCausesLoading}
          />
        );

      case 6:
        return (
          <MitigationStep
            scenarios={state.currentAnalysis!.scenarios}
            aiModel={state.currentAnalysis!.aiModel || AI_MODELS.anthropic[0]}
            mitigationStrategies={state.currentAnalysis!.mitigationStrategies}
            onUpdateStrategies={handleUpdateStrategies}
            onNext={handleAdvanceStep}
            aiCallsInProgress={state.aiCallsInProgress.mitigations}
            onSetAILoading={handleSetMitigationsLoading}
          />
        );

      case 7:
        return (
          <RecalibrationStep
            decision={state.currentAnalysis!.decision}
            adjustedConfidence={state.currentAnalysis!.adjustedConfidence}
            keyInsight={state.currentAnalysis!.keyInsight || ''}
            onUpdateConfidence={handleUpdateConfidence}
            onUpdateInsight={handleUpdateInsight}
            onNext={handleAdvanceStep}
          />
        );

      case 8:
        return (
          <SummaryStep
            analysis={state.currentAnalysis!}
            onMarkExported={handleMarkExported}
          />
        );

      default:
        return <WelcomeStep onStart={handleStartAnalysis} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg"></div>
              <div>
                <h1 className="text-lg font-display font-bold text-neutral-900">
                  Olumi Pre-Mortem
                </h1>
                <p className="text-xs text-neutral-500">
                  Science-powered decision analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* AI Model Selector */}
              <ModelSelector
                selectedModel={state.currentAnalysis?.aiModel || AI_MODELS.anthropic[0]}
                onModelChange={handleModelChange}
              />

              {state.currentAnalysis && state.currentStep > 1 && (
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">
                    {state.currentAnalysis.decision.title || 'Untitled Decision'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Step {state.currentStep} of 8
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          {state.currentStep > 1 && state.currentStep < 8 && (
            <div className="mt-6">
              <ProgressIndicator
                currentStep={state.currentStep}
                totalSteps={8}
                stepLabels={STEP_LABELS}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16">{renderStep()}</main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-neutral-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <p>
              Data stored locally in your browser • No server transmission
            </p>
            <p>
              v{import.meta.env.VITE_APP_VERSION || '1.0.0'} • Powered by
              Claude AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
