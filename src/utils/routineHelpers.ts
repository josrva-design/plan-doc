export function ejToDisplay(ej) {
  if (!ej) {
    return {
      uid: Math.random().toString(36).slice(2),
      tipo: '',
      ejercicio: '',
      sets: '',
      reps: '',
      peso: '',
      descanso: '',
      notas: '',
      video: '-',
      categoria: 'Aprox',
      tecnica: '',
      rir: '',
      esBase: false,
      aproxBase: null,
      aproxPorcentaje: null,
      porcentaje: null,
      semana1: '',
      semana2: '',
      semana3: '',
      semana4: '',
      s1: '',
      s2: '',
      s3: '',
      s4: '',
      musculo: '',
      movimiento: '',
      secuencia: '',
      blockLetter: '',
      blockSerie: '',
      blockPosition: 0,
      isFirstInBlock: true,
      isLastInBlock: true,
      isOption: false,
      optionNumber: null,
    };
  }
  const nombre = (ej.ejercicio || '').replace(/\s*\(\d+%\)\s*/, '').trim();
  const pctMatch = (ej.ejercicio || '').match(/\((\d+)%\)/);
  const aproxPorcentaje = pctMatch ? parseInt(pctMatch[1], 10) : (ej.aproxPorcentaje || null);
  const porcentaje = aproxPorcentaje;
  const semana1 = ej.semana1 ?? ej.s1 ?? '';
  const semana2 = ej.semana2 ?? ej.s2 ?? '';
  const semana3 = ej.semana3 ?? ej.s3 ?? '';
  const semana4 = ej.semana4 ?? ej.s4 ?? '';
  return {
    uid: ej.uid || Math.random().toString(36).slice(2),
    tipo: ej.tipo || '',
    serie: ej.serie || 'Simple',
    ejercicio: nombre,
    sets: String(ej.sets ?? ''),
    reps: ej.reps ?? '',
    peso: ej.peso ?? '',
    descanso: ej.descanso ?? '',
    notas: ej.notas ?? '',
    video: ej.video ?? '-',
    categoria: ej.categoria || (ej.aproxBase ? 'Aprox' : 'Entreno'),
    tecnica: (ej.tecnica || '').replace(/\s*\(\d+%\)\s*/,'').trim(),
    rir: ej.rir ?? '',
    esBase: ej.esBase || false,
    aproxBase: ej.aproxBase || null,
    aproxPorcentaje,
    porcentaje,
    semana1,
    semana2,
    semana3,
    semana4,
    s1: semana1,
    s2: semana2,
    s3: semana3,
    s4: semana4,
    musculo: ej.musculo ?? '',
    movimiento: ej.movimiento ?? '',
    secuencia: ej.secuencia ?? '',
    blockLetter: ej.blockLetter || '',
    blockSerie: ej.blockSerie || '',
    blockPosition: ej.blockPosition || 0,
    grupo: ej.grupo || '',
    isFirstInBlock: true,
    isLastInBlock: true,
    isOption: false,
    optionNumber: null,
  };
}

export function displayToEj(d) {
  const semana1 = d.semana1 || d.s1 || '';
  const semana2 = d.semana2 || d.s2 || '';
  const semana3 = d.semana3 || d.s3 || '';
  const semana4 = d.semana4 || d.s4 || '';
  const base = {
    uid: d.uid,
    tipo: d.tipo || 'Normal',
    serie: d.serie || 'Simple',
    ejercicio: d.ejercicio || '',
    reps: d.reps || '8-10',
    peso: d.peso || '',
    descanso: d.descanso || '',
    notas: d.notas || '',
    video: d.video || '-',
    categoria: d.categoria || 'Aprox',
    tecnica: d.tecnica || '',
    rir: d.rir || '',
    esBase: d.esBase || false,
    aproxBase: d.aproxBase || null,
    aproxPorcentaje: d.aproxPorcentaje || null,
    porcentaje: d.porcentaje ?? null,
    semana1,
    semana2,
    semana3,
    semana4,
    s1: semana1,
    s2: semana2,
    s3: semana3,
    s4: semana4,
    musculo: d.musculo || '',
    movimiento: d.movimiento || '',
    secuencia: d.secuencia || '',
    grupo: d.grupo || '',
    tipoBloque: d.tipoBloque || '',
    blockLetter: d.blockLetter || '',
    blockSerie: d.blockSerie || '',
    blockPosition: d.blockPosition || 0,
  };
  const extra = Object.fromEntries(Object.entries(d).filter(([k]) => !Object.keys(base).includes(k)));
  return { ...base, ...extra };
}

