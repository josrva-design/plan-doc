import { useMemo, useCallback, useEffect, useRef } from 'react';
import { supplementDatabase } from '../data/supplementDatabase';

export interface Supplement {
  id: string;
  nombre: string;
  tipo: string;
  marca?: string;
  notas?: string;
  horario: string;
  gramos: string;
  porcion: string;
  uid: string;
}

export interface UseSupplementDataReturn {
  supplements: Supplement[];
  addSupplement: () => void;
  updateSupplement: (uid: string, field: string, value: string) => void;
  removeSupplement: (uid: string) => void;
  reorderSupplement: (fromUid: string, toUid: string) => void;
  onPorcionCantidadChange: (uid: string, newCantidad: string) => void;
  stats: {
    totalSuplementos: number;
  };
}

export default function useSupplementData(
  supplements: Supplement[] = [],
  setSupplements: (value: Supplement[]) => void,
  showToast: (msg: string) => void
): UseSupplementDataReturn {
  const addSupplement = useCallback(() => {
    const newId = 'sup-' + Date.now();
    setSupplements((prev) => [
      ...prev,
      {
        id: newId,
        uid: newId,
        nombre: '',
        tipo: '',
        marca: '',
        notas: '',
        horario: '',
        gramos: '',
        porcion: '',
      },
    ]);
    showToast('Suplemento agregado');
  }, [setSupplements, showToast]);

  const updateSupplement = useCallback(
    (uid: string, field: string, value: string) => {
      setSupplements((prev) =>
        prev.map((s) => {
          if (s.uid !== uid) return s;
          if (field === 'nombre') {
            const match = supplementDatabase.find(
              (ex: any) => ex.nombre.toLowerCase() === value.toLowerCase()
            );
            if (match) {
              return {
                ...s,
                nombre: match.nombre,
                tipo: match.tipo,
                notas: s.notas || match.nota || '',
                marca: s.marca || match.marca || '',
                gramos: s.gramos || String(match.dosisEstandar || ''),
                porcion: s.porcion || match.porcionSugerida || '',
                horario: s.horario || match.momento || '',
              };
            }
          }
          return { ...s, [field]: value };
        })
      );
    },
    [setSupplements]
  );

  const onPorcionCantidadChange = useCallback((uid: string, newCantidad: string) => {
    setSupplements((prev) =>
      prev.map((s) => {
        if (s.uid !== uid) return s;
        const match = supplementDatabase.find((ex) => ex.nombre.toLowerCase() === (s.nombre || '').toLowerCase());
        const baseDosis = match ? match.dosisEstandar : null;
        const unidad = match ? match.unidad : '';
        const cantidad = parseFloat(newCantidad) || 1;
        const grams = baseDosis !== null ? Math.round(baseDosis * cantidad) : null;
        const plural = cantidad > 1 && unidad ? 's' : '';
        return {
          ...s,
          cantidad: newCantidad,
          gramos: grams !== null ? `${grams}${unidad}` : s.gramos,
          porcion: `${cantidad} ${unidad}${plural}`.trim(),
        };
      })
    );
  }, [setSupplements]);

  const removeSupplement = useCallback(
    (uid: string) => {
      setSupplements((prev) => prev.filter((s) => s.uid !== uid));
      showToast('Suplemento eliminado');
    },
    [setSupplements, showToast]
  );

  const reorderSupplement = useCallback(
    (fromUid: string, toUid: string) => {
      setSupplements((prev) => {
        const fromIdx = prev.findIndex((s) => s.uid === fromUid);
        const toIdx = prev.findIndex((s) => s.uid === toUid);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return next;
      });
    },
    [setSupplements]
  );

  const stats = useMemo(() => {
    const totalSuplementos = supplements.length;
    return { totalSuplementos };
  }, [supplements]);

  const autofillRef = useRef(false);
  useEffect(() => {
    if (autofillRef.current) return;
    const needsAutofill = (supplements || []).some((s) => !s.tipo || !s.gramos || !s.porcion || !s.notas || !s.marca || !s.horario);
    if (!needsAutofill) return;
    autofillRef.current = true;
    const next = supplements.map((s) => {
      if (s.tipo && s.gramos && s.porcion && s.notas && s.marca && s.horario) return s;
      const match = supplementDatabase.find((ex) => ex.nombre.toLowerCase() === (s.nombre || '').toLowerCase());
      if (!match) return s;
      return {
        ...s,
        tipo: s.tipo || match.tipo || '',
        marca: s.marca || match.marca || '',
        notas: s.notas || match.nota || '',
        gramos: s.gramos || String(match.dosisEstandar || ''),
        porcion: s.porcion || match.porcionSugerida || '',
        horario: s.horario || match.momento || '',
      };
    });
    setSupplements(next);
  }, [supplements, setSupplements]);

  return {
    supplements,
    addSupplement,
    updateSupplement,
    removeSupplement,
    reorderSupplement,
    onPorcionCantidadChange,
    stats,
  };
}
