export const CONSULTAS = ['C1', 'C2', 'C3', 'C4', 'C5'];

export interface UnitMap {
  [key: string]: string;
}

export const UNIT_MAP: UnitMap = {
  peso: 'kg', grasa_pct: '%', grasaKg: 'kg', mlg: 'kg', muscular: 'kg', visceral: '',
  estatura: 'cm', ta: 'mm/hg', fc: '', sat: '%',
  cint_esc: 'cm', pect_esp: 'cm', cint_abd: 'cm', abdomen: 'cm',
  bicep_rel: 'cm', bicep_con: 'cm', cadera: 'cm', muslo_alto: 'cm', muslo_med: 'cm', pant: 'cm',
  subesc: 'mm', triceps: 'mm', biceps_p: 'mm', abdominal_p: 'mm', supraesp: 'mm', supraili: 'mm', muslo_p: 'mm', pant_med: 'mm', sum_pliegues: 'mm',
  nutricion: '%', entreno: '%', cardio: '%', descanso: '%'
};

export interface Row {
  key: string;
  label: string;
  goal: 'up' | 'down' | 'neutral';
  calc?: boolean;
  isTotal?: boolean;
}

export interface Section {
  title: string;
  rows: Row[];
}

export const SECTIONS: Section[] = [
  { title: 'Composición', rows: [
    { key: 'peso', label: 'Peso', goal: 'down' },
    { key: 'grasa_pct', label: 'Grasa corporal (%)', goal: 'down' },
    { key: 'grasaKg', label: 'Grasa corporal (kg)', goal: 'down' },
    { key: 'mlg', label: 'Masa libre de grasa (kg)', goal: 'up' },
    { key: 'muscular', label: 'Masa muscular (kg)', goal: 'up' },
    { key: 'visceral', label: 'Grasa visceral (nivel)', goal: 'down' },
    { key: 'estatura', label: 'Estatura (cm)', goal: 'neutral' },
    { key: 'ta', label: 'Tensión arterial', goal: 'neutral' },
    { key: 'fc', label: 'Frecuencia cardíaca', goal: 'neutral' },
    { key: 'sat', label: 'Saturación O2', goal: 'neutral' },
  ]},
  { title: 'Perímetros', rows: [
    { key: 'cint_esc', label: 'Cuello', goal: 'down' },
    { key: 'pect_esp', label: 'Pectoral', goal: 'up' },
    { key: 'cint_abd', label: 'Cintura abdominal', goal: 'down' },
    { key: 'abdomen', label: 'Abdomen', goal: 'down' },
    { key: 'bicep_rel', label: 'Bíceps', goal: 'up' },
    { key: 'bicep_con', label: 'Bíceps contracción', goal: 'up' },
    { key: 'cadera', label: 'Cadera', goal: 'down' },
    { key: 'muslo_alto', label: 'Muslo alto', goal: 'down' },
    { key: 'muslo_med', label: 'Muslo medio', goal: 'down' },
    { key: 'pant', label: 'Pantorrilla', goal: 'up' },
  ]},
  { title: 'Pliegues', rows: [
    { key: 'subesc', label: 'Subescapular', goal: 'down' },
    { key: 'triceps', label: 'Tríceps', goal: 'down' },
    { key: 'biceps_p', label: 'Bíceps', goal: 'down' },
    { key: 'abdominal_p', label: 'Abdominal', goal: 'down' },
    { key: 'supraesp', label: 'Supraespinal', goal: 'down' },
    { key: 'supraili', label: 'Suprailiaco', goal: 'down' },
    { key: 'muslo_p', label: 'Muslo', goal: 'down' },
    { key: 'pant_med', label: 'Pantorrilla media', goal: 'down' },
    { key: 'sum_pliegues', label: 'Sumatoria pliegues', goal: 'down', isTotal: true },
  ]}
];

export const ADHERENCIA_SECTION: Section = { title: 'Adherencia', rows: [
  { key: 'nutricion', label: 'Nutrición', goal: 'up' },
  { key: 'entreno', label: 'Entrenamiento', goal: 'up' },
  { key: 'cardio', label: 'Cardio', goal: 'up' },
  { key: 'descanso', label: 'Descanso', goal: 'up' },
]};

export const PLIEGUES_KEYS = ['subesc','triceps','biceps_p','abdominal_p','supraesp','supraili','muslo_p','pant_med'];
