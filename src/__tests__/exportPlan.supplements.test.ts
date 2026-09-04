import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Suplementos', () => {
  const basePlan = {
    person: { nombre: 'Ana' },
    meals: [],
    routines: [],
    warmup: [],
    calendar: [],
    stats: {},
  };

  it('muestra suplementos y cantidad', () => {
    const plan = {
      ...basePlan,
      supplements: [
        { nombre: 'Creatina', gramos: '3', horario: 'Mañana' },
      ],
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Tratamiento de suplementación');
    expect(html).toContain('Creatina');
    expect(html).toContain('3g');
  });

  it('renderiza múltiples suplementos', () => {
    const plan = {
      ...basePlan,
      supplements: [
        { nombre: 'Creatina', gramos: '3', horario: 'Mañana' },
        { nombre: 'Proteína', gramos: '25', horario: 'Post-entreno' },
        { nombre: 'Omega 3', gramos: '1', horario: 'Comida' },
      ],
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Creatina');
    expect(html).toContain('Proteína');
    expect(html).toContain('Omega 3');
  });

  it('renderiza horario de suplementos', () => {
    const plan = {
      ...basePlan,
      supplements: [
        { nombre: 'Creatina', gramos: '3', horario: 'Mañana' },
      ],
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('MAÑANA');
  });

  it('no muestra Suplementos si no hay suplementos', () => {
    const plan = {
      ...basePlan,
      supplements: [],
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('Tratamiento de suplementación');
  });

  it('renderiza estrategia de suplementación', () => {
    const plan = {
      ...basePlan,
      supplements: [
        { nombre: 'Creatina', gramos: '3', horario: 'Mañana' },
      ],
      supplementsStrategy: 'Tomar con agua',
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Tomar con agua');
  });
});
