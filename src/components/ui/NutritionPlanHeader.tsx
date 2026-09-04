import React from 'react';

export interface NutritionPlanHeaderProps {
  estrategia?: string;
  onEstrategiaChange?: (value: string) => void;
  totalKcal?: number | string;
  totalMacros?: { p?: number | string; c?: number | string; g?: number | string };
  macroPercentages?: { p?: number | string; c?: number | string; g?: number | string };
}

export default function NutritionPlanHeader({ estrategia, onEstrategiaChange, totalKcal, totalMacros, macroPercentages }: NutritionPlanHeaderProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <div className="bg-[var(--color-green)] border border-transparent rounded-2xl p-4 flex flex-col justify-between">
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/70 block mb-1">Estrategia</p>
        {onEstrategiaChange ? (
          <input
            type="text"
            value={estrategia || ''}
            onChange={(e) => onEstrategiaChange(e.target.value)}
            placeholder="Mantenimiento"
            className="mt-1 w-full bg-transparent outline-none text-white text-sm font-bold leading-tight"
          />
        ) : (
          <p className="mt-1 text-sm font-bold text-white leading-tight">{estrategia || '—'}</p>
        )}
        <p className="text-white/80 text-[10px] mt-1">Plan nutricional</p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] block mb-1">KCAL</span>
        <p className="text-xl font-extrabold leading-none mt-1 text-[var(--color-navy)]">{totalKcal || '—'}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Total comidas</p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] block mb-1">Proteína (g)</span>
        <p className="text-xl font-extrabold leading-none mt-1 text-[var(--color-primary)]">{totalMacros?.p || '—'}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{macroPercentages?.p ?? '—'}%</p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] block mb-1">Carbohidratos (g)</span>
        <p className="text-xl font-extrabold leading-none mt-1 text-[var(--color-green)]">{totalMacros?.c || '—'}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{macroPercentages?.c ?? '—'}%</p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] block mb-1">Grasas (g)</span>
        <p className="text-xl font-extrabold leading-none mt-1 text-[var(--color-accent)]">{totalMacros?.g || '—'}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{macroPercentages?.g ?? '—'}%</p>
      </div>
    </div>
  );
}
