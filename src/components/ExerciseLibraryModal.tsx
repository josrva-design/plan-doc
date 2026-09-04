import { useMemo, useState, useCallback } from 'react';
import Modal from './ui/Modal.tsx';
import { exerciseDatabase } from '../data/exerciseDatabase.ts';

interface ExerciseLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (names: string[]) => void;
  filtros: Record<string, string>;
  onFiltrosChange: (filtros: Record<string, string>) => void;
}

type FilterKey = 'musculo' | 'movimiento' | 'grupo';

const FILTER_KEYS: FilterKey[] = ['musculo', 'movimiento', 'grupo'];

export default function ExerciseLibraryModal({ open, onClose, onConfirm, filtros, onFiltrosChange }: ExerciseLibraryModalProps) {
  const [busqueda, setBusqueda] = useState('');
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [otroNombre, setOtroNombre] = useState('');
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

  const uniqueValues = useCallback(
    (key: FilterKey) => {
      const set = new Set<string>();
      exerciseDatabase.forEach((ex) => {
        const val = ex[key as keyof typeof ex];
        if (typeof val === 'string' && val) set.add(val);
      });
      return Array.from(set).sort();
    },
    []
  );

  const lista = useMemo(() => {
    const term = (busqueda || '').trim().toLowerCase();
    return exerciseDatabase.filter((ex) => {
      const matchBusqueda = !term ||
        (ex.nombre || '').toLowerCase().includes(term) ||
        (ex.musculo || '').toLowerCase().includes(term) ||
        (ex.movimiento || '').toLowerCase().includes(term);
      if (!matchBusqueda) return false;
      return FILTER_KEYS.every((key) => {
        const filterVal = filtros[key];
        if (!filterVal) return true;
        const val = ex[key as keyof typeof ex];
        if (typeof val === 'string') return val === filterVal;
        return true;
      });
    });
  }, [busqueda, filtros]);

  const hasActiveFilters = FILTER_KEYS.some((key) => filtros[key]);

  const toggleFiltro = (key: FilterKey, value: string) => {
    onFiltrosChange({
      ...filtros,
      [key]: filtros[key] === value ? '' : value,
    });
  };

  const clearFilters = () => {
    onFiltrosChange({ musculo: '', movimiento: '', grupo: '' });
  };

  const toggle = (nombre: string) => {
    setSeleccion((prev) =>
      prev.includes(nombre) ? prev.filter((n) => n !== nombre) : [...prev, nombre]
    );
  };

  const resetSelection = () => {
    setSeleccion([]);
    setBusqueda('');
    setOtroNombre('');
  };

  const handleClose = () => {
    resetSelection();
    onClose();
  };

  const handleConfirm = () => {
    if (seleccion.length === 0) return;
    onConfirm(seleccion);
    resetSelection();
  };

  const addOtro = () => {
    const nombre = otroNombre.trim();
    if (!nombre) return;
    if (!seleccion.includes(nombre)) {
      setSeleccion((prev) => [...prev, nombre]);
    }
    setOtroNombre('');
  };

  const handleBusquedaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const exact = exerciseDatabase.find((ex) => ex.nombre.toLowerCase() === busqueda.trim().toLowerCase());
      if (exact) {
        toggle(exact.nombre);
        setBusqueda('');
      } else if (busqueda.trim()) {
        addOtro();
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Agregar ejercicio"
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={handleClose} className="btn btn-outline">Cancelar</button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-outline"
                style={{ fontSize: '11px' }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
          <button
            onClick={handleConfirm}
            disabled={seleccion.length === 0}
            className="btn btn--primary disabled:opacity-30"
          >
            Agregar ({seleccion.length})
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <input
            autoFocus
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={handleBusquedaKeyDown}
            placeholder="Buscar ejercicio…"
            className="premium-table-input flex-1"
          />
          <button
            type="button"
            onClick={() => setFiltrosExpandidos((prev) => !prev)}
            className={`btn ${filtrosExpandidos ? 'btn--primary' : 'btn-outline'}`}
            style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
          >
            {filtrosExpandidos ? 'Ocultar filtros' : 'Filtros'}
            {hasActiveFilters && !filtrosExpandidos && (
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  marginLeft: 6,
                }}
              />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={otroNombre}
            onChange={(e) => setOtroNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addOtro();
              }
            }}
            placeholder="+ Otro ejercicio"
            className="premium-table-input flex-1"
          />
          <button
            type="button"
            onClick={addOtro}
            disabled={!otroNombre.trim()}
            className="btn btn-outline disabled:opacity-30"
          >
            Agregar
          </button>
        </div>

        {filtrosExpandidos && (
          <div className="flex flex-wrap items-end gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            {FILTER_KEYS.map((key) => {
              const values = uniqueValues(key);
              const active = filtros[key];
              return (
                <div key={key} className="flex flex-col gap-1">
                  <span className="typo-label" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {key === 'musculo' ? 'Músculo' : key === 'movimiento' ? 'Movimiento' : 'Grupo'}
                  </span>
                   <select
                     value={active}
                     onChange={(e) => toggleFiltro(key, e.target.value)}
                     className={`premium-table-select ${!active ? 'is-placeholder' : ''}`}
                     style={{ minWidth: '130px' }}
                   >
                    <option value="">Todos</option>
                    {values.map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-1 max-h-80 overflow-y-auto">
          {lista.length === 0 && (
            <div className="text-center py-6 typo-muted-sm">Sin resultados</div>
          )}
          {lista.map((ex) => {
            const checked = seleccion.includes(ex.nombre);
            return (
              <button
                key={ex.nombre}
                type="button"
                onClick={() => toggle(ex.nombre)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-colors ${
                  checked
                    ? 'border-[var(--color-primary)] bg-[var(--color-bg-subtle)]'
                    : 'border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)]'
                }`}
              >
                <span
                  className={`w-4 h-4 shrink-0 rounded border grid place-items-center text-[10px] ${
                    checked ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'border-[var(--color-border)]'
                  }`}
                >
                  {checked ? '✓' : ''}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-[var(--color-text-primary)] text-sm truncate">
                    {ex.nombre}
                  </span>
                  <span className="block text-[11px] text-[var(--color-text-secondary)] truncate">
                    {[ex.musculo, ex.movimiento].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}