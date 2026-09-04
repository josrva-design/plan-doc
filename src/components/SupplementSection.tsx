import { useState } from 'react';
import EditableTable from './EditableTable.tsx';
import useSupplementData from '../hooks/useSupplementData.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { supplementDatabase } from '../data/supplementDatabase.ts';
import SupplementPlanHeader from './ui/SupplementPlanHeader.tsx';

const HORARIO_OPTIONS = ['MAÑANA', 'TARDE', 'NOCHE', 'PRE ENTRENO', 'INTRA ENTRENO', 'POST ENTRENO', 'SIN HORARIO'];

const HORARIO_COLORS: Record<string, string> = {
  'MAÑANA': 'var(--color-primary)',
  'TARDE': 'var(--color-accent)',
  'NOCHE': 'var(--color-navy)',
  'PRE ENTRENO': 'var(--color-green)',
  'INTRA ENTRENO': 'var(--color-text-muted)',
  'POST ENTRENO': 'var(--color-danger)',
  'SIN HORARIO': 'var(--color-border)',
};

// Colores del badge de tipo de suplemento (proteina | rendimiento | salud).
// Antes se usaba HORARIO_COLORS[row.tipo], pero `tipo` no es un horario: NUNCA
// coincidía y el badge siempre caía en var(--color-primary).
const SUP_TIPO_COLORS: Record<string, string> = {
  proteina: 'var(--color-primary)',
  rendimiento: 'var(--color-green)',
  salud: 'var(--color-navy)',
};

interface SupplementSectionProps {
  printable?: boolean;
}

import { Pill } from 'lucide-react';

export default function SupplementSection({ printable = false }: SupplementSectionProps) {
  const { data, setters, showToast } = useAppContext();
  const supplements = data.supplements || [];
  const setSupplements = setters.setSupplements;

  const { addSupplement, updateSupplement, removeSupplement, reorderSupplement, onPorcionCantidadChange, stats } = useSupplementData(
    supplements,
    setSupplements,
    showToast
  );

  const updateSupplementStrategy = (value: string) => {
    if (setters.setSupplementsStrategy) {
      setters.setSupplementsStrategy(value);
    }
  };

  const supplementStrategy = data.supplementsStrategy || '';

  const rows = supplements.map((s) => ({
    ...s,
    uid: s.uid || s.id,
    horarioGrupo: (s.horario || '').trim() || 'SIN HORARIO',
  }));

  const horarioGrupos = Array.from(new Set(rows.map((r) => r.horarioGrupo)));

  const supplementNames = supplementDatabase.map((s) => s.nombre);

  const columns = [
    {
      key: 'horario',
      label: 'HORARIO',
      width: '130px',
      minWidth: '130px',
      render: (value: any, row: any, onChange: any) => (
          <select
            value={value || ''}
            onChange={(e) => onChange('horario', e.target.value)}
            className={`premium-table-select premium-table-select--sm ${!value ? 'is-placeholder' : ''}`}
          >
          <option value="" disabled>--</option>
          {HORARIO_OPTIONS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'gramos',
      label: 'GRAMOS',
      width: '58px',
      minWidth: '58px',
      align: 'center',
      render: (value: any, row: any) => (
        <div className="text-center font-bold text-[var(--color-text-primary)]" style={{ fontSize: '10px' }}>
          {value || '0'}
        </div>
      ),
    },
    {
      key: 'porcion',
      label: 'PORCIÓN',
      width: '82px',
      minWidth: '78px',
      render: (value: any, row: any, onChange: any) => {
        const match = supplementDatabase.find((ex) => ex.nombre.toLowerCase() === (row.nombre || '').toLowerCase());
        const unidad = match ? match.unidad : '';
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newCantidad = e.target.value;
          onPorcionCantidadChange(row.uid, newCantidad);
        };
        return (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              value={row.cantidad || ''}
              onChange={handleChange}
              placeholder="1"
              className="premium-table-input"
            />
            {unidad && <span className="typo-muted-sm whitespace-nowrap premium-table-unit">{unidad}</span>}
          </div>
        );
      },
    },
    {
      key: 'nombre',
      label: 'SUPLEMENTO',
      width: '38%',
      minWidth: '200px',
      render: (value: any, row: any, onChange: any) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const text = e.target.value;
          onChange('nombre', text);
          const match = supplementDatabase.find((ex) => ex.nombre.toLowerCase() === text.toLowerCase());
          if (match) {
            onChange('tipo', match.tipo);
            onChange('notas', match.nota);
            onChange('gramos', String(match.dosisEstandar || ''));
            onChange('porcion', match.porcionSugerida);
          }
        };
        const tipoColor = row.tipo ? SUP_TIPO_COLORS[row.tipo] || 'var(--color-primary)' : null;
        return (
          <div className="input-badge-group">
            <input
              value={value || ''}
              onChange={handleChange}
              placeholder="Ej: Creatina, Omega 3..."
              className="premium-table-input flex-1"
              list="supplement-datalist"
              style={{ fontWeight: 700, color: 'var(--color-navy)' }}
            />
            {tipoColor && (
              <span
                title={row.tipo}
                className="food-group-badge"
                style={{ background: tipoColor }}
              >
                {row.tipo}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'marca',
      label: 'MARCA',
      width: '110px',
      minWidth: '90px',
      render: (value: any, row: any, onChange: any) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('marca', e.target.value)}
          className="premium-table-input"
          placeholder="Marca (opcional)"
        />
      ),
    },
    {
      key: 'notas',
      label: 'NOTAS',
      width: '22%',
      minWidth: '110px',
      render: (value: any, row: any, onChange: any) => (
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
    <div className={printable ? "bg-white text-black p-3 md:p-4" : "bg-transparent p-3 md:p-4"}>
      <div className="mb-6">
        <div className="premium-page-title">
          <span className="mr-2 inline-flex items-center justify-center text-[var(--color-primary)]"><Pill size={24} /></span>
          TRATAMIENTO DE SUPLEMENTACIÓN
        </div>
        {!printable && <div className="premium-subtitle">Registro de suplementos, dosis en gramos y horario.</div>}
      </div>

      {!printable && (
        <SupplementPlanHeader
          estrategia={supplementStrategy}
          onEstrategiaChange={updateSupplementStrategy}
          totalSuplementos={stats.totalSuplementos}
        />
      )}

      <datalist id="supplement-datalist">
        {supplementNames.map((name, idx) => (
          <option key={idx} value={name} />
        ))}
      </datalist>

      <EditableTable
        columns={columns}
                showGroupHeaderBadge={false}
        rows={rows}
        getRowId={(r) => r.uid}
        onAddRow={addSupplement}
        onUpdateRow={updateSupplement}
        onRemoveRow={removeSupplement}
        onReorder={reorderSupplement}
        groupBy="horarioGrupo"
        groupConfig={horarioGrupos.reduce((acc, grupo) => {
          acc[grupo] = {
            label: grupo,
            className: 'menu-group-header',
            color: HORARIO_COLORS[grupo] || 'var(--color-primary)',
          };
          return acc;
        }, {})}
        emptyText="Sin suplementos"
        addButtonLabel="+ Suplemento"
        dragBetweenGroups={false}
      />
    </div>
  );
}
