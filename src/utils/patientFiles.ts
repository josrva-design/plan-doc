/**
 * Patient Files - Operaciones para guardar/cargar pacientes como archivos JSON
 * 
 * Cada paciente se guarda como un archivo .json independiente.
 * Estructura del archivo:
 * {
 *   version: "1.0",
 *   patientId: "DOC-XXXXXX",
 *   nombre: "Nombre del paciente",
 *   fechaGuardado: "ISO date",
 *   data: { ...AppData completa ... }
 * }
 */

import type { AppData } from '../core/types.ts';
import { safeSet, safeGet } from './storage.ts';
import { getProximaConsulta } from './summaryHelpers.ts';

const FILE_VERSION = '1.0';
const LAST_PATIENT_KEY = 'docfitness-last-patient';

export interface PatientFile {
  version: string;
  patientId: string;
  nombre: string;
  fechaGuardado: string;
  data: AppData;
}

/**
 * Genera las iniciales extendidas para el ID
 * "Juan Méndez" → "JMEND" (Inicial nombre + 4 letras apellido)
 * "Ana López" → "ALOPE"
 * "Carlos Ruiz" → "CRUIZ"
 * "María" → "M" (sin apellido)
 */
export function getExtendedInitials(nombre: string): string {
  if (!nombre) return '';
  
  const parts = nombre.trim().split(/\s+/);
  
  // Filtrar partes vacías
  const words = parts.filter(w => w.length > 0);
  
  if (words.length === 0) return '';
  
  if (words.length === 1) {
    // Solo un nombre: primeras 4 letras o el nombre completo si es corto
    return words[0].substring(0, 4).toUpperCase();
  }
  
  // Inicial del primer nombre
  const firstInitial = words[0][0].toUpperCase();
  
  // Buscar el apellido (última palabra que no sea parte del nombre)
  const lastWord = words[words.length - 1];
  
  // Si la última palabra es corta (2 chars o menos), combinar con la penúltima
  let surnamePart = '';
  if (lastWord.length <= 2 && words.length >= 2) {
    // Usar las dos últimas palabras
    const lastTwo = words.slice(-2).join('');
    surnamePart = lastTwo.substring(0, 4).toUpperCase();
  } else {
    surnamePart = lastWord.substring(0, 4).toUpperCase();
  }
  
  return firstInitial + surnamePart;
}

/**
 * Formatea una fecha para el ID (YYYYMMDD)
 * "1993-06-07" → "19930607"
 * "07/06/1993" → "19930607"
 */
export function formatDateForId(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 8) {
    // YYYYMMDD o DDMMYYYY
    if (digits.substring(0, 4) > '1900' && digits.substring(0, 4) < '2100') {
      return digits; // Ya es YYYYMMDD
    }
    // Asumir DDMMYYYY
    const dd = digits.substring(0, 2);
    const mm = digits.substring(2, 4);
    const yyyy = digits.substring(4, 8);
    return `${yyyy}${mm}${dd}`;
  }
  if (digits.length === 6) {
    // DDMMYY → YYYYMMDD
    const dd = digits.substring(0, 2);
    const mm = digits.substring(2, 4);
    const yy = digits.substring(4, 6);
    return `20${yy}${mm}${dd}`;
  }
  return '';
}

/**
 * Genera un ID de paciente
 * Fórmula: DOC-{Iniciales extendidas}{FechaNacimientoYYYYMMDD}
 * "Juan Méndez", "1993-06-07" → "DOC-JMEND19930607"
 */
export function generatePatientId(nombre: string, fechaNacimiento: string): string {
  const initials = getExtendedInitials(nombre);
  const datePart = formatDateForId(fechaNacimiento);
  return initials && datePart ? `DOC-${initials}${datePart}` : '';
}

/**
 * Genera un nombre de archivo basado en el ID del paciente
 */
export function generateFileName(nombre: string): string {
  const safe = nombre
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
  return safe || 'paciente';
}

/**
 * Crea el payload completo para guardar
 */
export function createPatientPayload(data: AppData): PatientFile {
  const nombre = data.person?.nombre || 'Paciente sin nombre';
  return {
    version: FILE_VERSION,
    patientId: data.person?.id || '',
    nombre,
    fechaGuardado: new Date().toISOString(),
    data,
  };
}

/**
 * Descarga el paciente como archivo JSON
 * El nombre del archivo usa el patientId si está disponible
 */
export function downloadPatientJSON(data: AppData, fileName?: string): string {
  const payload = createPatientPayload(data);
  // Usar el patientId para el nombre del archivo si existe, sino el nombre
  const name = fileName || (payload.patientId || generateFileName(payload.nombre));
  const finalName = `${name}.json`;
  
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = finalName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  // Guardar referencia al último archivo
  safeSet(LAST_PATIENT_KEY, JSON.stringify({
    nombre: payload.nombre,
    patientId: payload.patientId,
    fechaGuardado: payload.fechaGuardado,
    fileName: finalName,
  }));
  
  return finalName;
}

/**
 * Datos iniciales para crear un paciente
 */
export interface NewPatientData {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  sexo: string;
}

