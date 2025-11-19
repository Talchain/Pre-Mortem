import React from 'react';
import { Check } from 'lucide-react';

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepLabels,
  className = '',
}: ProgressIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-primary-500 text-white'
                        : isCurrent
                          ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                          : 'bg-neutral-200 text-neutral-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>

                {/* Step Label */}
                {stepLabels && stepLabels[index] && (
                  <span
                    className={`
                      mt-2 text-xs font-medium text-center max-w-[80px]
                      ${
                        isCurrent
                          ? 'text-primary-700'
                          : isCompleted
                            ? 'text-neutral-700'
                            : 'text-neutral-400'
                      }
                    `}
                  >
                    {stepLabels[index]}
                  </span>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 transition-all duration-300
                    ${
                      step < currentStep
                        ? 'bg-primary-500'
                        : 'bg-neutral-200'
                    }
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Percentage */}
      <div className="mt-4">
        <div className="text-xs text-neutral-500 text-right mb-1">
          {Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}% Complete
        </div>
        <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
