import React from 'react';
import InBodyBar from './InBodyBar.tsx';

export interface InBodyAnalysisProps {
  cells: Record<string, Record<string, number | ''>>;
  lastC: string;
  avanceGlobal: (key: string) => number | null;
  firstC: string;
  inBodyConfig?: import('../core/types').InBodyConfig;
}

export default function InBodyAnalysis({ cells, lastC, avanceGlobal, firstC, inBodyConfig }: InBodyAnalysisProps) {
  const peso = cells[lastC]?.peso ?? 0;
  const muscular = cells[lastC]?.muscular ?? 0;
  const grasaPct = cells[lastC]?.grasa_pct ?? 0;
  const avPeso = avanceGlobal('peso');

  let objetivo = 'Registra C2 para ver proyección.';
  if (avPeso !== null) {
    if (avPeso < 0) objetivo = `Vas -${Math.abs(avPeso).toFixed(1)}kg desde ${firstC}. Enfócate en mantener músculo alto.`;
    else objetivo = 'Peso en aumento, revisa adherencia a nutrición.';
  }

  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5 space-y-5">
      <div className="premium-section-title">
        <h3 className="text-[12px] font-bold tracking-widest text-[var(--color-text-primary)]">ANÁLISIS INBODY</h3>
      </div>
      <InBodyBar label="Peso" value={peso} min={inBodyConfig?.peso?.min ?? 40} max={inBodyConfig?.peso?.max ?? 120} idealMin={inBodyConfig?.peso?.idealMin} idealMax={inBodyConfig?.peso?.idealMax} />
      <InBodyBar label="Masa Muscular" value={muscular} min={inBodyConfig?.muscular?.min ?? 20} max={inBodyConfig?.muscular?.max ?? 60} idealMin={inBodyConfig?.muscular?.idealMin} idealMax={inBodyConfig?.muscular?.idealMax} />
      <InBodyBar label="Grasa Corporal %" value={grasaPct} min={inBodyConfig?.grasaPct?.min ?? 5} max={inBodyConfig?.grasaPct?.max ?? 40} idealMin={inBodyConfig?.grasaPct?.idealMin} idealMax={inBodyConfig?.grasaPct?.idealMax} />
      <div className="rounded-xl bg-[var(--color-navy)] p-3 text-white">
        <p className="text-[11px] font-bold tracking-wide">OBJETIVO</p>
        <p className="mt-1 text-[12px] leading-snug text-zinc-300">{objetivo}</p>
      </div>
    </div>
  );
}
