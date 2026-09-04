import { useState, useMemo, useCallback, useEffect } from 'react';
import SectionTitle from './ui/SectionTitle.tsx';
import EditableTable from './EditableTable.tsx';
import CalendarSection from './CalendarSection.tsx';
import useRoutineData, { UseRoutineDataReturn } from '../hooks/useRoutineData.ts';
import useWarmupData from '../hooks/useWarmupData.ts';
import { useAppContext } from '../context/AppContext.jsx';
import { exerciseDatabase } from '../data/exerciseDatabase.ts';
import type { EditorRoutineExercise, EditorExerciseDisplay } from '../core/types.ts';
import TrainingPlanHeader from './ui/TrainingPlanHeader.tsx';
import { buildExerciseColumns, isCardioRow } from './exerciseTableColumns.tsx';
import RoutineCard from './RoutineCard.tsx';
import { ExercisePickerProvider } from './ExercisePickerContext.tsx';
import { DAY_KEYS, DAY_LABELS, normalizeCalendar } from '../utils/calendarConstants.ts';
import { sumCardioSessions, countCardioDays } from '../utils/cardioDetection.ts';
import { ejToDisplay, displayToEj, getCombinedSections } from '../utils/routineHelpers.ts';
import { DESCANSOS_OPTIONS } from './exerciseTableColumns.tsx';

const EXERCISE_NAMES = exerciseDatabase.map((e) => e.nombre);

const BLOCK_COLORS: Record<string, string> = {
  Simple: 'var(--color-navy)',
  Biserie: 'var(--color-navy)',
  Triserie: 'var(--color-navy)',
  Circuito: 'var(--color-navy)',
};

function getBlockColor(tipo: string): string {
  return BLOCK_COLORS[tipo] || 'var(--color-primary)';
}

import { Dumbbell, X } from 'lucide-react';

