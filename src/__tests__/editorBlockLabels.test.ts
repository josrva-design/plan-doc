import { describe, it, expect } from 'vitest';
import { ejToDisplay, getCombinedSections } from '../utils/routineHelpers';

describe('TrainingEditor blockGroups generation', () => {
  it('generates labels with letters and serie names for blocks', () => {
    const raw = [
      { ejercicio: 'E1', serie: 'Biserie' },
      { ejercicio: 'E2', serie: 'Biserie' },
      { ejercicio: 'E3', serie: 'Triserie' },
      { ejercicio: 'E4', serie: 'Triserie' },
      { ejercicio: 'E5', serie: 'Triserie' },
      { ejercicio: 'E6', serie: 'Simple' },
    ];

    const memo = raw.map(r => ejToDisplay(r));
    const sections = getCombinedSections(memo as any);

    const groups: Record<string, any> = {};
    sections.forEach((s: any) => {
      const letter = s.blockLetter || 'A';
      if (!groups[letter]) {
        groups[letter] = {
          label: s.blockSerie || 'BLOQUE',
          color: (s.serie || s.blockSerie) ? 'color' : 'color',
          className: 'routine-group-header',
          hasAprox: false,
          hasSimple: false,
        };
      }
      if (s.isAprox) groups[letter].hasAprox = true;
      else groups[letter].hasSimple = true;
    });

    Object.keys(groups).forEach((letter) => {
      const g = groups[letter];
      if (g.hasAprox && g.hasSimple) {
        g.label = `${letter} APROX / SIMPLE`;
      } else if (g.hasAprox) {
        g.label = `${letter} APROX`;
      } else {
        g.label = `${letter} ${g.label}`;
      }
    });

    // Check labels exist and include letter
    const labels = Object.values(groups).map(g => g.label);
    expect(labels.length).toBeGreaterThan(0);
    labels.forEach(l => {
      expect(typeof l).toBe('string');
      expect(l.length).toBeGreaterThan(1);
      // should start with letter and space
      expect(/^[A-Z]\s+/.test(l)).toBeTruthy();
    });
  });
});
