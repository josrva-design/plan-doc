import { describe, it, expect } from 'vitest';
import { normalizeFood, normalizeMeal } from '../utils/normalizeEditorData';

describe('normalizeEditorData', () => {
  it('normalizeFood parses grams and macros correctly', () => {
    const raw = {
      nombre: 'Arroz',
      gramos: '100',
      p: '2',
      c: '28',
      g: '0.5',
      kcal: '130',
      porcion: '1 taza'
    };
    const n = normalizeFood(raw);
    expect(n.name).toBe('Arroz');
    expect(String(n.grams)).toContain('100');
    expect(n.macros.proteinas).toBeGreaterThan(0);
    expect(n.kcal).toBe(130);
    expect(n.porcion).toBe('1 taza');
  });

  it('normalizeMeal maps foods with normalizeFood', () => {
    const meal = {
      id: 'm1',
      foods: [{ nombre: 'Pechuga', gramos: '150', p: 30, c: 0, g: 3 }]
    };
    const nm = normalizeMeal(meal);
    expect(Array.isArray(nm.foods)).toBe(true);
    expect(nm.foods[0].name).toBe('Pechuga');
    expect(nm.foods[0].macros.proteinas).toBeGreaterThan(0);
  });
});
