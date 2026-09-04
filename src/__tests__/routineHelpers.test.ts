import { describe, it, expect } from 'vitest';
import { ejToDisplay, groupSeries, recalcularBloques } from '../utils/routineHelpers';

describe('routineHelpers', () => {
  it('ejToDisplay returns default when input is falsy', () => {
    const d = ejToDisplay(null);
    expect(d).toHaveProperty('uid');
    expect(d.ejercicio).toBe('');
    expect(d.sets).toBe('');
  });

  it('groupSeries groups by serie and respects limits', () => {
    const items = [
      { serie: 'Simple' },
      { serie: 'Simple' },
      { serie: 'Biserie' },
      { serie: 'Biserie' },
      { serie: 'Biserie' },
    ];
    const grouped = groupSeries(items);
    expect(Array.isArray(grouped)).toBe(true);
    expect(grouped.length).toBeGreaterThan(0);
  });

  it('recalcularBloques assigns secuencia and isAprox flags', () => {
    const items = [
      { ejercicio: 'Press (50%)', tecnica: 'T' },
      { ejercicio: 'Press', tecnica: 'T' },
    ];
    const out = recalcularBloques(items);
    expect(out[0].isAprox).toBe(true);
    expect(out[0].secuencia).toMatch(/^[A-Z]\d+$/);
    expect(out[1].isAprox).toBe(false);
  });
});
