import { describe, it, expect } from 'vitest';
import { groupExercisesBySequence, bloqueColor, formatRest, parseDate } from '../services/exportHelpers';

describe('exportHelpers', () => {
  it('groupExercisesBySequence agrupa por letra y mantiene orden', () => {
    const exs = [
      { secuencia: 'A2', nombre: 'B' },
      { secuencia: 'A1', nombre: 'A' },
      { secuencia: 'B1', nombre: 'C' },
    ];
    const groups = groupExercisesBySequence(exs);
    expect(groups.map(g => g.letra)).toEqual(['A', 'B']);
    expect(groups[0].ejercicios.map(e => e.secuencia)).toEqual(['A1', 'A2']);
  });

  it('bloqueColor devuelve color por defecto si no se reconoce', () => {
    expect(bloqueColor('unknown')).toBe('#0D2640');
    expect(bloqueColor()).toBe('#0D2640');
  });

  it('formatRest mapea tiempos conocidos', () => {
    expect(formatRest('60')).toBe('1 min');
    expect(formatRest('999')).toBe('999');
  });

  it('parseDate maneja formatos ISO y dd/mm/yy', () => {
    const d1 = parseDate('2026-08-21');
    expect(d1).not.toBeNull();
    const d2 = parseDate('21/08/2026');
    expect(d2).not.toBeNull();
    const d3 = parseDate('');
    expect(d3).toBeNull();
  });

  it('groupExercisesBySequence usa blockSerie/serie cuando tipo está vacío', () => {
    const exs = [
      { ejercicio: 'Biceps', blockSerie: 'Biserie', tipo: '', secuencia: 'A1' },
      { ejercicio: 'Tríceps', blockSerie: 'Biserie', tipo: '', secuencia: 'A2' },
      { ejercicio: 'Press', blockSerie: 'Triserie', tipo: '', secuencia: 'B1' },
      { ejercicio: 'Jalón', blockSerie: 'Triserie', tipo: '', secuencia: 'B2' },
      { ejercicio: 'Leg press', blockSerie: 'Triserie', tipo: '', secuencia: 'B3' },
      { ejercicio: 'Extensiones', blockSerie: 'Circuito', tipo: '', secuencia: 'C1' },
      { ejercicio: 'Hip thrust', blockSerie: 'Circuito', tipo: '', secuencia: 'C2' },
    ];
    const groups = groupExercisesBySequence(exs);
    expect(groups.map(g => g.tipo)).toEqual(['BISERIE', 'TRISERIE', 'SERIE GIGANTE / CIRCUITO']);
    expect(groups.map(g => g.letra)).toEqual(['A', 'B', 'C']);
  });
});
