import React, { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl p-4 w-full ${maxWidth} shadow-xl border border-[var(--color-bg-subtle)] max-h-[90vh] flex flex-col`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-full hover:bg-[var(--color-bg-subtle)]"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
        {title && <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4 pr-8">{title}</h2>}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
