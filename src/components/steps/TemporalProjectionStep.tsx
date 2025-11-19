import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Textarea } from '@/components/common/Textarea';
import { Card } from '@/components/common/Card';
import { Decision } from '@/types/premortem';

export interface TemporalProjectionStepProps {
  decision: Decision;
  userThoughts: string;
  onUpdate: (thoughts: string) => void;
  onNext: () => void;
}

function calculateFutureDate(timeline: string): string {
  const months =
    timeline === '3 months'
      ? 3
      : timeline === '6 months'
        ? 6
        : timeline === '12 months'
          ? 12
          : 18;

  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + months);

  return futureDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TemporalProjectionStep({
  decision,
  userThoughts,
  onUpdate,
  onNext,
}: TemporalProjectionStepProps) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  const futureDate = calculateFutureDate(decision.timeline);

  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setTimerActive(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkipTimer = () => {
    setTimerActive(false);
    setTimeRemaining(0);
  };

  if (showAnimation) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          {/* Calendar animation */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-xl opacity-50 animate-pulse-slow" />
            <div className="relative bg-white rounded-2xl p-8 shadow-modal">
              <Calendar className="w-24 h-24 text-primary-500 animate-pulse" />
            </div>
          </div>

          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-4">
            Fast-forwarding to {futureDate}...
          </h2>

          <p className="text-lg text-neutral-600 max-w-md mx-auto">
            Preparing your mind for prospective hindsight
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-slide-up">
      {/* Immersive Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-error/10 text-accent-error px-4 py-2 rounded-full mb-4">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Hypothetical Scenario</span>
        </div>

        <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
          It's now {futureDate}
        </h2>

        <p className="text-xl text-neutral-700 mb-2">
          Unfortunately, your decision has <strong>failed completely</strong>.
        </p>

        <p className="text-neutral-600">
          You're in a team meeting explaining what went wrong.
        </p>
      </div>

      {/* Main Prompt Card */}
      <Card variant="elevated" padding="lg" className="mb-6 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Your Decision (that failed):
          </h3>
          <p className="text-neutral-700 italic">
            "{decision.description}"
          </p>
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            What are all the reasons this decision failed?
          </h3>

          <p className="text-sm text-neutral-600 mb-4">
            Take 2 minutes to brainstorm. Write down everything that comes to
            mind - obvious risks, unlikely scenarios, external factors,
            internal challenges. Don't filter yourself.
          </p>

          <Textarea
            value={userThoughts}
            onChange={onUpdate}
            placeholder="Start writing your thoughts... What went wrong? What did you miss? What assumptions turned out to be false?"
            rows={8}
            maxLength={500}
            helpText="This helps our AI generate more relevant scenarios based on your concerns"
          />
        </div>
      </Card>

      {/* Timer */}
      {timerActive && (
        <Card variant="outlined" padding="md" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-primary-600">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Silent brainstorming time
                </p>
                <p className="text-xs text-neutral-500">
                  Research shows dedicated thinking time improves outcomes
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipTimer}
            >
              Skip
            </Button>
          </div>
        </Card>
      )}

      {/* Tips */}
      <div className="bg-primary-50 rounded-lg p-4 mb-8 border border-primary-100">
        <h4 className="text-sm font-semibold text-primary-900 mb-2">
          💡 Tips for better scenarios:
        </h4>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>• Think beyond the obvious - what's the 20% probability event?</li>
          <li>• Consider people, process, technology, and external factors</li>
          <li>• What assumptions are you making that might be wrong?</li>
          <li>• Imagine you're a skeptic trying to poke holes in the plan</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
          size="lg"
          disabled={timerActive && timeRemaining > 0}
        >
          {timerActive && timeRemaining > 0
            ? 'Generating scenarios...'
            : 'Generate AI Scenarios'}
        </Button>
      </div>
    </div>
  );
}
