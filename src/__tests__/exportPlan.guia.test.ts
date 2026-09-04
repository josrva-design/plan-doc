import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Guía / FAQs', () => {
  const basePlan = {
    person: { nombre: 'Juan Perez' },
    stats: {},
    routines: {},
    warmup: [],
    calendar: [],
    meals: [],
    supplements: [],
  };

  it('renderiza sección FAQs con guía DocFitness', () => {
    const html = generateDashboardFitnessHTML(basePlan as any);
    expect(html).toContain('FAQs');
    expect(html).toContain('Guía DocFitness');
  });

  it('renderiza contenido de guía (cómo leer mi plan)', () => {
    const html = generateDashboardFitnessHTML(basePlan as any);
    expect(html).toContain('¿Cómo leo mi plan?');
  });

  it('renderiza glosario de términos', () => {
    const html = generateDashboardFitnessHTML(basePlan as any);
    expect(html).toContain('Glosario');
  });
});
