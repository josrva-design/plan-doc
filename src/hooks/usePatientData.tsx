import { useMemo } from 'react';
import { getDayType } from '../utils/dayType.ts';
import { isConsultaVencida } from '../utils/evolutionHelpers';
import { groupSeries, ejToDisplay, getCombinedSections } from '../utils/routineHelpers.ts';
import { normalizeFood, normalizeMeal } from '../utils/normalizeEditorData.ts';
import { normalizeWarmupForExport as flattenWarmup } from '../utils/normalizeWarmup.ts';
import { DAY_KEYS, DAY_LABELS } from '../utils/calendarConstants.ts';
import type { AppData, ClientPlan, MealClient, DayRoutine, SupplementClient, WarmupPhase, AvancePeso, AvanceMedida, EstadisticasClient, TratamientoNutricional, TratamientoEntrenamiento, Clinico, FaseId, BloqueTipo, PatientBloque, PatientFase, PatientEjercicio, WarmupExercise } from './types';

const DAY_MAP = DAY_KEYS.map((key, i) => ({ key, dia: DAY_LABELS[i] }));

function parseFechaConsulta(fechaConsulta: string): Date | null {
  if (!fechaConsulta) return null;
  const parts = String(fechaConsulta).split('/');
  let y: number, m: number, d: number;
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const dd = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10) - 1;
      const yy = parseInt(parts[2], 10);
      y = yy; m = mm; d = dd;
    } else {
      const dd = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10) - 1;
      const yy = parseInt(parts[2], 10);
      y = yy >= 0 && yy <= 99 ? 2000 + yy : yy;
      m = mm; d = dd;
    }
  } else {
    const isoParts = String(fechaConsulta).split('-');
    if (isoParts.length !== 3) return null;
    y = parseInt(isoParts[0], 10);
    m = parseInt(isoParts[1], 10) - 1;
    d = parseInt(isoParts[2], 10);
  }
  return new Date(y, m, d);
}

const formatearPrescripcion = (ex: any): string => {
  const reps = (ex.reps || '').toString().trim();
  const descanso = (ex.descanso || ex.pausa || ex.rest || '').toString().trim();
  const rir = (ex.rir || '').toString().trim();
  const tecnica = (ex.tecnica || '').toString().trim();
  const s1 = (ex.semana1 || ex.s1 || '').toString().trim();
  const s2 = (ex.semana2 || ex.s2 || '').toString().trim();
  const s3 = (ex.semana3 || ex.s3 || '').toString().trim();
  const s4 = (ex.semana4 || ex.s4 || '').toString().trim();
  const hasWeeks = s1 || s2 || s3 || s4;
  const isAprox = (ex.categoria || '').toLowerCase() === 'aprox' || /\(\d+%\)/.test(ex.nombre || '');

  if (isAprox) {
    if (!reps) return '-';
    let result = `${reps} reps`;
    if (descanso) result += ` • ${descanso}`;
    return result;
  }

  if (hasWeeks) {
    const arr = [s1, s2, s3, s4].map(v => parseInt(v, 10) || 0);
    const todosIguales = arr.every(v => v === arr[0]);
    let result = '';
    if (todosIguales) {
      result = `${arr[0]} sets x 4 semanas`;
    } else {
      result = `Sem 1: ${s1} sets • Sem 2: ${s2} sets • Sem 3: ${s3} sets • Sem 4: ${s4} sets`;
    }
    if (reps) result += ` • ${reps} reps`;
    if (descanso) result += ` • ${descanso}`;
    if (tecnica) result += ` • Técnica: ${tecnica}`;
    if (rir && rir !== '-') {
      const prefix = /^RIR\s*/i.test(rir) ? '' : 'RIR ';
      result += ` • ${prefix}${rir}`;
    }
    return result;
  }

  if (!reps) return '-';

  const sets = (ex.serie || ex.sets || '1').toString().trim();
  const isTime = /min|seg|\bs\b$/i.test(reps.toLowerCase()) && !/reps|rep\b/i.test(reps.toLowerCase());

  let repsText = reps;
  if (isTime) {
    const rl = reps.toLowerCase();
    if (rl.includes('min')) repsText = rl.replace(/min/i, 'MIN');
  }

  let result = '';
  if (isTime) {
    result = `${sets}x ${repsText}`;
  } else {
    result = `${sets} series x ${reps} reps`;
  }
  if (descanso) result += ` • ${descanso}`;
  if (tecnica) result += ` • Técnica: ${tecnica}`;
  if (rir && rir !== '-') {
    const prefix = /^RIR\s*/i.test(rir) ? '' : 'RIR ';
    result += ` • ${prefix}${rir}`;
  }
  return result;
};

