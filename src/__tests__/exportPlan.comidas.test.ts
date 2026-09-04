import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Comidas', () => {
  const basePlan = {
    person: { nombre: 'Ana' },
    routines: [],
    warmup: [],
    calendar: [],
    supplements: [],
    stats: {},
  };

  it('renderiza comidas y escapa nombres HTML', () => {
    const plan = {
      ...basePlan,
      meals: [
        {
          tiempo: 'Desayuno',
          foods: [{ name: 'Avena <b>', kcal: 100 }],
          menus: [],
          menuType: 'armar',
        },
      ],
      tratamientoNutricional: { estrategia: 'Mantener peso' },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Comidas');
    expect(html).toContain('Avena &lt;b&gt;');
    expect(html).toContain('100 kcal');
  });

  it('renderiza múltiples comidas', () => {
    const plan = {
      ...basePlan,
      meals: [
        { tiempo: 'Desayuno', foods: [{ name: 'Huevos', kcal: 200 }], menus: [], menuType: 'armar' },
        { tiempo: 'Comida', foods: [{ name: 'Pollo', kcal: 300 }], menus: [], menuType: 'armar' },
        { tiempo: 'Cena', foods: [{ name: 'Ensalada', kcal: 150 }], menus: [], menuType: 'armar' },
      ],
      tratamientoNutricional: { estrategia: 'Mantener peso' },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Desayuno');
    expect(html).toContain('Comida');
    expect(html).toContain('Cena');
    expect(html).toContain('Huevos');
    expect(html).toContain('Pollo');
    expect(html).toContain('Ensalada');
  });

  it('renderiza alimentos con macros (proteína, carbos, grasas)', () => {
    const plan = {
      ...basePlan,
      meals: [
        {
          tiempo: 'Desayuno',
          foods: [{ name: 'Avena', kcal: 150, proteinas: 5, carbos: 30, grasas: 3 }],
          menus: [],
          menuType: 'armar',
        },
      ],
      tratamientoNutricional: { estrategia: 'Mantener peso' },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Avena');
    expect(html).toContain('150 kcal');
  });

  it('no muestra Comidas si no hay comidas', () => {
    const plan = {
      ...basePlan,
      meals: [],
      tratamientoNutricional: {},
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('Comidas');
  });

  it('renderiza menú tipo armar con opciones', () => {
    const plan = {
      ...basePlan,
      meals: [
        {
          tiempo: 'Desayuno',
          foods: [],
          menus: [
            { id: 'menu1', nombre: 'Opción 1', alimentos: [{ name: 'Fruta', kcal: 100 }] },
          ],
          menuType: 'armar',
        },
      ],
      tratamientoNutricional: { estrategia: 'Mantener peso' },
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Desayuno');
  });
});
