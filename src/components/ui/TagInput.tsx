import React, { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TagInput({ value = '', onChange, placeholder = 'Escribe y presiona Enter...', className = '' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      onChange?.(newTags.join(', '));
    }
    setInputValue('');
  }, [tags, onChange]);

  const removeTag = useCallback((index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange?.(newTags.join(', '));
  }, [tags, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 min-h-[32px] cursor-text ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="p-0.5 hover:bg-[var(--color-border)] rounded-full transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[80px] bg-transparent outline-none typo-input input-placeholder"
      />
    </div>
  );
}
