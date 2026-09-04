import React from 'react';

const Donut = ({ value, color, size = 48, strokeWidth = 4 }) => {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - (Number(value) || 0) / 100);
  const display = Number(value) > 0 ? `${Math.round(Number(value))}%` : '—';

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-bg-subtle)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={`${circumference - offset} ${circumference}`} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-extrabold text-[var(--color-navy)]">{display}</span>
      </div>
    </div>
  );
};

interface AdherenciaDonutCardProps {
  label: string;
  sublabel?: string;
  value: number | string;
  color: string;
  size?: number;
  strokeWidth?: number;
  printable?: boolean;
  isGeneral?: boolean;
}

export default function AdherenciaDonutCard({
  label,
  sublabel,
  value,
  color,
  size = 40,
  strokeWidth = 4,
  printable = false,
  isGeneral = false,
}: AdherenciaDonutCardProps) {
  const numericValue = Number(value);
  const hasValue = numericValue > 0;
  const displayValue = hasValue ? `${Math.round(numericValue)}%` : '—';

  if (printable) {
    return (
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
        <p className="text-xl font-extrabold text-[var(--color-navy)] mt-1">{displayValue}</p>
      </div>
    );
  }

  if (!hasValue) {
    return (
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-center opacity-60">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
        <p className="text-xl font-extrabold text-[var(--color-navy)] mt-1">—</p>
      </div>
    );
  }

  if (isGeneral) {
    return (
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-3">
        <Donut value={numericValue} color={color} size={size} strokeWidth={strokeWidth} />
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
          {sublabel && <span className="text-[9px] text-[var(--color-text-muted)]">{sublabel}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-3 flex items-center gap-2">
      <Donut value={numericValue} color={color} size={size} strokeWidth={strokeWidth} />
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
        {sublabel && <span className="text-[9px] text-[var(--color-text-muted)]">{sublabel}</span>}
      </div>
    </div>
  );
}
