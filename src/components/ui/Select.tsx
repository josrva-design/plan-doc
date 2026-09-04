import React from 'react';

export interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export default function Select({ value, onChange, options, placeholder, className }: SelectProps) {
  const hasValue = !!value;
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };
  return (
    <select
      value={value ?? ''}
      onChange={handleChange}
      className={`w-full bg-transparent outline-none premium-table-input border-b border-transparent focus:border-[var(--color-primary)] input-placeholder cursor-pointer ${className || ''} ${!hasValue ? 'is-placeholder' : ''}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}
