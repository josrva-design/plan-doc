const ALLERGY_FOOD_MAP = {
  'Mariscos': ['camarón', 'camarones', 'langosta', 'langostino', 'pulpo', 'calamar', 'surimi', 'camarón', 'ostra', 'mejillón', 'almeja', 'gamba', 'gambas', 'krill', 'marisco'],
  'Lactosa': ['leche', 'queso', 'yogur', 'crema', 'mantequilla', 'helado', 'queso cottage', 'requesón', 'nata', 'lácteo'],
  'Gluten': ['pan', 'pasta', 'harina', 'trigo', 'cebada', 'centeno', 'avena', 'galleta', 'galletas', 'pizza', 'pastel', 'cereal'],
  'Frutos secos': ['nuez', 'nueces', 'almendra', 'almendras', 'cacahuate', 'cacahuetes', 'maní', 'pistacho', 'pistachos', 'avellana', 'avellanas', 'castaña', 'castañas', 'anacardo', 'anacardos', 'pacana', 'pecana', 'nuez de nogal'],
  'Soja': ['soja', 'soy', 'tofu', 'tempeh', 'edamame', 'salsa de soja'],
  'Huevo': ['huevo', 'huevos', 'clara', 'yema', 'mayonesa', 'merengue'],
  'Pescado': ['salmón', 'atún', 'bacalao', 'merluza', 'trucha', 'arenque', 'sardina', 'anchoa', 'pez', 'pescado', 'filete de pescado'],
  'Cacahuete': ['cacahuete', 'cacahuetes', 'maní', 'mantequilla de cacahuete', 'mantequilla de maní'],
};

const INJURY_EXERCISE_MAP = {
  'Hernia discal': ['peso muerto', 'deadlift', 'peso muerto convencional', 'peso muerto rumano', 'good morning', 'sentadilla profunda', 'zancada profunda', 'hip thrust pesado', ' peso muerto sumo'],
  'Rodilla': ['sentadilla profunda', 'zancada profunda', 'sentadilla libre profunda', 'sentadilla búlgara', 'split squat profundo', 'leg press muy profundo', 'sentadilla hack profunda'],
  'Hombro': ['press banca inclinado', 'press militar', 'elevaciones laterales pesadas', 'face pull con carga excesiva', 'dominadas con agarre muy ancho', 'press arnold', 'remo con barra sobre la cabeza'],
  'Codo': ['curl de bíceps con barra recta', 'extensiones de tríceps overhead', 'remo con barra pesado', 'press banca pesado'],
  'Muñeca': ['curl de muñeca', 'extensiones de muñeca', 'plancha con apoyo de manos', 'push up en puños'],
  'Cadera': ['sentadilla profunda', 'zancada profunda', 'hip thrust', 'puente de glúteos pesado', 'peso muerto convencional'],
  'Tobillo': ['zancada', 'sentadilla búlgara', 'saltos', 'pliometría', 'calf raise en pendiente'],
};

const MEDICATION_SUPPLEMENT_INTERACTIONS = {
  'Antihipertensivos': ['Cafeína', 'Pre-Entreno', 'Efedrina', 'Yohimbina', 'Guaraná'],
  'Antidiabéticos': ['Cromo', 'Canela', 'Ácido alfa lipoico (dosis altas)'],
  'Antidepresivos': ['5-HTP', 'SAMe', 'Hierba de San Juan', 'L-triptófano'],
  'Anticoagulantes': ['Omega 3', 'Vitamina E', 'Ajo', 'Jengibre', 'Ginkgo Biloba'],
  'Antihistamínicos': ['Cafeína', 'Pre-Entreno'],
};

const SUPPLEMENT_MAX_DOSES = {
  'Vitamina D': { max: 4000, unit: 'UI', note: 'Dosis máxima diaria recomendada' },
  'Cafeína': { max: 400, unit: 'mg', note: 'Dosis máxima diaria para adultos sanos' },
  'Creatina': { max: 10, unit: 'g', note: 'Dosis de mantenimiento' },
  'Omega 3': { max: 3000, unit: 'mg', note: 'Dosis máxima de EPA+DHA' },
  'Magnesio': { max: 350, unit: 'mg', note: 'Dosis máxima de suplemento (no incluye dieta)' },
  'Zinc': { max: 40, unit: 'mg', note: 'Dosis máxima diaria' },
  'Vitamina A': { max: 10000, unit: 'UI', note: 'Dosis máxima diaria' },
};

