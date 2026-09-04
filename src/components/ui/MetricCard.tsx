import React from 'react';

export interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  helper?: string;
  color?: string;
  className?: string;
  valueClassName?: string;
  pill?: React.ReactNode;
  children?: React.ReactNode;
}

export default function MetricCard({ label, value, helper, color = 'var(--color-navy)', className = '', valueClassName = '', forceWhiteText = false, pill, children }: MetricCardProps) {
  const textColor = forceWhiteText ? 'text-white' : '';
  const labelColor = forceWhiteText ? 'text-white/70' : 'text-[var(--color-text-muted)]';
  const helperColor = forceWhiteText ? 'text-white/70' : 'text-[var(--color-text-muted)]';
  const isPrimitive = typeof value === 'string' || typeof value === 'number';
  const isPlaceholder = value === '—' || value === null || value === undefined || value === '';

  return (
    <div className={`rounded-2xl border border-[var(--color-border)] bg-white p-4 flex flex-col justify-between relative ${className}`}>
      {pill ? <div className="absolute top-3 right-3">{pill}</div> : null}
      <div>
        {label && label.trim() ? (
          <span className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${labelColor}`}>{label}</span>
        ) : null}
        <div className={`text-xl font-extrabold leading-none mt-1 ${textColor} ${valueClassName}`} style={{ color: isPrimitive && isPlaceholder ? '#9ca3af' : (!isPrimitive ? undefined : (forceWhiteText ? undefined : color)) }}>{value}</div>
        {helper ? <div className={`text-[10px] mt-1 ${helperColor}`}>{helper}</div> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
