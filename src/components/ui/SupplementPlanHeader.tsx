import React from 'react';

export interface SupplementPlanHeaderProps {
  estrategia?: string;
  onEstrategiaChange?: (value: string) => void;
  totalSuplementos?: number | string;
}

export default function SupplementPlanHeader({ estrategia, onEstrategiaChange, totalSuplementos }: SupplementPlanHeaderProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
      <div className="nutrition-strategy-card">
        <span className="typo-card-label-white">Estrategia</span>
        {onEstrategiaChange ? (
          <input
            type="text"
            value={estrategia || ''}
            onChange={(e) => onEstrategiaChange(e.target.value)}
            placeholder="Ej: Proteína + Creatina básica"
            className="mt-1 w-full bg-transparent outline-none text-white text-sm font-bold"
          />
        ) : (
          <p className="mt-1 text-sm font-bold text-white">{estrategia || '—'}</p>
        )}
        <p className="text-white/80 mt-1">Plan de suplementación</p>
      </div>
      <div className="nutrition-metric-card text-center">
        <span className="nutrition-metric-card__label">Suplementos</span>
        <p className="nutrition-metric-card__value">{totalSuplementos || '—'}</p>
        <p className="text-[10px] text-gray-400 mt-1">Activos</p>
      </div>
    </div>
  );
}
