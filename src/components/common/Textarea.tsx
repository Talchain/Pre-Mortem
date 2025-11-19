import React from 'react';

export interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  name?: string;
  className?: string;
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  maxLength,
  rows = 4,
  name,
  className = '',
}: TextareaProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-accent-error ml-1">*</span>}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
        rows={rows}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          ${error ? 'border-accent-error' : 'border-neutral-300'}
          bg-white text-neutral-900 placeholder-neutral-400
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-accent-error' : 'focus:ring-primary-500'}
          focus:border-transparent
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          transition-colors duration-200
          resize-none
        `}
      />

      {maxLength && (
        <div className="mt-1 text-xs text-neutral-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-accent-error">{error}</p>
      )}

      {helpText && !error && (
        <p className="mt-1 text-sm text-neutral-500">{helpText}</p>
      )}
    </div>
  );
}
