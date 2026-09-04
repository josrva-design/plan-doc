import { PLIEGUES_KEYS } from '../EvolutionConstants.ts';

interface FoldsAnalysisProps {
  cells: Record<string, Record<string, number | ''>>;
  firstC: string;
  lastC: string;
}

const FOLDS_LABELS: Record<string, string> = {
  subesc: 'Subescapular',
  triceps: 'Tríceps',
  biceps_p: 'Bíceps',
  abdominal_p: 'Abdominal',
  supraesp: 'Supraespinal',
  supraili: 'Suprailiaco',
  muslo_p: 'Muslo',
  pant_med: 'Pantorrilla',
};

export default function FoldsAnalysis({ cells, firstC, lastC }: FoldsAnalysisProps) {
  const folds = PLIEGUES_KEYS.map(k => {
    const f = cells[firstC]?.[k];
    const l = cells[lastC]?.[k];
    if (typeof f !== 'number' || typeof l !== 'number') return null;
    return { key: k, label: FOLDS_LABELS[k] || k, c1: f, actual: l, delta: l - f };
  }).filter(Boolean) as { key: string; label: string; c1: number; actual: number; delta: number }[];

  if (!folds.length) return null;

  const maxVal = Math.max(...folds.flatMap(f => [f.c1, f.actual])) * 1.15;
  const barWidth = 100 / (folds.length * 2);

  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
      <div className="premium-section-title">
        <h3 className="text-[12px] font-bold tracking-widest text-[var(--color-text-primary)]">PLIEGUES • C1 VS ACTUAL</h3>
      </div>
      <div className="mt-4">
        <div className="relative h-[140px]">
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <div
              key={t}
              className="absolute left-0 right-0 border-t border-[var(--color-border)]"
              style={{ top: `${t * 100}%` }}
            />
          ))}
          <div className="absolute inset-0 flex items-end justify-around px-2">
            {folds.map((f) => (
              <div key={f.key} className="flex flex-col items-center gap-1" style={{ width: `${barWidth}%` }}>
                <span className={`text-[8px] font-bold ${f.delta < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {f.delta > 0 ? '+' : ''}{f.delta}
                </span>
                <div className="flex gap-0.5 items-end h-[110px]">
                  <div
                    className="w-[12px] rounded-t-sm bg-[var(--color-green)]"
                    style={{ height: `${(f.c1 / maxVal) * 100}%` }}
                  />
                  <div
                    className="w-[12px] rounded-t-sm bg-[var(--color-primary)]"
                    style={{ height: `${(f.actual / maxVal) * 100}%` }}
                  />
                </div>
                <span className="text-[8px] font-medium text-[var(--color-text-secondary)] text-center leading-tight mt-1">
                  {f.label.length > 8 ? f.label.slice(0, 8) + '…' : f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-text-primary)]">
          <span className="size-2 rounded-full bg-[var(--color-green)]" /> C1
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--color-text-primary)]">
          <span className="size-2 rounded-full bg-[var(--color-primary)]" /> Actual
        </span>
      </div>
    </div>
  );
}
