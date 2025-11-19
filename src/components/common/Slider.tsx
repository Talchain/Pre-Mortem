import React from 'react';

export interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  labels?: { min: string; max: string };
  className?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  labels,
  className = '',
}: SliderProps) {
  // Calculate percentage for gradient effect
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-neutral-700">{label}</label>
          {showValue && (
            <span className="text-lg font-semibold text-primary-600">
              {value}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="slider-input w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none"
          style={{
            background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`,
          }}
        />
      </div>

      {labels && (
        <div className="flex justify-between mt-2 text-xs text-neutral-500">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      )}
    </div>
  );
}
