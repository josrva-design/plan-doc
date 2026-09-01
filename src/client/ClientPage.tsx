import React, { useState, useMemo } from 'react';
import { Flame, Dumbbell, Clock, ChevronRight, ChevronDown, Info, BookOpen, Apple, Pill as PillIcon, X, Check, GlassWater, Scale, Ruler, CookingPot, Plus, Minus, AlertTriangle } from 'lucide-react';
import { guideSections, glossaryTerms } from '../data/guideContent.js';
import type { ClientPlan, MealClient, DayRoutine, SupplementClient, PatientFase, PatientBloque, PatientEjercicio, BloqueTipo } from '../core/types';

const IconFootprints = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 2.5-2.5 4.5-5 4.5S0 8 0 5.5" />
    <path d="M20 20v-2.38c0-2.12-1.03-3.12-1-5.62.03-2.72 1.49-6 4.5-6C26.37 6 27 7.8 27 9.5c0 2.5-2.5 4.5-5 4.5s-5-2-5-4.5" />
  </svg>
);

const C = {
  primary: 'var(--color-primary)',
  deep: 'var(--color-navy)',
  green: 'var(--color-green)',
  orange: 'var(--color-orange)',
  gray: 'var(--color-bg-subtle)',
  white: 'var(--color-white)',
  bg: 'var(--color-bg-base)',
};

const DAYS = [
  { key: 'monday', label: 'LUN', full: 'Lunes' },
  { key: 'tuesday', label: 'MAR', full: 'Martes' },
  { key: 'wednesday', label: 'MIÉ', full: 'Miércoles' },
  { key: 'thursday', label: 'JUE', full: 'Jueves' },
  { key: 'friday', label: 'VIE', full: 'Viernes' },
  { key: 'saturday', label: 'SÁB', full: 'Sábado' },
  { key: 'sunday', label: 'DOM', full: 'Domingo' },
];

const HORARIO_BADGE: Record<string, { bg: string; color: string }> = {
  'MAÑANA': { bg: 'bg-[var(--color-primary)]/10', color: 'text-[var(--color-primary)]' },
  'TARDE': { bg: 'bg-[var(--color-orange)]/10', color: 'text-[var(--color-orange)]' },
  'NOCHE': { bg: 'bg-[var(--color-navy)]/10', color: 'text-[var(--color-navy)]' },
  'POST ENTRENO': { bg: 'bg-[var(--color-green)]/10', color: 'text-[var(--color-green)]' },
};

const getFoodMacros = (f: any) => {
  if (f?.macros) return f.macros;
  return { proteinas: f?.p || 0, carbos: f?.c || 0, grasas: f?.g || 0 };
};

const getHorarioBadge = (horario: string) => {
  const key = horario.toUpperCase();
  return HORARIO_BADGE[key] || { bg: 'bg-[var(--color-bg-subtle)]', color: 'text-[var(--color-text-secondary)]' };
};

const inferFoodDot = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('pollo') || n.includes('res') || n.includes('pavo') || n.includes('salmón') || n.includes('pescado')) return 'bg-[var(--color-navy)]';
  if (n.includes('avena') || n.includes('arroz') || n.includes('pasta') || n.includes('pan') || n.includes('tortilla')) return 'bg-[var(--color-blue)]';
  if (n.includes('aguacate') || n.includes('aceite') || n.includes('almendra') || n.includes('nueces')) return 'bg-[var(--color-orange)]';
  if (n.includes('yogur') || n.includes('leche') || n.includes('huevo') || n.includes('whey')) return 'bg-[var(--color-green)]';
  return 'bg-[var(--color-gray-medium)]';
};

const formatearDisplay = (p: string): string => {
  if (!p || p === '-' || p === '—') return '—';
  const parts = p.split(/\s*[×x]\s*/).filter(Boolean);
  if (parts.length === 0) return '—';

  if (parts.some((part) => /MIN/i.test(part))) {
    const timePart = parts.find((part) => /MIN/i.test(part));
    return timePart || parts[0];
  }

  const reps = parts[1] || parts[parts.length - 1];
  const pausa = parts[2] || parts.find((part) => /seg|min/i.test(part));

  let r = '';
  if (reps) r += `${reps} reps`;
  if (pausa) r += ` • ${pausa}`;
  return r || p;
};

const BLOQUE_COLORS: Record<string, string> = {
  BISERIE: 'text-[var(--color-orange)]',
  TRISERIE: 'text-[var(--color-orange)]',
  'SERIE SIMPLE': 'text-[var(--color-navy)]',
  'ELIGE 1 OPCIÓN': 'text-[var(--color-primary)]',
};

const getTecnicaColor = (tecnica: string): string => {
  const t = tecnica.toUpperCase();
  if (t.includes('DROPSET')) return 'text-[var(--color-orange)]';
  if (t.includes('TOP SET')) return 'text-[var(--color-primary)]';
  if (t.includes('BACK-OFF')) return 'text-[var(--color-green)]';
  if (t.includes('REST-PAUSE')) return 'text-[var(--color-danger)]';
  if (t.includes('AL FALLO') || t.includes('FALLO')) return 'text-[var(--color-danger)]';
  if (t.includes('MYO-REPS')) return 'text-[var(--color-navy)]';
  if (t === 'BISERIE' || t === 'TRISERIE') return 'text-[var(--color-orange)]';
  if (t === 'CIRCUITO') return 'text-[var(--color-green)]';
  return 'text-[var(--color-navy)]';
};

const roundDelta = (n: number): number => Math.round(n * 10) / 10;

type FoodCategoria = 'PROTEÍNA' | 'CARBOHIDRATO' | 'GRASA' | 'OTROS';

const inferCategoria = (f: any): FoodCategoria => {
  const m = getFoodMacros(f);
  if (m.proteinas > 0 && m.proteinas >= m.carbos && m.proteinas >= m.grasas) return 'PROTEÍNA';
  if (m.carbos > 0 && m.carbos > m.proteinas && m.carbos >= m.grasas) return 'CARBOHIDRATO';
  if (m.grasas > 0 && m.grasas > m.proteinas && m.grasas > m.carbos) return 'GRASA';
  return 'OTROS';
};

