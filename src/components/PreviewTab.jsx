import React, { useMemo } from 'react';
import { generateDashboardFitnessHTML } from '../services/ExportPlan.js';

export default function PreviewTab({ data }) {
  const html = useMemo(() => generateDashboardFitnessHTML(data), [data]);

  return (
    <div className="w-full bg-white text-[#0D2640] p-6 font-[Inter]">
      <div className="mb-6">
        <h2 className="premium-page-title text-[22px]">Vista previa</h2>
        <p className="premium-subtitle">Así se ve el archivo exportable. Los cambios en la app se reflejan automáticamente.</p>
      </div>
      <div className="bg-[#F6F6F7] border border-[#E8E8E8] rounded-2xl overflow-hidden">
        <iframe
          title="Vista previa del plan"
          srcDoc={html}
          sandbox="allow-scripts"
          className="w-full"
          style={{ height: '80vh', border: 'none' }}
        />
      </div>
    </div>
  );
}
