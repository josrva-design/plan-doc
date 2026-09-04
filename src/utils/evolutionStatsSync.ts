import type { EvolutionData } from '../core/types';

/**
 * Sincroniza stats desde la última consulta de evolution.
 *
 * Devuelve un objeto parcial con los valores a actualizar en stats,
 * o null si no hay nada que sincronizar.
 *
 * Reglas:
 *  - Solo se copian valores numéricos finitos de cell.
 *  - El campo "adherencia" se recalcula como promedio redondeado
 *    de los componentes disponibles (nutricion, entreno, cardio, descanso).
 *  - Si no hay componentes, "adherencia" no se sobrescribe desde acá;
 *    lo que venga del cell se respeta.
 */
export function computeStatsFromEvolution(evolution: EvolutionData | null | undefined): Partial<Record<string, number>> | null {
  if (!evolution || !evolution.cells || !evolution.consultas || !evolution.consultas.length) {
    return null;
  }

  const lastConsulta = evolution.consultas[evolution.consultas.length - 1];
  const cell = evolution.cells[lastConsulta];
  if (!cell) {
    return null;
  }

  const adherenceKeys = ['adherencia', 'nutricion', 'entreno', 'cardio', 'descanso'];
  const next: Record<string, number> = {};

  adherenceKeys.forEach((key) => {
    const raw = (cell as Record<string, unknown>)[key];
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      next[key] = raw;
    }
  });

  if (Object.keys(next).length === 0) {
    return null;
  }

  const components = [next.nutricion, next.entreno, next.cardio, next.descanso].filter(
    (v) => typeof v === 'number' && Number.isFinite(v),
  );
  const promedio = components.length
    ? Math.round(components.reduce((s, v) => s + v, 0) / components.length)
    : undefined;

  if (promedio !== undefined) {
    next.adherencia = promedio;
  }

  return next;
}
