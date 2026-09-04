import { useMemo, useCallback } from 'react';
import { ejToDisplay, displayToEj, getCombinedSections } from '../utils/routineHelpers.ts';
import { DESCANSOS_OPTIONS } from '../components/exerciseTableColumns.tsx';
import type { WarmupExercise, EditorExerciseDisplay } from '../core/types.ts';

export interface UseWarmupDataReturn {
  warmupGeneralSections: EditorExerciseDisplay[];
  warmupUpperSections: EditorExerciseDisplay[];
  warmupLowerSections: EditorExerciseDisplay[];
  warmupGeneralGroups: Record<string, any>;
  warmupUpperGroups: Record<string, any>;
  warmupLowerGroups: Record<string, any>;
  addBlockByType: (grupo: 'general' | 'upper' | 'lower', tipo: string) => void;
  addToBlock: (grupo: 'general' | 'upper' | 'lower', blockLetter: string) => void;
  removeBlock: (grupo: 'general' | 'upper' | 'lower', blockLetter: string) => void;
  addExercise: (grupo: 'general' | 'upper' | 'lower', blockLetter?: string) => void;
  update: (uid: string, field: string, val: any) => void;
  remove: (uid: string) => void;
  reorder: (fromUid: string, toUid: string) => void;
  reorderBlock: (grupo: 'general' | 'upper' | 'lower', fromLetter: string, toLetter: string, direction: 'up' | 'down') => void;
}

function warmupToDisplay(ej: WarmupExercise): EditorExerciseDisplay {
  const pausaRaw = ej.descanso ?? ej.pausa ?? '';
  const matchedPause = DESCANSOS_OPTIONS.find((d) => d.label === pausaRaw);
  const descanso = matchedPause ? matchedPause.value : pausaRaw;
  return ejToDisplay({
    ...ej,
    descanso,
    tipo: ej.tipo || 'Simple',
    serie: ej.blockSerie || ej.tipo || 'Simple',
  });
}

function warmupDisplayToEj(d: EditorExerciseDisplay): WarmupExercise {
  return {
    uid: d.uid,
    tipo: d.tipo || 'Simple',
    ejercicio: d.ejercicio || '',
    sets: d.sets || '',
    reps: d.reps || '',
    pausa: d.descanso || d.pausa || '',
    notas: d.notas || '',
    video: d.video || '_',
    grupo: d.grupo || 'general',
    blockLetter: d.blockLetter || '',
    blockSerie: d.blockSerie || 'Simple',
    blockPosition: d.blockPosition || 0,
    musculo: d.musculo || '',
    movimiento: d.movimiento || '',
  };
}

function syncWarmupBlockMetadata(items: WarmupExercise[]): WarmupExercise[] {
  const display = items.map(warmupToDisplay);
  const recalculated = getCombinedSections(display);
  return recalculated.map(warmupDisplayToEj);
}

function getNextBlockLetter(items: EditorExerciseDisplay[]): string {
  const usedLetters = new Set(items.map(b => b.blockLetter).filter((l): l is string => Boolean(l)));
  let letter = 'A';
  while (usedLetters.has(letter)) {
    letter = String.fromCharCode(letter.charCodeAt(0) + 1);
  }
  return letter;
}

