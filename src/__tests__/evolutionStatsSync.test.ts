import { describe, it, expect } from 'vitest';
import { computeStatsFromEvolution } from '../utils/evolutionStatsSync';

describe('computeStatsFromEvolution', () => {
  it('devuelve null si evolution es null', () => {
    expect(computeStatsFromEvolution(null)).toBe(null);
  });

  it('devuelve null si evolution es undefined', () => {
    expect(computeStatsFromEvolution(undefined)).toBe(null);
  });

  it('devuelve null si no hay consultas', () => {
    const evolution = {
      dates: [],
      cells: {},
      consultas: [],
    };
    expect(computeStatsFromEvolution(evolution)).toBe(null);
  });

  it('devuelve null si la última consulta no tiene cell', () => {
    const evolution = {
      dates: ['01/01/2025'],
      cells: {},
      consultas: ['C1'],
    };
    expect(computeStatsFromEvolution(evolution)).toBe(null);
  });

  it('copia los valores numéricos y calcula el promedio de adherencia', () => {
    const evolution = {
      dates: ['01/01/2025'],
      cells: {
        C1: {
          nutricion: 80,
          entreno: 90,
          cardio: 70,
          descanso: 100,
        },
      },
      consultas: ['C1'],
    };
    const result = computeStatsFromEvolution(evolution);
    expect(result).toEqual({
      nutricion: 80,
      entreno: 90,
      cardio: 70,
      descanso: 100,
      adherencia: 85, // promedio: (80+90+70+100)/4 = 85
    });
  });

  it('redondea el promedio de adherencia', () => {
    const evolution = {
      dates: ['01/01/2025'],
      cells: {
        C1: {
          nutricion: 80,
          entreno: 90,
          cardio: 70,
          descanso: 81,
        },
      },
      consultas: ['C1'],
    };
    const result = computeStatsFromEvolution(evolution);
    // (80+90+70+81)/4 = 80.25 → 80
    expect(result?.adherencia).toBe(80);
  });

  it('ignora valores no numéricos en el cell', () => {
    const evolution = {
      dates: ['01/01/2025'],
      cells: {
        C1: {
          nutricion: 80,
          entreno: 'noventa', // string, se ignora
          cardio: null,        // null, se ignora
          descanso: 100,
        },
      },
      consultas: ['C1'],
    };
    const result = computeStatsFromEvolution(evolution);
    expect(result?.nutricion).toBe(80);
    expect(result?.entreno).toBeUndefined();
    expect(result?.cardio).toBeUndefined();
    expect(result?.descanso).toBe(100);
    // promedio con solo nutricion y descanso: (80+100)/2 = 90
    expect(result?.adherencia).toBe(90);
  });

  it('ignora NaN e Infinity', () => {
    const evolution = {
      dates: ['01/01/2025'],
      cells: {
        C1: {
          nutricion: 80,
          entreno: NaN,
          cardio: Infinity,
          descanso: 100,
        },
      },
      consultas: ['C1'],
    };
    const result = computeStatsFromEvolution(evolution);
    expect(result?.nutricion).toBe(80);
    expect(result?.entreno).toBeUndefined();
    expect(result?.cardio).toBeUndefined();
    expect(result?.descanso).toBe(100);
  });

  it('toma la última consulta cuando hay varias', () => {
    const evolution = {
      dates: ['01/01/2025', '15/01/2025'],
      cells: {
        C1: { nutricion: 50, entreno: 50, cardio: 50, descanso: 50 },
        C2: { nutricion: 90, entreno: 90, cardio: 90, descanso: 90 },
      },
      consultas: ['C1', 'C2'],
    };
    const result = computeStatsFromEvolution(evolution);
    expect(result?.nutricion).toBe(90);
    expect(result?.adherencia).toBe(90);
  });

  it('respeta adherencia del cell si no hay componentes', () => {
    // adherencia numérica en cell sin nutricion/entreno/cardio/descanso
    const evolution = {
      dates: ['01/01/2025'],
      cells: {
        C1: { adherencia: 75 },
      },
      consultas: ['C1'],
    };
    const result = computeStatsFromEvolution(evolution);
    expect(result?.adherencia).toBe(75);
  });

  it('devuelve null si cell no tiene ningún valor numérico de adherencia', () => {
    const evolution = {
      dates: ['01/01/2025'],
      cells: {
        C1: { peso: '70' }, // no es clave de adherencia
      },
      consultas: ['C1'],
    };
    expect(computeStatsFromEvolution(evolution)).toBe(null);
  });
});
