import { describe, it, expect } from 'vitest';
import { runAllSafetyChecks, checkAllergies, checkContraindications, checkConditionRedFlags } from '../utils/safetyRules';

describe('safetyRules', () => {
  it('detecta red flag crítico por condición médica', () => {
    const data = {
      person: {
        nombre: 'Paciente QA',
        condicionMedica: 'Cardiopatía',
      },
      meals: [],
      routines: [],
      supplements: [],
      nutrition: {},
      stats: {},
    };

    const result = runAllSafetyChecks(data);
    const redFlags = result.alerts.filter(a => a.type === 'redflag');

    expect(redFlags.length).toBeGreaterThanOrEqual(1);
    expect(redFlags.some(a => a.message.includes('evaluación cardiológica'))).toBe(true);
    expect(result.hasBlockers).toBe(true);
  });

  it('detecta alergia crítica cuando el paciente tiene alergia a mariscos y el plan incluye camarón', () => {
    const data = {
      person: {
        nombre: 'Paciente QA',
        alergias: 'Mariscos',
      },
      meals: [
        {
          id: 'meal-1',
          tiempo: 'DESAYUNO',
          menuType: 'fijo',
          menus: [
            {
              id: 'menu-1',
              nombre: 'Menú 1',
              alimentos: [
                { id: 'alim-1', nombre: 'Camarón', p: 25, c: 0, g: 1, kcal: 105 },
              ],
            },
          ],
          foods: [],
        },
      ],
      routines: [],
      supplements: [],
      nutrition: {},
      stats: {},
    };

    const result = runAllSafetyChecks(data);
    const allergyAlerts = result.alerts.filter(a => a.type === 'allergy');

    expect(allergyAlerts.length).toBeGreaterThanOrEqual(1);
    expect(allergyAlerts.some(a => a.message.includes('Camarón') && a.message.includes('camarón'))).toBe(true);
    expect(result.hasBlockers).toBe(true);
  });

  it('no genera alertas cuando el paciente no tiene condiciones ni alergias', () => {
    const data = {
      person: {
        nombre: 'Paciente QA',
      },
      meals: [],
      routines: [],
      supplements: [],
      nutrition: { kcal: '600', prot: '150', carbs: '0', grasas: '0' },
      stats: {},
    };

    const result = runAllSafetyChecks(data);
    console.log('SAFETY RESULT:', JSON.stringify(result, null, 2));
    expect(result.alerts).toHaveLength(0);
    expect(result.hasBlockers).toBe(false);
  });
});
