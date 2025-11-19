import React from 'react';
import { Brain, ArrowRight, Lightbulb, Target, TrendingDown } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export interface WelcomeStepProps {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-lg">
          <Brain className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
          Pre-Mortem Analysis
        </h1>

        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Identify potential failure modes before committing to your decision
          using science-backed prospective hindsight methodology
        </p>
      </div>

      {/* Science Highlight */}
      <Card variant="elevated" padding="lg" className="mb-8 bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              The Science of Prospective Hindsight
            </h3>
            <p className="text-neutral-700 text-sm leading-relaxed">
              Research by Gary Klein and Daniel Kahneman shows that imagining
              an event has already occurred increases your ability to identify
              reasons for that outcome by <strong>30%</strong>. By assuming
              your decision has already failed, you'll uncover blind spots
              you'd otherwise miss.
            </p>
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <div className="mb-10">
        <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6 text-center">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="elevated" hoverable>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                1. Define Your Decision
              </h3>
              <p className="text-sm text-neutral-600">
                Describe the important decision you're about to make and your
                initial confidence level
              </p>
            </div>
          </Card>

          <Card variant="elevated" hoverable>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                2. Imagine Failure
              </h3>
              <p className="text-sm text-neutral-600">
                Fast-forward to the future and assume your decision has failed
                completely. What went wrong?
              </p>
            </div>
          </Card>

          <Card variant="elevated" hoverable>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-electric/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-accent-electric" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">
                3. Build Mitigation Plan
              </h3>
              <p className="text-sm text-neutral-600">
                AI helps you identify root causes and develop strategies to
                prevent those failures
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-neutral-50 rounded-xl p-6 mb-10">
        <h3 className="font-semibold text-neutral-900 mb-4">
          What You'll Get:
        </h3>
        <ul className="space-y-2 text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-accent-success mt-0.5">✓</span>
            <span>
              <strong>5-8 plausible failure scenarios</strong> tailored to your
              specific decision context
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-success mt-0.5">✓</span>
            <span>
              <strong>Root cause analysis</strong> revealing underlying factors
              that could derail your plan
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-success mt-0.5">✓</span>
            <span>
              <strong>Actionable mitigation strategies</strong> to prevent
              failures before they occur
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-success mt-0.5">✓</span>
            <span>
              <strong>Professional PDF report</strong> to share with
              stakeholders
            </span>
          </li>
        </ul>
      </div>

      {/* Time Estimate */}
      <div className="text-center mb-8">
        <p className="text-sm text-neutral-500 mb-6">
          ⏱️ Typical session: <strong>10-15 minutes</strong>
        </p>

        <Button
          size="lg"
          onClick={onStart}
          icon={<ArrowRight className="w-5 h-5" />}
          className="min-w-[200px]"
        >
          Start Pre-Mortem Analysis
        </Button>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-center text-neutral-400 mt-8">
        Your data stays private - everything is stored locally in your browser
      </p>
    </div>
  );
}
