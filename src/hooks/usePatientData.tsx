import { useMemo } from 'react';
import type { AppData, ClientPlan, MealClient, DayRoutine, SupplementClient, WarmupPhase, AvancePeso, AvanceMedida, EstadisticasClient, TratamientoNutricional, TratamientoEntrenamiento, Clinico, GuiaItem, GlosarioItem, FaseId, BloqueTipo, PatientBloque, PatientFase, PatientEjercicio } from './types';

const DAY_MAP = [
  { key: 'monday', dia: 'LUNES' },
  { key: 'tuesday', dia: 'MARTES' },
  { key: 'wednesday', dia: 'MIÉRCOLES' },
  { key: 'thursday', dia: 'JUEVES' },
  { key: 'friday', dia: 'VIERNES' },
  { key: 'saturday', dia: 'SÁBADO' },
  { key: 'sunday', dia: 'DOMINGO' },
];

const LOWER_KEYWORDS = ['pierna', 'core', 'inferior', 'leg', 'lower'];
const UPPER_KEYWORDS = ['pecho', 'espalda', 'hombro', 'trapecio', 'tríceps', 'triceps', 'superior', 'push', 'pull', 'upper'];

const getDayType = (actividad: string): DayRoutine['tipo'] => {
  const act = (actividad || '').toLowerCase();
  if (!act || act === 'descanso') return 'rest';
  if (LOWER_KEYWORDS.some((k) => act.includes(k))) return 'lower';
  if (UPPER_KEYWORDS.some((k) => act.includes(k))) return 'upper';
  return 'full';
};

const formatearPrescripcion = (ex: any): string => {
  const sets = (ex.serie || ex.sets || '1').toString().trim();
  const reps = (ex.reps || '').toString().trim();
  const descanso = (ex.descanso || ex.pausa || ex.rest || '').toString().trim();
  const rir = (ex.rir || '').toString().trim();

  if (!reps) return '-';

  const isTime = /min|seg|\bs\b$/i.test(reps.toLowerCase()) && !/reps|rep\b/i.test(reps.toLowerCase());

  let repsText = reps;
  if (isTime) {
    const rl = reps.toLowerCase();
    if (rl.includes('min')) repsText = rl.replace(/min/i, 'MIN');
  }

  let result = '';
  if (isTime) {
    result = `${sets}x ${repsText}`;
  } else {
    result = `${sets} series x ${reps} reps`;
  }
  if (descanso) result += ` • ${descanso}`;
  if (rir && rir !== '-') result += ` • RIR ${rir}`;
  return result;
};

const FASE_LABELS: Record<FaseId, string> = {
  CG: 'CALENTAMIENTO GENERAL',
  ED: 'ESTIRAMIENTO DINÁMICO / MOVILIDAD',
  CE: 'CALENTAMIENTO ESPECÍFICO',
  SA: 'SERIES DE APROXIMACIÓN',
  PRINCIPAL: 'ENTRENAMIENTO PRINCIPAL',
  ABD: 'ABDOMEN',
};

const FASE_COLORS: Record<FaseId, string> = {
  CG: 'var(--color-primary)',
  ED: 'var(--color-green)',
  CE: 'var(--color-navy)',
  SA: 'var(--color-orange)',
  PRINCIPAL: 'var(--color-green)',
  ABD: 'var(--color-primary)',
};

const WARMUP_FASE_MAP: Record<string, FaseId> = {
  GENERAL: 'CG',
  MOVILIDAD: 'ED',
  ESPECÍFICO: 'CE',
};

const ABDOMINAL_KEYWORDS = ['abdo', 'core', 'plancha', 'crunch', 'mountain climber', 'elevación', 'levan'];

