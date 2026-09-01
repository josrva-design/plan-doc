import React, { useMemo, useState } from 'react';
import EditableTable from './EditableTable.jsx';

const TIPOS = ['Normal', 'Biserie', 'Triserie', 'Circuito'];
const REPS_OPTIONS = ['4-6', '6-8', '8-10', '10-12', '12-15', '15-20', '20+'];

  const GROUP_CONFIG = {
    general: { label: 'GENERAL', color: 'var(--color-primary)', className: 'warmup-phase--general' },
    movilidad: { label: 'MOVILIDAD', color: 'var(--color-primary-300)', className: 'warmup-phase--movilidad' },
    especifico: { label: 'ESPECIFICO', color: 'var(--color-primary-200)', className: 'warmup-phase--especifico' },
  };

function ejToDisplay(e) {
  if (!e) {
    return {
      uid: Math.random().toString(36).slice(2),
      serie: 'Normal',
      ejercicio: '',
      sets: 1,
      reps: '15-20',
      descanso: '30 seg',
      notas: '',
      video: '_',
      grupo: '',
      groupLabel: '',
      color: 'var(--color-primary)',
      blockLetter: '',
      blockSerie: 'Normal',
      isFirstInBlock: true,
      isLastInBlock: true,
      isOption: false,
      optionNumber: null,
    };
  }
  return {
    uid: e.uid || Math.random().toString(36).slice(2),
    serie: e.tipo || 'Normal',
    ejercicio: e.ejercicio || '',
    sets: e.sets ?? 1,
    reps: e.reps ?? '15-20',
    descanso: e.pausa ?? '30 seg',
    notas: e.notas ?? '',
    video: e.video ?? '_',
    grupo: e.grupo || '',
    groupLabel: '',
    color: 'var(--color-primary)',
    blockLetter: '',
    blockSerie: 'Normal',
    isFirstInBlock: true,
    isLastInBlock: true,
    isOption: false,
    optionNumber: null,
  };
}

function displayToEj(d) {
  return {
    tipo: d.serie || 'Normal',
    grupo: d.grupo || '',
    video: d.video ?? '_',
    ejercicio: d.ejercicio || '',
    sets: String(d.sets ?? 1),
    reps: d.reps ?? '15-20',
    pausa: d.descanso ?? '30 seg',
    notas: d.notas ?? '',
  };
}

function upperToBlocks(upper) {
  if (!upper) return [];
  const blocks = [];
  Object.entries(GROUP_CONFIG).forEach(([key, config]) => {
    const exercises = upper[key];
    if (!Array.isArray(exercises)) return;
    exercises.forEach((ej) => {
      blocks.push({ ...ejToDisplay(ej), grupo: key, groupLabel: config.label, color: config.color });
    });
  });
  return blocks;
}

function blocksToUpper(bloques) {
  const upper = { general: [], movilidad: [], especifico: [] };
  bloques.forEach((b) => {
    const grupo = b.grupo || 'general';
    if (upper[grupo]) {
      upper[grupo].push(displayToEj(b, grupo));
    }
  });
  return upper;
}

function groupSeries(items) {
  const LIMIT = { Normal: 99, Biserie: 2, Triserie: 3, Circuito: 5 };
  const groups = [];
  let cur = [];
  let lastSerie = null;

  items.forEach((e) => {
    const lim = LIMIT[e.serie];
    if (e.serie === 'Normal' || lastSerie !== e.serie || cur.length >= lim) {
      if (cur.length) {
        groups.push({ serie: lastSerie, items: cur });
        cur = [];
      }
    }
    cur.push(e);
    lastSerie = e.serie;
    if (cur.length >= lim) {
      groups.push({ serie: lastSerie, items: cur });
      cur = [];
    }
  });

  if (cur.length) groups.push({ serie: lastSerie, items: cur });
  return groups.filter((g) => g.items.length > 0);
}

