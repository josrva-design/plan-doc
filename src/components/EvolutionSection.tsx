import EvolutionTable from './EvolutionTable.tsx';
import EvolutionCharts from './EvolutionCharts.tsx';
import { TrendingUp } from 'lucide-react';
import useEvolutionData, { UseEvolutionDataReturn } from '../hooks/useEvolutionData.ts';
import { SECTIONS, ADHERENCIA_SECTION } from './EvolutionConstants.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { isConsultaVencida } from '../utils/evolutionHelpers';

export default function EvolutionSection() {
  const { data, setters, showToast } = useAppContext();
  const { evolution } = data;
  const setData = setters.setEvolution;
  const proximaVencida = isConsultaVencida(data?.fechaConsulta);

  const {
    dates, cells, consultas, setCell, setDates, addConsulta, removeConsulta, handleKeyDown, getSeries, numericSeries, lastC, firstC, activeConsultas,
    getAvanceConsecutivo, avanceGlobal, handleClear,
  }: UseEvolutionDataReturn = useEvolutionData(evolution, setData, showToast);

  return (
    <div className="w-full bg-transparent font-sans antialiased">
      <div className="mx-auto max-w-[1280px] p-3 md:p-4 space-y-5">
        <div className="mb-6">
            <div className="premium-page-title">
              <span className="mr-2 inline-flex items-center justify-center text-[var(--color-primary)]"><TrendingUp size={24} /></span>
              EVOLUCIÓN
            </div>
          <div className="premium-subtitle">Composición corporal, perímetros, pliegues</div>
        </div>

        {activeConsultas.length >= 2 && (
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> {activeConsultas.length} consultas registradas
          </div>
        )}

        {proximaVencida && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Consulta vencida</p>
            <p className="text-sm text-red-600 mt-1">La próxima actualización programada ya pasó. Actualiza la fecha de consulta o programá una nueva.</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="premium-section-title">
            <h3 className="text-[12px] font-bold tracking-widest text-[var(--color-text-primary)]">CONSULTAS</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={addConsulta} className="premium-btn-pill premium-btn-pill--primary text-[11px] py-1.5 px-3">
              + Consulta
            </button>
          </div>
        </div>

        <EvolutionTable
          title="MEDIDAS"
          sections={SECTIONS}
          consultas={consultas}
          dates={dates}
          cells={cells}
          setCell={setCell}
          setDates={setDates}
          removeConsulta={removeConsulta}
          handleKeyDown={handleKeyDown}
          getAvanceConsecutivo={getAvanceConsecutivo}
        />

        <EvolutionTable
          title="ADHERENCIA"
          sections={[ADHERENCIA_SECTION]}
          consultas={consultas}
          dates={dates}
          cells={cells}
          setCell={setCell}
          setDates={setDates}
          removeConsulta={removeConsulta}
          handleKeyDown={handleKeyDown}
          getAvanceConsecutivo={getAvanceConsecutivo}
        />

        <EvolutionCharts
          cells={cells}
          activeConsultas={activeConsultas}
          lastC={lastC}
          firstC={firstC}
          getSeries={getSeries}
          numericSeries={numericSeries}
          avanceGlobal={avanceGlobal}
          inBodyConfig={evolution?.inBodyConfig}
        />
      </div>
    </div>
  );
}