export default function TrainingEditor() {
  const { data, setters, showToast } = useAppContext();
  const { calendar = [], routines = [], warmup, training = {} } = data;
    const { setCalendar, setRoutines, setActiveRoutineId, setWarmup } = setters;

  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'rutina' | 'calentamiento'>('rutina');
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>('Aprox');

  const selectedDay = calendar[selectedDayIdx] || {};
  const selectedDayKey = DAY_KEYS[selectedDayIdx] || 'monday';

  const updateDay = useCallback((i: number, patch: any) => {
    const next = [...calendar];
    next[i] = { ...next[i], ...patch };
    setCalendar(next);
  }, [calendar, setCalendar]);

  const handleActividadChange = (i: number, value: string) => {
    updateDay(i, { actividad: value });
  };

  const handleActividadBlur = (i: number, value: string) => {
    const trimmed = (value || '').trim();

    if (!trimmed || trimmed.toLowerCase() === 'descanso') {
      updateDay(i, { actividad: trimmed || '', routineId: null });
      if (i === selectedDayIdx) setActiveRoutineId(null);
      return;
    }

    const currentRoutineId = calendar[i]?.routineId;
    if (currentRoutineId) {
      const routine = routines.find((r) => r.id === currentRoutineId);
      if (routine) {
        setRoutines((prev) =>
          prev.map((r) => (r.id === currentRoutineId ? { ...r, nombre: trimmed, titulo: trimmed } : r))
        );
        updateDay(i, { actividad: trimmed });
        if (i === selectedDayIdx) setActiveRoutineId(currentRoutineId);
        return;
      }
    }

    const newRoutine = {
      id: 'routine-' + Date.now(),
      nombre: trimmed,
      titulo: trimmed,
      ejercicios: [],
    };
    setRoutines((prev) => [...prev, newRoutine]);
    updateDay(i, { actividad: trimmed, routineId: newRoutine.id });
    if (i === selectedDayIdx) setActiveRoutineId(newRoutine.id);
  };

  const handleCalendarDayClick = (i: number) => {
    const row = calendar[i] || {};
    const actividad = (row.actividad || '').trim();

    if (!actividad || actividad.toLowerCase() === 'descanso') {
      setActiveRoutineId(null);
      return;
    }

    if (row.routineId) {
      setActiveRoutineId(row.routineId);
      return;
    }

    const newId = 'routine-' + Date.now();
    const newRoutine = { id: newId, nombre: actividad, titulo: actividad, ejercicios: [] };
    setRoutines((prev) => [...prev, newRoutine]);
    updateDay(i, { routineId: newId });
    setActiveRoutineId(newId);
  };


  const handleRemoveDay = useCallback((i: number) => {
    const next = [...calendar];
    next[i] = { ...next[i], actividad: '', routineId: null };
    setCalendar(next);
    if (i === selectedDayIdx) setActiveRoutineId(null);
    showToast('Día eliminado');
  }, [calendar, setCalendar, selectedDayIdx, setActiveRoutineId, showToast]);

  const routineData = useRoutineData(
    { ...data, activeRoutineId: data.activeRoutineId },
    setters,
    showToast,
    activeGroup
  );

  const { active: activeRoutine, sections, addFila, addFilaBlank, addBlockByType, addToBlock, addExercisesGrouped, removeBlock, update, remove, reorder, reorderBlock, copyBlockToDay, copyDayToDay, getDayLabel } = routineData as UseRoutineDataReturn;

  const warmupData = useWarmupData(warmup, setWarmup, showToast);
  const {
    warmupGeneralSections,
    warmupUpperSections,
    warmupLowerSections,
    warmupGeneralGroups,
    warmupUpperGroups,
    warmupLowerGroups,
    addBlockByType: addWarmupBlock,
    addToBlock: addToWarmupBlock,
    removeBlock: removeWarmupBlock,
    addExercise: addWarmupExercise,
    update: updateWarmup,
    remove: removeWarmup,
    reorder: reorderWarmup,
    reorderBlock: reorderWarmupBlock,
  } = warmupData;

  const stats = useMemo(() => {
    const days = (calendar || []).filter((d: any) => {
      const act = (d.actividad || '').toLowerCase();
      return act && act !== 'descanso';
    });
    const cardioDias = countCardioDays(calendar, routines);
    const volumen = (routines || []).reduce((sum: number, r: any) => {
      return sum + (r.ejercicios || []).reduce((s: number, ej: any) => {
        const s1 = parseInt(ej.semana1 || ej.sets || '0') || 0;
        const s2 = parseInt(ej.semana2 || '0') || 0;
        const s3 = parseInt(ej.semana3 || '0') || 0;
        const s4 = parseInt(ej.semana4 || '0') || 0;
        const reps = parseInt(ej.reps) || 0;
        const peso = parseFloat(ej.peso) || 0;
        return s + s1 + s2 + s3 + s4;
      }, 0);
    }, 0);
    return {
      dias: days.length,
      cardio: cardioDias,
      volumen,
    };
  }, [calendar, routines]);

  const blockGroups = useMemo(() => {
    const groups: Record<string, any> = {};
    sections.forEach((s: any) => {
      const letter = s.blockLetter || 'A';
      const isCardio = isCardioRow(s);
      if (!groups[letter]) {
        groups[letter] = {
          label: isCardio ? 'CARDIO' : (s.blockSerie || 'BLOQUE'),
          color: isCardio ? 'var(--color-green)' : getBlockColor(s.serie || s.blockSerie),
          className: 'routine-group-header',
          hasAprox: false,
          hasSimple: false,
          isCardio: false,
        };
      }
      if (isCardio) groups[letter].isCardio = true;
      if (s.isAprox) groups[letter].hasAprox = true;
      else groups[letter].hasSimple = true;
    });

    Object.keys(groups).forEach((letter) => {
      const g = groups[letter];
      if (g.isCardio) {
        g.label = `${letter} CARDIO`;
      } else if (g.hasAprox && g.hasSimple) {
        g.label = `${letter} APROX / SIMPLE`;
      } else if (g.hasAprox) {
        g.label = `${letter} APROX`;
      } else {
        g.label = `${letter} ${g.label}`;
      }
    });
    return groups;

  }, [sections]);

  const baseColumnOptions = {
    exerciseNames: EXERCISE_NAMES,
  };

  const routineColumns = buildExerciseColumns({
    ...baseColumnOptions,
    withSemanas: true,
    enableAprox: true,
    aproxMemo: routineData.ejerciciosMemo,
  });

  const warmupColumns = buildExerciseColumns({
    ...baseColumnOptions,
    withSemanas: false,
    enableAprox: false,
  });

  const copyBlockTargets = useMemo(() => {
    if (!activeRoutine) return [];
    return (calendar || [])
      .filter(
        (d: any) =>
          d.routineId &&
          d.routineId !== activeRoutine.id &&
          (d.actividad || '').trim() &&
          (d.actividad || '').toLowerCase() !== 'descanso'
      )
      .map((d: any) => ({ label: d.dia || d.actividad || 'Día', value: d.routineId as string }));
  }, [calendar, activeRoutine]);

  const duplicateOptions = useMemo(() => {
    if (!activeRoutine) return [];
    const safeCalendar = normalizeCalendar(calendar);
    return DAY_KEYS.map((key, idx) => ({
      label: DAY_LABELS[idx],
      routineId: safeCalendar[idx]?.routineId || null,
      dayIndex: idx,
    })).filter((opt: any) => opt.dayIndex !== selectedDayIdx);
  }, [calendar, activeRoutine, selectedDayIdx]);

  const handleDuplicate = useCallback((opt: { routineId: string | null; dayIndex: number; label: string }) => {
    if (!activeRoutine) return;
    if (opt.routineId && opt.routineId !== activeRoutine.id) {
      copyDayToDay(opt.routineId);
      showToast('Rutina copiada en ' + opt.label);
    } else {
      const newId = 'routine-' + Date.now();
      const newRoutine = {
        id: newId,
        nombre: activeRoutine.nombre,
        titulo: activeRoutine.titulo,
        ejercicios: [],
      };
      setRoutines((prev) => [...prev, newRoutine]);
      updateDay(opt.dayIndex, { actividad: activeRoutine.nombre, routineId: newId });
      copyDayToDay(newId);
      showToast('Rutina duplicada en ' + opt.label);
    }
  }, [activeRoutine, copyDayToDay, updateDay, setRoutines, showToast]);

  return (
    <ExercisePickerProvider>
    <div className="p-3 md:p-4">
      <div className="mb-6">
        <div className="premium-page-title">
          <span className="mr-2 inline-flex items-center justify-center text-[var(--color-primary)]"><Dumbbell size={24} /></span>
          TRATAMIENTO DEPORTIVO
        </div>
        <div className="premium-subtitle">Configuración de días, ejercicios y progresión por rutina.</div>
      </div>

      <div className="module-tabs" role="tablist" aria-label="Módulo de entrenamiento">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'rutina'}
          className={activeTab === 'rutina' ? 'active' : ''}
          onClick={() => setActiveTab('rutina')}
        >
          Rutina
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'calentamiento'}
          className={activeTab === 'calentamiento' ? 'active' : ''}
          onClick={() => setActiveTab('calentamiento')}
        >
          Calentamiento
        </button>
      </div>

      {activeTab === 'rutina' && (
        <div>
          <TrainingPlanHeader
            estrategia={training.estrategia}
            onEstrategiaChange={(value) => {
              if (setters.setTraining) {
                setters.setTraining(prev => ({ ...prev, estrategia: value }));
              }
            }}
            dias={stats.dias}
            cardio={stats.cardio}
            volumen={stats.volumen}
          />

          <CalendarSection
            calendar={calendar}
            routines={routines}
            selectedDayIdx={selectedDayIdx}
            editingDay={editingDay}
            onSelectDay={setSelectedDayIdx}
            onSetEditingDay={setEditingDay}
            onActividadBlur={handleActividadBlur}
            onCalendarDayClick={handleCalendarDayClick}
          />

          {activeRoutine ? (
            <RoutineCard
              label={DAY_LABELS[selectedDayIdx] || selectedDayKey}
              activity={selectedDay.actividad || 'Sin actividad'}
              onPrimaryAction={(type) => addBlockByType(type)}
              duplicateOptions={duplicateOptions}
              onDuplicate={handleDuplicate}
              onRemove={() => handleRemoveDay(selectedDayIdx)}
            >
              <EditableTable
                variant="training"
                columns={routineColumns}
                rows={sections}
                getRowId={(r) => r.uid}
                onUpdateRow={update}
                onRemoveRow={remove}
                onReorder={reorder}
                onReorderGroup={(from, to, dir) => reorderBlock(from, to, dir)}
                onRowEnter={() => addBlockByType('Simple')}
                onCopyBlock={(letter, routineId) => copyBlockToDay(letter, routineId)}
                copyBlockTargets={copyBlockTargets}
                emptyText="Sin ejercicios"
                dragBetweenGroups={false}
                groupBy="blockLetter"
                groupConfig={blockGroups}
                renderGroupHeader={(groupKey, groupConfig, groupRowsData) => {
                  const currentTipo = groupRowsData[0]?.blockSerie || groupRowsData[0]?.serie || 'Simple';
                  const LIMITE_POR_TIPO: Record<string, number> = { Simple: 1, Biserie: 2, Triserie: 3, Circuito: 4 };
                  const limite = LIMITE_POR_TIPO[currentTipo] || 99;
                  const ejerciciosCount = groupRowsData.length;
                  const isCardioBlock = (groupConfig as any)?.isCardio;
                  const label = isCardioBlock
                    ? (groupConfig?.label || groupKey)
                    : currentTipo === 'Aprox'
                      ? (groupConfig?.label || groupKey)
                      : `${groupConfig?.label || groupKey} (${ejerciciosCount}/${limite})`;
                  const isCircuito = currentTipo === 'Circuito';
                  const isAprox = currentTipo === 'Aprox';
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span
                        className={`group-header-label${isCardioBlock ? ' is-cardio' : ''}`}
                        style={{ marginRight: 4 }}
                      >
                        {label}
                      </span>
                      {isCircuito && (
                        <button
                          type="button"
                          onClick={() => addToBlock(groupKey)}
                          className="menu-group-add-btn menu-group-add-btn--primary"
                        >
                          + Ejercicio
                        </button>
                      )}
                      {!isAprox && (
                        <button
                          type="button"
                          onClick={() => removeBlock(groupKey)}
                          className="menu-group-add-btn menu-group-add-btn--danger"
                          title="Eliminar bloque"
                        >
                          <X size={9} />
                        </button>
                      )}
                    </div>
                  );
                }}
              />
            </RoutineCard>
          ) : (
            <div className="text-center py-8 typo-muted-sm">
              Selecciona un día con actividad para ver la rutina
            </div>
          )}
        </div>
      )}

       {activeTab === 'calentamiento' && (
         <div className="space-y-6">
            <RoutineCard
              label="Calentamiento"
              subtitle="General"
              onPrimaryAction={(type) => addWarmupBlock('general', type)}
            >
              <EditableTable
                variant="training"
                columns={warmupColumns}
                rows={warmupGeneralSections}
                getRowId={(r) => r.uid}
                groupBy="blockLetter"
                groupConfig={warmupGeneralGroups}
                onUpdateRow={(uid, field, val) => updateWarmup(uid, field, val)}
                onRemoveRow={(uid) => removeWarmup(uid)}
                onReorder={(from, to) => reorderWarmup(from, to)}
                onReorderGroup={(from, to, dir) => reorderWarmupBlock('general', from, to, dir)}
                emptyText="Sin ejercicios"
                dragBetweenGroups={false}
                renderGroupHeader={(groupKey, groupConfig, groupRowsData) => {
                  const currentTipo = groupRowsData[0]?.blockSerie || 'Simple';
                  const LIMITE_POR_TIPO: Record<string, number> = { Simple: 1, Biserie: 2, Triserie: 3, Circuito: 4 };
                  const limite = LIMITE_POR_TIPO[currentTipo] || 99;
                  const ejerciciosCount = groupRowsData.length;
                  const label = `${groupConfig?.label || groupKey} (${ejerciciosCount}/${limite})`;
                  const isCircuito = currentTipo === 'Circuito';
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="group-header-label" style={{ marginRight: 4 }}>
                        {label}
                      </span>
                      {isCircuito && (
                        <button
                          type="button"
                          onClick={() => addToWarmupBlock('general', groupKey)}
                          className="menu-group-add-btn menu-group-add-btn--primary"
                        >
                          + Ejercicio
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeWarmupBlock('general', groupKey)}
                        className="menu-group-add-btn menu-group-add-btn--danger"
                        title="Eliminar bloque"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  );
                }}
              />
           </RoutineCard>
            <RoutineCard
              label="Calentamiento"
              subtitle="Tren Superior"
              onPrimaryAction={(type) => addWarmupBlock('upper', type)}
            >
              <EditableTable
                variant="training"
                columns={warmupColumns}
                rows={warmupUpperSections}
                getRowId={(r) => r.uid}
                groupBy="blockLetter"
                groupConfig={warmupUpperGroups}
                onUpdateRow={(uid, field, val) => updateWarmup(uid, field, val)}
                onRemoveRow={(uid) => removeWarmup(uid)}
                onReorder={(from, to) => reorderWarmup(from, to)}
                onReorderGroup={(from, to, dir) => reorderWarmupBlock('upper', from, to, dir)}
                emptyText="Sin ejercicios"
                dragBetweenGroups={false}
                renderGroupHeader={(groupKey, groupConfig, groupRowsData) => {
                  const currentTipo = groupRowsData[0]?.blockSerie || 'Simple';
                  const LIMITE_POR_TIPO: Record<string, number> = { Simple: 1, Biserie: 2, Triserie: 3, Circuito: 4 };
                  const limite = LIMITE_POR_TIPO[currentTipo] || 99;
                  const ejerciciosCount = groupRowsData.length;
                  const label = `${groupConfig?.label || groupKey} (${ejerciciosCount}/${limite})`;
                  const isCircuito = currentTipo === 'Circuito';
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="group-header-label" style={{ marginRight: 4 }}>
                        {label}
                      </span>
                      {isCircuito && (
                        <button
                          type="button"
                          onClick={() => addToWarmupBlock('upper', groupKey)}
                          className="menu-group-add-btn menu-group-add-btn--primary"
                        >
                          + Ejercicio
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeWarmupBlock('upper', groupKey)}
                        className="menu-group-add-btn menu-group-add-btn--danger"
                        title="Eliminar bloque"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  );
                }}
              />
           </RoutineCard>
            <RoutineCard
              label="Calentamiento"
              subtitle="Tren Inferior"
              onPrimaryAction={(type) => addWarmupBlock('lower', type)}
            >
              <EditableTable
                variant="training"
                columns={warmupColumns}
                rows={warmupLowerSections}
                getRowId={(r) => r.uid}
                groupBy="blockLetter"
                groupConfig={warmupLowerGroups}
                onUpdateRow={(uid, field, val) => updateWarmup(uid, field, val)}
                onRemoveRow={(uid) => removeWarmup(uid)}
                onReorder={(from, to) => reorderWarmup(from, to)}
                onReorderGroup={(from, to, dir) => reorderWarmupBlock('lower', from, to, dir)}
                emptyText="Sin ejercicios"
                dragBetweenGroups={false}
                renderGroupHeader={(groupKey, groupConfig, groupRowsData) => {
                  const currentTipo = groupRowsData[0]?.blockSerie || 'Simple';
                  const LIMITE_POR_TIPO: Record<string, number> = { Simple: 1, Biserie: 2, Triserie: 3, Circuito: 4 };
                  const limite = LIMITE_POR_TIPO[currentTipo] || 99;
                  const ejerciciosCount = groupRowsData.length;
                  const label = `${groupConfig?.label || groupKey} (${ejerciciosCount}/${limite})`;
                  const isCircuito = currentTipo === 'Circuito';
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="group-header-label" style={{ marginRight: 4 }}>
                        {label}
                      </span>
                      {isCircuito && (
                        <button
                          type="button"
                          onClick={() => addToWarmupBlock('lower', groupKey)}
                          className="menu-group-add-btn menu-group-add-btn--primary"
                        >
                          + Ejercicio
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeWarmupBlock('lower', groupKey)}
                        className="menu-group-add-btn menu-group-add-btn--danger"
                        title="Eliminar bloque"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  );
                }}
              />
           </RoutineCard>
         </div>
       )}
    </div>
    </ExercisePickerProvider>
  );
}
