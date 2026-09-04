/**
 * Detección y métricas de cardio.
 *
 * Un día se considera "cardio" si:
 *   - Su campo `actividad` contiene la palabra "cardio" (texto libre), O
 *   - Su rutina vinculada contiene al menos un ejercicio con `tipo` = "Cardio" (explícito), O
 *   - Su rutina vinculada contiene al menos un ejercicio con `musculo` que empieza con "cardio"
 *
 * Esta lógica derivada evita depender solo del texto libre y previene
 * inconsistencias entre lo que el usuario escribe y la composición real de la rutina.
 */

import type { CalendarDay, EditorRoutine } from '../core/types';

export const isCardioMusculo = (musculo: string | undefined | null): boolean => {
  return String(musculo || '').toLowerCase().startsWith('cardio');
};

/**
 * Checks if an exercise is cardio by tipo field, falling back to musculo.
 */
export const isCardioExercise = (ej: any): boolean => {
  const tipo = String(ej?.tipo || '').toLowerCase();
  if (tipo === 'cardio') return true;
  if (tipo === 'normal') return false;
  // Fall back to musculo detection
  return isCardioMusculo(ej?.musculo);
};

export const isCardioDay = (
  day: Partial<CalendarDay> | undefined | null,
  routines: EditorRoutine[] | undefined | null
): boolean => {
  if (!day) return false;
  const act = String(day.actividad || '').toLowerCase();
  if (act.includes('cardio')) return true;
  if (!day.routineId) return false;
  const routine = (routines || []).find((r) => r.id === day.routineId);
  if (!routine || !Array.isArray(routine.ejercicios)) return false;
  return routine.ejercicios.some((ej) => isCardioExercise(ej));
};

/**
 * Suma el total de ejercicios (sesiones) de cardio programados en la semana.
 * Cuenta ejercicios en rutinas de días que son cardio.
 */
export const sumCardioSessions = (
  calendar: CalendarDay[] | undefined | null,
  routines: EditorRoutine[] | undefined | null
): number => {
  if (!calendar || !routines) return 0;
  return calendar.reduce((sum, day) => {
    if (!isCardioDay(day, routines)) return sum;
    if (!day.routineId) return sum;
    const routine = routines.find((r) => r.id === day.routineId);
    if (!routine || !Array.isArray(routine.ejercicios)) return sum;
    return sum + routine.ejercicios.length;
  }, 0);
};

/**
 * Cuenta los días únicos de cardio (para métricas que necesiten "días con cardio"
 * en lugar de "sesiones de cardio").
 */
export const countCardioDays = (
  calendar: CalendarDay[] | undefined | null,
  routines: EditorRoutine[] | undefined | null
): number => {
  if (!calendar) return 0;
  return calendar.filter((day) => isCardioDay(day, routines)).length;
};
