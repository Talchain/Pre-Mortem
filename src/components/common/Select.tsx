import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  helpText,
  required = false,
  disabled = false,
  name,
  className = '',
}: SelectProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-accent-error ml-1">*</span>}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          ${error ? 'border-accent-error' : 'border-neutral-300'}
          bg-white text-neutral-900
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-accent-error' : 'focus:ring-primary-500'}
          focus:border-transparent
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          transition-colors duration-200
          cursor-pointer
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-accent-error">{error}</p>
      )}

      {helpText && !error && (
        <p className="mt-1 text-sm text-neutral-500">{helpText}</p>
      )}
    </div>
  );
}
