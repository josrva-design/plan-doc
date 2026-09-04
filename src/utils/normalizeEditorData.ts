export const normalizeFood = (f: any) => {
  const name = f.name || f.nombre || '';
  let grams = f.grams || f.gramos || '';
  let unit = f.unit || 'g';
  let cantidadNum = 0;

  const gramsStr = String(grams || '').trim();
  const gramsMatch = gramsStr.match(/^(\d+(?:[.,]\d+)?)\s*([gG])?$/);
  let gramsNum = gramsStr;
  let gramsHasG = false;
  if (gramsMatch) {
    gramsNum = gramsMatch[1].replace(',', '.');
    gramsHasG = !!gramsMatch[2];
  }

  const porcionRaw = String(f.porcion || '').trim();
  if (porcionRaw) {
    const numMatch = porcionRaw.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
    if (numMatch) {
      const num = numMatch[1].replace(',', '.');
      const rest = numMatch[2].trim();
      cantidadNum = parseFloat(num);
      if (rest) unit = rest;
      else if (!gramsNum) gramsNum = num;
    } else {
      unit = porcionRaw;
    }
  }

  if (unit === 'g' && gramsHasG) {
    unit = '';
  }

  const parseNum = (v: any) => {
    if (typeof v === 'number') return v;
    const n = parseFloat(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };

  const p = parseNum(f.macros?.proteinas ?? f.p);
  const c = parseNum(f.macros?.carbos ?? f.c);
  const g = parseNum(f.macros?.grasas ?? f.g);
  const kcal = parseNum(f.kcal);

  return {
    name,
    grams: gramsNum,
    unit,
    cantidad: cantidadNum || parseFloat(String(f.cantidad || '').replace(',', '.')) || 0,
    kcal,
    macros: { proteinas: p, carbos: c, grasas: g },
    grupo: f.grupo || '',
    porcion: f.porcion || '',
  };
};

export const normalizeMeal = (meal: any) => {
  if (!meal || typeof meal !== 'object') return meal;
  const normalized = { ...meal };
  if (Array.isArray(normalized.foods)) {
    normalized.foods = normalized.foods.map(normalizeFood);
  }
  if (Array.isArray(normalized.menus)) {
    normalized.menus = normalized.menus.map((menu: any) => ({
      ...menu,
      alimentos: (menu.alimentos || []).map(normalizeFood),
    }));
  }
  return normalized;
};
