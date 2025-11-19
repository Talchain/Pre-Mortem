import React from 'react';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  className = '',
  onClick,
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';

  const variantClasses = {
    default: 'shadow-card',
    elevated: 'shadow-elevated hover:shadow-lg',
    outlined: 'border border-neutral-200',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hoverable
    ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
    : '';

  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
