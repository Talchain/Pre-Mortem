import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Slider } from '@/components/common/Slider';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Decision, DecisionType, Timeline } from '@/types/premortem';

export interface DecisionInputStepProps {
  decision: Decision;
  onUpdate: (decision: Decision) => void;
  onNext: () => void;
  onBack: () => void;
}

const DECISION_TYPE_OPTIONS = [
  { value: 'Product Strategy', label: 'Product Strategy' },
  { value: 'Feature Launch', label: 'Feature Launch' },
  { value: 'Resource Allocation', label: 'Resource Allocation' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Hiring', label: 'Hiring' },
  { value: 'Other', label: 'Other' },
];

const TIMELINE_OPTIONS = [
  { value: '3 months', label: '3 months' },
  { value: '6 months', label: '6 months' },
  { value: '12 months', label: '12 months' },
  { value: '18+ months', label: '18+ months' },
];

export function DecisionInputStep({
  decision,
  onUpdate,
  onNext,
  onBack,
}: DecisionInputStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Decision, value: string | number | string[]) => {
    onUpdate({
      ...decision,
      [field]: value,
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!decision.title || decision.title.trim().length === 0) {
      newErrors.title = 'Decision title is required';
    } else if (decision.title.length < 5) {
      newErrors.title = 'Please provide a more descriptive title (at least 5 characters)';
    }

    if (!decision.description || decision.description.trim().length === 0) {
      newErrors.description = 'Decision description is required';
    } else if (decision.description.length < 50) {
      newErrors.description =
        'Please provide more detail about your decision (at least 50 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const stakeholdersValue = decision.stakeholders
    ? decision.stakeholders.join(', ')
    : '';

  const handleStakeholdersChange = (value: string) => {
    const stakeholders = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    handleChange('stakeholders', stakeholders);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Tell Us About Your Decision
        </h2>
        <p className="text-neutral-600">
          Provide context so we can help you identify relevant failure scenarios
        </p>
      </div>

      <Card variant="elevated" padding="lg">
        <div className="space-y-6">
          {/* Decision Title */}
          <Input
            label="Decision Title"
            name="decisionTitle"
            value={decision.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="e.g., Launch AI-powered search feature"
            required
            maxLength={100}
            error={errors.title}
            helpText="A short, descriptive title for your decision"
          />

          {/* Decision Description */}
          <Textarea
            label="Decision Description"
            name="decisionDescription"
            value={decision.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Describe your decision in detail. What are you planning to do? What's the scope?"
            required
            maxLength={500}
            rows={5}
            error={errors.description}
            helpText="The more detail you provide, the better our analysis will be"
          />

          {/* Decision Type */}
          <Select
            label="Decision Type"
            name="decisionType"
            value={decision.type}
            onChange={(value) => handleChange('type', value as DecisionType)}
            options={DECISION_TYPE_OPTIONS}
            required
            helpText="What category best describes this decision?"
          />

          {/* Timeline */}
          <Select
            label="Timeline"
            name="timeline"
            value={decision.timeline}
            onChange={(value) => handleChange('timeline', value as Timeline)}
            options={TIMELINE_OPTIONS}
            required
            helpText="When will you know if this decision succeeded or failed?"
          />

          {/* Initial Confidence */}
          <div className="py-4">
            <Slider
              label="How confident are you this decision will succeed?"
              value={decision.initialConfidence}
              onChange={(value) => handleChange('initialConfidence', value)}
              min={0}
              max={100}
              showValue
              labels={{
                min: 'Not Confident',
                max: 'Very Confident',
              }}
            />
          </div>

          {/* Stakeholders (Optional) */}
          <Input
            label="Stakeholders (Optional)"
            value={stakeholdersValue}
            onChange={handleStakeholdersChange}
            placeholder="e.g., Product Team, Engineering, Marketing"
            helpText="Comma-separated list of people or teams involved"
          />

          {/* Success Criteria (Optional) */}
          <Textarea
            label="Success Criteria (Optional)"
            value={decision.successCriteria || ''}
            onChange={(value) => handleChange('successCriteria', value)}
            placeholder="How will you measure success? What does good look like?"
            maxLength={300}
            rows={3}
            helpText="Defining success criteria helps identify more relevant failure modes"
          />

          {/* Context/Constraints (Optional) */}
          <Textarea
            label="Additional Context (Optional)"
            value={decision.context || ''}
            onChange={(value) => handleChange('context', value)}
            placeholder="Any relevant background, constraints, or considerations?"
            maxLength={500}
            rows={4}
            helpText="Market conditions, resource constraints, organizational factors, etc."
          />
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          icon={<ArrowRight className="w-4 h-4" />}
          size="lg"
        >
          Continue to Pre-Mortem
        </Button>
      </div>
    </div>
  );
}
