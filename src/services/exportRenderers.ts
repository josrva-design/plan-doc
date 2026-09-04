import { getFoodGroupBadge, formatQuantity, formatSupplementQty } from './exportHelpers';
import { exerciseDatabase } from '../data/exerciseDatabase.ts';

// Pure renderer helpers for ExportPlan

/**
 * Determines if a PatientEjercicio represents a cardio exercise.
 * Mirrors isCardioRow logic exactly: if subtipo is explicitly 'normal',
 * returns false immediately (editor override must win).
 */
const isExportCardio = (ex: any): boolean => {
  const subtipo = String(ex?.subtipo || '').toLowerCase();
  if (subtipo === 'cardio') return true;
  if (subtipo === 'normal') return false;
  // Fallback to auto-detection via musculo
  const musculo = String(ex?.musculo || '').toLowerCase();
  if (musculo.startsWith('cardio')) return true;
  // Database lookup
  const nombre = String(ex?.nombre || '').trim();
  if (nombre) {
    const match = exerciseDatabase.find((e) => e.nombre.toLowerCase() === nombre.toLowerCase());
    if (match) return String(match.musculo || '').toLowerCase().startsWith('cardio');
  }
  // Fallback: reps contains time-based value (e.g. "20 MIN")
  const reps = String(ex?.reps || '').toLowerCase();
  if (reps.includes('min')) return true;
  return false;
};

export const renderFoodItem = (food, isLast, esc) => {
  const badge = getFoodGroupBadge(food, esc);
  const qty = formatQuantity(food);
  return `
    <div style="display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:${!isLast ? '1px solid #F3F4F6' : 'none'};flex-wrap:wrap">
      <div style="font-size:10px;color:#6B7280;font-weight:600;min-width:70px;flex-shrink:0">${qty}</div>
      <div style="flex:1;min-width:0;display:flex;align-items:center;gap:4px;flex-wrap:wrap">
        <span style="font-size:10px;font-weight:700;color:#0D2640;line-height:1.3">${esc(food.name || '')}</span>
        ${badge}
      </div>
      <div style="font-size:10px;color:#6B7280;font-weight:700;white-space:nowrap;flex-shrink:0;margin-left:auto">${food.kcal || '0'} kcal</div>
    </div>
  `;
};

export const renderFoodList = (foods, esc) => {
  if (!foods || !foods.length) return '';
  return foods.map((f, idx) => renderFoodItem(f, idx === foods.length - 1, esc)).join('');
};

export const renderMenu = (menu, idx, total, renderFoodListFn, esc) => {
  const alimentos = (menu.alimentos || []).map(a => a).filter(a => a && String(a.name || '').trim() !== '');
  if (!alimentos.length) return '';
  return `
    <div style="margin-bottom:8px">
      <div style="font-size:11px;font-weight:700;color:#0D2640;margin-bottom:6px">${esc(menu.name || '')}</div>
      ${renderFoodListFn(alimentos, esc)}
    </div>
  `;
};

export const renderArmar = (normalizedMeal, meals, renderFoodListFn, esc) => {
  // normalizedMeal contains foods already normalized
  const foods = meals.flatMap(m => m.foods || []).filter(f => f && String(f.name || '').trim() !== '');
  if (!foods.length) return '';
  // group by some simple logic if needed; for now render as food list
  return renderFoodListFn(foods, esc);
};

