import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Avances', () => {
  const basePlan = {
    person: { nombre: 'Juan Perez' },
    stats: {},
    routines: {},
    warmup: [],
    calendar: [],
    meals: [],
    supplements: [],
  };

  it('renderiza sección Avances con peso actual y anterior', () => {
    const plan = {
      ...basePlan,
      avances: {
        peso: { actual: '75', anterior: '80', delta: '-5' },
      },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Avances');
    expect(html).toContain('75');
    expect(html).toContain('80');
  });

  it('renderiza medidas (abdomen, grasa, pliegue)', () => {
    const plan = {
      ...basePlan,
      avances: {
        abdomen: { actual: '90', anterior: '95', delta: '-5' },
        grasaKg: { actual: '15', anterior: '18', delta: '-3' },
      },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Abdomen');
    expect(html).toContain('90');
    expect(html).toContain('Grasa kg');
    expect(html).toContain('15');
  });

  it('muestra mensaje sin datos cuando no hay avances', () => {
    const plan = {
      ...basePlan,
      avances: {},
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Sin datos de evolución');
  });

  it('renderiza delta con flecha', () => {
    const plan = {
      ...basePlan,
      avances: {
        peso: { actual: '75', anterior: '80', delta: '-5' },
      },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('↓');
  });
});
