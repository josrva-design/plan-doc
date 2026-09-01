import React from 'react';
import EditableTable from './EditableTable.jsx';
import SectionTitle from './SectionTitle.jsx';
import { useAppContext } from '../context/AppContext.jsx';

const columns = [
  {
    key: 'horario',
    label: 'HORARIO',
    width: '130px',
    minWidth: '130px',
    render: (value, row, onChange) => (
      <select
        value={value || ''}
        onChange={(e) => onChange('horario', e.target.value)}
        className="premium-table-select premium-table-select--sm"
      >
        <option value="" disabled>--</option>
        <option value="MAÑANA">MAÑANA</option>
        <option value="TARDE">TARDE</option>
        <option value="NOCHE">NOCHE</option>
        <option value="PRE ENTRENO">PRE ENTRENO</option>
        <option value="INTRA ENTRENO">INTRA ENTRENO</option>
        <option value="POST ENTRENO">POST ENTRENO</option>
        <option value="SIN HORARIO">SIN HORARIO</option>
      </select>
    ),
  },
  {
    key: 'nombre',
    label: 'SUPLEMENTO',
    width: '35%',
    minWidth: '180px',
    render: (value, row, onChange) => (
      <input
        value={value || ''}
        onChange={(e) => onChange('nombre', e.target.value)}
        className="premium-table-input"
        placeholder="Ej: Creatina, Omega 3..."
      />
    ),
  },
  {
    key: 'gramos',
    label: 'GRAMOS',
    width: '70px',
    minWidth: '70px',
    align: 'center',
    render: (value, row, onChange) => (
      <input
        type="number"
        min="0"
        value={value || ''}
        onChange={(e) => onChange('gramos', e.target.value)}
        className="premium-table-input text-center"
        placeholder="0"
      />
    ),
  },
  {
    key: 'porcion',
    label: 'PORCIÓN',
    width: '70px',
    minWidth: '70px',
    render: (value, row, onChange) => (
      <input
        value={value || ''}
        onChange={(e) => onChange('porcion', e.target.value)}
        className="premium-table-input"
        placeholder="Ej: 1 cucharita, 2 cápsulas..."
      />
    ),
  },
  {
    key: 'notas',
    label: 'NOTAS',
    width: '25%',
    minWidth: '120px',
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

export default function SupplementSection() {
  const { data, setters, showToast } = useAppContext();
  const supplements = data.supplements || [];
  const setSupplements = setters.setSupplements;

  const addSupplement = () => {
    setSupplements([
      ...supplements,
      { id: Date.now().toString(), nombre: '', gramos: '', porcion: '', horario: '', notas: '' },
    ]);
    showToast('Suplemento agregado');
  };

  const updateSupplement = (uid, field, value) => {
    if (field === 'horario') {
      const currentGroupHoras = supplements.reduce((acc, s) => {
        if (s.id === uid) return acc;
        const grupo = (s.horario || '').trim() || 'SIN HORARIO';
        if (s.hora && !acc[grupo]) acc[grupo] = s.hora;
        return acc;
      }, {});
      setSupplements(supplements.map((s) => {
        if (s.id !== uid) return s;
        const nuevoGrupo = (value || '').trim() || 'SIN HORARIO';
        const horaDelNuevoGrupo = currentGroupHoras[nuevoGrupo];
        return { ...s, horario: value, hora: horaDelNuevoGrupo || s.hora };
      }));
    } else {
      setSupplements(supplements.map((s) => (s.id === uid ? { ...s, [field]: value } : s)));
    }
  };

  const removeSupplement = (uid) => {
    setSupplements(supplements.filter((s) => s.id !== uid));
    showToast('Suplemento eliminado');
  };

  const groupHoras = supplements.reduce((acc, s) => {
    const grupo = (s.horario || '').trim() || 'SIN HORARIO';
    if (s.hora && !acc[grupo]) acc[grupo] = s.hora;
    return acc;
  }, {});

  const setGroupHora = (grupo, hora) => {
    setSupplements(supplements.map((s) => {
      const g = (s.horario || '').trim() || 'SIN HORARIO';
      return g === grupo ? { ...s, hora } : s;
    }));
  };

  const rows = supplements.map((s) => ({
    ...s,
    uid: s.id,
    horarioGrupo: (s.horario || '').trim() || 'SIN HORARIO',
  }));

  const horarioColors = {
    'MAÑANA': '#0066CC',
    'TARDE': '#CC6600',
    'NOCHE': '#0D2640',
    'PRE ENTRENO': '#2E9E70',
    'INTRA ENTRENO': '#6b7280',
    'POST ENTRENO': '#DC2626',
    'SIN HORARIO': '#d1d5db',
  };

  const horarioGrupos = Array.from(new Set(rows.map((r) => r.horarioGrupo)));

  return (
    <div>
      <div className="premium-page-title">SUPLEMENTOS</div>
      <div className="premium-subtitle">Registro de suplementos, dosis en gramos y horario.</div>

      <div style={{ marginTop: 18 }}>
        <EditableTable
          columns={columns}
          rows={rows}
          getRowId={(r) => r.uid}
          onAddRow={addSupplement}
          onUpdateRow={updateSupplement}
          onRemoveRow={removeSupplement}
          groupBy="horarioGrupo"
          groupConfig={horarioGrupos.reduce((acc, grupo) => {
            acc[grupo] = {
              label: grupo,
              className: 'menu-group-header',
              color: horarioColors[grupo] || '#0066CC',
            };
            return acc;
          }, {})}
          groupHora={groupHoras}
          onGroupHoraChange={setGroupHora}
          emptyText="Sin suplementos"
          addButtonLabel="+ Suplemento"
          dragBetweenGroups={false}
        />
      </div>
    </div>
  );
}
