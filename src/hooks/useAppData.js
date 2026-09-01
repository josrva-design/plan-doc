import { useState, useCallback } from 'react';
import {
  initialPerson,
  initialPrx,
  initialStats,
  initialNutrition,
  initialTraining,
  initialCalendar,
  initialWarmupUpper,
  initialWarmupLower,
  initialRoutines,
  initialMeals,
  initialSupplements,
  initialFeedback,
  initialDiagnosis,
  initialObjectives,
  initialHabits,
  initialGuide,
  initialGlossary,
  initialEvolution,
  initialFechaConsulta,
} from '../data/sampleData.js';

const computeState = (initialData = null) => {
  const _p = initialData?.person ?? initialPerson;
  const _prx = initialData?.prx ?? initialPrx;
  const _stats = initialData?.stats ?? initialStats;
  const _nutrition = initialData?.nutrition ?? initialNutrition;
  const _training = initialData?.training ?? initialTraining;
  const _calendar = initialData?.calendar ?? initialCalendar;
  const _warmupUpper = initialData?.warmupUpper ?? initialWarmupUpper;
  const _warmupLower = initialData?.warmupLower ?? initialWarmupLower;
  const _routines = initialData?.routines ?? initialRoutines;
  const _meals = initialData?.meals ?? initialMeals;
  const _supplements = initialData?.supplements ?? initialSupplements;
  const _feedback = initialData?.feedback ?? initialFeedback;
  const _diagnosis = initialData?.diagnosis ?? initialDiagnosis;
  const _objectives = initialData?.objectives ?? initialObjectives;
  const _habits = initialData?.habits ?? initialHabits;
  const _guide = initialData?.guide ?? initialGuide;
  const _glossary = initialData?.glossary ?? initialGlossary;
  const _evolution = initialData?.evolution ?? initialEvolution;
  const _fechaConsulta = initialData?.fechaConsulta ?? initialFechaConsulta;

  return {
    person: { ..._p },
    prx: _prx,
    stats: { ..._stats },
    nutrition: { ..._nutrition },
    training: { ..._training },
    calendar: _calendar?.map((d) => ({ ...d })) ?? [],
    warmupUpper: {
      ..._warmupUpper,
      general: [...(_warmupUpper?.general ?? [])],
      movilidad: [...(_warmupUpper?.movilidad ?? [])],
      específico: [...(_warmupUpper?.específico ?? [])],
    },
    warmupLower: {
      ..._warmupLower,
      general: [...(_warmupLower?.general ?? [])],
      movilidad: [...(_warmupLower?.movilidad ?? [])],
      específico: [...(_warmupLower?.específico ?? [])],
    },
    routines: _routines?.map((r) => ({
      ...r,
      ejercicios: r.ejercicios?.map((e) => ({ ...e })) ?? [],
    })) ?? [],
    activeRoutineId: _routines?.[0]?.id || null,
    meals: _meals ? [..._meals] : [],
    supplements: _supplements?.map((s) => ({ ...s })) ?? [],
    feedback: { ..._feedback },
    diagnosis: { ..._diagnosis },
    objectives: { ..._objectives },
    habits: { ..._habits },
    guide: [...(_guide ?? [])],
    glossary: [...(_glossary ?? [])],
    classifications: {},
    evolution: { ..._evolution },
    fechaConsulta: _fechaConsulta,
  };
};

export default function useAppData(initialData = null) {
  const [person, setPerson] = useState(() => computeState(initialData).person);
  const [prx, setPrx] = useState(() => computeState(initialData).prx);
  const [stats, setStats] = useState(() => computeState(initialData).stats);
  const [nutrition, setNutrition] = useState(() => computeState(initialData).nutrition);
  const [training, setTraining] = useState(() => computeState(initialData).training);
  const [calendar, setCalendar] = useState(() => computeState(initialData).calendar);
  const [warmupUpper, setWarmupUpper] = useState(() => computeState(initialData).warmupUpper);
  const [warmupLower, setWarmupLower] = useState(() => computeState(initialData).warmupLower);
  const [routines, setRoutines] = useState(() => computeState(initialData).routines);
  const [activeRoutineId, setActiveRoutineId] = useState(() => computeState(initialData).activeRoutineId);
  const [meals, setMeals] = useState(() => computeState(initialData).meals);
  const [supplements, setSupplements] = useState(() => computeState(initialData).supplements);
  const [feedback, setFeedback] = useState(() => computeState(initialData).feedback);
  const [diagnosis, setDiagnosis] = useState(() => computeState(initialData).diagnosis);
  const [objectives, setObjectives] = useState(() => computeState(initialData).objectives);
  const [habits, setHabits] = useState(() => computeState(initialData).habits);
  const [guide, setGuide] = useState(() => computeState(initialData).guide);
  const [glossary, setGlossary] = useState(() => computeState(initialData).glossary);
  const [evolution, setEvolution] = useState(() => computeState(initialData).evolution);
  const [fechaConsulta, setFechaConsulta] = useState(() => computeState(initialData).fechaConsulta);
  const [classifications, setClassifications] = useState({});

  const resetState = useCallback((newInitialData = null) => {
    const next = computeState(newInitialData);
    setPerson(next.person);
    setPrx(next.prx);
    setStats(next.stats);
    setNutrition(next.nutrition);
    setTraining(next.training);
    setCalendar(next.calendar);
    setWarmupUpper(next.warmupUpper);
    setWarmupLower(next.warmupLower);
    setRoutines(next.routines);
    setActiveRoutineId(next.activeRoutineId);
    setMeals(next.meals);
    setSupplements(next.supplements);
    setFeedback(next.feedback);
    setDiagnosis(next.diagnosis);
    setObjectives(next.objectives);
    setHabits(next.habits);
    setGuide(next.guide);
    setGlossary(next.glossary);
    setClassifications({});
    setEvolution(next.evolution);
    setFechaConsulta(next.fechaConsulta);
  }, []);

  const editarStats = useCallback((campo, valor) => {
    setStats(prev => ({ ...prev, [campo]: valor }));
  }, []);

  const data = {
    person,
    prx,
    stats,
    nutrition,
    training,
    calendar,
    warmupUpper,
    warmupLower,
    routines,
    activeRoutineId,
    meals,
    supplements,
    feedback,
    diagnosis,
    objectives,
    habits,
    guide,
    glossary,
    classifications,
    evolution,
    fechaConsulta,
  };

  const setters = {
    setPerson,
    setPrx,
    setStats,
    editarStats,
    setNutrition,
    setTraining,
    setCalendar,
    setWarmupUpper,
    setWarmupLower,
    setRoutines,
    setActiveRoutineId,
    setMeals,
    setSupplements,
    setFeedback,
    setDiagnosis,
    setObjectives,
    setHabits,
    setGuide,
    setGlossary,
    setClassifications,
    setEvolution,
    setFechaConsulta,
    resetState,
  };

  return { data, setters };
}

