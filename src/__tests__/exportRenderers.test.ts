import { describe, it, expect } from 'vitest';
import { renderInfoNutricional, renderTratamientoDeportivo } from '../services/exportRenderers';

describe('exportRenderers - renderInfoNutricional', () => {
  it('devuelve vacío cuando no hay datos', () => {
    const out = renderInfoNutricional({
      tNutri: {},
      meals: [],
      getMealTotalKcal: () => 0,
      getMealTotalMacros: () => ({ p: 0, c: 0, g: 0 }),
      COLORS: { green: '#2E9E70', navy: '#0D2640', blue: '#0066CC' },
      esc: (s) => String(s),
      metricCard: () => 'METRIC'
    });
    expect(out).toBe('');
  });

  it('renderiza estrategia, kcal y macros cuando hay datos', () => {
    const meals = [{ id: 'm1' }, { id: 'm2' }];
    const getMealTotalKcal = (m) => (m.id === 'm1' ? 400 : 350);
    const getMealTotalMacros = (m) => (m.id === 'm1' ? { p: 20, c: 40, g: 10 } : { p: 10, c: 30, g: 5 });
    const metricCard = (label, value) => `<<${label}:${value}>>`;
    const out = renderInfoNutricional({
      tNutri: { estrategia: 'Mantener peso', suple: 'Proteína' },
      meals,
      getMealTotalKcal,
      getMealTotalMacros,
      COLORS: { green: '#2E9E70', navy: '#0D2640', blue: '#0066CC' },
      esc: (s) => String(s),
      metricCard,
    });

    expect(out).toContain('Mantener peso');
    expect(out).toContain('<<KCAL:750>>');
    expect(out).toContain('<<PROTEÍNA:30P>>');
    expect(out).toContain('<<CARBO:70C>>');
    expect(out).not.toContain('Suplementación recomendada');
  });
});

describe('exportRenderers - renderTratamientoDeportivo', () => {
  it('devuelve vacío cuando no hay estrategia ni dias', () => {
    const out = renderTratamientoDeportivo({ tEntre: {}, dias: 0, cardio: '—', volumen: 0, COLORS: {}, esc: (s) => s, metricCard: () => '' });
    expect(out).toBe('');
  });

  it('renderiza estrategia y metric cards con volumen calculado', () => {
    const metricCard = (label, value) => `<<${label}:${value}>>`;
    const out = renderTratamientoDeportivo({
      tEntre: { estrategia: 'Hipertrofia' },
      dias: 4,
      cardio: '1',
      volumen: 9,
      COLORS: { navy: '#0D2640', white: '#fff', blue: '#0066CC', green: '#2E9E70' },
      esc: (s) => String(s),
      metricCard,
    });

    // estrategia incluida
    expect(out).toContain('Hipertrofia');
    // dias and cardio cards
    expect(out).toContain('<<D\xCDAS:4>>'); // DÍAS (accent may be encoded) - use escaped char
    expect(out).toContain('<<CARDIO:1>>');
    // volumen = 9
    expect(out).toContain('<<VOLUMEN:9>>');
  });
});
