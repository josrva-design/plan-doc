import { describe, it, expect } from 'vitest';
import { computeState } from '../hooks/useAppData';

describe('useAppData - computeState', () => {
  it('normaliza routines cuando se pasa un objeto y asigna id con la key', () => {
    const input = { routines: { lunes: { nombre: 'Rutina L', ejercicios: [] } } };
    const st = computeState(input as any);
    expect(Array.isArray(st.routines)).toBe(true);
    expect(st.routines.length).toBeGreaterThan(0);
    expect(st.routines[0].id).toBe('lunes');
    expect(st.routines[0].nombre).toBe('Rutina L');
  });

  it('normaliza warmup movilidad_old a formato plano', () => {
    const input = { warmup: { general: [{ uid: 'g1', tipo: 'Cardio', ejercicio: 'Caminadora', sets: '', reps: '5 MIN', pausa: '', notas: '', video: '_', grupo: 'general', blockLetter: 'A', blockSerie: 'Simple', blockPosition: 1 }], movilidad_old: ['mov1'] } };
    const st = computeState(input as any);
    expect(Array.isArray(st.warmup)).toBe(true);
    expect(st.warmup.length).toBeGreaterThan(0);
    expect(st.warmup.some((e: any) => e.ejercicio === 'Caminadora')).toBe(true);
    expect(st.warmup.some((e: any) => e.ejercicio === 'mov1')).toBe(true);
  });
});
