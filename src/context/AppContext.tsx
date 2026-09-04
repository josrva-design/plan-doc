import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import useAppData, { type Setters } from '../hooks/useAppData.ts';
import mockPacienteCompleto from '../mocks/mockPacienteCompleto';
import { useAutoBackup } from '../hooks/useAutoBackup.ts';
import { getBackups, restoreBackup as restoreBackupService, clearOldBackups, createBackup } from '../utils/backupService.ts';
import { safeGet, safeSet, safeRemove } from '../utils/storage.ts';
import { downloadPatientJSON, loadPatientFromFile, getLastPatientReference } from '../utils/patientFiles.ts';
import type { AppData } from '../core/types.ts';

const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

const STORAGE_KEY = 'docfitness-dev-mode';

const AppContext = createContext<{
  data: AppData;
  setters: Setters;
  devMode: boolean;
  toggleDevMode: () => void;
  isDev: boolean;
  toast: string;
  showToast: (msg: string) => void;
  lastSaved: Date | null;
  dbLoading: boolean;
  dbReady: boolean;
  // Patient file operations
  savePatientJSON: () => string;
  loadPatientJSON: (file: File) => Promise<void>;
  getLastPatient: () => { nombre: string; patientId: string; fileName: string; fechaGuardado: string } | null;
  // Backup operations
  createManualBackup: () => Promise<string | null>;
  restoreBackup: (id: string) => Promise<boolean>;
  listBackups: () => Promise<any[]>;
  // Active tab
  activeTab: string;
  setActiveTab: (tab: string) => void;
} | null>(null);

export function AppProvider({ children, initialTab = 'dashboard' }: { children: React.ReactNode; initialTab?: string }) {
  const [devMode, setDevMode] = useState(() => {
    const saved = safeGet(STORAGE_KEY);
    return saved === 'true';
  });

  const [activeTab, setActiveTab] = useState(initialTab);
  const [toast, setToast] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [dbReady, setDbReady] = useState(true); // No DB loading needed

  const initialData = devMode ? mockPacienteCompleto : null;
  const { data, setters } = useAppData(initialData);

  const dataRef = useRef(data);
  dataRef.current = data;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }, []);

  useAutoBackup(data, 5 * 60 * 1000);

  const toggleDevMode = useCallback(async () => {
    const next = !devMode;

    safeSet(STORAGE_KEY, String(next));
    setDevMode(next);
    setters.resetState(next ? mockPacienteCompleto : null);
  }, [devMode, setters]);

  // Patient file operations
  const savePatientJSON = useCallback(() => {
    const fileName = downloadPatientJSON(data);
    return fileName;
  }, [data]);

  const loadPatientJSON = useCallback(async (file: File) => {
    try {
      const loadedData = await loadPatientFromFile(file);
      setters.resetState(loadedData);
      showToast('Paciente cargado correctamente');
    } catch (err) {
      showToast('Error: ' + (err as Error).message);
    }
  }, [setters, showToast]);

  const getLastPatient = useCallback(() => {
    return getLastPatientReference();
  }, []);

  // Backup operations
  const createManualBackup = useCallback(async () => {
    try {
      await clearOldBackups(20);
      const id = await createBackup(data);
      showToast('Backup creado correctamente');
      return id;
    } catch (e) {
      showToast('Error al crear backup');
      return null;
    }
  }, [data, showToast]);

  const restoreBackup = useCallback(async (id: string) => {
    try {
      const backupData = await restoreBackupService(id);
      if (backupData) {
        setters.resetState(backupData);
        showToast('Backup restaurado correctamente');
        return true;
      }
      showToast('Backup no encontrado');
      return false;
    } catch (e) {
      showToast('Error al restaurar backup');
      return false;
    }
  }, [setters, showToast]);

  const listBackups = useCallback(async () => {
    try {
      return await getBackups();
    } catch {
      return [];
    }
  }, []);

  const contextValue = useMemo(() => ({
    data,
    setters,
    devMode,
    toggleDevMode,
    isDev,
    toast,
    showToast,
    lastSaved,
    dbLoading: false,
    dbReady,
    savePatientJSON,
    loadPatientJSON,
    getLastPatient,
    createManualBackup,
    restoreBackup,
    listBackups,
    activeTab,
    setActiveTab,
  }), [data, setters, devMode, toggleDevMode, isDev, toast, showToast, lastSaved, dbReady, savePatientJSON, loadPatientJSON, getLastPatient, createManualBackup, restoreBackup, listBackups, activeTab]);

  if (typeof window !== 'undefined' && isDev) {
    // @ts-ignore - test hook exposed only in development
    window.__APP__ = { data, setters };
  }

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
