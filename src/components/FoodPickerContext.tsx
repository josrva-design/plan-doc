import React, { createContext, useContext, useState, useRef, type ReactNode } from 'react';
import FoodPickerModal from './FoodPickerModal.tsx';

interface FoodPickerContextType {
  openPicker: (uid: string, onSelect: (foodName: string) => void) => void;
  closePicker: () => void;
  activeUid: string | null;
}

const FoodPickerContext = createContext<FoodPickerContextType | null>(null);

export function FoodPickerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filtros, setFiltros] = useState({ grupo: '', subgrupo: '' });
  const pendingRef = useRef<{ uid: string; onSelect: (foodName: string) => void } | null>(null);

  const openPicker = (uid: string, onSelect: (foodName: string) => void) => {
    pendingRef.current = { uid, onSelect };
    setIsOpen(true);
  };

  const closePicker = () => {
    pendingRef.current = null;
    setIsOpen(false);
  };

  const handleConfirm = (foodName: string) => {
    const onSelect = pendingRef.current?.onSelect;
    if (onSelect) onSelect(foodName);
    pendingRef.current = null;
    setIsOpen(false);
  };

  return (
    <FoodPickerContext.Provider value={{ openPicker, closePicker, activeUid: pendingRef.current?.uid ?? null }}>
      {children}
      <FoodPickerModal
        isOpen={isOpen}
        onClose={closePicker}
        onSelect={handleConfirm}
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />
    </FoodPickerContext.Provider>
  );
}

export function useFoodPicker() {
  const context = useContext(FoodPickerContext);
  if (!context) throw new Error('useFoodPicker must be used within a FoodPickerProvider');
  return context;
}
