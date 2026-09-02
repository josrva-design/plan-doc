const person = {
  id: 'DOC-JM20260731',
  nombre: 'Juan Méndez',
  edad: '32',
  estatura: '1.75',
  pesoIni: '78.4',
  nivel: 'Moderado - ejercicio 3-5 días/semana',
  objetivo: 'Estética corporal',
  objetivoEspecifico: 'Perder 8kg en 12 semanas manteniendo masa muscular',
  sexo: 'Hombre',
  fechaNacimiento: '1993-06-07',
  pais: 'México',
  estado: 'CDMX',
  celular: '55-5555-1234',
  email: 'juan.mendez@email.com',
  instagram: '@juan.fit',
  ocupacion: 'Independiente',
  imc: '25.6',
  grasa: '24%',
  musculo: '36%',
  cintura: '84cm',
  cadera: '98cm',
  despertar: '07:00',
  dormir: '23:00',
  pasos: '9000',
  inicioTrabajo: '09:00',
  recesoTrabajo: '13:00',
  terminoTrabajo: '18:00',
  tiemposComida: '07:30 / 12:30 / 19:30 / 21:00',
  gustos: 'Proteínas magras, arroz integral, aguacate',
  quienCocina: 'Yo',
  leGusta: 'Pollo, salmón, arroz integral, aguacate, huevo',
  noLeGusta: 'Sopas cremosas, comida muy picante',
  condicionMedica: 'Sin condiciones',
  act1: 'Gimnasio',
  act2: 'Caminar',
  app: 'Ninguno',
  appEstado: 'Activa',
  af: 'Otro',
  afEstado: 'Sin antecedentes relevantes',
  med: 'Otro',
  medEstado: 'Vitamina D 2000 UI',
  alergias: 'Alimentos',
  alergiasEstado: 'Mariscos',
  cirugias: 'Ninguna',
  cirugiasEstado: '',
  intolerancias: '',
  intoleranciasEstado: '',
  lesiones: 'Ninguna',
  lesionesEstado: '',
  labs: 'Sangre',
  labsEstado: 'junio 2026',
  presupuesto: 'Medio (~-800/semana)',
  equipo: 'Gimnasio completo',
  calidadSueño: '7-8h sin interrupciones',
  tabaco: 'No',
  alcohol: 'No',
  cafe: 'Sí',
  azucar: 'No',
  drogas: 'No',
  ana: 'No',
  pre: 'No',
  energ: 'No',
  horario: '19:00',
  sesiones: '4',
  duracion: '55 min',
  planPrevio: 'Sí, 6 meses de déficit',
  resultadosPrevios: 'Bajé 6kg, mantuve músculo',
  queNoTeGusta: 'Pescado',
  tipoPlan: 'Omnívoro',
  caracteristica: 'Preparo comidas el domingo',
  interesSup: 'Sí',
  supActual: 'Creatina, Whey',
};

const stats = {
  peso: '78.4',
  abdomen: '84',
  grasaKg: '17.8',
  grasaPorc: '24',
  pliegue: '18',
  avPeso: '-4.2',
  avAbd: '-4',
  avGrasaKg: '-2.1',
  avGrasaPorc: '-3',
  avPliegue: '-4',
  adherencia: '64',
  nutricion: '92',
  entreno: '97',
  cardio: '4',
  descanso: '7',
};

const nutrition = {
  estrategia: 'Déficit moderado 300 kcal',
  kcal: '1700',
  prot: '130',
  carbs: '160',
  grasas: '55',
  suple: 'Creatina + Whey',
};

const training = {
  estrategia: 'Split muscular 4 días + cardio',
  dias: 'Lunes, Martes, Jueves, Viernes',
  cardio: '2 días/semana',
  pasos: '9000',
  rir: '2-3',
  indic: 'Progresión de carga semanal',
};

const calendar = [
  { dia: 'LUNES', dayKey: 'monday', actividad: 'Lower A', routineId: 'R1' },
  { dia: 'MARTES', dayKey: 'tuesday', actividad: 'Upper A', routineId: 'R2' },
  { dia: 'MIÉRCOLES', dayKey: 'wednesday', actividad: 'Cardio', routineId: 'R3' },
  { dia: 'JUEVES', dayKey: 'thursday', actividad: 'Upper B', routineId: 'R4' },
  { dia: 'VIERNES', dayKey: 'friday', actividad: 'Lower B', routineId: 'R5' },
  { dia: 'SÁBADO', dayKey: 'saturday', actividad: 'Cardio Activo', routineId: 'R6' },
  { dia: 'DOMINGO', dayKey: 'sunday', actividad: 'Descanso', routineId: null },
];

