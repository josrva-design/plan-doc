import { createContext, useContext, useState, useRef, type ReactNode } from 'react';
import ExerciseLibraryModal from './ExerciseLibraryModal.tsx';

type Mode = 'replace' | 'add';
type FilterKey = 'musculo' | 'movimiento' | 'grupo';

interface SelectFn {
  (name: string): void;
}

interface OpenOptions {
  mode: Mode;
  currentName?: string;
  onSelect: SelectFn;
}

interface ExercisePickerContextValue {
  open: (options: OpenOptions) => void;
}

const ExercisePickerContext = createContext<ExercisePickerContextValue | null>(null);

export function useExercisePicker(): ExercisePickerContextValue {
  const ctx = useContext(ExercisePickerContext);
  if (!ctx) return { open: () => {} };
  return ctx;
}

export function ExercisePickerProvider({ children }: { children: ReactNode }) {
  const [openModal, setOpenModal] = useState(false);
  const [filtros, setFiltros] = useState<Record<FilterKey, string>>({
    musculo: '',
    movimiento: '',
    grupo: '',
  });
  const pendingRef = useRef<{ mode: Mode; currentName?: string; onSelect: SelectFn } | null>(null);

  const open = ({ mode, currentName, onSelect }: OpenOptions) => {
    pendingRef.current = { mode, currentName, onSelect };
    setOpenModal(true);
  };

  const handleConfirm = (names: string[]) => {
    const fn = pendingRef.current?.onSelect;
    if (fn && names.length > 0) fn(names[0]);
    pendingRef.current = null;
    setOpenModal(false);
  };

  const handleClose = () => {
    pendingRef.current = null;
    setOpenModal(false);
  };

  return (
    <ExercisePickerContext.Provider value={{ open }}>
      {children}
      <ExerciseLibraryModal
        open={openModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />
    </ExercisePickerContext.Provider>
  );
}