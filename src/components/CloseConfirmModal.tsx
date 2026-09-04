import { useMemo, useState, useCallback, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { saveToFile } from '../services/tauriStorage.ts';

export default function CloseConfirmModal({ open, onClose, onSaveAndClose, onDiscardAndClose, data, filePath }: {
  open: boolean;
  onClose: () => void;
  onSaveAndClose: () => void;
  onDiscardAndClose: () => void;
  data?: unknown;
  filePath?: string;
}) {
  if (!open) return null;

  const handleSave = async () => {
    if (filePath && data) {
      try {
        await saveToFile(filePath, data);
      } catch {
        // si falla el guardado nativo, seguimos con el flujo igual
      }
    }
    onSaveAndClose();
  };

  const handleDiscard = async () => {
    onDiscardAndClose();
    try {
      const win = getCurrentWindow();
      await win.close();
    } catch {
      // fallback silencioso
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#0D2640] mb-2">¿Guardar cambios?</h3>
        <p className="text-sm text-[#4B5563] mb-6">
          Hay cambios sin guardar. ¿Deseas guardar el plan antes de salir?
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="w-full py-2.5 px-4 bg-[#0D2640] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3a5c] transition-colors"
          >
            Guardar y cerrar
          </button>
          <button
            onClick={handleDiscard}
            className="w-full py-2.5 px-4 bg-white text-[#0D2640] border border-[#0D2640] rounded-xl font-semibold text-sm hover:bg-[#0D2640]/5 transition-colors"
          >
            Cerrar sin guardar
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-[#6B7280] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
