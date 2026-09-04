import React from 'react';
import Sparkline from './Sparkline.tsx';

export interface EvolutionCard {
  label: string;
  key: string;
  unit: string;
  color: string;
  goal: 'up' | 'down';
}

export interface EvolutionSummaryCardsProps {
  cards: EvolutionCard[];
  numericSeries: (key: string) => number[];
  avanceGlobal: (key: string) => number | null;
  firstC: string;
}

export default function EvolutionSummaryCards({ cards, numericSeries, avanceGlobal, firstC }: EvolutionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const vals = numericSeries(card.key);
        const curr = vals[vals.length - 1];
        const av = avanceGlobal(card.key);
        const isGood = av !== null && ((card.goal === 'up' && av > 0) || (card.goal === 'down' && av < 0));
        return (
          <div key={card.key} className="rounded-[20px] border border-[var(--color-border)] bg-white p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-[var(--color-text-secondary)]">{card.label}</p>
                <p className="mt-1 text-2xl font-black tracking-tight text-[var(--color-text-primary)]">
                  {curr != null ? `${curr} ${card.unit}` : '-'}
                </p>
                {av !== null && (
                  <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ${isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {av > 0 ? '+' : ''}{av.toFixed(1)} {av > 0 ? '↑' : '↓'} vs {firstC}
                  </span>
                )}
              </div>
              <div className="opacity-80"><Sparkline values={vals} color={card.color} /></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
