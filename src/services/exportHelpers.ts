export const getFoodGroup = (food) => {
  const m = food?.macros;
  if (!m) return null;
  const { proteinas = 0, carbos = 0, grasas = 0 } = m;
  if (proteinas > 0 && proteinas >= carbos && proteinas >= grasas) {
    return { key: 'proteinas', label: 'PROT', bg: '#0066CC' };
  }
  if (carbos > 0 && carbos >= proteinas && carbos >= grasas) {
    return { key: 'carbohidratos', label: 'CARB', bg: '#2E9E70' };
  }
  if (grasas > 0 && grasas >= proteinas && grasas >= carbos) {
    return { key: 'grasas', label: 'GRASA', bg: '#CC6600' };
  }
  return null;
};

export const getFoodGroupBadge = (food, esc) => {
  const g = getFoodGroup(food);
  if (!g) return '';
  return `<span style="font-size:8px;font-weight:800;padding:2px 6px;border-radius:999px;background:${g.bg};color:#fff;white-space:nowrap;margin-right:6px">${esc(g.label)}</span>`;
};

export const formatQuantity = (f) => {
  const gramsNum = parseFloat(String(f.grams || '').replace(',', '.'));
  const hasGrams = Number.isFinite(gramsNum) && gramsNum > 0;
  let cantidadNum = parseFloat(String(f.cantidad || '').replace(',', '.'));
  const hasCantidad = Number.isFinite(cantidadNum) && cantidadNum > 0;
  let unit = String(f.unit || '').trim();
  const porcion = String(f.porcion || '').trim();

  const weightUnits = ['g', 'kg', 'mg', 'gr', 'gramo', 'gramos', 'grano', 'granos'];
  const isWeightUnit = (u) => weightUnits.includes(u.toLowerCase());

  const pluralize = (u, count) => {
    if (count === 1) return u;
    const lower = u.toLowerCase();
    if (/^(taz[oó]n|cdita?|cucharadita|cucharada|cda|unidad|porci[oó]n|rebanada|rodaja|filete|pechuga|huevo|pan|tortilla|barra|bolita?|pu[ñn]ado|manojo|rama|hoja|lata|sobre|tableta|cepillo|vaso|pizca|chorrito|loncha|lonja|rac[íi]m|uva|almendra|nuez|pistacho|cacahuate|casta[ñn]a|semilla|fruta|verdura|vegetal|carne|pescado|marisco|queso|leche|yogur|crema|arroz|pasta|taco|wrap|sandwich|smoothie|jugo|agua|refresco|infusi[oó]n|caf[ée]|t[ée])$/i.test(lower)) {
      return u + 's';
    }
    if (lower === 'unidad') return 'unidades';
    return u;
  };

  if (!hasCantidad && porcion) {
    const numMatch = porcion.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
    if (numMatch) {
      cantidadNum = parseFloat(numMatch[1].replace(',', '.'));
      if (!Number.isFinite(cantidadNum) || cantidadNum <= 0) cantidadNum = 1;
      const rest = numMatch[2].trim();
      if (rest) unit = rest;
    } else if (!unit) {
      unit = porcion;
    }
  }

  const effectiveCount = (hasCantidad || (!hasCantidad && porcion && /^\d/.test(porcion))) ? (hasCantidad ? cantidadNum : (Number.isFinite(cantidadNum) ? cantidadNum : 1)) : (hasGrams ? 1 : 0);
  const displayUnit = unit || porcion || '';
  const isDisplayWeight = isWeightUnit(displayUnit);

  const b = (val) => `<b>${val}</b>`;

  if (hasGrams && effectiveCount > 0 && displayUnit && !isDisplayWeight) {
    const unitPlural = pluralize(displayUnit, effectiveCount);
    return `${b(gramsNum + 'g')} (${effectiveCount} ${unitPlural})`;
  }
  if (hasGrams && effectiveCount > 0 && displayUnit && isDisplayWeight) {
    return `${b(gramsNum + 'g')}`;
  }
  if (hasGrams && displayUnit && !isDisplayWeight) {
    const assumedCount = 1;
    const unitPlural = pluralize(displayUnit, assumedCount);
    return `${b(gramsNum + 'g')} (${assumedCount} ${unitPlural})`;
  }
  if (hasGrams) {
    return `${b(gramsNum + 'g')}`;
  }
  if (effectiveCount > 0 && displayUnit) {
    const unitPlural = pluralize(displayUnit, effectiveCount);
    return `${effectiveCount} ${unitPlural}`;
  }
  if (displayUnit && displayUnit !== 'g') {
    const assumedCount = 1;
    const unitPlural = pluralize(displayUnit, assumedCount);
    return `${assumedCount} ${unitPlural}`;
  }
  return '';
};

export const formatSupplementQty = (sup, supplementDatabase) => {
  const match = (supplementDatabase || []).find((db) => db.nombre.toLowerCase() === (sup.nombre || '').toLowerCase());
  const grams = sup.gramos || (match ? String(match.dosisEstandar || '') : '');
  const unidad = match ? match.unidad : '';
  const porcion = sup.porcion || (match ? match.porcionSugerida : '') || '';
  const gramsNum = parseFloat(String(grams || '').replace(',', '.'));
  const hasGrams = Number.isFinite(gramsNum) && gramsNum > 0;
  if (hasGrams && unidad && unidad !== 'g') {
    return `<b>${gramsNum}${unidad}</b> (${porcion || '1 toma'})`;
  }
  if (hasGrams && porcion) {
    return `<b>${gramsNum}g</b> (${porcion})`;
  }
  if (hasGrams) {
    return `<b>${gramsNum}g</b>`;
  }
  if (porcion) {
    return porcion;
  }
  return '';
};

