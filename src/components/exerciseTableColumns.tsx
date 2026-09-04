import { useState } from 'react';
import { exerciseDatabase } from '../data/exerciseDatabase.ts';
import { useExercisePicker } from './ExercisePickerContext.tsx';
import EditableSelect from './ui/EditableSelect.tsx';

export const REPS_OPTIONS = ['4-6', '6-8', '8-10', '10-12', '12-15', '15-20', '20+'];
export const CARDIO_REPS_OPTIONS: string[] = [
  '', '1 MIN', '2 MIN', '3 MIN', '4 MIN', '5 MIN', '6 MIN', '7 MIN', '8 MIN', '9 MIN',
  '10 MIN', '12 MIN', '15 MIN', '18 MIN', '20 MIN', '25 MIN', '30 MIN',
  '35 MIN', '40 MIN', '45 MIN', '50 MIN', '55 MIN', '60 MIN',
  '70 MIN', '80 MIN', '90 MIN', '30 seg', '45 seg', '60 seg',
];

export const TECNICA_OPTIONS = ['', 'Drop Set', 'Rest-Pause', 'Isométrico', 'Cluster', 'Blood Flow Restriction', 'Negativas', 'Parcial', 'Full Range'];
export const RS_OPTIONS = ['', 'RIR 1', 'RIR 2', 'RIR 3', 'RIR 4', 'RPE 6', 'RPE 7', 'RPE 8', 'RPE 9', 'RPE 10', 'AMRAP'];
export const CARDIO_ZONES = ['', 'Z1 — Recuperación', 'Z2 — Aeróbico base', 'Z3 — Tempo', 'Z4 — Umbral', 'Z5 — VO2 máx'];
export const DESCANSOS_OPTIONS = [
  { value: '30', label: '30 seg' },
  { value: '60', label: '1 min' },
  { value: '120', label: '2 min' },
  { value: '180', label: '3 min' },
  { value: '240', label: '4 min' },
  { value: '300', label: '5 min' },
];

export const isCardioRow = (row: any): boolean => {
  // Tier 1: Check explicit tipo field first
  const tipo = String(row?.tipo || '').toLowerCase();
  if (tipo === 'cardio') return true;
  if (tipo === 'normal') return false;

  // Tier 2: Check musculo field
  const musculo = String(row?.musculo || '').toLowerCase();
  if (musculo.startsWith('cardio')) return true;

  // Tier 3: Look up exercise name in exerciseDatabase
  const nombre = String(row?.ejercicio || '').trim();
  if (!nombre) return false;
  const match = exerciseDatabase.find(
    (e) => e.nombre.toLowerCase() === nombre.toLowerCase()
  );
  if (match) return String(match.musculo || '').toLowerCase().startsWith('cardio');

  // Tier 4: Fallback — if reps contains time-based value (e.g. "20 MIN", "30 seg")
  const reps = String(row?.reps || '').toLowerCase();
  if (reps.includes('min') || reps.includes('seg')) return true;
  return false;
};

export interface BuildExerciseColumnsOptions {
  /** Incluye las 4 columnas de progresión semanal (Sem 1-4). La rutina las usa; el calentamiento no. */
  withSemanas: boolean;
  /** Nombres para el datalist del ejercicio. */
  exerciseNames: string[];
  /** Habilita la lógica de series de aproximación (solo rutina). */
  enableAprox: boolean;
  /** Memoria de ejercicios base para resolver aproxBase (requerido si enableAprox). */
  aproxMemo?: Array<{ uid: string; ejercicio: string }>;
}

/**
 * Construye la definición de columnas de la tabla de ejercicios.
 * Reutilizada por la Rutina (withSemanas + aprox) y el Calentamiento (sin semanas, sin aprox)
 * para garantizar columnas idénticas salvo la progresión semanal.
 */