/**
 * Crea un AppData vacío con los datos iniciales del paciente
 * El ID se genera automáticamente: DOC-{Iniciales}{FechaNacimiento}
 */
export function createEmptyAppData(patientData: NewPatientData): AppData {
  const { nombre, apellido, fechaNacimiento, sexo } = patientData;
  
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const fechaConsulta = `${dd}/${mm}/${yyyy}`;
  
  // ID = DOC-{Iniciales}{FechaNacimiento}
  const fullName = `${nombre} ${apellido}`.trim();
  const patientId = generatePatientId(fullName, fechaNacimiento);
  
  const proximaConsulta = getProximaConsulta(fechaConsulta) || '';
  
  return {
    person: {
      id: patientId,
      nombre: fullName,
      edad: '',
      estatura: '',
      pesoIni: '',
      nivel: '',
      objetivo: '',
      objetivoEspecifico: '',
      sexo: sexo || '',
      fechaNacimiento: fechaNacimiento || '',
      pais: '',
      estado: '',
      celular: '',
      email: '',
      instagram: '',
      ocupacion: '',
      imc: '',
      grasa: '',
      musculo: '',
      cintura: '',
      cadera: '',
      despertar: '',
      dormir: '',
      pasos: '',
      inicioTrabajo: '',
      recesoTrabajo: '',
      terminoTrabajo: '',
      tiemposComida: '',
      gustos: '',
      quienCocina: '',
      leGusta: '',
      noLeGusta: '',
      condicionMedica: '',
      app: '',
      appEstado: '',
      af: '',
      afEstado: '',
      med: '',
      medEstado: '',
      alergias: '',
      alergiasEstado: '',
      cirugias: '',
      cirugiasEstado: '',
      intolerancias: '',
      intoleranciasEstado: '',
      lesiones: '',
      lesionesEstado: '',
      labs: '',
      labsEstado: '',
      presupuesto: '',
      equipo: '',
      calidadSueño: '',
      tabaco: '',
      alcohol: '',
      cafe: '',
      azucar: '',
      drogas: '',
      ana: '',
      pre: '',
      energ: '',
      act1: '',
      act2: '',
      horario: '',
      sesiones: '',
      duracion: '',
      planPrevio: '',
      resultadosPrevios: '',
      queNoTeGusta: '',
      tipoPlan: '',
      caracteristica: '',
      interesSup: '',
      supActual: '',
    },
    stats: {
      peso: '',
      abdomen: '',
      grasaKg: '',
      grasaPorc: '',
      pliegue: '',
      avPeso: '',
      avAbd: '',
      avGrasaKg: '',
      avGrasaPorc: '',
      avPliegue: '',
      adherencia: '',
      nutricion: '',
      entreno: '',
      cardio: '',
      descanso: '',
    },
    nutrition: {},
    training: {},
    calendar: [],
    warmup: [],
    routines: [],
    activeRoutineId: null,
    meals: [],
    supplements: [],
    supplementsStrategy: '',
    feedback: {},
    diagnosis: {},
    objectives: {},
    habits: {},
    evolution: {
      dates: [],
      cells: {},
      consultas: [],
    },
    fechaConsulta,
    proximaConsulta,
    profileHistory: [],
  };
}

/**
 * Lee y parsea un archivo JSON de paciente desde un File object
 */
export async function readPatientFile(file: File): Promise<PatientFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        
        // Validar estructura
        if (!parsed.data) {
          reject(new Error('Archivo JSON inválido: falta el campo "data"'));
          return;
        }
        
        // Manejar formato antiguo (sin wrapper)
        if (parsed.person || parsed.version) {
          const patientFile: PatientFile = {
            version: parsed.version || FILE_VERSION,
            patientId: parsed.patientId || parsed.data?.person?.id || '',
            nombre: parsed.nombre || parsed.data?.person?.nombre || 'Paciente importado',
            fechaGuardado: parsed.fechaGuardado || new Date().toISOString(),
            data: parsed.data || parsed,
          };
          resolve(patientFile);
          return;
        }
        
        resolve(parsed as PatientFile);
      } catch (err) {
        reject(new Error('Error al parsear JSON: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}

/**
 * Carga un archivo de paciente desde input file change
 */
export async function loadPatientFromFile(file: File): Promise<AppData> {
  const patientFile = await readPatientFile(file);
  return patientFile.data;
}

/**
 * Guarda la referencia del último paciente abierto
 */
export function saveLastPatientReference(nombre: string, patientId: string, fileName: string): void {
  safeSet(LAST_PATIENT_KEY, JSON.stringify({
    nombre,
    patientId,
    fechaGuardado: new Date().toISOString(),
    fileName,
  }));
}

/**
 * Obtiene la referencia del último paciente abierto
 */
export function getLastPatientReference(): { nombre: string; patientId: string; fileName: string; fechaGuardado: string } | null {
  const raw = safeGet(LAST_PATIENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Valida que un objeto sea un AppData válido
 */
export function isValidAppData(data: any): data is AppData {
  return data && typeof data === 'object' && ('person' in data || 'stats' in data);
}
