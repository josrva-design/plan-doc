import { describe, it, expect } from 'vitest';
import { ejToDisplay, groupSeries, getCombinedSections, recalcularBloques } from '../utils/routineHelpers';

describe('routineHelpers additional cases', () => {
  it('ejToDisplay extracts percentage from name and tecnica', () => {
    const raw = { ejercicio: 'Sentadilla (75%)', tecnica: 'Control (75%)', semana1: '3', s2: '3' };
    const d = ejToDisplay(raw);
    expect(d.ejercicio).toBe('Sentadilla');
    expect(d.aproxPorcentaje).toBe(75);
    expect(d.tecnica).toBe('Control');
  });

  it('groupSeries splits different serie types correctly', () => {
    const items = [
      { serie: 'Simple' }, { serie: 'Simple' }, { serie: 'Biserie' }, { serie: 'Simple' },
      { serie: 'Triserie' }, { serie: 'Triserie' }, { serie: 'Triserie' }, { serie: 'Triserie' }
    ];
    const g = groupSeries(items);
    expect(g.some(gr => gr.serie === 'Aprox')).toBe(false);
    // groups length should be at least 3
    expect(g.length).toBeGreaterThanOrEqual(3);
  });

  it('getCombinedSections assigns block letters and flags', () => {
    const items = [
      { ejercicio: 'A (50%)', aproxBase: true },
      { ejercicio: 'A' },
      { ejercicio: 'B (50%)', aproxBase: true },
      { ejercicio: 'B' },
    ].map(e => ejToDisplay(e));
    const combined = getCombinedSections(items);
    expect(combined.length).toBeGreaterThan(0);
    expect(combined[0]).toHaveProperty('blockLetter');
    expect(combined[0].isOption !== undefined).toBe(true);
  });

  it('recalcularBloques handles groups and sequences', () => {
    const items = [
      { ejercicio: 'Press (50%)', tecnica: 'T' },
      { ejercicio: 'Press (75%)', tecnica: 'T' },
      { ejercicio: 'Pull', tecnica: 'T' },
      { ejercicio: 'Pull', tecnica: 'T' }
    ].map((i) => ejToDisplay(i));
    const out = recalcularBloques(items);
    expect(out.length).toBe(4);
    // Check sequence format and that aprox flags exist
    expect(out[0].secuencia).toMatch(/^[A-Z]\d+$/);
    const aproxCount = out.filter(o => o.isAprox).length;
    expect(aproxCount).toBeGreaterThanOrEqual(1);
  });

  it('groupSeries usa blockSerie cuando serie esta vacio', () => {
    const items = [
      { blockSerie: 'Biserie', serie: '' },
      { blockSerie: 'Biserie', serie: '' },
      { blockSerie: 'Triserie', serie: '' },
      { blockSerie: 'Triserie', serie: '' },
      { blockSerie: 'Triserie', serie: '' },
    ];
    const g = groupSeries(items);
    expect(g.map(gr => gr.serie)).toEqual(['Biserie', 'Triserie']);
    expect(g[0].items.length).toBe(2);
    expect(g[1].items.length).toBe(3);
  });

  it('getCombinedSections propaga blockSerie a todos los ejercicios del bloque', () => {
    const items = [
      { ejercicio: 'E1', blockSerie: 'Biserie', serie: '' },
      { ejercicio: 'E2', blockSerie: 'Biserie', serie: '' },
      { ejercicio: 'E3', blockSerie: 'Triserie', serie: '' },
    ].map(e => ejToDisplay(e));
    console.log('items:', JSON.stringify(items.map(i => ({ blockSerie: i.blockSerie, serie: i.serie, categoria: i.categoria })), null, 2));
    const combined = getCombinedSections(items);
    console.log('combined:', JSON.stringify(combined.map(c => ({ blockSerie: c.blockSerie, serie: c.serie, blockLetter: c.blockLetter })), null, 2));
    expect(combined.map(c => c.blockSerie)).toEqual(['Biserie', 'Biserie', 'Triserie']);
    expect(combined.map(c => c.serie)).toEqual(['Biserie', 'Biserie', 'Triserie']);
  });
});