const CONDITION_RED_FLAGS = {
  'Cardiopatía': { level: 'critical', message: 'Requiere evaluación cardiológica antes de iniciar cualquier plan de entrenamiento o nutrición.' },
  'Enfermedad renal': { level: 'critical', message: 'Requiere ajuste de macros (proteína restringida) y supervisión nefrológica.' },
  'Diabetes': { level: 'high', message: 'Requiere monitoreo de glucosa y ajuste de distribución de macros.' },
  'Hipertensión': { level: 'high', message: 'Evitar suplementos con estimulantes. Monitorear sodio en dieta.' },
  'Embarazo': { level: 'critical', message: 'Requiere protocolo específico de nutrición prenatal y entrenamiento seguro.' },
  'Lactancia': { level: 'high', message: 'Requiere ajuste de macros para producción de leche.' },
  'Trastorno alimenticio': { level: 'critical', message: 'Requiere derivación a psicólogo/nutriólogo especializado en TCA.' },
};

export function checkAllergies(patient, plan) {
  const alerts = [];
  if (!patient?.alergias || patient.alergias === 'Ninguna' || patient.alergias === '') return alerts;

  const allergyTypes = patient.alergias.split(',').map(a => a.trim().toLowerCase());
  const allFoods = (plan?.meals || []).flatMap(m => {
    const foods = m.foods || [];
    const menuFoods = (m.menus || []).flatMap(menu => menu.alimentos || []);
    return [...foods, ...menuFoods];
  });

  const foodNames = allFoods.map(f => (f.name || f.nombre || '').toLowerCase());

  allergyTypes.forEach(allergy => {
    const mapped = ALLERGY_FOOD_MAP[allergy] || ALLERGY_FOOD_MAP[Object.keys(ALLERGY_FOOD_MAP).find(k => allergy.includes(k.toLowerCase()) || k.toLowerCase().includes(allergy))];
    if (!mapped) return;

    foodNames.forEach((foodName, idx) => {
      const originalName = allFoods[idx]?.name || allFoods[idx]?.nombre || '';
      mapped.forEach(trigger => {
        if (foodName.includes(trigger)) {
          alerts.push({
            level: 'critical',
            type: 'allergy',
            field: 'alergias',
            message: `ALERGIA: "${originalName}" contiene ${trigger} → paciente tiene alergia a ${allergy}`,
            patientField: patient.alergias,
            planField: originalName,
          });
        }
      });
    });
  });

  return alerts;
}

export function checkContraindications(patient, routines) {
  const alerts = [];
  if (!patient?.lesiones || patient.lesiones === 'Ninguna' || patient.lesiones === '') return alerts;

  const injuries = patient.lesiones.split(',').map(l => l.trim().toLowerCase());
  const allExercises = (routines || []).flatMap(r => r.ejercicios || []);

  injuries.forEach(injury => {
    const mapped = INJURY_EXERCISE_MAP[injury] || INJURY_EXERCISE_MAP[Object.keys(INJURY_EXERCISE_MAP).find(k => injury.includes(k.toLowerCase()) || k.toLowerCase().includes(injury))];
    if (!mapped) return;

    allExercises.forEach(ex => {
      const exName = (ex.ejercicio || '').toLowerCase();
      mapped.forEach(trigger => {
        if (exName.includes(trigger)) {
          alerts.push({
            level: 'high',
            type: 'contraindication',
            field: 'lesiones',
            message: `CONTRAINDICACIÓN: "${ex.ejercicio}" puede agravar ${injury}`,
            patientField: patient.lesiones,
            planField: ex.ejercicio,
          });
        }
      });
    });
  });

  return alerts;
}

export function checkSupplementInteractions(patient, supplements) {
  const alerts = [];
  if (!patient?.medicacion || patient.medicacion === 'Ninguna' || patient.medicacion === '') return alerts;

  const medications = patient.medicacion.split(',').map(m => m.trim());
  const supplementNames = (supplements || []).map(s => s.nombre || '');

  medications.forEach(med => {
    const interactions = MEDICATION_SUPPLEMENT_INTERACTIONS[med];
    if (!interactions) return;

    supplementNames.forEach(supName => {
      if (interactions.some(int => supName.toLowerCase().includes(int.toLowerCase()))) {
        alerts.push({
          level: 'high',
          type: 'interaction',
          field: 'medicacion',
          message: `INTERACCIÓN: ${supName} puede interactuar con ${med}`,
          patientField: patient.medicacion,
          planField: supName,
        });
      }
    });
  });

  return alerts;
}