function getCombinedSections(bloques) {
  const ordered = [];
  Object.entries(GROUP_CONFIG).forEach(([key]) => {
    ordered.push(...bloques.filter((b) => b.grupo === key));
  });

  const serieGroups = groupSeries(ordered).map((g, idx) => ({ ...g, letter: String.fromCharCode(65 + idx) }));

  let generalIndex = 0;
  const items = [];

  serieGroups.forEach((g) => {
    const grupo = g.items[0]?.grupo || 'general';

    g.items.forEach((ej, i) => {
      const isOption = grupo === 'general' && generalIndex < 3;
      const optionNumber = isOption ? generalIndex + 1 : null;
      if (isOption) generalIndex++;

      items.push({
        ...ej,
        isFirstInBlock: i === 0 && g.items.length > 0,
        isLastInBlock: i === g.items.length - 1 && g.items.length > 0,
        blockLetter: g.letter,
        blockSerie: g.serie,
        blockPosition: i + 1,
        isOption,
        optionNumber,
        fase: GROUP_CONFIG[grupo]?.label || 'GENERAL',
        faseColor: GROUP_CONFIG[grupo]?.color || 'var(--color-primary)',
      });
    });
  });

  return items;
}

export default function WarmupSection({ upper, onUpperChange, printable = false, title }) {
  const [dragUid, setDragUid] = useState(null);
  const [dropUid, setDropUid] = useState(null);
  const [activeGroup, setActiveGroup] = useState('general');
  const [editingTipoUid, setEditingTipoUid] = useState(null);
  const [tipoHoverUid, setTipoHoverUid] = useState(null);

  const bloques = useMemo(() => upperToBlocks(upper), [upper]);

  const addFila = () => {
    const color = GROUP_CONFIG[activeGroup]?.color || 'var(--color-primary)';
    const label = GROUP_CONFIG[activeGroup]?.label || 'GENERAL';
    const next = [
      ...bloques,
      {
        uid: Math.random().toString(36).slice(2),
        serie: 'Normal',
        ejercicio: '',
        sets: 1,
        reps: '15-20',
        descanso: '30 seg',
        notas: '',
        grupo: activeGroup,
        groupLabel: label,
        color: color,
        video: '_',
      },
    ];
    if (onUpperChange) onUpperChange(blocksToUpper(next));
  };

  const update = (uid, field, val) => {
    const next = bloques.map((b) => (b.uid === uid ? { ...b, [field]: val } : b));
    if (onUpperChange) onUpperChange(blocksToUpper(next));
  };

  const remove = (uid) => {
    const next = bloques.filter((b) => b.uid !== uid);
    if (onUpperChange) onUpperChange(blocksToUpper(next));
  };

  const reorder = (fromUid, toUid) => {
    const fromIdx = bloques.findIndex((b) => b.uid === fromUid);
    const toIdx = bloques.findIndex((b) => b.uid === toUid);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...bloques];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    if (onUpperChange) onUpperChange(blocksToUpper(next));
  };

  const sections = useMemo(() => getCombinedSections(bloques), [bloques]);

  const columns = [
    {
      key: 'serie',
      label: 'TIPO',
      width: '10%',
      minWidth: '42px',
      maxWidth: '50px',
      render: (value, row, onChange, uid) => {
        const isEditing = editingTipoUid === uid;
        const isHovering = tipoHoverUid === uid;

        if (isEditing) {
          return (
            <select
              autoFocus
              value={value}
              onChange={(e) => {
                onChange('serie', e.target.value);
                setEditingTipoUid(null);
              }}
              onBlur={() => setEditingTipoUid(null)}
              className="premium-cell-select text-[10px] w-full"
            >
              {TIPOS.map((t) => (
                <option key={t}>{t}</option>
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
            {row.isOption && (
              <div className="warmup-option-accent">
                OPCIÓN {row.optionNumber}
              </div>
            )}
            {!printable && (
              <button
                onClick={() => setEditingTipoUid(uid)}
                onMouseEnter={() => setTipoHoverUid(uid)}
                onMouseLeave={() => setTipoHoverUid(null)}
                className="warmup-tipo-text"
              >
                {isHovering ? '_' : value}
              </button>
            )}
            {printable && <span className="warmup-tipo-text">{value}</span>}
          </div>
        );
      },
    },
    {
      key: 'serie',
      label: 'Serie',
      width: '8%',
      minWidth: '48px',
      maxWidth: '48px',
      align: 'center',
      render: (value, row, onChange, uid, idx) => {
        const label = row.fase === 'GENERAL' ? 'A1' : `${row.blockLetter}${row.blockPosition}`;
        return (
          <span className="warmup-serie">
            {label}
          </span>
        );
      },
    },
    {
      key: 'fase',
      label: 'FASE',
      width: '10%',
      minWidth: '60px',
      align: 'center',
      render: (value, row) => {
        const faseColorMap = { GENERAL: 'var(--color-primary)', MOVILIDAD: 'var(--color-green)', ESPECIFICO: 'var(--color-navy)' };
        const color = faseColorMap[row.fase] || row.faseColor || 'var(--color-primary)';
        return (
          <span style={{ color, fontSize: '9px', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {row.fase || 'GENERAL'}
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
      render: () => (
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
      render: (value, row, onChange) => (
        <input
          value={value}
          onChange={(e) => onChange('ejercicio', e.target.value)}
          className="premium-table-input"
          placeholder="Elige un movimiento"
        />
      ),
    },
    {
      key: 'sets',
      label: 'SETS',
      width: '8%',
      minWidth: '48px',
      maxWidth: '48px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          type="number"
          min="1"
          value={value}
          onChange={(e) => onChange('sets', e.target.value)}
          className="premium-table-input text-center"
          placeholder="1"
        />
      ),
    },
    {
      key: 'reps',
      label: 'REPS',
      width: '9%',
      minWidth: '48px',
      maxWidth: '60px',
      align: 'center',
      render: (value, row, onChange) => {
        if (row.grupo === 'general') {
          return (
            <input
              value={value}
              onChange={(e) => onChange('reps', e.target.value)}
              className="premium-table-input text-center"
            />
          );
        }

        return (
          <div className="warmup-reps-wrapper">
            <select
              value={value}
              onChange={(e) => onChange('reps', e.target.value)}
              className="premium-table-select premium-table-select--sm"
            >
              {REPS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <span className="warmup-reps-arrow">▾</span>
          </div>
        );
      },
    },
    {
      key: 'descanso',
      label: 'DESC',
      width: '8%',
      minWidth: '48px',
      maxWidth: '55px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          value={value}
          onChange={(e) => onChange('descanso', e.target.value)}
          className="premium-table-input text-center"
          placeholder="30"
        />
      ),
    },
    {
      key: 'notas',
      label: 'NOTAS',
      render: (value, row, onChange) => (
        <input
          value={value}
          onChange={(e) => onChange('notas', e.target.value)}
          className="premium-table-input"
          placeholder="Notas"
        />
      ),
    },
  ];

  return (
    <div>
      {!printable && (
        <div className="flex items-center gap-2 mb-3">
          <span className="typo-label">AGREGAR A:</span>
          {Object.entries(GROUP_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveGroup(key)}
              className={
                'premium-btn-pill ' +
                (activeGroup === key
                  ? 'premium-btn-pill--primary'
                  : 'premium-btn-pill--ghost')
              }
              style={{ borderColor: config.color }}
            >
              {config.label}
            </button>
          ))}
        </div>
      )}

      <EditableTable
        columns={columns}
        rows={sections}
        getRowId={(r) => r.uid}
        onAddRow={addFila}
        onUpdateRow={update}
        onRemoveRow={remove}
        onReorder={reorder}
        emptyText="Sin ejercicios"
        addButtonLabel="+ agregar ejercicio"
        dragBetweenGroups={false}
      />
    </div>
  );
}
