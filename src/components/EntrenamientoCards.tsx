import React from 'react';
import { Dumbbell } from 'lucide-react';
import SectionTitle from './ui/SectionTitle.tsx';
import MetricCard from './ui/MetricCard.tsx';
import ValueWithPlaceholder from './ui/ValueWithPlaceholder.tsx';
import { sumCardioSessions, countCardioDays } from '../utils/cardioDetection.ts';

export default function EntrenamientoCards({ printable, training, calendar, routines, setters }) {
  const dias = (calendar || []).filter((day) => {
    const act = (day.actividad || '').toLowerCase();
    return act && act !== 'descanso';
  }).length || '—';

  const cardioSesiones = sumCardioSessions(calendar, routines);
  const cardioDias = countCardioDays(calendar, routines);
  const cardioValue = cardioDias === 0 ? '—' : String(cardioDias);

  const volumen = (routines || []).reduce((sum, r) => {
    const ejercicios = Array.isArray(r.ejercicios) ? r.ejercicios : [];
    return sum + ejercicios.reduce((s, ej) => s + (parseInt(ej.semana1 || ej.sets || '0') || 0), 0);
  }, 0) || '—';

  return (
    <div className={printable ? "mt-4" : "mt-6"}>
      <SectionTitle icon={<Dumbbell size={16} />} subtitle="Plan de entrenamiento">Tratamiento de Entrenamiento</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <MetricCard
          label="Estrategia"
          value={<ValueWithPlaceholder value={training.estrategia} placeholder="—" />}
          color="var(--color-navy)"
          className={`!bg-[var(--color-navy)] text-white !border-transparent ${!training.estrategia ? 'opacity-60' : ''}`}
          forceWhiteText
        />
        <div className="grid grid-cols-3 gap-3 sm:col-span-4 sm:grid-cols-4">
          <MetricCard label="Días/semana" value={dias} helper="Meta semanal" color="var(--color-navy)" className={dias === '—' ? 'opacity-60' : ''} />
          <MetricCard label="Cardio" value={cardioValue} helper="Sesiones" color="var(--color-green)" className={cardioValue === '—' ? 'opacity-60' : ''} />
          <MetricCard label="Volumen" value={volumen} helper="Series totales" color="var(--color-accent)" className={volumen === '—' ? 'opacity-60' : ''} />
        </div>
      </div>
    </div>
  );
}
