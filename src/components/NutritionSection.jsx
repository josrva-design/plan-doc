import React, { useState } from 'react';
import SectionTitle from './SectionTitle.jsx';
import EditableTable from './EditableTable.jsx';
import useNutritionData from '../hooks/useNutritionData.js';
import { findFoodByName, getGrupoColor, getGrupoLabel, getUnidadFromLabel, getMealTotalKcal } from '../utils/nutritionHelpers.js';
import { foodDatabase } from '../data/foodDatabase.js';
import { useAppContext } from '../context/AppContext.jsx';

const TIEMPO_OPTIONS = ['DESAYUNO', 'COMIDA', 'CENA', 'SNACK', 'PRE', 'POST', 'AYUNAS', 'ANTES DORMIR'];
const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'LUNES', tuesday: 'MARTES', wednesday: 'MIÉRCOLES', thursday: 'JUEVES', friday: 'VIERNES', saturday: 'SÁBADO', sunday: 'DOMINGO' };

const getMealLocation = (meals, flatIdx) => {
  const list = Array.isArray(meals) ? meals : [];
  if (flatIdx < 0 || flatIdx >= list.length) return null;
  return { dayKey: list[flatIdx].dayKey, localIdx: flatIdx };
};

export default function NutritionSection({ printable = false }) {
  const { data, setters, showToast } = useAppContext();
  const { meals, nutrition = {} } = data;
  const { updateMeal, updateMenuName, addMeal, removeMeal, addMenu, removeMenu, addAlimento, removeAlimento, updateMenu, updateAlimentoDeep, autofillAlimento, onPorcionCantidadChange, recalculateAlimento } = useNutritionData(data, setters, showToast);

  const [editingMenuId, setEditingMenuId] = useState(null);
  const [selectedDayForAdd, setSelectedDayForAdd] = useState('monday');

  const mealsList = Array.isArray(meals) ? meals : [];

  const updateNutrition = (key, value) => {
    if (setters.setNutrition) {
      setters.setNutrition(prev => ({ ...prev, [key]: value }));
    }
  };

  const nutritionPlanFields = [
    { key: 'estrategia', label: 'Estrategia', placeholder: 'Ej: Menú fijo + Armar plato' },
    { key: 'kcal', label: 'Kcal', placeholder: 'Ej: 1850', type: 'number' },
    { key: 'prot', label: 'Proteína (g)', placeholder: 'Ej: 165', type: 'number' },
    { key: 'carbs', label: 'Carbos (g)', placeholder: 'Ej: 180', type: 'number' },
    { key: 'grasas', label: 'Grasas (g)', placeholder: 'Ej: 55', type: 'number' },
  ];

  const columns = [
    {
      key: 'gramos',
      label: 'GRAMOS',
      width: '8%',
      minWidth: '50px',
      render: (value, row, onChange, uid, idx) => {
        const handleChange = (e) => {
          onChange('gramos', e.target.value);
        };
        const handleBlur = (e) => {
          const raw = e.target.value.replace(/[^\d.]/g, '');
          if (!raw) return;
          const parts = uid.split('-');
          const mealIdx = parseInt(parts[1], 10);
          const menuIdx = parseInt(parts[2], 10);
          const alimIdx = parseInt(parts[3], 10);
          recalculateAlimento(mealIdx, menuIdx, alimIdx, raw);
        };
        return (
          <input
            type="text"
            inputMode="decimal"
            value={value || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="100 g"
            className="premium-table-input"
          />
        );
      },
    },
    {
      key: 'porcion',
      label: 'CANT',
      width: '10%',
      minWidth: '60px',
      render: (value, row, onChange, uid, idx) => {
        const handleChange = (e) => {
          const newCantidad = e.target.value;
          onChange('cantidad', newCantidad);
          const parts = uid.split('-');
          const mealIdx = parseInt(parts[1], 10);
          const menuIdx = parseInt(parts[2], 10);
          const alimIdx = parseInt(parts[3], 10);
          onPorcionCantidadChange(mealIdx, menuIdx, alimIdx, newCantidad);
        };
        const food = findFoodByName(row.nombre);
        const base = food?.porciones?.find((p) => p.label === row.porcionBase) || food?.porciones?.[0];
        const unidad = base ? getUnidadFromLabel(base.label) : '';
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
            {unidad && <span className="typo-muted-sm whitespace-nowrap">{unidad}</span>}
          </div>
        );
      },
    },
    {
      key: 'nombre',
      label: 'ALIMENTO',
      render: (value, row, onChange, uid, idx) => {
        const handleChange = (e) => {
          const newNombre = e.target.value;
          const food = findFoodByName(newNombre);
          if (food) {
            const parts = uid.split('-');
            const mealIdx = parseInt(parts[1], 10);
            const menuIdx = parseInt(parts[2], 10);
            const alimIdx = parseInt(parts[3], 10);
            autofillAlimento(mealIdx, menuIdx, alimIdx, food);
          } else {
            onChange('nombre', newNombre);
          }
        };
        const food = findFoodByName(value);
        const grupo = food?.grupo || null;
        const grupoColor = getGrupoColor(grupo);
        const grupoLabel = getGrupoLabel(grupo);
        const equivalentes = food ? foodDatabase.filter((f) => f.grupo === grupo && f.nombre !== value).map((f) => f.nombre) : [];
        return (
          <div className="input-badge-group">
            <input
              list="food-datalist"
              value={value || ''}
              onChange={handleChange}
              placeholder="Alimento"
              className="premium-table-input"
              style={{ flex: 1 }}
            />
            {grupo && (
              <span
                title={equivalentes.length > 0 ? `Equivalentes: ${equivalentes.join(', ')}` : grupoLabel}
                className={"food-group-badge" + (equivalentes.length > 0 ? " food-group-badge--help" : "")}
                style={{ backgroundColor: grupoColor }}
              >
                {grupoLabel}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'p',
      label: 'P',
      width: '5%',
      minWidth: '35px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('p', e.target.value)}
          placeholder="0"
          className="premium-table-input text-center"
        />
      ),
    },
    {
      key: 'c',
      label: 'C',
      width: '5%',
      minWidth: '35px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('c', e.target.value)}
          placeholder="0"
          className="premium-table-input text-center"
        />
      ),
    },
    {
      key: 'g',
      label: 'G',
      width: '5%',
      minWidth: '35px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('g', e.target.value)}
          placeholder="0"
          className="premium-table-input text-center"
        />
      ),
    },
    {
      key: 'kcal',
      label: 'KCAL',
      width: '6%',
      minWidth: '45px',
      align: 'center',
      render: (value, row, onChange) => (
        <input
          value={value || ''}
          onChange={(e) => onChange('kcal', e.target.value)}
          placeholder="0"
          className="premium-table-input text-center"
        />
      ),
    },
  ];

  return (
    <div className={printable ? "space-y-3" : "space-y-4"}>
      <div>
        <div className="premium-page-title">TRATAMIENTO NUTRICIONAL</div>
        {!printable && <div className="premium-subtitle">Plan de comidas, alimentos y seguimiento nutricional.</div>}
      </div>

      {!printable && (
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4">
          <p className="typo-label mb-3">Plan nutricional</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {nutritionPlanFields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <p className="typo-label">{label}</p>
                <input
                  type={type || 'text'}
                  value={nutrition[key] || ''}
                  onChange={(e) => updateNutrition(key, type === 'number' ? (e.target.value ? Number(e.target.value) : '') : e.target.value)}
                  placeholder={placeholder}
                  className="mt-1 w-full bg-transparent outline-none typo-input border-b border-transparent focus:border-[var(--color-primary)] input-placeholder"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <datalist id="food-datalist">
        {foodDatabase.map((food, idx) => (
          <option key={idx} value={food.nombre} />
        ))}
      </datalist>

      <div>
        <div className={printable ? "flex items-center mb-3" : "flex justify-between items-center mb-4"}>
          {!printable && (
            <button onClick={() => addMeal(selectedDayForAdd)} className="premium-btn-pill premium-btn-pill--primary print-hide">
              + Comida
            </button>
          )}
        </div>

       {mealsList.map((meal, mIdx) => (
            <div key={meal.id || mIdx} className={printable ? "meal-section" : "meal-section"}>
              <div className="flex flex-wrap gap-3 items-center mb-3">
                <div className="flex gap-2 items-center">
                  {!printable && (
                  <input
                    type="time"
                    value={meal.hora}
                    onChange={(e) => updateMeal(mIdx, 'hora', e.target.value)}
                    className="bg-[var(--color-green)] text-white rounded-lg px-2 py-1 typo-input border border-[var(--color-green)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  )}
                  {!printable && (
                  <select
                    value={meal.tiempo}
                    onChange={(e) => updateMeal(mIdx, 'tiempo', e.target.value)}
                    className="bg-[var(--color-primary)] text-white rounded-lg px-3 py-1 typo-btn border border-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    {TIEMPO_OPTIONS.map((t) => (
                      <option key={t} value={t} className="text-black">
                        {t}
                      </option>
                    ))}
                  </select>
                  )}
                  {printable && <span className="text-sm font-bold text-[var(--color-primary)]">{meal.tiempo} - {meal.hora}</span>}
                  <span className="typo-muted-sm">{getMealTotalKcal(meal)} kcal</span>
                </div>
              </div>

             {(meal.menus || []).length === 0 && (
               <div className="text-center py-4 typo-muted-sm">Sin menús</div>
             )}

             <EditableTable
               columns={columns}
               rows={(meal.menus || []).flatMap((menu, menuIdx) =>
                 (menu.alimentos || []).map((alimento, alimIdx) => ({
                   ...alimento,
                   menuId: menu.id || menuIdx,
                   _menuIdx: menuIdx,
                   _alimIdx: alimIdx,
                 }))
               )}
               getRowId={(row) => 'alim-' + mIdx + '-' + row._menuIdx + '-' + row._alimIdx}
               groupBy="menuId"
                groupConfig={(meal.menus || []).reduce((acc, menu, idx) => {
                   const letter = String.fromCharCode(65 + idx);
                   acc[menu.id || idx] = { 
                     label: menu.nombre || 'Menú ' + letter, 
                     blockLetter: letter,
                     blockSerie: 'Menú',
                     className: 'menu-group-header' 
                   };
                   return acc;
                 }, {})}
                onGroupLabelChange={(menuId, nombre) => updateMenuName(mIdx, menuId, nombre)}
               onUpdateRow={(uid, field, value) => {
                 const parts = uid.split('-');
                 const mealIdx = parseInt(parts[1], 10);
                 const menuIdx = parseInt(parts[2], 10);
                 const alimIdx = parseInt(parts[3], 10);
                 updateAlimentoDeep(mealIdx, menuIdx, alimIdx, (a) => ({ ...a, [field]: value }));
               }}
               onRemoveRow={(uid) => {
                 const parts = uid.split('-');
                 const menuIdx = parseInt(parts[2], 10);
                 const alimIdx = parseInt(parts[3], 10);
                 removeAlimento(mIdx, menuIdx, alimIdx);
               }}
               emptyText="Sin alimentos"
               dragBetweenGroups={false}
               groupAddRow={(meal.menus || []).reduce((acc, menu, idx) => {
                 acc[menu.id || idx] = () => addAlimento(mIdx, idx);
                 return acc;
               }, {})}
               groupRemoveRow={(meal.menus || []).reduce((acc, menu, idx) => {
                 acc[menu.id || idx] = () => removeMenu(mIdx, idx);
                 return acc;
               }, {})}
              />

             {(meal.menus || []).length === 0 && (
               <div className="text-center py-4 typo-muted-sm">Sin menús</div>
             )}

             {!printable && (meal.menus || []).some(menu => (menu.alimentos || []).length === 0) && (
               <div className="mt-2">
                 <button onClick={() => { const menuIdx = 0; addAlimento(mIdx, menuIdx); }} className="premium-btn-pill premium-btn-pill--primary print-hide">
                   + Alimento
                 </button>
               </div>
             )}

             {!printable && (
               <button onClick={() => addMenu(mIdx)} className="premium-btn-pill premium-btn-pill--ghost print-hide">
                + Menú
               </button>
             )}
           </div>
         ))}
      </div>
    </div>
  );
}
