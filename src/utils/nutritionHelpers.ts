import { foodDatabase } from '../data/foodDatabase.ts';

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
  const parts = label.split(' ').filter((p) => {
    const trimmed = p.replace(/[()]/g, '').trim();
    return !/^(\d+(?:[.,]\d+)?)\s*([gGmlML]+)$/.test(trimmed);
  });
  if (parts.length >= 2) return parts.slice(1).join(' ');
  if (parts.length === 1) return parts[0];
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
  if (meal.menuType === 'armar') {
    return (meal.foods || []).reduce((sum, f) => sum + (parseFloat(f.kcal) || 0), 0);
  }
  return (meal.menus || []).reduce(
    (sum, menu) => sum + menu.alimentos.reduce((s, a) => s + (parseFloat(a.kcal) || 0), 0),
    0
  );
}

export function getMealTotalMacros(meal) {
  if (meal.menuType === 'armar') {
    return (meal.foods || []).reduce(
      (acc, f) => {
        acc.p += parseFloat(f.p || f.macros?.proteinas || 0);
        acc.c += parseFloat(f.c || f.macros?.carbos || 0);
        acc.g += parseFloat(f.g || f.macros?.grasas || 0);
        return acc;
      },
      { p: 0, c: 0, g: 0 }
    );
  }
  return (meal.menus || []).reduce(
    (acc, menu) => {
      return menu.alimentos.reduce((s, a) => {
        s.p += parseFloat(a.p || a.macros?.proteinas || 0);
        s.c += parseFloat(a.c || a.macros?.carbos || 0);
        s.g += parseFloat(a.g || a.macros?.grasas || 0);
        return s;
      }, acc);
    },
    { p: 0, c: 0, g: 0 }
  );
}

export function getTotalMacrosFromMeals(meals) {
  return (meals || []).reduce(
    (acc, meal) => {
      const totals = getMealTotalMacros(meal);
      acc.p += totals.p;
      acc.c += totals.c;
      acc.g += totals.g;
      return acc;
    },
    { p: 0, c: 0, g: 0 }
  );
}

export function getTotalKcalFromMeals(meals) {
  return (meals || []).reduce((sum, meal) => sum + getMealTotalKcal(meal), 0);
}

export function getMacroPercentages(meals) {
  const totals = getTotalMacrosFromMeals(meals);
  const totalP = parseFloat(totals.p || 0);
  const totalC = parseFloat(totals.c || 0);
  const totalG = parseFloat(totals.g || 0);

  const pKcal = totalP * 4;
  const cKcal = totalC * 4;
  const gKcal = totalG * 9;
  const totalKcal = pKcal + cKcal + gKcal;

  if (!totalKcal) return { p: 0, c: 0, g: 0 };

  return {
    p: Math.round((pKcal / totalKcal) * 100),
    c: Math.round((cKcal / totalKcal) * 100),
    g: Math.round((gKcal / totalKcal) * 100),
  };
}