const flattenWarmup = (warmup: any): WarmupPhase[] => {
  if (!warmup) return [];
  const phases: WarmupPhase[] = [];
  const lista = Array.isArray(warmup) ? warmup : (warmup.general || warmup.lower || warmup.upper || []);
  if (lista.length) phases.push({ fase: 'GENERAL', opciones: [], individuales: [] });
  if (!Array.isArray(warmup)) {
    if (warmup.movilidad?.length) phases.push({ fase: 'MOVILIDAD', opciones: [], individuales: [] });
    if (warmup.específico?.length) phases.push({ fase: 'ESPECÍFICO', opciones: [], individuales: [] });
  }
  return phases.map((phase) => {
    const source = Array.isArray(warmup) ? lista : (warmup[phase.fase.toLowerCase()] || []);
    const formatDetalle = (e: any) => {
      const parts = [e.sets, e.reps, e.pausa || e.descanso].filter(Boolean);
      if (!parts.length) return '—';
      return parts.join(' × ');
    };
    const toOp = (e: any) => ({
      ejercicio: e.ejercicio || e.nombre || '',
      detalle: formatDetalle(e),
      tipo: e.tipo || '',
      grupo: e.grupo || '',
    });
    const opciones = source.slice(0, 3).map(toOp);
    const individuales = source.slice(3).map(toOp);
    return { fase: phase.fase, opciones, individuales };
  });
};

const buildWarmupFases = (phases: WarmupPhase[], grupo: 'lower' | 'upper'): PatientFase[] => {
  const fases: PatientFase[] = [];
  let counter = 0;
  const nextLetra = () => String.fromCharCode(65 + counter++);

  phases.forEach((fase) => {
    const faseId = WARMUP_FASE_MAP[fase.fase];
    if (!faseId) return;

    const allEj = (fase.opciones || []).concat(fase.individuales || []);
    if (!allEj.length) return;

    const isGeneral = fase.fase === 'GENERAL';

    const groups: Record<string, any[]> = {};
    const groupOrder: string[] = [];
    allEj.forEach((ex) => {
      const g = ex.grupo || 'default';
      if (!groups[g]) {
        groups[g] = [];
        groupOrder.push(g);
      }
      groups[g].push(ex);
    });

    const bloques: PatientBloque[] = groupOrder.map((g, idx) => {
      const exGroup = groups[g];
      const count = exGroup.length;
      const exTipo = exGroup[0]?.tipo || '';

      let tipo: BloqueTipo;
      let indicacion = '';

      if (idx === 0 && isGeneral && count > 1) {
        tipo = 'ELIGE 1 OPCIÓN';
        indicacion = 'Elige 1 opción';
      } else if (exTipo === 'Biserie' && count === 2) {
        tipo = 'BISERIE';
        indicacion = '2 ejercicios en biserie';
      } else if (exTipo === 'Circuito' && count > 1) {
        tipo = 'SERIE SIMPLE';
        indicacion = `Circuito • ${count} ejercicios`;
      } else {
        tipo = 'SERIE SIMPLE';
      }

      const bloqueLetra = nextLetra();

      const ejercicios: PatientEjercicio[] = exGroup.map((ex, eIdx) => ({
        codigo: isGeneral ? `${bloqueLetra}${eIdx + 1}` : '',
        nombre: ex.ejercicio || '—',
        badgeTecnica: isGeneral ? '' : exTipo === 'Biserie' ? 'BISERIE' : exTipo === 'Circuito' ? 'CIRCUITO' : '',
        prescripcion: ex.detalle || '—',
      }));

      return {
        letra: bloqueLetra,
        tipo,
        indicacion,
        ejercicios,
      };
    });

    fases.push({
      id: faseId,
      nombre: FASE_LABELS[faseId],
      badgeColor: FASE_COLORS[faseId],
      bloques,
      grupo,
    });
  });

  return fases;
};

