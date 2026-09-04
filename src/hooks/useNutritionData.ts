import { useCallback, useEffect, useRef } from 'react';
import type { AppData } from '../core/types.ts';
import type { Setters } from '../hooks/useAppData.ts';
import { findFoodByName, getUnidadFromLabel, buildAlimentoMacros } from '../utils/nutritionHelpers.ts';
import { foodDatabase } from '../data/foodDatabase.ts';

const EMPTY_ALIMENTO = () => ({ gramos: '', porcion: '', porcionBase: '', cantidad: '1', nombre: '', p: '', c: '', g: '', kcal: '' });

export default function useNutritionData(data: AppData, setters: Setters, showToast: (msg: string) => void) {
  const { meals } = data;
  const { setMeals } = setters;

  const updateMeal = useCallback((idx, field, value) => {
    setMeals(prev => prev.map((meal, i) => (i === idx ? { ...meal, [field]: value } : meal)));
  }, [setMeals]);

  const updateMenuName = useCallback((mealIdx, menuId, nombre) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      return { ...meal, menus: menus.map((m) => (m.id === menuId ? { ...m, nombre } : m)) };
    }));
  }, [setMeals]);

  const addMeal = useCallback(() => {
    const tiempos = ['DESAYUNO', 'COMIDA', 'CENA', 'SNACK', 'PRE', 'POST', 'AYUNAS', 'ANTES DORMIR'];
    const tiempo = tiempos[Math.floor(Math.random() * tiempos.length)];
    const newMeal = { id: Date.now().toString(), hora: '12:00', tiempo, menus: [{ id: Date.now().toString() + '-menu', nombre: 'Menú A', alimentos: [EMPTY_ALIMENTO()] }] };
    setMeals(prev => [...prev, newMeal]);
    showToast('Comida agregada');
  }, [setMeals, showToast]);

  const removeMeal = useCallback((idx) => {
    setMeals(prev => prev.filter((_, i) => i !== idx));
    showToast('Comida eliminada');
  }, [setMeals, showToast]);

  const addMenu = useCallback((mealIdx) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      const letter = String.fromCharCode(65 + menus.length);
      const newMenu = { id: Date.now().toString(), nombre: 'Menú ' + letter, alimentos: [EMPTY_ALIMENTO()] };
      return { ...meal, menus: [...menus, newMenu] };
    }));
    showToast('Menú agregado');
  }, [setMeals, showToast]);

  const removeMenu = useCallback((mealIdx, menuIdx) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      const newMenus = menus.filter((_, j) => j !== menuIdx);
      if (newMenus.length === 0) return null;
      return { ...meal, menus: newMenus };
    }).filter(Boolean));
    showToast('Menú eliminado');
  }, [setMeals, showToast]);

  const addAlimento = useCallback((mealIdx, menuIdx) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      return {
        ...meal,
        menus: menus.map((m, j) => {
          if (j !== menuIdx) return m;
          const alimentos = Array.isArray(m.alimentos) ? m.alimentos : [];
          return { ...m, alimentos: [...alimentos, EMPTY_ALIMENTO()] };
        }),
      };
    }));
    showToast('Alimento agregado');
  }, [setMeals, showToast]);

  const removeAlimento = useCallback((mealIdx, menuIdx, alimIdx) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      const updatedMenus = menus.map((m, j) => {
        if (j !== menuIdx) return m;
        const alimentos = Array.isArray(m.alimentos) ? m.alimentos : [];
        const newAlimentos = alimentos.filter((_, k) => k !== alimIdx);
        return { ...m, alimentos: newAlimentos };
      }).filter(m => (m.alimentos || []).length > 0);
      if (updatedMenus.length === 0) return null;
      return { ...meal, menus: updatedMenus };
    }).filter(Boolean));
    showToast('Alimento eliminado');
  }, [setMeals, showToast]);

  const reorderAlimento = useCallback((fromUid, toUid) => {
    const parseUid = (uid) => {
      const parts = String(uid).split('-');
      return {
        mealIdx: parseInt(parts[1], 10),
        menuIdx: parseInt(parts[2], 10),
        alimIdx: parseInt(parts[3], 10),
      };
    };
    const from = parseUid(fromUid);
    const to = parseUid(toUid);
    if (from.mealIdx !== to.mealIdx || from.menuIdx !== to.menuIdx) return;
    if (from.alimIdx === to.alimIdx) return;
    setMeals(prev => prev.map((meal, i) => {
      if (i !== from.mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      return {
        ...meal,
        menus: menus.map((m, j) => {
          if (j !== from.menuIdx) return m;
          const alimentos = Array.isArray(m.alimentos) ? m.alimentos : [];
          const next = [...alimentos];
          const [moved] = next.splice(from.alimIdx, 1);
          next.splice(to.alimIdx, 0, moved);
          return { ...m, alimentos: next };
        }),
      };
    }));
  }, [setMeals]);

  const updateMenu = useCallback((mealIdx, menuId, nombre) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      return { ...meal, menus: menus.map((m) => (m.id === menuId ? { ...m, nombre } : m)) };
    }));
  }, [setMeals]);

  const updateAlimentoDeep = useCallback((mealIdx, menuIdx, alimIdx, updater) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      return {
        ...meal,
        menus: menus.map((m, j) => {
          if (j !== menuIdx) return m;
          const alimentos = Array.isArray(m.alimentos) ? m.alimentos : [];
          return { ...m, alimentos: alimentos.map((a, k) => (k === alimIdx ? updater(a) : a)) };
        }),
      };
    }));
  }, [setMeals]);

  const autofillAlimento = useCallback((mealIdx, menuIdx, alimIdx, food) => {
    if (!food || !food.porciones || food.porciones.length === 0) return;
    const defaultPorcion = food.porciones[0];
    updateAlimentoDeep(mealIdx, menuIdx, alimIdx, (a) => ({
      ...a,
      nombre: food.nombre,
      porcion: defaultPorcion.label,
      porcionBase: defaultPorcion.label,
      cantidad: '1',
      ...buildAlimentoMacros(a, defaultPorcion, 1),
    }));
  }, [updateAlimentoDeep]);

  const autofillRef = useRef(false);
  useEffect(() => {
    if (autofillRef.current) return;
    const needsAutofill = (meals || []).some((meal) => {
      const foods = Array.isArray(meal.foods) ? meal.foods : [];
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      return foods.some((f) => !f.grupo || !f.porcion || !f.p || !f.c || !f.g || !f.kcal) || menus.some((m) => (m.alimentos || []).some((a) => !a.grupo || !a.porcion || !a.p || !a.c || !a.g || !a.kcal));
    });
    if (!needsAutofill) return;
    autofillRef.current = true;
    const nextMeals = meals.map((meal) => {
      const foods = Array.isArray(meal.foods) ? meal.foods : [];
      const menus = Array.isArray(meal.menus) ? meal.menus : [];
      const updatedFoods = foods.map((f) => {
        if (f.grupo && f.porcion && f.p && f.c && f.g && f.kcal) return f;
        const match = findFoodByName(f.nombre);
        if (!match || !match.porciones || match.porciones.length === 0) return f;
        const porcion = match.porciones[0];
        return {
          ...f,
          grupo: f.grupo || match.grupo || '',
          porcion: f.porcion || porcion.label,
          porcionBase: f.porcionBase || porcion.label,
          cantidad: f.cantidad || '1',
          p: f.p || String(porcion.p),
          c: f.c || String(porcion.c),
          g: f.g || String(porcion.g),
          kcal: f.kcal || String(porcion.kcal),
        };
      });
      const updatedMenus = menus.map((m) => ({
        ...m,
        alimentos: (m.alimentos || []).map((a) => {
          if (a.grupo && a.porcion && a.p && a.c && a.g && a.kcal) return a;
          const match = findFoodByName(a.nombre);
          if (!match || !match.porciones || match.porciones.length === 0) return a;
          const porcion = match.porciones[0];
          return {
            ...a,
            grupo: a.grupo || match.grupo || '',
            porcion: a.porcion || porcion.label,
            porcionBase: a.porcionBase || porcion.label,
            cantidad: a.cantidad || '1',
            p: a.p || String(porcion.p),
            c: a.c || String(porcion.c),
            g: a.g || String(porcion.g),
            kcal: a.kcal || String(porcion.kcal),
          };
        }),
      }));
      return { ...meal, foods: updatedFoods, menus: updatedMenus };
    });
    setMeals(nextMeals);
  }, [meals, setMeals]);

  const onPorcionCantidadChange = useCallback((mealIdx, menuIdx, alimIdx, newCantidad) => {
    updateAlimentoDeep(mealIdx, menuIdx, alimIdx, (a) => {
      const cantidad = parseFloat(newCantidad) || 1;
      const food = findFoodByName(a.nombre);
      if (!food || !food.porciones || food.porciones.length === 0) {
        return { ...a, cantidad: newCantidad };
      }
      const porcion = food.porciones.find((p) => p.label === a.porcionBase) || food.porciones[0];
      const unidad = getUnidadFromLabel(porcion.label);
      const plural = cantidad > 1 ? 's' : '';
      return {
        ...a,
        cantidad: newCantidad,
        porcion: `${cantidad} ${unidad}${plural}`,
        ...buildAlimentoMacros(a, porcion, cantidad),
      };
    });
  }, [updateAlimentoDeep]);

  const recalculateAlimento = useCallback((mealIdx, menuIdx, alimIdx, newGramos) => {
    updateAlimentoDeep(mealIdx, menuIdx, alimIdx, (a) => {
      const formatted = newGramos ? `${newGramos}g` : '';
      const updated = { ...a, gramos: formatted };
      const food = findFoodByName(a.nombre);
      if (!food || !newGramos || !food.porciones || food.porciones.length === 0) {
        return updated;
      }
      const base = food.porciones.find((p) => p.label === a.porcionBase) || food.porciones[0];
      const ratio = parseFloat(newGramos) / base.gramos;
      const cantidad = parseFloat(ratio.toFixed(2));
      const unidad = getUnidadFromLabel(base.label);
      const plural = cantidad > 1 ? 's' : '';
      return {
        ...updated,
        porcion: `${cantidad} ${unidad}${plural}`,
        cantidad: cantidad.toString(),
        p: (base.p * ratio).toFixed(1),
        c: (base.c * ratio).toFixed(1),
        g: (base.g * ratio).toFixed(1),
        kcal: Math.round(base.kcal * ratio),
      };
    });
  }, [updateAlimentoDeep]);

  const updateMenuType = useCallback((mealIdx, menuType) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      if (meal.menuType === menuType) return meal;
      if (menuType === 'armar') {
        const foods = Array.isArray(meal.foods) && meal.foods.length > 0 ? meal.foods : [EMPTY_ALIMENTO()];
        return { ...meal, menuType, foods, menus: [] };
      }
      const menus = Array.isArray(meal.menus) && meal.menus.length > 0 ? meal.menus : [{ id: Date.now().toString(), nombre: 'Menú A', alimentos: [EMPTY_ALIMENTO()] }];
      return { ...meal, menuType, menus, foods: [] };
    }));
  }, [setMeals]);

  const addFood = useCallback((mealIdx, grupo) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const foods = Array.isArray(meal.foods) ? meal.foods : [];
      const newFood = { ...EMPTY_ALIMENTO(), grupo: grupo || '' };
      return { ...meal, foods: [...foods, newFood] };
    }));
    showToast('Alimento agregado');
  }, [setMeals, showToast]);

  const removeFood = useCallback((mealIdx, foodIdx) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const foods = Array.isArray(meal.foods) ? meal.foods : [];
      return { ...meal, foods: foods.filter((_, k) => k !== foodIdx) };
    }));
    showToast('Alimento eliminado');
  }, [setMeals, showToast]);

  const updateFood = useCallback((mealIdx, foodIdx, updater) => {
    setMeals(prev => prev.map((meal, i) => {
      if (i !== mealIdx) return meal;
      const foods = Array.isArray(meal.foods) ? meal.foods : [];
      return { ...meal, foods: foods.map((f, k) => (k === foodIdx ? updater(f) : f)) };
    }));
  }, [setMeals]);

  const reorderFood = useCallback((fromUid, toUid) => {
    const parseUid = (uid) => {
      const parts = String(uid).split('-');
      return {
        mealIdx: parseInt(parts[1], 10),
        foodIdx: parseInt(parts[2], 10),
      };
    };
    const from = parseUid(fromUid);
    const to = parseUid(toUid);
    if (from.mealIdx !== to.mealIdx || from.foodIdx === to.foodIdx) return;
    setMeals(prev => prev.map((meal, i) => {
      if (i !== from.mealIdx) return meal;
      const foods = Array.isArray(meal.foods) ? meal.foods : [];
      const next = [...foods];
      const [moved] = next.splice(from.foodIdx, 1);
      next.splice(to.foodIdx, 0, moved);
      return { ...meal, foods: next };
    }));
  }, [setMeals]);

  const duplicateMeal = useCallback((mealIdx) => {
    setMeals(prev => {
      const meal = prev[mealIdx];
      if (!meal) return prev;
      const copy = JSON.parse(JSON.stringify(meal));
      copy.id = Date.now().toString();
      if (copy.menus) {
        copy.menus = copy.menus.map((m, i) => ({
          ...m,
          id: Date.now().toString() + '-menu-' + i,
          alimentos: (m.alimentos || []).map(a => ({ ...a })),
        }));
      }
      if (copy.foods) {
        copy.foods = copy.foods.map(f => ({ ...f }));
      }
      const next = [...prev];
      next.splice(mealIdx + 1, 0, copy);
      return next;
    });
    showToast('Comida duplicada');
  }, [setMeals, showToast]);

  return {
    updateMeal,
    updateMenuName,
    addMeal,
    removeMeal,
    addMenu,
    removeMenu,
    addAlimento,
    removeAlimento,
    updateMenu,
    updateAlimentoDeep,
    autofillAlimento,
    onPorcionCantidadChange,
    recalculateAlimento,
    reorderAlimento,
    updateMenuType,
    addFood,
    removeFood,
    updateFood,
    reorderFood,
    duplicateMeal,
  };
}
