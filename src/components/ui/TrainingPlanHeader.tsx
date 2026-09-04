import React from 'react';

export interface TrainingPlanHeaderProps {
  estrategia?: string;
  onEstrategiaChange?: (value: string) => void;
  dias?: number | string;
  cardio?: number | string;
  volumen?: number | string;
}

export default function TrainingPlanHeader({ estrategia, onEstrategiaChange, dias, cardio, volumen }: TrainingPlanHeaderProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <div className="bg-[var(--color-navy)] border border-transparent rounded-2xl p-4 flex flex-col justify-between">
        <p className="text-[10px] font-bold tracking-widest uppercase text-white/70 block mb-1">Estrategia</p>
        {onEstrategiaChange ? (
          <input
            type="text"
            value={estrategia || ''}
            onChange={(e) => onEstrategiaChange(e.target.value)}
            placeholder="Split muscular 4 días"
            className="mt-0 w-full bg-transparent outline-none text-white text-sm font-bold leading-tight py-0 px-0 h-5"
          />
        ) : (
          <p className="mt-0 text-sm font-bold text-white leading-tight">{estrategia || '—'}</p>
        )}
        <p className="text-white/80 text-[10px] mt-1">Plan deportivo</p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] block mb-1">Días/semana</span>
        <p className="text-xl font-extrabold leading-none mt-1 text-[var(--color-navy)]">{dias || '—'}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Meta semanal</p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] block mb-1">Cardio</span>
        <p className="text-xl font-extrabold leading-none mt-1 text-[var(--color-green)]">{cardio || '—'}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Sesiones/semana</p>
      </div>
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 flex flex-col items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] block mb-1">Volumen</span>
        <p className="text-xl font-extrabold leading-none mt-1 text-[var(--color-accent)]">{volumen || '—'}</p>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Series totales</p>
      </div>
    </div>
  );
}