const warmup: import('../core/types.ts').WarmupExercise[] = [];

const routines = [
  {
    id: 'R1',
    nombre: 'Lower A',
    titulo: 'Lower A',
    ejercicios: [
      { uid: 'ex-01', id: 'E1', ejercicio: 'Sentadilla', tipo: 'Normal', serie: '4', sets: '4', reps: '8-10', peso: '', rir: '2', descanso: '120', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '4', semana2: '4', semana3: '3', semana4: '3' },
      { uid: 'ex-02', id: 'E2', ejercicio: 'Peso muerto rumano', tipo: 'Normal', serie: '4', sets: '4', reps: '8-10', peso: '', rir: '2', descanso: '120', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '4', semana2: '4', semana3: '3', semana4: '3' },
      { uid: 'ex-03', id: 'E3', ejercicio: 'Prensa de piernas', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '3', descanso: '60', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '3', semana2: '3', semana3: '3', semana4: '3' },
      { uid: 'ex-04', id: 'E4', ejercicio: 'Hip thrust con barra', tipo: 'Normal', serie: '4', sets: '4', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '4', semana2: '4', semana3: '3', semana4: '3' },
      { uid: 'ex-05', id: 'E5', ejercicio: 'Curl femoral sentado', tipo: 'Normal', serie: '3', sets: '3', reps: '12-15', peso: '', rir: '3', descanso: '60', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '3', semana2: '3', semana3: '3', semana4: '3' },
      { uid: 'ex-06', id: 'E6', ejercicio: 'Elevación de gemelos de pie', tipo: 'Normal', serie: '4', sets: '4', reps: '15-20', peso: '', rir: '2', descanso: '30', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '4', semana2: '4', semana3: '3', semana4: '3' },
      { uid: 'ex-07', id: 'E7', ejercicio: 'Plancha', tipo: 'Normal', serie: '3', sets: '3', reps: '60s', peso: '', rir: '', descanso: '30', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '3', semana2: '3', semana3: '3', semana4: '3' },
      { uid: 'ex-08', id: 'E8', ejercicio: 'Plancha lateral', tipo: 'Normal', serie: '3', sets: '3', reps: '45s', peso: '', rir: '', descanso: '30', notas: '', video: '-', categoria: 'Entreno', tecnica: '', secuencia: '', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '3', semana2: '3', semana3: '3', semana4: '3' },
    ],
  },
  {
    id: 'R2',
    nombre: 'Upper A',
    titulo: 'Upper A',
    ejercicios: [
      { uid: 'ex-10', id: 'E1', ejercicio: 'Press banca', tipo: 'Normal', serie: '4', sets: '4', reps: '8-10', peso: '', rir: '2', descanso: '120', notas: 'Pies firmes', video: '-', categoria: 'Entreno', tecnica: 'TOP SET + BACK-OFF', secuencia: 'A1', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-11', id: 'E2', ejercicio: 'Dominadas', tipo: 'Normal', serie: '4', sets: '4', reps: '6-8', peso: '', rir: '2', descanso: '120', notas: 'Full ROM', video: '-', categoria: 'Entreno', tecnica: 'TOP SET + BACK-OFF', secuencia: 'A2', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-12', id: 'E3', ejercicio: 'Press militar', tipo: 'Normal', serie: '3', sets: '3', reps: '8-10', peso: '', rir: '2', descanso: '60', notas: 'Core firme', video: '-', categoria: 'Entreno', tecnica: 'REST-PAUSE', secuencia: 'B1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-13', id: 'E4', ejercicio: 'Jalón facial', tipo: 'Normal', serie: '4', sets: '4', reps: '15', peso: '', rir: '3', descanso: '60', notas: 'Hombros saludables', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'B2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-14', id: 'E5', ejercicio: 'Curl con barra', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Sin balanceo', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-15', id: 'E6', ejercicio: 'Extensión de tríceps', tipo: 'Normal', serie: '3', sets: '3', reps: '12-15', peso: '', rir: '2', descanso: '60', notas: 'Extender completamente', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-16', id: 'E7', ejercicio: 'Curl martillo', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Muñeca neutra', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C3', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-17', id: 'E8', ejercicio: 'Extensión overhead', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Codos fijos', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'D1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
    ],
  },
  {
    id: 'R3',
    nombre: 'Cardio',
    titulo: 'Cardio',
    ejercicios: [
      { uid: 'ex-18', id: 'E1', ejercicio: 'Caminata inclinada', tipo: 'Normal', serie: '1', sets: '1', reps: '20 MIN', peso: '', rir: '', descanso: '0', notas: 'Moderado', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'A1', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-19', id: 'E2', ejercicio: 'Elíptica', tipo: 'Normal', serie: '1', sets: '1', reps: '15 MIN', peso: '', rir: '', descanso: '0', notas: 'Inclinación 10', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'A2', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-20', id: 'E3', ejercicio: 'Ciclismo', tipo: 'Normal', serie: '1', sets: '1', reps: '15 MIN', peso: '', rir: '', descanso: '0', notas: 'Resistencia media', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'B1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-21', id: 'E4', ejercicio: 'Remo sentado', tipo: 'Normal', serie: '3', sets: '3', reps: '12', peso: '', rir: '2', descanso: '60', notas: 'Espalda', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'B2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
    ],
  },
  {
    id: 'R4',
    nombre: 'Upper B',
    titulo: 'Upper B',
    ejercicios: [
      { uid: 'ex-22', id: 'E1', ejercicio: 'Press inclinado', tipo: 'Normal', serie: '4', sets: '4', reps: '8-10', peso: '', rir: '2', descanso: '60', notas: 'Controlar bajada', video: '-', categoria: 'Entreno', tecnica: 'TOP SET + BACK-OFF', secuencia: 'A1', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-23', id: 'E2', ejercicio: 'Jalón al pecho', tipo: 'Normal', serie: '4', sets: '4', reps: '8-10', peso: '', rir: '2', descanso: '60', notas: 'Full ROM', video: '-', categoria: 'Entreno', tecnica: 'TOP SET + BACK-OFF', secuencia: 'A2', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-24', id: 'E3', ejercicio: 'Elevaciones laterales', tipo: 'Normal', serie: '3', sets: '3', reps: '12-15', peso: '', rir: '2', descanso: '60', notas: 'Sin balanceo', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'B1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-25', id: 'E4', ejercicio: 'Jalón facial', tipo: 'Normal', serie: '4', sets: '4', reps: '15', peso: '', rir: '3', descanso: '60', notas: 'Hombros saludables', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'B2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-26', id: 'E5', ejercicio: 'Curl martillo', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Muñeca neutra', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-27', id: 'E6', ejercicio: 'Extensión overhead', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Codos fijos', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-28', id: 'E7', ejercicio: 'Curl martillo', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Alternado', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C3', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-29', id: 'E8', ejercicio: 'Press cerrado', tipo: 'Normal', serie: '3', sets: '3', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Tríceps', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'D1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
    ],
  },
  {
    id: 'R5',
    nombre: 'Lower B',
    titulo: 'Lower B',
    ejercicios: [
      { uid: 'ex-30', id: 'E1', ejercicio: 'Peso muerto', tipo: 'Normal', serie: '4', sets: '4', reps: '6-8', peso: '', rir: '2', descanso: '120', notas: 'Espalda neutra', video: '-', categoria: 'Entreno', tecnica: 'TOP SET + BACK-OFF', secuencia: 'A1', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-31', id: 'E2', ejercicio: 'Prensa de piernas', tipo: 'Normal', serie: '4', sets: '4', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Rango completo', video: '-', categoria: 'Entreno', tecnica: 'DROPSET', secuencia: 'A2', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-32', id: 'E3', ejercicio: 'Hip thrust con barra', tipo: 'Normal', serie: '4', sets: '4', reps: '10-12', peso: '', rir: '2', descanso: '60', notas: 'Pico de cadera', video: '-', categoria: 'Entreno', tecnica: 'BACK-OFF', secuencia: 'B1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-33', id: 'E4', ejercicio: 'Curl femoral sentado', tipo: 'Normal', serie: '3', sets: '3', reps: '12-15', peso: '', rir: '3', descanso: '60', notas: 'Control negativo', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'B2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-34', id: 'E5', ejercicio: 'Extensión de cuádriceps', tipo: 'Normal', serie: '3', sets: '3', reps: '12-15', peso: '', rir: '3', descanso: '60', notas: 'Estiramiento completo', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-35', id: 'E6', ejercicio: 'Elevación de gemelos', tipo: 'Normal', serie: '4', sets: '4', reps: '15-20', peso: '', rir: '2', descanso: '30', notas: 'Estiramiento completo', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'C2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-36', id: 'E7', ejercicio: 'Lunges', tipo: 'Normal', serie: '3', sets: '3', reps: '10', peso: '', rir: '2', descanso: '60', notas: 'Equilibrio', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'D1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-37', id: 'E8', ejercicio: 'Plancha lateral', tipo: 'Normal', serie: '3', sets: '3', reps: '45s', peso: '', rir: '', descanso: '30', notas: 'Core lateral', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'D2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
    ],
  },
  {
    id: 'R6',
    nombre: 'Cardio Activo',
    titulo: 'Cardio Activo',
    ejercicios: [
      { uid: 'ex-40', id: 'E1', ejercicio: 'Caminata inclinada', tipo: 'Normal', serie: '1', sets: '1', reps: '20 MIN', peso: '', rir: '', descanso: '0', notas: 'Inclinación 12', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'A1', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-41', id: 'E2', ejercicio: 'Elíptica', tipo: 'Normal', serie: '1', sets: '1', reps: '15 MIN', peso: '', rir: '', descanso: '0', notas: 'Resistencia media-alta', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'A2', esBase: true, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-42', id: 'E3', ejercicio: 'Ciclismo', tipo: 'Normal', serie: '1', sets: '1', reps: '10 MIN', peso: '', rir: '', descanso: '0', notas: 'Cuerpo completo', video: '-', categoria: 'Entreno', tecnica: '', secuencia: 'A3', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-43', id: 'E4', ejercicio: 'Remo sentado', tipo: 'Normal', serie: '3', sets: '3', reps: '12', peso: '', rir: '2', descanso: '60', notas: 'Espalda', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'B1', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
      { uid: 'ex-44', id: 'E5', ejercicio: 'Jalón facial', tipo: 'Normal', serie: '3', sets: '3', reps: '15', peso: '', rir: '3', descanso: '30', notas: 'Hombros', video: '-', categoria: 'Entreno', tecnica: 'SERIE NORMAL', secuencia: 'B2', esBase: false, aproxBase: null, aproxPorcentaje: null, musculo: '', movimiento: '', semana1: '', semana2: '', semana3: '', semana4: '' },
    ],
  },
];

const meals = [
  {
    menuType: 'armar',
    time: 'DESAYUNO',
    hour: '07:30',
    kcal: 520,
    macros: { proteinas: 32, carbos: 58, grasas: 16 },
    foods: [
      { nombre: 'Avena en hojuelas', gramos: '60', porcion: 'tazón', cantidad: '1', p: '7.9', c: '40', g: '3.8', kcal: '225', grupo: 'carbohidratos' },
      { nombre: 'Huevo entero', gramos: '3', porcion: 'pzas', cantidad: '3', p: '18', c: '1.5', g: '15', kcal: '234', grupo: 'proteinas' },
      { nombre: 'Plátano', gramos: '120', porcion: 'unidad', cantidad: '1', p: '1.3', c: '31', g: '0.4', kcal: '105', grupo: 'carbohidratos' },
      { nombre: 'Aceite de oliva', gramos: '5', porcion: 'cdta', cantidad: '1', p: '0', c: '0', g: '5', kcal: '45', grupo: 'grasas' },
    ],
  },
  {
    menuType: 'fijo',
    time: 'COMIDA',
    hour: '13:00',
    kcal: 750,
    macros: { proteinas: 55, carbos: 70, grasas: 25 },
    foods: [],
    menus: [
      {
        id: 'menu-1',
        nombre: 'Menú A',
        alimentos: [
          { nombre: 'Pechuga de pollo', gramos: '180', porcion: 'filete', cantidad: '1', p: '53', c: '0', g: '3.5', kcal: '297', grupo: 'proteinas' },
          { nombre: 'Arroz integral cocido', gramos: '200', porcion: 'tazón', cantidad: '1', p: '5', c: '45', g: '1.5', kcal: '248', grupo: 'carbohidratos' },
          { nombre: 'Brócoli cocido', gramos: '120', porcion: 'plato', cantidad: '1', p: '1.5', c: '5', g: '0.2', kcal: '34', grupo: 'verduras' },
        ],
      },
      {
        id: 'menu-2',
        nombre: 'Menú B',
        alimentos: [
          { nombre: 'Salmón', gramos: '160', porcion: 'filete', cantidad: '1', p: '38', c: '0', g: '22', kcal: '332', grupo: 'proteinas' },
          { nombre: 'Camote cocido', gramos: '180', porcion: 'unidad', cantidad: '1', p: '3', c: '41', g: '0.3', kcal: '155', grupo: 'carbohidratos' },
          { nombre: 'Brócoli cocido', gramos: '120', porcion: 'plato', cantidad: '1', p: '4', c: '7', g: '0.4', kcal: '42', grupo: 'verduras' },
        ],
      },
    ],
  },
  {
    menuType: 'fijo',
    time: 'SNACK',
    hour: '17:00',
    kcal: 220,
    macros: { proteinas: 20, carbos: 20, grasas: 8 },
    foods: [],
    menus: [
      {
        id: 'menu-1',
        nombre: 'Snack único',
        alimentos: [
          { nombre: 'Kéfir natural', gramos: '150', porcion: 'envase', cantidad: '1', p: '15', c: '8', g: '0.5', kcal: '90', grupo: 'lacteos' },
          { nombre: 'Almendras', gramos: '20', porcion: 'puñado', cantidad: '1', p: '4.5', c: '2', g: '11', kcal: '115', grupo: 'grasas' },
          { nombre: 'Moras azules', gramos: '80', porcion: 'tazón', cantidad: '1', p: '1', c: '18', g: '0.5', kcal: '45', grupo: 'frutas' },
        ],
      },
    ],
  },
  {
    menuType: 'fijo',
    time: 'CENA',
    hour: '20:30',
    kcal: 480,
    macros: { proteinas: 38, carbos: 30, grasas: 22 },
    foods: [],
    menus: [
      {
        id: 'menu-1',
        nombre: 'Cena única',
        alimentos: [
          { nombre: 'Salmón', gramos: '160', porcion: 'filete', cantidad: '1', p: '34', c: '0', g: '18', kcal: '332', grupo: 'proteinas' },
          { nombre: 'Boniato cocido', gramos: '180', porcion: 'unidad', cantidad: '1', p: '3', c: '41', g: '0.3', kcal: '155', grupo: 'carbohidratos' },
          { nombre: 'Brócoli cocido', gramos: '120', porcion: 'plato', cantidad: '1', p: '4', c: '7', g: '0.4', kcal: '42', grupo: 'verduras' },
        ],
      },
    ],
  },
];

const supplements = [
  { uid: 'sup-mock-1', id: 'sup1', nombre: 'Creatina', tipo: 'rendimiento', marca: 'MyProtein', notas: 'Sin carga', horario: 'POST ENTRENO', gramos: '5', porcion: '5g' },
  { uid: 'sup-mock-2', id: 'sup2', nombre: 'Whey Protein', tipo: 'proteina', marca: 'ON', notas: '', horario: 'POST ENTRENO', gramos: '30', porcion: 'Batido' },
  { uid: 'sup-mock-3', id: 'sup3', nombre: 'Omega 3', tipo: 'salud', marca: '', notas: '', horario: 'MAÑANA', gramos: '1', porcion: '1g' },
  { uid: 'sup-mock-4', id: 'sup4', nombre: 'Vitamina D', tipo: 'salud', marca: '', notas: 'Revisar niveles', horario: 'MAÑANA', gramos: '2000', porcion: 'UI' },
  { uid: 'sup-mock-5', id: 'sup5', nombre: 'Magnesio', tipo: 'salud', marca: '', notas: 'Ayuda sueño', horario: 'NOCHE', gramos: '400', porcion: 'mg' },
];

const supplementsStrategy = 'Proteína + Creatina básica';

const evolution = {
  dates: ['01/06/26', '01/07/26', '29/07/26'],
  cells: {
    C1: { peso: 82.5, abdomen: 94, grasaKg: 21.3, grasa_pct: 28.5, pliegue: 24, muscular: 33.5, cint_abd: 92, cadera: 102, nutricion: 85, entreno: 90, cardio: 3 },
    C2: { peso: 78.4, abdomen: 90, grasaKg: 19.5, grasa_pct: 27, pliegue: 22, muscular: 35.5, cint_abd: 90, cadera: 99, nutricion: 88, entreno: 93, cardio: 3.5 },
    C3: { peso: 74.2, abdomen: 80, grasaKg: 16.6, grasa_pct: 23, pliegue: 18, muscular: 37, cint_abd: 84, cadera: 96, nutricion: 92, entreno: 97, cardio: 4 },
  },
  consultas: ['C1', 'C2', 'C3'],
};

const fechaConsulta = '29/07/26';
const proximaConsulta = '28/08/26';

const mockPacienteCompleto = {
  person,
  stats,
  nutrition,
  training,
  calendar,
  warmup,
  routines,
  activeRoutineId: 'R1',
  meals,
  supplements,
  supplementsStrategy,
  evolution,
  fechaConsulta,
  proximaConsulta,
};

export default mockPacienteCompleto;
