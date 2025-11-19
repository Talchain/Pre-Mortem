import React from 'react';

export interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  type?: 'text' | 'email' | 'number';
  name?: string;
  className?: string;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  maxLength,
  type = 'text',
  name,
  className = '',
}: InputProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-accent-error ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          ${error ? 'border-accent-error' : 'border-neutral-300'}
          bg-white text-neutral-900 placeholder-neutral-400
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-accent-error' : 'focus:ring-primary-500'}
          focus:border-transparent
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          transition-colors duration-200
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
