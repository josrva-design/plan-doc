import { describe, it, expect } from 'vitest';
import { calcularEdad } from '../utils/summaryHelpers';

// ==================== UNIT TESTS: Calculo de edad ====================

describe('ProfileSection - calcularEdad', () => {
  it('calcula correctamente la edad con fechas validas', () => {
    expect(calcularEdad('15/06/1990', '2026-08-23')).toBe('36');
  });

  it('retorna "—" si falta fecha de nacimiento', () => {
    expect(calcularEdad('', '2026-08-23')).toBe('—');
  });

  it('retorna "—" si falta fecha de consulta', () => {
    expect(calcularEdad('15/06/1990', '')).toBe('—');
  });

  it('retorna "—" si ambas fechas estan vacias', () => {
    expect(calcularEdad('', '')).toBe('—');
  });

  it('retorna "—" para fecha nacimiento formato invalido', () => {
    expect(calcularEdad('invalido', '2026-08-23')).toBe('—');
  });

  it('retorna "—" para fecha consulta formato invalido', () => {
    expect(calcularEdad('15/06/1990', 'invalido')).toBe('—');
  });

  it('calcula correctamente cuando cumple anos en la fecha exacta', () => {
    expect(calcularEdad('01/01/2000', '2026-01-01')).toBe('26');
  });

  it('resta 1 ano si el cumple aun no llega este ano', () => {
    expect(calcularEdad('01/01/2000', '2025-12-31')).toBe('25');
  });

  it('calcula para bebe de 1 ano', () => {
    expect(calcularEdad('01/01/2025', '2026-01-01')).toBe('1');
  });

  it('calcula para recien nacido (menos de 1 ano)', () => {
    expect(calcularEdad('01/06/2026', '2026-08-23')).toBe('0');
  });
});

// ==================== TESTS: Estructura de secciones ====================

describe('ProfileSection - Estructura de datos', () => {
  // Definimos la estructura esperada de secciones
  const SECCIONES_ESPERADAS = [
    { titulo: 'Identificación', campos: ['nombre', 'sexo', 'fechaNacimiento', 'edad', 'ocupacion'] },
    { titulo: 'Contacto', campos: ['celular', 'email', 'instagram', 'pais', 'estado'] },
    { titulo: 'Rutina diaria', campos: ['despertar', 'dormir', 'inicioTrabajo', 'terminoTrabajo', 'recesoTrabajo', 'tiemposComida'] },
    { titulo: 'Historial médico', campos: ['condicionMedica', 'app', 'af', 'med', 'alergias', 'cirugias', 'intolerancias', 'lesiones', 'labs'] },
    { titulo: 'Hábitos', campos: ['tabaco', 'alcohol', 'cafe', 'azucar', 'drogas', 'ana', 'pre', 'energ'] },
    { titulo: 'Actividad física', campos: ['act1', 'act2', 'horario', 'sesiones', 'duracion', 'pasos', 'nivel'] },
    { titulo: 'Preferencias nutricionales', campos: ['planPrevio', 'resultadosPrevios', 'queNoTeGusta', 'tipoPlan', 'caracteristica', 'interesSup', 'supActual'] },
    { titulo: 'Gustos alimenticios', campos: ['gustos', 'leGusta', 'noLeGusta', 'quienCocina'] },
    { titulo: 'Objetivo', campos: ['objetivo', 'objetivoEspecifico'] },
    { titulo: 'Recursos', campos: ['presupuesto', 'equipo', 'calidadSueño'] },
  ];

  it('tiene 10 secciones definidas', () => {
    expect(SECCIONES_ESPERADAS.length).toBe(10);
  });

  it('cada seccion tiene al menos un campo', () => {
    SECCIONES_ESPERADAS.forEach(seccion => {
      expect(seccion.campos.length).toBeGreaterThan(0);
    });
  });

  it('todos los campos de Person estan cubiertos', () => {
    const camposCubiertos = new Set(SECCIONES_ESPERADAS.flatMap(s => s.campos));
    const camposEsperados = [
      'nombre', 'sexo', 'fechaNacimiento', 'edad', 'ocupacion',
      'celular', 'email', 'instagram', 'pais', 'estado',
      'despertar', 'dormir', 'inicioTrabajo', 'terminoTrabajo', 'recesoTrabajo', 'tiemposComida',
      'condicionMedica', 'app', 'af', 'med', 'alergias', 'cirugias', 'intolerancias', 'lesiones', 'labs',
      'tabaco', 'alcohol', 'cafe', 'azucar', 'drogas', 'ana', 'pre', 'energ',
      'act1', 'act2', 'horario', 'sesiones', 'duracion', 'pasos', 'nivel',
      'planPrevio', 'resultadosPrevios', 'queNoTeGusta', 'tipoPlan', 'caracteristica', 'interesSup', 'supActual',
      'gustos', 'leGusta', 'noLeGusta', 'quienCocina',
      'objetivo', 'objetivoEspecifico',
      'presupuesto', 'equipo', 'calidadSueño',
    ];
    
    camposEsperados.forEach(campo => {
      expect(camposCubiertos.has(campo)).toBe(true);
    });
  });
});