const FASE_LABELS: Record<FaseId, string> = {
  CG: 'CALENTAMIENTO GENERAL',
  ED: 'ESTIRAMIENTO DINÁMICO / MOVILIDAD',
  CE: 'CALENTAMIENTO ESPECÍFICO',
  SA: 'SERIES DE APROXIMACIÓN',
  PRINCIPAL: 'ENTRENAMIENTO PRINCIPAL',
  ABD: 'ABDOMEN',
};

const FASE_COLORS: Record<FaseId, string> = {
  CG: 'var(--color-primary)',
  ED: 'var(--color-green)',
  CE: 'var(--color-navy)',
  SA: 'var(--color-orange)',
  PRINCIPAL: 'var(--color-green)',
  ABD: 'var(--color-primary)',
};

const WARMUP_FASE_MAP: Record<string, FaseId> = {
  GENERAL: 'CG',
  MOVILIDAD: 'ED',
  ESPECÍFICO: 'CE',
};

const ABDOMINAL_KEYWORDS = ['abdo', 'core', 'plancha', 'crunch', 'mountain climber', 'elevación', 'levan'];

const buildWarmupFases = (phases: WarmupPhase[], grupo: 'lower' | 'upper'): PatientFase[] => {
  const fases: PatientFase[] = [];
  let counter = 0;
  const nextLetra = () => String.fromCharCode(65 + counter++);

  phases.forEach((fase) => {
    const faseId = WARMUP_FASE_MAP[fase.fase];
    if (!faseId) return;

    const allEj = (fase.opciones || []).concat(fase.individuales || []);
    if (!allEj.length) return;

    const hasBlockLetters = allEj.some((ex) => ex.blockLetter);

    let bloques: PatientBloque[] = [];

    if (hasBlockLetters) {
      const groups: Record<string, any[]> = {};
      const order: string[] = [];

      allEj.forEach((ex) => {
        const letter = ex.blockLetter || nextLetra();
        if (!groups[letter]) {
          groups[letter] = [];
          order.push(letter);
        }
        groups[letter].push(ex);
      });

      bloques = order.map((letter) => {
        const exGroup = groups[letter];
        exGroup.sort((a, b) => (a.blockPosition || 0) - (b.blockPosition || 0));

        const rawSerie = exGroup[0]?.blockSerie || exGroup[0]?.tipo || 'Simple';
        const isBlockType = ['Simple', 'Biserie', 'Triserie', 'Circuito', 'Cardio'].includes(rawSerie);
        let tipo: BloqueTipo = 'SERIE SIMPLE';
        if (rawSerie === 'Biserie') tipo = 'BISERIE';
        else if (rawSerie === 'Triserie') tipo = 'TRISERIE';
        else if (rawSerie === 'Circuito') tipo = 'SERIE GIGANTE / CIRCUITO';
        else if (!isBlockType && exGroup.length === 2) tipo = 'BISERIE';
        else if (!isBlockType && exGroup.length === 3) tipo = 'TRISERIE';

        const ejercicios: PatientEjercicio[] = exGroup.map((ex, eIdx) => ({
          codigo: `${letter}${eIdx + 1}`,
          nombre: ex.ejercicio || '—',
          badgeTecnica: '',
          prescripcion: ex.detalle || '—',
          grupo: ex.grupo || 'default',
          subtipo: ex.tipo || 'Normal',
          series: (ex.sets || ex.serie || '1').toString().trim(),
          reps: ex.reps || '',
          pausa: ex.pausa || ex.descanso || '',
          descanso: ex.pausa || ex.descanso || '',
          semana1: ex.semana1 || '',
          semana2: ex.semana2 || '',
          semana3: ex.semana3 || '',
          semana4: ex.semana4 || '',
          musculo: ex.musculo || '',
          movimiento: ex.movimiento || '',
        }));

        return {
          letra: letter,
          tipo,
          indicacion: '',
          ejercicios,
        };
      });
    } else {
      const bloqueLetra = nextLetra();
      const ejercicios: PatientEjercicio[] = allEj.map((ex, eIdx) => ({
        codigo: `${bloqueLetra}${eIdx + 1}`,
        nombre: ex.ejercicio || '—',
        badgeTecnica: '',
        prescripcion: ex.detalle || '—',
        grupo: ex.grupo || 'default',
        subtipo: ex.tipo || 'Normal',
        series: (ex.sets || ex.serie || '1').toString().trim(),
        reps: ex.reps || '',
        pausa: ex.pausa || ex.descanso || '',
        descanso: ex.pausa || ex.descanso || '',
        semana1: ex.semana1 || '',
        semana2: ex.semana2 || '',
        semana3: ex.semana3 || '',
        semana4: ex.semana4 || '',
        musculo: ex.musculo || '',
        movimiento: ex.movimiento || '',
      }));

      bloques = [
        {
          letra: bloqueLetra,
          tipo: 'SERIE SIMPLE',
          indicacion: '',
          ejercicios,
        },
      ];
    }

    fases.push({
      id: faseId,
      nombre: FASE_LABELS[faseId],
      badgeColor: FASE_COLORS[faseId],
      bloques,
      grupo,
    });
  });

  return fases;
};

