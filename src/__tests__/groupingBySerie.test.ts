import { describe, it, expect } from 'vitest';
import { getCombinedSections } from '../utils/routineHelpers';

describe('Grouping by serie selector (getCombinedSections)', () => {
  it('agrupa por serie: Biserie, Triserie y Simple con letras y posiciones correctas', () => {
    const items = [
      { uid: 'a1', ejercicio: 'E1', serie: 'Biserie' },
      { uid: 'a2', ejercicio: 'E2', serie: 'Biserie' },
      { uid: 'b1', ejercicio: 'E3', serie: 'Triserie' },
      { uid: 'b2', ejercicio: 'E4', serie: 'Triserie' },
      { uid: 'b3', ejercicio: 'E5', serie: 'Triserie' },
      { uid: 'c1', ejercicio: 'E6', serie: 'Simple' },
    ];

    const combined = getCombinedSections(items as any);

    // Debe mantener el orden y asignar letras A, B, C por cada grupo
    const e1 = combined.find((c: any) => c.ejercicio === 'E1');
    const e2 = combined.find((c: any) => c.ejercicio === 'E2');
    const e5 = combined.find((c: any) => c.ejercicio === 'E5');
    const e6 = combined.find((c: any) => c.ejercicio === 'E6');

    expect(e1).toBeDefined();
    expect(e2).toBeDefined();
    expect(e5).toBeDefined();
    expect(e6).toBeDefined();

    // Los dos primeros pertenecen al mismo bloque (A) y sus posiciones deben ser 1 y 2
    expect(e1.blockLetter).toBe('A');
    expect(e2.blockLetter).toBe('A');
    expect(e1.blockPosition).toBe(1);
    expect(e2.blockPosition).toBe(2);

    // Los tres siguientes (Triserie) deben compartir letra B y posiciones 1..3
    expect(e5.blockLetter).toBe('B');
    const triserieGroup = combined.filter((c: any) => c.blockLetter === 'B');
    expect(triserieGroup.map((g: any) => g.ejercicio)).toEqual(['E3','E4','E5']);

    // El último ejercicio debe quedar en el bloque C con position 1
    expect(e6.blockLetter).toBe('C');
    expect(e6.blockPosition).toBe(1);
  });
});
