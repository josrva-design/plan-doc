import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Calendario', () => {
  it('incluye métricas de DÍAS y CARDIO según el calendario', () => {
    const plan = {
      person: { nombre: 'Ana' },
      calendar: [
        { actividad: 'Entrenamiento' },
        { actividad: 'Cardio' },
        { actividad: 'Descanso' },
      ],
      tratamientoEntrenamiento: { dias: 3 },
      meals: [],
      routines: [],
      warmup: [],
      supplements: [],
      stats: {},
    };

    const html = generateDashboardFitnessHTML(plan as any);
    // Debe contener la sección de Tratamiento deportivo (donde están las métricas)
    expect(html).toContain('Tratamiento deportivo');
    expect(html).toContain('DÍAS');
    expect(html).toContain('CARDIO');
    // dias esperados: 2 (Entrenamiento + Cardio)
    expect(html).toContain('2');
  });
});
