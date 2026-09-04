import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Hero', () => {
  const basePlan = {
    person: { nombre: 'Juan Perez' },
    stats: {},
    routines: {},
    warmup: [],
    calendar: [],
    meals: [],
    supplements: [],
  };

  it('renderiza nombre del paciente', () => {
    const html = generateDashboardFitnessHTML(basePlan as any);
    expect(html).toContain('Juan Perez');
  });

  it('renderiza edad y sexo cuando están presentes', () => {
    const plan = {
      ...basePlan,
      person: { nombre: 'Juan Perez', edad: 25, sexo: 'M' },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('25');
    expect(html).toContain('años');
  });

  it('renderiza primera letra del nombre como avatar', () => {
    const html = generateDashboardFitnessHTML(basePlan as any);
    expect(html).toContain('J');
  });

  it('muestra "Paciente" si no hay nombre', () => {
    const plan = {
      ...basePlan,
      person: { nombre: '' },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Paciente');
  });

  it('escapa HTML en el nombre', () => {
    const plan = {
      ...basePlan,
      person: { nombre: '<b>Juan</b>' },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('<b>Juan</b>');
    expect(html).toContain('&lt;b&gt;Juan&lt;/b&gt;');
  });
});
