import React from 'react';
import { Utensils } from 'lucide-react';
import SectionTitle from './ui/SectionTitle.tsx';
import MetricCard from './ui/MetricCard.tsx';
import ValueWithPlaceholder from './ui/ValueWithPlaceholder.tsx';

export default function NutricionCards({ printable, nutrition, effectiveKcal, effectiveProte, effectiveCarbs, effectiveGrasas, protePct, carbsPct, grasasPct }) {
  return (
    <div className={printable ? "mt-4" : "mt-6"}>
      <SectionTitle icon={<Utensils size={16} />} subtitle="Plan nutricional">Tratamiento Nutricional</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <MetricCard
          label="Estrategia"
          value={<ValueWithPlaceholder value={nutrition.estrategia} placeholder="—" />}
          color="var(--color-green)"
          className={`!bg-[var(--color-green)] text-white !border-transparent ${!nutrition.estrategia ? 'opacity-60' : ''}`}
          valueClassName={printable ? "text-sm" : "text-lg"}
          forceWhiteText
        />
        <div className="grid grid-cols-4 gap-3 sm:col-span-4">
          <MetricCard
            label="KCAL"
            value={<ValueWithPlaceholder value={effectiveKcal} placeholder="—" />}
            helper="Meta Diaria"
            color="var(--color-navy)"
            className={!effectiveKcal ? 'opacity-60' : ''}
          />
          {[
            ["Proteína (g)", effectiveProte, protePct, "var(--color-primary)"],
            ["Carbohidratos (g)", effectiveCarbs, carbsPct, "var(--color-green)"],
            ["Grasas (g)", effectiveGrasas, grasasPct, "var(--color-accent)"],
          ].map(([l, k, pk, macroColor], idx) => (
            <MetricCard
              key={l}
              label={l}
              value={
                <div className="flex flex-col items-center">
                  <span className={printable ? "text-sm font-extrabold leading-none" : "text-xl font-extrabold leading-none"} style={{ color: k ? macroColor : '#9ca3af' }}>
                    {k || '—'}
                  </span>
                  <span className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: macroColor, opacity: k ? 0.65 : 0.4 }}>
                    {pk}%
                  </span>
                </div>
              }
              color={macroColor}
              valueClassName={printable ? "text-sm" : "text-xl"}
              className={`text-center ${!k ? 'opacity-60' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
