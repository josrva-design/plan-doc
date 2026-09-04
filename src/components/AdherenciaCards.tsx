import React from 'react';
import { Target } from 'lucide-react';
import SectionTitle from './ui/SectionTitle.tsx';
import AdherenciaDonutCard from './AdherenciaDonutCard.tsx';

const fmtPct = (raw, fallback = '—') => {
  const n = typeof raw === 'number' ? raw : parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return `${n}%`;
};

export default function AdherenciaCards({ stats, printable }) {
  return (
    <>
      <SectionTitle icon={<Target size={16} />} subtitle="Cumplimiento del plan">Adherencia al plan</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-2">
        <AdherenciaDonutCard
          label="General"
          sublabel="Plan completo"
          value={stats.adherencia}
          color="var(--color-green)"
          size={56}
          strokeWidth={5}
          printable={printable}
          isGeneral
        />
        <div className="grid grid-cols-4 gap-3 sm:col-span-4">
          {[
            { label: 'Nutrición', value: stats.nutricion, color: 'var(--color-primary)' },
            { label: 'Entrenamiento', value: stats.entreno, color: 'var(--color-navy)' },
            { label: 'Cardio', value: stats.cardio, color: 'var(--color-green)' },
            { label: 'Descanso', value: stats.descanso, color: 'var(--color-accent)' },
          ].map((item) => (
            <AdherenciaDonutCard
              key={item.label}
              label={item.label}
              sublabel={fmtPct(item.value)}
              value={item.value}
              color={item.color}
              printable={printable}
            />
          ))}
        </div>
      </div>
    </>
  );
}
