import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan', () => {
  it('generateDashboardFitnessHTML returns html string containing name', () => {
    const plan = {
      person: { nombre: 'Juan Perez' },
      routines: {},
      warmup: [],
      calendar: [],
      meals: [],
      supplements: [],
      stats: {},
    };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(typeof html).toBe('string');
    expect(html).toContain('Juan');
  });

  it('renderiza titulos de bloque BISERIE/TRISERIE/CIRCUITO en el HTML', () => {
    const plan = {
      person: { nombre: 'Ana' },
      stats: {},
      routines: {
        monday: {
          tipo: 'upper',
          actividad: 'Upper A',
          titulo: 'Upper A',
          subtitulo: '',
          fases: [
            {
              id: 'PRINCIPAL',
              nombre: 'Tratamiento deportivo',
              badgeColor: '#0D2640',
              grupo: 'main',
              bloques: [
                {
                  letra: 'A',
                  tipo: 'BISERIE',
                  indicacion: '2 rondas x 8-10 reps c/u • 90s entre rondas',
                  ejercicios: [
                    { codigo: 'A1', nombre: 'Press banca', series: '4', semana1: '4', semana2: '4', semana3: '3', semana4: '3', reps: '8-10', descanso: '90s', tecnica: '', rir: '2', musculo: 'Pecho', movimiento: 'Empuje' },
                    { codigo: 'A2', nombre: 'Dominadas', series: '4', semana1: '4', semana2: '4', semana3: '3', semana4: '3', reps: '6-8', descanso: '90s', tecnica: '', rir: '2', musculo: 'Espalda', movimiento: 'Jalón' },
                  ],
                },
                {
                  letra: 'B',
                  tipo: 'TRISERIE',
                  indicacion: '3 rondas x 10-12 reps c/u • 60s entre rondas',
                  ejercicios: [
                    { codigo: 'B1', nombre: 'Curl bíceps', series: '3', semana1: '3', semana2: '3', semana3: '3', semana4: '3', reps: '10-12', descanso: '60s', tecnica: '', rir: '2', musculo: 'Bíceps', movimiento: 'Curl' },
                    { codigo: 'B2', nombre: 'Tríceps polea', series: '3', semana1: '3', semana2: '3', semana3: '3', semana4: '3', reps: '12-15', descanso: '60s', tecnica: '', rir: '2', musculo: 'Tríceps', movimiento: 'Extensión' },
                    { codigo: 'B3', nombre: 'Extensiones tríceps', series: '3', semana1: '3', semana2: '3', semana3: '3', semana4: '3', reps: '12-15', descanso: '60s', tecnica: '', rir: '2', musculo: 'Tríceps', movimiento: 'Extensión' },
                  ],
                },
              ],
            },
          ],
        },
      },
      calendar: [
        { dayKey: 'monday', dia: 'LUNES', actividad: 'Upper A' },
      ],
      meals: [],
      supplements: [],
      warmup: [],
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('BISERIE');
    expect(html).toContain('TRISERIE');
  });
});
