import { SECTIONS, UNIT_MAP } from '../components/EvolutionConstants.ts';

export function avanceGlobal(consultas: string[], cells: Record<string, Record<string, number | ''>> | undefined, key: string): number | null {
  if (!consultas.length || !cells) return null;
  const firstC = consultas[0];
  const lastIdx = [...consultas].reverse().findIndex(c => typeof cells[c]?.[key] === 'number');
  const lastC = lastIdx === -1 ? consultas[0] : consultas[consultas.length - 1 - lastIdx];
  const f = cells[firstC]?.[key];
  const l = cells[lastC]?.[key];
  if (typeof f !== 'number' || typeof l !== 'number') return null;
  return Math.round((l - f) * 10) / 10;
}

export function valorActual(consultas: string[], cells: Record<string, Record<string, number | ''>> | undefined, key: string): number | null {
  if (!consultas.length || !cells) return null;
  const lastIdx = [...consultas].reverse().findIndex(c => typeof cells[c]?.[key] === 'number');
  const lastC = lastIdx === -1 ? consultas[0] : consultas[consultas.length - 1 - lastIdx];
  return Math.round(cells[lastC]?.[key] * 10) / 10;
}

export function valorAnterior(consultas: string[], cells: Record<string, Record<string, number | ''>> | undefined, key: string): number | null {
  if (!consultas.length || !cells) return null;
  const firstIdx = consultas.findIndex(c => typeof cells[c]?.[key] === 'number');
  const firstC = firstIdx === -1 ? consultas[0] : consultas[firstIdx];
  return Math.round(cells[firstC]?.[key] * 10) / 10;
}

export function buildMetricas(consultas: string[], cells: Record<string, Record<string, number | ''>> | undefined) {
  const withData = SECTIONS.flatMap(sec => sec.rows)
    .map(row => ({ ...row, suffix: UNIT_MAP[row.key] || '', primary: row.key === 'peso', actualPh: '—', avancePh: '—' }))
    .slice(0, 5);
  return withData;
}
