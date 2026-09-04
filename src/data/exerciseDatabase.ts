export interface Exercise {
  id: string;
  nombre: string;
  musculo: string;
  movimiento: string;
  nota: string;
  categoria?: 'calentamiento' | 'rutina' | 'aprox';
  grupo?: 'general' | 'movilidad' | 'especifico';
  equipo?: string;
}

export const exerciseDatabase: Exercise[] = [
  {
    id: "ex-001",
    nombre: "Ab roller",
    musculo: "Abdomen",
    movimiento: "Flexión",
    nota: "Rueda adelante controlada. Core firme. No arquees la espalda.",
    categoria: 'rutina',
  },

  {
    id: "ex-002",
    nombre: "Abducción en máquina",
    musculo: "Glúteo medio",
    movimiento: "Abducción",
    nota: "Asiento ajustado. Abre hasta tope. Control en bajada.",
    categoria: 'rutina',
  },

  {
    id: "ex-136",
    nombre: "Abducción y aducción",
    musculo: "Glúteo medio",
    movimiento: "Abducción/Aducción",
    nota: "Movimiento alternado de apertura y cierre de piernas. Control total.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
  },

  {
    id: "ex-137",
    nombre: "Abducción y aducción acostado",
    musculo: "Glúteo medio",
    movimiento: "Abducción/Aducción",
    nota: "Acostado. Apertura y cierre de piernas con liga. Control en todo el rango.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
    equipo: "Liga",
  },

  {
    id: "ex-138",
    nombre: "Aductor",
    musculo: "Aductor",
    movimiento: "Aducción",
    nota: "Aprieta y mantén. Control en la contracción. Sin balanceo.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
  },

  {
    id: "ex-004",
    nombre: "Aperturas",
    musculo: "Pectoral",
    movimiento: "Aducción horizontal",
    nota: "Muñecas en semiflexión, amplitud sin dolor en hombro. Squeeze al final.",
    categoria: 'rutina',
  },

  {
    id: "ex-049",
    nombre: "Balanceo de kettlebell",
    musculo: "Posterior/core",
    movimiento: "Potencia",
    nota: "Empuje de cadera, no lumbar. Brazos relajados. Control en bajada.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-125",
    nombre: "Bear crawl",
    musculo: "Cardio/core",
    movimiento: "Potencia",
    nota: "Manos y rodillas. Avanza alternando piernas. Core firme.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-130",
    nombre: "Bicicleta",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Resistencia moderada. Ritmo constante. Cadencia controlada.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-005",
    nombre: "Bicicleta de ataque",
    musculo: "Cardio",
    movimiento: "Potencia",
    nota: "Intensidad alta. Brazos y piernas coordinados.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-011",
    nombre: "Buenos días",
    musculo: "Isquiotibiales",
    movimiento: "Cadena posterior",
    nota: "Barra en trapecios. Cadera hacia atrás. Espalda neutra. Peso ligero.",
    categoria: 'rutina',
  },

  {
    id: "ex-027",
    nombre: "Bug muerto",
    musculo: "Core",
    movimiento: "Estabilidad",
    nota: "Espalda baja pegada al suelo. Movimiento alternado lento.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-012",
    nombre: "Burpees",
    musculo: "Cardio",
    movimiento: "Potencia",
    nota: "Completo. Aterriza suave. Acelera solo si el control lo permite.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-126",
    nombre: "Caminadora",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Inclinación 10-15%. Brazos en movimiento. Ritmo constante.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-041",
    nombre: "Caminata del granjero",
    musculo: "Core/agarre",
    movimiento: "Carga",
    nota: "Mancuernas pesadas. Postura erguida. Pasos controlados.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-128",
    nombre: "Caminata granjero",
    musculo: "Cardio/Posterior",
    movimiento: "Carga",
    nota: "Mancuernas pesadas. Postura erguida. Pasos controlados.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-016",
    nombre: "Caminata inclinada",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Inclinación 10-15%. Brazos en movimiento. Ritmo constante.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-119",
    nombre: "Carrera en cinta",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Inclinación moderada. Ritmo constante. Brazos en movimiento.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-017",
    nombre: "Ciclismo",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Ajusta resistencia. Cadencia constante. Postura neutra.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-121",
    nombre: "Cruce de cables",
    musculo: "Pectoral",
    movimiento: "Aducción horizontal",
    nota: "Cables medios. Juntar manos al frente. Squeeze al final.",
    categoria: 'rutina',
  },

  {
    id: "ex-013",
    nombre: "Cruce de poleas",
    musculo: "Pectoral",
    movimiento: "Aducción horizontal",
    nota: "Poleas medias. Juntar manos al frente. Squeeze al final.",
    categoria: 'rutina',
  },

  {
    id: "ex-019",
    nombre: "Crunch",
    musculo: "Abdomen",
    movimiento: "Flexión de columna",
    nota: "Espalda baja en el suelo. Elevación de torso sin tirar del cuello.",
    categoria: 'rutina',
  },

  {
    id: "ex-020",
    nombre: "Crunches en máquina",
    musculo: "Abdomen",
    movimiento: "Flexión",
    nota: "Ajusta soporte. Flexión controlada. No tires del cuello.",
    categoria: 'rutina',
  },

  {
    id: "ex-022",
    nombre: "Curl con barra",
    musculo: "Bíceps",
    movimiento: "Flexión de codo",
    nota: "Codos pegados al cuerpo. Movimiento controlado sin balanceo.",
    categoria: 'rutina',
  },

  {
    id: "ex-021",
    nombre: "Curl concentrado",
    musculo: "Bíceps",
    movimiento: "Flexión de codo",
    nota: "Codo apoyado en el muslo. Máxima contracción arriba. Bajada lenta.",
    categoria: 'rutina',
  },

  {
    id: "ex-009",
    nombre: "Curl de bíceps",
    musculo: "Bíceps",
    movimiento: "Flexión",
    nota: "Codos pegados. Movimiento controlado. Sin balanceo.",
    categoria: 'rutina',
  },

  {
    id: "ex-028",
    nombre: "Curl de muñeca",
    musculo: "Antebrazo",
    movimiento: "Flexión de muñeca",
    nota: "Antebrazo apoyado. Movimiento controlado. Sin balanceo.",
    categoria: 'rutina',
  },

  {
    id: "ex-088",
    nombre: "Curl femoral sentado",
    musculo: "Isquiotibiales",
    movimiento: "Flexión de rodilla",
    nota: "Asiento ajustado. Rodillas alineadas. Control total.",
    categoria: 'rutina',
  },

  {
    id: "ex-023",
    nombre: "Curl femoral tumbado",
    musculo: "Isquiotibiales",
    movimiento: "Flexión de rodilla",
    nota: "Alinea piernas. Control total. Evita impulso en la subida.",
    categoria: 'rutina',
  },

  {
    id: "ex-024",
    nombre: "Curl inclinado",
    musculo: "Bíceps",
    movimiento: "Flexión de codo",
    nota: "Banco inclinado. Estiramiento completo. Evita balanceo.",
    categoria: 'rutina',
  },

  {
    id: "ex-025",
    nombre: "Curl martillo",
    musculo: "Braquial",
    movimiento: "Flexión neutra",
    nota: "Agarre neutral. Codos fijos. Enfocado en brazo/antebrazo.",
    categoria: 'rutina',
  },

  {
    id: "ex-026",
    nombre: "Curl predicador",
    musculo: "Bíceps",
    movimiento: "Flexión de codo",
    nota: "Banco predicador. Aísla el bíceps. Movimiento estricto.",
    categoria: 'rutina',
  },

  {
    id: "ex-029",
    nombre: "Dominadas",
    musculo: "Dorsal",
    movimiento: "Tirón vertical",
    nota: "Amplitud completa. Codos hacia abajo y atrás. Evita balanceo.",
    categoria: 'rutina',
  },

  {
    id: "ex-031",
    nombre: "Elevación de gemelos",
    musculo: "Gemelos",
    movimiento: "Plantarflexión",
    nota: "Amplitud completa. Pausa abajo y arriba. Control.",
    categoria: 'rutina',
  },

  {
    id: "ex-099",
    nombre: "Elevación de gemelos de pie",
    musculo: "Gemelos",
    movimiento: "Plantarflexión",
    nota: "De pie. Amplitud completa. Pausa arriba.",
    categoria: 'rutina',
  },

  {
    id: "ex-044",
    nombre: "Elevación de piernas colgado",
    musculo: "Abdomen",
    movimiento: "Flexión",
    nota: "Colgado estable. Eleva piernas juntas. Control en bajada.",
    categoria: 'rutina',
  },

  {
    id: "ex-078",
    nombre: "Elevación de piernas colgando",
    musculo: "Abdomen",
    movimiento: "Flexión",
    nota: "Colgado estable. Eleva piernas juntas. Control en bajada.",
    categoria: 'rutina',
  },

  {
    id: "ex-116",
    nombre: "Elevaciones en Y",
    musculo: "Hombro posterior",
    movimiento: "Elevación",
    nota: "Torso inclinado. Brazos en Y. Eleva sin arquear. Escápulas juntas.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
  },

  {
    id: "ex-032",
    nombre: "Elevaciones frontales",
    musculo: "Hombro anterior",
    movimiento: "Flexión vertical",
    nota: "Codos ligeramente flexionados. Eleva hasta la altura del hombro. Control.",
    categoria: 'rutina',
  },

  {
    id: "ex-033",
    nombre: "Elevaciones laterales",
    musculo: "Hombro lateral",
    movimiento: "Abducción",
    nota: "Codos flexionados ligeramente. Subida controlada hasta la altura del hombro.",
    categoria: 'rutina',
  },

  {
    id: "ex-014",
    nombre: "Elevaciones laterales en polea",
    musculo: "Hombro lateral",
    movimiento: "Abducción",
    nota: "Polea baja. Eleva hacia el lado. Control en bajada.",
    categoria: 'rutina',
  },

  {
    id: "ex-034",
    nombre: "Elevaciones posteriores",
    musculo: "Hombro posterior",
    movimiento: "Extensión horizontal",
    nota: "Torso inclinado. Eleva hacia atrás sin arquear. Escápulas juntas.",
    categoria: 'rutina',
  },

  {
    id: "ex-030",
    nombre: "Elíptica",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Movimiento fluido sin impacto. Brazos y piernas coordinados.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-129",
    nombre: "Elíptica",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Resistencia moderada. Brazos y piernas coordinados. Ritmo constante.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-097",
    nombre: "Empuje de trineo",
    musculo: "Cardio/piernas",
    movimiento: "Potencia",
    nota: "Empuje completo. Cadera baja. Brazos extendidos.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-052",
    nombre: "Escaladores",
    musculo: "Cardio/core",
    movimiento: "Potencia",
    nota: "Placa alta. Rodillas al pecho. Ritmo constante.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-133",
    nombre: "Extensión de brazo hombro",
    musculo: "Tríceps/hombro",
    movimiento: "Extensión",
    nota: "Brazo extendido hacia atrás. Control en la extensión con liga o polea.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
    equipo: "Liga / Polea",
  },

  {
    id: "ex-035",
    nombre: "Extensión de cuádriceps",
    musculo: "Cuádriceps",
    movimiento: "Extensión de rodilla",
    nota: "Palanca ajustada. Extensión completa sin golpear la pesa.",
    categoria: 'rutina',
  },

  {
    id: "ex-108",
    nombre: "Extensión de tríceps",
    musculo: "Tríceps",
    movimiento: "Extensión vertical",
    nota: "Codos fijos hacia adelante. Bajada controlada detrás de la cabeza.",
    categoria: 'rutina',
  },

  {
    id: "ex-037",
    nombre: "Extensión overhead",
    musculo: "Tríceps",
    movimiento: "Extensión vertical",
    nota: "Codos hacia las orejas. Bajada controlada detrás de la cabeza.",
    categoria: 'rutina',
  },

  {
    id: "ex-134",
    nombre: "Extensión y flexión",
    musculo: "Piernas",
    movimiento: "Flexión/Extensión",
    nota: "Movimiento alternado de extensión y flexión de piernas. Control total.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
  },

  {
    id: "ex-036",
    nombre: "Extensiones en polea",
    musculo: "Tríceps",
    movimiento: "Extensión vertical",
    nota: "Polea alta. Codos fijos. Extiende hacia abajo sin separar brazos.",
    categoria: 'rutina',
  },

  {
    id: "ex-135",
    nombre: "Flexión acostado",
    musculo: "Piernas",
    movimiento: "Flexión",
    nota: "Acostado. Flexión de piernas con resistencia de liga. Control en subida y bajada.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
    equipo: "Liga",
  },

  {
    id: "ex-077",
    nombre: "Flexiones",
    musculo: "Pectoral/tríceps",
    movimiento: "Empuje horizontal",
    nota: "Cuerpo en línea recta. Codos a 45°. Profundidad controlada.",
    categoria: 'rutina',
  },

  {
    id: "ex-057",
    nombre: "Flexiones en pike",
    musculo: "Hombro",
    movimiento: "Empuje inclinado",
    nota: "Cadera alta. Empuje hacia arriba. Control.",
    categoria: 'rutina',
  },

  {
    id: "ex-039",
    nombre: "Fondos",
    musculo: "Tríceps/pectoral",
    movimiento: "Empuje vertical",
    nota: "Cuerpo vertical para tríceps; inclinado para pecho. Codos hacia atrás.",
    categoria: 'rutina',
  },

  {
    id: "ex-008",
    nombre: "Fondos en banco",
    musculo: "Tríceps",
    movimiento: "Empuje vertical",
    nota: "Manos en banco. Cadera cerca del suelo. Extiende sin bloquear.",
    categoria: 'rutina',
  },

  {
    id: "ex-107",
    nombre: "Fondos en banco",
    musculo: "Tríceps",
    movimiento: "Extensión vertical",
    nota: "Manos en banco. Cadera cerca del suelo. Extiende sin bloquear.",
    categoria: 'rutina',
  },

  {
    id: "ex-040",
    nombre: "Fondos en paralelas",
    musculo: "Tríceps/pectoral",
    movimiento: "Empuje vertical",
    nota: "Cuerpo inclinado para pecho; vertical para tríceps. Codos hacia atrás.",
    categoria: 'rutina',
  },

  {
    id: "ex-043",
    nombre: "Hack squat",
    musculo: "Cuádriceps",
    movimiento: "Flexión/Extensión",
    nota: "Espalda apoyada. Rodillas alineadas. No bloquees en la extensión.",
    categoria: 'rutina',
  },

  {
    id: "ex-045",
    nombre: "Hip thrust con barra",
    musculo: "Glúteo",
    movimiento: "Extensión de cadera",
    nota: "Barra sobre cadera. Espalda alta apoyada. Glúteo hasta línea de hombros.",
    categoria: 'rutina',
  },

  {
    id: "ex-120",
    nombre: "Hip thrust unilateral",
    musculo: "Glúteo",
    movimiento: "Extensión de cadera",
    nota: "Una pierna apoyada. Eleva cadera. Contrae glúteo arriba.",
    categoria: 'rutina',
  },

  {
    id: "ex-006",
    nombre: "Hiperextensión",
    musculo: "Posterior",
    movimiento: "Extensión",
    nota: "Cadera apoyada. Sube hasta línea corporal. Sin hiperextensión.",
    categoria: 'rutina',
  },

  {
    id: "ex-046",
    nombre: "Hiperextensiones",
    musculo: "Posterior",
    movimiento: "Extensión de cadera",
    nota: "Cadera apoyada. Baja controlado. Sube hasta línea corporal, no hiperextiendas.",
    categoria: 'rutina',
  },

  {
    id: "ex-047",
    nombre: "Jalón agarre cerrado",
    musculo: "Dorsal",
    movimiento: "Tirón vertical",
    nota: "Agarre cerrado en barra. Tirón hacia el pecho bajo. Espalda ancha.",
    categoria: 'rutina',
  },

  {
    id: "ex-048",
    nombre: "Jalón al pecho",
    musculo: "Dorsal",
    movimiento: "Tirón vertical",
    nota: "Agarre amplio. Tirón hasta el pecho superior. Controla la subida.",
    categoria: 'rutina',
  },

  {
    id: "ex-114",
    nombre: "Jalón amplio",
    musculo: "Dorsal",
    movimiento: "Tirón vertical",
    nota: "Agarre amplio. Tirón hasta el pecho superior. Escápulas abajo.",
    categoria: 'rutina',
  },

  {
    id: "ex-038",
    nombre: "Jalón facial",
    musculo: "Hombro posterior",
    movimiento: "Tirón horizontal",
    nota: "Cuerda alta. Tira hacia la frente. Gira la mano al final. Hombros hacia atrás.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
  },

  {
    id: "ex-050",
    nombre: "Leg press",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Empuje horizontal",
    nota: "Asiento ajustado. Rodillas alineadas. No bloquees.",
    categoria: 'rutina',
  },

  {
    id: "ex-110",
    nombre: "Levantamiento turco",
    musculo: "Core/hombro",
    movimiento: "Estabilidad",
    nota: "Peso arriba. Movimiento controlado. Sin prisa.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-051",
    nombre: "Lunges",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Flexión/Extensión",
    nota: "Paso largo. Rodilla delantera a 90°. Trasera cerca del suelo.",
    categoria: 'rutina',
  },

  {
    id: "ex-131",
    nombre: "Movimiento cuatro puntos hombro",
    musculo: "Hombro",
    movimiento: "Movilidad",
    nota: "En posición de cuatro puntos. Movimiento circular controlado del hombro. Sin dolor.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
  },

  {
    id: "ex-053",
    nombre: "Patada de glúteo",
    musculo: "Glúteo",
    movimiento: "Extensión de cadera unilateral",
    nota: "Apoyado en banco. Eleva pierna atrás sin arquear. Contrae glúteo.",
    categoria: 'rutina',
  },

  {
    id: "ex-109",
    nombre: "Patada de tríceps",
    musculo: "Tríceps",
    movimiento: "Extensión horizontal",
    nota: "Torso inclinado. Codos fijos. Extiende atrás.",
    categoria: 'rutina',
  },

  {
    id: "ex-054",
    nombre: "Peso muerto",
    musculo: "Posterior",
    movimiento: "Cadena posterior",
    nota: "Barra pegada a la pierna. Caderas atrás. Espalda neutra. Empuje con talones.",
    categoria: 'rutina',
  },

  {
    id: "ex-095",
    nombre: "Peso muerto a una pierna",
    musculo: "Glúteo/equilibrio",
    movimiento: "Cadena posterior",
    nota: "Una pierna atrás. Torso paralelo al suelo. Equilibrio.",
    categoria: 'rutina',
  },

  {
    id: "ex-101",
    nombre: "Peso muerto piernas rígidas",
    musculo: "Isquiotibiales",
    movimiento: "Cadena posterior",
    nota: "Piernas casi rectas. Barra pegada. Estiramiento controlado.",
    categoria: 'rutina',
  },

  {
    id: "ex-055",
    nombre: "Peso muerto rumano",
    musculo: "Isquiotibiales",
    movimiento: "Cadena posterior",
    nota: "Cadera hacia atrás. Barra pegada a las piernas. Estiramiento controlado.",
    categoria: 'rutina',
  },

  {
    id: "ex-056",
    nombre: "Peso muerto sumo",
    musculo: "Posterior/glúteo",
    movimiento: "Cadena posterior",
    nota: "Piernas anchas. Empuje con talones. Espalda neutra.",
    categoria: 'rutina',
  },

  {
    id: "ex-058",
    nombre: "Plancha",
    musculo: "Core",
    movimiento: "Isométrico",
    nota: "Cuerpo en línea recta. Core y glúteos activos. Sin elevar cadera.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-076",
    nombre: "Plancha abdominal",
    musculo: "Core",
    movimiento: "Isométrico",
    nota: "Cuerpo en línea recta. Core y glúteos activos. Sin elevar cadera.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-124",
    nombre: "Plancha con elevación de pierna",
    musculo: "Core",
    movimiento: "Isométrico",
    nota: "Cuerpo en línea. Eleva una pierna. Mantén cadera estable.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-094",
    nombre: "Plancha lateral",
    musculo: "Oblicuos",
    movimiento: "Isométrico",
    nota: "Cuerpo en línea. Cadera arriba. Tiempo controlado.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-085",
    nombre: "Plancha lateral",
    musculo: "Oblicuos",
    movimiento: "Isométrico",
    nota: "Cuerpo en línea. Cadera arriba. Tiempo controlado.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-073",
    nombre: "Prensa de piernas",
    musculo: "Cuádriceps",
    movimiento: "Empuje horizontal",
    nota: "Espalda apoyada. Rodillas alineadas con pies. No bloquees en la extensión.",
    categoria: 'rutina',
  },

  {
    id: "ex-072",
    nombre: "Prensa inclinada",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Empuje horizontal",
    nota: "Asiento bajo para glúteo; alto para cuádriceps. Espalda apoyada.",
    categoria: 'rutina',
  },

  {
    id: "ex-003",
    nombre: "Press Arnold",
    musculo: "Hombro",
    movimiento: "Empuje vertical rotado",
    nota: "Rotación de palmas al subir. Control total. Codos hacia adelante.",
    categoria: 'rutina',
  },

  {
    id: "ex-060",
    nombre: "Press banca",
    musculo: "Pectoral",
    movimiento: "Empuje horizontal",
    nota: "Mantén escápulas retraídas y pies firmes en el suelo. Barra a la altura del pecho inferior.",
    categoria: 'rutina',
  },

  {
    id: "ex-061",
    nombre: "Press cerrado",
    musculo: "Tríceps",
    movimiento: "Empuje horizontal",
    nota: "Agarre cerrado. Codos pegados. Presiona hasta extensión completa.",
    categoria: 'rutina',
  },

  {
    id: "ex-062",
    nombre: "Press de banca con agarre cerrado",
    musculo: "Tríceps/pectoral",
    movimiento: "Empuje horizontal",
    nota: "Agarre cerrado. Codos pegados. Menor rango que press normal.",
    categoria: 'rutina',
  },

  {
    id: "ex-059",
    nombre: "Press de pecho con barra",
    musculo: "Pectoral",
    movimiento: "Empuje horizontal",
    nota: "Barra controlada. Escápulas retraídas. Pies firmes.",
    categoria: 'rutina',
  },

  {
    id: "ex-064",
    nombre: "Press de pecho en mancuernas",
    musculo: "Pectoral",
    movimiento: "Empuje horizontal",
    nota: "Mayor rango que con barra. Codos a 45°. Estira sin soltar el peso.",
    categoria: 'rutina',
  },

  {
    id: "ex-063",
    nombre: "Press de pecho en máquina",
    musculo: "Pectoral",
    movimiento: "Empuje horizontal",
    nota: "Asiento ajustado a altura del agarre. Movimiento controlado.",
    categoria: 'rutina',
  },

  {
    id: "ex-015",
    nombre: "Press de tríceps en polea",
    musculo: "Tríceps",
    movimiento: "Extensión vertical",
    nota: "Codos fijos. Extiende hacia abajo. Cuerda o barra.",
    categoria: 'rutina',
  },

  {
    id: "ex-065",
    nombre: "Press declinado",
    musculo: "Pectoral inferior",
    movimiento: "Empuje horizontal declinado",
    nota: "Banco declinado seguro. Barra controlada cerca del pecho inferior.",
    categoria: 'rutina',
  },

  {
    id: "ex-066",
    nombre: "Press en máquina hombro",
    musculo: "Hombro",
    movimiento: "Empuje vertical",
    nota: "Asiento alto. Agarre a la anchura de hombros. No arquear la espalda.",
    categoria: 'rutina',
  },

  {
    id: "ex-067",
    nombre: "Press francés",
    musculo: "Tríceps",
    movimiento: "Extensión de codo",
    nota: "Codos fijos hacia adelante. Flexiona solo los antebrazos.",
    categoria: 'rutina',
  },

  {
    id: "ex-068",
    nombre: "Press hombro máquina",
    musculo: "Hombro",
    movimiento: "Empuje vertical",
    nota: "Asiento alto. Espalda apoyada. No arquees en el empuje.",
    categoria: 'rutina',
  },

  {
    id: "ex-070",
    nombre: "Press inclinado",
    musculo: "Pectoral superior",
    movimiento: "Empuje horizontal inclinado",
    nota: "Banco a 30-45°. Controla el descenso y no arquees la espalda excesivamente.",
    categoria: 'rutina',
  },

  {
    id: "ex-123",
    nombre: "Press inclinado con mancuernas",
    musculo: "Pectoral superior",
    movimiento: "Empuje horizontal inclinado",
    nota: "Banco a 30-45°. Mayor rango. No arquees la espalda.",
    categoria: 'rutina',
  },

  {
    id: "ex-071",
    nombre: "Press militar",
    musculo: "Hombro",
    movimiento: "Empuje vertical",
    nota: "Barra desde la barbilla. Codos hacia adelante. Core firme.",
    categoria: 'rutina',
  },

  {
    id: "ex-069",
    nombre: "Press overhead",
    musculo: "Hombro",
    movimiento: "Empuje vertical",
    nota: "Barra desde la barbilla. Codos hacia adelante. Core firme.",
    categoria: 'rutina',
  },

  {
    id: "ex-042",
    nombre: "Puente de glúteos",
    musculo: "Glúteo",
    movimiento: "Extensión de cadera",
    nota: "Talones cerca. Eleva hasta línea de hombros. Squeeze.",
    categoria: 'rutina',
  },

  {
    id: "ex-075",
    nombre: "Pull-over",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal overhead",
    nota: "Barra/mancuerna sobre la cabeza. Lleva hacia el pecho manteniendo costillas bajas.",
    categoria: 'rutina',
  },

  {
    id: "ex-007",
    nombre: "Remo con barra",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal",
    nota: "Torso paralelo al suelo. Barra pegada a las piernas. Espalda neutra.",
    categoria: 'rutina',
  },

  {
    id: "ex-122",
    nombre: "Remo con barra invertido",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal invertido",
    nota: "Barra baja. Cuerpo en línea recta. Tira del pecho a la barra.",
    categoria: 'rutina',
  },

  {
    id: "ex-079",
    nombre: "Remo con mancuerna",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal",
    nota: "Mano y rodilla apoyadas. Torso paralelo al suelo. Tira de la mancuerna a la cadera.",
    categoria: 'rutina',
  },

  {
    id: "ex-082",
    nombre: "Remo en máquina",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal",
    nota: "Asiento ajustado. Tira hacia el abdomen. Espalda neutra.",
    categoria: 'rutina',
  },

  {
    id: "ex-083",
    nombre: "Remo en polea baja",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal",
    nota: "Pecho arriba. Tira hacia el abdomen. Escápulas juntas al final.",
    categoria: 'rutina',
  },

  {
    id: "ex-104",
    nombre: "Remo en T",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal",
    nota: "Torso inclinado. Tira hacia el pecho. Espalda neutra.",
    categoria: 'rutina',
  },

  {
    id: "ex-080",
    nombre: "Remo ergómetro",
    musculo: "Cardio",
    movimiento: "Resistencia",
    nota: "Empuje piernas, luego torso y brazos. Respiración coordinada.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-074",
    nombre: "Remo inclinado con barra",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal",
    nota: "Torso paralelo al suelo. Barra pegada a las piernas. Espalda neutra.",
    categoria: 'rutina',
  },

  {
    id: "ex-081",
    nombre: "Remo invertido",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal invertido",
    nota: "Barra baja. Cuerpo en línea recta. Tira del pecho a la barra.",
    categoria: 'rutina',
  },

  {
    id: "ex-084",
    nombre: "Remo sentado",
    musculo: "Dorsal",
    movimiento: "Tirón horizontal",
    nota: "Asiento bajo. Pecho apoyado. Tira hacia el torso medio.",
    categoria: 'rutina',
  },

  {
    id: "ex-132",
    nombre: "Rotación externa hombro",
    musculo: "Hombro posterior",
    movimiento: "Rotación externa",
    nota: "Codo pegado al cuerpo. Rotación externa controlada con liga o polea.",
    categoria: 'calentamiento',
    grupo: 'movilidad',
    equipo: "Liga / Polea",
  },

  {
    id: "ex-087",
    nombre: "Salto de cuerda",
    musculo: "Cardio",
    movimiento: "Potencia",
    nota: "Doble apoyo ligero. Codos cerca del cuerpo. Ritmo constante.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-098",
    nombre: "Salto de sentadilla",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Potencia",
    nota: "Sentadilla profunda + salto. Aterrizaje suave.",
    categoria: 'rutina',
  },

  {
    id: "ex-010",
    nombre: "Saltos al cajón",
    musculo: "Cardio/Piernas",
    movimiento: "Potencia",
    nota: "Aterrizaje silencioso. Caderas atrás. Altura progresiva.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-089",
    nombre: "Sentadilla",
    musculo: "Cuádriceps",
    movimiento: "Flexión/Extensión",
    nota: "Pies al ancho de hombros. Rodillas alineadas. Profundidad segura.",
    categoria: 'rutina',
  },

  {
    id: "ex-090",
    nombre: "Sentadilla búlgara",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Flexión/Extensión unilateral",
    nota: "Pierna atrás en banco. Baja controlado. Equilibrio estable.",
    categoria: 'rutina',
  },

  {
    id: "ex-018",
    nombre: "Sentadilla con salto",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Potencia",
    nota: "Sentadilla profunda + salto. Aterrizaje suave.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-091",
    nombre: "Sentadilla goblet",
    musculo: "Cuádriceps/core",
    movimiento: "Flexión/Extensión",
    nota: "Peso al pecho. Baja profundo. Codos dentro de las rodillas.",
    categoria: 'rutina',
  },

  {
    id: "ex-092",
    nombre: "Sentadilla hack",
    musculo: "Cuádriceps",
    movimiento: "Flexión/Extensión",
    nota: "Espalda apoyada. Rodillas alineadas. No bloquees en la extensión.",
    categoria: 'rutina',
  },

  {
    id: "ex-093",
    nombre: "Sentadilla sumo",
    musculo: "Glúteo/aductor",
    movimiento: "Flexión/Extensión",
    nota: "Piernas anchas. Pies abiertos. Rodillas alineadas con dedos.",
    categoria: 'rutina',
  },

  {
    id: "ex-096",
    nombre: "Skaters",
    musculo: "Cardio/Piernas",
    movimiento: "Potencia",
    nota: "Saltos laterales. Aterrizaje suave. Brazos en movimiento.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-115",
    nombre: "Sprints en cuesta",
    musculo: "Cardio/piernas",
    movimiento: "Potencia",
    nota: "Cuestas o llano. Intervalos cortos. Alta intensidad.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-100",
    nombre: "Step up",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Flexión/Extensión unilateral",
    nota: "Banco estable. Paso completo. Control en bajada.",
    categoria: 'rutina',
  },

  {
    id: "ex-103",
    nombre: "Sumo squat",
    musculo: "Glúteo/aductor",
    movimiento: "Flexión/Extensión",
    nota: "Piernas muy abiertas. Dedos hacia afuera. Profundidad segura.",
    categoria: 'rutina',
  },

  {
    id: "ex-102",
    nombre: "Superman",
    musculo: "Posterior",
    movimiento: "Extensión",
    nota: "Eleva pecho y piernas juntos. Pausa arriba. Control lumbar.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-105",
    nombre: "Thruster",
    musculo: "Cuádriceps/hombro",
    movimiento: "Flexión/Empuje vertical",
    nota: "Sentadilla profunda + press overhead. Movimiento fluido.",
    categoria: 'rutina',
  },

  {
    id: "ex-086",
    nombre: "Torsión rusa",
    musculo: "Oblicuos",
    movimiento: "Rotación",
    nota: "Pies apoyados o elevados. Rotación controlada con peso opcional.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-111",
    nombre: "V ups",
    musculo: "Abdomen",
    movimiento: "Flexión/Compresión",
    nota: "Piernas y torso juntos en forma de V. Control en subida y bajada.",
    categoria: 'rutina',
  },

  {
    id: "ex-106",
    nombre: "Volteo de llanta",
    musculo: "Cardio/posterior",
    movimiento: "Potencia",
    nota: "Llanta pesada. Empuje explosivo. Control en la vuelta.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-113",
    nombre: "Wall sit",
    musculo: "Cuádriceps",
    movimiento: "Isométrico",
    nota: "Espalda contra la pared. Rodillas a 90°. Tiempo controlado.",
    categoria: 'calentamiento',
    grupo: 'general',
  },

  {
    id: "ex-112",
    nombre: "Zancada caminando",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Flexión/Extensión",
    nota: "Paso largo. Rodillas alineadas. Avance continuo.",
    categoria: 'rutina',
  },

  {
    id: "ex-117",
    nombre: "Zancada lateral",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Flexión/Extensión lateral",
    nota: "Paso lateral amplio. Rodilla alineada. Trasera cerca del suelo.",
    categoria: 'rutina',
  },

  {
    id: "ex-118",
    nombre: "Zancadas",
    musculo: "Cuádriceps/glúteo",
    movimiento: "Flexión/Extensión",
    nota: "Paso largo. Rodilla delantera a 90°. Trasera cerca del suelo.",
    categoria: 'rutina',
  },

  {
    id: "ex-139",
    nombre: "Abs crunch acostado",
    musculo: "Abdomen",
    movimiento: "Flexión de columna",
    nota: "Acostado. Rodillas flexionadas. Elevación de torso sin tirar del cuello.",
    categoria: 'calentamiento',
    grupo: 'especifico',
  },

  {
    id: "ex-140",
    nombre: "Plancha frontal",
    musculo: "Core",
    movimiento: "Isométrico",
    nota: "Cuerpo en línea recta. Codos debajo de hombros. Core y glúteos activos.",
    categoria: 'calentamiento',
    grupo: 'especifico',
  },

  {
    id: "ex-141",
    nombre: "Pull down",
    musculo: "Dorsal",
    movimiento: "Tirón vertical",
    nota: "Agarre amplio. Tirón hacia el pecho. Escápulas abajo. Control en subida.",
    categoria: 'calentamiento',
    grupo: 'especifico',
    equipo: "Liga / Polea",
  },
];