// Detailed 'Armar' renderer that includes grouping labels and colors
export const renderArmarDetailed = (normalizedMeal, meals, renderFoodListFn, esc) => {
  const foods = meals.flatMap(m => m.foods || []).filter(f => f && String(f.name || '').trim() !== '');
  if (!foods.length) return '';

  const grupos = foods.reduce((acc, f) => {
    const g = f.grupo || 'otros';
    if (!acc[g]) acc[g] = [];
    acc[g].push(f);
    return acc;
  }, {});

  const GRUPO_LABELS = {
    proteinas: 'PROTEÍNAS',
    carbohidratos: 'CARBOHIDRATOS',
    grasas: 'GRASAS',
    lacteos: 'LÁCTEOS',
    verduras: 'VERDURAS',
    frutas: 'FRUTAS',
    otros: 'OTROS',
  };
  const GRUPO_COLORS = {
    proteinas: '#0066CC',
    carbohidratos: '#2E9E70',
    grasas: '#CC6600',
    lacteos: '#0D2640',
    verduras: '#2E9E70',
    frutas: '#CC6600',
    otros: '#6B7280',
  };
  const badge = (text) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:999px;background:#0066CC;color:#fff;font-size:8px;font-weight:800;flex-shrink:0">${esc(text)}</span>`;
  const macroPill = (text, color) => `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:999px;background:${color};color:#fff;font-size:9px;font-weight:700;white-space:nowrap"><span style="display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px;border-radius:999px;background:rgba(255,255,255,0.2);color:#fff;font-size:7px;font-weight:800">1</span>${esc(text)}</span>`;

  return `<div style="font-size:10px;color:#0D2640;margin-bottom:8px;line-height:1.4">Elige ${macroPill('Proteína', '#0066CC')} + ${macroPill('Carbohidrato', '#2E9E70')} + ${macroPill('Grasa', '#CC6600')}</div>` + Object.entries(grupos).map(([grupo, items]) => {
    const label = GRUPO_LABELS[grupo] || grupo.toUpperCase();
    const color = GRUPO_COLORS[grupo] || '#6B7280';
    return `
      <div style="font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${color};margin-bottom:4px;margin-top:6px">${esc(label)}</div>
      ${renderFoodListFn(items, esc)}
    `;
  }).join('');
};

