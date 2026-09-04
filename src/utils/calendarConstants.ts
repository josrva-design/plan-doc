/**
 * Constantes y normalización centralizada del calendario semanal.
 *
 * Estas constantes son la FUENTE ÚNICA de verdad para los días de la semana
 * en toda la aplicación. Tanto el modo dev (mockPacienteCompleto) como el
 * modo normal (entrada manual del nutriólogo) deben pasar por la
 * normalización en `normalizeCalendar` para garantizar que el editor
 * siempre trabaje con 7 entradas completas (una por día de la semana).
 */

import type { CalendarDay } from '../core/types';

export const DAY_KEYS: readonly string[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DAY_LABELS: readonly string[] = [
  'LUNES',
  'MARTES',
  'MIÉRCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADO',
  'DOMINGO',
] as const;

/**
 * Crea un día de calendario vacío para el índice dado (0-6).
 */
export function createEmptyDay(index: number): CalendarDay {
  return {
    dia: DAY_LABELS[index] || `Día ${index + 1}`,
    dayKey: DAY_KEYS[index] || `day-${index}`,
    actividad: '',
    routineId: null,
  };
}

/**
 * Normaliza el calendario a exactamente 7 entradas, una por día de la semana.
 *
 * Esta función es el ÚNICO punto donde se decide la estructura del calendario.
 * Garantiza que sin importar la fuente de datos (mock, manual, autosave, import),
 * el editor siempre reciba:
 *   - 7 entradas (índices 0-6)
 *   - Cada entrada tiene `dia` y `dayKey` poblados
 *   - Se preserva `actividad` y `routineId` de entradas existentes
 *
 * @param raw - Calendar en cualquier formato (puede ser undefined, [], o parcial)
 * @returns Calendar normalizado con exactamente 7 entradas
 */
export function normalizeCalendar(raw: any[] | undefined | null): CalendarDay[] {
  const safe = Array.isArray(raw) ? raw : [];
  return DAY_KEYS.map((_, idx) => {
    const existing = safe[idx] || {};
    return {
      dia: existing.dia || DAY_LABELS[idx],
      dayKey: existing.dayKey || DAY_KEYS[idx],
      actividad: existing.actividad ?? '',
      routineId: existing.routineId ?? null,
    };
  });
}
