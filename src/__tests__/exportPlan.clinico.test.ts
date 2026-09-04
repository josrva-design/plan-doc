import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Información Clínica', () => {
  it('no incluye HÁBITOS dentro de Información clínica (sección eliminada)', () => {
    const plan = { person: { nombre: 'Ana' }, habits: { 'Dormir': '8h' }, meals: [], routines: [], warmup: [], calendar: [], supplements: [], stats: {}, clinico: { objetivos: ['Plan'] } };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('HÁBITOS');
    expect(html).not.toContain('Dormir');
  });

  it('no incluye la etiqueta SUPLEMENTACIÓN RECOMENDADA dentro de Información clínica (sección eliminada)', () => {
    const plan = { person: { nombre: 'Ana' }, supplementsStrategy: 'Creatina 3g', meals: [], routines: [], warmup: [], calendar: [], supplements: [], stats: {}, clinico: { objetivos: ['Plan'] } };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('SUPLEMENTACIÓN RECOMENDADA');
  });

  it('renderiza Diagnóstico, Objetivos y Retroalimentación cuando están presentes', () => {
    const plan = {
      person: { nombre: 'Ana' },
      meals: [],
      routines: [],
      warmup: [],
      calendar: [],
      supplements: [],
      stats: {},
      clinico: {
        diagnostico: ['Sobrepeso grado 1'],
        objetivos: ['Perder grasa', 'Ganar músculo'],
        retroalimentacion: ['Buen progreso'],
      },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Información clínica');
    expect(html).toContain('DIAGNÓSTICO');
    expect(html).toContain('Sobrepeso grado 1');
    expect(html).toContain('OBJETIVOS Y PLAN A SEGUIR');
    expect(html).toContain('Perder grasa');
    expect(html).toContain('RETROALIMENTACIÓN');
    expect(html).toContain('Buen progreso');
  });

  it('no muestra Información clínica si no hay datos', () => {
    const plan = {
      person: { nombre: 'Ana' },
      meals: [],
      routines: [],
      warmup: [],
      calendar: [],
      supplements: [],
      stats: {},
      clinico: {},
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('Información clínica');
  });

  it('escapa HTML en nombres', () => {
    const plan = { person: { nombre: '<script>alert(1)</script>' }, meals: [], routines: [], warmup: [], calendar: [], supplements: [], stats: {} };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
