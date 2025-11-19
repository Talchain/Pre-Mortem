import React, { useState, useEffect } from 'react';
import { ArrowRight, Plus, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ScenarioCard } from '@/components/features/ScenarioCard';
import { Scenario, Decision } from '@/types/premortem';
import { generateScenarios } from '@/services/claudeAPI';

export interface ScenariosStepProps {
  decision: Decision;
  userThoughts: string;
  scenarios: Scenario[];
  onUpdateScenarios: (scenarios: Scenario[]) => void;
  onNext: () => void;
  isLoading: boolean;
  onSetLoading: (loading: boolean) => void;
}

export function ScenariosStep({
  decision,
  userThoughts,
  scenarios,
  onUpdateScenarios,
  onNext,
  isLoading,
  onSetLoading,
}: ScenariosStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [showAddManual, setShowAddManual] = useState(false);

  // Auto-generate scenarios on mount if none exist
  useEffect(() => {
    if (scenarios.length === 0 && !isLoading) {
      handleGenerateScenarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateScenarios = async () => {
    setError(null);
    onSetLoading(true);

    try {
      const scenarioResponses = await generateScenarios({
        decisionTitle: decision.title,
        decisionDescription: decision.description,
        decisionType: decision.type,
        timeline: decision.timeline,
        successCriteria: decision.successCriteria,
        context: decision.context,
        userThoughts,
      });

      const newScenarios: Scenario[] = scenarioResponses.map((response) => ({
        id: uuidv4(),
        title: response.title,
        description: response.description,
        likelihood: response.likelihood,
        impact: response.impact,
        category: response.category,
        flaggedAsConcerning: false,
        userEdited: false,
        source: 'ai' as const,
        reasoning: response.reasoning,
        rootCauses: [],
      }));

      onUpdateScenarios(newScenarios);
    } catch (err) {
      console.error('Error generating scenarios:', err);
      setError(
        'Failed to generate scenarios. You can add scenarios manually below or try again.'
      );
    } finally {
      onSetLoading(false);
    }
  };

  const handleEditScenario = (id: string, updates: Partial<Scenario>) => {
    onUpdateScenarios(
      scenarios.map((scenario) =>
        scenario.id === id ? { ...scenario, ...updates, userEdited: true } : scenario
      )
    );
  };

  const handleDeleteScenario = (id: string) => {
    onUpdateScenarios(scenarios.filter((scenario) => scenario.id !== id));
  };

  const handleFlagScenario = (id: string) => {
    const scenario = scenarios.find((s) => s.id === id);
    if (!scenario) return;

    const flaggedCount = scenarios.filter((s) => s.flaggedAsConcerning).length;

    // Toggle flag
    if (scenario.flaggedAsConcerning) {
      // Unflag
      onUpdateScenarios(
        scenarios.map((s) =>
          s.id === id ? { ...s, flaggedAsConcerning: false } : s
        )
      );
    } else {
      // Flag (max 3)
      if (flaggedCount >= 3) {
        return; // Don't allow more than 3
      }
      onUpdateScenarios(
        scenarios.map((s) =>
          s.id === id ? { ...s, flaggedAsConcerning: true } : s
        )
      );
    }
  };

  const handleAddManualScenario = () => {
    const newScenario: Scenario = {
      id: uuidv4(),
      title: 'New Failure Scenario',
      description: 'Describe what went wrong and how it unfolded',
      likelihood: 'Medium',
      impact: 'Medium',
      category: 'Strategic',
      flaggedAsConcerning: false,
      userEdited: true,
      source: 'user',
      rootCauses: [],
    };

    onUpdateScenarios([...scenarios, newScenario]);
    setShowAddManual(false);
  };

  const flaggedCount = scenarios.filter((s) => s.flaggedAsConcerning).length;
  const canProceed = scenarios.length >= 3;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <Card variant="elevated" padding="lg">
          <LoadingSpinner
            size="lg"
            message="Analyzing your decision context to generate plausible failure scenarios..."
          />
          <p className="text-sm text-neutral-500 text-center mt-4">
            This usually takes 5-10 seconds
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Potential Failure Scenarios
        </h2>
        <p className="text-neutral-600">
          Review AI-generated scenarios, edit them, flag the most concerning
          ones (max 3), or add your own
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card variant="outlined" padding="md" className="mb-6 bg-accent-error/5 border-accent-error/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-accent-error mb-1">
                Could not generate scenarios
              </h4>
              <p className="text-sm text-neutral-700">{error}</p>
            </div>
            <Button size="sm" onClick={handleGenerateScenarios}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      {scenarios.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium">
            {scenarios.length} {scenarios.length === 1 ? 'Scenario' : 'Scenarios'}
          </div>
          <div className="bg-accent-error/10 text-accent-error px-4 py-2 rounded-lg text-sm font-medium">
            {flaggedCount} Flagged as Concerning
          </div>
        </div>
      )}

      {/* Scenarios Grid */}
      {scenarios.length > 0 && (
        <div className="grid gap-6 mb-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onEdit={(updates) => handleEditScenario(scenario.id, updates)}
              onDelete={() => handleDeleteScenario(scenario.id)}
              onFlag={() => handleFlagScenario(scenario.id)}
              isFlagged={scenario.flaggedAsConcerning}
              canFlag={flaggedCount < 3 || scenario.flaggedAsConcerning}
            />
          ))}
        </div>
      )}

      {/* Add Manual Scenario */}
      <Card variant="outlined" padding="md" className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">
              Add Your Own Scenario
            </h4>
            <p className="text-sm text-neutral-600">
              Noticed a risk the AI missed? Add it manually
            </p>
          </div>
          <Button
            variant="ghost"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAddManualScenario}
          >
            Add Scenario
          </Button>
        </div>
      </Card>

      {/* Guidance */}
      {!canProceed && (
        <div className="bg-accent-warning/10 border border-accent-warning/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-neutral-800">
            <strong>Tip:</strong> Add at least 3 scenarios to get meaningful
            insights. The more diverse scenarios you consider, the better your
            analysis will be.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleGenerateScenarios}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate All
        </Button>

        <Button
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
          size="lg"
          disabled={!canProceed}
        >
          Continue to Root Cause Analysis
        </Button>
      </div>

      {!canProceed && (
        <p className="text-sm text-neutral-500 text-right mt-2">
          Need at least 3 scenarios to proceed
        </p>
      )}
    </div>
  );
}
