import React from 'react';

export interface ValueWithPlaceholderProps {
  value?: string | number | null;
  placeholder: string;
  className?: string;
}

export default function ValueWithPlaceholder({ value, placeholder, className = '' }: ValueWithPlaceholderProps) {
  const isEmpty = !value || value === '—' || value === '-';
  if (!isEmpty) {
    return <span className={className}>{value}</span>;
  }
  return <span className={`text-[#9ca3af] ${className}`}>{placeholder}</span>;
}
