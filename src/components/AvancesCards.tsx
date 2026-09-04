import React from 'react';
import { TrendingUp } from 'lucide-react';
import SectionTitle from './ui/SectionTitle.tsx';
import MetricCard from './ui/MetricCard.tsx';
import { buildMetricas, avanceGlobal, valorActual, valorAnterior } from '../utils/evolutionMetrics.ts';

export default function AvancesCards({ data, printable }) {
  const d = data || {};
  const consultas = d.evolution?.consultas || [];
  const cells = d.evolution?.cells || {};
  const METRICAS = buildMetricas(consultas, cells);

  if (!METRICAS.length) {
    return (
      <>
        <SectionTitle icon={<TrendingUp size={16} />} subtitle="Progreso del paciente">Avances</SectionTitle>
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-70">
          <TrendingUp size={32} className="text-[var(--color-text-muted)] mb-2" />
          <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Sin consultas registradas</p>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Agrega la primera consulta en Evolución para ver los avances.</p>
        </div>
      </>
    );
  }

  const peso = METRICAS[0];
  const resto = METRICAS.slice(1);

  const renderMetricCard = (m) => {
    const actualVal = valorActual(consultas, cells, m.key) || m.actualPh;
    const avanceVal = avanceGlobal(consultas, cells, m.key);
    const anteriorVal = valorAnterior(consultas, cells, m.key);
    const hasAvance = avanceVal !== null;
    const hasActual = actualVal && actualVal !== m.actualPh;
    const displayAvance = hasAvance ? (avanceVal > 0 ? `+${avanceVal}` : `${avanceVal}`) : m.avancePh;
    const isPlaceholder = displayAvance === '—';
    const avanceNum = isPlaceholder ? null : parseFloat(String(displayAvance).replace(/[^\d.-]/g, '')) || 0;
    const anteriorNum = anteriorVal !== null ? parseFloat(String(anteriorVal).replace(/[^\d.-]/g, '')) : null;
    const anteriorDisplay = anteriorNum !== null ? (m.suffix ? `${anteriorNum}${m.suffix}` : anteriorNum.toString()) : '—';
    const isEmpty = !hasAvance && !hasActual;
    const valueOpacity = isEmpty ? 'opacity-60' : '';
    const pillOpacity = isEmpty ? 'opacity-60' : '';

    return (
      <MetricCard
        key={m.label}
        label={m.label}
        value={
          <div className="flex items-end justify-center gap-2 mt-2">
            <div className="text-center">
              <p className={`text-lg font-extrabold leading-none ${m.primary || m.dark ? 'text-white/90' : 'text-[#9ca3af]'} ${valueOpacity}`}>{anteriorDisplay}</p>
              <p className={`text-[9px] mt-1 font-bold uppercase tracking-wider ${m.primary || m.dark ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>Anterior</p>
            </div>
            <span className={`text-xs font-bold pb-0.5 ${m.primary || m.dark ? 'text-white/40' : 'text-[var(--color-text-muted)]'}`}>-</span>
            <div className="text-center">
              <p className={`text-lg font-extrabold leading-none ${m.primary || m.dark ? 'text-white' : 'text-[#9ca3af]'} ${valueOpacity}`}>{actualVal}</p>
              <p className={`text-[9px] mt-1 font-bold uppercase tracking-wider ${m.primary || m.dark ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>Actual</p>
            </div>
          </div>
        }
        color={m.primary ? 'var(--color-primary)' : m.dark ? 'var(--color-navy)' : 'var(--color-navy)'}
        className={`relative ${m.primary ? '!bg-[var(--color-primary)] text-white !border-transparent' : m.dark ? '!bg-[var(--color-navy)] text-white !border-transparent' : ''} ${isEmpty ? 'opacity-60' : ''}`}
        valueClassName={m.primary || m.dark ? 'text-white' : ''}
        forceWhiteText={m.primary || m.dark}
      >
        <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${pillOpacity} ${m.primary || m.dark ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
              {isPlaceholder ? displayAvance : (avanceNum > 0 ? '↑' : avanceNum < 0 ? '↓' : '=') + (avanceNum !== 0 ? ' ' + avanceNum : '')}
            </span>
        </div>
      </MetricCard>
    );
  };

  return (
    <>
      <SectionTitle icon={<TrendingUp size={16} />} subtitle="Progreso del paciente">Avances</SectionTitle>
       <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-2">
        {renderMetricCard(peso)}
        <div className="grid grid-cols-2 gap-3 sm:col-span-4 sm:grid-cols-4">
          {resto.map(renderMetricCard)}
        </div>
      </div>
    </>
  );
}
