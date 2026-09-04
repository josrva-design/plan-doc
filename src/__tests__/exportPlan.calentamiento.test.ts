import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan - Calentamiento', () => {
  const basePlan = {
    person: { nombre: 'Juan Perez' },
    stats: {},
    routines: {},
    warmup: [],
    calendar: [],
    meals: [],
    supplements: [],
  };

  it('renderiza calentamiento General con ejercicios de tiempo', () => {
    const plan = {
      ...basePlan,
      tratamientoEntrenamiento: { estrategia: 'Fuerza', dias: '4' },
      warmupGeneral: [
        {
          id: 'CG',
          nombre: 'Calentamiento General',
          badgeColor: '#0D2640',
          grupo: 'general',
          bloques: [
            {
              letra: 'A',
              tipo: 'SERIE SIMPLE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Bicicleta', reps: '5 min', musculo: 'Cardio', movimiento: '' },
                { codigo: 'A2', nombre: 'Caminadora', reps: '3 min', musculo: 'Cardio', movimiento: '' },
              ],
            },
          ],
        },
      ],
      warmupUpper: [],
      warmupLower: [],
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Calentamiento');
    expect(html).toContain('General');
    expect(html).toContain('Bicicleta');
    expect(html).toContain('5 min');
    expect(html).toContain('Caminadora');
    expect(html).toContain('3 min');
  });

  it('renderiza Tren Superior con fases Movilidad y Específico', () => {
    const plan = {
      ...basePlan,
      tratamientoEntrenamiento: { estrategia: 'Fuerza', dias: '4' },
      warmupGeneral: [],
      warmupUpper: [
        {
          id: 'ED',
          nombre: 'Estiramiento Dinámico / Movilidad',
          badgeColor: '#2E9E70',
          grupo: 'upper',
          bloques: [
            {
              letra: 'A',
              tipo: 'BISERIE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Rotación hombro', reps: '15-20', pausa: '30', musculo: 'Hombro', movimiento: 'Rotación' },
                { codigo: 'A2', nombre: 'Extensión brazo', reps: '15-20', pausa: '30', musculo: 'Tríceps', movimiento: 'Extensión' },
              ],
            },
          ],
        },
        {
          id: 'CE',
          nombre: 'Calentamiento Específico',
          badgeColor: '#0066CC',
          grupo: 'upper',
          bloques: [
            {
              letra: 'A',
              tipo: 'SERIE SIMPLE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Elevaciones laterales', reps: '15-20', pausa: '30', musculo: 'Hombro lateral', movimiento: 'Abducción' },
              ],
            },
          ],
        },
      ],
      warmupLower: [],
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Tren Superior');
    expect(html).toContain('Movilidad');
    expect(html).toContain('Específico');
    expect(html).toContain('Rotación hombro');
    expect(html).toContain('Elevaciones laterales');
  });

  it('renderiza Tren Inferior con fases Movilidad y Específico', () => {
    const plan = {
      ...basePlan,
      tratamientoEntrenamiento: { estrategia: 'Fuerza', dias: '4' },
      warmupGeneral: [],
      warmupUpper: [],
      warmupLower: [
        {
          id: 'ED',
          nombre: 'Estiramiento Dinámico / Movilidad',
          badgeColor: '#2E9E70',
          grupo: 'lower',
          bloques: [
            {
              letra: 'A',
              tipo: 'BISERIE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Extensión flexión', reps: '15-20', pausa: '30', musculo: 'Piernas', movimiento: 'Flexión/Extensión' },
                { codigo: 'A2', nombre: 'Abducción aducción', reps: '15-20', pausa: '30', musculo: 'Glúteo medio', movimiento: 'Abducción' },
              ],
            },
          ],
        },
        {
          id: 'CE',
          nombre: 'Calentamiento Específico',
          badgeColor: '#0066CC',
          grupo: 'lower',
          bloques: [
            {
              letra: 'A',
              tipo: 'BISERIE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Plancha frontal', reps: '30 seg', pausa: '', musculo: 'Core', movimiento: 'Isométrico' },
                { codigo: 'A2', nombre: 'Abs crunch', reps: '15-20', pausa: '30', musculo: 'Abdomen', movimiento: 'Flexión' },
              ],
            },
          ],
        },
      ],
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Tren Inferior');
    expect(html).toContain('Movilidad');
    expect(html).toContain('Específico');
    expect(html).toContain('Extensión flexión');
    expect(html).toContain('Plancha frontal');
  });

  it('no muestra calentamiento si no hay ejercicios', () => {
    const plan = {
      ...basePlan,
      tratamientoEntrenamiento: { estrategia: 'Fuerza', dias: '4' },
      warmupGeneral: [],
      warmupUpper: [],
      warmupLower: [],
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('Tren Superior');
    expect(html).not.toContain('Tren Inferior');
  });

  it('no muestra entrenamiento semanal si no hay rutinas con ejercicios', () => {
    const plan = {
      ...basePlan,
      tratamientoEntrenamiento: { estrategia: 'Fuerza', dias: '4' },
      routines: {
        monday: {
          tipo: 'upper',
          actividad: 'Upper A',
          fases: [
            {
              id: 'PRINCIPAL',
              nombre: 'Entrenamiento Principal',
              badgeColor: '#0D2640',
              grupo: 'main',
              bloques: [],
            },
          ],
        },
      },
      calendar: [
        { dayKey: 'monday', dia: 'LUNES', actividad: 'Upper A' },
      ],
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('Entrenamiento semanal');
  });

  it('muestra entrenamiento semanal solo cuando hay rutinas con ejercicios y días de calendario', () => {
    const plan = {
      ...basePlan,
      tratamientoEntrenamiento: { estrategia: 'Fuerza', dias: '4' },
      routines: {
        monday: {
          tipo: 'upper',
          actividad: 'Upper A',
          fases: [
            {
              id: 'PRINCIPAL',
              nombre: 'Entrenamiento Principal',
              badgeColor: '#0D2640',
              grupo: 'main',
              bloques: [
                {
                  letra: 'A',
                  tipo: 'SERIE SIMPLE',
                  indicacion: '',
                  ejercicios: [
                    { codigo: 'A1', nombre: 'Press banca', reps: '8-10', descanso: '90s', musculo: 'Pecho', movimiento: 'Empuje' },
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
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('Entrenamiento semanal');
  });

  it('renderiza pills de fases con texto correcto', () => {
    const plan = {
      ...basePlan,
      tratamientoEntrenamiento: { estrategia: 'Fuerza', dias: '4' },
      warmupGeneral: [
        {
          id: 'CG',
          nombre: 'Calentamiento General',
          badgeColor: '#0D2640',
          grupo: 'general',
          bloques: [
            {
              letra: 'A',
              tipo: 'SERIE SIMPLE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Bicicleta', reps: '5 min', musculo: 'Cardio', movimiento: '' },
              ],
            },
          ],
        },
      ],
      warmupUpper: [
        {
          id: 'ED',
          nombre: 'Estiramiento Dinámico / Movilidad',
          badgeColor: '#2E9E70',
          grupo: 'upper',
          bloques: [
            {
              letra: 'A',
              tipo: 'SERIE SIMPLE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Rotación hombro', reps: '15-20', pausa: '30', musculo: 'Hombro', movimiento: 'Rotación' },
              ],
            },
          ],
        },
        {
          id: 'CE',
          nombre: 'Calentamiento Específico',
          badgeColor: '#0066CC',
          grupo: 'upper',
          bloques: [
            {
              letra: 'A',
              tipo: 'SERIE SIMPLE',
              indicacion: '',
              ejercicios: [
                { codigo: 'A1', nombre: 'Elevaciones laterales', reps: '15-20', pausa: '30', musculo: 'Hombro', movimiento: 'Abducción' },
              ],
            },
          ],
        },
      ],
      warmupLower: [],
    };

    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).toContain('warmup-fase-pill--general');
    expect(html).toContain('warmup-fase-pill--movilidad');
    expect(html).toContain('warmup-fase-pill--especifico');
  });
});
