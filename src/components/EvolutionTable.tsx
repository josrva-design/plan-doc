import React, { useCallback, useState } from 'react';
import AvanceBadge from './AvanceBadge.tsx';
import { UNIT_MAP, Section, Row } from './EvolutionConstants.ts';
import { AlertTriangle, X, Activity, Ruler, Layers, Target } from 'lucide-react';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  'Composición': <Activity size={14} />,
  'Perímetros': <Ruler size={14} />,
  'Pliegues': <Layers size={14} />,
  'Adherencia': <Target size={14} />,
};

interface EvolutionTableProps {
  title: string;
  sections: Section[];
  consultas: string[];
  dates: string[];
  cells: Record<string, Record<string, number | ''>>;
  setCell: (c: string, k: string, v: string) => void;
  removeConsulta: (idx: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, rowKey: string, consultaIdx: number) => void;
  getAvanceConsecutivo: (c: string, key: string) => number | null;
  setDates: React.Dispatch<React.SetStateAction<string[]>>;
}

function useEvolutionTableLogic({
  dates,
  setDates,
  removeConsulta,
}: {
  dates: string[];
  setDates: React.Dispatch<React.SetStateAction<string[]>>;
  removeConsulta: (idx: number) => void;
}) {
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);

  const toInputDate = (str: string) => {
    if (!str) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const parts = str.split('/');
    if (parts.length === 3) {
      const dd = parts[0].padStart(2, '0');
      const mm = parts[1].padStart(2, '0');
      const yy = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      return `${yy}-${mm}-${dd}`;
    }
    return '';
  };

  const handleDateChange = useCallback((idx: number, value: string) => {
    setDates(prev => {
      const next = [...prev];
      if (!value) {
        next[idx] = '';
      } else {
        const parts = value.split('-');
        if (parts.length === 3) {
          const dd = parts[2].padStart(2, '0');
          const mm = parts[1].padStart(2, '0');
          const yy = parts[0].slice(-2);
          next[idx] = `${dd}/${mm}/${yy}`;
        }
      }
      return next;
    });
  }, [setDates]);

  const handleRemove = useCallback((idx: number) => {
    setConfirmIdx(idx);
  }, []);

  const confirmRemove = useCallback(() => {
    const idx = confirmIdx;
    if (idx === null) return;
    setConfirmIdx(null);
    removeConsulta(idx);
  }, [confirmIdx, removeConsulta]);

  const cancelRemove = useCallback(() => {
    setConfirmIdx(null);
  }, []);

  return { toInputDate, handleDateChange, handleRemove, confirmRemove, cancelRemove, confirmIdx, setConfirmIdx };
}

