import { foodDatabase } from '../data/foodDatabase.js';

export function roundDelta(n) {
  return Math.round(n * 10) / 10;
}

export function findFoodByName(nombre) {
  if (!nombre) return null;
  if (typeof nombre !== 'string') return null;
  return foodDatabase.find((f) => f.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}

export function getUnidadFromLabel(label) {
  if (!label) return '';
  if (typeof label !== 'string') return label;
  const parts = label.split(' ');
  if (parts.length >= 2) return parts.slice(1).join(' ');
  return label;
}

export function buildAlimentoMacros(alimento, porcion, cantidad) {
  return {
    gramos: `${Math.round(porcion.gramos * cantidad)}g`,
    p: (porcion.p * cantidad).toFixed(1),
    c: (porcion.c * cantidad).toFixed(1),
    g: (porcion.g * cantidad).toFixed(1),
    kcal: Math.round(porcion.kcal * cantidad),
  };
}

export function getGrupoColor(grupo) {
  switch (grupo) {
    case 'proteinas':
      return 'var(--color-primary)';
    case 'carbohidratos':
      return 'var(--color-green)';
    case 'grasas':
      return 'var(--color-accent)';
    case 'lacteos':
      return 'var(--color-navy)';
    default:
      return 'var(--color-text-muted)';
  }
}

export function getGrupoLabel(grupo) {
  switch (grupo) {
    case 'proteinas':
      return 'PROT';
    case 'carbohidratos':
      return 'CARB';
    case 'grasas':
      return 'GRASA';
    case 'lacteos':
      return 'LCTEA';
    default:
      return grupo;
  }
}

export function getEquivalentes(grupo, nombreActual) {
  if (!grupo) return [];
  if (typeof grupo !== 'string') return [];
  if (typeof nombreActual !== 'string') nombreActual = '';
  return foodDatabase
    .filter((f) => f.grupo === grupo && f.nombre !== nombreActual)
    .map((f) => f.nombre);
}

export function getMealTotalKcal(meal) {
  return (meal.menus || []).reduce(
    (sum, menu) => sum + menu.alimentos.reduce((s, a) => s + (parseFloat(a.kcal) || 0), 0),
    0
  );
}

