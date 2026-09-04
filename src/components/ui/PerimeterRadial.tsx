interface PerimeterRadialProps {
  cells: Record<string, Record<string, number | ''>>;
  firstC: string;
  lastC: string;
}

const PERIMETER_KEYS = ['cint_esc','pect_esp','cint_abd','abdomen','bicep_rel','bicep_con','cadera','muslo_alto','muslo_med','pant'];

const PERIMETER_LABELS: Record<string, string> = {
  cint_esc: 'Cuello',
  pect_esp: 'Pectoral',
  cint_abd: 'Cintura',
  abdomen: 'Abdomen',
  bicep_rel: 'Bíceps',
  bicep_con: 'Bíceps contr.',
  cadera: 'Cadera',
  muslo_alto: 'Muslo alto',
  muslo_med: 'Muslo medio',
  pant: 'Pantorrilla',
};

export default function PerimeterRadial({ cells, firstC, lastC }: PerimeterRadialProps) {
  const data = PERIMETER_KEYS.map(k => {
    const f = cells[firstC]?.[k];
    const l = cells[lastC]?.[k];
    if (typeof f !== 'number' || typeof l !== 'number') return null;
    return { key: k, label: PERIMETER_LABELS[k] || k, c1: f, actual: l, delta: l - f };
  }).filter(Boolean) as { key: string; label: string; c1: number; actual: number; delta: number }[];

  if (!data.length) return null;

  const W = 340;
  const H = 340;
  const CX = W / 2;
  const CY = H / 2;
  const RADIUS = 120;
  const maxVal = Math.max(...data.flatMap(d => [d.c1, d.actual])) * 1.15;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxVal) * RADIUS;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
      <div className="premium-section-title">
        <h3 className="text-[12px] font-bold tracking-widest text-[var(--color-text-primary)]">PERÍMETROS • C1 VS ACTUAL</h3>
      </div>
      <div className="mt-4 flex justify-center">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {[0.25, 0.5, 0.75, 1].map(t => (
            <circle key={t} cx={CX} cy={CY} r={RADIUS * t} fill="none" stroke="var(--color-border)" strokeWidth="1" />
          ))}

          {(() => {
            const pts = data.map((d, i) => getPoint(i, d.c1));
            const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
            return <path d={path} fill="rgba(46,158,112,0.12)" stroke="var(--color-green)" strokeWidth="2.5" />;
          })()}

          {(() => {
            const pts = data.map((d, i) => getPoint(i, d.actual));
            const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
            return <path d={path} fill="rgba(0,102,204,0.12)" stroke="var(--color-primary)" strokeWidth="2.5" />;
          })()}

          {data.map((d, i) => {
            const p1 = getPoint(i, d.c1);
            const p2 = getPoint(i, d.actual);
            const mid = getPoint(i, maxVal + 18);
            const isImprovement = d.delta < 0;
            return (
              <g key={d.key}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="var(--color-text-secondary)" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
                <circle cx={p1.x} cy={p1.y} r="4" fill="var(--color-green)" />
                <circle cx={p2.x} cy={p2.y} r="4" fill="var(--color-primary)" />
                <text x={p2.x + 6} y={p2.y - 6} fontSize="8" fontWeight="700" fill={isImprovement ? 'var(--color-green)' : 'var(--color-danger)'}>
                  {d.delta > 0 ? '+' : ''}{d.delta}
                </text>
                <text x={mid.x} y={mid.y} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-text-secondary)">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-center gap-5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-primary)]">
          <span className="size-2 rounded-full bg-[var(--color-green)]" /> C1
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-text-primary)]">
          <span className="size-2 rounded-full bg-[var(--color-primary)]" /> Actual
        </span>
      </div>
    </div>
  );
}
