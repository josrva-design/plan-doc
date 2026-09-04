import type { WarmupExercise } from '../core/types.ts';

export interface WarmupPhase {
  fase: 'GENERAL' | 'MOVILIDAD' | 'ESPECÍFICO';
  opciones: Array<{
    ejercicio: string;
    detalle: string;
    tipo: string;
    grupo: string;
    blockLetter?: string;
    blockSerie?: string;
    blockPosition?: number;
    musculo?: string;
    movimiento?: string;
    sets?: string;
    reps?: string;
    pausa?: string;
    notas?: string;
    video?: string;
    uid?: string;
  }>;
  individuales: Array<{
    ejercicio: string;
    detalle: string;
    tipo: string;
    grupo: string;
    blockLetter?: string;
    blockSerie?: string;
    blockPosition?: number;
    musculo?: string;
    movimiento?: string;
    sets?: string;
    reps?: string;
    pausa?: string;
    notas?: string;
    video?: string;
    uid?: string;
  }>;
}

function formatDetalle(e: any): string {
  const parts = [e.sets, e.reps, e.pausa || e.descanso].filter(Boolean);
  if (!parts.length) return '—';
  return parts.join(' × ');
}

function toOp(e: any) {
  return {
    ejercicio: e.ejercicio || e.nombre || '',
    detalle: formatDetalle(e),
    tipo: e.tipo || '',
    grupo: e.grupo || '',
    blockLetter: e.blockLetter || '',
    blockSerie: e.blockSerie || e.tipo || 'Simple',
    blockPosition: e.blockPosition || 0,
    musculo: e.musculo || '',
    movimiento: e.movimiento || '',
    sets: e.sets || '',
    reps: e.reps || '',
    pausa: e.pausa || '',
    notas: e.notas || '',
    video: e.video || '',
    uid: e.uid || '',
  };
}

export function normalizeWarmupForEditor(raw: any): WarmupExercise[] {
  if (Array.isArray(raw)) {
    return raw.map((e) => ({
      uid: e.uid || 'wk-' + Math.random().toString(36).slice(2),
      tipo: e.tipo || 'Simple',
      ejercicio: e.ejercicio || e.nombre || '',
      sets: e.sets ?? e.serie ?? '',
      reps: e.reps ?? '',
      pausa: e.pausa ?? e.descanso ?? '',
      notas: e.notas ?? '',
      video: e.video ?? '_',
      grupo: e.grupo || 'general',
      fase: e.fase || '',
      blockLetter: e.blockLetter || '',
      blockSerie: e.blockSerie || e.tipo || 'Simple',
      blockPosition: e.blockPosition || 0,
      musculo: e.musculo || '',
      movimiento: e.movimiento || '',
    }));
  }

  const source = raw || {};
  const general = source.general ?? [];
  const movilidad = source.movilidad ?? source.movilidad_old ?? [];
  const especifico = source.especifico ?? source.específico ?? source.especifico_old ?? [];

  const toExercise = (e: any, grupo: 'general' | 'upper' | 'lower'): WarmupExercise => {
    if (typeof e === 'string') {
      return {
        uid: 'wk-' + Math.random().toString(36).slice(2),
        tipo: 'Simple',
        ejercicio: e,
        sets: '',
        reps: '',
        pausa: '',
        notas: '',
        video: '_',
        grupo,
        fase: e.fase || '',
        blockLetter: '',
        blockSerie: 'Simple',
        blockPosition: 0,
        musculo: '',
        movimiento: '',
      };
    }
    return {
      uid: e.uid || 'wk-' + Math.random().toString(36).slice(2),
      tipo: e.tipo || 'Simple',
      ejercicio: e.ejercicio || e.nombre || '',
      sets: e.sets ?? e.serie ?? '',
      reps: e.reps ?? '',
      pausa: e.pausa ?? e.descanso ?? '',
      notas: e.notas ?? '',
      video: e.video ?? '_',
      grupo,
      fase: e.fase || '',
      blockLetter: e.blockLetter || '',
      blockSerie: e.blockSerie || e.tipo || 'Simple',
      blockPosition: e.blockPosition || 0,
      musculo: e.musculo || '',
      movimiento: e.movimiento || '',
    };
  };

  return [
    ...general.map((e: any) => toExercise(e, 'general')),
    ...movilidad.map((e: any) => toExercise(e, 'upper')),
    ...especifico.map((e: any) => toExercise(e, 'lower')),
  ];
}

export function normalizeWarmupForExport(warmup: any): WarmupPhase[] {
  if (!warmup) return [];

  const exercises: WarmupExercise[] = Array.isArray(warmup)
    ? warmup
    : [
        ...(warmup.general ?? []).map((e: any) => ({ ...e, grupo: 'general' })),
        ...(warmup.movilidad ?? warmup.movilidad_old ?? []).map((e: any) => ({ ...e, grupo: 'upper' })),
        ...(warmup.especifico ?? warmup.específico ?? warmup.especifico_old ?? []).map((e: any) => ({ ...e, grupo: 'lower' })),
      ];

  // Group by grupo + fase
  const generalItems = exercises.filter((e) => e.grupo === 'general');
  const upperExercises = exercises.filter((e) => e.grupo === 'upper');
  const lowerExercises = exercises.filter((e) => e.grupo === 'lower');

  // Check if any exercise has a defined fase
  const hasFase = exercises.some((e) => e.fase === 'ED' || e.fase === 'CE');

  // Build phases in order, tracking which source each belongs to
  const phaseSources: Array<{ fase: WarmupPhase['fase']; source: WarmupExercise[] }> = [];

  if (generalItems.length) phaseSources.push({ fase: 'GENERAL', source: generalItems });

  if (hasFase) {
    // Group upper/lower by fase (ED = Movilidad, CE = Específico)
    const upperMovilidad = upperExercises.filter((e) => e.fase === 'ED');
    const upperEspecifico = upperExercises.filter((e) => e.fase === 'CE');
    const lowerMovilidad = lowerExercises.filter((e) => e.fase === 'ED');
    const lowerEspecifico = lowerExercises.filter((e) => e.fase === 'CE');

    if (upperMovilidad.length) phaseSources.push({ fase: 'MOVILIDAD', source: upperMovilidad });
    if (upperEspecifico.length) phaseSources.push({ fase: 'ESPECÍFICO', source: upperEspecifico });
    if (lowerMovilidad.length) phaseSources.push({ fase: 'MOVILIDAD', source: lowerMovilidad });
    if (lowerEspecifico.length) phaseSources.push({ fase: 'ESPECÍFICO', source: lowerEspecifico });
  } else {
    // Fallback: no fase defined, use original grouping (upper → MOVILIDAD, lower → ESPECÍFICO)
    if (upperExercises.length) phaseSources.push({ fase: 'MOVILIDAD', source: upperExercises });
    if (lowerExercises.length) phaseSources.push({ fase: 'ESPECÍFICO', source: lowerExercises });
  }

  return phaseSources.map(({ fase, source }) => ({
    fase,
    opciones: source.slice(0, 3).map(toOp),
    individuales: source.slice(3).map(toOp),
  }));
}