export function checkSupplementDosages(supplements) {
  const alerts = [];
  (supplements || []).forEach(sup => {
    const name = sup.nombre || '';
    const doseStr = String(sup.gramos || sup.dosis || '');
    const doseMatch = doseStr.match(/(\d+\.?\d*)/);
    if (!doseMatch) return;

    const dose = parseFloat(doseMatch[1]);
    const rule = Object.entries(SUPPLEMENT_MAX_DOSES).find(([key]) => name.toLowerCase().includes(key.toLowerCase()));
    if (!rule) return;

    const [_, maxInfo] = rule;
    if (dose > maxInfo.max) {
      alerts.push({
        level: 'medium',
        type: 'dosage',
        field: 'suplementos',
        message: `DOSIS: ${name} tiene ${dose}${maxInfo.unit}. Máximo recomendado: ${maxInfo.max}${maxInfo.unit}. ${maxInfo.note}`,
        patientField: '',
        planField: `${name} ${doseStr}`,
      });
    }
  });

  return alerts;
}

export function checkConditionRedFlags(patient) {
  const alerts = [];
  if (!patient?.condicionMedica || patient.condicionMedica === 'Sin condiciones' || patient.condicionMedica === '') return alerts;

  const conditions = patient.condicionMedica.split(',').map(c => c.trim());
  conditions.forEach(condition => {
    const flag = CONDITION_RED_FLAGS[condition];
    if (flag) {
      alerts.push({
        level: flag.level,
        type: 'redflag',
        field: 'condicionMedica',
        message: `RED FLAG: ${flag.message}`,
        patientField: patient.condicionMedica,
        planField: '',
      });
    }
  });

  return alerts;
}

import { getTotalKcalFromMeals, getTotalMacrosFromMeals } from './nutritionHelpers.ts';

export function validateMacros(nutrition, person, meals) {
  const alerts = [];
  const kcal = parseFloat(nutrition.kcal) || 0;
  const prot = parseFloat(nutrition.prot) || 0;
  const carbs = parseFloat(nutrition.carbs) || 0;
  const grasas = parseFloat(nutrition.grasas) || 0;
  const peso = parseFloat(person.pesoIni) || 0;

  const mealKcal = getTotalKcalFromMeals(meals);
  const mealMacros = getTotalMacrosFromMeals(meals);
  const mealProt = mealMacros.p;
  const mealCarbs = mealMacros.c;
  const mealGrasas = mealMacros.g;

  const finalKcal = kcal || mealKcal;
  const finalProt = prot || mealProt;
  const finalCarbs = carbs || mealCarbs;
  const finalGrasas = grasas || mealGrasas;

  if (finalKcal <= 0) {
    alerts.push({ level: 'high', type: 'macro', field: 'nutrition.kcal', message: 'Las calorías deben ser mayor a 0' });
  }
  if (finalProt <= 0 && finalKcal > 0) {
    alerts.push({ level: 'medium', type: 'macro', field: 'nutrition.prot', message: 'Proteína en 0. Mínimo recomendado: 0.8g/kg de peso' });
  }
  if (peso > 0 && finalProt < peso * 0.8) {
    alerts.push({ level: 'medium', type: 'macro', field: 'nutrition.prot', message: `Proteína muy baja: ${finalProt}g para ${peso}kg. Mínimo: ${(peso * 0.8).toFixed(0)}g` });
  }
  if (finalCarbs < 0 || finalGrasas < 0) {
    alerts.push({ level: 'medium', type: 'macro', field: 'macros', message: 'Macros negativos detectados' });
  }

  const calculatedKcal = (finalProt * 4) + (finalCarbs * 4) + (finalGrasas * 9);
  if (finalKcal > 0 && Math.abs(calculatedKcal - finalKcal) > finalKcal * 0.2) {
    alerts.push({ level: 'low', type: 'macro', field: 'nutrition', message: `Los macros suman ${Math.round(calculatedKcal)} kcal pero el objetivo es ${finalKcal} kcal. Desviación >20%.` });
  }

  return alerts;
}

export function runAllSafetyChecks(data) {
  const { person, nutrition, routines, meals, supplements } = data;
  const allAlerts = [
    ...checkConditionRedFlags(person),
    ...checkAllergies(person, { meals }),
    ...checkContraindications(person, routines),
    ...checkSupplementInteractions(person, supplements),
    ...checkSupplementDosages(supplements),
    ...validateMacros(nutrition, person, meals),
  ];

  const critical = allAlerts.filter(a => a.level === 'critical');
  const high = allAlerts.filter(a => a.level === 'high');
  const medium = allAlerts.filter(a => a.level === 'medium');
  const low = allAlerts.filter(a => a.level === 'low');

  return {
    alerts: allAlerts,
    summary: {
      critical: critical.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
      total: allAlerts.length,
    },
    hasBlockers: critical.length > 0 || high.length > 0,
  };
}