const organizarEnFases = (
  routine: any,
  warmupLower: WarmupPhase[],
  warmupUpper: WarmupPhase[],
  tipo: DayRoutine['tipo']
): PatientFase[] => {
  const fases: PatientFase[] = [];

  let trainingBloqueCounter = 0;
  const nextTrainingLetra = () => String.fromCharCode(65 + trainingBloqueCounter++);

  fases.push(...buildWarmupFases(warmupLower, 'lower'));
  fases.push(...buildWarmupFases(warmupUpper, 'upper'));

  // SA fase (aproximación / warm-up sets) from routine ejercicios
  const aproxRaw = (routine?.ejercicios || []).filter((ej: any) => (ej.categoria || '') === 'Aprox' && ej.aproxBase);
  if (aproxRaw.length > 0) {
    const baseMap: Record<string, any[]> = {};
    aproxRaw.forEach((ej: any) => {
      const base = ej.aproxBase;
      if (!baseMap[base]) baseMap[base] = [];
      baseMap[base].push(ej);
    });

    const aproxBloques: PatientBloque[] = Object.entries(baseMap).map(([baseId, exGroup], idx) => {
      const baseEx = (routine?.ejercicios || []).find((ej: any) => ej.uid === baseId || ej.id === baseId);
      const nombreBase = baseEx?.ejercicio || 'Ejercicio';
      return {
        letra: nextTrainingLetra(),
        tipo: 'SERIE SIMPLE' as BloqueTipo,
        indicacion: `${exGroup.length} series de aproximación • ${nombreBase}`,
        ejercicios: exGroup.map((ex: any) => ({
          codigo: '',
          nombre: ex.ejercicio || '—',
          badgeTecnica: ex.tecnica || `${ex.aproxPorcentaje || 50}%`,
          prescripcion: formatearPrescripcion(ex),
        })),
      };
    });

    fases.push({
      id: 'SA',
      nombre: FASE_LABELS['SA'],
      badgeColor: FASE_COLORS['SA'],
      bloques: aproxBloques,
      grupo: 'main',
    });
  }

  // Main exercises → PRINCIPAL and ABD fases
  const ejerciciosRaw = (routine?.ejercicios || []).filter((ej: any) => {
    const nombre = (ej.ejercicio || '').toLowerCase();
    const isAbdominal = ABDOMINAL_KEYWORDS.some((kw) => nombre.includes(kw));
    const isAprox = (ej.categoria || '') === 'Aprox';
    return !isAbdominal && !isAprox;
  });

  if (ejerciciosRaw.length > 0) {
    // Group by secuencia letter
    const groups: Record<string, any[]> = {};
    const order: string[] = [];
    ejerciciosRaw.forEach((ej) => {
      const match = (ej.secuencia || '').match(/^([A-Z])/);
      const letter = match ? match[1] : 'Z';
      if (!groups[letter]) {
        groups[letter] = [];
        order.push(letter);
      }
      groups[letter].push(ej);
    });

    const bloques: PatientBloque[] = order.map((letter, idx) => {
      const exGroup = groups[letter];
      const count = exGroup.length;
      let tipo: BloqueTipo = 'SERIE SIMPLE';
      if (count === 2) tipo = 'BISERIE';
      else if (count === 3) tipo = 'TRISERIE';

      let indicacion = '';
      if (tipo === 'BISERIE' || tipo === 'TRISERIE') {
        const rondas = tipo === 'BISERIE' ? '2' : '3';
        const reps = exGroup[0]?.reps || '—';
        const descanso = exGroup[0]?.descanso || exGroup[0]?.pausa || '—';
        indicacion = `${rondas} rondas x ${reps} reps c/u • ${descanso} entre rondas`;
      }

      const ejercicios: PatientEjercicio[] = exGroup.map((ex) => ({
        codigo: ex.secuencia || '',
        nombre: ex.ejercicio || '—',
        badgeTecnica: ex.tecnica || '',
        prescripcion: formatearPrescripcion(ex),
      }));

      return { letra: nextTrainingLetra(), tipo, indicacion, ejercicios };
    });

    fases.push({
      id: 'PRINCIPAL',
      nombre: FASE_LABELS['PRINCIPAL'],
      badgeColor: FASE_COLORS['PRINCIPAL'],
      bloques,
    grupo: 'main',
    });
  }

  // ABD fase (abdominal exercises)
  const abdominalExs = (routine?.ejercicios || []).filter((ej: any) => {
    const nombre = (ej.ejercicio || '').toLowerCase();
    return ABDOMINAL_KEYWORDS.some((kw) => nombre.includes(kw));
  });

  if (abdominalExs.length > 0) {
    const abGroups: Record<string, any[]> = {};
    abdominalExs.forEach((ej: any) => {
      const match = (ej.secuencia || '').match(/^([A-Z])/);
      const letter = match ? match[1] : 'A';
      if (!abGroups[letter]) abGroups[letter] = [];
      abGroups[letter].push(ej);
    });

    const bloques: PatientBloque[] = Object.entries(abGroups).map(([letter], idx) => {
      const exGroup = abGroups[letter];
      const ejercicios: PatientEjercicio[] = exGroup.map((ex) => ({
        codigo: ex.secuencia || '',
        nombre: ex.ejercicio || '—',
        badgeTecnica: ex.tecnica || '',
        prescripcion: formatearPrescripcion(ex),
      }));
      return {
        letra: nextTrainingLetra(),
        tipo: 'SERIE SIMPLE' as BloqueTipo,
        indicacion: '',
        ejercicios,
      };
    });

    fases.push({
      id: 'ABD',
      nombre: FASE_LABELS['ABD'],
      badgeColor: FASE_COLORS['ABD'],
      bloques,
    grupo: 'main',
    });
  }

  return fases;
};

