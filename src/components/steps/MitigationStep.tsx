import React, { useState } from 'react';
import { ArrowRight, Plus, Star, Edit2, Trash2, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Scenario, MitigationStrategy } from '@/types/premortem';
import { generateMitigationStrategies } from '@/services/claudeAPI';

export interface MitigationStepProps {
  scenarios: Scenario[];
  mitigationStrategies: MitigationStrategy[];
  onUpdateStrategies: (strategies: MitigationStrategy[]) => void;
  onNext: () => void;
  aiCallsInProgress: Record<string, boolean>;
  onSetAILoading: (rootCauseId: string, loading: boolean) => void;
}

export function MitigationStep({
  scenarios,
  mitigationStrategies,
  onUpdateStrategies,
  onNext,
  aiCallsInProgress,
  onSetAILoading,
}: MitigationStepProps) {
  const [editingStrategyId, setEditingStrategyId] = useState<string | null>(null);
  const [editedStrategy, setEditedStrategy] = useState<MitigationStrategy | null>(null);

  // Get all root causes from all scenarios
  const allRootCauses = scenarios.flatMap((s) =>
    s.rootCauses.map((rc) => ({
      ...rc,
      scenarioId: s.id,
      scenarioTitle: s.title,
    }))
  );

  const handleGenerateStrategies = async (
    rootCauseId: string,
    rootCause: string,
    explanation: string,
    scenarioContext: string
  ) => {
    onSetAILoading(rootCauseId, true);

    try {
      const strategyResponses = await generateMitigationStrategies(
        rootCause,
        explanation,
        scenarioContext,
        'Decision to be made'
      );

      const newStrategies: MitigationStrategy[] = strategyResponses.map((sr) => ({
        id: uuidv4(),
        rootCauseIds: [rootCauseId],
        title: sr.title,
        description: sr.description,
        effort: sr.effort,
        impact: sr.impact,
        timing: sr.timing,
        priority: false,
        userEdited: false,
      }));

      onUpdateStrategies([...mitigationStrategies, ...newStrategies]);
    } catch (error) {
      console.error('Error generating mitigation strategies:', error);
    } finally {
      onSetAILoading(rootCauseId, false);
    }
  };

  const handleAddManualStrategy = () => {
    const newStrategy: MitigationStrategy = {
      id: uuidv4(),
      rootCauseIds: [],
      title: 'New Mitigation Strategy',
      description: 'Describe the specific actions to prevent this failure',
      effort: 'Medium',
      impact: 'Medium',
      timing: 'Pre-decision',
      priority: false,
      userEdited: true,
    };

    onUpdateStrategies([...mitigationStrategies, newStrategy]);
    setEditingStrategyId(newStrategy.id);
    setEditedStrategy(newStrategy);
  };

  const handleEditStrategy = (strategy: MitigationStrategy) => {
    setEditingStrategyId(strategy.id);
    setEditedStrategy({ ...strategy });
  };

  const handleSaveEdit = () => {
    if (!editedStrategy) return;

    onUpdateStrategies(
      mitigationStrategies.map((s) =>
        s.id === editedStrategy.id ? { ...editedStrategy, userEdited: true } : s
      )
    );

    setEditingStrategyId(null);
    setEditedStrategy(null);
  };

  const handleCancelEdit = () => {
    setEditingStrategyId(null);
    setEditedStrategy(null);
  };

  const handleDeleteStrategy = (strategyId: string) => {
    onUpdateStrategies(mitigationStrategies.filter((s) => s.id !== strategyId));
  };

  const handleTogglePriority = (strategyId: string) => {
    onUpdateStrategies(
      mitigationStrategies.map((s) =>
        s.id === strategyId ? { ...s, priority: !s.priority } : s
      )
    );
  };

  const priorityCount = mitigationStrategies.filter((s) => s.priority).length;
  const canProceed = mitigationStrategies.length >= 3;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Mitigation Strategies
        </h2>
        <p className="text-neutral-600">
          Develop actionable strategies to prevent the identified failure modes
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium">
          {mitigationStrategies.length}{' '}
          {mitigationStrategies.length === 1 ? 'Strategy' : 'Strategies'}
        </div>
        <div className="bg-accent-success/10 text-accent-success px-4 py-2 rounded-lg text-sm font-medium">
          {priorityCount} Priority{' '}
          {priorityCount === 1 ? 'Action' : 'Actions'}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Root Causes */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Root Causes to Address
          </h3>

          <div className="space-y-3">
            {allRootCauses.map((rc) => {
              const hasStrategies = mitigationStrategies.some((s) =>
                s.rootCauseIds.includes(rc.id)
              );
              const isLoading = aiCallsInProgress[rc.id];

              return (
                <Card
                  key={rc.id}
                  variant={hasStrategies ? 'elevated' : 'outlined'}
                  padding="sm"
                  className={hasStrategies ? 'bg-accent-success/5' : ''}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 text-sm mb-1">
                        {rc.cause}
                      </h4>
                      <p className="text-xs text-neutral-600 mb-1">
                        {rc.explanation}
                      </p>
                      <p className="text-xs text-neutral-500">
                        From: {rc.scenarioTitle}
                      </p>
                    </div>

                    {!hasStrategies && !isLoading && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleGenerateStrategies(
                            rc.id,
                            rc.cause,
                            rc.explanation,
                            rc.scenarioTitle
                          )
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}

                    {isLoading && (
                      <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    )}

                    {hasStrategies && (
                      <span className="text-xs text-accent-success font-medium">
                        ✓
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Mitigation Strategies */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              Mitigation Strategies
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddManualStrategy}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Manual
            </Button>
          </div>

          {mitigationStrategies.length === 0 && (
            <Card variant="outlined" padding="lg" className="text-center">
              <p className="text-neutral-600 mb-4">
                No strategies created yet. Generate strategies from root causes
                on the left, or add manually.
              </p>
            </Card>
          )}

          <div className="space-y-4">
            {mitigationStrategies.map((strategy) => {
              const isEditing = editingStrategyId === strategy.id;

              if (isEditing && editedStrategy) {
                return (
                  <Card
                    key={strategy.id}
                    variant="elevated"
                    padding="md"
                    className="border-2 border-primary-300"
                  >
                    <div className="space-y-3">
                      <Input
                        label="Strategy Title"
                        value={editedStrategy.title}
                        onChange={(value) =>
                          setEditedStrategy({ ...editedStrategy, title: value })
                        }
                        maxLength={80}
                      />

                      <Textarea
                        label="Description"
                        value={editedStrategy.description}
                        onChange={(value) =>
                          setEditedStrategy({
                            ...editedStrategy,
                            description: value,
                          })
                        }
                        rows={3}
                        maxLength={300}
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <Select
                          label="Effort"
                          value={editedStrategy.effort}
                          onChange={(value) =>
                            setEditedStrategy({
                              ...editedStrategy,
                              effort: value as 'Low' | 'Medium' | 'High',
                            })
                          }
                          options={[
                            { value: 'Low', label: 'Low' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'High', label: 'High' },
                          ]}
                        />

                        <Select
                          label="Impact"
                          value={editedStrategy.impact}
                          onChange={(value) =>
                            setEditedStrategy({
                              ...editedStrategy,
                              impact: value as 'Low' | 'Medium' | 'High',
                            })
                          }
                          options={[
                            { value: 'Low', label: 'Low' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'High', label: 'High' },
                          ]}
                        />

                        <Select
                          label="Timing"
                          value={editedStrategy.timing}
                          onChange={(value) =>
                            setEditedStrategy({
                              ...editedStrategy,
                              timing: value as MitigationStrategy['timing'],
                            })
                          }
                          options={[
                            { value: 'Pre-decision', label: 'Pre-decision' },
                            {
                              value: 'During execution',
                              label: 'During execution',
                            },
                            { value: 'Monitoring', label: 'Monitoring' },
                          ]}
                        />
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              }

              return (
                <Card
                  key={strategy.id}
                  variant={strategy.priority ? 'elevated' : 'outlined'}
                  padding="md"
                  className={
                    strategy.priority ? 'ring-2 ring-accent-success/30' : ''
                  }
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-neutral-900 flex-1">
                      {strategy.title}
                    </h4>
                    <button
                      onClick={() => handleTogglePriority(strategy.id)}
                      className={`ml-2 ${
                        strategy.priority
                          ? 'text-accent-success'
                          : 'text-neutral-300 hover:text-accent-success'
                      }`}
                    >
                      <Star
                        className={`w-5 h-5 ${strategy.priority ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>

                  <p className="text-sm text-neutral-600 mb-3">
                    {strategy.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Effort: {strategy.effort}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Impact: {strategy.impact}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {strategy.timing}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStrategy(strategy)}
                      icon={<Edit2 className="w-3 h-3" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStrategy(strategy.id)}
                      icon={<Trash2 className="w-3 h-3" />}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guidance */}
      {!canProceed && (
        <div className="bg-accent-warning/10 border border-accent-warning/30 rounded-lg p-4 my-8">
          <p className="text-sm text-neutral-800">
            <strong>Tip:</strong> Create at least 3 mitigation strategies. Mark
            your top strategies as priority using the star icon.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
          size="lg"
          disabled={!canProceed}
        >
          Continue to Recalibration
        </Button>
      </div>
    </div>
  );
}
