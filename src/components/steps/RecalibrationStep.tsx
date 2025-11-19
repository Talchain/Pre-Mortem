import React from 'react';
import { ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Slider } from '@/components/common/Slider';
import { Textarea } from '@/components/common/Textarea';
import { Decision } from '@/types/premortem';

export interface RecalibrationStepProps {
  decision: Decision;
  adjustedConfidence: number;
  keyInsight: string;
  onUpdateConfidence: (confidence: number) => void;
  onUpdateInsight: (insight: string) => void;
  onNext: () => void;
}

export function RecalibrationStep({
  decision,
  adjustedConfidence,
  keyInsight,
  onUpdateConfidence,
  onUpdateInsight,
  onNext,
}: RecalibrationStepProps) {
  const confidenceDelta = adjustedConfidence - decision.initialConfidence;

  const getDeltaIcon = () => {
    if (confidenceDelta > 5) return <TrendingUp className="w-6 h-6" />;
    if (confidenceDelta < -5) return <TrendingDown className="w-6 h-6" />;
    return <Minus className="w-6 h-6" />;
  };

  const getDeltaColor = () => {
    if (confidenceDelta > 5) return 'text-accent-success';
    if (confidenceDelta < -5) return 'text-accent-error';
    return 'text-neutral-500';
  };

  const getDeltaText = () => {
    if (confidenceDelta > 0) return `+${confidenceDelta}`;
    if (confidenceDelta < 0) return `${confidenceDelta}`;
    return 'No change';
  };

  const getDeltaBgColor = () => {
    if (confidenceDelta > 5) return 'bg-accent-success/10';
    if (confidenceDelta < -5) return 'bg-accent-error/10';
    return 'bg-neutral-100';
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
          Confidence Recalibration
        </h2>
        <p className="text-neutral-600">
          After exploring potential failures and mitigation strategies, how
          confident are you now?
        </p>
      </div>

      {/* Original Confidence */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Original Confidence
            </h3>
            <p className="text-3xl font-bold text-neutral-900">
              {decision.initialConfidence}/100
            </p>
          </div>

          <div className="w-32 h-32 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#E2E8F0"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#6366F1"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(decision.initialConfidence / 100) * 352} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-neutral-900">
                {decision.initialConfidence}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-4">
          <p className="text-sm text-neutral-700 italic">
            "{decision.description}"
          </p>
        </div>
      </Card>

      {/* Adjusted Confidence */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">
          After This Analysis
        </h3>

        <Slider
          label="How confident are you now that this decision will succeed?"
          value={adjustedConfidence}
          onChange={onUpdateConfidence}
          min={0}
          max={100}
          showValue
          labels={{
            min: 'Not Confident',
            max: 'Very Confident',
          }}
        />

        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-full ${getDeltaBgColor()}`}
            >
              <span className={`font-bold ${getDeltaColor()}`}>
                {getDeltaIcon()}
              </span>
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900 mb-1">
                Confidence Shift
              </h4>
              <p className={`text-2xl font-bold ${getDeltaColor()}`}>
                {getDeltaText()} points
              </p>
              <p className="text-sm text-neutral-600 mt-1">
                {confidenceDelta > 5 &&
                  'Your confidence increased - the mitigation strategies may have addressed key concerns'}
                {confidenceDelta < -5 &&
                  'Your confidence decreased - the pre-mortem revealed significant blind spots'}
                {Math.abs(confidenceDelta) <= 5 &&
                  'Your confidence remained stable - you may have already considered these risks'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Insight */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Key Insight from This Analysis
        </h3>

        <p className="text-sm text-neutral-600 mb-4">
          In 1-2 sentences, what's the most important thing you learned from
          this pre-mortem? What will you do differently?
        </p>

        <Textarea
          value={keyInsight}
          onChange={onUpdateInsight}
          placeholder="e.g., 'We need stronger user research validation before launch. The team consensus was masking significant market uncertainties.'"
          rows={4}
          maxLength={200}
          helpText="This will appear prominently in your summary report"
        />
      </Card>

      {/* Guidance */}
      <div className="bg-primary-50 rounded-lg p-4 mb-8 border border-primary-100">
        <h4 className="text-sm font-semibold text-primary-900 mb-2">
          💡 Interpreting Your Confidence Shift
        </h4>
        <div className="text-sm text-primary-800 space-y-2">
          <p>
            <strong>Decreased confidence:</strong> The pre-mortem revealed blind
            spots. Consider implementing priority mitigation strategies before
            proceeding.
          </p>
          <p>
            <strong>Increased confidence:</strong> Your mitigation strategies
            addressed key concerns. Proceed with monitoring in place.
          </p>
          <p>
            <strong>No change:</strong> You may have already internalized these
            risks. Still valuable to formalize the mitigation plan.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
          size="lg"
        >
          Generate Summary Report
        </Button>
      </div>
    </div>
  );
}
