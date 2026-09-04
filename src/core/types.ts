// ==========================================
// EDITOR
// ==========================================

export interface Person {
  id: string;
  nombre: string;
  edad: string;
  estatura: string;
  pesoIni: string;
  nivel: string;
  objetivo: string;
  objetivoEspecifico: string;
  sexo: string;
  fechaNacimiento: string;
  pais: string;
  estado: string;
  celular: string;
  email: string;
  instagram: string;
  ocupacion: string;
  imc: string;
  grasa: string;
  musculo: string;
  cintura: string;
  cadera: string;
  despertar: string;
  dormir: string;
  pasos: string;
  inicioTrabajo: string;
  recesoTrabajo: string;
  terminoTrabajo: string;
  tiemposComida: string;
  gustos: string;
  quienCocina: string;
  leGusta: string;
  noLeGusta: string;
  condicionMedica: string;
  app: string;
  appEstado: string;
  af: string;
  afEstado: string;
  med: string;
  medEstado: string;
  alergias: string;
  alergiasEstado: string;
  cirugias: string;
  cirugiasEstado: string;
  intolerancias: string;
  intoleranciasEstado: string;
  lesiones: string;
  lesionesEstado: string;
  labs: string;
  labsEstado: string;
  presupuesto: string;
  equipo: string;
  calidadSueño: string;
  tabaco: string;
  alcohol: string;
  cafe: string;
  azucar: string;
  drogas: string;
  ana: string;
  pre: string;
  energ: string;
  act1: string;
  act2: string;
  horario: string;
  sesiones: string;
  duracion: string;
  planPrevio: string;
  resultadosPrevios: string;
  queNoTeGusta: string;
  tipoPlan: string;
  caracteristica: string;
  interesSup: string;
  supActual: string;
}

export interface NutritionData {
  estrategia: string;
  kcal: string;
  prot: string;
  carbs: string;
  grasas: string;
  suple: string;
  planPrevio: string;
  resultadosPrevios: string;
  queNoTeGusta: string;
  tipoPlan: string;
  caracteristica: string;
  interesSuplementos: string;
  suplementacionActual: string;
}

export interface TrainingData {
  estrategia: string;
  dias: string;
  cardio: string;
  pasos: string;
  rir: string;
  indic: string;
}

export interface CalendarDay {
  dia: string;
  dayKey: string;
  actividad: string;
  routineId: string | null;
}

export interface WarmupExercise {
  tipo: string;
  grupo: string;
  video: string;
  ejercicio: string;
  sets: string;
  reps: string;
  pausa: string;
  notas: string;
}

export interface WarmupExercise {
  uid: string;
  tipo: string;
  ejercicio: string;
  sets: string;
  reps: string;
  pausa: string;
  notas: string;
  video: string;
  grupo: 'general' | 'upper' | 'lower';
  fase?: 'ED' | 'CE';
  blockLetter: string;
  blockSerie: string;
  blockPosition: number;
  musculo?: string;
  movimiento?: string;
}

export interface RoutineExercise {
  id: string;
  ejercicio: string;
  serie: string;
  reps: string;
  peso: string;
  descanso: string;
  rir: string;
  notas: string;
  tecnica?: string;
}

export interface RoutineBlock {
  id: string;
  label: string;
  group: string;
  exercises: RoutineExercise[];
}

export interface Routine {
  id: string;
  label: string;
  blocks: RoutineBlock[];
}

export interface FoodPortion {
  label: string;
  gramos: number;
  p: number;
  c: number;
  g: number;
  kcal: number;
}

export interface FoodItem {
  nombre: string;
  grupo: string;
  porciones: FoodPortion[];
}

export interface MealFood {
  foodId: string;
  portionLabel: string;
  grams: number;
  p: number;
  c: number;
  g: number;
  kcal: number;
}

export interface MealEditor {
  dayKey?: string;
  id?: string;
  time: string;
  hour?: string;
  tiempo?: string;
  kcal?: number;
  macros?: { proteinas?: number; carbos?: number; grasas?: number };
  menuType?: 'fijo' | 'armar';
  foods: Array<{
    name?: string;
    nombre?: string;
    grams?: string;
    unit?: string;
    kcal?: number;
    p?: string;
    c?: string;
    g?: string;
    cantidad?: string;
    porcion?: string;
    porcionBase?: string;
    foodId?: string;
  }>;
  menus?: Array<{
    id?: string;
    nombre?: string;
    alimentos?: MealEditor['foods'];
  }>;
}

