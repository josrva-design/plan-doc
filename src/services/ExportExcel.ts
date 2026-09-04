import { Workbook, Worksheet, Row } from 'exceljs';

import type { AppData } from '../core/types.ts';

const NAVY = 'FF0D2640';
const GREEN = 'FF2E9E70';

function applyHeaderStyle(row: Row, color: string) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    cell.border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  });
}

function applyBodyStyle(row: Row) {
  row.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  });
}

function addSheet(workbook: Workbook, title: string, headers: string[], color: string): Worksheet {
  const ws = workbook.addWorksheet(title);
  const headerRow = ws.addRow(headers);
  applyHeaderStyle(headerRow, color);
  if (headers.length > 1) {
    ws.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + headers.length)}1` };
  }
  return ws;
}

function writeRow(ws: Worksheet, values: any[]) {
  const row = ws.addRow(values);
  applyBodyStyle(row);
}

function toNumber(val: any): number | undefined {
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  if (!val) return undefined;
  const m = String(val).match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : undefined;
}

function formatDelta(current: number | undefined, previous: number | undefined): string {
  if (current === undefined || previous === undefined) return '';
  const delta = current - previous;
  if (delta > 0) return `+${delta.toFixed(1)} ↑`;
  if (delta < 0) return `${delta.toFixed(1)} ↓`;
  return '0.0 =';
}

export function exportToExcel(data: AppData & { supplementsStrategy?: string }, fileName = 'plan') {
  const wb = new Workbook();
  wb.creator = 'DocFitness';
  wb.created = new Date();

  const person = data.person || {};
  const stats = data.stats || {};
  const evolution = data.evolution || {};
  const meals = data.meals || [];
  const supplements = data.supplements || [];
  const routines = data.routines || [];
  const calendar = data.calendar || [];
  const feedback = data.feedback || {};
  const diagnosis = data.diagnosis || {};
  const objectives = data.objectives || {};
  const habits = data.habits || {};
  const warmup = data.warmup || [];
  const nutrition = data.nutrition || {};
  const training = data.training || {};
  const profileHistory = data.profileHistory || [];

  // ============================================================
  // 1. PERFIL
  // ============================================================
  const wsPerfil = addSheet(wb, 'Perfil', ['Campo', 'Valor', 'Observaciones'], NAVY);
  wsPerfil.getColumn(1).width = 32;
  wsPerfil.getColumn(2).width = 45;
  wsPerfil.getColumn(3).width = 45;

  const personFields: Record<string, string> = {
    nombre: 'Nombre', edad: 'Edad', estatura: 'Estatura (cm)', pesoIni: 'Peso inicial (kg)',
    nivel: 'Nivel', objetivo: 'Objetivo principal', objetivoEspecifico: 'Objetivo específico', sexo: 'Sexo',
    fechaNacimiento: 'Fecha de nacimiento', pais: 'País/Región', estado: 'Estado',
    celular: 'Celular/WhatsApp', email: 'Email', instagram: 'Instagram', ocupacion: 'Ocupación',
    imc: 'IMC', grasa: 'Grasa (%)', musculo: 'Músculo (%)', cintura: 'Cintura (cm)',
     cadera: 'Cadera (cm)', despertar: 'Hora de despertar',
     dormir: 'Hora de dormir',
     pasos: 'Pasos diarios', inicioTrabajo: 'Inicio trabajo', recesoTrabajo: 'Receso trabajo',
    terminoTrabajo: 'Término trabajo', tiemposComida: 'Tiempos de comida',
    gustos: 'Gustos alimenticios', quienCocina: 'Quién cocina', leGusta: 'Le gusta',
    noLeGusta: 'No le gusta', condicionMedica: 'Condición médica', app: 'APP',
    af: 'Antecedentes familiares', med: 'Medicación', alergias: 'Alergias',
    cirugias: 'Cirugías', intolerancias: 'Intolerancias', lesiones: 'Lesiones',
    labs: 'Laboratorios', presupuesto: 'Presupuesto', equipo: 'Equipo',
    calidadSueño: 'Calidad de sueño', tabaco: 'Tabaco', alcohol: 'Alcohol', cafe: 'Café',
    azucar: 'Azúcar', drogas: 'Drogas/medicamentos', ana: 'Anabólicos/EAAs', pre: 'Pre-entreno',
    energ: 'Energéticas', act1: 'Actividad física 1', act2: 'Actividad física 2',
    horario: 'Horario actividad', sesiones: 'Sesiones actividad', duracion: 'Duración actividad',
    planPrevio: 'Plan previo nutrición/entreno', resultadosPrevios: 'Resultados previos',
    queNoTeGusta: 'Qué no te gustó', tipoPlan: 'Tipo de plan preferido',
    caracteristica: 'Característica más importante', interesSup: 'Interés en suplementos',
    supActual: 'Suplementación actual'
  };
  const personObs: Record<string, string> = {
    app: 'appObs', af: 'afObs', med: 'medObs', alergias: 'alergiasObs',
    cirugias: 'cirugiasObs', intolerancias: 'intoleranciasObs', lesiones: 'lesionesObs', labs: 'labsObs'
  };

  Object.entries(personFields).forEach(([key, label]) => {
    const obsKey = personObs[key];
    const obsValue = obsKey ? (person[obsKey] ?? '') : '';
    const displayValue = person[key] ?? '';
    if (displayValue || obsValue) {
      writeRow(wsPerfil, [label, String(displayValue), String(obsValue)]);
    }
  });

  // Métricas
  writeRow(wsPerfil, ['--- MÉTRICAS ---', '', '']);
  const statsFields: Record<string, string> = {
    peso: 'Peso (kg)', abdomen: 'Abdomen (cm)', grasaKg: 'Grasa (kg)', grasaPorc: 'Grasa (%)',
    pliegue: 'Pliegue (mm)', avPeso: 'Avance peso', avAbd: 'Avance abdomen',
    avGrasaKg: 'Avance grasa kg', avGrasaPorc: 'Avance grasa %', avPliegue: 'Avance pliegue',
    adherencia: 'Adherencia', nutricion: 'Nutrición', entreno: 'Entrenamiento',
    cardio: 'Cardio', descanso: 'Descanso'
  };
  Object.entries(statsFields).forEach(([key, label]) => {
    if (stats[key] !== undefined) writeRow(wsPerfil, [label, String(stats[key]), '']);
  });

  // ============================================================
  // 2. EVOLUCIÓN + ADHERENCIA + INBODY
  // ============================================================
  const wsEvo = addSheet(wb, 'Evolución', ['Parámetro'], GREEN);
  const consultas = evolution.consultas || [];
  const cells = evolution.cells || {};
  const fechas = evolution.dates || [];

  if (consultas.length) {
    consultas.forEach((_, idx) => {
      const fecha = fechas[idx] || `C${idx + 1}`;
      wsEvo.getColumn(idx + 2).header = fecha;
      wsEvo.getColumn(idx + 2).width = 18;
    });
    const params = [
      'peso','grasa_pct','grasaKg','mlg','muscular','visceral','estatura','ta','fc','sat',
      'cint_esc','pect_esp','cint_abd','abdomen','bicep_rel','bicep_con','cadera',
      'muslo_alto','muslo_med','pant','subesc','triceps','biceps_p','abdominal_p',
      'supraesp','supraili','muslo_p','pant_med','sum_pliegues'
    ];
    const paramLabels: Record<string, string> = {
      peso: 'Peso (kg)', grasa_pct: 'Grasa corporal (%)', grasaKg: 'Grasa corporal (kg)', mlg: 'Masa libre de grasa (kg)',
      muscular: 'Masa muscular (kg)', visceral: 'Grasa visceral (nivel)', estatura: 'Estatura (cm)', ta: 'Tensión arterial',
      fc: 'Frecuencia cardíaca', sat: 'Saturación O2', cint_esc: 'Cuello (cm)', pect_esp: 'Pectoral (cm)',
      cint_abd: 'Cintura abdominal (cm)', abdomen: 'Abdomen (cm)', bicep_rel: 'Bíceps relajado (cm)',
      bicep_con: 'Bíceps contracción (cm)', cadera: 'Cadera (cm)', muslo_alto: 'Muslo alto (cm)',
      muslo_med: 'Muslo medio (cm)', pant: 'Pantorrilla (cm)', subesc: 'Subescapular (mm)',
      triceps: 'Tríceps (mm)', biceps_p: 'Bíceps (mm)', abdominal_p: 'Abdominal (mm)',
      supraesp: 'Supraespinal (mm)', supraili: 'Suprailiaco (mm)', muslo_p: 'Muslo (mm)',
      pant_med: 'Pantorrilla media (mm)', sum_pliegues: 'Sumatoria pliegues (mm)'
    };

    params.forEach((param) => {
      const rowValues: any[] = [paramLabels[param] || param];
      let prev: number | undefined;
      consultas.forEach((c) => {
        const val = toNumber(cells[c]?.[param]);
        const cellValue = val ?? '';
        if (prev !== undefined && val !== undefined) {
          rowValues.push(`${val} (${formatDelta(val, prev)})`);
        } else {
          rowValues.push(cellValue);
        }
        prev = val;
      });
      const row = wsEvo.addRow(rowValues);
      applyBodyStyle(row);
    });
  }
  wsEvo.getColumn(1).width = 32;

  // Sección Adherencia dentro de Evolución
  if (consultas.length) {
    const startRow = wsEvo.lastRow ? wsEvo.lastRow.number + 2 : (consultas.length ? params.length + 3 : 1);
    const adhHeader = wsEvo.getRow(startRow);
    adhHeader.values = ['ADHERENCIA', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    applyHeaderStyle(adhHeader, NAVY);
    wsEvo.mergeCells(startRow, 1, startRow, Math.max(consultas.length + 1, 6));
    
    const adhCols = ['Consulta', 'Adherencia', 'Nutrición', 'Entreno', 'Cardio', 'Descanso'];
    const adhHeaderRow = wsEvo.getRow(startRow + 1);
    adhHeaderRow.values = adhCols;
    applyHeaderStyle(adhHeaderRow, GREEN);
    wsEvo.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + Math.max(consultas.length + 1, 6))}1` };

    consultas.forEach((c, idx) => {
      const fecha = fechas[idx] || `C${idx + 1}`;
      const cell = cells[c] || {};
      const row = wsEvo.getRow(startRow + 2 + idx);
      row.values = [fecha, cell.adherencia ?? '', cell.nutricion ?? '', cell.entreno ?? '', cell.cardio ?? '', cell.descanso ?? ''];
      applyBodyStyle(row);
    });
  }

  // Sección InBody dentro de Evolución
  const inBodyConfig = evolution.inBodyConfig || {};
  if (Object.keys(inBodyConfig).length && consultas.length) {
    const inBodyStartRow = wsEvo.lastRow ? wsEvo.lastRow.number + 2 : (consultas.length ? params.length + 3 : 1);
    const inBodyHeader = wsEvo.getRow(inBodyStartRow);
    inBodyHeader.values = ['INBODY - RANGOS', '', '', '', '', ''];
    applyHeaderStyle(inBodyHeader, NAVY);
    wsEvo.mergeCells(inBodyStartRow, 1, inBodyStartRow, 5);

    const inBodyCols = ['Parámetro', 'Mínimo', 'Máximo', 'Ideal Mínimo', 'Ideal Máximo'];
    const inBodyHeaderRow = wsEvo.getRow(inBodyStartRow + 1);
    inBodyHeaderRow.values = inBodyCols;
    applyHeaderStyle(inBodyHeaderRow, GREEN);

    let inBodyIdx = 0;
    Object.entries(inBodyConfig).forEach(([key, range]: [string, any]) => {
      if (range && typeof range === 'object') {
        const row = wsEvo.getRow(inBodyStartRow + 2 + inBodyIdx);
        row.values = [key, range.min ?? '', range.max ?? '', range.idealMin ?? '', range.idealMax ?? ''];
        applyBodyStyle(row);
        inBodyIdx++;
      }
    });
  }

  // ============================================================
  // 3. NUTRICIÓN
  // ============================================================
  const wsNut = addSheet(wb, 'Nutrición', ['Tiempo', 'Hora', 'Tipo', 'Grupo', 'Alimento', 'Gramos', 'Kcal', 'P', 'C', 'G', 'Menú', 'Observaciones'], GREEN);
  wsNut.getColumn(5).width = 34;
  wsNut.getColumn(11).width = 28;
  wsNut.getColumn(12).width = 30;

  // Estrategia nutricional
  writeRow(wsNut, ['--- ESTRATEGIA ---', '', '', '', '', '', '', '', '', '', '', '']);
  writeRow(wsNut, ['Estrategia', nutrition.estrategia || '', '', '', '', '', '', '', '', '', '', '']);
  writeRow(wsNut, ['Kcal target', String(nutrition.kcal || ''), '', '', '', '', '', '', '', '', '', '']);
  writeRow(wsNut, ['Proteína (g)', String(nutrition.prot || ''), '', '', '', '', '', '', '', '', '', '']);
  writeRow(wsNut, ['Carbos (g)', String(nutrition.carbs || ''), '', '', '', '', '', '', '', '', '', '']);
  writeRow(wsNut, ['Grasas (g)', String(nutrition.grasas || ''), '', '', '', '', '', '', '', '', '', '']);
  writeRow(wsNut, ['', '', '', '', '', '', '', '', '', '', '', '']);

  // Comidas
  meals.forEach((meal) => {
    const time = meal.time || '';
    const hour = meal.hour || meal.tiempo || '';
    const menuType = meal.menuType || '';
    const foods = meal.foods || [];
    const menus = meal.menus || [];

    if (foods.length) {
      foods.forEach((food: any) => {
        const nombre = food.nombre || food.name || '';
        const grupo = food.grupo || '';
        const grams = food.grams || food.cantidad || '';
        const kcal = food.kcal ?? '';
        const p = food.p ?? '';
        const c = food.c ?? '';
        const g = food.g ?? '';
        writeRow(wsNut, [time, hour, menuType, grupo, nombre, grams, kcal, p, c, g, '', '']);
      });
    }
    if (menus.length) {
      menus.forEach((menu: any) => {
        const menuNombre = menu.nombre || '';
        (menu.alimentos || []).forEach((food: any) => {
          const nombre = food.nombre || food.name || '';
          const grupo = food.grupo || '';
          const grams = food.grams || food.cantidad || '';
          const kcal = food.kcal ?? '';
          const p = food.p ?? '';
          const c = food.c ?? '';
          const g = food.g ?? '';
          writeRow(wsNut, [time, hour, menuType, grupo, nombre, grams, kcal, p, c, g, menuNombre, '']);
        });
      });
    }
    if (!foods.length && !menus.length) {
      writeRow(wsNut, [time, hour, menuType, '', '', '', '', '', '', '', '', '']);
    }
  });

  // ============================================================
  // 4. ENTRENAMIENTO (una hoja con secciones)
  // ============================================================
  const wsEnt = addSheet(wb, 'Entrenamiento', ['Tipo', 'Dato', 'Valor'], NAVY);
  wsEnt.getColumn(1).width = 20;
  wsEnt.getColumn(2).width = 50;
  wsEnt.getColumn(3).width = 20;

  // Estrategia
  writeRow(wsEnt, ['--- ESTRATEGIA ---', '', '']);
  writeRow(wsEnt, ['Estrategia', training.estrategia || '', '']);
  writeRow(wsEnt, ['Días', String(training.dias || ''), '']);
  writeRow(wsEnt, ['Cardio', String(training.cardio || ''), '']);
  writeRow(wsEnt, ['Pasos', String(training.pasos || ''), '']);
  writeRow(wsEnt, ['RIR', String(training.rir || ''), '']);
  writeRow(wsEnt, ['Indicaciones', String(training.indic || ''), '']);
  writeRow(wsEnt, ['', '', '']);

  // Calendario
  writeRow(wsEnt, ['--- CALENDARIO ---', '', '']);
  writeRow(wsEnt, ['Día', 'Actividad', 'RoutineId']);
  calendar.forEach((calDay) => {
    writeRow(wsEnt, [calDay.dia || '', calDay.actividad || '', calDay.routineId || '']);
  });
  writeRow(wsEnt, ['', '', '']);

  // Calentamiento
  writeRow(wsEnt, ['--- CALENTAMIENTO ---', '', '', '', '', '', '', '']);
  writeRow(wsEnt, ['Grupo', 'Ejercicio', 'Sets', 'Reps', 'Descanso', 'Video', 'Notas']);
  const warmupGroups = [
    { grupo: 'general', label: 'GENERAL' },
    { grupo: 'upper', label: 'TREN SUPERIOR' },
    { grupo: 'lower', label: 'TREN INFERIOR' },
  ];
  warmupGroups.forEach(({ grupo, label }) => {
    const items = warmup.filter((e: any) => e.grupo === grupo);
    items.forEach((ej: any) => {
      writeRow(wsEnt, [label, ej.ejercicio || '', String(ej.sets || ''), String(ej.reps || ''), String(ej.pausa || ej.descanso || ''), String(ej.video || ''), String(ej.notas || '')]);
    });
  });
  writeRow(wsEnt, ['', '', '', '', '', '', '', '']);

  // Rutinas
  writeRow(wsEnt, ['--- RUTINAS ---', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  const rutinaHeader = wsEnt.getRow(wsEnt.lastRow ? wsEnt.lastRow.number : 1);
  const rutinaCols = ['Día', 'Rutina', 'Fase', 'Bloque', 'Ejercicio', 'Series', 'Reps', 'Descanso', 'Técnica', 'RIR', 'Sem1', 'Sem2', 'Sem3', 'Sem4', 'Músculo', 'Movimiento', 'Categoría', 'Notas', 'Video'];
  rutinaHeader.values = rutinaCols;
  applyHeaderStyle(rutinaHeader, NAVY);
  wsEnt.autoFilter = { from: 'A1', to: `${String.fromCharCode(64 + rutinaCols.length)}1` };

  const DAY_MAP: Record<string, string> = {
    LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles', MIÉRCOLES: 'Miércoles',
    JUEVES: 'Jueves', VIERNES: 'Viernes', SABADO: 'Sábado', SÁBADO: 'Sábado', DOMINGO: 'Domingo'
  };

  calendar.forEach((calDay) => {
    const diaNombre = DAY_MAP[String(calDay?.dia || '').trim().toUpperCase()] || calDay?.dia || '';
    const actividad = calDay?.actividad || '';
    const routine = routines.find((r: any) => r.id === calDay?.routineId) || routines.find((r: any) => (r.nombre || '').trim() === actividad) || routines.find((r: any) => (r.nombre || '').trim().toLowerCase() === actividad.toLowerCase());
    if (!routine) return;

    const ejercicios = routine.ejercicios || [];
    ejercicios.forEach((ej: any) => {
      const s1 = ej.semana1 || ej.s1 || '';
      const s2 = ej.semana2 || ej.s2 || '';
      const s3 = ej.semana3 || ej.s3 || '';
      const s4 = ej.semana4 || ej.s4 || '';
      const hasWeeks = s1 || s2 || s3 || s4;
      const serie = hasWeeks ? `${s1}/${s2}/${s3}/${s4}` : (ej.serie || ej.sets || '1');
      const fase = (ej.categoria || '').toLowerCase() === 'aprox' ? 'APROXIMACIÓN' : 'ENTRENAMIENTO PRINCIPAL';
      const bloque = ej.blockLetter ? `${ej.blockLetter}${ej.blockSerie || ''}` : '';
      writeRow(wsEnt, [
        diaNombre,
        routine.nombre || routine.label || '',
        fase,
        bloque,
        ej.ejercicio || '',
        serie,
        ej.reps || '',
        ej.descanso || '',
        ej.tecnica || '',
        ej.rir || '',
        s1, s2, s3, s4,
        ej.musculo || '',
        ej.movimiento || '',
        ej.categoria || '',
        ej.notas || '',
        ej.video || ''
      ]);
    });
  });

  // Ajustar anchos de columna de Entrenamiento
  wsEnt.getColumn(1).width = 12;
  wsEnt.getColumn(2).width = 24;
  wsEnt.getColumn(3).width = 22;
  wsEnt.getColumn(4).width = 12;
  wsEnt.getColumn(5).width = 34;
  wsEnt.getColumn(18).width = 30;
  wsEnt.getColumn(19).width = 28;

  // ============================================================
  // 5. SUPLEMENTOS
  // ============================================================
  const wsSup = addSheet(wb, 'Suplementos', ['Horario', 'Nombre', 'Tipo', 'Marca', 'Dosis', 'Gramos', 'Porción', 'Notas'], NAVY);
  if (data.supplementsStrategy) {
    writeRow(wsSup, ['--- ESTRATEGIA ---', '', '', '', '', '', '', '']);
    writeRow(wsSup, [data.supplementsStrategy, '', '', '', '', '', '', '']);
  }
  supplements.forEach((s) => {
    writeRow(wsSup, [s.horario || s.hora || '', s.nombre || s.suplemento || '', s.tipo || '', s.marca || '', s.dosis || '', s.gramos || '', s.porcion || '', s.notas || '']);
  });
  wsSup.getColumn(2).width = 30;
  wsSup.getColumn(4).width = 20;

  // ============================================================
  // 6. CLÍNICO
  // ============================================================
  const wsClinico = addSheet(wb, 'Clínico', ['Retroalimentación', 'Diagnóstico', 'Objetivos'], NAVY);
  const maxLen = Math.max(
    feedback.r1 ? 1 : 0, feedback.r2 ? 1 : 0, feedback.r3 ? 1 : 0,
    diagnosis.d1 ? 1 : 0, diagnosis.d2 ? 1 : 0, diagnosis.d3 ? 1 : 0,
    objectives.o1 ? 1 : 0, objectives.o2 ? 1 : 0, objectives.o3 ? 1 : 0
  );
  for (let i = 0; i < maxLen; i++) {
    writeRow(wsClinico, [
      [feedback.r1, feedback.r2, feedback.r3].filter(Boolean)[i] || '',
      [diagnosis.d1, diagnosis.d2, diagnosis.d3].filter(Boolean)[i] || '',
      [objectives.o1, objectives.o2, objectives.o3].filter(Boolean)[i] || ''
    ]);
  }

  // ============================================================
  // 7. HÁBITOS
  // ============================================================
  const wsHabitos = addSheet(wb, 'Hábitos', ['Concepto', 'Valor'], GREEN);
  if (Object.keys(habits).length) {
    Object.entries(habits).forEach(([key, value]) => {
      writeRow(wsHabitos, [key, String(value)]);
    });
  } else {
    const habitMap: Record<string, string> = {
      tabaquismo: 'Tabaquismo', alcohol: 'Alcohol', cafe: 'Café',
      bebidasAzucaradas: 'Bebidas azucaradas', drogasMed: 'Drogas/medicamentos',
      anabolicos: 'Anabólicos', preEntreno: 'Pre-entreno', energeticas: 'Energéticas'
    };
    Object.entries(person).forEach(([key, value]) => {
      if (habitMap[key] && value) writeRow(wsHabitos, [habitMap[key], String(value)]);
    });
  }
  wsHabitos.getColumn(1).width = 28;
  wsHabitos.getColumn(2).width = 40;

  // ============================================================
  // 8. HISTORIAL DE CAMBIOS
  // ============================================================
  const wsHist = addSheet(wb, 'Historial', ['Campo', 'Anterior', 'Nuevo', 'Fecha'], NAVY);
  profileHistory.forEach((entry) => {
    writeRow(wsHist, [
      entry.field || '',
      entry.oldValue || '',
      entry.newValue || '',
      entry.timestamp ? new Date(entry.timestamp).toLocaleString('es-MX') : ''
    ]);
  });
  wsHist.getColumn(1).width = 24;
  wsHist.getColumn(2).width = 30;
  wsHist.getColumn(3).width = 30;
  wsHist.getColumn(4).width = 22;

  // ============================================================
  // DESCARGA
  // ============================================================
  wb.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'plan'}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}
