import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Flag,
  RefreshCw,
  Eye,
  X,
  Check,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Scenario } from '@/types/premortem';

export interface ScenarioCardProps {
  scenario: Scenario;
  onEdit: (updates: Partial<Scenario>) => void;
  onDelete: () => void;
  onFlag: () => void;
  onRegenerate?: () => void;
  isFlagged: boolean;
  canFlag: boolean;
}

export function ScenarioCard({
  scenario,
  onEdit,
  onDelete,
  onFlag,
  onRegenerate,
  isFlagged,
  canFlag,
}: ScenarioCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [editedScenario, setEditedScenario] = useState(scenario);

  const handleSaveEdit = () => {
    onEdit(editedScenario);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedScenario(scenario);
    setIsEditing(false);
  };

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'High':
        return 'bg-accent-error/10 text-accent-error';
      case 'Medium':
        return 'bg-accent-warning/10 text-accent-warning';
      case 'Low':
        return 'bg-accent-success/10 text-accent-success';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-orange-100 text-orange-700';
      case 'Low':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technical: 'bg-blue-100 text-blue-700',
      Market: 'bg-purple-100 text-purple-700',
      Team: 'bg-green-100 text-green-700',
      Resource: 'bg-yellow-100 text-yellow-700',
      External: 'bg-pink-100 text-pink-700',
      Strategic: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-neutral-100 text-neutral-600';
  };

  if (isEditing) {
    return (
      <Card variant="elevated" padding="md" className="border-2 border-primary-300">
        <div className="space-y-4">
          <Input
            label="Scenario Title"
            value={editedScenario.title}
            onChange={(value) =>
              setEditedScenario({ ...editedScenario, title: value })
            }
            maxLength={100}
          />

          <Textarea
            label="Description"
            value={editedScenario.description}
            onChange={(value) =>
              setEditedScenario({ ...editedScenario, description: value })
            }
            rows={4}
            maxLength={300}
          />

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Likelihood"
              value={editedScenario.likelihood}
              onChange={(value) =>
                setEditedScenario({
                  ...editedScenario,
                  likelihood: value as 'Low' | 'Medium' | 'High',
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
              value={editedScenario.impact}
              onChange={(value) =>
                setEditedScenario({
                  ...editedScenario,
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
              label="Category"
              value={editedScenario.category}
              onChange={(value) =>
                setEditedScenario({
                  ...editedScenario,
                  category: value as Scenario['category'],
                })
              }
              options={[
                { value: 'Technical', label: 'Technical' },
                { value: 'Market', label: 'Market' },
                { value: 'Team', label: 'Team' },
                { value: 'Resource', label: 'Resource' },
                { value: 'External', label: 'External' },
                { value: 'Strategic', label: 'Strategic' },
              ]}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="elevated"
      padding="md"
      className={`transition-all duration-200 ${
        isFlagged ? 'ring-2 ring-accent-error/30 bg-accent-error/5' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {scenario.title}
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {isFlagged && (
          <div className="ml-4">
            <div className="bg-accent-error text-white rounded-full p-2">
              <Flag className="w-4 h-4 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(scenario.category)}`}
        >
          {scenario.category}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getLikelihoodColor(scenario.likelihood)}`}
        >
          Likelihood: {scenario.likelihood}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getImpactColor(scenario.impact)}`}
        >
          Impact: {scenario.impact}
        </span>
        {scenario.source === 'ai' && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary-100 text-primary-700">
            AI Generated
          </span>
        )}
      </div>

      {/* AI Reasoning (expandable) */}
      {scenario.reasoning && scenario.source === 'ai' && (
        <div className="mb-4">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <Eye className="w-4 h-4" />
            {showReasoning ? 'Hide' : 'View'} AI Reasoning
          </button>

          {showReasoning && (
            <div className="mt-2 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-sm text-primary-900">{scenario.reasoning}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            icon={<Edit2 className="w-3.5 h-3.5" />}
          >
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>

          {onRegenerate && scenario.source === 'ai' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Regenerate
            </Button>
          )}
        </div>

        <Button
          variant={isFlagged ? 'danger' : 'ghost'}
          size="sm"
          onClick={onFlag}
          disabled={!isFlagged && !canFlag}
          icon={
            isFlagged ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Flag className="w-3.5 h-3.5" />
            )
          }
        >
          {isFlagged ? 'Unflag' : 'Flag as Concerning'}
        </Button>
      </div>

      {!canFlag && !isFlagged && (
        <p className="text-xs text-neutral-500 text-right mt-2">
          Max 3 scenarios can be flagged
        </p>
      )}
    </Card>
  );
}
