import { useMemo, useState, useCallback, useEffect } from 'react';
import Modal from './ui/Modal.tsx';
import { foodDatabase } from '../data/foodDatabase.ts';
import { getGrupoLabel, getGrupoColor } from '../utils/nutritionHelpers.ts';

interface FoodPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (foodName: string) => void;
  filtros: Record<string, string>;
  onFiltrosChange: (filtros: Record<string, string>) => void;
}

type FilterKey = 'grupo' | 'subgrupo';
const FILTER_KEYS: FilterKey[] = ['grupo', 'subgrupo'];

export default function FoodPickerModal({ isOpen, onClose, onSelect, filtros, onFiltrosChange }: FoodPickerModalProps) {
  const [busqueda, setBusqueda] = useState('');
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBusqueda('');
      setFiltrosExpandidos(false);
    }
  }, [isOpen]);

  const uniqueValues = useCallback(
    (key: FilterKey) => {
      const set = new Set<string>();
      foodDatabase.forEach((f) => {
        const val = f[key as keyof typeof f];
        if (typeof val === 'string' && val) set.add(val);
      });
      return Array.from(set).sort();
    },
    []
  );

  const lista = useMemo(() => {
    const term = (busqueda || '').trim().toLowerCase();
    return foodDatabase.filter((f) => {
      const matchBusqueda = !term ||
        (f.nombre || '').toLowerCase().includes(term) ||
        (f.grupo || '').toLowerCase().includes(term) ||
        (f.subgrupo || '').toLowerCase().includes(term);
      if (!matchBusqueda) return false;
      return FILTER_KEYS.every((key) => {
        const filterVal = filtros[key];
        if (!filterVal) return true;
        const val = f[key as keyof typeof f];
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
    onFiltrosChange({ grupo: '', subgrupo: '' });
  };

  const handleConfirm = (nombre: string) => {
    onSelect(nombre);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Seleccionar Alimento"
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn btn-outline">Cancelar</button>
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
        </div>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <input
            autoFocus
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar alimento, grupo o subgrupo..."
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

        {filtrosExpandidos && (
          <div className="flex flex-wrap items-end gap-2 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
            {FILTER_KEYS.map((key) => {
              const values = uniqueValues(key);
              const active = filtros[key];
              return (
                <div key={key} className="flex flex-col gap-1">
                  <span className="typo-label" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-navy)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {key === 'grupo' ? 'Grupo' : 'Subgrupo'}
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
          {lista.map((food) => {
            const grupoColor = getGrupoColor(food.grupo);
            return (
              <button
                key={food.id}
                type="button"
                onClick={() => handleConfirm(food.nombre)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-bg-subtle)] text-left transition-colors"
              >
                <div 
                  className="w-2 h-8 rounded-full" 
                  style={{ backgroundColor: grupoColor }} 
                />
                <div className="flex-1 min-w-0">
                  <span className="block font-semibold text-[var(--color-text-primary)] text-sm truncate">
                    {food.nombre}
                  </span>
                  <span className="block text-[11px] text-[var(--color-text-secondary)] truncate">
                    {food.grupo} {food.subgrupo ? `· ${food.subgrupo}` : ''}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-[10px] font-bold text-[var(--color-navy)]">
                    {food.porciones?.[0]?.kcal || 0} kcal
                  </span>
                  <span className="block text-[9px] text-[var(--color-text-secondary)]">
                    {food.porciones?.[0]?.gramos || 0}g
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
