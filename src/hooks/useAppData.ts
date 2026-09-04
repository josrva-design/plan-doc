import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { AppData } from '../core/types.ts';
import {
  initialPerson,
  initialStats,
  initialNutrition,
  initialTraining,
  initialCalendar,
  initialWarmup,
  initialRoutines,
  initialMeals,
  initialSupplements,
  initialSupplementsStrategy,
  initialFeedback,
  initialDiagnosis,
  initialObjectives,
  initialHabits,
  initialEvolution,
  initialFechaConsulta,
} from '../data/sampleData';
import { getProximaConsulta } from '../utils/summaryHelpers.ts';
import { exerciseDatabase } from '../data/exerciseDatabase.ts';
import { normalizeWarmupForEditor } from '../utils/normalizeWarmup.ts';
import { computeStatsFromEvolution } from '../utils/evolutionStatsSync.ts';
import { normalizeCalendar } from '../utils/calendarConstants.ts';
import { generatePatientId } from '../utils/patientFiles.ts';

const computeState = (initialData: Partial<AppData> | null = null): AppData => {
  const _p = initialData?.person ?? initialPerson;
  const _stats = initialData?.stats ?? initialStats;
  const _nutrition = initialData?.nutrition ?? initialNutrition;
  const _training = initialData?.training ?? initialTraining;
  const _calendar = initialData?.calendar ?? initialCalendar;
  const _warmup = initialData?.warmup ?? initialWarmup;
  const _routines = initialData?.routines ?? initialRoutines;
  const _meals = initialData?.meals ?? initialMeals;
  const _supplements = initialData?.supplements ?? initialSupplements;
  const _supplementsStrategy = initialData?.supplementsStrategy ?? initialSupplementsStrategy;
  const _feedback = initialData?.feedback ?? initialFeedback;
  const _diagnosis = initialData?.diagnosis ?? initialDiagnosis;
  const _objectives = initialData?.objectives ?? initialObjectives;
  const _habits = initialData?.habits ?? initialHabits;
  const _evolution = initialData?.evolution ?? initialEvolution;
  const _fechaConsulta = initialData?.fechaConsulta ?? initialFechaConsulta;
  const _proximaConsulta = initialData?.proximaConsulta ?? getProximaConsulta(_fechaConsulta) ?? '';
  const _profileHistory = initialData?.profileHistory ?? [];

  const normalizeRoutine = (item: any, dayKey: string | null) => {
    const exercises = item.ejercicios?.map((e: any) => ({ ...e })) ?? [];
    const enrichedExercises = exercises.map((ej: any) => {
      if (ej.musculo && ej.movimiento) return ej;
      const match = exerciseDatabase.find((ex) => ex.nombre.toLowerCase() === (ej.ejercicio || '').toLowerCase());
      if (!match) return ej;
      return {
        ...ej,
        musculo: ej.musculo || match.musculo || '',
        movimiento: ej.movimiento || match.movimiento || '',
        notas: ej.notas || match.nota || '',
      };
    });
    return {
      ...item,
      id: item.id || dayKey || null,
      nombre: item.nombre || item.label || '',
      titulo: item.titulo || item.label || item.nombre || '',
      ejercicios: enrichedExercises,
    };
  };

  const normalizedRoutines = (() => {
    if (!_routines) return [];
    if (Array.isArray(_routines)) {
      return _routines.map((r: any) => normalizeRoutine(r, null));
    }
    if (typeof _routines === 'object') {
      return Object.entries(_routines).map(([dayKey, r]: [string, any]) => normalizeRoutine(r, dayKey));
    }
    return [];
  })();

  const normalizeWarmup = (raw: any) => {
    const base = normalizeWarmupForEditor(raw);
    return base.map((ej) => ({
      ...ej,
      reps: (ej.reps || '').replace(/\s*reps$/i, '').trim(),
    }));
  };

  const normalizedWarmup = normalizeWarmup(_warmup);

  return {
    person: { ..._p },
    stats: { ..._stats },
    nutrition: { ..._nutrition },
    training: { ..._training },
    calendar: normalizeCalendar(_calendar),
    warmup: normalizedWarmup,
    routines: normalizedRoutines,
    activeRoutineId: initialData?.activeRoutineId ?? (normalizedRoutines.length ? normalizedRoutines[0].id : null),
    meals: _meals ? [..._meals] : [],
    supplements: _supplements?.map((s: any) => ({ ...s })) ?? [],
    supplementsStrategy: _supplementsStrategy,
    feedback: { ..._feedback },
    diagnosis: { ..._diagnosis },
    objectives: { ..._objectives },
    habits: { ..._habits },
    evolution: { ..._evolution },
    fechaConsulta: _fechaConsulta,
    proximaConsulta: _proximaConsulta,
    profileHistory: [..._profileHistory],
  };
};