const guia: GuiaItem[] = [
  { titulo: '¿Cómo usar tu plan mensual?', contenido: 'Tu plan es una semana que se repite 4 veces. Cada día tiene su entrenamiento y nutrición. Si abres el link un miércoles, verás el miércoles. Puedes navegar entre días con las pills LUN-DOM.' },
  { titulo: '¿Qué es RIR?', contenido: 'RIR = Repeticiones en Reserva. RIR 2 significa que terminas la serie dejando 2 repeticiones más en el tanque, no al fallo. Más seguro y progresivo.' },
  { titulo: '¿Cómo progresar?', contenido: 'Si completas todas las series con RIR 2, sube 2.5kg la próxima semana. Si no, mantén peso. Registra todo.' },
  { titulo: 'Calentamiento', contenido: 'Nunca te lo saltes. Hay solo 2: LOWER (días de pierna) y UPPER (días de tren superior). Están abajo en desplegables.' },
];

const glosario: GlosarioItem[] = [];

const parseMacro = (val: any): string => {
  if (!val) return '-';
  const m = String(val).match(/(\d+)/);
  return m ? m[1] : '-';
};

const parseStatNumber = (val: any): number | undefined => {
  if (typeof val === 'number') return val;
  if (!val) return undefined;
  const m = String(val).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
};

const getEvolutionValue = (cells: EvolutionCells | undefined, consultas: string[] | undefined, key: string): number | undefined => {
  if (!cells || !consultas || !consultas.length) return undefined;
  for (let i = consultas.length - 1; i >= 0; i--) {
    const c = consultas[i];
    if (cells[c] && typeof cells[c][key] === 'number') {
      return cells[c][key];
    }
  }
  return undefined;
};

const getEvolutionPrevious = (cells: EvolutionCells | undefined, consultas: string[] | undefined, key: string): number | undefined => {
  if (!cells || !consultas || consultas.length < 2) return undefined;
  for (let i = consultas.length - 2; i >= 0; i--) {
    const c = consultas[i];
    if (cells[c] && typeof cells[c][key] === 'number') {
      return cells[c][key];
    }
  }
  return undefined;
};