function EvolutionTable({
  title,
  sections,
  consultas,
  dates,
  cells,
  setCell,
  setDates,
  removeConsulta,
  handleKeyDown,
  getAvanceConsecutivo,
}: EvolutionTableProps) {
  const { toInputDate, handleDateChange, handleRemove, confirmRemove, cancelRemove, confirmIdx } = useEvolutionTableLogic({
    dates,
    setDates,
    removeConsulta,
  });

  return (
    <>
      <div className="max-w-full overflow-x-auto mb-4 bg-white relative" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}>
        <div className="table-wrapper min-w-[1000px] w-max">
          <table className="premium-table nutrition-editor-header border border-[var(--color-border)]">
            <thead>
              <tr className="premium-table-head">
                      <th scope="col" className="premium-table-head-cell sticky left-0 z-30 nutrition-editor-header-cell evolution-param-header" style={{ width: '180px', minWidth: '180px' }}>Parámetro</th>
                 {consultas.map((c, i) => (
                      <th key={`${c}-${i}`} scope="col" className="premium-table-head-cell relative nutrition-editor-header-cell" style={{ minWidth: '110px' }}>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-center gap-1">
                            <span className="evolution-header-label">{c}</span>
                           {consultas.length > 0 && (
                             <button
                               onClick={() => handleRemove(i)}
                               className="premium-btn-delete"
                               title="Eliminar consulta"
                               aria-label={`Eliminar consulta ${c}`}
                               type="button"
                             >
                               ✕
                             </button>
                           )}
                          </div>
                              <div className="text-center w-full">
                                <input
                                  type="date"
                                  value={toInputDate(dates[i] || '')}
                                  onChange={e => handleDateChange(i, e.target.value)}
                                  className="evolution-date-input bg-transparent border-b border-transparent focus:border-[var(--color-primary)] outline-none leading-none"
                                  placeholder="Sin fecha"
                                  aria-label={`Fecha de ${c}`}
                                />
                              </div>
                         </div>
                       </th>
                 ))}
               </tr>
            </thead>
            <tbody>
               {sections.map(sec => (
                 <React.Fragment key={sec.title}>
                    <tr>
                       <td colSpan={consultas.length + 1} className="premium-table-cell sticky left-0 z-10 evolution-section-header">
                         <div className="flex items-center gap-1.5">
                           <span className="text-[var(--color-primary)]">{SECTION_ICONS[sec.title] || null}</span>
                           {sec.title}
                         </div>
                       </td>
                     </tr>
                    {sec.rows.map(row => {
                      const isTotal = row.isTotal;
                      const unit = UNIT_MAP[row.key] || "";
                      return (
                          <tr key={row.key} className={`premium-table-row ${isTotal ? "font-bold bg-gray-50 border-t-2 border-gray-200" : ""}`}>
                             <td scope="row" className="premium-table-cell evolution-param-cell sticky left-0 z-10" style={{ width: '180px', minWidth: '180px' }}>
                               <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{row.label}</span>
                             </td>
                               {consultas.map((c, idx) => {
                                 const val = cells[c]?.[row.key] ?? "";
                                 const av = idx > 0 ? getAvanceConsecutivo(c, row.key) : null;
                                 const isEmpty = val === "" || val === undefined || val === null;
                                 const displayVal = !isEmpty && unit ? `${val} ${unit}` : val;

                                  return (
                                   <td key={`${c}-${row.key}-${idx}`} className="premium-table-cell">
                                     <div className="flex flex-col items-center">
                                       <div className="inline-flex items-center gap-0">
                                         <input
                                           type="text"
                                           inputMode="decimal"
                                           value={isEmpty ? "" : displayVal}
                                           onChange={e => {
                                             const raw = e.target.value.replace(unit, '').trim();
                                             setCell(c, row.key, raw);
                                           }}
                                           onKeyDown={e => handleKeyDown(e, row.key, idx)}
                                           className={`premium-table-input text-center ${isTotal ? "font-bold" : ""}`}
                                           placeholder={isEmpty ? `${row.label}` : "-"}
                                           aria-label={`${row.label} - ${c}`}
                                         />
                                       </div>
                                       {idx > 0 && <AvanceBadge value={av} goal={row.goal} />}
                                     </div>
                                   </td>
                                 );
                               })}
                          </tr>
                      );
                    })}
                 </React.Fragment>
               ))}
             </tbody>
           </table>
         </div>
       </div>
       {confirmIdx !== null && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={cancelRemove} />
           <div className="relative bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl border border-[var(--color-border)]">
             <div className="flex items-start gap-3">
               <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 grid place-items-center shrink-0">
                 <AlertTriangle size={16} />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-[var(--color-text-primary)]">¿Eliminar consulta {consultas[confirmIdx]}?</h3>
                 <p className="text-xs text-[var(--color-text-muted)] mt-1">Esta acción no se puede deshacer.</p>
               </div>
             </div>
             <div className="flex gap-2 mt-5">
               <button onClick={cancelRemove} className="flex-1 py-2 rounded-full border border-[var(--color-border)] text-xs font-semibold" type="button">Cancelar</button>
               <button onClick={confirmRemove} className="flex-1 py-2 rounded-full bg-[var(--color-danger)] text-white text-xs font-semibold" type="button">Eliminar</button>
             </div>
             <button onClick={cancelRemove} className="absolute top-3 right-3 w-6 h-6 grid place-items-center rounded-full hover:bg-[var(--color-bg-subtle)]" type="button">
               <X size={14} />
             </button>
           </div>
         </div>
       )}
     </>
   );
}

export default EvolutionTable;
