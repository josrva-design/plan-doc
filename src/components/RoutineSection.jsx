import React, { useState, useMemo } from 'react';
import PageHeader from './PageHeader.jsx';
import EditableTable from './EditableTable.jsx';
import useRoutineData from '../hooks/useRoutineData.js';
import { useAppContext } from '../context/AppContext.jsx';

const TIPOS = ['Normal', 'Biserie', 'Triserie', 'Circuito'];
const REPS_OPTIONS = ['4-6', '6-8', '8-10', '10-12', '12-15', '15-20', '20+'];
const TECNICA_OPTIONS = ['', 'Drop Set', 'Rest-Pause', 'Isométrico', 'Cluster', 'Blood Flow Restriction', 'Negativas', 'Parcial', 'Full Range'];
const RS_OPTIONS = ['', 'RIR 1', 'RIR 2', 'RIR 3', 'RIR 4', 'RPE 6', 'RPE 7', 'RPE 8', 'RPE 9', 'RPE 10', 'AMRAP'];

const CATEGORIES = {
  Aprox: { label: 'APROXIMACIÓN', color: 'var(--color-primary)' },
  Entreno: { label: 'ENTRENAMIENTO', color: 'var(--color-green)' },
};

export default function RoutineSection() {
  const { data, setters, showToast } = useAppContext();
  const { routines, activeRoutineId, calendar, training = {} } = data;
  const { setRoutines, setActiveRoutineId, setCalendar, setTraining } = setters;
  const [activeGroup, setActiveGroup] = useState('Aprox');
  const [editingTipoUid, setEditingTipoUid] = useState(null);
  const [tipoHoverUid, setTipoHoverUid] = useState(null);
  const [editingDay, setEditingDay] = useState(null);

  const updateTraining = (key, value) => {
    if (setTraining) {
      setTraining(prev => ({ ...prev, [key]: value }));
    }
  };

  const trainingPlanFields = [
    { key: 'estrategia', label: 'Estrategia', placeholder: 'Ej: Fuerza + Hipertrofia' },
    { key: 'dias', label: 'Días/semana', placeholder: 'Ej: 4', type: 'number' },
    { key: 'cardio', label: 'Cardio', placeholder: 'Ej: 2 días/semana' },
  ];

  const {
    active, ejerciciosMemo, sections, addDay, duplicateActive, deleteActive,
    addFila, update, remove, reorder, getDayTotalVolume, getDayLabel, handleDayClick, handleDayBlur,
  } = useRoutineData(data, setters, showToast, activeGroup);

  const DAY_ORDER = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];

  const columns = [
    {
      key: 'tipo',
      label: 'TIPO',
      width: '8%',
      minWidth: '38px',
      maxWidth: '45px',
      render: (value, row, onChange, uid) => {
        const isEditing = editingTipoUid === uid;
        const isHovering = tipoHoverUid === uid;

        if (isEditing) {
          return (
            <select
              autoFocus
              value={value}
              onChange={(e) => {
                onChange('tipo', e.target.value);
                setEditingTipoUid(null);
              }}
              onBlur={() => setEditingTipoUid(null)}
              className="premium-cell-select text-[10px] w-full"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          );
        }

        return (
          <div>
            {row.isFirstInBlock && (
              <div className="warmup-block-label">
                {row.blockSerie} {row.blockLetter}
              </div>
            )}
            <button
              onClick={() => setEditingTipoUid(uid)}
              onMouseEnter={() => setTipoHoverUid(uid)}
              onMouseLeave={() => setTipoHoverUid(null)}
              className="warmup-tipo-text"
            >
              {isHovering ? '_' : value}
            </button>
          </div>
        );
      },
    },
    {
key: 'serie',
      label: 'Serie',
      width: '6%',
      minWidth: '40px',
      maxWidth: '45px',
      align: 'center',
      render: (value, row, onChange, uid, idx) => (
        <span className="warmup-serie">
          {row.blockLetter}{row.blockPosition}
        </span>
      ),
    },
    {
      key: 'fase',
      label: 'FASE',
      width: '8%',
      minWidth: '55px',
      maxWidth: '70px',
      align: 'center',
      render: (value, row) => {
        const faseColorMap = { GENERAL: 'var(--color-primary)', MOVILIDAD: 'var(--color-green)', ESPECIFICO: 'var(--color-navy)' };
        const color = faseColorMap[row.fase] || row.faseColor || 'var(--color-primary)';
        return (
          <span style={{ color, fontSize: '9px', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {row.fase || 'ENTRENAMIENTO'}
          </span>
        );
      },
    },
    {
      key: 'video',
      label: 'VID',
      width: '6%',
      minWidth: '40px',
      align: 'center',
      render: (value) => (
        <span className="premium-video-btn">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 1.5L8.5 5L2 8.5V1.5Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
          </svg>
        </span>
      ),
    },
    {
      key: 'ejercicio',
      label: 'EJERCICIO',
      render: (value, row, onChange) => {
        let displayValue = value;
        if (row.aproxBase) {
          const baseEj = ejerciciosMemo.find((b) => b.uid === row.aproxBase);
          if (baseEj) {
            displayValue = baseEj.ejercicio;
          }
        }
        
        return (
          <>
            <input
              value={displayValue || ''}
              onChange={(e) => {
                if (!row.aproxBase) {
                  onChange('ejercicio', e.target.value);
                }
              }}
              className="premium-cell-input w-full"
              list="exercise-list"
              placeholder="Elige un movimiento"
              readOnly={!!row.aproxBase}
            />
            {row.aproxPorcentaje && <span className="typo-muted-sm whitespace-nowrap">({row.aproxPorcentaje}%)</span>}
            <datalist id="exercise-list">
              <option value="Press banca" />
              <option value="Sentadilla" />
              <option value="Peso muerto" />
              <option value="Press inclinado" />
              <option value="Dominadas" />
              <option value="Remo con barra" />
              <option value="Press militar" />
            </datalist>
          </>
        );
      },
    },
    {
      key: 'sets',
      label: 'SETS',
      width: '7%',
      minWidth: '48px',
      maxWidth: '48px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          type="number"
          min="1"
          value={value || ''}
          onChange={(e) => onChange('sets', e.target.value)}
          className="premium-table-input text-center"
          placeholder="1-5"
        />
      ),
    },
    {
      key: 'reps',
      label: 'REPS',
      width: '9%',
      minWidth: '60px',
      maxWidth: '70px',
      align: 'center',
      render: (value, row, onChange) => (
        <select
          value={value || ''}
          onChange={(e) => onChange('reps', e.target.value)}
          className={"premium-table-select w-full text-center" + (!value ? " is-placeholder" : "")}
        >
          <option value="" disabled>Rango</option>
          {REPS_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'tecnica',
      label: 'TÉCNICA',
      width: '10%',
      minWidth: '70px',
      maxWidth: '100px',
      render: (value, row, onChange) => (
        <select
          value={value || ''}
          onChange={(e) => onChange('tecnica', e.target.value)}
          className={"premium-table-select w-full" + (!value ? " is-placeholder" : "")}
        >
          <option value="" disabled>Técnica</option>
          {TECNICA_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'rir',
      label: 'RIR',
      width: '9%',
      minWidth: '70px',
      maxWidth: '90px',
      align: 'center',
      render: (value, row, onChange) => (
        <select
          value={value || ''}
          onChange={(e) => onChange('rir', e.target.value)}
          className={"premium-table-select w-full text-center" + (!value ? " is-placeholder" : "")}
        >
          <option value="" disabled>RIR</option>
          {RS_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'descanso',
      label: 'DESCANSO',
      width: '9%',
      minWidth: '70px',
      maxWidth: '85px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('descanso', e.target.value)}
          className="premium-table-input text-center"
          placeholder="60-120s"
        />
      ),
    },
    {
      key: 'notas',
      label: 'NOTAS',
      render: (value, row, onChange) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('notas', e.target.value)}
          className="premium-table-input"
          placeholder="Observaciones"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="TRATAMIENTO DEPORTIVO" subtitle="Configuración de días, ejercicios y progresión por rutina." />

      <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
        <p className="typo-label mb-3">Plan de entrenamiento</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {trainingPlanFields.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <p className="typo-label">{label}</p>
              <input
                type={type || 'text'}
                value={training[key] || ''}
                onChange={(e) => updateTraining(key, type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value)}
                placeholder={placeholder}
                className="mt-1 w-full bg-transparent outline-none typo-input border-b border-transparent focus:border-[var(--color-primary)] input-placeholder"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto">
          {DAY_ORDER.map((diaKey) => {
            const day = calendar.find((d) => d.dia === diaKey);
            const label = getDayLabel(diaKey);
            const isRest = !day?.actividad || day.actividad.toLowerCase() === 'descanso';
            const isActive = active?.nombre === label;
            const isEditing = editingDay === diaKey;

            if (isEditing) {
              return (
                <input
                  key={diaKey}
                  autoFocus
                  defaultValue={isRest ? '' : label}
                  onBlur={(e) => {
                    handleDayBlur(diaKey, e.target.value, label);
                    setEditingDay(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleDayBlur(diaKey, e.target.value, label);
                      setEditingDay(null);
                    }
                  }}
                  className="day-input"
                />
              );
            }

            return (
              <button
                key={diaKey}
                type="button"
                onClick={() => {
                  setEditingDay(diaKey);
                  setTimeout(() => handleDayClick(diaKey), 0);
                }}
                className={"premium-btn-pill " + (isActive ? 'premium-btn-pill--primary' : (isRest ? 'premium-btn-pill--ghost opacity-50' : 'premium-btn-pill--ghost'))}
                title={isRest ? 'Día de descanso' : 'Editar día'}
              >
                <span className="typo-muted-xs mr-1">{diaKey}</span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {active && (
        <div>
          <EditableTable
            columns={columns}
            rows={sections}
            getRowId={(r) => r.uid}
            onUpdateRow={update}
            onRemoveRow={remove}
            onReorder={reorder}
            onAddRow={addFila}
            emptyText="Sin ejercicios"
            addButtonLabel="+ Ejercicio"
            dragBetweenGroups={false}
          />
        </div>
      )}
    </div>
  );
}
