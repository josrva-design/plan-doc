import LineChart from './LineChart.tsx';

interface VitalSignsChartProps {
  cells: Record<string, Record<string, number | ''>>;
  activeConsultas: string[];
  getSeries: (key: string) => (number | null)[];
}

const VITAL_FIELDS = [
  { key: 'ta', label: 'TA (mmHg)', color: '#0066CC' },
  { key: 'fc', label: 'FC (bpm)', color: '#2E9E70' },
  { key: 'sat', label: 'Sat (%)', color: '#CC6600' },
];

export default function VitalSignsChart({ cells, activeConsultas, getSeries }: VitalSignsChartProps) {
  const hasData = VITAL_FIELDS.some(f => {
    const series = getSeries(f.key);
    return series.some(v => v !== null);
  });

  if (!hasData) return null;

  const series = VITAL_FIELDS.map(f => ({
    name: f.label,
    color: f.color,
    data: getSeries(f.key),
  }));

  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-white p-5">
      <div className="premium-section-title">
        <h3 className="text-[12px] font-bold tracking-widest text-[var(--color-text-primary)]">SIGNOS VITALES • EVOLUCIÓN</h3>
      </div>
      <div className="mt-4">
        <LineChart series={series} consultas={activeConsultas} />
      </div>
    </div>
  );
}