export function buildExerciseColumns({
  withSemanas,
  exerciseNames,
  enableAprox,
  aproxMemo = [],
}: BuildExerciseColumnsOptions) {
  const semanasColumns = withSemanas
    ? [
        {
          key: 'semana1',
          label: 'Sem 1',
          width: '7%',
          minWidth: '48px',
          align: 'center' as const,
          render: (value: any, _row: any, onChange: any) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value || ''}
              onChange={(e) => onChange('semana1', e.target.value)}
              className="premium-table-input text-center"
              placeholder="1-5"
            />
          ),
        },
        {
          key: 'semana2',
          label: 'Sem 2',
          width: '7%',
          minWidth: '48px',
          align: 'center' as const,
          render: (value: any, _row: any, onChange: any) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value || ''}
              onChange={(e) => onChange('semana2', e.target.value)}
              className="premium-table-input text-center"
              placeholder="1-5"
            />
          ),
        },
        {
          key: 'semana3',
          label: 'Sem 3',
          width: '7%',
          minWidth: '48px',
          align: 'center' as const,
          render: (value: any, _row: any, onChange: any) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value || ''}
              onChange={(e) => onChange('semana3', e.target.value)}
              className="premium-table-input text-center"
              placeholder="1-5"
            />
          ),
        },
        {
          key: 'semana4',
          label: 'Sem 4',
          width: '7%',
          minWidth: '48px',
          align: 'center' as const,
          render: (value: any, _row: any, onChange: any) => (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value || ''}
              onChange={(e) => onChange('semana4', e.target.value)}
              className="premium-table-input text-center"
              placeholder="1-5"
            />
          ),
        },
      ]
    : [];

  return [
    {
      key: 'serie',
      label: 'Serie',
      width: '10%',
      minWidth: '56px',
      maxWidth: '72px',
      align: 'center' as const,
      render: (value: any, row: any, _onChange: any, _uid: string, idx: number) => {
        const seq = row.blockLetter ? `${row.blockLetter}${row.blockPosition || idx + 1}` : '—';
        const isCardio = isCardioRow(row);
        const badgeColor = isCardio ? 'var(--color-green)' : 'var(--color-navy)';
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span
              className="block-badge"
              style={{ background: badgeColor, fontSize: 9, padding: '1px 6px' }}
              title="Secuencia"
            >
              {seq}
            </span>
          </div>
        );
      },
    },
    {
      key: 'ejercicio',
      label: 'EJERCICIO',
      width: '32%',
      minWidth: '140px',
      render: (value: any, row: any, onChange: any) => {
        const picker = useExercisePicker();
        let displayValue = value;
        if (enableAprox && row.aproxBase) {
          const baseEj = aproxMemo.find((b) => b.uid === row.aproxBase);
          if (baseEj) displayValue = baseEj.ejercicio;
        }

        const emptyExercise = !row.aproxBase && !(displayValue || '').trim();
        const musculo = row.musculo || '';
        const movimiento = row.movimiento || '';
        const subtitle = [musculo, movimiento].filter(Boolean).join(' · ');

        const handleExerciseSelect = (name: string) => {
          onChange('ejercicio', name);
          const match = exerciseDatabase.find((ex) => ex.nombre.toLowerCase() === name.toLowerCase());
          if (match) {
            onChange('musculo', match.musculo);
            onChange('movimiento', match.movimiento);
            onChange('notas', match.nota);
            // Auto-set tipo based on database musculo
            const isCardio = String(match.musculo || '').toLowerCase().startsWith('cardio');
            onChange('tipo', isCardio ? 'Cardio' : 'Normal');
          }
        };

        const isCardio = isCardioRow(row);

        return (
          <>
            <input
              value={displayValue || ''}
              onClick={() => {
                if (!(enableAprox && row.aproxBase)) {
                  const mode = displayValue ? 'replace' : 'add';
                  picker.open({
                    mode,
                    currentName: displayValue || undefined,
                    onSelect: handleExerciseSelect,
                  });
                }
              }}
              onChange={(e) => {
                if (!(enableAprox && row.aproxBase)) {
                  const text = e.target.value;
                  onChange('ejercicio', text);
                  const match = exerciseDatabase.find((ex) => ex.nombre.toLowerCase() === text.toLowerCase());
                  if (match) {
                    handleExerciseSelect(text);
                  }
                }
              }}
              className={`premium-cell-input w-full${emptyExercise ? ' is-warn' : ''}`}
              style={{ fontWeight: 700, color: 'var(--color-navy)' }}
              list="exercise-list"
              placeholder="Elige un movimiento"
              readOnly={!!(enableAprox && row.aproxBase)}
            />
             {enableAprox && row.aproxPorcentaje && (
               <span className="typo-muted-sm whitespace-nowrap">({row.aproxPorcentaje}% peso)</span>
             )}
            {subtitle && (
              <div className="text-[10px] text-[var(--color-text-secondary)] opacity-70 truncate mt-0.5">
                {subtitle}
              </div>
            )}
            <datalist id="exercise-list">
              {exerciseNames.map((name, idx) => (
                <option key={`${name}-${idx}`} value={name} />
              ))}
            </datalist>
          </>
        );
      },
    },
    ...semanasColumns,
    {
      key: 'reps',
      label: 'REPS',
      width: '7%',
      minWidth: '70px',
      maxWidth: '90px',
      align: 'center' as const,
      className: 'premium-table-cell--reps',
      render: (value: any, row: any, onChange: any) => {
        const cleanValue = (value || '').replace(/\s*reps$/i, '').trim();
        const rowIsCardio = isCardioRow(row);
        const options = rowIsCardio ? CARDIO_REPS_OPTIONS.filter(Boolean) : REPS_OPTIONS;
        const placeholder = rowIsCardio ? 'Tiempo' : 'Rango';

        return (
          <EditableSelect
            value={cleanValue}
            onChange={(val) => onChange('reps', val)}
            options={options}
            placeholder={placeholder}
            className="w-full text-center"
          />
        );
      },
    },
    {
      key: 'tecnica',
      label: 'TÉCNICA',
      width: '10%',
      minWidth: '70px',
      maxWidth: '100px',
      render: (value: any, _row: any, onChange: any) => (
           <EditableSelect
            value={value || ''}
            onChange={(val) => onChange('tecnica', val)}
            options={TECNICA_OPTIONS}
            placeholder="Técnica"
            className="w-full text-center"
          />
      ),
    },
    {
      key: 'rir',
      label: 'RIR',
      width: '9%',
      minWidth: '60px',
      maxWidth: '90px',
      align: 'center' as const,
      render: (value: any, row: any, onChange: any) => {
        const isCardio = isCardioRow(row);
        const options = isCardio ? CARDIO_ZONES : RS_OPTIONS;
        return (
          <EditableSelect
            value={value || ''}
            onChange={(val) => onChange('rir', val)}
            options={options}
            placeholder={isCardio ? 'Zona' : 'RIR'}
            className="w-full text-center"
          />
        );
      },
    },
    {
      key: 'descanso',
      label: 'DESCANSO',
      width: '8%',
      minWidth: '64px',
      maxWidth: '75px',
      align: 'center' as const,
      render: (value: any, _row: any, onChange: any) => (
        <EditableSelect
          value={value || ''}
          onChange={(val) => onChange('descanso', val)}
          options={DESCANSOS_OPTIONS}
          placeholder="Descanso"
          className="w-full text-center"
        />
      ),
    },
    {
      key: 'notas',
      label: 'NOTAS',
      width: '18%',
      minWidth: '120px',
      render: (value: any, _row: any, onChange: any) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('notas', e.target.value)}
          className="premium-table-input"
          placeholder="Observaciones"
        />
      ),
    },
  ];
}
