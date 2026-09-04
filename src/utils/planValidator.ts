import { AppData } from '../core/types.ts';

export interface ValidationWarning {
  id: string;
  message: string;
  severity: 'error' | 'warning';
  section: 'perfil' | 'entrenamiento' | 'nutricion' | 'suplementos' | 'dashboard';
}

export function validatePlan(data: AppData): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // 1. Perfil
  if (!data.person?.nombre) {
    warnings.push({
      id: 'person-name',
      message: 'El nombre del paciente está vacío.',
      severity: 'error',
      section: 'perfil',
    });
  }
  if (!data.person?.pesoIni || parseFloat(data.person.pesoIni) <= 0) {
    warnings.push({
      id: 'person-weight',
      message: 'El peso inicial no ha sido ingresado o es inválido.',
      severity: 'warning',
      section: 'perfil',
    });
  }

  // 2. Entrenamiento
  const activeDays = (data.calendar || []).filter(d => d.actividad && d.actividad.toLowerCase() !== 'descanso');
  
  if (activeDays.length === 0) {
    warnings.push({
      id: 'training-empty',
      message: 'No hay días de entrenamiento configurados.',
      severity: 'warning',
      section: 'entrenamiento',
    });
  } else {
    (data.calendar || []).forEach((day, idx) => {
      if (day.actividad && day.actividad.toLowerCase() !== 'descanso') {
        const routine = (data.routines || []).find(r => r.id === day.routineId);
        if (!routine || routine.ejercicios.length === 0) {
          warnings.push({
            id: `training-day-${idx}`,
            message: `El día ${day.actividad || (idx + 1)} no tiene ejercicios asignados.`,
            severity: 'warning',
            section: 'entrenamiento',
          });
        }
      }
    });
  }

  // 3. Nutrición
  const meals = data.meals || [];
  if (meals.length === 0) {
    warnings.push({
      id: 'nutrition-empty',
      message: 'No hay comidas configuradas en el plan nutricional.',
      severity: 'warning',
      section: 'nutricion',
    });
  } else {
    meals.forEach((meal, idx) => {
      const hasFoods = (meal.foods || []).length > 0 || (meal.menus || []).length > 0;
      if (!hasFoods) {
        warnings.push({
          id: `nutrition-meal-${idx}`,
          message: `La comida ${meal.tiempo || (idx + 1)} no tiene alimentos asignados.`,
          severity: 'warning',
          section: 'nutricion',
        });
      }
    });
  }

  // 4. Suplementos
  const supplements = data.supplements || [];
  if (supplements.length > 0) {
    supplements.forEach((s, idx) => {
      if (!s.horario) {
        warnings.push({
          id: `supp-horario-${idx}`,
          message: `El suplemento ${s.nombre || (idx + 1)} no tiene un horario asignado.`,
          severity: 'warning',
          section: 'suplementos',
        });
      }
    });
  }

  return warnings;
}
