import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Plus, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Scenario, RootCause, AIModel } from '@/types/premortem';
import { generateRootCauses } from '@/services/aiService';

export interface RootCauseStepProps {
  scenarios: Scenario[];
  aiModel: AIModel;
  onUpdateScenarios: (scenarios: Scenario[]) => void;
  onNext: () => void;
  aiCallsInProgress: Record<string, boolean>;
  onSetAILoading: (scenarioId: string, loading: boolean) => void;
}

export function RootCauseStep({
  scenarios,
  aiModel,
  onUpdateScenarios,
  onNext,
  aiCallsInProgress,
  onSetAILoading,
}: RootCauseStepProps) {
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(
    new Set(scenarios.filter((s) => s.flaggedAsConcerning).map((s) => s.id))
  );

  const toggleScenario = (scenarioId: string) => {
    setExpandedScenarios((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(scenarioId)) {
        newSet.delete(scenarioId);
      } else {
        newSet.add(scenarioId);
      }
      return newSet;
    });
  };

  const handleGenerateRootCauses = async (scenario: Scenario) => {
    onSetAILoading(scenario.id, true);

    try {
      const rootCauseResponses = await generateRootCauses(
        scenario.title,
        scenario.description,
        `${scenario.category} failure related to the decision`,
        aiModel
      );

      const newRootCauses: RootCause[] = rootCauseResponses.map((rc) => ({
        id: uuidv4(),
        cause: rc.cause,
        explanation: rc.explanation,
        userEdited: false,
      }));

      onUpdateScenarios(
        scenarios.map((s) =>
          s.id === scenario.id
            ? { ...s, rootCauses: [...s.rootCauses, ...newRootCauses] }
            : s
        )
      );
    } catch (error) {
      console.error('Error generating root causes:', error);
    } finally {
      onSetAILoading(scenario.id, false);
    }
  };

  const handleAddManualRootCause = (scenarioId: string) => {
    const newRootCause: RootCause = {
      id: uuidv4(),
      cause: 'New root cause',
      explanation: 'Explain why this would lead to failure',
      userEdited: true,
    };

    onUpdateScenarios(
      scenarios.map((s) =>
        s.id === scenarioId
          ? { ...s, rootCauses: [...s.rootCauses, newRootCause] }
          : s
      )
    );
  };

  const handleEditRootCause = (
    scenarioId: string,
    rootCauseId: string,
    field: keyof RootCause,
    value: string
  ) => {
    onUpdateScenarios(
      scenarios.map((s) =>
        s.id === scenarioId
          ? {
              ...s,
              rootCauses: s.rootCauses.map((rc) =>
                rc.id === rootCauseId
                  ? { ...rc, [field]: value, userEdited: true }
                  : rc
              ),
            }
          : s
      )
    );
  };

  const handleDeleteRootCause = (scenarioId: string, rootCauseId: string) => {
    onUpdateScenarios(
      scenarios.map((s) =>
        s.id === scenarioId
          ? { ...s, rootCauses: s.rootCauses.filter((rc) => rc.id !== rootCauseId) }
          : s
      )
    );
  };

  const totalRootCauses = scenarios.reduce(
    (sum, s) => sum + s.rootCauses.length,
    0
  );
  const canProceed = totalRootCauses >= 3;

  // Prioritize flagged scenarios
  const sortedScenarios = [...scenarios].sort((a, b) => {
    if (a.flaggedAsConcerning && !b.flaggedAsConcerning) return -1;
    if (!a.flaggedAsConcerning && b.flaggedAsConcerning) return 1;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Root Cause Analysis
        </h2>
        <p className="text-neutral-600">
          For each failure scenario, identify the underlying factors that would
          lead to this outcome
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium">
          {totalRootCauses} Root {totalRootCauses === 1 ? 'Cause' : 'Causes'}{' '}
          Identified
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-4 mb-8">
        {sortedScenarios.map((scenario) => {
          const isExpanded = expandedScenarios.has(scenario.id);
          const isLoading = aiCallsInProgress[scenario.id];

          return (
            <Card key={scenario.id} variant="elevated" padding="md">
              {/* Scenario Header */}
              <button
                onClick={() => toggleScenario(scenario.id)}
                className="w-full flex items-start justify-between text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {scenario.title}
                    </h3>
                    {scenario.flaggedAsConcerning && (
                      <span className="bg-accent-error/10 text-accent-error text-xs font-medium px-2 py-0.5 rounded-full">
                        Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">
                    {scenario.description}
                  </p>
                  {scenario.rootCauses.length > 0 && (
                    <p className="text-sm text-primary-600 mt-2 font-medium">
                      {scenario.rootCauses.length} root{' '}
                      {scenario.rootCauses.length === 1 ? 'cause' : 'causes'}
                    </p>
                  )}
                </div>

                <div className="ml-4">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </button>

              {/* Root Causes (Expanded) */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  {scenario.rootCauses.length === 0 && !isLoading && (
                    <div className="text-center py-6">
                      <p className="text-neutral-600 mb-4">
                        No root causes identified yet
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          onClick={() => handleGenerateRootCauses(scenario)}
                        >
                          Generate with AI
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddManualRootCause(scenario.id)}
                          icon={<Plus className="w-4 h-4" />}
                        >
                          Add Manually
                        </Button>
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-500 mr-2" />
                      <span className="text-sm text-neutral-600">
                        Analyzing root causes...
                      </span>
                    </div>
                  )}

                  {scenario.rootCauses.length > 0 && (
                    <div className="space-y-4">
                      {scenario.rootCauses.map((rootCause) => (
                        <div
                          key={rootCause.id}
                          className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
                        >
                          <Input
                            value={rootCause.cause}
                            onChange={(value) =>
                              handleEditRootCause(
                                scenario.id,
                                rootCause.id,
                                'cause',
                                value
                              )
                            }
                            placeholder="Root cause (concise)"
                            className="mb-2"
                          />

                          <Input
                            value={rootCause.explanation}
                            onChange={(value) =>
                              handleEditRootCause(
                                scenario.id,
                                rootCause.id,
                                'explanation',
                                value
                              )
                            }
                            placeholder="Why would this lead to failure?"
                          />

                          <div className="mt-2 flex justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteRootCause(scenario.id, rootCause.id)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddManualRootCause(scenario.id)}
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Add Another Root Cause
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Guidance */}
      {!canProceed && (
        <div className="bg-accent-warning/10 border border-accent-warning/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-neutral-800">
            <strong>Tip:</strong> Identify at least 3 root causes across your
            scenarios to build meaningful mitigation strategies.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
          size="lg"
          disabled={!canProceed}
        >
          Continue to Mitigation Strategies
        </Button>
      </div>
    </div>
  );
}
