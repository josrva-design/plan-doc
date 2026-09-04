import { useMemo } from 'react';
import SectionTitle from './ui/SectionTitle.tsx';
import EditableTable from './EditableTable.tsx';
import useNutritionData from '../hooks/useNutritionData.ts';
import { getMealTotalKcal, getMealTotalMacros, getTotalKcalFromMeals, getTotalMacrosFromMeals, getMacroPercentages, findFoodByName, getGrupoColor, getGrupoLabel, getUnidadFromLabel, buildAlimentoMacros } from '../utils/nutritionHelpers.ts';
import { foodDatabase } from '../data/foodDatabase.ts';
import { useAppContext } from '../context/AppContext.tsx';
import NutritionPlanHeader from './ui/NutritionPlanHeader.tsx';
import { Apple } from 'lucide-react';
import { FoodPickerProvider, useFoodPicker } from './FoodPickerContext.tsx';

const TIEMPO_OPTIONS = ['DESAYUNO', 'COMIDA', 'CENA', 'SNACK', 'PRE', 'POST', 'AYUNAS', 'ANTES DORMIR'];

interface NutritionSectionProps {
  printable?: boolean;
}

function NutritionEditor({ printable }: NutritionSectionProps) {
  const { data, setters, showToast } = useAppContext();
  const { meals, nutrition = {} } = data;
  const { updateMeal, updateMenuName, addMeal, removeMeal, addMenu, removeMenu, addAlimento, removeAlimento, updateMenu, updateAlimentoDeep, autofillAlimento, onPorcionCantidadChange, recalculateAlimento, reorderAlimento, updateMenuType, addFood, removeFood, updateFood, reorderFood, duplicateMeal } = useNutritionData(data, setters, showToast);

  const mealsList = Array.isArray(meals) ? meals : [];

  const totalKcal = useMemo(() => getTotalKcalFromMeals(meals), [meals]);
  const totalMacros = useMemo(() => getTotalMacrosFromMeals(meals), [meals]);
  const macroPercentages = useMemo(() => getMacroPercentages(meals), [meals]);

  const updateNutrition = (key: string, value: any) => {
    if (setters.setNutrition) {
      setters.setNutrition((prev: any) => ({ ...prev, [key]: value }));
    }
  };

  const handleFoodSelect = (uid: string, foodName: string) => {
    const food = findFoodByName(foodName);
    if (!food) return;
    const parts = uid.split('-');
    const mealIdx = parseInt(parts[1], 10);
    const defaultPorcion = food.porciones?.[0];
    if (uid.startsWith('food-')) {
      const foodIdx = parseInt(parts[2], 10);
      const grupo = food.grupo || '';
      updateFood(mealIdx, foodIdx, (f) => ({
        ...f,
        nombre: food.nombre,
        grupo,
        porcion: defaultPorcion?.label || '',
        porcionBase: defaultPorcion?.label || '',
        cantidad: '1',
        ...(defaultPorcion ? buildAlimentoMacros(f, defaultPorcion, 1) : {}),
      }));
    } else {
      const menuIdx = parseInt(parts[2], 10);
      const alimIdx = parseInt(parts[3], 10);
      autofillAlimento(mealIdx, menuIdx, alimIdx, food);
    }
  };

  const { openPicker } = useFoodPicker();

  const columns = [
    {
      key: 'gramos',
      label: 'GRAMOS',
      width: '8%',
      minWidth: '50px',
      render: (value: any, row: any, onChange: any, uid: string, idx: number) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange('gramos', e.target.value);
        };
        const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/[^\d.]/g, '');
          if (!raw) return;
          const parts = uid.split('-');
          const mealIdx = parseInt(parts[1], 10);
          if (uid.startsWith('food-')) {
            const foodIdx = parseInt(parts[2], 10);
            const food = findFoodByName(row.nombre);
            const base = food?.porciones?.find((p) => p.label === row.porcionBase) || food?.porciones?.[0];
            if (base) {
              const ratio = parseFloat(raw) / base.gramos;
              updateFood(mealIdx, foodIdx, (f) => ({
                ...f,
                grams: `${raw}g`,
                gramos: `${raw}g`,
                porcion: `${parseFloat(ratio.toFixed(2))} ${getUnidadFromLabel(base.label)}`,
                cantidad: parseFloat(ratio.toFixed(2)).toString(),
                p: (base.p * ratio).toFixed(1),
                c: (base.c * ratio).toFixed(1),
                g: (base.g * ratio).toFixed(1),
                kcal: Math.round(base.kcal * ratio),
              }));
            } else {
              updateFood(mealIdx, foodIdx, (f) => ({ ...f, grams: `${raw}g`, gramos: `${raw}g` }));
            }
          } else {
            const menuIdx = parseInt(parts[2], 10);
            const alimIdx = parseInt(parts[3], 10);
            recalculateAlimento(mealIdx, menuIdx, alimIdx, raw);
          }
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
      label: 'PORCIÓN',
      width: '10%',
      minWidth: '60px',
      render: (value: any, row: any, onChange: any, uid: string, idx: number) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newCantidad = e.target.value;
          onChange('cantidad', newCantidad);
          const parts = uid.split('-');
          const mealIdx = parseInt(parts[1], 10);
          if (uid.startsWith('food-')) {
            const foodIdx = parseInt(parts[2], 10);
            const food = findFoodByName(row.nombre);
            const base = food?.porciones?.find((p) => p.label === row.porcionBase) || food?.porciones?.[0];
          if (base) {
            const cantidad = parseFloat(newCantidad) || 1;
            const unidad = getUnidadFromLabel(base.label);
            const plural = cantidad > 1 ? 's' : '';
            updateFood(mealIdx, foodIdx, (f) => ({
              ...f,
              cantidad: newCantidad,
              porcion: `${cantidad} ${unidad}${plural}`,
              grams: `${Math.round(base.gramos * cantidad)}g`,
              gramos: `${Math.round(base.gramos * cantidad)}g`,
              p: (base.p * cantidad).toFixed(1),
              c: (base.c * cantidad).toFixed(1),
              g: (base.g * cantidad).toFixed(1),
              kcal: Math.round(base.kcal * cantidad),
            }));
          }
          } else {
            const menuIdx = parseInt(parts[2], 10);
            const alimIdx = parseInt(parts[3], 10);
            onPorcionCantidadChange(mealIdx, menuIdx, alimIdx, newCantidad);
          }
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
              {unidad && <span className="typo-muted-sm whitespace-nowrap premium-table-unit">{unidad}</span>}
          </div>
        );
      },
    },
    {
      key: 'nombre',
      label: 'ALIMENTO',
      render: (value: any, row: any, onChange: any, uid: string, idx: number) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newNombre = e.target.value;
          const food = findFoodByName(newNombre);
          if (food) {
            handleFoodSelect(uid, food.nombre);
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
              value={value || ''}
              onChange={handleChange}
              onClick={() => openPicker(uid, (name) => handleFoodSelect(uid, name))}
              placeholder="Alimento"
              className="premium-table-input flex-1"
              style={{ fontWeight: 700, color: 'var(--color-navy)' }}
            />
            {grupo && (
              <span
                title={equivalentes.length > 0 ? `Equivalentes: ${equivalentes.join(', ')}` : grupoLabel}
                className={"food-group-badge food-group-badge--" + (grupo || 'default') + (equivalentes.length > 0 ? " food-group-badge--help" : "")}
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
      render: (value: any, row: any, onChange: any) => (
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
      render: (value: any, row: any, onChange: any) => (
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
      render: (value: any, row: any, onChange: any) => (
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
      render: (value: any, row: any, onChange: any) => (
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
    <div className="p-3 md:p-4">
      <div className="mb-6">
        <div className="premium-page-title">
          <span className="mr-2 mt-[1px] inline-flex items-center justify-center text-[var(--color-primary)]"><Apple size={24} /></span>
          TRATAMIENTO NUTRICIONAL
        </div>
        {!printable && <div className="premium-subtitle">Plan de comidas, alimentos y seguimiento nutricional.</div>}
      </div>

      {!printable && (
        <NutritionPlanHeader
          estrategia={nutrition.estrategia}
          onEstrategiaChange={(value) => updateNutrition('estrategia', value)}
          totalKcal={totalKcal}
          totalMacros={totalMacros}
          macroPercentages={macroPercentages}
        />
      )}

      {mealsList.map((meal, mIdx) => {
        return (
          <div key={meal.id || mIdx} className="meal-card mt-4 first:mt-0">
            <div className="flex flex-wrap gap-3 items-center mb-3">
              <div className="flex gap-2 items-center flex-1 min-w-0">
                {!printable && (
                  <div className="flex items-center gap-1">
                    <select
                      value={meal.hora ? meal.hora.split(':')[0] : ''}
                      onChange={(e) => {
                        const current = meal.hora ? meal.hora.split(':')[1] || '00' : '00';
                        const padded = e.target.value.padStart(2, '0');
                        updateMeal(mIdx, 'hora', `${padded}:${current}`);
                      }}
                      className="meal-pill-input cursor-pointer"
                    >
                      <option value="" className="meal-mode-option">HH</option>
                      {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((h) => (
                        <option key={h} value={h} className="meal-mode-option">{h}</option>
                      ))}
                    </select>
                    <span className="text-white font-extrabold text-[8px] leading-none">:</span>
                    <select
                      value={meal.hora ? meal.hora.split(':')[1] : ''}
                      onChange={(e) => {
                        const current = meal.hora ? meal.hora.split(':')[0] || '00' : '00';
                        const padded = e.target.value.padStart(2, '0');
                        updateMeal(mIdx, 'hora', `${current}:${padded}`);
                      }}
                      className="meal-pill-input cursor-pointer"
                      style={{ marginLeft: -2 }}
                    >
                      <option value="" className="meal-mode-option">MM</option>
                      {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                        <option key={m} value={m} className="meal-mode-option">{m}</option>
                      ))}
                    </select>
                  </div>
                )}

                {!printable && (
                  <select
                    value={meal.tiempo}
                    onChange={(e) => updateMeal(mIdx, 'tiempo', e.target.value)}
                    className={`meal-select min-w-[110px] ${!meal.tiempo ? 'is-placeholder' : ''}`}
                  >
                    {TIEMPO_OPTIONS.map((t) => (
                      <option key={t} value={t} className="meal-select-option">{t}</option>
                    ))}
                  </select>
                )}

                {!printable && (
                  <select
                    value={meal.menuType || 'fijo'}
                    onChange={(e) => updateMenuType(mIdx, e.target.value)}
                    className={`meal-mode-select min-w-[120px] ${!meal.menuType ? 'is-placeholder' : ''}`}
                  >
                    <option value="fijo" className="meal-mode-option">Menú fijo</option>
                    <option value="armar" className="meal-mode-option">Armar menú</option>
                  </select>
                )}

                {!printable && (
                  <div className="flex items-center gap-2 ml-2">
                    <span className="meal-kcal">{getMealTotalKcal(meal)} kcal</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-white/50 rounded-full border border-[var(--color-border)] text-[9px] font-bold text-[var(--color-navy)] shadow-sm">
                      <span className="text-blue-600">P: {getMealTotalMacros(meal).p.toFixed(1)}g</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <span className="text-green-600">C: {getMealTotalMacros(meal).c.toFixed(1)}g</span>
                      <span className="text-gray-300 mx-1">|</span>
                      <span className="text-amber-600">G: {getMealTotalMacros(meal).g.toFixed(1)}g</span>
                    </div>
                  </div>
                )}
              </div>
              {!printable && (
                <div className="meal-card-actions">
                  {(meal.menuType || 'fijo') === 'fijo' && (
                    <button onClick={() => addMenu(mIdx)} className="premium-btn-pill premium-btn-pill--ghost print-hide">
                      + Menú
                    </button>
                  )}
                  <button onClick={() => duplicateMeal(mIdx)} className="premium-btn-pill premium-btn-pill--ghost print-hide">
                    Duplicar
                  </button>
                  <button onClick={() => removeMeal(mIdx)} className="premium-btn-pill premium-btn-pill--danger print-hide">
                    × Eliminar
                  </button>
                </div>
              )}
            </div>

            {(meal.menuType === 'armar' ? (meal.foods || []).length === 0 : (meal.menus || []).length === 0) && (
              <div className="text-center py-4 typo-muted-sm">
                {meal.menuType === 'armar' ? 'Sin alimentos' : 'Sin menús'}
              </div>
            )}

            {(meal.menuType || 'fijo') === 'fijo' ? (
              <EditableTable
                variant="nutrition"
                columns={columns}
                showGroupHeaderBadge={false}
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
                   const cleanName = (menu.nombre || '').replace(/^MENU-\d+\s*/i, '').trim() || 'Menú ' + letter;
                   acc[menu.id || idx] = { 
                     label: cleanName, 
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
                onReorder={reorderAlimento}
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
                headerStyle={{ fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                headerClassName="nutrition-editor-header"
              />
            ) : (
              <EditableTable
                variant="nutrition"
                columns={columns}
                showGroupHeaderBadge={false}
                rows={(meal.foods || []).map((food, foodIdx) => ({
                  ...food,
                  _foodIdx: foodIdx,
                }))}
                getRowId={(row) => 'food-' + mIdx + '-' + row._foodIdx}
                groupBy="grupo"
                groupConfig={{
                   lacteos: { label: 'Lácteos', blockLetter: 'L', blockSerie: 'GRUPO', className: 'menu-group-header', color: 'var(--color-blue)' },
                   verduras: { label: 'Verduras', blockLetter: 'V', blockSerie: 'GRUPO', className: 'menu-group-header', color: 'var(--color-green)' },
                   frutas: { label: 'Frutas', blockLetter: 'F', blockSerie: 'GRUPO', className: 'menu-group-header', color: 'var(--color-accent)' },
                  proteinas: { label: 'Proteínas', blockLetter: 'P', blockSerie: 'MACRO', className: 'menu-group-header', color: 'var(--color-primary)' },
                  carbohidratos: { label: 'Carbohidratos', blockLetter: 'C', blockSerie: 'MACRO', className: 'menu-group-header', color: 'var(--color-green)' },
                  grasas: { label: 'Grasas', blockLetter: 'G', blockSerie: 'MACRO', className: 'menu-group-header', color: 'var(--color-accent)' },
                }}
                groupAddRow={{
                   lacteos: () => addFood(mIdx, 'lacteos'),
                   verduras: () => addFood(mIdx, 'verduras'),
                   frutas: () => addFood(mIdx, 'frutas'),
                  proteinas: () => addFood(mIdx, 'proteinas'),
                  carbohidratos: () => addFood(mIdx, 'carbohidratos'),
                  grasas: () => addFood(mIdx, 'grasas'),
                }}
                hideEmptyGroups={true}
                onUpdateRow={(uid, field, value) => {
                  const parts = uid.split('-');
                  const mealIdx = parseInt(parts[1], 10);
                  const foodIdx = parseInt(parts[2], 10);
                  updateFood(mealIdx, foodIdx, (f) => ({ ...f, [field]: value }));
                }}
                onRemoveRow={(uid) => {
                  const parts = uid.split('-');
                  const foodIdx = parseInt(parts[2], 10);
                  removeFood(mealIdx, foodIdx);
                }}
                onReorder={reorderFood}
                emptyText="Sin alimentos"
                dragBetweenGroups={false}
                headerStyle={{ fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                headerClassName="nutrition-editor-header"
              />
            )}
          </div>
        );
      })}
      {!printable && (
        <div className="mt-3 flex justify-start">
          <button onClick={() => addMeal()} className="premium-btn-pill premium-btn-pill--primary print-hide">
            + Comida
          </button>
        </div>
      )}
    </div>
  );
}

export default function NutritionSection(props: NutritionSectionProps) {
  return (
    <FoodPickerProvider>
      <NutritionEditor {...props} />
    </FoodPickerProvider>
  );
}