export default function usePatientData(editorData: AppData): ClientPlan {
  return useMemo(() => {
    const {
      person,
      calendar = [],
      warmupUpper,
      warmupLower,
      routines = [],
      meals = [],
      supplements = [],
      stats = {},
      nutrition = {},
      training = {},
      feedback = {},
      diagnosis = {},
      objectives = {},
      guide: editorGuide = [],
      glossary: editorGlossary = [],
      evolution,
      fechaConsulta,
    } = editorData || {};

    const routinesByDay: Record<string, DayRoutine> = {};
    const supplementsByDay: Record<string, SupplementClient[]> = {};

    DAY_MAP.forEach(({ key, dia }) => {
      const calDay = calendar.find((c) => c.dia === dia);
      const actividad = calDay?.actividad || '';
      const tipo = getDayType(actividad);

      const routine = calDay?.routineId
        ? routines.find((r) => r.id === calDay.routineId)
        : null;

       const warmupLowerFases: WarmupPhase[] = warmupLower ? flattenWarmup(warmupLower) : [];
       const warmupUpperFases: WarmupPhase[] = warmupUpper ? flattenWarmup(warmupUpper) : [];

        const subtipo = tipo === 'lower' ? 'Lower Body' : tipo === 'upper' ? 'Upper Body' : tipo === 'full' ? 'Full Body' : 'Descanso';

       routinesByDay[key] = {
         tipo,
         actividad,
         titulo: routine?.label || actividad || 'Sin rutina',
         subtitulo: subtipo,
         fases: organizarEnFases(
           routine,
            (tipo === 'lower' || tipo === 'full') ? warmupLowerFases : [],
            (tipo === 'upper' || tipo === 'full') ? warmupUpperFases : [],
           tipo
         ),
       } as DayRoutine;

      supplementsByDay[key] = (supplements || []).map((s) => ({
        nombre: s.nombre || s.suplemento || 'Suplemento',
        dosis: s.dosis || '',
        hora: s.horario || s.hora || '',
      }));
    });

    const evolutionCells = evolution?.cells || {};
    const evolutionConsultas = evolution?.consultas || [];

    let pesoActual: string | number = person?.pesoIni || '-';
    for (let i = evolutionConsultas.length - 1; i >= 0; i--) {
      const c = evolutionConsultas[i];
      if (evolutionCells[c] && typeof evolutionCells[c].peso === 'number') {
        pesoActual = evolutionCells[c].peso;
        break;
      }
    }
    const pesoAnterior = person?.pesoIni || '-';
    const pesoDelta = (pesoActual !== '-' && pesoAnterior !== '-') ? parseFloat(String(pesoActual)) - parseFloat(String(pesoAnterior)) : 0;

    const abdomenActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'abdomen') ?? parseStatNumber(stats?.abdomen) ?? 0;
    const abdomenAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'abdomen') ?? parseStatNumber(stats?.abdomen) ?? 0;
    const abdomenDelta = abdomenActual - abdomenAnterior;

    const grasaKgActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'grasaKg') ?? parseStatNumber(stats?.grasaKg) ?? 0;
    const grasaKgAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'grasaKg') ?? parseStatNumber(stats?.grasaKg) ?? 0;
    const grasaKgDelta = grasaKgActual - grasaKgAnterior;

    const grasaPctActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'grasa_pct') ?? parseStatNumber(stats?.grasaPorc) ?? 0;
    const grasaPctAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'grasa_pct') ?? parseStatNumber(stats?.grasaPorc) ?? 0;
    const grasaPctDelta = grasaPctActual - grasaPctAnterior;

    const pliegueActual = getEvolutionValue(evolutionCells, evolutionConsultas, 'pliegue') ?? parseStatNumber(stats?.pliegue) ?? 0;
    const pliegueAnterior = getEvolutionPrevious(evolutionCells, evolutionConsultas, 'pliegue') ?? parseStatNumber(stats?.pliegue) ?? 0;
    const pliegueDelta = pliegueActual - pliegueAnterior;

    const avances = {
      peso: { label: '(KG) PESO', anterior: String(pesoAnterior), actual: String(pesoActual), delta: pesoDelta } as AvancePeso,
      abdomen: { label: 'ABDOMEN', anterior: String(abdomenAnterior), actual: String(abdomenActual), delta: abdomenDelta },
      grasaKg: { label: 'GRASA (KG)', anterior: String(grasaKgAnterior), actual: String(grasaKgActual), delta: grasaKgDelta },
      grasaPct: { label: 'GRASA (%)', anterior: String(grasaPctAnterior), actual: String(grasaPctActual), delta: grasaPctDelta },
      pliegue: { label: 'PLIEGUE', anterior: String(pliegueAnterior), actual: String(pliegueActual), delta: pliegueDelta },
    };

    const estadisticas: EstadisticasClient = {
      adherencia: Number(stats?.adherencia) || 0,
      nutricion: Number(stats?.nutricion) || 0,
      entrenamiento: Number(stats?.entreno) || 0,
      cardio: Number(stats?.cardio) || 0,
      descanso: String(stats?.descanso || '0h'),
    };

    const tratamientoNutricional: TratamientoNutricional = {
      estrategia: nutrition.estrategia || '-',
      kcal: String(nutrition.kcal || '-'),
      proteina: parseMacro(nutrition.prot),
      carbos: parseMacro(nutrition.carbs),
      grasas: parseMacro(nutrition.grasas),
    };

    const tratamientoEntrenamiento: TratamientoEntrenamiento = {
      estrategia: training.estrategia || '-',
      dias: String(training.dias || '-'),
      cardio: String(training.cardio || '-'),
      pasos: String(person?.pasos || '-'),
    };

    const clinico: Clinico = {
      retroalimentacion: [feedback.r1, feedback.r2, feedback.r3].filter(Boolean).length ? [feedback.r1, feedback.r2, feedback.r3].filter(Boolean) : ['Sin datos'],
      diagnostico: [diagnosis.d1, diagnosis.d2, diagnosis.d3].filter(Boolean).length ? [diagnosis.d1, diagnosis.d2, diagnosis.d3].filter(Boolean) : ['Sin datos'],
      objetivos: [objectives.o1, objectives.o2, objectives.o3].filter(Boolean).length ? [objectives.o1, objectives.o2, objectives.o3].filter(Boolean) : ['Sin datos'],
    };

    const proximaConsulta = (() => {
      if (!fechaConsulta) return null;
      const parts = String(fechaConsulta).split('/');
      let y: number, m: number, d: number;
      if (parts.length === 3) {
        if (parts[2].length === 4) {
          const dd = parseInt(parts[0], 10);
          const mm = parseInt(parts[1], 10) - 1;
          const yy = parseInt(parts[2], 10);
          y = yy; m = mm; d = dd;
        } else {
          const dd = parseInt(parts[0], 10);
          const mm = parseInt(parts[1], 10) - 1;
          const yy = parseInt(parts[2], 10);
          y = yy >= 0 && yy <= 99 ? 2000 + yy : yy;
          m = mm; d = dd;
        }
      } else {
        const isoParts = String(fechaConsulta).split('-');
        if (isoParts.length !== 3) return null;
        y = parseInt(isoParts[0], 10);
        m = parseInt(isoParts[1], 10) - 1;
        d = parseInt(isoParts[2], 10);
      }
      const date = new Date(y, m, d);
      date.setMonth(date.getMonth() + 1);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    return {
      person: {
        nombre: person?.nombre || 'Paciente',
        objetivo: person?.objetivo || '',
        pasos: person?.pasos,
      },
      meals: meals as MealClient[],
      routines: routinesByDay,
      supplements: supplementsByDay,
      guia: editorGuide,
      glosario: editorGlossary.map((g: any) => ({
        term: g.title,
        def: (g.body || '').split('\n')[0],
        cat: g.cat,
        subtitle: g.subtitle,
        body: g.body,
        example: g.example,
      })),
      stats: {
        adherencia: Number(stats?.adherencia) || 0,
      },
      avances,
      estadisticas,
      tratamientoNutricional,
      tratamientoEntrenamiento,
      clinico,
      proximaConsulta,
      warmupUpper: buildWarmupFases(flattenWarmup(warmupUpper), 'upper'),
      warmupLower: buildWarmupFases(flattenWarmup(warmupLower), 'lower'),
      fechaConsulta: String(fechaConsulta || ''),
    };
  }, [editorData]);
}