export interface Setters {
  setPerson: (value: any) => void;
  setPrx: (value: any) => void;
  setStats: (value: any) => void;
  editarStats: (campo: string, valor: any) => void;
  setNutrition: (value: any) => void;
  setTraining: (value: any) => void;
  setCalendar: (value: any) => void;
  setWarmup: (value: any) => void;
  setRoutines: (value: any) => void;
  setActiveRoutineId: (value: any) => void;
  setMeals: (value: any) => void;
  setSupplements: (value: any) => void;
  setSupplementsStrategy: (value: any) => void;
  setFeedback: (value: any) => void;
  setDiagnosis: (value: any) => void;
  setObjectives: (value: any) => void;
  setHabits: (value: any) => void;
  setEvolution: (value: any) => void;
  setFechaConsulta: (value: any) => void;
  setProximaConsulta: (value: any) => void;
  setProfileHistory: (value: any) => void;
  resetState: (newInitialData: Partial<AppData> | null) => void;
}

export default function useAppData(initialData: Partial<AppData> | null = null) {
  const [person, setPerson] = useState(() => computeState(initialData).person);
  const [stats, setStats] = useState(() => computeState(initialData).stats);
  const [nutrition, _setNutrition] = useState(() => computeState(initialData).nutrition);
  const [training, _setTraining] = useState(() => computeState(initialData).training);
  const [calendar, setCalendar] = useState(() => computeState(initialData).calendar);
  const [warmup, setWarmup] = useState(() => computeState(initialData).warmup);
  const [routines, _setRoutines] = useState(() => computeState(initialData).routines);
  const [activeRoutineId, setActiveRoutineId] = useState(() => computeState(initialData).activeRoutineId);
  const [meals, setMeals] = useState(() => computeState(initialData).meals);
  const [supplements, setSupplements] = useState(() => computeState(initialData).supplements);
  const [supplementsStrategy, setSupplementsStrategy] = useState(() => computeState(initialData).supplementsStrategy);
  const [feedback, setFeedback] = useState(() => computeState(initialData).feedback);
  const [diagnosis, setDiagnosis] = useState(() => computeState(initialData).diagnosis);
  const [objectives, setObjectives] = useState(() => computeState(initialData).objectives);
  const [habits, setHabits] = useState(() => computeState(initialData).habits);
  const [evolution, setEvolution] = useState(() => computeState(initialData).evolution);
  const [fechaConsulta, setFechaConsulta] = useState(() => computeState(initialData).fechaConsulta);
  const [proximaConsulta, setProximaConsulta] = useState(() => computeState(initialData).proximaConsulta);
  const [profileHistory, setProfileHistory] = useState(() => computeState(initialData).profileHistory || []);

  useEffect(() => {
    const nextStats = computeStatsFromEvolution(evolution);
    if (!nextStats) return;
    setStats((prev: any) => ({
      ...prev,
      ...nextStats,
    }));
  }, [evolution]);

  useEffect(() => {
    if (!evolution?.dates?.length) return;
    const lastDateRaw = evolution.dates[evolution.dates.length - 1];
    if (!lastDateRaw) return;

    const parts = lastDateRaw.split('/');
    if (parts.length !== 3) return;
    const [dd, mm, yy] = parts;
    const normalized = `20${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;

    if (normalized > fechaConsulta) {
      setFechaConsulta(normalized);
      setProximaConsulta(getProximaConsulta(normalized));
    }
  }, [evolution.dates, fechaConsulta, setFechaConsulta, setProximaConsulta]);

  // Actualizar ID automáticamente cuando cambian nombre o fecha de nacimiento
  useEffect(() => {
    if (!person.nombre || !person.fechaNacimiento) return;
    
    const newId = generatePatientId(person.nombre, person.fechaNacimiento);
    
    if (newId && newId !== person.id) {
      setPerson((prev: any) => ({ ...prev, id: newId }));
    }
  }, [person.nombre, person.fechaNacimiento, person.id, setPerson]);

  const clamp = (value: any, min: number, max: number): any => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.min(Math.max(value, min), max);
    }
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (!Number.isNaN(num)) return Math.min(Math.max(num, min), max);
    }
    return value;
  };

  const sanitizeNonNegative = (value: any): any => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.max(0, value);
    }
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (!Number.isNaN(num)) return Math.max(0, num);
    }
    return value;
  };

  const setNutrition = useCallback((value: any) => {
    if (typeof value === 'object' && value !== null) {
      const sanitized = { ...value };
      if ('kcal' in sanitized) sanitized.kcal = clamp(sanitized.kcal, 800, 5000);
      if ('prot' in sanitized) sanitized.prot = clamp(sanitized.prot, 20, 300);
      if ('carbs' in sanitized) sanitized.carbs = clamp(sanitized.carbs, 20, 500);
      if ('grasas' in sanitized) sanitized.grasas = clamp(sanitized.grasas, 20, 200);
      _setNutrition(sanitized);
    } else {
      _setNutrition(value);
    }
  }, [_setNutrition]);

  const setTraining = useCallback((value: any) => {
    if (typeof value === 'object' && value !== null) {
      const sanitized = { ...value };
      if ('dias' in sanitized) sanitized.dias = clamp(sanitized.dias, 1, 7);
      if ('cardio' in sanitized) sanitized.cardio = clamp(sanitized.cardio, 0, 7);
      if ('pasos' in sanitized) sanitized.pasos = clamp(sanitized.pasos, 0, 50000);
      _setTraining(sanitized);
    } else {
      _setTraining(value);
    }
  }, [_setTraining]);

  const setRoutines = useCallback((value: any) => {
    if (Array.isArray(value)) {
      const sanitized = value.map((routine: any) => {
        if (!routine || typeof routine !== 'object') return routine;
        const sanitizedRoutine = { ...routine, ejercicios: [...(routine.ejercicios || [])] };
        sanitizedRoutine.ejercicios = sanitizedRoutine.ejercicios.map((ej: any) => {
          if (!ej || typeof ej !== 'object') return ej;
          const sanitizedEj = { ...ej };
          const numericFields = ['sets', 'semana2', 'semana3', 'semana4', 'peso'];
          numericFields.forEach((field) => {
            if (field in sanitizedEj) {
              sanitizedEj[field] = sanitizeNonNegative(sanitizedEj[field]);
            }
          });
          return sanitizedEj;
        });
        return sanitizedRoutine;
      });
      _setRoutines(sanitized);
    } else {
      _setRoutines(value);
    }
  }, [_setRoutines]);

  const resetState = useCallback((newInitialData: Partial<AppData> | null = null) => {
    const next = computeState(newInitialData);
    setPerson(next.person);
    setStats(next.stats);
    setNutrition(next.nutrition);
    setTraining(next.training);
    setCalendar(next.calendar);
    setWarmup(next.warmup);
    setRoutines(next.routines);
    setActiveRoutineId(next.activeRoutineId);
    setMeals(next.meals);
    setSupplements(next.supplements);
    setSupplementsStrategy(next.supplementsStrategy);
    setFeedback(next.feedback);
    setDiagnosis(next.diagnosis);
    setObjectives(next.objectives);
    setHabits(next.habits);
    setEvolution(next.evolution);
    setFechaConsulta(next.fechaConsulta);
    setProximaConsulta(next.proximaConsulta);
    setProfileHistory(next.profileHistory);
  }, []);

  const editarStats = useCallback((campo: string, valor: any) => {
    const numericFields = ['peso', 'abdomen', 'grasaKg', 'grasaPorc', 'pliegue', 'avPeso', 'avAbd', 'avGrasaKg', 'avGrasaPorc', 'avPliegue', 'adherencia', 'nutricion', 'entreno', 'cardio', 'descanso'];
    if (numericFields.includes(campo)) {
      const num = parseFloat(valor);
      if (!isNaN(num) && num < 0) return;
    }
    setStats((prev: any) => ({ ...prev, [campo]: valor }));
  }, []);

  const data = useMemo<AppData>(() => ({
    person,
    stats,
    nutrition,
    training,
    calendar,
    warmup,
    routines,
    activeRoutineId,
    meals,
    supplements,
    supplementsStrategy,
    feedback,
    diagnosis,
    objectives,
    habits,
    evolution,
    fechaConsulta,
    proximaConsulta,
    profileHistory,
  }), [
    person,
    stats,
    nutrition,
    training,
    calendar,
    warmup,
    routines,
    activeRoutineId,
    meals,
    supplements,
    supplementsStrategy,
    feedback,
    diagnosis,
    objectives,
    habits,
    evolution,
    fechaConsulta,
    proximaConsulta,
    profileHistory,
  ]);

  const setters = useMemo<Setters>(() => ({
    setPerson,
    setStats,
    editarStats,
    setNutrition,
    setTraining,
    setCalendar,
    setWarmup,
    setRoutines,
    setActiveRoutineId,
    setMeals,
    setSupplements,
    setSupplementsStrategy,
    setFeedback,
    setDiagnosis,
    setObjectives,
    setHabits,
    setEvolution,
    setFechaConsulta,
    setProximaConsulta,
    setProfileHistory,
    resetState,
  }), []);

  return { data, setters };
}

export { computeState };
