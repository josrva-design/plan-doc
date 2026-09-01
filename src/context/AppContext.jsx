import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import useAppData from '../hooks/useAppData';
import mockPacienteCompleto from '../mocks/mockPacienteCompleto';

const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
const STORAGE_KEY = 'docfitness-dev-mode';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [devMode, setDevMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });

  const { data, setters } = useAppData(devMode ? mockPacienteCompleto : null);

  const toggleDevMode = useCallback(() => {
    const next = !devMode;
    localStorage.setItem(STORAGE_KEY, String(next));
    setDevMode(next);
    setters.resetState(next ? mockPacienteCompleto : null);
  }, [devMode, setters]);

  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  const contextValue = useMemo(() => ({
    data,
    setters,
    devMode,
    toggleDevMode,
    isDev,
    toast,
    showToast
  }), [data, setters, devMode, toggleDevMode, isDev, toast, showToast]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext debe usarse dentro de <AppProvider>');
  }
  return ctx;
}

export default AppContext;