export interface DayPlan {
  meals: Record<string, MealEditor[]>;
  routineId: string | null;
  supplementIds: string[];
}

export interface WeeklyPlan {
  monday: DayPlan;
  tuesday: DayPlan;
  wednesday: DayPlan;
  thursday: DayPlan;
  friday: DayPlan;
  saturday: DayPlan;
  sunday: DayPlan;
}

export interface Supplement {
  id: string;
  uid: string;
  nombre: string;
  tipo: string;
  marca?: string;
  notas?: string;
  horario: string;
  gramos: string;
  porcion: string;
}

export interface Stats {
  peso: string;
  abdomen: string;
  grasaKg: string;
  grasaPorc: string;
  pliegue: string;
  avPeso: string;
  avAbd: string;
  avGrasaKg: string;
  avGrasaPorc: string;
  avPliegue: string;
  adherencia: string;
  nutricion: string;
  entreno: string;
  cardio: string;
  descanso: string;
}

export interface Feedback {
  r1: string;
  r2: string;
  r3: string;
}

export interface Diagnosis {
  d1: string;
  d2: string;
  d3: string;
}

export interface Objectives {
  o1: string;
  o2: string;
  o3: string;
}

export interface EvolutionCells {
  [key: string]: {
    peso?: number;
    abdomen?: number;
    grasaKg?: number;
    grasa_pct?: number;
    muscular?: number;
    cint_abd?: number;
    cadera?: number;
    [key: string]: number | undefined;
  };
}

export interface InBodyRange {
  min: number;
  max: number;
  idealMin: number;
  idealMax: number;
}

export interface InBodyConfig {
  peso: InBodyRange;
  muscular: InBodyRange;
  grasaPct: InBodyRange;
}

export interface EvolutionData {
  dates: string[];
  cells: EvolutionCells;
  consultas: string[];
  inBodyConfig?: InBodyConfig;
}

export interface EditorRoutineExercise {
  uid: string;
  tipo: string;
  ejercicio: string;
  sets: string;
  reps: string;
  peso: string;
  descanso: string;
  notas: string;
  video: string;
  categoria: string;
  tecnica: string;
  rir: string;
  esBase: boolean;
  aproxBase: string | null;
  aproxPorcentaje: number | null;
  porcentaje?: number | null;
  semana1?: string;
  semana2?: string;
  semana3?: string;
  semana4?: string;
  s1?: string;
  s2?: string;
  s3?: string;
  s4?: string;
  musculo?: string;
  movimiento?: string;
  blockLetter?: string;
  blockSerie?: string;
  blockPosition?: number;
  secuencia?: string;
}

export interface EditorExerciseDisplay extends EditorRoutineExercise {
  grupo: string;
  groupLabel: string;
  color: string;
  isFirstInBlock: boolean;
  isLastInBlock: boolean;
  blockLetter: string;
  blockSerie: string;
  blockPosition: number;
  isOption: boolean;
  optionNumber: number | null;
  fase: string;
  faseColor: string;
}

export interface WarmupRow {
  uid: string;
  serie: string;
  ejercicio: string;
  sets: number;
  reps: string;
  descanso: string;
  notas: string;
  video: string;
  grupo: string;
  groupLabel: string;
  color: string;
}

export interface EditorRoutine {
  id: string;
  nombre: string;
  titulo: string;
  ejercicios: EditorRoutineExercise[];
}

export interface AppData {
  person: Person;
  stats: Stats;
  nutrition: NutritionData;
  training: TrainingData;
  calendar: CalendarDay[];
  warmup: WarmupExercise[];
  routines: EditorRoutine[];
  activeRoutineId: string | null;
  meals: MealEditor[];
  supplements: Supplement[];
  feedback: Feedback;
  diagnosis: Diagnosis;
  objectives: Objectives;
  habits: Record<string, string>;
  evolution: EvolutionData;
  fechaConsulta: string;
  proximaConsulta: string;
  profileHistory: ProfileHistoryEntry[];
}

