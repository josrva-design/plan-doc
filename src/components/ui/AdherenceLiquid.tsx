interface AdherenceLiquidProps {
  cells: Record<string, Record<string, number | ''>>;
  lastC: string;
}

const ADHERENCE_FIELDS = [
  { key: 'nutricion', label: 'Nutrición' },
  { key: 'entreno', label: 'Entrenamiento' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'descanso', label: 'Descanso' },
];

function Donut({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const strokeColor = pct >= 70 ? '#2E9E70' : pct >= 40 ? '#0066CC' : '#DC2626';
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width="80" height="80" viewBox="0 0 80 80">
          {/* Track */}
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="6" />
          {/* Progress */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
          {/* Center text */}
          <text x="40" y="40" textAnchor="middle" dy="0.35em" fontSize="16" fontWeight="800" fill="#0D2640">
            {pct}%
          </text>
        </svg>
      </div>
      <span className="text-[10px] font-semibold text-[#4B5563] tracking-wide">{label}</span>
    </div>
  );
}

export default function AdherenceLiquid({ cells, lastC }: AdherenceLiquidProps) {
  const data = ADHERENCE_FIELDS.map(f => {
    const val = cells[lastC]?.[f.key];
    return { ...f, value: typeof val === 'number' ? val : null };
  }).filter(d => d.value !== null) as { key: string; label: string; value: number }[];

  if (!data.length) return null;

  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
      <div className="premium-section-title">
        <h3 className="text-[12px] font-bold tracking-widest text-[var(--color-text-primary)]">ADHERENCIA • ACTUAL</h3>
      </div>
      <div className="mt-4 flex items-center justify-around gap-4">
        {data.map(d => (
          <Donut key={d.key} value={d.value} label={d.label} />
        ))}
      </div>
    </div>
  );
}
