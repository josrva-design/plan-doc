import { describe, it, expect } from 'vitest';
import { normalizeFood } from '../utils/normalizeEditorData';

describe('normalizeFood edge cases', () => {
  it('parses grams with g suffix and commas', () => {
    const raw = { nombre: 'Quinoa', gramos: '1,5g', p: '4.5', c: '21.3', g: '1.9', kcal: '120' };
    const n = normalizeFood(raw);
    expect(n.name).toBe('Quinoa');
    // grams should parse to '1.5' or contain '1.5'
    expect(String(n.grams)).toContain('1.5');
    expect(n.macros.proteinas).toBeCloseTo(4.5);
    expect(n.kcal).toBe(120);
  });

  it('parses porcion with number and unit', () => {
    const raw = { nombre: 'Leche', porcion: '250 ml', p: 8, c: 12, g: 5, kcal: 150 };
    const n = normalizeFood(raw);
    expect(n.porcion).toBe('250 ml');
    expect(n.unit).toBe('ml');
    expect(n.cantidad).toBeGreaterThan(0);
  });

  it('handles porcion without number as unit', () => {
    const raw = { nombre: 'Salsa', porcion: 'cucharada', p: 0.5, c: 2, g: 0.1 };
    const n = normalizeFood(raw);
    expect(n.porcion).toBe('cucharada');
    expect(n.unit).toBe('cucharada');
  });

  it('falls back to zeros on invalid numbers', () => {
    const raw = { nombre: 'X', gramos: 'abc', p: 'n/a', c: null, g: undefined, kcal: 'NaN' };
    const n = normalizeFood(raw);
    expect(n.macros.proteinas).toBe(0);
    expect(n.macros.carbos).toBe(0);
    expect(n.macros.grasas).toBe(0);
    expect(n.kcal).toBe(0);
  });
});