export default function useWarmupData(
  warmup: WarmupExercise[],
  setWarmup: (value: WarmupExercise[]) => void,
  showToast: (msg: string) => void
): UseWarmupDataReturn {
  const warmupGeneralSections = useMemo(() => {
    const items = warmup.filter((w) => w.grupo === 'general');
    return items.map(warmupToDisplay);
  }, [warmup]);

  const warmupUpperSections = useMemo(() => {
    const items = warmup.filter((w) => w.grupo === 'upper');
    return items.map(warmupToDisplay);
  }, [warmup]);

  const warmupLowerSections = useMemo(() => {
    const items = warmup.filter((w) => w.grupo === 'lower');
    return items.map(warmupToDisplay);
  }, [warmup]);

  const warmupGeneralGroups = useMemo(() => {
    const groups: Record<string, any> = {};
    warmupGeneralSections.forEach((s) => {
      const letter = s.blockLetter || 'A';
      const isCardio = s.tipo === 'cardio' || s.musculo?.toLowerCase().startsWith('cardio');
      groups[letter] = {
        label: isCardio ? `${letter} CARDIO` : `BLOQUE ${letter}`,
        color: isCardio ? 'var(--color-green)' : 'var(--color-navy)',
        className: 'routine-group-header',
        isCardio,
      };
    });
    return groups;
  }, [warmupGeneralSections]);

  const warmupUpperGroups = useMemo(() => {
    const groups: Record<string, any> = {};
    warmupUpperSections.forEach((s) => {
      const letter = s.blockLetter || 'A';
      const isCardio = s.tipo === 'cardio' || s.musculo?.toLowerCase().startsWith('cardio');
      groups[letter] = {
        label: isCardio ? `${letter} CARDIO` : `BLOQUE ${letter}`,
        color: isCardio ? 'var(--color-green)' : 'var(--color-navy)',
        className: 'routine-group-header',
        isCardio,
      };
    });
    return groups;
  }, [warmupUpperSections]);

  const warmupLowerGroups = useMemo(() => {
    const groups: Record<string, any> = {};
    warmupLowerSections.forEach((s) => {
      const letter = s.blockLetter || 'A';
      const isCardio = s.tipo === 'cardio' || s.musculo?.toLowerCase().startsWith('cardio');
      groups[letter] = {
        label: isCardio ? `${letter} CARDIO` : `BLOQUE ${letter}`,
        color: isCardio ? 'var(--color-green)' : 'var(--color-navy)',
        className: 'routine-group-header',
        isCardio,
      };
    });
    return groups;
  }, [warmupLowerSections]);

  const update = useCallback((uid: string, field: string, val: any) => {
    const mapField = (f: string): string => {
      if (f === 'serie') return 'blockSerie';
      if (f === 'descanso') return 'pausa';
      return f;
    };
    const f = mapField(field);
    setWarmup((prev) => {
      const next = prev.map((item) =>
        item.uid === uid
          ? { ...item, [f]: val, ...(f === 'blockSerie' ? { tipo: val } : {}) }
          : item
      );
      const grupo = prev.find((i) => i.uid === uid)?.grupo || 'general';
      const filtered = next.filter((w) => w.grupo === grupo);
      const synced = syncWarmupBlockMetadata(filtered);
      const rest = next.filter((w) => w.grupo !== grupo);
      return [...rest, ...synced];
    });
  }, [setWarmup]);

  const remove = useCallback((uid: string) => {
    setWarmup((prev) => {
      const grupo = prev.find((i) => i.uid === uid)?.grupo || 'general';
      const filtered = prev.filter((item) => item.uid !== uid);
      const synced = syncWarmupBlockMetadata(filtered.filter((w) => w.grupo === grupo));
      const rest = filtered.filter((w) => w.grupo !== grupo);
      return [...rest, ...synced];
    });
    showToast('Ejercicio eliminado');
  }, [setWarmup, showToast]);

  const reorder = useCallback((fromUid: string, toUid: string) => {
    setWarmup((prev) => {
      const fromIdx = prev.findIndex((i) => i.uid === fromUid);
      const toIdx = prev.findIndex((i) => i.uid === toUid);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, [setWarmup]);

  const addExercise = useCallback((grupo: 'general' | 'upper' | 'lower', blockLetter?: string) => {
    const newItem: WarmupExercise = {
      uid: 'wk-' + Math.random().toString(36).slice(2),
      tipo: 'Simple',
      ejercicio: '',
      sets: '',
      reps: '',
      pausa: '',
      notas: '',
      video: '_',
      grupo,
      blockLetter: blockLetter || '',
      blockSerie: 'Simple',
      blockPosition: 0,
      musculo: '',
      movimiento: '',
    };
    setWarmup((prev) => {
      const next = [...prev, newItem];
      const synced = syncWarmupBlockMetadata(next.filter((w) => w.grupo === grupo));
      const rest = next.filter((w) => w.grupo !== grupo);
      return [...rest, ...synced];
    });
    showToast('Ejercicio agregado');
  }, [setWarmup, showToast]);

  const addBlockByType = useCallback((grupo: 'general' | 'upper' | 'lower', tipo: string) => {
    setWarmup((prev) => {
      const current = prev.filter((w) => w.grupo === grupo).map(warmupToDisplay);
      const nextLetter = getNextBlockLetter(current);
      const count = tipo === 'Simple' ? 1 : tipo === 'Biserie' ? 2 : tipo === 'Triserie' ? 3 : tipo === 'Circuito' ? 4 : 1;
      const newOnes: EditorExerciseDisplay[] = [];
      for (let i = 0; i < count; i++) {
        newOnes.push({
          ...warmupToDisplay({ uid: 'wk-' + Math.random().toString(36).slice(2) } as WarmupExercise),
          serie: tipo,
          blockSerie: tipo,
          blockLetter: nextLetter,
          blockPosition: i + 1,
          grupo,
        });
      }
      const next = [...current, ...newOnes];
      const synced = syncWarmupBlockMetadata(next.map(warmupDisplayToEj));
      const rest = prev.filter((w) => w.grupo !== grupo);
      return [...rest, ...synced];
    });
    showToast(`Bloque ${tipo} agregado`);
  }, [setWarmup, showToast]);

  const addToBlock = useCallback((grupo: 'general' | 'upper' | 'lower', blockLetter: string) => {
    setWarmup((prev) => {
      const current = prev.filter((w) => w.grupo === grupo && w.blockLetter === blockLetter).map(warmupToDisplay);
      const lastBlockSerie = current.length > 0 ? (current[current.length - 1].blockSerie || 'Simple') : 'Simple';
      const newEj = {
        ...warmupToDisplay({ uid: 'wk-' + Math.random().toString(36).slice(2) } as WarmupExercise),
        serie: lastBlockSerie,
        blockSerie: lastBlockSerie,
        blockLetter,
        grupo,
      };
      const next = [...current, newEj];
      const synced = syncWarmupBlockMetadata(next.map(warmupDisplayToEj));
      const rest = prev.filter((w) => w.grupo !== grupo);
      return [...rest, ...synced];
    });
    showToast('Ejercicio agregado al bloque');
  }, [setWarmup, showToast]);

  const removeBlock = useCallback((grupo: 'general' | 'upper' | 'lower', blockLetter: string) => {
    setWarmup((prev) => {
      const filtered = prev.filter((w) => !(w.grupo === grupo && w.blockLetter === blockLetter));
      const synced = syncWarmupBlockMetadata(filtered.filter((w) => w.grupo === grupo));
      const rest = filtered.filter((w) => w.grupo !== grupo);
      return [...rest, ...synced];
    });
    showToast('Bloque eliminado');
  }, [setWarmup, showToast]);

  const reorderBlock = useCallback((grupo: 'general' | 'upper' | 'lower', fromLetter: string, toLetter: string, direction: 'up' | 'down') => {
    setWarmup((prev) => {
      const items = prev.filter((w) => w.grupo === grupo).map(warmupToDisplay);
      const order: string[] = [];
      const seen = new Set<string>();
      items.forEach((it) => {
        const l = it.blockLetter;
        if (l && !seen.has(l)) {
          seen.add(l);
          order.push(l);
        }
      });
      if (!order.includes(fromLetter) || !order.includes(toLetter) || fromLetter === toLetter) return prev;
      const newOrder = order.filter((l) => l !== fromLetter);
      const ti = newOrder.indexOf(toLetter);
      const insertAt = direction === 'up' ? ti : ti + 1;
      newOrder.splice(insertAt, 0, fromLetter);
      const byLetter: Record<string, EditorExerciseDisplay[]> = {};
      items.forEach((it) => {
        byLetter[it.blockLetter] = byLetter[it.blockLetter] || [];
        byLetter[it.blockLetter].push(it);
      });
      const next = newOrder.flatMap((l) => byLetter[l] || []);
      const synced = syncWarmupBlockMetadata(next.map(warmupDisplayToEj));
      const rest = prev.filter((w) => w.grupo !== grupo);
      return [...rest, ...synced];
    });
  }, [setWarmup]);

  return {
    warmupGeneralSections,
    warmupUpperSections,
    warmupLowerSections,
    warmupGeneralGroups,
    warmupUpperGroups,
    warmupLowerGroups,
    addBlockByType,
    addToBlock,
    removeBlock,
    addExercise,
    update,
    remove,
    reorder,
    reorderBlock,
  };
}
