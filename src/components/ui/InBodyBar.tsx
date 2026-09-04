function InBodyBar({ label, value, min, max, idealMin, idealMax }: {
  label: string;
  value: number;
  min: number;
  max: number;
  idealMin?: number;
  idealMax?: number;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const showIdeal = typeof idealMin === 'number' && typeof idealMax === 'number';
  const idealLeft = showIdeal ? ((idealMin - min) / (max - min)) * 100 : 0;
  const idealWidth = showIdeal ? ((idealMax - min) / (max - min)) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px]"><span className="font-semibold text-[var(--color-text-primary)]">{label}</span><span className="font-bold text-[var(--color-text-primary)]">{value}</span></div>
      <div className="relative h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
        {showIdeal && <div className="absolute top-0 h-full bg-[var(--color-border)]" style={{ left: `${idealLeft}%`, width: `${idealWidth}%` }} />}
        <div className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-[var(--white)] bg-[var(--color-primary)]" style={{ left: `calc(${pct}% - 6px)` }} />
      </div>
      <div className="flex justify-between text-[9px] text-[var(--color-text-secondary)]"><span>Bajo</span><span>Normal</span><span>Alto</span></div>
    </div>
  );
}

export default InBodyBar;
