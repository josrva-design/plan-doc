import EvolutionSummaryCards from './ui/EvolutionSummaryCards.tsx';
import InBodyAnalysis from './ui/InBodyAnalysis.tsx';
import PerimeterRadial from './ui/PerimeterRadial.tsx';
import FoldsAnalysis from './ui/FoldsAnalysis.tsx';
import AdherenceLiquid from './ui/AdherenceLiquid.tsx';
import VitalSignsChart from './ui/VitalSignsChart.tsx';
import LineChart from './ui/LineChart.tsx';

interface EvolutionChartsProps {
  cells: Record<string, Record<string, number | ''>>;
  activeConsultas: string[];
  lastC: string;
  firstC: string;
  getSeries: (key: string) => (number | null)[];
  numericSeries: (key: string) => number[];
  avanceGlobal: (key: string) => number | null;
  inBodyConfig?: import('../core/types').InBodyConfig;
}

const summaryCards = [
  { label: 'PESO', key: 'peso', unit: 'kg', color: '#0066CC', goal: 'down' as const },
  { label: 'GRASA CORPORAL', key: 'grasa_pct', unit: '%', color: '#2E9E70', goal: 'down' as const },
  { label: 'MASA MUSCULAR', key: 'muscular', unit: 'kg', color: '#CC6600', goal: 'up' as const },
  { label: 'GRASA VISCERAL', key: 'visceral', unit: '', color: '#8B5CF6', goal: 'down' as const },
];

export default function EvolutionCharts({
  cells,
  activeConsultas,
  lastC,
  firstC,
  getSeries,
  numericSeries,
  avanceGlobal,
  inBodyConfig,
}: EvolutionChartsProps) {
  if (activeConsultas.length < 2) return null;

  return (
    <>
      <EvolutionSummaryCards
        cards={summaryCards}
        numericSeries={numericSeries}
        avanceGlobal={avanceGlobal}
        firstC={firstC}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
          <div className="premium-section-title">
            <h3 className="text-[12px] font-bold tracking-widest text-[var(--color-text-primary)]">COMPOSICIÓN • PESO / GRASA / MÚSCULO / MLG</h3>
          </div>
          <div className="mt-4">
            <LineChart series={[
              { name: 'Peso', color: '#0066CC', data: getSeries('peso') },
              { name: 'Grasa KG', color: '#2E9E70', data: getSeries('grasaKg') },
              { name: 'Músculo KG', color: '#CC6600', data: getSeries('muscular') },
              { name: 'MLG', color: '#8B5CF6', data: getSeries('mlg') },
            ]} consultas={activeConsultas} />
          </div>
        </div>

        <InBodyAnalysis
          cells={cells}
          lastC={lastC}
          avanceGlobal={avanceGlobal}
          firstC={firstC}
          inBodyConfig={inBodyConfig}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PerimeterRadial cells={cells} firstC={firstC} lastC={lastC} />
        <AdherenceLiquid cells={cells} lastC={lastC} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FoldsAnalysis cells={cells} firstC={firstC} lastC={lastC} />
        <VitalSignsChart cells={cells} activeConsultas={activeConsultas} getSeries={getSeries} />
      </div>
    </>
  );
}
