import { useState, useMemo, useCallback } from 'react';
import { ejToDisplay, displayToEj, getCombinedSections } from '../utils/routineHelpers.ts';
import type { EditorRoutineExercise, EditorExerciseDisplay, WarmupRow, CalendarDay } from '../core/types.ts';

const syncBlockMetadata = (exercises: EditorRoutineExercise[]): EditorRoutineExercise[] => {
  const display = exercises.map((ej) => ejToDisplay(ej));
  const baseMap = new Map(display.filter((d) => d.esBase).map((d) => [d.uid, d]));
  const recalculated = getCombinedSections(
    display.map((d) => {
      if (d.aproxBase && baseMap.has(d.aproxBase)) {
        const base = baseMap.get(d.aproxBase)!;
        return {
          ...d,
          musculo: base.musculo || d.musculo,
          movimiento: base.movimiento || d.movimiento,
        };
      }
      return d;
    })
  );
  return recalculated.map((d) => displayToEj(d));
};

export interface UseRoutineDataData {
  routines: EditorRoutineExercise[];
  activeRoutineId: string | null;
  calendar: CalendarDay[];
}

export interface UseRoutineDataSetters {
  setRoutines: (value: EditorRoutineExercise[]) => void;
  setActiveRoutineId: (value: string | null) => void;
  setCalendar: (value: CalendarDay[]) => void;
}

export interface UseRoutineDataReturn {
  active: EditorRoutineExercise | undefined;
  ejerciciosMemo: EditorExerciseDisplay[];
  sections: EditorExerciseDisplay[];
  addDay: () => void;
  duplicateActive: () => void;
  copyBlockToDay: (fromLetter: string, targetRoutineId: string) => void;
  copyDayToDay: (targetRoutineId: string) => void;
  deleteActive: () => void;
  addFila: () => void;
  addFilaBlank: () => void;
  addBlockByType: (type: string) => void;
  addToBlock: (blockLetter: string) => void;
  addExercisesGrouped: (names: string[], blockType: string) => void;
  removeBlock: (blockLetter: string) => void;
  update: (uid: string, field: string, val: any) => void;
  remove: (uid: string) => void;
  reorder: (fromUid: string, toUid: string) => void;
  reorderBlock: (fromLetter: string, toLetter: string, direction: 'up' | 'down') => void;
  getDayTotalVolume: (routine: EditorRoutineExercise[] | undefined) => string;
  getDayLabel: (diaKey: string) => string;
  handleDayClick: (diaKey: string) => void;
  handleDayBlur: (diaKey: string, value: string, originalLabel: string) => void;
  getTrainingStats: () => { dias: number; cardio: number; volumen: number };
}