// Render supplements section as a single collapsible card
export const renderSupplementsHTML = (daySupps, supplementDatabase, esc) => {
  const totalSupps = (daySupps || []).length;
  if (!totalSupps) return '';

  const HORARIO_COLORS: Record<string, string> = {
    'MAÑANA': '#0066CC',
    'TARDE': '#CC6600',
    'NOCHE': '#0D2640',
    'PRE ENTRENO': '#2E9E70',
    'INTRA ENTRENO': '#6B7280',
    'POST ENTRENO': '#DC2626',
    'SIN HORARIO': '#9CA3AF',
  };

  const grouped = {};
  (daySupps || []).forEach(s => {
    const key = s.horario || s.hora || 'SIN HORARIO';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });

  const groupsHTML = Object.entries(grouped).map(([horario, sups]) => {
    const color = HORARIO_COLORS[horario] || '#6B7280';
    return `
      <div style="margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
          <span style="font-size:9px;font-weight:800;padding:3px 8px;border-radius:999px;background:${color};color:#fff;white-space:nowrap">${esc(horario.toUpperCase())}</span>
          <span style="font-size:10px;font-weight:700;color:#6B7280">${sups.length} suplemento${sups.length !== 1 ? 's' : ''}</span>
        </div>
        ${sups.map((sup, idx) => {
          const qty = formatSupplementQty(sup, supplementDatabase);
          const tipo = sup.tipo ? `<span style="font-size:8px;font-weight:800;padding:2px 6px;border-radius:999px;background:#F3F4F6;color:#6B7280;text-transform:uppercase">${esc(sup.tipo)}</span>` : '';
          const marca = sup.marca ? `<span style="font-size:9px;color:#6B7280;font-weight:600">${esc(sup.marca)}</span>` : '';
          return `
            <div style="display:grid;grid-template-columns:auto 1fr auto;gap:6px;align-items:center;padding:6px 0;border-bottom:${idx < sups.length - 1 ? '1px solid #F3F4F6' : 'none'}">
              <div style="font-size:10px;color:#6B7280;font-weight:600">${qty || '—'}</div>
              <div style="font-size:10px;font-weight:700;color:#0D2640;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(sup.nombre || sup.suplemento || '')}</div>
              <div style="display:flex;align-items:center;gap:4px;justify-content:flex-end">
                ${tipo}
                ${marca}
              </div>
            </div>
            ${sup.notas || sup.tomarCon || sup.frecuencia || sup.tiempo ? `
              <div style="font-size:10px;color:#6B7280;margin-top:2px;line-height:1.4">
                ${sup.notas ? `<div style="font-style:italic">${esc(sup.notas)}</div>` : ''}
                ${sup.tomarCon ? `<div>Tomar con: <b>${esc(sup.tomarCon)}</b></div>` : ''}
                ${sup.frecuencia ? `<div>Frecuencia: <b>${esc(sup.frecuencia)}</b></div>` : ''}
                ${sup.tiempo ? `<div>Tiempo: <b>${esc(sup.tiempo)}</b></div>` : ''}
              </div>
            ` : ''}
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  return `
    <details class="card-collapsible">
      <summary style="padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px">
        <span style="display:flex;align-items:center;gap:6px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5L3.5 13.5C2.5 12.5 2.5 10.5 3.5 9.5L9.5 3.5C10.5 2.5 12.5 2.5 13.5 3.5L20.5 10.5C21.5 11.5 21.5 13.5 20.5 14.5L14.5 20.5C13.5 11.5 10.5 20.5Z"></path><path d="M8.5 12.5L15.5 5.5"></path></svg>
          Suplementos
        </span>
        <span style="font-size:10px;color:#6B7280;font-weight:700">${totalSupps} suplemento${totalSupps !== 1 ? 's' : ''} ▼</span>
      </summary>
      <div class="card-content">
        ${groupsHTML}
      </div>
    </details>
  `;
};

// Render tratamiento deportivo (metrics and estrategia)
export const renderTratamientoDeportivo = ({ tEntre, dias, cardio, volumen, COLORS, esc, metricCard }) => {
  const hasStrategy = !!(tEntre?.estrategia && tEntre.estrategia !== '-');
  const hasDias = !!dias && dias !== '-';
  const hasVolumen = !!volumen && volumen !== '-';

  if (!hasStrategy && !hasDias && !hasVolumen) return '';

  return `
    <div style="margin-bottom:16px">
      ${tEntre?.estrategia ? `<div class="strategy-card strategy-card--navy"><span style="font-size:8px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);display:block;margin-bottom:4px">ESTRATEGIA</span><span style="font-size:14px;font-weight:800;color:#fff">${esc(tEntre.estrategia)}</span></div>` : ''}
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        ${metricCard('DÍAS', String(dias || '—'), COLORS.blue, '', 'Meta semanal')}
        ${metricCard('CARDIO', String(cardio || '—'), COLORS.green, '', 'Sesiones')}
        ${metricCard('VOLUMEN', String(volumen || '—'), COLORS.navy, '', 'Series totales')}
      </div>
    </div>
  `;
};

// Render info nutricional
export const renderInfoNutricional = ({ tNutri, meals, getMealTotalKcal, getMealTotalMacros, COLORS, esc, metricCard }) => {
  const totalKcalFromMeals = (meals || []).reduce((sum, m) => sum + getMealTotalKcal(m), 0);
  const totalMacrosFromMeals = (meals || []).reduce((acc, m) => {
    const mt = getMealTotalMacros(m);
    acc.p += mt.p || 0;
    acc.c += mt.c || 0;
    acc.g += mt.g || 0;
    return acc;
  }, { p: 0, c: 0, g: 0 });

  const effectiveKcal = tNutri?.kcal && tNutri.kcal !== '-' ? Number(tNutri.kcal) : totalKcalFromMeals;
  const effectiveProte = tNutri?.proteina && tNutri.proteina !== '-' ? Number(tNutri.proteina) : totalMacrosFromMeals.p;
  const effectiveCarbs = tNutri?.carbos && tNutri.carbos !== '-' ? Number(tNutri.carbos) : totalMacrosFromMeals.c;
  const effectiveGrasas = tNutri?.grasas && tNutri.grasas !== '-' ? Number(tNutri.grasas) : totalMacrosFromMeals.g;

  const hasData = effectiveKcal > 0 || effectiveProte > 0 || effectiveCarbs > 0 || effectiveGrasas > 0;
  if (!hasData) return '';
  return `
    <div style="margin-bottom:16px">
      ${tNutri?.estrategia ? `<div class="strategy-card strategy-card--green"><span style="font-size:8px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);display:block;margin-bottom:4px">ESTRATEGIA</span><span style="font-size:14px;font-weight:800;color:#fff">${esc(tNutri.estrategia)}</span></div>` : ''}
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px">
        ${effectiveKcal ? metricCard('KCAL', effectiveKcal, COLORS.navy) : ''}
        ${effectiveProte ? metricCard('PROTEÍNA', effectiveProte + 'P', COLORS.blue) : ''}
        ${effectiveCarbs ? metricCard('CARBO', effectiveCarbs + 'C', COLORS.green) : ''}
        ${effectiveGrasas ? metricCard('GRASAS', effectiveGrasas + 'G', '#CC6600') : ''}
      </div>
    </div>
  `;
};

// Render calendario semanal
import { groupExercisesBySequence, bloqueColor, formatRest } from './exportHelpers';
import { exerciseDatabase } from '../data/exerciseDatabase';
import { getDayType } from '../utils/dayType';

export const renderCalendario = ({ calendar, routines, esc }) => {
  const days = [
    { label: 'LUN', key: 'monday', dia: 'LUNES' },
    { label: 'MAR', key: 'tuesday', dia: 'MARTES' },
    { label: 'MIE', key: 'wednesday', dia: 'MIÉRCOLES' },
    { label: 'JUE', key: 'thursday', dia: 'JUEVES' },
    { label: 'VIE', key: 'friday', dia: 'VIERNES' },
    { label: 'SAB', key: 'saturday', dia: 'SÁBADO' },
    { label: 'DOM', key: 'sunday', dia: 'DOMINGO' },
  ];
  const todayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];
  const calendarMap = Array.isArray(calendar) ? calendar.reduce((acc, c) => {
    if (c && typeof c === 'object') acc[c.dayKey || c.dia] = c;
    return acc;
  }, {}) : {};

  const dayDetails = (dayLabel, dayKey, dia) => {
    const calDay = calendarMap[dia];
    const r = routines[dayKey] || { actividad: '', fases: [] };
    const actividad = calDay?.actividad || r.actividad || '';
    const tipo = getDayType(actividad);
    const tipoLabel = tipo === 'lower' ? 'Lower' : tipo === 'upper' ? 'Upper' : tipo === 'rest' ? 'Descanso' : 'Full';
    const isToday = dayKey === todayKey;
    const ejercicios = (r.fases || [])
      .filter(fase => !['CG', 'ED', 'CE'].includes(fase.id))
      .flatMap(fase => (fase.bloques || []).flatMap(bloque => (bloque.ejercicios || []).map((ex, i) => ({
        ...ex,
        tipo: ex.tipo || bloque.tipo || ex.blockSerie || ex.serie || '',
        indicacion: bloque.indicacion || '',
        prescripcion: ex.prescripcion || '',
        grupo: fase.grupo,
        faseNombre: fase.nombre,
        faseId: fase.id,
      }))));
    const hasCardio = ejercicios.some((ex) => isExportCardio(ex));

    const renderEjercicioRow = (ex, exIdx, total) => {
      const seq = (ex.codigo || ex.secuencia || '').trim();
      const displayCode = seq || '—';
      const isLastEj = exIdx === total - 1;
      const s1 = ex.s1 || ex.semana1 || '';
      const s2 = ex.s2 || ex.semana2 || '';
      const s3 = ex.s3 || ex.semana3 || '';
      const s4 = ex.s4 || ex.semana4 || '';
      const reps = ex.reps || '';
      const rawDescanso = ex.descanso || '';
      const descanso = rawDescanso ? formatRest(rawDescanso) : '';
      const isAprox = ex.faseId === 'SA' || (ex.categoria || '').toLowerCase() === 'aprox' || /\(\d+%\)/.test(ex.nombre || '');
      const tecnica = isAprox ? '' : (ex.tecnica || '');
      const rir = ex.rir || '';
      const infoLine = (reps || descanso || tecnica || rir) ? `<div style="font-size:9px;color:#6B7280;margin-top:1px">${reps ? `<b>${esc(reps)}</b> reps` : ''}${reps && (descanso || tecnica || rir) ? ' • ' : ''}${descanso ? `<b>${esc(descanso)}</b> descanso` : ''}${descanso && (tecnica || rir) ? ' • ' : ''}${tecnica ? `${esc(tecnica)}` : ''}${tecnica && rir ? ' • ' : ''}${rir ? `<b>${esc(rir)}</b>` : ''}</div>` : '';
      const pctMatch = (ex.nombre || '').match(/(\d+%)/);
      const cleanName = (ex.nombre || '').replace(/\s*\(\d+%\)\s*/, '').trim();
      const aproxPct = isAprox ? (pctMatch ? pctMatch[1].replace('%','') : (ex.porcentaje || ex.aproxPorcentaje || '')) : '';
      const aproxBadge = isAprox ? `<span style="font-size:8px;font-weight:700;color:#0D2640;background:#E5E7EB;padding:1px 6px;border-radius:999px;margin-right:4px">Aprox ${aproxPct}% peso</span>` : '';
      const db = exerciseDatabase.find((e) => e.nombre.toLowerCase() === (ex.nombre || '').toLowerCase());
      const customNote = ex.notas || '';
      const dbNote = db?.nota || '';
      const noteLine = customNote || dbNote ? `<div style="font-size:9px;color:#6B7280;margin-top:1px;font-style:italic">${esc(customNote || dbNote)}</div>` : '';
      const musculo = ex.musculo || '';
      const movimiento = ex.movimiento || '';
      const musculoMovimientoLine = (musculo || movimiento) ? `<div style="font-size:9px;color:#6B7280;margin-top:1px">${musculo ? `<b>${esc(musculo)}</b>` : ''}${musculo && movimiento ? ' · ' : ''}${movimiento ? `${esc(movimiento)}` : ''}</div>` : '';
      const isCardio = isExportCardio(ex);
      const badgeBg = isCardio ? '#2E9E70' : '#0D2640';
      const pesoLine = ex.peso ? `<div style="font-size:9px;color:#6B7280;margin-top:1px"><b>${esc(ex.peso)}</b></div>` : '';
      const videoLine = ex.video && ex.video !== '-' && ex.video !== '_' ? `<div style="font-size:9px;color:#0066CC;margin-top:1px">🎬 Video</div>` : '';

      const formatSemanas = (s1, s2, s3, s4) => {
        const arr = [s1, s2, s3, s4].map(v => parseInt(v, 10) || 0);
        const todosIguales = arr.every(v => v === arr[0]);
        if (todosIguales) return `Sem 1-4: <b>${arr[0]} sets</b>`;
        return `Sem 1: <b>${s1} sets</b> • Sem 2: <b>${s2} sets</b> • Sem 3: <b>${s3} sets</b> • Sem 4: <b>${s4} sets</b>`;
      };

      const hasWeeks = (s1 || s2 || s3 || s4);
      const weeksLine = hasWeeks ? `<div style="font-size:9px;color:#6B7280;margin-top:1px">${formatSemanas(s1, s2, s3, s4)}</div>` : '';

      return `
        <div style="display:flex;align-items:flex-start;gap:6px;padding:4px 0;border-bottom:${!isLastEj ? '1px solid #F3F4F6' : 'none'}">
          <span style="width:16px;height:16px;border-radius:999px;background:${badgeBg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:800;flex-shrink:0">${esc(displayCode)}</span>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap">
              ${aproxBadge}
              <span style="font-size:10px;font-weight:700;color:#0D2640;line-height:1.3">${esc(cleanName || '—')}</span>
            </div>
            ${musculoMovimientoLine}
            ${pesoLine}
            ${videoLine}
            ${weeksLine}
            ${infoLine}
            ${noteLine}
          </div>
        </div>
      `;
    };

    // Group exercises by fase (phase) first, preserving phase order from the routine's fases array
    const fasesOrder = (r.fases || []).filter(f => !['CG', 'ED', 'CE'].includes(f.id));
    const ejerciciosByFase = fasesOrder.map(fase => {
      const items = (fase.bloques || []).flatMap(b => (b.ejercicios || []).map((ex) => ({
        ...ex,
        tipo: b.tipo || ex.tipo || '',
        indicacion: b.indicacion || ex.indicacion || '',
        prescripcion: ex.prescripcion || '',
        grupo: fase.grupo,
        faseNombre: fase.nombre,
        faseId: fase.id,
      })));
      return { fase, items };
    });

    return `
      <details id="dia-${dayKey}" class="card-collapsible day-details">
        <summary style="padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:9px;font-weight:800;padding:3px 10px;border-radius:999px;background:#0066CC;color:#fff;white-space:nowrap">${dayLabel}</span>
            <span style="display:flex;align-items:center;gap:4px">${esc(r.actividad || tipoLabel)}</span>
            ${hasCardio ? `<span style="font-size:9px;font-weight:800;padding:2px 8px;border-radius:999px;background:#2E9E70;color:#fff;white-space:nowrap">+ cardio</span>` : ''}
          </div>
          <span style="font-size:10px;color:#6B7280;font-weight:700">${ejercicios.length} ejercicios ▼</span>
        </summary>
         <div style="padding:8px 12px 0 12px;display:flex;gap:8px;align-items:center">
            <span style="font-size:9px;font-weight:700;color:#6B7280;background:#F3F4F6;padding:3px 8px;border-radius:999px">${ejerciciosByFase.reduce((s, f) => s + f.items.length, 0)} ejercicios</span>
            <span style="font-size:9px;font-weight:700;color:#6B7280;background:#F3F4F6;padding:3px 8px;border-radius:999px">${ejerciciosByFase.reduce((s, f) => s + (groupExercisesBySequence(f.items).length), 0)} bloques</span>
         </div>
         <div class="card-content">
            ${(() => {
              const parts = [];

              ejerciciosByFase.forEach(({ fase, items }, faseIdx) => {
                if (!items || !items.length) return;
                const bloquesForFase = groupExercisesBySequence(items);
                // Phase header
                parts.push(`<div style="font-size:11px;font-weight:800;color:#0D2640;margin-top:${faseIdx > 0 ? '10px' : '0'};margin-bottom:6px">${esc(fase.nombre || fase.grupo || '')}</div>`);

                const normalBloques = bloquesForFase.filter((b) => (b.ejercicios || []).every((ex) => !isExportCardio(ex)));
                const cardioBloques = bloquesForFase.filter((b) => (b.ejercicios || []).some((ex) => isExportCardio(ex)));

                if (normalBloques.length) {
                  parts.push(`<div style="margin-top:0">${normalBloques.map((bloque, bIdx) => {
                    const color = bloqueColor(bloque.tipo);
                    const isMulti = Boolean(bloque.tipo);
                    const aproxEjs = (bloque.ejercicios || []).filter((ex) => ex.faseId === 'SA');
                    const otrosEjs = (bloque.ejercicios || []).filter((ex) => ex.faseId !== 'SA');
                    return `
                      <div style="margin-bottom:${bIdx > 0 ? '8px' : '0'};padding-top:${bIdx > 0 ? '6px' : '0'}">
                         <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;opacity:.7">
                           <span style="width:14px;height:14px;border-radius:999px;background:#0D2640;color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;flex-shrink:0">${esc(bloque.letra)}</span>
                           <span style="font-size:8px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0D2640">${esc(bloque.tipo || 'BLOQUE')}</span>
                         </div>
                        <div style="${isMulti ? 'margin-left:10px;border-left:1px solid #F3F4F6;padding-left:8px' : ''}">
                           ${aproxEjs.length ? aproxEjs.map((ex, exIdx) => renderEjercicioRow(ex, exIdx, aproxEjs.length)).join('') + `<div style="height:6px"></div>` : ''}
                          ${otrosEjs.map((ex, exIdx) => renderEjercicioRow(ex, exIdx, otrosEjs.length)).join('')}
                        </div>
                      </div>
                    `;
                  }).join('')}</div>`);
                }

                if (cardioBloques.length) {
                  parts.push(`${cardioBloques.map((bloque, bIdx) => {
                    const isMulti = Boolean(bloque.tipo);
                    return `
                      <div style="margin-top:${normalBloques.length && bIdx === 0 ? '8px' : '0'};padding-top:${bIdx > 0 ? '6px' : '0'}">
                         <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">
                            <span style="width:14px;height:14px;border-radius:999px;background:#2E9E70;color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;flex-shrink:0">C</span>
                            <span style="font-size:8px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2E9E70">CARDIO</span>
                         </div>
                         <div style="${isMulti ? 'margin-left:10px;border-left:1px solid #D1FAE5;padding-left:8px' : ''}">
                           ${bloque.ejercicios.map((ex, exIdx) => renderEjercicioRow(ex, exIdx, bloque.ejercicios.length)).join('')}
                         </div>
                      </div>
                    `;
                  }).join('')}`);
                }
              });

              return parts.join('');
            })()}
        </div>
      </details>
    `;
  };

  return `
    ${days.map(d => dayDetails(d.label, d.key, d.dia)).join('')}
  `;
};