// Helpers moved here to centralize logic and make them testable
export const DESCANSOS_OPTIONS = [
  { value: '30', label: '30 seg' },
  { value: '60', label: '1 min' },
  { value: '120', label: '2 min' },
  { value: '180', label: '3 min' },
  { value: '240', label: '4 min' },
  { value: '300', label: '5 min' },
];

export const formatRest = (restValue) => {
  if (!restValue) return '';
  const match = DESCANSOS_OPTIONS.find((d) => d.value === String(restValue));
  return match ? match.label : String(restValue);
};

export const bloqueColor = (tipo) => {
  // Simple mapping — keep consistent with previous default
  const map = {
    cardio: '#EF4444',
    default: '#0D2640',
  };
  return map[tipo?.toLowerCase?.()] || map.default;
};

export const parseDate = (value) => {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;
  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const d = new Date(str + 'T00:00:00');
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const dmy = str.match(/^(\d{2})\/(\d{2})\/(\d{2,4})$/);
  if (dmy) {
    let [, dd, mm, yyyy] = dmy;
    if (yyyy.length === 2) yyyy = '20' + yyyy;
    const s = `${yyyy}-${mm}-${dd}`;
    const d = new Date(s + 'T00:00:00');
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const groupExercisesBySequence = (exercises) => {
  if (!exercises || !exercises.length) return [];

  // Preserve input order. Prefer blockLetter (from editor), then sequence letter (A1, B2...),
  // otherwise use isFirstInBlock to create groups in appearance order.
  const hasBlockLetter = exercises.some((e) => (e.blockLetter || '').toString().trim() !== '');
  const hasSequence = exercises.some((e) => /^([A-Za-z])/.test(String(e.secuencia || e.codigo || '')));

  const groups = new Map();
  let autoLetterCode = 65; // 'A'
  let currentAutoLetter = String.fromCharCode(autoLetterCode);

  exercises.forEach((ex, idx) => {
    let letter = null;

    if (hasBlockLetter) {
      // Use blockLetter when available (authoritative from editor)
      letter = (ex.blockLetter || '').toString().trim() || null;
      if (!letter) {
        // If blockLetter missing for some items, use isFirstInBlock to advance a letter
        if (ex.isFirstInBlock && idx > 0) {
          autoLetterCode += 1;
          currentAutoLetter = String.fromCharCode(autoLetterCode);
        }
        letter = currentAutoLetter;
      }
    } else if (hasSequence) {
      const m = String(ex.secuencia || ex.codigo || '').match(/^([A-Za-z])/);
      letter = m ? m[1].toUpperCase() : null;
      if (!letter) {
        if (ex.isFirstInBlock && idx > 0) {
          autoLetterCode += 1;
          currentAutoLetter = String.fromCharCode(autoLetterCode);
        }
        letter = currentAutoLetter;
      }
    } else {
      // No explicit grouping info: rely on isFirstInBlock markers
      if (ex.isFirstInBlock && idx > 0) {
        autoLetterCode += 1;
        currentAutoLetter = String.fromCharCode(autoLetterCode);
      }
      letter = currentAutoLetter;
    }

    if (!letter) letter = 'A';
    letter = String(letter).toUpperCase();

    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push(ex);
  });

  return Array.from(groups.entries()).map(([letter, exs]) => {
    const count = exs.length;
    const rawTipo = String(exs[0]?.tipo || exs[0]?.blockSerie || exs[0]?.serie || exs[0]?.tipoBloque || '').trim();
    const rawTipoNorm = rawTipo.toUpperCase();

    // Normalize selector values
    let tipo = 'SERIE SIMPLE';
    if (rawTipoNorm) {
      if (rawTipoNorm.includes('BIS')) tipo = 'BISERIE';
      else if (rawTipoNorm.includes('TRI')) tipo = 'TRISERIE';
      else if (rawTipoNorm.includes('GIG') || rawTipoNorm.includes('CIRCUITO')) tipo = 'SERIE GIGANTE / CIRCUITO';
      else if (rawTipoNorm.includes('SIMPLE')) tipo = 'SERIE SIMPLE';
      else tipo = rawTipoNorm;
    } else {
      if (count === 2) tipo = 'BISERIE';
      else if (count === 3) tipo = 'TRISERIE';
      else if (count >= 4) tipo = 'SERIE GIGANTE / CIRCUITO';
    }

    // If items in this group have explicit secuencia like A1, A2... sort them numerically by that suffix
    const seqPattern = new RegExp(`^${letter}\\s*(\\d+)$`, 'i');
    let ejercicios = [...exs];
    if (ejercicios.every((e) => seqPattern.test(String(e.secuencia || e.codigo || '')))) {
      ejercicios.sort((a, b) => {
        const ma = String(a.secuencia || a.codigo || '').match(seqPattern);
        const mb = String(b.secuencia || b.codigo || '').match(seqPattern);
        const na = ma ? parseInt(ma[1], 10) : 0;
        const nb = mb ? parseInt(mb[1], 10) : 0;
        return na - nb;
      });
    }

    return {
      letra: letter,
      tipo,
      ejercicios: ejercicios.map((ex, idx) => ({
        ...ex,
        // Keep provided secuencia when present, otherwise synthesize using the group letter & index
        secuencia: ex.secuencia || `${letter}${idx + 1}`,
      })),
      indicacion: exs[0]?.indicacion || '',
    };
  });
};