export default function useRoutineData(
  data: UseRoutineDataData,
  setters: UseRoutineDataSetters,
  showToast: (msg: string) => void,
  activeGroup: string
): UseRoutineDataReturn {
  const { routines, activeRoutineId, calendar } = data;
  const { setRoutines, setActiveRoutineId, setCalendar } = setters;

  const active = activeRoutineId ? routines.find((r) => r.id === activeRoutineId) : undefined;

  const ejerciciosMemo = useMemo(() => (active?.ejercicios || []).map((ej) => ejToDisplay(ej)), [active?.ejercicios]);

  const sections = useMemo(() => getCombinedSections(ejerciciosMemo), [ejerciciosMemo]);

  const addDay = useCallback(() => {
    const newId = 'routine-' + Date.now();
    const nombre = 'NUEVO';
    setRoutines((prev) => [...prev, { id: newId, nombre, titulo: 'Nuevo día', ejercicios: [] }]);
    setActiveRoutineId(newId);
    setCalendar((prev) => {
      const idx = prev.findIndex((d) => (d.actividad || '').toLowerCase() === 'descanso');
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], actividad: nombre, routineId: newId };
        return next;
      }
      return prev;
    });
    showToast('Día agregado');
  }, [setRoutines, setActiveRoutineId, setCalendar, showToast]);

  const duplicateActive = useCallback(() => {
    if (!active) return;
    const newId = 'routine-' + Date.now();
    const copy = {
      ...active,
      id: newId,
      nombre: active.nombre + ' COPY',
      ejercicios: (active.ejercicios || []).map((ej) => ({ ...ej })),
    };
    setRoutines((prev) => [...prev, copy]);
    setCalendar((prev) => {
      const next = [...prev];
      const emptyIdx = next.findIndex((d) => !d.actividad || (d.actividad || '').toLowerCase() === 'descanso');
      if (emptyIdx >= 0) {
        next[emptyIdx] = { ...next[emptyIdx], actividad: copy.nombre, routineId: newId };
        showToast('Rutina duplicada en día libre');
      } else {
        const currentIdx = next.findIndex((d) => d.routineId === active.id);
        if (currentIdx >= 0) {
          next[currentIdx] = { ...next[currentIdx], actividad: copy.nombre, routineId: newId };
          showToast('Rutina duplicada');
        } else {
          showToast('No hay días libres para duplicar');
        }
      }
      return next;
    });
  }, [active, setRoutines, setCalendar, showToast]);

  const copyBlockToDay = useCallback((fromLetter: string, targetRoutineId: string) => {
    setRoutines((prev) => {
      const src = prev.find((r) => r.id === activeRoutineId);
      const tgt = prev.find((r) => r.id === targetRoutineId);
      if (!src || !tgt) return prev;
      const displays = (src.ejercicios || []).map((ej) => ejToDisplay(ej));
      const blockItems = displays.filter((d) => d.blockLetter === fromLetter);
      if (blockItems.length === 0) return prev;
      const uidMap = new Map<string, string>();
      blockItems.forEach((it) => uidMap.set(it.uid, 'ex-' + crypto.randomUUID()));
      const clonedEj = blockItems.map((it) => {
        const newUid = uidMap.get(it.uid) as string;
        const newAproxBase = it.aproxBase ? (uidMap.get(it.aproxBase) || null) : null;
        return displayToEj({ ...it, uid: newUid, aproxBase: newAproxBase });
      });
      const mergedEj = [...(tgt.ejercicios || []), ...clonedEj];
      return prev.map((r) =>
        r.id === targetRoutineId ? { ...r, ejercicios: syncBlockMetadata(mergedEj) } : r
      );
    });
    showToast('Bloque copiado a otro día');
  }, [activeRoutineId, setRoutines, showToast]);

  const copyDayToDay = useCallback((targetRoutineId: string) => {
    setRoutines((prev) => {
      const src = prev.find((r) => r.id === activeRoutineId);
      const tgt = prev.find((r) => r.id === targetRoutineId);
      if (!src || !tgt || src.id === tgt.id) return prev;
      const displays = (src.ejercicios || []).map((ej) => ejToDisplay(ej));
      if (displays.length === 0) return prev;
      const uidMap = new Map<string, string>();
      displays.forEach((it) => uidMap.set(it.uid, 'ex-' + crypto.randomUUID()));
      const clonedEj = displays.map((it) => {
        const newUid = uidMap.get(it.uid) as string;
        const newAproxBase = it.aproxBase ? (uidMap.get(it.aproxBase) || null) : null;
        return displayToEj({ ...it, uid: newUid, aproxBase: newAproxBase });
      });
      return prev.map((r) =>
        r.id === targetRoutineId ? { ...r, ejercicios: syncBlockMetadata(clonedEj) } : r
      );
    });
    showToast('Día copiado al día seleccionado');
  }, [activeRoutineId, setRoutines, showToast]);

  const deleteActive = useCallback(() => {
    setRoutines((prev) => {
      if (prev.length <= 1) {
        showToast('Mínimo 1 día');
        return prev;
      }
      const next = prev.filter((r) => r.id !== activeRoutineId);
      setActiveRoutineId(next[0].id);
      setCalendar((prevCal) => prevCal.map((d) => d.routineId === activeRoutineId ? { ...d, actividad: '', routineId: null } : d));
      showToast('Eliminado');
      return next;
    });
  }, [activeRoutineId, setRoutines, setActiveRoutineId, setCalendar, showToast]);

  const update = useCallback((uid: string, field: string, val: any) => {
    const STRUCTURAL_FIELDS = ['blockSerie', 'serie', 'blockLetter', 'blockPosition', 'ejercicio', 'categoria', 'aproxBase', 'esBase'];
    const isStructural = STRUCTURAL_FIELDS.includes(field);

    if (!isStructural) {
      setRoutines((prev) =>
        prev.map((r) => {
          if (r.id !== activeRoutineId) return r;
          const nextEjercicios = (r.ejercicios || []).map((ej: any) =>
            ej.uid === uid ? { ...ej, [field]: val } : ej
          );
          const updatedBase = nextEjercicios.find((ej: any) => ej.uid === uid && ej.esBase);
          if (updatedBase && (field === 'musculo' || field === 'movimiento')) {
            return {
              ...r,
              ejercicios: nextEjercicios.map((ej: any) =>
                ej.aproxBase === uid ? { ...ej, [field]: val } : ej
              ),
            };
          }
          return { ...r, ejercicios: nextEjercicios };
        })
      );
      return;
    }

    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const display = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const currentSections = getCombinedSections(display);
        const changedSection = currentSections.find((s) => s.uid === uid);
        const changedBlockLetter = changedSection?.blockLetter;

        const next = display.map((b) => (b.uid === uid ? { ...b, [field]: val } : b));

        const base = next.find((b) => b.uid === uid && b.esBase);
        if (base) {
          const aproxShareFields = ['ejercicio', 'tipo', 'reps', 'descanso', 'rir', 'tecnica', 'notas', 'musculo', 'movimiento', 'semana1', 'semana2', 'semana3', 'semana4'];
          next.forEach((b) => {
            if (b.aproxBase === uid) {
              if (field === 'peso') {
                b.peso = ((parseFloat(val) || 0) * (b.aproxPorcentaje || 100) / 100).toFixed(1);
              } else if (aproxShareFields.includes(field)) {
                b[field] = val;
              }
            }
          });
        }

        if (field === 'ejercicio') {
          const match = String(val).match(/\((\d+)%\)/);
          next.forEach((b) => {
            if (b.uid === uid) {
              if (match) {
                b.categoria = 'Aprox';
                b.aproxPorcentaje = parseInt(match[1], 10);
                b.porcentaje = parseInt(match[1], 10);
                b.serie = 'Aprox';
                b.tecnica = (b.tecnica || '').replace(/\s*\(\d+%\)\s*/,'').trim();
              } else if (b.categoria === 'Aprox' && !b.aproxBase) {
                b.categoria = 'Entreno';
                b.aproxPorcentaje = null;
                b.porcentaje = null;
                b.serie = 'Simple';
                b.tecnica = (b.tecnica || '').replace(/\s*\(\d+%\)\s*/,'').trim();
              }
            }
          });
        }

        if (field === 'blockSerie' || field === 'serie') {
          if (changedBlockLetter) {
            next.forEach((b) => {
              if (b.blockLetter === changedBlockLetter && !b.aproxBase) {
                b.blockSerie = val;
                b.serie = val;
              }
            });
          }
          return { ...r, ejercicios: syncBlockMetadata(next.map(displayToEj)) };
        }

        if (field === 'ejercicio') {
          return { ...r, ejercicios: syncBlockMetadata(next.map(displayToEj)) };
        }

        return { ...r, ejercicios: next.map(displayToEj) };
      })
    );
  }, [activeRoutineId, setRoutines]);

  const remove = useCallback((uid: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const currentBloques = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const isBase = currentBloques.find((b) => b.uid === uid)?.esBase;
        const filtered = isBase ? currentBloques.filter((b) => b.uid !== uid && b.aproxBase !== uid) : currentBloques.filter((b) => b.uid !== uid);
        return { ...r, ejercicios: syncBlockMetadata(filtered.map(displayToEj)) };
      })
    );
  }, [activeRoutineId, setRoutines]);

  const removeBlock = useCallback((blockLetter: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const currentBloques = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const uidsInBlock = new Set(currentBloques.filter(b => b.blockLetter === blockLetter).map(b => b.uid));
        const filtered = currentBloques.filter(b => !uidsInBlock.has(b.uid) && !uidsInBlock.has(b.aproxBase || ''));
        return { ...r, ejercicios: syncBlockMetadata(filtered.map(displayToEj)) };
      })
    );
    showToast('Bloque eliminado');
  }, [activeRoutineId, setRoutines, showToast]);

  const reorder = useCallback((fromUid: string, toUid: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const currentBloques = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const fromIdx = currentBloques.findIndex((b) => b.uid === fromUid);
        const toIdx = currentBloques.findIndex((b) => b.uid === toUid);
        if (fromIdx === -1 || toIdx === -1) return r;
        const next = [...currentBloques];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return { ...r, ejercicios: syncBlockMetadata(next.map(displayToEj)) };
      })
    );
  }, [activeRoutineId, setRoutines]);

  const reorderBlock = useCallback((fromLetter: string, toLetter: string, direction: 'up' | 'down') => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const items = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const order: string[] = [];
        const seen = new Set<string>();
        items.forEach((it) => {
          const l = it.blockLetter;
          if (l && !seen.has(l)) {
            seen.add(l);
            order.push(l);
          }
        });
        if (!order.includes(fromLetter) || !order.includes(toLetter) || fromLetter === toLetter) return r;
        const newOrder = order.filter((l) => l !== fromLetter);
        const ti = newOrder.indexOf(toLetter);
        const insertAt = direction === 'up' ? ti : ti + 1;
        newOrder.splice(insertAt, 0, fromLetter);
        const byLetter: Record<string, any[]> = {};
        items.forEach((it) => {
          (byLetter[it.blockLetter] = byLetter[it.blockLetter] || []).push(it);
        });
        const next = newOrder.flatMap((l) => byLetter[l] || []);
        return { ...r, ejercicios: syncBlockMetadata(next.map(displayToEj)) };
      })
    );
  }, [activeRoutineId, setRoutines]);

  const addFila = useCallback(() => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const currentBloques = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const tieneBase = currentBloques.some((b) => b.esBase);
        let nextBloques;
        if (activeGroup === 'Aprox' && !tieneBase) {
          const baseUid = 'ex-' + crypto.randomUUID();
          const baseEj = { ...ejToDisplay(null), categoria: 'Entreno', esBase: true, uid: baseUid, serie: 'Simple' };
          const aprox1 = { ...ejToDisplay(null), categoria: 'Aprox', aproxBase: baseUid, aproxPorcentaje: 50, uid: 'ex-' + crypto.randomUUID(), serie: 'Aprox' };
          const aprox2 = { ...ejToDisplay(null), categoria: 'Aprox', aproxBase: baseUid, aproxPorcentaje: 75, uid: 'ex-' + crypto.randomUUID(), serie: 'Aprox' };
          const aprox3 = { ...ejToDisplay(null), categoria: 'Aprox', aproxBase: baseUid, aproxPorcentaje: 85, uid: 'ex-' + crypto.randomUUID(), serie: 'Aprox' };
          nextBloques = [aprox1, aprox2, aprox3, baseEj, ...currentBloques];
        } else {
          const lastBlockSerie = currentBloques.length > 0 ? (currentBloques[currentBloques.length - 1].blockSerie || currentBloques[currentBloques.length - 1].serie || 'Simple') : 'Simple';
          const lastBlockLetter = currentBloques.length > 0 ? (currentBloques[currentBloques.length - 1].blockLetter || '') : '';
          nextBloques = [...currentBloques, { ...ejToDisplay(null), categoria: activeGroup, serie: activeGroup === 'Aprox' ? 'Aprox' : lastBlockSerie, blockLetter: lastBlockLetter || undefined }];
        }
        return { ...r, ejercicios: syncBlockMetadata(nextBloques.map(displayToEj)) };
      })
    );
    showToast('Ejercicio agregado');
  }, [activeRoutineId, setRoutines, activeGroup, showToast]);

  const addFilaBlank = useCallback(() => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const currentBloques = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const lastBlockSerie = currentBloques.length > 0 ? (currentBloques[currentBloques.length - 1].blockSerie || currentBloques[currentBloques.length - 1].serie || 'Simple') : 'Simple';
        const lastBlockLetter = currentBloques.length > 0 ? (currentBloques[currentBloques.length - 1].blockLetter || '') : '';
        const nextBloques = [...currentBloques, { ...ejToDisplay(null), categoria: activeGroup, serie: activeGroup === 'Aprox' ? 'Aprox' : lastBlockSerie, blockLetter: lastBlockLetter || undefined }];
        return { ...r, ejercicios: syncBlockMetadata(nextBloques.map(displayToEj)) };
      })
    );
    showToast('Ejercicio agregado');
  }, [activeRoutineId, setRoutines, activeGroup, showToast]);

  const getNextBlockLetter = (currentBloques: EditorExerciseDisplay[]): string => {
    const usedLetters = new Set(currentBloques.map(b => b.blockLetter).filter((l): l is string => Boolean(l)));
    let letter = 'A';
    while (usedLetters.has(letter)) {
      letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    }
    return letter;
  };

  const addBlockByType = useCallback((type: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const currentBloques = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const nextLetter = getNextBlockLetter(currentBloques);

        if (type === 'Simple' && currentBloques.length === 0) {
          const baseUid = 'ex-' + crypto.randomUUID();
          const baseEj = { ...ejToDisplay(null), categoria: 'Entreno', esBase: true, uid: baseUid, serie: 'Simple', blockSerie: 'Simple', blockLetter: nextLetter, blockPosition: 4 };
          const aprox1 = { ...ejToDisplay(null), categoria: 'Aprox', aproxBase: baseUid, aproxPorcentaje: 50, uid: 'ex-' + crypto.randomUUID(), serie: 'Aprox', blockSerie: 'Aprox', blockLetter: nextLetter, blockPosition: 1 };
          const aprox2 = { ...ejToDisplay(null), categoria: 'Aprox', aproxBase: baseUid, aproxPorcentaje: 75, uid: 'ex-' + crypto.randomUUID(), serie: 'Aprox', blockSerie: 'Aprox', blockLetter: nextLetter, blockPosition: 2 };
          const aprox3 = { ...ejToDisplay(null), categoria: 'Aprox', aproxBase: baseUid, aproxPorcentaje: 85, uid: 'ex-' + crypto.randomUUID(), serie: 'Aprox', blockSerie: 'Aprox', blockLetter: nextLetter, blockPosition: 3 };
          const nextBloques = [aprox1, aprox2, aprox3, baseEj];
          return { ...r, ejercicios: syncBlockMetadata(nextBloques.map(displayToEj)) };
        }

        const count = type === 'Simple' ? 1 : type === 'Biserie' ? 2 : type === 'Triserie' ? 3 : type === 'Circuito' ? 4 : 1;
        const newExercises = Array.from({ length: count }, (_, i) => ({
          ...ejToDisplay(null),
          categoria: 'Entreno',
          serie: type,
          blockSerie: type,
          blockLetter: nextLetter,
          blockPosition: i + 1,
        }));
        const nextBloques = [...currentBloques, ...newExercises];
        return { ...r, ejercicios: syncBlockMetadata(nextBloques.map(displayToEj)) };
      })
    );
    showToast(`Bloque ${type} agregado`);
  }, [activeRoutineId, setRoutines, showToast]);

  const addToBlock = useCallback((blockLetter: string) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const currentBloques = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const blockExercises = currentBloques.filter(b => b.blockLetter === blockLetter);
        const lastBlockSerie = blockExercises.length > 0 ? (blockExercises[blockExercises.length - 1].blockSerie || blockExercises[blockExercises.length - 1].serie || 'Simple') : 'Simple';
        const newEj = { ...ejToDisplay(null), categoria: activeGroup, serie: lastBlockSerie, blockSerie: lastBlockSerie, blockLetter };
        const nextBloques = [...currentBloques, newEj];
        return { ...r, ejercicios: syncBlockMetadata(nextBloques.map(displayToEj)) };
      })
    );
    showToast('Ejercicio agregado al bloque');
  }, [activeRoutineId, setRoutines, activeGroup, showToast]);

  const BLOCK_TYPE_COUNTS: Record<string, number> = {
    Simple: 1,
    Biserie: 2,
    Triserie: 3,
    Circuito: 4,
  };

  const addExercisesGrouped = useCallback((names: string[], blockType: string) => {
    if (!names || names.length === 0) return;
    const count = BLOCK_TYPE_COUNTS[blockType] || 1;
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== activeRoutineId) return r;
        const current = (r.ejercicios || []).map((ej) => ejToDisplay(ej));
        const newOnes: any[] = [];
        let letter = getNextBlockLetter(current);
        for (let i = 0; i < names.length; i += count) {
          names.slice(i, i + count).forEach((nombre, idx) => {
            newOnes.push({
              ...ejToDisplay(null),
              ejercicio: nombre,
              categoria: 'Entreno',
              serie: blockType,
              blockSerie: blockType,
              blockLetter: letter,
              blockPosition: idx + 1,
            });
          });
          letter = String.fromCharCode(letter.charCodeAt(0) + 1);
        }
        const next = [...current, ...newOnes];
        return { ...r, ejercicios: syncBlockMetadata(next.map(displayToEj)) };
      })
    );
  }, [activeRoutineId, setRoutines]);

  const getDayTotalVolume = useCallback((routine: EditorRoutineExercise[] | undefined) => {
    if (!routine || !routine.length) return '0 kg';
    const total = routine.reduce((sum: number, ex: EditorRoutineExercise) => {
      const s1 = parseInt(ex.semana1 || ex.sets || '0') || 0;
      const s2 = parseInt(ex.semana2 || '0') || 0;
      const s3 = parseInt(ex.semana3 || '0') || 0;
      const s4 = parseInt(ex.semana4 || '0') || 0;
      const reps = parseInt(ex.reps) || 0;
      const peso = parseFloat(ex.peso) || 0;
      return sum + (s1 + s2 + s3 + s4) * reps * peso;
    }, 0);
    return total > 0 ? `${total} kg` : '0 kg';
  }, []);

  const getDayLabel = useCallback((diaKey: string) => {
    const day = calendar.find((d) => d && d.dia === diaKey);
    return day?.actividad || 'Descanso';
  }, [calendar]);

  const handleDayClick = useCallback((diaKey: string) => {
    const day = calendar.find((d) => d && d.dia === diaKey);
    if (day?.actividad && day.actividad.toLowerCase() !== 'descanso') {
      const rutina = routines.find((r) => r.nombre === day.actividad);
      if (rutina) {
        setActiveRoutineId(rutina.id);
      } else {
        const newRoutine = {
          id: 'routine-' + Date.now(),
          nombre: day.actividad,
          titulo: day.actividad,
          ejercicios: []
        };
        setRoutines((prev) => [...prev, newRoutine]);
        setActiveRoutineId(newRoutine.id);
      }
    }
  }, [calendar, routines, setActiveRoutineId, setRoutines]);

  const handleDayBlur = useCallback((diaKey: string, value: string, originalLabel: string) => {
    const day = calendar.find((d) => d && d.dia === diaKey);
    const current = day?.actividad || '';
    const trimmed = (value || '').trim();

    if (!trimmed || trimmed.toLowerCase() === 'descanso') {
      if (current) {
        setCalendar((prev) => prev.map((d) => d && d.dia === diaKey ? { ...d, actividad: '', routineId: null } : d));
      }
      return;
    }

    if (trimmed === current) return;

    const newId = 'routine-' + Date.now();
    setRoutines((prev) => [...prev, { id: newId, nombre: trimmed, titulo: trimmed, ejercicios: [] }]);
    setCalendar((prev) => prev.map((d) => d && d.dia === diaKey ? { ...d, actividad: trimmed, routineId: newId } : d));
    setActiveRoutineId(newId);
  }, [calendar, routines, setCalendar, setRoutines, setActiveRoutineId, showToast]);

  const getTrainingStats = useCallback(() => {
    const days = (calendar || []).filter((d: CalendarDay) => {
      const act = (d.actividad || '').toLowerCase();
      return act && act !== 'descanso';
    });
    const cardioDays = days.filter((d: CalendarDay) => (d.actividad || '').toLowerCase().includes('cardio'));
    const volumen = (routines || []).reduce((sum: number, r: EditorRoutineExercise[]) => {
      return sum + (r.ejercicios || []).reduce((s: number, ej: EditorRoutineExercise) => {
        const s1 = parseInt(ej.semana1 || ej.sets || '0') || 0;
        const s2 = parseInt(ej.semana2 || '0') || 0;
        const s3 = parseInt(ej.semana3 || '0') || 0;
        const s4 = parseInt(ej.semana4 || '0') || 0;
        return s + s1 + s2 + s3 + s4;
      }, 0);
    }, 0);
    return {
      dias: days.length,
      cardio: cardioDays.length,
      volumen,
    };
  }, [calendar, routines]);

  return {
    active,
    ejerciciosMemo,
    sections,
    addDay,
    duplicateActive,
    deleteActive,
    copyBlockToDay,
    copyDayToDay,
    addFila,
    addFilaBlank,
    addBlockByType,
    addToBlock,
    addExercisesGrouped,
    removeBlock,
    update,
    remove,
    reorder,
    reorderBlock,
    getDayTotalVolume,
    getDayLabel,
    handleDayClick,
    handleDayBlur,
    getTrainingStats,
  };
}
