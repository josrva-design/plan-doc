interface AvanceBadgeProps {
  value: number | null;
  goal: 'up' | 'down' | 'neutral';
}

function AvanceBadge({ value, goal }: AvanceBadgeProps) {
  if (value === null || value === undefined || isNaN(value)) return <span className="text-[10px] text-zinc-300">-</span>;
  const isGood = (goal === 'up' && value > 0) || (goal === 'down' && value < 0);
  const isNeutral = goal === 'neutral';
  if (isNeutral) return <span className="text-[10px] font-bold text-zinc-600">{value > 0 ? '+' : ''}{value.toFixed(1)}</span>;
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
      {value > 0 ? '+' : ''}{value.toFixed(1)} {value > 0 ? '↑' : '↓'}
    </span>
  );
}

export default AvanceBadge;
