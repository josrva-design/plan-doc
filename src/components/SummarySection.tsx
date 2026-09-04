import React, { useState, useMemo } from 'react';
import { LayoutDashboard, User, TrendingUp, Target, Utensils, Dumbbell, MessageCircle, ClipboardList, Flag } from 'lucide-react';
import PageHeader from './ui/PageHeader.tsx';
import SectionTitle from './ui/SectionTitle.tsx';
import AvancesCards from './AvancesCards.tsx';
import AdherenciaCards from './AdherenciaCards.tsx';
import NutricionCards from './NutricionCards.tsx';
import EntrenamientoCards from './EntrenamientoCards.tsx';
import MetricCard from './ui/MetricCard.tsx';
import ValueWithPlaceholder from './ui/ValueWithPlaceholder.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import { getTotalKcalFromMeals, getTotalMacrosFromMeals } from '../utils/nutritionHelpers.ts';
import { runAllSafetyChecks } from '../utils/safetyRules.ts';
import { isConsultaVencida } from '../utils/evolutionHelpers.ts';
import { toInputDate, fromInputDate, getFechaActual, calcularEdad } from '../utils/summaryHelpers.ts';
import { useSummaryLists } from '../hooks/useSummaryLists.tsx';

const formatFechaCorta = (fecha: string): string => {
  if (!fecha) return '—';
  const parts = fecha.split('/');
  if (parts.length !== 3) return fecha;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return fecha;
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${day} ${meses[month - 1]} ${year}`;
};

export default function SummarySection({ printable = false }) {
  const { data, setters } = useAppContext();
  const d = data || {};

   const person = d.person || {};
   const stats = d.stats || {};
   const nutrition = d.nutrition || {};
   const training = d.training || {};
   const meals = d.meals || [];
   const edadCalculada = calcularEdad(person.fechaNacimiento || '', d.fechaConsulta || '');

  const { retroItems, setRetroItems, diagItems, setDiagItems, objItems, setObjItems, renderList, RETRO_PLACEHOLDER, DIAG_PLACEHOLDER, OBJ_PLACEHOLDER } = useSummaryLists({
    feedback: d.feedback,
    diagnosis: d.diagnosis,
    objectives: d.objectives,
    onFeedbackChange: (obj) => setters.setFeedback(obj),
    onDiagnosisChange: (obj) => setters.setDiagnosis(obj),
    onObjectivesChange: (obj) => setters.setObjectives(obj),
  });

  const safety = useMemo(() => runAllSafetyChecks(data), [data]);

  const handleFechaConsultaChange = (e) => {
    const value = fromInputDate(e.target.value);
    setters.setFechaConsulta(value);
  };

  const handleProximaConsultaChange = (e) => {
    const value = fromInputDate(e.target.value);
    setters.setProximaConsulta(value);
  };

  const fechaConsulta = d.fechaConsulta || '';
  const proximaConsulta = d.proximaConsulta || '';
  const proximaConsultaVencida = isConsultaVencida(fechaConsulta);
  const fechaActual = getFechaActual(fechaConsulta);

  const [showDatePicker, setShowDatePicker] = useState<'consulta' | 'proxima' | null>(null);

  const effectiveKcal = Number(nutrition.kcal) || getTotalKcalFromMeals(meals) || 0;
  const totalMacros = getTotalMacrosFromMeals(meals);
  const effectiveProte = Number(nutrition.prot) || totalMacros.p || 0;
  const effectiveCarbs = Number(nutrition.carbs) || totalMacros.c || 0;
  const effectiveGrasas = Number(nutrition.grasas) || totalMacros.g || 0;

  const protePct = Math.round((effectiveProte * 4 / (effectiveProte * 4 + effectiveCarbs * 4 + effectiveGrasas * 9 || 1)) * 100) || 0;
  const carbsPct = Math.round((effectiveCarbs * 4 / (effectiveProte * 4 + effectiveCarbs * 4 + effectiveGrasas * 9 || 1)) * 100) || 0;
  const grasasPct = Math.round((effectiveGrasas * 9 / (effectiveProte * 4 + effectiveCarbs * 4 + effectiveGrasas * 9 || 1)) * 100) || 0;

  return (
    <div className={printable ? "w-full bg-white text-[var(--color-navy)] font-[Inter] p-4" : "w-full bg-transparent text-[var(--color-navy)] font-[Inter]"}>
      {!printable && safety.alerts.length > 0 && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 font-bold text-sm">Alertas de seguridad</span>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{safety.alerts.length}</span>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {safety.alerts.slice(0, 5).map((alert, i) => (
              <div key={i} className={`text-xs flex items-start gap-2 ${alert.level === 'critical' ? 'text-red-800' : alert.level === 'high' ? 'text-orange-800' : 'text-yellow-800'}`}>
                <span className="mt-0.5 font-bold">[{alert.level.toUpperCase()}]</span>
                <span>{alert.message}</span>
              </div>
            ))}
            {safety.alerts.length > 5 && (
              <p className="text-xs text-red-600">...y {safety.alerts.length - 5} alertas más. Revisá el perfil para ver todas.</p>
            )}
          </div>
        </div>
      )}

      <div>
        <PageHeader title="Resumen del Plan" subtitle="Visión general del estado actual del paciente." icon={<LayoutDashboard size={24} className="text-[var(--color-primary)]" />} />

        {/* Header: Paciente + Fechas en una línea */}
        <div className="flex items-end justify-between gap-4">
          {/* Nombre del paciente */}
          <div className="flex-1 min-w-0">
            <p className="typo-label font-bold tracking-widest uppercase text-[10px] mb-1">Paciente</p>
            <p className="text-xl font-extrabold text-[var(--color-navy)] leading-tight truncate">
              <ValueWithPlaceholder value={person.nombre} placeholder="Sin nombre" />
            </p>
          </div>

          {/* Fechas */}
          <div className="flex items-end gap-4 shrink-0">
            <div className="text-left">
              <p className="text-[9px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Consulta</p>
              {!printable ? (
                <div className="relative">
                  {showDatePicker === 'consulta' ? (
                    <input
                      type="date"
                      value={toInputDate(fechaConsulta)}
                      onChange={(e) => {
                        handleFechaConsultaChange(e);
                        setShowDatePicker(null);
                      }}
                      onBlur={() => setShowDatePicker(null)}
                      className="text-lg font-bold text-[var(--color-navy)] bg-transparent border-b border-[var(--color-primary)] outline-none w-[140px]"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDatePicker('consulta')}
                      className="text-lg font-bold text-[var(--color-navy)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                    >
                      {fechaConsulta ? formatFechaCorta(fechaConsulta) : '—'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-lg font-bold text-[var(--color-navy)]">{fechaActual}</p>
              )}
            </div>
            <div className="w-px h-8 bg-[var(--color-border)]"></div>
            <div className="text-left">
              <p className="text-[9px] font-bold tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Próxima</p>
              {!printable ? (
                <div className="relative">
                  {showDatePicker === 'proxima' ? (
                    <input
                      type="date"
                      value={toInputDate(proximaConsulta)}
                      onChange={(e) => {
                        handleProximaConsultaChange(e);
                        setShowDatePicker(null);
                      }}
                      onBlur={() => setShowDatePicker(null)}
                      className="text-lg font-bold text-[var(--color-primary)] bg-transparent border-b border-[var(--color-primary)] outline-none w-[140px]"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDatePicker('proxima')}
                      className="text-lg font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {proximaConsulta ? formatFechaCorta(proximaConsulta) : '—'}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-lg font-bold text-[var(--color-primary)]">{proximaConsulta ? formatFechaCorta(proximaConsulta) : '—'}</p>
              )}
            </div>
          </div>
        </div>
        {!printable && proximaConsultaVencida && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Consulta vencida</p>
            <p className="text-sm text-red-600 mt-1">La próxima actualización programada ya pasó. Actualiza la fecha de consulta o programá una nueva.</p>
          </div>
        )}
      </div>

      <div className={printable ? "mt-3" : "mt-6"}>
        <SectionTitle icon={<User size={16} />} subtitle="Datos básicos del paciente">Perfil</SectionTitle>
        <div className={printable ? "grid grid-cols-2 sm:grid-cols-4 gap-3" : "grid grid-cols-2 sm:grid-cols-4 gap-3"}>
      {[
             ["Edad", person.edad || edadCalculada, "—"],
             ["Contacto", person.celular, "—"],
             ["País/Región", person.pais, "—"],
             ["Act. Física 1", person.act1, "—"],
             ["Act. Física 2", person.act2, "—"],
             ["Alergias", person.alergias, "—"],
             ["Condición Méd.", person.condicionMedica, "—"],
           ].map(([label, value, refVal])=>(
               <MetricCard
                 key={label}
                 label={label}
                 value={<ValueWithPlaceholder value={value} placeholder={refVal} />}
                 color="var(--color-navy)"
                 className={!value || value === '—' ? 'opacity-60' : ''}
               />
           )          )}
        </div>
      </div>

      <div className={printable ? "mt-6" : "mt-8"}>
        <AvancesCards data={data} printable={printable} />
      </div>
      <div className={printable ? "mt-3" : "mt-4"}>
        <AdherenciaCards stats={stats} printable={printable} />
      </div>

      <NutricionCards
        printable={printable}
        nutrition={nutrition}
        effectiveKcal={effectiveKcal}
        effectiveProte={effectiveProte}
        effectiveCarbs={effectiveCarbs}
        effectiveGrasas={effectiveGrasas}
        protePct={protePct}
        carbsPct={carbsPct}
        grasasPct={grasasPct}
      />

      <EntrenamientoCards
        printable={printable}
        training={training}
        calendar={d.calendar}
        routines={d.routines}
        setters={setters}
      />

      <div className={printable ? "mt-4" : "mt-6"}>
        <SectionTitle icon={<MessageCircle size={16} />} subtitle="Comentarios al paciente">Retroalimentación</SectionTitle>
        {renderList(retroItems, setRetroItems, RETRO_PLACEHOLDER)}
      </div>
      <div className={printable ? "mt-4" : "mt-6"}>
        <SectionTitle icon={<ClipboardList size={16} />} subtitle="Evaluación clínica">Diagnóstico</SectionTitle>
        {renderList(diagItems, setDiagItems, DIAG_PLACEHOLDER)}
      </div>
      <div className={printable ? "mt-4" : "mt-6"}>
        <SectionTitle icon={<Flag size={16} />} subtitle="Plan a seguir">Objetivos y plan a seguir</SectionTitle>
        {renderList(objItems, setObjItems, OBJ_PLACEHOLDER)}
      </div>

      {!printable && (() => {
        const kcalDeclaradas = Number(effectiveKcal) || 0;
        const kcalCalculadas = (effectiveProte || 0) * 4 + (effectiveCarbs || 0) * 4 + (effectiveGrasas || 0) * 9;
        const diff = kcalDeclaradas ? Math.abs(kcalCalculadas - kcalDeclaradas) / kcalDeclaradas : 0;
        const hayIncoherencia = kcalDeclaradas > 0 && diff > 0.05;
        return hayIncoherencia ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Incoherencia nutricional</p>
            <p className="text-sm text-red-600 mt-1">
              Las kcal declaradas ({kcalDeclaradas}) no coinciden con los macros ingresados ({Math.round(kcalCalculadas)} kcal).
              Diferencia: {Math.round(diff * 100)}%.
            </p>
          </div>
        ) : null;
      })()}
    </div>
  );
}