export interface ProfileHistoryEntry {
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

// ==========================================
// PRODUCTO / CLIENTE
// ==========================================

export interface MealClient {
  dayKey: string;
  time: string;
  hour: string;
  kcal: number;
  macros?: { proteinas: number; carbos: number; grasas: number };
  foods: Array<{
    name: string;
    grams: string;
    unit?: string;
    kcal?: number;
    macros?: { proteinas: number; carbos: number; grasas: number };
    grupo?: string;
  }>;
  menuType?: 'fijo' | 'armar';
  menus?: Array<{ id?: string; nombre?: string; alimentos?: MealClient['foods'] }>;
}
export interface PatientEjercicio {
  codigo: string;
  nombre: string;
  badgeTecnica: string;
  prescripcion: string;
  grupo?: string;
  subtipo?: string;
  series?: string;
  reps?: string;
  pausa?: string;
  descanso?: string;
  semana1?: string;
  semana2?: string;
  semana3?: string;
  semana4?: string;
  musculo?: string;
  movimiento?: string;
  peso?: string;
  video?: string;
  notas?: string;
}

export type BloqueTipo = 'BISERIE' | 'TRISERIE' | 'SERIE SIMPLE' | 'ELIGE 1 OPCIÓN';

export interface PatientBloque {
  letra: string;
  tipo: BloqueTipo;
  indicacion: string;
  ejercicios: PatientEjercicio[];
}

export type FaseId = 'CG' | 'ED' | 'CE' | 'SA' | 'PRINCIPAL' | 'ABD';

export interface PatientFase {
  id: FaseId;
  nombre: string;
  badgeColor: string;
  bloques: PatientBloque[];
  grupo?: 'lower' | 'upper' | 'main';
}

export interface DayRoutine {
  tipo: 'lower' | 'upper' | 'rest' | 'full';
  actividad: string;
  titulo: string;
  subtitulo: string;
  fases: PatientFase[];
}

export interface SupplementClient {
  nombre: string;
  dosis: string;
  hora: string;
  tiempo: string;
  frecuencia: string;
  tomarCon: string;
  notas: string;
  gramos?: string;
  porcion?: string;
  cantidad?: string;
  marca?: string;
}

export interface WarmupPhase {
  fase: 'GENERAL' | 'MOVILIDAD' | 'ESPECÍFICO';
  opciones: Array<{
    ejercicio: string;
    detalle: string;
    tipo: string;
    grupo: string;
    blockLetter?: string;
    blockSerie?: string;
    blockPosition?: number;
    musculo?: string;
    movimiento?: string;
    sets?: string;
    reps?: string;
    pausa?: string;
    notas?: string;
    video?: string;
    uid?: string;
  }>;
  individuales: Array<{
    ejercicio: string;
    detalle: string;
    tipo: string;
    grupo: string;
    blockLetter?: string;
    blockSerie?: string;
    blockPosition?: number;
    musculo?: string;
    movimiento?: string;
    sets?: string;
    reps?: string;
    pausa?: string;
    notas?: string;
    video?: string;
    uid?: string;
  }>;
}

export interface AvanceMedida {
  label: string;
  anterior: string;
  actual: string;
  delta: number;
}

export interface AvancePeso extends AvanceMedida {}

export interface EstadisticasClient {
  adherencia: number;
  nutricion: number;
  entrenamiento: number;
  cardio: number;
  descanso: number;
}

export interface TratamientoNutricional {
  estrategia: string;
  kcal: string;
  proteina: string;
  carbos: string;
  grasas: string;
}

export interface TratamientoEntrenamiento {
  estrategia: string;
  dias: string;
  cardio: string;
  pasos: string;
  rir: string;
  indic: string;
}

export interface Clinico {
  retroalimentacion: string[];
  diagnostico: string[];
  objetivos: string[];
}

export interface GuiaItem {
  titulo: string;
  contenido: string;
}

export interface GlosarioItem {
  term: string;
  def: string;
  cat?: string;
  subtitle?: string;
  body?: string;
  example?: string;
}

export interface ClientPlan {
  person: {
    nombre: string;
    objetivo: string;
    pasos?: string;
    edad?: string;
    sexo?: string;
  };
  proximaConsulta: string | null;
  proximaConsultaVencida: boolean;
  calendar: CalendarDay[];
  meals: MealClient[];
  routines: Record<string, DayRoutine>;
  supplements: SupplementClient[];
  stats: {
    adherencia: number;
  };
  avances: {
    peso: AvancePeso;
    abdomen?: AvanceMedida;
    grasaKg?: AvanceMedida;
    grasaPct?: AvanceMedida;
    pliegue?: AvanceMedida;
  };
  estadisticas: EstadisticasClient;
  tratamientoNutricional: TratamientoNutricional;
  tratamientoEntrenamiento: TratamientoEntrenamiento;
  clinico: Clinico;
  fechaConsulta: string;
  warmupUpper: PatientFase[];
  warmupLower: PatientFase[];
  warmupGeneral: PatientFase[];
  habits?: Record<string, string>;
  supplementsStrategy?: string;
}