export function groupSeries(items) {
  const LIMIT = { Simple: 1, Biserie: 2, Triserie: 3, Circuito: 4 };
  const groups = [];
  let cur = [];
  let lastSerie = null;
  let lastBlockLetter = null;

  items.forEach((e) => {
    if (e.categoria === 'Aprox' || e.aproxBase) {
      if (cur.length) {
        groups.push({ serie: lastSerie, items: cur });
        cur = [];
        lastSerie = null;
        lastBlockLetter = null;
      }
      groups.push({ serie: 'Aprox', items: [e] });
      return;
    }

    const blockLetter = e.blockLetter || null;
    const serieKey = e.blockSerie || e.serie || 'Simple';

    // Si hay un bloque actual y cambió el blockLetter o la serie, cerrar el grupo
    if (lastBlockLetter !== null && (blockLetter !== lastBlockLetter || serieKey !== lastSerie)) {
      if (cur.length) {
        groups.push({ serie: lastSerie, items: cur });
        cur = [];
      }
    }

    // Si no hay blockLetter, aplicar límites por tipo
    if (!blockLetter) {
      const lim = LIMIT[serieKey] || 99;
      if (lastSerie !== null && (serieKey !== lastSerie || cur.length >= lim)) {
        if (cur.length) {
          groups.push({ serie: lastSerie, items: cur });
          cur = [];
        }
      }
    }

    cur.push(e);
    lastSerie = serieKey;
    lastBlockLetter = blockLetter;
  });

  if (cur.length) groups.push({ serie: lastSerie, items: cur });
  return groups.filter((g) => g.items.length > 0);
}

export function getCombinedSections(bloques) {
  const serieGroups = groupSeries(bloques).map((g, idx) => ({ ...g, letter: String.fromCharCode(65 + idx) }));

  let tipoIndex = 0;
  let aproxIndex = 0;
  const items = [];

  serieGroups.forEach((g) => {
    const blockSerie = g.serie || 'Simple';
    g.items.forEach((ej, i) => {
      const isOption = i === 0 && tipoIndex < 3;
      const optionNumber = isOption ? tipoIndex + 1 : null;
      if (isOption) tipoIndex++;

      const isAprox = (ej.categoria || '').toLowerCase() === 'aprox' || ej.aproxBase != null || ej.porcentaje != null || ej.aproxPorcentaje != null;
      const fase = isAprox ? 'APROXIMACIÓN' : 'ENTRENAMIENTO';
      const faseColor = isAprox ? 'var(--color-primary)' : 'var(--color-green)';
      const aproxPorcentaje = isAprox ? (ej.aproxPorcentaje || [50, 75, 85][aproxIndex]) : null;
      if (isAprox) aproxIndex++;

      const letter = g.letter;
      const position = i + 1;

      items.push({
        ...ej,
        isFirstInBlock: i === 0 && g.items.length > 0,
        isLastInBlock: i === g.items.length - 1 && g.items.length > 0,
        blockLetter: letter,
        blockSerie: blockSerie,
        blockPosition: position,
        secuencia: `${letter}${position}`,
        serie: blockSerie || ej.serie,
        isOption,
        optionNumber,
        isAprox,
        fase,
        faseColor,
        aproxPorcentaje,
      });
    });
  });

  return items;
}

export function recalcularBloques(items) {
  const result = items.map((item) => ({ ...item }));
  const nombreBase = (nombre) => (nombre || '').replace(/\s*\(\d+%\)\s*/, '').trim();
  const isAprox = (item) => (item.ejercicio || '').includes('%') || item.porcentaje != null;

  // Separar ejercicios con blockLetter de los que no lo tienen
  const withLetter: { item: any; idx: number }[] = [];
  const withoutLetter: { item: any; idx: number }[] = [];

  result.forEach((item, idx) => {
    if (item.blockLetter) {
      withLetter.push({ item, idx });
    } else {
      withoutLetter.push({ item, idx });
    }
  });

  // Agrupar sin blockLetter por nombre base
  const groups: { base: string; indices: number[] }[] = [];
  let currentGroup: { base: string; indices: number[] } | null = null;

  withoutLetter.forEach(({ item, idx }) => {
    const base = nombreBase(item.ejercicio);
    if (!currentGroup || currentGroup.base !== base) {
      currentGroup = { base, indices: [] };
      groups.push(currentGroup);
    }
    currentGroup.indices.push(idx);
  });

  let effOrder = 0;
  groups.forEach((group) => {
    const letter = String.fromCharCode(65 + effOrder);
    const aproxCount = group.indices.filter((idx) => isAprox(result[idx])).length;
    let aproxPos = 0;
    let effPos = aproxCount + 1;

    group.indices.forEach((idx) => {
      const item = result[idx];
      if (isAprox(item)) {
        result[idx] = {
          ...item,
          blockLetter: letter,
          blockSerie: 'Aprox',
          blockPosition: ++aproxPos,
          secuencia: `${letter}${aproxPos}`,
          isAprox: true,
          tecnica: (item.tecnica || '').replace(/\s*\(\d+%\)\s*/,'').trim(),
        };
      } else {
        result[idx] = {
          ...item,
          blockLetter: letter,
          blockPosition: effPos++,
          secuencia: `${letter}${effPos - 1}`,
          isAprox: false,
        };
      }
    });

    effOrder++;
  });

  return result;
}