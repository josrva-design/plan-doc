import { describe, it, expect } from 'vitest';
import { renderCalendario } from '../services/exportRenderers';

describe('renderCalendario', () => {
  it('muestra los días incluso sin rutinas', () => {
    const out = renderCalendario({ calendar: [], routines: {}, esc: (s) => String(s) });
    expect(out).toContain('LUN');
    expect(out).toContain('0 ejercicios');
  });

  it('renderiza ejercicios cuando hay rutinas definidas', () => {
    const routines = {
      monday: {
        actividad: 'Full',
        fases: [
          { id: 'F1', nombre: 'Fase 1', grupo: 'pierna', bloques: [{ letra: 'A', tipo: '', ejercicios: [{ nombre: 'Sentadilla', codigo: 'A1', s1: '3' }] }] },
        ],
      },
    };
    const out = renderCalendario({ calendar: [], routines, esc: (s) => String(s) });
    expect(out).toContain('Sentadilla');
    expect(out).toContain('1 ejercicios');
    expect(out).toContain('Fase 1');
  });
});
