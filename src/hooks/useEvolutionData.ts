import { useState, useMemo, useCallback } from 'react';
import { CONSULTAS, PLIEGUES_KEYS, Section, Row } from '../components/EvolutionConstants';

export interface EvolutionData {
  dates: string[];
  cells: Record<string, Record<string, number | ''>>;
  consultas: string[];
}

export interface UseEvolutionDataReturn {
  dates: string[];
  cells: Record<string, Record<string, number | ''>>;
  consultas: string[];
  setCell: (c: string, k: string, v: string) => void;
  setDates: (dates: string[]) => void;
  addConsulta: () => void;
  removeConsulta: (idx: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, rowKey: string, consultaIdx: number) => void;
  getSeries: (key: string) => (number | null)[];
  numericSeries: (key: string) => number[];
  lastC: string;
  firstC: string;
  activeConsultas: string[];
  getAvanceConsecutivo: (c: string, key: string) => number | null;
  avanceGlobal: (key: string) => number | null;
  handleClear: () => void;
}

export default function useEvolutionData(
  data: EvolutionData,
  setData: (value: EvolutionData) => void,
  showToast?: (msg: string) => void
): UseEvolutionDataReturn {
  const dates = data.dates || [''];
  const cells = data.cells || {};
  const consultas = data.consultas || ['C1'];

  const setDates = useCallback((newDates: string[]) => {
    const sanitized = newDates.map(d => {
      if (!d || !d.trim()) return '';
      const m = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
      if (!m) return d;
      const dd = m[1].padStart(2, '0');
      const mm = m[2].padStart(2, '0');
      const yy = m[3].length === 2 ? `20${m[3]}` : m[3];
      return `${dd}/${mm}/${yy.slice(-2)}`;
    });
    setData(prev => ({ ...prev, dates: sanitized }));
  }, [setData]);

  const addConsulta = useCallback(() => {
    const nextNum = consultas.length + 1;
    const nextLabel = `C${nextNum}`;
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const todayStr = `${dd}/${mm}/${yy}`;
    setData(prev => ({
      ...prev,
      consultas: [...prev.consultas, nextLabel],
      dates: [...prev.dates, todayStr],
      cells: { ...prev.cells, [nextLabel]: {} }
    }));
  }, [consultas.length, setData]);

  const removeConsulta = useCallback((idx: number) => {
    const label = consultas[idx];
    setData(prev => {
      const newConsultas = prev.consultas.filter((_, i) => i !== idx);
      const newDates = prev.dates.filter((_, i) => i !== idx);
      const newCells = { ...prev.cells };
      delete newCells[label];
      return { ...prev, consultas: newConsultas, dates: newDates, cells: newCells };
    });
  }, [consultas, setData]);

  const setCell = useCallback((c: string, k: string, v: string) => {
    const cidx = consultas.indexOf(c);
    const trimmed = v.trim();
    const num = trimmed === '' ? '' : parseFloat(trimmed);
    const isValid = trimmed === '' || (!isNaN(num as number) && /^[0-9]*\.?[0-9]*$/.test(trimmed));
    setData(prev => {
      const newDates = [...prev.dates];
      if (cidx >= 0 && !newDates[cidx]?.trim() && trimmed !== '') {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yy = String(today.getFullYear()).slice(-2);
        newDates[cidx] = `${dd}/${mm}/${yy}`;
      }
      return {
        ...prev,
        dates: newDates,
        cells: { ...prev.cells, [c]: { ...prev.cells?.[c], [k]: isValid ? num : '' } }
      };
    });
  }, [consultas, setData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, rowKey: string, consultaIdx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentInput = e.target as HTMLInputElement;
      const table = currentInput.closest('table');
      if (!table) return;
      const allInputs = Array.from(table.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
      const currentIndex = allInputs.indexOf(currentInput);
      if (currentIndex >= 0 && currentIndex < allInputs.length - 1) {
        const nextInput = allInputs[currentIndex + 1];
        if (nextInput && nextInput.isConnected) nextInput.focus();
      }
    } else if (e.key === 'Backspace') {
      const currentInput = e.target as HTMLInputElement;
      if (currentInput.value === '' || currentInput.value === undefined) {
        e.preventDefault();
        const table = currentInput.closest('table');
        if (!table) return;
        const allInputs = Array.from(table.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
        const currentIndex = allInputs.indexOf(currentInput);
        if (currentIndex > 0) {
          const prevInput = allInputs[currentIndex - 1];
          if (prevInput && prevInput.isConnected) prevInput.focus();
        }
      }
    }
  }, [consultas]);

  const getSeries = useCallback((key: string) => {
    return consultas.map(c => {
      if (key === 'sum_pliegues') {
        let total = 0, count = 0;
        PLIEGUES_KEYS.forEach(k => { const n = cells[c]?.[k]; if (typeof n === 'number') { total += n; count++; } });
        return cells[c]?.sum_pliegues ?? (count ? total : null);
      }
      return typeof cells[c]?.[key] === 'number' ? cells[c][key] : null;
    });
  }, [cells, consultas]);

  const numericSeries = useCallback((key: string) => getSeries(key).filter(v => typeof v === 'number'), [getSeries]);

  const lastIdx = useMemo(() =>
    [...consultas].reverse().findIndex(c => typeof cells[c]?.peso === 'number'),
    [cells, consultas]
  );
  const lastC = useMemo(() =>
    lastIdx === -1 ? consultas[0] : consultas[consultas.length - 1 - lastIdx],
    [lastIdx, consultas]
  );
  const firstC = useMemo(() => consultas[0], [consultas]);

  const activeConsultas = useMemo(() => {
    return consultas.filter(c => Object.keys(cells[c] || {}).length > 0 || dates[consultas.indexOf(c)]?.trim());
  }, [cells, dates, consultas]);

  const getAvanceConsecutivo = useCallback((c: string, key: string) => {
    const idx = consultas.indexOf(c);
    if (idx === 0) return null;
    const prevC = consultas[idx - 1];
    const currVal = cells[c]?.[key];
    const prevVal = cells[prevC]?.[key];
    if (typeof currVal !== 'number' || typeof prevVal !== 'number') return null;
    return currVal - prevVal;
  }, [cells, consultas]);

  const avanceGlobal = useCallback((key: string) => {
    const f = cells[firstC]?.[key];
    const l = cells[lastC]?.[key];
    if (typeof f !== 'number' || typeof l !== 'number') return null;
    return l - f;
  }, [cells, firstC, lastC]);

  const handleClear = useCallback(() => {
    const emptyCells: Record<string, Record<string, number | ''>> = {};
    consultas.forEach(c => emptyCells[c] = {});
    setData(prev => ({ ...prev, cells: emptyCells, dates: consultas.map(() => '') }));
    showToast?.('Tabla limpiada');
  }, [setData, showToast, consultas]);

  return {
    dates, cells, consultas, setCell, setDates, addConsulta, removeConsulta,
    handleKeyDown, getSeries, numericSeries, lastC, firstC, activeConsultas,
    getAvanceConsecutivo, avanceGlobal, handleClear,
  };
}