const CATEGORIA_CONFIG: Record<FoodCategoria, { label: string; color: string }> = {
  PROTEÍNA: { label: 'PROTEÍNA', color: 'bg-[var(--color-navy)] text-white' },
  CARBOHIDRATO: { label: 'CARBOHIDRATO', color: 'bg-[var(--color-blue)] text-white' },
  GRASA: { label: 'GRASA', color: 'bg-[var(--color-orange)] text-white' },
  OTROS: { label: 'OTROS', color: 'bg-[var(--gray-medium)] text-white' },
};

const renderFoodLine = (f: any, idx: number) => (
  <div key={idx} className="flex items-center gap-2 flex-1 min-w-0 text-left">
    <span className="cp-body font-semibold text-[var(--color-navy)]">{f.grams} {f.unit ? f.unit : 'g'}</span>
    <span className="cp-secondary !text-black/40"> {f.name}</span>
  </div>
);

const renderFoodsArmar = (foods: any[]) => {
  const groups: Record<string, any[]> = {};
  const order: FoodCategoria[] = [];
  foods.forEach((f) => {
    const cat = inferCategoria(f);
    if (!groups[cat]) { groups[cat] = []; order.push(cat); }
    groups[cat].push(f);
  });

  const catOrder: FoodCategoria[] = ['PROTEÍNA', 'CARBOHIDRATO', 'GRASA', 'OTROS'];
  const sortedCats = catOrder.filter(c => groups[c]?.length);

  return (
    <div className="space-y-3">
      {sortedCats.map((cat) => {
        const cfg = CATEGORIA_CONFIG[cat];
        return (
          <div key={cat} className="rounded-xl border border-black/5 bg-[var(--color-bg-subtle)]/50 p-3">
            <p className={`cp-caption font-black uppercase tracking-[0.08em] mb-1.5 px-2 py-0.5 rounded-full inline-block ${cfg.color}`}>{cfg.label}</p>
            <div className="space-y-1">
              {groups[cat].map((f, i) => renderFoodLine(f, i))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const renderFoodsFijo = (foods: any[]) => (
  <div className="space-y-1.5 pl-1">
    {foods.map((f, i) => renderFoodLine(f, i))}
  </div>
);

const formatIndicacionDisplay = (indicacion: string): string => {
  if (!indicacion) return '';
  let r = indicacion;
  r = r.replace(/\s*x\s*[^\s]+(?:\s*-\s*[^\s]+)?\s*reps?\s*c\/u\s*/i, '');
  r = r.replace(/(\d+(?:\.\d+)?)s\b/, '$1 seg');
  r = r.replace(/(\d+(?:\.\d+)?)m\b/, '$1 min');
  r = r.replace(/(\bseg\b|\bmin\b)\s*entre rondas/, '$1 descanso entre rondas');
  return r;
};

const formatEjercicioDisplay = (p: string, bloqueTipo: string): string => {
  if (!p || p === '-') return '—';
  const isMulti = bloqueTipo === 'BISERIE' || bloqueTipo === 'TRISERIE';

  const isTimeBased = !/reps?\s*(c\/u)?/i.test(p);
  const seriesMatch = p.match(/(\d+)\s+series/i) || p.match(/(\d+)x\s/i);
  const repsMatch = p.match(/(\d+\s*-\s*\d+|\d+)\s*reps?/i);
  const timeMatch = p.match(/•?\s*(\d+(?:\.\d+)?)\s*(MIN|min|seg|s)\b/i);
  const descansoMatch = p.match(/•\s*(\d+(?:\.\d+)?)\s*(s|seg|min|m)/i);
  const rirMatch = p.match(/RIR\s*(\d+)/i);

  if (isTimeBased) {
    if (isMulti) {
      let r = '';
      if (repsMatch) r = `${repsMatch[1]} reps`;
      if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
      return r || p;
    }
    let r = '';
    if (seriesMatch) r += `${seriesMatch[1]}x`;
    if (timeMatch) {
      const unit = timeMatch[2].toLowerCase() === 'min' ? 'MIN' : timeMatch[2];
      r += ` ${timeMatch[1]}${unit === 'seg' || unit === 's' ? 's' : unit}`;
    }
    const descMatch = descansoMatch;
    if (descMatch) r += ` • ${descMatch[1]} seg descanso`;
    if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
    return r || p;
  }

  if (isMulti) {
    let r = '';
    if (repsMatch) r = `${repsMatch[1]} reps`;
    if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
    return r || p;
  }

  let r = '';
  if (seriesMatch) r += `${seriesMatch[1]} series, `;
  if (repsMatch) r += `${repsMatch[1]} reps`;
  if (descansoMatch) r += ` • ${descansoMatch[1]} seg descanso`;
  if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
  return r || p;
};

export default function ClientPage({ plan }: { plan: ClientPlan }) {
  const renderBloques = (bloques: PatientBloque[], faseId: string) => {
    const isWarmup = ['CG', 'ED', 'CE'].includes(faseId);
    return bloques.map((bloque, bIdx) => {
      const isMulti = bloque.tipo === 'BISERIE' || bloque.tipo === 'TRISERIE';
      return (
        <div key={bIdx} className={bIdx > 0 ? 'mt-6 pt-6 border-t border-black/5' : ''}>
          <p className={`cp-caption font-black tracking-[0.16em] uppercase mb-2 ${BLOQUE_COLORS[bloque.tipo]}`}>
            BLOQUE {bloque.letra} • {bloque.tipo}
          </p>

          {bloque.indicacion && (
            <p className="cp-secondary !text-black/40 text-xs leading-tight mb-4">
              {isMulti ? formatIndicacionDisplay(bloque.indicacion) : bloque.indicacion}
            </p>
          )}

          <div className={`relative ${isMulti ? 'pl-[14px]' : ''}`}>
            {isMulti && (
              <div className="absolute left-[10px] top-0 bottom-0 w-0.5 bg-black/10 -z-10"></div>
            )}
            <div className="space-y-0">
             {bloque.ejercicios.map((ex, eIdx) => {
                const isOption = bloque.tipo === 'ELIGE 1 OPCIÓN';
                const exCode = ex.codigo || `${bloque.letra}${eIdx + 1}`;
                return (
                 <div
                   key={eIdx}
                   className="relative flex items-start gap-3 py-3 border-b last:border-0 border-black/5"
                 >
                   <span
                    className={`w-6 h-6 flex items-center justify-center cp-caption font-black rounded-full shrink-0 z-10 min-w-[24px] ${
                      isOption
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'bg-[var(--color-navy)] text-white'
                    }`}
                   >
                      {isOption ? '○' : exCode}
                   </span>
                   <div className="flex-1 min-w-0">
                     <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                       <p className="cp-body font-bold leading-tight text-[var(--color-navy)]">
                         {isOption ? `Opción ${eIdx + 1}: ` : ''}{ex.nombre || '—'}
                       </p>
                       {ex.badgeTecnica && (
                         <span className={`cp-caption font-black px-2.5 py-1 rounded-full bg-[var(--color-navy)]/5 tracking-wide whitespace-nowrap ${getTecnicaColor(ex.badgeTecnica)}`}>
                           {ex.badgeTecnica}
                         </span>
                       )}
                     </div>
                     <p className="cp-secondary !text-black/40 mt-1 text-sm">
                       {isOption && (
                         <span className="cp-caption !text-black/30 font-medium">{exCode} · </span>
                       )}
                       {isWarmup
                         ? formatearDisplay(ex.prescripcion)
                         : (formatEjercicioDisplay(ex.prescripcion, bloque.tipo) || '—')}
                     </p>
                   </div>
                 </div>
               );
             })}
            </div>
          </div>
        </div>
      );
    });
  };

  const [tab, setTab] = useState('HOY');
  const [openWarmupLow, setOpenWarmupLow] = useState(true);
  const [openWarmupOper, setOpenWarmupOper] = useState(true);
  const [openEntrenamiento, setOpenEntrenamiento] = useState(true);
  const [openSection, setOpenSection] = useState<'entrenamiento' | 'nutricion' | 'suplementacion'>('entrenamiento');
  const [openGuia, setOpenGuia] = useState(0);
  const [openGuiaSections, setOpenGuiaSections] = useState<Set<string>>(
    new Set(guideSections.map((s) => s.id))
  );
  const [openGlossaryCats, setOpenGlossaryCats] = useState<Record<string, boolean>>({});
  const [openGlossaryTerms, setOpenGlossaryTerms] = useState<Record<string, boolean>>({});

  const todayIndex = new Date().getDay();
  const todayKeyMap = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const autoDayKey = todayKeyMap[todayIndex];
  const [selectedDayKey, setSelectedDayKey] = useState(autoDayKey);

  const p = plan?.person || { nombre: 'Paciente' };
  const mealsRaw: MealClient[] = plan?.meals || [];
  const routinesRaw: Record<string, DayRoutine> = plan?.routines || {};
  const suppsRaw: Record<string, SupplementClient[]> = plan?.supplements || {};
  const stats = plan?.stats || {};
  const avances = plan?.avances || {};
  const estadisticas = plan?.estadisticas || {};
  const tNutri = plan?.tratamientoNutricional || {};
  const tEntre = plan?.tratamientoEntrenamiento || {};
  const clinico = plan?.clinico || {};

  const activeDay = DAYS.find(d=>d.key===selectedDayKey) || DAYS[0];

  const dayMeals = useMemo(()=>{
    return (mealsRaw.filter(m => m.dayKey === selectedDayKey) || []).sort((a, b) => {
      const ha = (a.hour || '').split(':').map(Number);
      const hb = (b.hour || '').split(':').map(Number);
      return (ha[0]*60 + ha[1]) - (hb[0]*60 + hb[1]);
    });
  }, [mealsRaw, selectedDayKey]);

  const dayRoutine = useMemo(()=>{
    return routinesRaw[selectedDayKey] || routinesRaw['monday'] || { tipo: 'lower', actividad: '', titulo: 'Lower', subtitulo: 'Lower', fases: [] };
  }, [routinesRaw, selectedDayKey]);

    const daySupps = useMemo(()=>{
    const s = suppsRaw[selectedDayKey] || [];
    return s;
  }, [suppsRaw, selectedDayKey]);

  return (
    <div className="w-full bg-[var(--color-bg-base)] font-[Inter,system-ui] text-[var(--color-navy)] antialiased overflow-x-hidden selection:bg-[var(--color-primary)]/20">

      {/* HEADER - Saludo, fecha y próxima actualización */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/5 border border-black/10">
            <span className="cp-caption font-black tracking-[0.12em] uppercase text-black/60">Plan activo</span>
          </span>
          <img src="/doc-logo-brand.svg" alt="DocFitness" className="h-7 w-auto" />
        </div>
        <div>
            <h1 className="cp-hero" style={{ fontFamily: 'var(--font-title)', color: C.deep }}>Hola, {p.nombre.split(' ')[0]}</h1>
            <p className="cp-subtitle mt-3 font-medium leading-relaxed">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · te toca {dayRoutine.actividad || (dayRoutine.tipo === 'rest' ? 'Día de descanso' : dayRoutine.tipo || '')}</p>
            {plan?.proximaConsulta && <div className="mt-3 flex justify-center"><span className="on-dark inline-block font-black px-4 py-1.5 rounded-full bg-[var(--color-green)] uppercase tracking-wide cp-caption">Próxima actualización: {plan.proximaConsulta}</span></div>}
          </div>
      </div>

      {/* TABS - Reorganizados */}
      <div className="px-6 sticky top-0 z-20 py-4 bg-[var(--color-bg-elevated)]/90 backdrop-blur-xl">
        <div className="p-1 rounded-full flex gap-1 bg-white border border-black/5">
            {[
            { k: 'HOY', label: 'HOY' },
            { k: 'AVANCES', label: 'AVANCES' },
            { k: 'GUIA', label: 'GUÍA' },
          ].map(t=>(
             <button key={t.k} onClick={()=>setTab(t.k)} className={`flex-1 py-3 rounded-full cp-secondary font-bold tracking-wide transition-all duration-200 active:scale-[0.96] ${tab===t.k ? 'bg-[var(--color-primary)] text-white' : 'bg-transparent text-[var(--color-navy)] hover:bg-black/5'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* SELECTOR DÍAS */}
      {(tab==='HOY') && (
        <div className="px-6 mt-3">
          <div className="bg-white rounded-full p-1 flex justify-between border border-black/5">
            {DAYS.map(d=>{
              const isActive = d.key===selectedDayKey;
              const isToday = d.key===autoDayKey;
              return (
                 <button key={d.key} onClick={()=>setSelectedDayKey(d.key)} className={`relative w-[44px] h-[44px] rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-95 ${isActive ? 'bg-[var(--color-primary)] !text-white' : 'bg-transparent !text-[var(--color-navy)] hover:bg-black/5'}`}>
                   <span className={`cp-caption font-black ${isActive ? '!text-white' : '!text-[var(--color-navy)]'}`}>{d.label}</span>
                   {isToday && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isActive ? 'bg-white' : 'bg-[var(--color-green)]'}`} />}
                 </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 1. CALENTAMIENTO */}
      {tab==='HOY' && dayRoutine.tipo !== 'rest' && (
        <div className="px-6 mt-8 space-y-3">
          {(() => {
            const warmupFases = dayRoutine.fases.filter((f) => ['CG', 'ED', 'CE'].includes(f.id));
            const tipoDia = dayRoutine.tipo;
            const shouldShowLow = tipoDia === 'lower' || tipoDia === 'full';
            const shouldShowOper = tipoDia === 'upper' || tipoDia === 'full';
            const lowerFases = shouldShowLow ? warmupFases.filter((f) => f.grupo === 'lower') : [];
            const upperFases = shouldShowOper ? warmupFases.filter((f) => f.grupo === 'upper') : [];

            const renderFaseInline = (fase) => (
              <div key={fase.id} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: fase.badgeColor }} />
                  <span className="cp-caption font-black uppercase tracking-[0.08em] !text-black/40">{fase.nombre}</span>
                </div>
                {renderBloques(fase.bloques, fase.id)}
              </div>
            );

            return (
              <>
                {lowerFases.length > 0 && (
                  <div className="rounded-2xl border border-black/5 bg-white">
                    <button onClick={() => setOpenWarmupLow(!openWarmupLow)} className="w-full flex items-center justify-between px-4 py-3 transition-all duration-200 active:scale-[0.99]">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 !text-black/40" />
                        <span className="cp-caption font-black tracking-[0.12em] uppercase !text-black/40">Calentamiento Lower Body</span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform text-black/30" style={{ transform: openWarmupLow ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </button>
                    {openWarmupLow && <div className="px-4 pb-3">{lowerFases.map(renderFaseInline)}</div>}
                  </div>
                )}

                {upperFases.length > 0 && (
                  <div className="rounded-2xl border border-black/5 bg-white">
                    <button onClick={() => setOpenWarmupOper(!openWarmupOper)} className="w-full flex items-center justify-between px-4 py-3 transition-all duration-200 active:scale-[0.99]">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 !text-black/40" />
                        <span className="cp-caption font-black tracking-[0.12em] uppercase !text-black/40">Calentamiento Upper Body</span>
                      </div>
                      <ChevronDown className="w-4 h-4 transition-transform text-black/30" style={{ transform: openWarmupOper ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </button>
                    {openWarmupOper && <div className="px-4 pb-3">{upperFases.map(renderFaseInline)}</div>}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* 2. ENTRENAMIENTO DEL DÍA — sin relleno navy */}
      {tab==='HOY' && (
        <div className="px-6 mt-6">
          <div className="rounded-2xl border border-black/5 bg-white">
            <button onClick={()=>setOpenSection(openSection==='entrenamiento' ? null : 'entrenamiento')} className="w-full flex items-center justify-between px-4 py-3 transition-all duration-200 active:scale-[0.99]">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 !text-black/40" />
                <span className="cp-caption font-black tracking-[0.12em] uppercase !text-black/40">Entrenamiento del día</span>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform text-black/30" style={{ transform: openSection === 'entrenamiento' ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
            {openSection==='entrenamiento' && (
              <div className="px-4 pb-3">
                {dayRoutine.fases.length === 0 ? (
                  <p className="cp-body !text-black/30 py-4 text-center">Día de descanso o sin ejercicios cargados</p>
                ) : (
                  (() => {
                    const mainFases = dayRoutine.fases.filter((f) => f.grupo === 'main');
                    const renderFaseInlineM = (fase) => (
                      <div key={fase.id} className="mb-4 last:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: fase.badgeColor }} />
                          <span className="cp-caption font-black uppercase tracking-[0.08em] !text-black/40">{fase.nombre}</span>
                        </div>
                        {renderBloques(fase.bloques, fase.id)}
                      </div>
                    );
                    return mainFases.length > 0 ? (
                      mainFases.map(renderFaseInlineM)
                    ) : (
                      <p className="cp-body !text-black/30 py-2 text-center">Sin entrenamiento principal</p>
                    );
                  })()
)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. NUTRICIÓN */}
      {tab==='HOY' && (
        <div className="px-6 mt-6">
          <div className="rounded-2xl border border-black/5 bg-white">
            <button onClick={()=>setOpenSection(openSection==='nutricion' ? null : 'nutricion')} className="w-full flex items-center justify-between px-4 py-3 transition-all duration-200 active:scale-[0.99]">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 !text-black/40"/>
                <p className="cp-caption font-black tracking-[0.12em] uppercase !text-black/40">Nutrición {activeDay.full}</p>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform text-black/30" style={{ transform: openSection === 'nutricion' ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
            {openSection==='nutricion' && (
              <div className="px-4 pb-3 pt-1">
                {dayMeals.map((meal,i)=>(
                  <div key={i} className="pt-3 pb-4 border-b border-black/5 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold px-2.5 py-1 rounded-full bg-[var(--color-green)] flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-white"/>
                        <span className="cp-caption font-black text-white">{meal.hour || meal.tiempo || ''}</span>
                      </span>
                      <p className="cp-body font-bold text-[var(--color-navy)]">{meal.time}</p>
                      {meal.menuType === 'armar' && (
                        <span className="cp-caption font-black px-2 py-0.5 rounded-full bg-[var(--color-primary)] !text-white">Armar menú</span>
                      )}
                      <span className="cp-secondary !text-black/40 ml-auto">{meal.kcal} kcal · {meal.macros?.proteinas || 0}p {meal.macros?.carbos || 0}c {meal.macros?.grasas || 0}g</span>
                    </div>

                    {meal.menuType === 'armar' && (
                      <div className="pr-1">
                        <p className="cp-caption font-black uppercase tracking-[0.08em] text-[var(--color-text-muted)] mb-2">Elige 1 de cada grupo</p>
                        {renderFoodsArmar(meal.foods || [])}
                      </div>
                    )}

                    {meal.menuType === 'fijo' && meal.menus && meal.menus.length > 0 && (
                      <div className="pr-1 space-y-3">
                        {meal.menus.map((menu, mi) => (
                          <div key={mi}>
                            {menu.nombre && (
                              <p className="cp-caption font-black uppercase tracking-[0.08em] text-[var(--color-text-muted)] mb-1.5">{menu.nombre}</p>
                            )}
                            {renderFoodsFijo(menu.alimentos || [])}
                          </div>
                        ))}
                      </div>
                    )}

                    {(meal.menuType === 'fijo' && !meal.menus) && renderFoodsFijo(meal.foods || [])}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SUPLEMENTACIÓN */}
      {tab==='HOY' && (
        <div className="px-6 mt-6 pb-8">
          <div className="rounded-2xl border border-black/5 bg-white">
            <button onClick={()=>setOpenSection(openSection==='suplementacion' ? null : 'suplementacion')} className="w-full flex items-center justify-between px-4 py-3 transition-all duration-200 active:scale-[0.99]">
              <div className="flex items-center gap-2">
                <PillIcon className="w-4 h-4 !text-black/40"/>
                <p className="cp-caption font-black tracking-[0.12em] uppercase !text-black/40">Suplementación {activeDay.full}</p>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform text-black/30" style={{ transform: openSection === 'suplementacion' ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
            {openSection==='suplementacion' && (
              <div className="px-4 pb-3 pt-1">
                 {daySupps.length===0 ? (
                   <div className="text-center py-6">
                     <p className="cp-secondary !text-black/30">Sin suplementos este día</p>
                   </div>
                 ) : (
                   <div className="space-y-2.5">
                     {daySupps.map((s,i)=>{
                       const badge = getHorarioBadge(s.hora || s.horario || '');
                       return (
                       <div key={i} className="flex items-center gap-3 py-2">
                         <span className={`font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${badge.bg}`}>
                           <Clock className="w-3 h-3 !text-[var(--color-navy)]"/>
                           <span className={`cp-caption font-black ${badge.color}`}>{s.hora || s.horario || ''}</span>
                         </span>
                         <div>
                           <p className="cp-body font-bold text-[var(--color-navy)]">{s.nombre}</p>
                           <p className="cp-secondary !text-black/30">{s.dosis}</p>
                         </div>
                       </div>
                       )
                     })}
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>
      )}


      {/* AVANCES */}
      {tab==='AVANCES' && (
        <div className="px-6 mt-2 pb-12 space-y-6">
          <div className="px-1">
            <p className="cp-section font-bold tracking-[0.14em] uppercase" style={{ color: C.deep }}>Avances</p>
            <p className="cp-caption text-black/30 mt-1">Comparativa mensual • Anterior vs Actual</p>
          </div>

          <div className="space-y-3">
            <div className="rounded-[22px] p-5 !text-white flex justify-between items-center" style={{ background: C.primary }}>
              <div>
                <p className="cp-caption font-bold tracking-[0.12em] uppercase !text-white/80">{avances.peso?.label}</p>
                <div className="flex gap-3 items-baseline mt-3">
                  <span className="!text-white/60 font-bold text-lg">{avances.peso?.anterior}</span>
                  <span className="cp-data !text-white text-3xl">{avances.peso?.actual}</span>
                  <span className="!text-white/60 font-bold text-lg">kg</span>
                </div>
                <p className="!text-white/50 font-bold tracking-widest uppercase mt-2">Anterior → Actual</p>
              </div>
               <span className="!text-white font-black px-3 py-1.5 rounded-full bg-[var(--color-green)] text-sm">↑ +{roundDelta(avances.peso?.delta ?? 0)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: avances.abdomen?.label, ant: avances.abdomen?.anterior, act: avances.abdomen?.actual, delta: avances.abdomen?.delta },
                { label: avances.grasaKg?.label, ant: avances.grasaKg?.anterior, act: avances.grasaKg?.actual, delta: avances.grasaKg?.delta },
                { label: avances.grasaPct?.label, ant: avances.grasaPct?.anterior, act: avances.grasaPct?.actual, delta: avances.grasaPct?.delta },
                { label: avances.pliegue?.label, ant: avances.pliegue?.anterior, act: avances.pliegue?.actual, delta: avances.pliegue?.delta },
              ].filter(m => m.label).map((m, idx)=>(
                <div key={idx} className="rounded-[22px] p-4 bg-white border border-black/[0.05]">
                  <div className="flex justify-between items-start">
                    <p className="cp-caption font-bold tracking-[0.08em] uppercase opacity-50 leading-tight">{m.label}</p>
                      <span className="cp-caption font-bold px-2 py-1 rounded-full bg-[var(--color-green)] !text-white">
                        {m.delta < 0 ? '↓' : '↑'} {Math.abs(roundDelta(m.delta ?? 0))}
                      </span>
                  </div>
                  <div className="flex gap-3 items-baseline mt-3">
                    <span className="cp-body font-bold opacity-30 text-lg">{m.ant}</span>
                    <span className="cp-data text-2xl">{m.act}</span>
                  </div>
                  <p className="cp-caption font-bold tracking-widest opacity-30 uppercase mt-2">Ant • Act</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[22px] p-5 !text-white" style={{ background: C.green }}>
              <p className="cp-caption font-bold tracking-[0.1em] uppercase !text-white/80">Adherencia al plan</p>
              <div className="flex gap-3 items-baseline mt-3">
                <span className="cp-data !text-white text-3xl">{estadisticas.adherencia}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full mt-3"><div className="h-full bg-white rounded-full" style={{ width: `${estadisticas.adherencia}%` }}/></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nutrición', val: `${estadisticas.nutricion}%`, pct: estadisticas.nutricion },
                { label: 'Entreno', val: `${estadisticas.entrenamiento}%`, pct: estadisticas.entrenamiento },
                { label: 'Cardio', val: `${Math.round(Math.min((estadisticas.cardio / 3) * 100, 100))}%`, pct: Math.min((estadisticas.cardio / 3) * 100, 100) },
                { label: 'Descanso', val: `${Math.round(Math.min((parseFloat(estadisticas.descanso || '0') / 8) * 100, 100))}%`, pct: Math.min((parseFloat(estadisticas.descanso || '0') / 8) * 100, 100) },
              ].map((s,i)=>(
                <div key={i} className="rounded-[22px] p-4 bg-white border border-black/[0.05]">
                  <p className="cp-caption font-bold tracking-[0.08em] uppercase opacity-50">{s.label}</p>
                  <p className="cp-data mt-1 leading-none opacity-80 text-xl">{s.val}</p>
                  <div className="h-1.5 bg-black/5 rounded-full mt-3"><div className="h-full bg-black/20 rounded-full" style={{ width: `${s.pct}%` }}/></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[22px] border border-black/[0.05]">
            <div className="p-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-primary)] !text-white capitalize">{tNutri.estrategia || '—'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-navy)] !text-white">{tNutri.kcal || '—'} kcal</span>
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-navy)] !text-white">{tNutri.proteina || '—'}P</span>
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-navy)] !text-white">{tNutri.carbos || '—'}C</span>
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-navy)] !text-white">{tNutri.grasas || '—'}G</span>
              </div>
            </div>
            <div className="p-4 border-t border-black/[0.05] space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-primary)] !text-white capitalize">{tEntre.estrategia || '—'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-navy)] !text-white">{tEntre.dias || '—'} días</span>
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-navy)] !text-white">{tEntre.cardio || '—'}</span>
                <span className="cp-caption font-bold px-3 py-1.5 rounded-full bg-[var(--color-navy)] !text-white">{tEntre.pasos || '—'} pasos</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Retroalimentación', items: clinico.retroalimentacion },
              { title: 'Diagnóstico', items: clinico.diagnostico },
              { title: 'Objetivos', items: clinico.objetivos },
            ].map((sec,k)=>(
                <div key={k} className="border-t pt-4 border-black/[0.05]">
                <p className="cp-section font-bold tracking-[0.12em] uppercase" style={{ color: C.deep }}>{sec.title}</p>
                <div className="mt-3 space-y-2">
                  {sec.items.map((it,i)=>(
                    <div key={i} className="flex gap-2">
                      <span className="cp-secondary font-bold" style={{ color: C.primary }}>{i+1}.</span>
                      <p className="cp-secondary text-black/50 leading-[1.5]">{it}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GUÍA - Contenido estructurado completo desde guideContent.js */}
      {tab==='GUIA' && (
         <div className="px-6 mt-2 pb-8 space-y-3">
           {/* Header mejorado */}
             <div className="bg-[var(--color-navy)] rounded-2xl p-4 !text-white">
               <div className="flex items-center gap-2 mb-1">
                 <BookOpen className="w-4 h-4" />
                 <span className="cp-caption font-black tracking-[0.12em] uppercase !text-white/70">
                   Contenido educativo
                 </span>
               </div>
               <h2 className="cp-data leading-tight !text-white">
                 Guía DocFitness
               </h2>
             </div>

              {guideSections.map((section, sIdx) => {
            const num = sIdx + 1;
            const badgeColor =
              section.type === 'faq' ? 'bg-[var(--color-primary)] !text-white' :
              section.type === 'split' ? 'bg-[var(--color-green)] !text-white' :
              section.type === 'grid' ? 'bg-[var(--color-green)] !text-white' :
              section.type === 'columns' ? 'bg-[var(--color-primary)] !text-white' :
              'bg-[var(--color-navy)] !text-white';
            const headerBg =
              section.type === 'faq' ? 'bg-[var(--color-primary)]/10' :
              section.type === 'split' ? 'bg-[var(--color-green)]/10' :
              section.type === 'grid' ? 'bg-[var(--color-green)]/10' :
              section.type === 'columns' ? 'bg-[var(--color-primary)]/10' :
              'bg-[var(--color-bg-subtle)]';

            const effectiveBadge = badgeColor;
            const effectiveHeader = headerBg;
            const isSectionOpen = openGuiaSections.has(section.id);

            if (section.type === 'faq') {
               return (
                 <div key={section.id} className={`bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-150 active:scale-[0.99]`}>
                   <button onClick={() => { const s = new Set(openGuiaSections); s.has(section.id) ? s.delete(section.id) : s.add(section.id); setOpenGuiaSections(s); }} className={`w-full px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2 ${effectiveHeader} text-left transition-colors duration-150 active:bg-black/5`}>
                     <span className={`cp-caption font-black px-2 py-0.5 rounded-full ${effectiveBadge}`}>{num}</span>
                     <p className="cp-body font-bold text-[var(--color-text-primary)]">{section.title}</p>
                     <ChevronDown className={`w-4 h-4 shrink-0 ml-auto transition-transform duration-200 text-[var(--color-text-muted)] ${isSectionOpen ? 'rotate-180' : ''}`} />
                   </button>
                   {isSectionOpen && (
                   <div>
                    {(section.items || []).map((f, i) => {
                      const isOpen = openGuia === i;
                      return (
                        <div key={i} className={`border-b border-[var(--color-border)] last:border-b-0 ${isOpen ? 'bg-[var(--color-bg-elevated)]' : ''}`}>
                          <button onClick={()=>setOpenGuia(openGuia===i ? null : i)} className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors duration-150">
                            <span className="flex-1">
                              <p className="cp-secondary font-bold text-[var(--color-text-primary)] leading-snug">{f.q}</p>
                            </span>
                            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 text-[var(--color-text-muted)] ${isOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-3 pt-0">
                              <p className="cp-secondary text-[var(--color-text-secondary)] leading-[1.5]">{f.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    }                    )}
                  </div>
                  )}
                </div>
              );
            }

            if (section.type === 'split') {
              const isSiNo = section.id === 'si-no';
              return (
                 <div key={section.id} className={`bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-150 active:scale-[0.99]`}>
                   <button onClick={() => { const s = new Set(openGuiaSections); s.has(section.id) ? s.delete(section.id) : s.add(section.id); setOpenGuiaSections(s); }} className={`w-full px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2 ${effectiveHeader} text-left transition-colors duration-150 active:bg-black/5`}>
                     <span className={`cp-caption font-black px-2 py-0.5 rounded-full ${effectiveBadge}`}>{num}</span>
                     <p className="cp-body font-bold text-[var(--color-text-primary)]">{section.title}</p>
                     <ChevronDown className={`w-4 h-4 shrink-0 ml-auto transition-transform duration-200 text-[var(--color-text-muted)] ${isSectionOpen ? 'rotate-180' : ''}`} />
                   </button>
                    {isSectionOpen && (
                    <div className="divide-y divide-[var(--color-border)]">
                     {(section.sides || []).map((side, idx) => {
                       const isAmber = side.variant === 'amber';
                       const isGreen = side.variant === 'green';
                       const isRed = side.variant === 'red';
                       const dotColor = isAmber ? 'bg-[var(--color-amber)]' : isGreen ? 'bg-[var(--color-green)]' : isRed ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-primary)]';
                       const labelColor = isAmber ? 'text-[var(--color-amber-dark)]' : isGreen ? 'text-[var(--color-green)]' : isRed ? 'text-[var(--color-danger-dark)]' : 'text-[var(--color-text-primary)]';

                       return (
                         <div key={idx} className="px-4 py-3">
                           <div className="flex items-center gap-2 mb-2">
                             <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                             <p className={`cp-secondary font-bold ${labelColor}`}>{side.label}</p>
                           </div>
                           {isSiNo && side.categories ? (
                             <div className="space-y-2">
                               {(side.categories || []).map((cat, cIdx) => (
                                 <div key={cIdx}>
                                   <p className="cp-caption font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{cat.name}</p>
                                   <div className="space-y-1">
                                     {(cat.items || []).map((item, iIdx) => (
                                       <div key={iIdx} className="flex gap-2 cp-secondary leading-[1.5] -mx-2 px-2 py-1.5 rounded-lg">
                                         {side.label === 'Lo que SÍ' ? (
                                           <span className="w-5 h-5 rounded-full bg-[var(--color-green)] !text-white flex items-center justify-center shrink-0 mt-0.5"><Check size={12}/></span>
                                         ) : (
                                           <span className="w-5 h-5 rounded-full bg-[var(--color-danger)] !text-white flex items-center justify-center shrink-0 mt-0.5"><X size={12}/></span>
                                         )}
                                         <span className={side.label === 'Lo que NO' ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-secondary)]'} dangerouslySetInnerHTML={{ __html: item }} />
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <>
                               <p className="cp-secondary text-[var(--color-text-secondary)] leading-[1.5] mb-2" dangerouslySetInnerHTML={{ __html: side.body }} />
                               {side.dont && (
                                 <div className="space-y-1.5">
                                   {side.dont.map((d, i) => <div key={i} className="flex gap-2 cp-secondary text-[var(--color-text-muted)]"><X size={12} className="shrink-0 mt-0.5 text-[var(--color-danger)]"/><span>{d}</span></div>)}
                                 </div>
                               )}
                               {side.swaps && (
                                 <div className="space-y-1.5">
                                   {side.swaps.map((sw, i) => (
                                     <div key={i} className="flex gap-2 cp-secondary">
                                       <span className="font-bold text-[var(--color-text-primary)] min-w-[70px]">{sw.label}</span>
                                       <span className="text-[var(--color-text-secondary)]">{sw.value}</span>
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </>
                           )}
                         </div>
                       );
                     })}
                    </div>
                    )}
                  </div>
                );
              }

              if (section.type === 'grid') {
              return (
                 <div key={section.id} className={`bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-150 active:scale-[0.99]`}>
                   <button onClick={() => { const s = new Set(openGuiaSections); s.has(section.id) ? s.delete(section.id) : s.add(section.id); setOpenGuiaSections(s); }} className={`w-full px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2 ${effectiveHeader} text-left transition-colors duration-150 active:bg-black/5`}>
                     <span className={`cp-caption font-black px-2 py-0.5 rounded-full ${effectiveBadge}`}>{num}</span>
                     <p className="cp-body font-bold text-[var(--color-text-primary)]">{section.title}</p>
                     {section.note && <span className="ml-auto cp-caption font-bold uppercase tracking-widest text-[var(--color-green)]">{section.note}</span>}
                     <ChevronDown className={`w-4 h-4 shrink-0 ml-auto transition-transform duration-200 text-[var(--color-text-muted)] ${isSectionOpen ? 'rotate-180' : ''}`} />
                   </button>
                   {isSectionOpen && (
                   <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                     {(section.blocks || []).map((block, idx) => (
                       <div key={idx}>
                         <p className="cp-caption font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">{block.title}</p>
                         {block.highlight ? (
                           <div className="rounded-xl bg-[var(--color-navy)] !text-white p-3">
                             <p className="cp-secondary leading-[1.5] !text-white/80">{(block.items || []).join(', ')}</p>
                           </div>
                         ) : (
                           <div className="flex flex-wrap gap-1.5">
                             {(block.items || []).map((t, i) => (
                               <span key={i} className="rounded-full bg-[var(--color-green)] !text-white border border-[var(--color-green)]/25 px-2.5 py-1 cp-caption leading-tight shadow-sm">
                                 {t}
                               </span>
                             ))}
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                   )}
                 </div>
               );
             }

             if (section.type === 'columns') {
              return (
                 <div key={section.id} className={`bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-150 active:scale-[0.99]`}>
                   <button onClick={() => { const s = new Set(openGuiaSections); s.has(section.id) ? s.delete(section.id) : s.add(section.id); setOpenGuiaSections(s); }} className={`w-full px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2 ${effectiveHeader} text-left transition-colors duration-150 active:bg-black/5`}>
                     <span className={`cp-caption font-black px-2 py-0.5 rounded-full ${effectiveBadge}`}>{num}</span>
                     <p className="cp-body font-bold text-[var(--color-text-primary)]">{section.title}</p>
                     <ChevronDown className={`w-4 h-4 shrink-0 ml-auto transition-transform duration-200 text-[var(--color-text-muted)] ${isSectionOpen ? 'rotate-180' : ''}`} />
                   </button>
                   {isSectionOpen && (
                   <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
                    {(section.columns || []).map((col, idx) => (
                      <div key={idx} className="p-4">
                        <p className="cp-secondary font-bold text-[var(--color-text-primary)] mb-1">{col.title}</p>
                        <p className="cp-secondary text-[var(--color-text-secondary)] leading-[1.5]" dangerouslySetInnerHTML={{ __html: col.body }} />
                      </div>
                    ))}
                   </div>
                   )}
                 </div>
               );
             }

             return null;
          })}

          {/* Glosario compacto por categorías */}
          {glossaryTerms.length > 0 && (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-150 active:scale-[0.99]">
              <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2">
                <Info className="w-4 h-4 text-[var(--color-text-muted)]"/>
                <p className="cp-section tracking-[0.12em] uppercase text-[var(--color-text-primary)]">Glosario</p>
              </div>
              <div className="p-3 space-y-2">
                {(() => {
                  const grouped = glossaryTerms.reduce((acc, term) => {
                    const cat = term.cat || 'General';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(term);
                    return acc;
                  }, {});

                  const toggleCategory = (cat) => {
                    setOpenGlossaryCats(prev => ({ ...prev, [cat]: !prev[cat] }));
                  };

                  const toggleTerm = (id) => {
                    setOpenGlossaryTerms(prev => ({ ...prev, [id]: !prev[id] }));
                  };

                  return Object.entries(grouped).map(([cat, terms], cIdx) => {
                    const isCatOpen = openGlossaryCats[cat];
                    return (
                      <div key={cat} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleCategory(cat)}
                          className="w-full px-3 py-2 flex items-center justify-between bg-[var(--color-bg-subtle)] active:bg-black/5 transition-colors duration-150"
                        >
                           <span className="cp-caption font-black text-[var(--color-text-primary)]">{cat}</span>
                          <div className="flex items-center gap-2">
                            <span className="cp-caption text-[var(--color-text-muted)]">{terms.length}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[var(--color-text-muted)] ${isCatOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        {isCatOpen && (
                          <div className="divide-y divide-[var(--color-border)]">
                            {terms.map((term, tIdx) => {
                              const isTermOpen = openGlossaryTerms[term.id];
                              const firstLine = (term.body || '').split('\n')[0];
                              return (
                                <div key={term.id}>
                                  <button
                                    onClick={() => toggleTerm(term.id)}
                                    className="w-full px-3 py-2 flex items-start gap-2.5 text-left active:bg-black/[0.02] transition-colors duration-150"
                                  >
                                    <span className="cp-caption font-black px-1.5 py-0.5 rounded bg-[var(--color-navy)] !text-white shrink-0 mt-0.5">{term.title.slice(0, 2)}</span>
                                    <span className="flex-1 min-w-0">
                                      <span className="cp-secondary font-bold text-[var(--color-text-primary)] block leading-snug">{term.title}</span>
                                      <span className="cp-caption text-[var(--color-text-secondary)] block mt-0.5 leading-snug line-clamp-1">{firstLine}</span>
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-[var(--color-text-muted)] mt-0.5 ${isTermOpen ? 'rotate-180' : ''}`} />
                                  </button>
                                  {isTermOpen && term.body && (
                                    <div className="px-3 pb-2.5 pt-0">
                                      <p className="cp-caption text-[var(--color-text-secondary)] leading-[1.5] whitespace-pre-line">{term.body}</p>
                                      {term.example && (
                                        <div className="mt-2 flex gap-2 items-start">
                                          <span className="cp-caption font-black px-2 py-1 rounded-full bg-[var(--color-navy)] !text-white mt-0.5">EJEMPLO</span>
                                          <p className="cp-caption text-[var(--color-text-primary)] leading-snug">{term.example}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="px-6 pb-6">
        <div className="bg-[var(--color-primary)] rounded-[22px] p-5 text-center">
           <div className="flex justify-center mb-3">
             <img src="/doc-logo-white.svg" alt="DocFitness" className="h-5 w-auto" />
           </div>
           <div className="flex justify-center gap-3">
            <a href="https://wa.me/5212345678901" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </a>
            <a href="https://www.instagram.com/eldocfitness/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
            </a>
            <a href="https://www.youtube.com/@docfitnesscoach" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z"/></svg>
            </a>
            <a href="https://open.spotify.com/show/0xfjm7MDS0av4544Nl3lgH?si=f5a8b769afc940cd" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