const organizarEnFases = (
  routine: any,
  warmup: WarmupExercise[],
  tipo: DayRoutine['tipo']
): PatientFase[] => {
  const fases: PatientFase[] = [];

  let trainingBloqueCounter = 0;
  const nextTrainingLetra = () => String.fromCharCode(65 + trainingBloqueCounter++);

  const lowerExercises = (warmup || []).filter((e) => e.grupo === 'lower');
  const upperExercises = (warmup || []).filter((e) => e.grupo === 'upper');

  if (tipo === 'lower' || tipo === 'full') {
    fases.push(...buildWarmupFases(flattenWarmup(lowerExercises), 'lower'));
  }
  if (tipo === 'upper' || tipo === 'full') {
    fases.push(...buildWarmupFases(flattenWarmup(upperExercises), 'upper'));
  }

  // SA fase (aproximación / warm-up sets) from routine ejercicios
  const todosEjercicios = (routine?.ejercicios || []).map((ej: any) => ejToDisplay(ej));
  const ejerciciosConBloques = getCombinedSections(todosEjercicios);
  const aproxEjercicios = ejerciciosConBloques.filter((ej: any) => ej.isAprox);
  const efectivosEjercicios = ejerciciosConBloques.filter((ej: any) => !ej.isAprox);
  const nombreBase = (nombre) => (nombre || '').replace(/\s*\(\d+%\)\s*/, '').trim();

  if (aproxEjercicios.length > 0) {
    const aproxGroups: Record<string, any[]> = {};
    aproxEjercicios.forEach((ej: any) => {
      const base = nombreBase(ej.ejercicio);
      if (!aproxGroups[base]) aproxGroups[base] = [];
      aproxGroups[base].push(ej);
    });

    const aproxBloques: PatientBloque[] = Object.entries(aproxGroups).map(([baseName, exGroup]) => {
      const sorted = exGroup.sort((a, b) => (parseInt(a.blockPosition) || 0) - (parseInt(b.blockPosition) || 0));
      const nextEffective = efectivosEjercicios.find((ej: any) => nombreBase(ej.ejercicio) === baseName);
      const rawSerie = nextEffective?.blockSerie || nextEffective?.serie || 'Simple';
      const isBlockType = ['Simple', 'Biserie', 'Triserie', 'Circuito', 'Cardio'].includes(rawSerie);
      let tipo: BloqueTipo = 'SERIE SIMPLE';
      if (rawSerie === 'Biserie') tipo = 'BISERIE';
      else if (rawSerie === 'Triserie') tipo = 'TRISERIE';
      else if (rawSerie === 'Circuito') tipo = 'SERIE GIGANTE / CIRCUITO';
      else if (!isBlockType && sorted.length === 2) tipo = 'BISERIE';
      else if (!isBlockType && sorted.length === 3) tipo = 'TRISERIE';

      return {
        letra: sorted[0]?.blockLetter || 'A',
        tipo,
        indicacion: `${sorted.length} series de aproximación`,
        ejercicios: sorted.map((ex: any) => ({
          codigo: ex.secuencia || `${sorted[0]?.blockLetter || 'A'}${ex.blockPosition}`,
          nombre: ex.ejercicio || '—',
          badgeTecnica: ex.tecnica ? ex.tecnica : `${ex.aproxPorcentaje || 50}% peso`,
          prescripcion: formatearPrescripcion(ex),
          subtipo: ex.tipo || 'Normal',
          categoria: 'Aprox',
          faseId: 'SA',
          series: (ex.sets || ex.serie || '1').toString().trim(),
          semana1: ex.semana1 || '',
          semana2: ex.semana2 || '',
          semana3: ex.semana3 || '',
          semana4: ex.semana4 || '',
          s1: ex.s1 || ex.semana1 || '',
          s2: ex.s2 || ex.semana2 || '',
          s3: ex.s3 || ex.semana3 || '',
          s4: ex.s4 || ex.semana4 || '',
          tecnica: ex.tecnica || '',
          rir: ex.rir || '',
          descanso: ex.descanso || ex.pausa || '',
          musculo: ex.musculo || '',
          movimiento: ex.movimiento || '',
          peso: ex.peso || '',
          video: ex.video || '',
          notas: ex.notas || '',
          reps: ex.reps || '',
          aproxPorcentaje: ex.aproxPorcentaje || null,
          porcentaje: ex.aproxPorcentaje || null,
        })),
      };
    });

    fases.push({
      id: 'SA',
      nombre: FASE_LABELS['SA'],
      badgeColor: FASE_COLORS['SA'],
      bloques: aproxBloques,
      grupo: 'main',
    });
  }

  // Main exercises → PRINCIPAL and ABD fases
  const abdominalExs = efectivosEjercicios.filter((ej: any) => {
    const nombre = (ej.ejercicio || '').toLowerCase();
    return ABDOMINAL_KEYWORDS.some((kw) => nombre.includes(kw));
  });

  const mainEjercicios = efectivosEjercicios.filter((ej: any) => {
    const nombre = (ej.ejercicio || '').toLowerCase();
    return !ABDOMINAL_KEYWORDS.some((kw) => nombre.includes(kw));
  });

  if (mainEjercicios.length > 0) {
    const groups: Record<string, any[]> = {};
    const order: string[] = [];

    mainEjercicios.forEach((ej) => {
      const letter = ej.blockLetter || 'A';
      if (!groups[letter]) {
        groups[letter] = [];
        order.push(letter);
      }
      groups[letter].push(ej);
    });

    Object.keys(groups).forEach((letter) => {
      groups[letter].sort((a, b) => {
        const posA = parseInt(a.blockPosition) || 0;
        const posB = parseInt(b.blockPosition) || 0;
        if (posA && posB) return posA - posB;
        return 0;
      });
    });

    const bloques: PatientBloque[] = order.map((letter) => {
      const exGroup = groups[letter];
      const count = exGroup.length;
      const rawSerie = exGroup[0]?.blockSerie || exGroup[0]?.serie || '';
      const isBlockType = ['Simple', 'Biserie', 'Triserie', 'Circuito', 'Cardio'].includes(rawSerie);
      let tipo: BloqueTipo = 'SERIE SIMPLE';
      if (rawSerie === 'Biserie') tipo = 'BISERIE';
      else if (rawSerie === 'Triserie') tipo = 'TRISERIE';
      else if (rawSerie === 'Circuito') tipo = 'SERIE GIGANTE / CIRCUITO';
      else if (!isBlockType && count === 2) tipo = 'BISERIE';
      else if (!isBlockType && count === 3) tipo = 'TRISERIE';

      let indicacion = '';
      if (tipo === 'BISERIE' || tipo === 'TRISERIE') {
        const rondas = tipo === 'BISERIE' ? '2' : '3';
        const reps = exGroup[0]?.reps || '—';
        const descanso = exGroup[0]?.descanso || exGroup[0]?.pausa || '—';
        indicacion = `${rondas} rondas x ${reps} reps c/u • ${descanso} entre rondas`;
      } else if (tipo === 'SERIE GIGANTE / CIRCUITO') {
        const descanso = exGroup[0]?.descanso || exGroup[0]?.pausa || '—';
        indicacion = `Circuito • ${descanso} entre estaciones`;
      }

      const ejercicios: PatientEjercicio[] = exGroup.map((ex, idx) => ({
        codigo: ex.secuencia || `${letter}${idx + 1}`,
        nombre: ex.ejercicio || '—',
        badgeTecnica: ex.tecnica || '',
        prescripcion: formatearPrescripcion(ex),
        subtipo: ex.tipo || 'Normal',
        series: (ex.sets || ex.serie || '1').toString().trim(),
        semana1: ex.semana1 || '',
        semana2: ex.semana2 || '',
        semana3: ex.semana3 || '',
        semana4: ex.semana4 || '',
        s1: ex.s1 || ex.semana1 || '',
        s2: ex.s2 || ex.semana2 || '',
        s3: ex.s3 || ex.semana3 || '',
        s4: ex.s4 || ex.semana4 || '',
        tecnica: ex.tecnica || '',
        rir: ex.rir || '',
        descanso: ex.descanso || ex.pausa || '',
        musculo: ex.musculo || '',
        movimiento: ex.movimiento || '',
        peso: ex.peso || '',
        video: ex.video || '',
        notas: ex.notas || '',
      }));

      return { letra: letter, tipo, indicacion, ejercicios };
    });

    fases.push({
      id: 'PRINCIPAL',
      nombre: FASE_LABELS['PRINCIPAL'],
      badgeColor: FASE_COLORS['PRINCIPAL'],
      bloques,
      grupo: 'main',
    });
  }

  // ABD fase (abdominal exercises)
  if (abdominalExs.length > 0) {
    const abGroups: Record<string, any[]> = {};
    const abOrder: string[] = [];
    abdominalExs.forEach((ej: any) => {
      const blockLetter = (ej.blockLetter || '').trim();
      const seqLetter = (ej.secuencia || '').match(/^([A-Z])/)?.[1];
      const letter = blockLetter || seqLetter || 'A';
      if (!abGroups[letter]) {
        abGroups[letter] = [];
        abOrder.push(letter);
      }
      abGroups[letter].push(ej);
    });

    Object.keys(abGroups).forEach((letter) => {
      abGroups[letter].sort((a, b) => {
        const posA = parseInt(a.blockPosition) || 0;
        const posB = parseInt(b.blockPosition) || 0;
        if (posA && posB) return posA - posB;
        return 0;
      });
    });

    const bloques: PatientBloque[] = abOrder.map((letter) => {
      const exGroup = abGroups[letter];
      const count = exGroup.length;
      const rawSerie = exGroup[0]?.blockSerie || exGroup[0]?.serie || '';
      const isBlockType = ['Simple', 'Biserie', 'Triserie', 'Circuito', 'Cardio'].includes(rawSerie);
      let tipo: BloqueTipo = 'SERIE SIMPLE';
      if (rawSerie === 'Biserie') tipo = 'BISERIE';
      else if (rawSerie === 'Triserie') tipo = 'TRISERIE';
      else if (rawSerie === 'Circuito') tipo = 'SERIE GIGANTE / CIRCUITO';
      else if (!isBlockType && count === 2) tipo = 'BISERIE';
      else if (!isBlockType && count === 3) tipo = 'TRISERIE';

      const ejercicios: PatientEjercicio[] = exGroup.map((ex, idx) => ({
        codigo: ex.secuencia || `${letter}${idx + 1}`,
        nombre: ex.ejercicio || '—',
        badgeTecnica: ex.tecnica || '',
        prescripcion: formatearPrescripcion(ex),
        subtipo: ex.tipo || 'Normal',
        series: (ex.sets || ex.serie || '1').toString().trim(),
        semana1: ex.semana1 || '',
        semana2: ex.semana2 || '',
        semana3: ex.semana3 || '',
        semana4: ex.semana4 || '',
        s1: ex.s1 || ex.semana1 || '',
        s2: ex.s2 || ex.semana2 || '',
        s3: ex.s3 || ex.semana3 || '',
        s4: ex.s4 || ex.semana4 || '',
        tecnica: ex.tecnica || '',
        rir: ex.rir || '',
        descanso: ex.descanso || ex.pausa || '',
        musculo: ex.musculo || '',
        movimiento: ex.movimiento || '',
        peso: ex.peso || '',
        video: ex.video || '',
        notas: ex.notas || '',
        reps: ex.reps || '',
      }));
      return {
        letra: letter,
        tipo: tipo,
        indicacion: '',
        ejercicios,
      };
    });

    fases.push({
      id: 'ABD',
      nombre: FASE_LABELS['ABD'],
      badgeColor: FASE_COLORS['ABD'],
      bloques,
      grupo: 'main',
    });
  }

  return fases;
};


