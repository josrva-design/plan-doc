import React, { useState, useEffect, useRef } from 'react';

export interface EditableSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
  placeholder?: string;
  className?: string;
}

export default function EditableSelect({ value, onChange, options, placeholder, className }: EditableSelectProps) {
  const [mode, setMode] = useState<'select' | 'input'>('select');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedValue = value ?? '';
  const hasValue = !!normalizedValue;

  const normalizedOptions = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  useEffect(() => {
    if (normalizedValue !== 'Personalizado') {
      setMode('select');
      setInputValue('');
    }
  }, [normalizedValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Personalizado') {
      setMode('input');
      setInputValue('');
      onChange('');
    } else {
      setMode('select');
      onChange(val);
    }
  };

  const commitInput = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onChange(trimmed);
      setMode('select');
    } else {
      onChange('');
      setMode('select');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleInputBlur = () => {
    commitInput();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitInput();
    }
    if (e.key === 'Escape') {
      setInputValue('');
      setMode('select');
      onChange('');
    }
  };

  if (mode === 'input') {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        placeholder="Escribe tu opción..."
        className={`w-full bg-transparent outline-none premium-table-input border-b border-transparent focus:border-[var(--color-primary)] input-placeholder ${className || ''}`}
        autoFocus
      />
    );
  }

  return (
    <select
      value={normalizedValue}
      onChange={handleSelectChange}
      className={`w-full bg-transparent outline-none premium-table-input border-b border-transparent focus:border-[var(--color-primary)] input-placeholder cursor-pointer ${className || ''} ${!hasValue ? 'is-placeholder' : ''}`}
    >
      <option value="" disabled>{placeholder}</option>
      {normalizedOptions.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
      <option value="Personalizado">Personalizado</option>
    </select>
  );
}
