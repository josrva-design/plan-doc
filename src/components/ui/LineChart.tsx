function LineChart({ series, consultas }: { series: { name: string; color: string; data: (number | null)[] }[]; consultas: string[] }) {
  const W = 640, H = 220, PAD = 32;
  const allValues = series.flatMap(s => s.data.filter(v => typeof v === 'number'));
  if (!allValues.length) return <div className="h-[220px] flex items-center justify-center text-[var(--color-text-secondary)] text-sm">Agrega datos en {consultas[0]}...</div>;
  const min = Math.min(...allValues) * 0.95;
  const max = Math.max(...allValues) * 1.05;
  const range = max - min || 1;

  const toY = (v: number) => PAD + (1 - (v - min) / range) * (H - PAD * 2);
  const toX = (i: number) => PAD + (i / (consultas.length - 1)) * (W - PAD - 10);

  const smoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full min-w-[500px]" style={{ height: '220px' }}>
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
          const y = PAD + t * (H - PAD * 2);
          return <line key={t} x1={PAD} y1={y} x2={W - 10} y2={y} stroke="var(--color-border)" strokeWidth="1" />;
        })}

        {consultas.map((c, i) => {
          const x = toX(i);
          return <text key={c} x={x} y={H - 4} fontSize="10" fill="var(--color-text-secondary)" textAnchor="middle" fontWeight="600">{c}</text>;
        })}

        {series.map(s => {
          const pts = s.data.map((v, i) => (typeof v === 'number' ? { x: toX(i), y: toY(v) } : null)).filter(Boolean) as { x: number; y: number }[];
          if (pts.length < 2) return null;
          const linePath = smoothPath(pts);
          return (
            <g key={s.name}>
              <path d={linePath} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, j) => (
                <circle key={j} cx={p.x} cy={p.y} r="4" fill="white" stroke={s.color} strokeWidth="2.5" />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex gap-3 justify-center">
        {series.map(s => (
          <span key={s.name} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-primary)]">
            <span className="size-2 rounded-full" style={{ background: s.color }} />{s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LineChart;