const parseMacro = (val: any): string => {
  if (!val) return '-';
  const m = String(val).match(/(\d+)/);
  return m ? m[1] : '-';
};

const parseStatNumber = (val: any): number | undefined => {
  if (typeof val === 'number') return val;
  if (!val) return undefined;
  const m = String(val).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
};

const getEvolutionValue = (cells: EvolutionCells | undefined, consultas: string[] | undefined, key: string): number | undefined => {
  if (!cells || !consultas || !consultas.length) return undefined;
  for (let i = consultas.length - 1; i >= 0; i--) {
    const c = consultas[i];
    if (cells[c] && typeof cells[c][key] === 'number') {
      return cells[c][key];
    }
  }
  return undefined;
};

const getEvolutionPrevious = (cells: EvolutionCells | undefined, consultas: string[] | undefined, key: string): number | undefined => {
  if (!cells || !consultas || consultas.length < 2) return undefined;
  for (let i = consultas.length - 2; i >= 0; i--) {
    const c = consultas[i];
    if (cells[c] && typeof cells[c][key] === 'number') {
      return cells[c][key];
    }
  }
  return undefined;
};

export default function usePatientData(editorData: AppData): ClientPlan {
  return useMemo(() => {
    const {
      person,
      calendar = [],
      warmup,
      routines = [],
      meals = [],
      supplements = [],
      stats = {},
      nutrition = {},
      training = {},
      feedback = {},
      diagnosis = {},
      objectives = {},
      habits,
      evolution,
      fechaConsulta,
      proximaConsulta,
      supplementsStrategy,
    } = editorData || {};

    const routinesByDay: Record<string, DayRoutine> = {};
    const mappedSupps: SupplementClient[] = [];
    const calendarList = Array.isArray(calendar) ? calendar : [];

    if (!calendarList.length) {
      DAY_MAP.forEach(({ key, dia }) => {
        routinesByDay[key] = {
          tipo: 'rest',
          actividad: '',
          titulo: 'Sin actividad',
          subtitulo: 'Descanso',
          fases: [],
        } as DayRoutine;
      });
    } else {
      DAY_MAP.forEach(({ key, dia }, idx) => {
        let calDay = calendarList.find((c) => c && typeof c === 'object' && c.dia === dia);
        if (!calDay && calendarList[idx]) {
          calDay = { ...calendarList[idx], dia, dayKey: key };
        }
        const actividad = calDay?.actividad || '';
        const tipo = getDayType(actividad);
        let routine = null;
        if (calDay?.routineId) {
          routine = (routines || []).find((r) => r.id === calDay?.routineId);
        }
        if (!routine && (calDay?.actividad || '').trim()) {
          const actividad = (calDay?.actividad || '').trim();
          routine = (routines || []).find((r) => (r.nombre || '').trim() === actividad);
        }
        if (!routine && (calDay?.actividad || '').trim().toLowerCase() !== 'descanso') {
          const actividad = (calDay?.actividad || '').trim().toLowerCase();
          routine = (routines || []).find((r) => (r.nombre || '').trim().toLowerCase() === actividad);
        }

        const subtipo = tipo === 'lower' ? 'Lower Body' : tipo === 'upper' ? 'Upper Body' : tipo === 'full' ? 'Full Body' : 'Descanso';

        routinesByDay[key] = {
           tipo,
           actividad: actividad || 'Sin actividad',
           titulo: routine?.nombre || routine?.label || actividad || 'Sin rutina',
          subtitulo: subtipo,
          fases: organizarEnFases(
            routine || null,
            warmup || [],
            tipo
          ),
        } as DayRoutine;
      });
    }

    const mappedSupplements: SupplementClient[] = (supplements || []).map((s) => ({
      nombre: s.nombre || s.suplemento || 'Suplemento',
      dosis: s.gramos || s.dosis || '',
      hora: s.horario || s.hora || '',
      tiempo: s.tiempo || '',
      frecuencia: s.frecuencia || '',
      tomarCon: s.tomarCon || '',
      notas: s.notas || '',
      gramos: s.gramos || '',
      porcion: s.porcion || '',
      cantidad: s.cantidad || '',
      marca: s.marca || '',
    }));

    const evolutionCells = evolution?.cells || {};
    const evolutionConsultas = evolution?.consultas || [];

    let pesoActual: string | number = person?.pesoIni || '-';
    for (let i = evolutionConsultas.length - 1; i >= 0; i--) {
      const c = evolutionConsultas[i];
      if (evolutionCells[c] && typeof evolutionCells[c].peso === 'number') {
        pesoActual = evolutionCells[c].peso;
        break;
      }
    }
    const pesoAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'peso') ?? parseStatNumber(person?.pesoIni) ?? 0;
    const pesoDelta = (pesoActual !== '-' && pesoAnterior !== '-') ? parseFloat(String(pesoActual)) - parseFloat(String(pesoAnterior)) : 0;

    const abdomenActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'abdomen') ?? parseStatNumber(stats?.abdomen) ?? 0;
    const abdomenAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'abdomen') ?? parseStatNumber(stats?.abdomen) ?? 0;
    const abdomenDelta = abdomenActual - abdomenAnterior;

    const grasaKgActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'grasaKg') ?? parseStatNumber(stats?.grasaKg) ?? 0;
    const grasaKgAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'grasaKg') ?? parseStatNumber(stats?.grasaKg) ?? 0;
    const grasaKgDelta = grasaKgActual - grasaKgAnterior;

    const grasaPctActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'grasa_pct') ?? parseStatNumber(stats?.grasaPorc) ?? 0;
    const grasaPctAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'grasa_pct') ?? parseStatNumber(stats?.grasaPorc) ?? 0;
    const grasaPctDelta = grasaPctActual - grasaPctAnterior;

    const pliegueActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'pliegue') ?? parseStatNumber(stats?.pliegue) ?? 0;
    const pliegueAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'pliegue') ?? parseStatNumber(stats?.pliegue) ?? 0;
    const pliegueDelta = pliegueActual - pliegueAnterior;

    const avances = {
      peso: { label: '(KG) PESO', anterior: String(pesoAnterior), actual: String(pesoActual), delta: pesoDelta } as AvancePeso,
      abdomen: { label: 'ABDOMEN', anterior: String(abdomenAnterior), actual: String(abdomenActual), delta: abdomenDelta },
      grasaKg: { label: 'GRASA (KG)', anterior: String(grasaKgAnterior), actual: String(grasaKgActual), delta: grasaKgDelta },
      grasaPct: { label: 'GRASA (%)', anterior: String(grasaPctAnterior), actual: String(grasaPctActual), delta: grasaPctDelta },
      pliegue: { label: 'PLIEGUE', anterior: String(pliegueAnterior), actual: String(pliegueActual), delta: pliegueDelta },
    };

    const estadisticas: EstadisticasClient = {
      adherencia: Number(stats?.adherencia) || 0,
      nutricion: Number(stats?.nutricion) || 0,
      entrenamiento: Number(stats?.entreno) || 0,
      cardio: Number(stats?.cardio) || 0,
      descanso: Number(stats?.descanso) || 0,
    };

    const tratamientoNutricional: TratamientoNutricional = {
      estrategia: nutrition.estrategia || '-',
      kcal: String(nutrition.kcal || '-'),
      proteina: parseMacro(nutrition.prot),
      carbos: parseMacro(nutrition.carbs),
      grasas: parseMacro(nutrition.grasas),
    };

    const tratamientoEntrenamiento: TratamientoEntrenamiento = {
      estrategia: training.estrategia || '-',
      dias: String(training.dias || '-'),
      cardio: String(training.cardio || '-'),
      pasos: String(person?.pasos || '-'),
      rir: String(training.rir || ''),
      indic: String(training.indic || ''),
    };

    const clinico: Clinico = {
      retroalimentacion: [feedback.r1, feedback.r2, feedback.r3].filter(Boolean).length ? [feedback.r1, feedback.r2, feedback.r3].filter(Boolean) : ['Sin datos'],
      diagnostico: [diagnosis.d1, diagnosis.d2, diagnosis.d3].filter(Boolean).length ? [diagnosis.d1, diagnosis.d2, diagnosis.d3].filter(Boolean) : ['Sin datos'],
      objetivos: [objectives.o1, objectives.o2, objectives.o3].filter(Boolean).length ? [objectives.o1, objectives.o2, objectives.o3].filter(Boolean) : ['Sin datos'],
    };

    const proximaConsultaFormatted = (() => {
      if (proximaConsulta) {
        const date = parseFechaConsulta(proximaConsulta);
        if (date) return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      const date = parseFechaConsulta(fechaConsulta);
      if (!date) return null;
      const next = new Date(date);
      next.setDate(next.getDate() + 28);
      return next.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    const proximaConsultaVencida = isConsultaVencida(fechaConsulta);

    const mappedMeals: MealClient[] = (meals || []).map((meal) => normalizeMeal(meal));

    return {
      person: {
        nombre: person?.nombre || 'Paciente',
        objetivo: person?.objetivo || '',
        pasos: person?.pasos,
        edad: person?.edad,
        sexo: person?.sexo,
      },
      calendar: (calendar || []).map((c, idx) => {
        const diaUpper = String(c?.dia || '').trim().toUpperCase();
        const dayKeyMap = {
          LUNES: 'monday', MARTES: 'tuesday', MIERCOLES: 'wednesday', MIÉRCOLES: 'wednesday',
          JUEVES: 'thursday', VIERNES: 'friday', SABADO: 'saturday', SÁBADO: 'saturday', DOMINGO: 'sunday'
        };
        const mapEntry = DAY_MAP[idx];
        const dayKey = c?.dayKey || dayKeyMap[diaUpper] || (diaUpper ? diaUpper.toLowerCase() : '') || mapEntry?.key || '';
        const dia = c?.dia || mapEntry?.dia || '';
        return {
          dia,
          dayKey,
          actividad: c?.actividad || '',
          routineId: c?.routineId || null,
          cardio: c?.cardio || '',
          fc: c?.fc || '',
          pasos: c?.pasos || '',
        };
      }),
      meals: mappedMeals,
      routines: routinesByDay,
      supplements: mappedSupplements,
      stats: {
        adherencia: Number(stats?.adherencia) || 0,
      },
      avances,
      estadisticas,
      tratamientoNutricional,
      tratamientoEntrenamiento,
      clinico,
      proximaConsulta: proximaConsultaFormatted,
      proximaConsultaVencida,
      warmupUpper: buildWarmupFases(flattenWarmup((warmup || []).filter((e) => e.grupo === 'upper')), 'upper'),
      warmupLower: buildWarmupFases(flattenWarmup((warmup || []).filter((e) => e.grupo === 'lower')), 'lower'),
      warmupGeneral: buildWarmupFases(flattenWarmup((warmup || []).filter((e) => e.grupo === 'general')), 'general'),
      fechaConsulta: String(fechaConsulta || ''),
      habits: (() => {
        if (habits && typeof habits === 'object' && !Array.isArray(habits) && Object.keys(habits).length > 0) return habits as Record<string, string>;
        const p = person || {};
        const out: Record<string, string> = {};
        const map = [
          ['tabaquismo', 'tabaco'], ['alcohol', 'alcohol'], ['cafe', 'cafe'],
          ['bebidasAzucaradas', 'azucar'], ['drogasMed', 'drogas'], ['anabolicos', 'ana'],
          ['preEntreno', 'pre'], ['energeticas', 'energ']
        ];
        map.forEach(([hKey, pKey]) => { if (p[pKey]) out[hKey] = p[pKey]; });
        return out;
      })(),
      supplementsStrategy: String(supplementsStrategy || ''),
    };
  }, [editorData]);
}
