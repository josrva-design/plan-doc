import { Document, Page, View, Text, Image, Link, StyleSheet, Font } from '@react-pdf/renderer';
import type { ClientPlan } from '../core/types';
import { guideSections, glossaryTerms } from '../data/guideContent.js';
import { roundDelta } from '../utils/nutritionHelpers';

// Register Inter and Inter Tight as TTF (WOFF2 has fontkit subsetting bug)
Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf' });
Font.register({ family: 'Inter Tight', src: 'https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjDw-qXA.ttf' });

const C = {
  primary: '#2563EB',
  deep: '#0D2640',
  green: '#16A34A',
  orange: '#D97706',
  red: '#DC2626',
  navy: '#0D2640',
  white: '#FFFFFF',
  bg: '#F6F6F6',
  bgElevated: '#FFFFFF',
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  textPrimary: '#0D2640',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  accent: '#2563EB',
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xl2: 32,
  },
  fontSize: {
    xs: 10,
    sm: 11,
    md: 12,
    base: 13,
    lg: 14,
    xl: 16,
    xl2: 18,
    xl3: 20,
    xl4: 28,
    xl5: 32,
  },
};

const styles = StyleSheet.create({
  page: {
    width: 1080,
    height: 1920,
    padding: 36,
    backgroundColor: C.bg,
    fontFamily: 'Inter',
    color: C.deep,
  },
  logoHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 800,
    color: C.deep,
    marginBottom: 8,
    fontFamily: 'Inter Tight',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  planBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.05)',
    color: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 16,
  },
  nextUpdate: {
    alignSelf: 'flex-start',
    backgroundColor: C.green,
    color: C.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: C.deep,
    marginBottom: 12,
    letterSpacing: -0.5,
    fontFamily: 'Inter Tight',
  },
  sectionDivider: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.primary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  navCard: {
    backgroundColor: C.deep,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  navCardTitle: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  navCardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 4,
  },
  navCardAnterior: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 700,
  },
  navCardActual: {
    fontSize: 28,
    fontWeight: 800,
    color: C.white,
  },
  navCardUnit: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 700,
  },
  navCardSubtext: {
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  navCardDelta: {
    backgroundColor: C.green,
    color: C.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  measureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  measureCard: {
    width: 468,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  measureTitle: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 8,
  },
  statAnterior: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: 700,
  },
  statActual: {
    fontSize: 28,
    fontWeight: 800,
    color: C.deep,
  },
  statDelta: {
    backgroundColor: C.green,
    color: C.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  greenCard: {
    backgroundColor: C.green,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  greenCardTitle: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  greenCardValue: {
    fontSize: 28,
    fontWeight: 800,
    color: C.white,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: C.white,
    borderRadius: 6,
  },
  miniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  miniCard: {
    width: 228,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  miniTitle: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  miniValue: {
    fontSize: 22,
    fontWeight: 800,
    color: C.deep,
  },
  miniProgress: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#0D2640',
    borderRadius: 4,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  macroPill: {
    backgroundColor: C.deep,
    color: C.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 800,
  },
  strategyPill: {
    backgroundColor: C.primary,
    color: C.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 800,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  exerciseCode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.deep,
    color: C.white,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 12,
    fontWeight: 800,
     marginRight: 12,
  },
  exerciseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 700,
    color: C.deep,
  },
  exerciseDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  exerciseBadgeTecnica: {
    fontSize: 11,
    fontWeight: 800,
    marginTop: 2,
  },

  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  foodGram: {
    fontSize: 14,
    fontWeight: 700,
    color: C.deep,
    marginRight: 8,
  },
  foodName: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  mealTimeBadge: {
    backgroundColor: C.green,
    color: C.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  mealName: {
    fontSize: 14,
    fontWeight: 700,
    color: C.deep,
  },
  mealMacros: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 'auto',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 800,
    color: C.white,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  clinicalItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  clinicalNumber: {
    fontSize: 14,
    fontWeight: 700,
    color: C.primary,
  },
  clinicalText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  link: {
    color: C.primary,
    textDecoration: 'none',
    fontSize: 12,
  },
  guideHeader: {
    backgroundColor: C.deep,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  guideHeaderTitle: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  guideHeaderSubtitle: {
    fontSize: 28,
    fontWeight: 800,
    color: C.white,
    fontFamily: 'Inter Tight',
  },
  faqItem: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 700,
    color: C.deep,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  splitCol: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  splitLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: C.deep,
    marginBottom: 8,
  },
  gridItem: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  gridItemTitle: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  gridPill: {
    backgroundColor: C.green,
    color: C.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    marginRight: 8,
    marginBottom: 8,
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: C.deep,
    marginBottom: 8,
  },
  columnBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  glossaryCat: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  glossaryCatTitle: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.deep,
    marginBottom: 12,
  },
  glossaryTerm: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  glossaryTermTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: C.deep,
    marginBottom: 4,
  },
  glossaryTermDef: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  dayLabel: {
    fontSize: 18,
    fontWeight: 800,
    color: C.deep,
    marginBottom: 16,
    fontFamily: 'Inter Tight',
  },
  restDay: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  warmupSection: {
    marginBottom: 24,
  },
  warmupTitle: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  bloqueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  bloqueTitle: {
    fontSize: 12,
    fontWeight: 800,
    color: '#9CA3AF',
  },
  bloqueTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bloqueTypeText: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bloqueIndicacion: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
    marginTop: 2,
    lineHeight: 1.4,
  },
  multiExerciseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  multiLine: {
    position: 'absolute',
    left: 3,
    top: 16,
    bottom: 0,
    width: 2,
    backgroundColor: '#E5E7EB',
  },
  exerciseOptionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primary,
    color: C.white,
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 14,
    fontWeight: 800,
    marginRight: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: C.deep,
    paddingRight: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: C.deep,
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: C.fontSize.sm,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.textTertiary,
    paddingRight: C.spacing.sm,
  },
  exerciseTableContainer: {
    backgroundColor: C.bgElevated,
    borderRadius: C.radius.md,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: C.spacing.lg,
  },
  exerciseTableHeader: {
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: C.spacing.sm,
    gap: C.spacing.xs,
    alignItems: 'center',
    backgroundColor: C.bgElevated + '08',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  exerciseHeaderCell: {
    fontSize: 10,
    fontWeight: 700,
    color: C.textSecondary,
    letterSpacing: 0.5,
  },
  exerciseTableBase: {
    backgroundColor: C.bgElevated,
    borderRadius: C.radius.lg,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: C.spacing.lg,
  },
  exerciseTableBody: {
    width: '100%',
  },
  exerciseTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: C.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  exerciseTableRowLast: {
    borderBottomWidth: 0,
  },
  exerciseTableColCode: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseTableColName: {
    flex: 2,
    paddingRight: C.spacing.md,
  },
  exerciseTableColSets: {
    width: 56,
    alignItems: 'center',
  },
  exerciseTableColReps: {
    width: 64,
    alignItems: 'center',
  },
  exerciseTableColRest: {
    width: 72,
    alignItems: 'center',
  },
  exerciseTableColRir: {
    width: 48,
    alignItems: 'center',
  },
  nutritionTableContainer: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nutritionDayHeader: {
    backgroundColor: C.deep,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
    marginTop: 16,
  },
  nutritionDayTitle: {
    color: C.white,
    fontSize: 14,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  mealTimeCell: {
    width: 80,
    fontSize: 12,
    fontWeight: 800,
    color: C.green,
  },
  mealNameCell: {
    width: 120,
    fontSize: 13,
    fontWeight: 700,
    color: C.deep,
  },
  mealMacrosCell: {
    width: 140,
    fontSize: 12,
    color: '#6B7280',
  },
  mealFoodsCell: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
  },
  pageFooter: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageFooterLogo: {
    width: 120,
    height: 40,
  },
});

const DAYS = [
  { key: 'monday', label: 'LUN', full: 'Lunes' },
  { key: 'tuesday', label: 'MAR', full: 'Martes' },
  { key: 'wednesday', label: 'MIÉ', full: 'Miércoles' },
  { key: 'thursday', label: 'JUE', full: 'Jueves' },
  { key: 'friday', label: 'VIE', full: 'Viernes' },
  { key: 'saturday', label: 'SÁB', full: 'Sábado' },
  { key: 'sunday', label: 'DOM', full: 'Domingo' },
];

function LogoHeader() {
  return (
    <View style={styles.logoHeader}>
      <Image src="/doc-logo-brand.svg" style={styles.logo} />
    </View>
  );
}

function PageFooter() {
  return (
    <View style={styles.pageFooter}>
      <Image src="/doc-logo-white.svg" style={styles.pageFooterLogo} />
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>{children}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function NavCard({ title, value, unit = '', anterior, delta }: { title: string; value: string; unit?: string; anterior?: string; delta?: string }) {
  return (
    <View style={styles.navCard}>
      <Text style={styles.navCardTitle}>{title}</Text>
      <View style={styles.navCardValueRow}>
        {anterior && <Text style={styles.navCardAnterior}>{anterior}{unit}</Text>}
        <Text style={styles.navCardActual}>{value}{unit}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
        {anterior && <Text style={styles.navCardSubtext}>Anterior → Actual</Text>}
        {delta && <Text style={styles.navCardDelta}>{delta}</Text>}
      </View>
    </View>
  );
}

function MeasureCard({ title, anterior, actual, delta }: { title: string; anterior: string; actual: string; delta: number }) {
  return (
    <View style={styles.measureCard}>
      <Text style={styles.measureTitle}>{title}</Text>
      <View style={styles.statRow}>
        <Text style={styles.statAnterior}>{anterior}</Text>
        <Text style={styles.statActual}>{actual}</Text>
        <Text style={styles.statDelta}>{delta < 0 ? '↓' : '↑'} {Math.abs(delta)}</Text>
      </View>
    </View>
  );
}

function MiniCard({ title, value, suffix = '', pct = 0 }: { title: string; value: string; suffix?: string; pct?: number }) {
  return (
    <View style={styles.miniCard}>
      <Text style={styles.miniTitle}>{title}</Text>
      <Text style={styles.miniValue}>{value}{suffix}</Text>
      <View style={styles.miniProgress}>
        <View style={[styles.miniProgressFill, { width: `${Math.min(pct, 100)}%` }]} />
      </View>
    </View>
  );
}

function inferCategoria(f: any): string {
  const m = f.macros || {};
  const p = m.proteinas || f.p || 0;
  const c = m.carbos || f.c || 0;
  const g = m.grasas || f.g || 0;
  if (p > 0 && p >= c && p >= g) return 'PROTEÍNA';
  if (c > 0 && c > p && c >= g) return 'CARBOHIDRATO';
  if (g > 0 && g > p && g > c) return 'GRASA';
  return 'OTROS';
}

function categoriaColor(cat: string): string {
  switch (cat) {
    case 'PROTEÍNA': return C.deep;
    case 'CARBOHIDRATO': return C.primary;
    case 'GRASA': return C.orange;
    default: return '#6B7280';
  }
}

function getTecnicaColor(tecnica: string): string {
  const t = tecnica.toUpperCase();
  if (t.includes('DROPSET')) return C.orange;
  if (t.includes('TOP SET')) return C.primary;
  if (t.includes('BACK-OFF')) return C.green;
  if (t.includes('REST-PAUSE')) return C.red;
  if (t.includes('AL FALLO') || t.includes('FALLO')) return C.red;
  if (t.includes('MYO-REPS')) return C.deep;
  if (t === 'BISERIE' || t === 'TRISERIE') return C.orange;
  if (t === 'CIRCUITO') return C.green;
  return C.deep;
}

function FoodCategorias({ foods, menuType }: { foods: any[]; menuType?: string }) {
  if (menuType === 'armar') {
    const grupos: Record<string, any[]> = {};
    const orden = ['PROTEÍNA', 'CARBOHIDRATO', 'GRASA', 'OTROS'];
    foods.forEach((f) => {
      const cat = inferCategoria(f);
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(f);
    });
    const ordenados = orden.filter((c) => grupos[c]?.length);

    return (
      <View>
        {ordenados.map((cat) => (
          <View key={cat} style={{ marginBottom: 12 }}>
            <Text style={[styles.categoryBadge, { backgroundColor: categoriaColor(cat) }]}>
              {cat}
            </Text>
            {grupos[cat].map((f, i) => (
              <View key={i} style={styles.foodRow}>
                <Text style={styles.foodGram}>{f.grams} {f.unit || 'g'}</Text>
                <Text style={styles.foodName}>{f.name}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View>
      {foods.map((f, i) => (
        <View key={i} style={styles.foodRow}>
          <Text style={styles.foodGram}>{f.grams} {f.unit || 'g'}</Text>
          <Text style={styles.foodName}>{f.name}</Text>
        </View>
      ))}
    </View>
  );
}

function parsePrescripcion(p: string) {
  if (!p || p === '—') return { sets: '—', reps: '—', descanso: '—', rir: '—', tecnica: '—', notas: '—' };
  const seriesMatch = p.match(/(\d+)\s*(?:series|x)/i);
  const repsMatch = p.match(/(\d+\s*-\s*\d+|\d+)\s*reps?/i);
  const restMatch = p.match(/•\s*(\d+(?:\.\d+)?)\s*(seg?s?|min|m)/i);
  const rirMatch = p.match(/RIR\s*(\d+)/i);
  const tecnicaMatch = p.match(/(biserie|triserie|drop\s*set|top\s*set|back\s*off|rest\s*pause|fall\s*al|fall\s*myo|fall)/i);
  const tecnica = tecnicaMatch ? tecnicaMatch[0].toUpperCase().replace(/['\s]/g, ' ') : '—';
  return {
    sets: seriesMatch ? seriesMatch[1] : '—',
    reps: repsMatch ? repsMatch[1].replace(/\s/g, '') : '—',
    descanso: restMatch ? `${restMatch[1]}${restMatch[2].startsWith('min') ? ' MIN' : 's'}` : '—',
    rir: rirMatch ? rirMatch[1] : '—',
    tecnica,
    notas: '—',
  };
}

function formatEjercicioDisplay(p: string, bloqueTipo: string): string {
  if (!p || p === '-') return '—';
  const isMulti = bloqueTipo === 'BISERIE' || bloqueTipo === 'TRISERIE';
  const isTimeBased = !/reps?\s*(c\/u)?/i.test(p);
  const seriesMatch = p.match(/(\d+)\s+series/i) || p.match(/(\d+)x\s/i);
  const repsMatch = p.match(/(\d+\s*-\s*\d+|\d+)\s*reps?/i);
  const timeMatch = p.match(/•?\s*(\d+(?:\.\d+)?)\s*(MIN|min|seg|s)\b/i);
  const descansoMatch = p.match(/•\s*(\d+(?:\.\d+)?)\s*(s|seg|min|m)/i);
  const rirMatch = p.match(/RIR\s*(\d+)/i);

  if (isTimeBased) {
    if (isMulti) {
      let r = '';
      if (repsMatch) r = `${repsMatch[1]} reps`;
      if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
      return r || p;
    }
    let r = '';
    if (seriesMatch) r += `${seriesMatch[1]}x`;
    if (timeMatch) {
      const unit = timeMatch[2].toLowerCase() === 'min' ? 'MIN' : timeMatch[2];
      r += ` ${timeMatch[1]}${unit === 'seg' || unit === 's' ? 's' : unit}`;
    }
    const descMatch = descansoMatch;
    if (descMatch) r += ` • ${descMatch[1]} seg descanso`;
    if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
    return r || p;
  }

  if (isMulti) {
    let r = '';
    if (repsMatch) r = `${repsMatch[1]} reps`;
    if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
    return r || p;
  }

  let r = '';
  if (seriesMatch) r += `${seriesMatch[1]} series, `;
  if (repsMatch) r += `${repsMatch[1]} reps`;
  if (descansoMatch) r += ` • ${descansoMatch[1]} seg descanso`;
  if (rirMatch) r += ` • RIR ${rirMatch[1]}`;
  return r || p;
}

const BLOQUE_COLORS: Record<string, string> = {
  'CALENTAMIENTO GENERAL': C.orange,
  'ESTIRAMIENTO DINÁMICO / MOVILIDAD': C.deep,
  'CALENTAMIENTO ESPECÍFICO': C.deep,
  'SERIES DE APROXIMACIÓN': C.orange,
  'ENTRENAMIENTO PRINCIPAL': C.deep,
  'ABDOMEN': C.primary,
  'default': C.textTertiary,
};

function getBloqueColor(bloqueTipo: string): string {
  return BLOQUE_COLORS[bloqueTipo] || C.textTertiary;
}

function BloqueEjercicios({ bloque }: { bloque: any }) {
  const isMulti = bloque.tipo === 'BISERIE' || bloque.tipo === 'TRISERIE';
  const bloqueColor = getBloqueColor(bloque.tipo);
  const tipoLabel = bloque.tipo === 'BISERIE' ? '[Biserie]' : bloque.tipo === 'TRISERIE' ? '[Triserie]' : '[Simple]';
  const faseLabel = `${bloque.letra} (${bloque.tipo.replace(/_/g, ' ').replace('ELIGE 1 OPCIÓN', 'OPCION').substring(0, 8)})`;

  return (
    <View style={styles.exerciseTableContainer}>
      <View style={[styles.exerciseTableHeader, { backgroundColor: bloqueColor + '0F' }]}>
          <Text style={[styles.exerciseHeaderCell, { width: 80 }]}>
            <Text style={{ fontSize: C.fontSize.xs, fontWeight: 800, textTransform: 'uppercase', color: bloqueColor }}>TIPO</Text>
            {'\n'}
            <Text style={{ fontSize: C.fontSize.sm, fontWeight: 400, color: C.textSecondary }}>{tipoLabel}</Text>
          </Text>
          <Text style={[styles.exerciseHeaderCell, { width: 56, justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ width: 10, height: 10, borderRadius: 4, backgroundColor: bloqueColor }} />
        </Text>
        <Text style={[styles.exerciseHeaderCell, { width: 130 }]}>
          <Text style={{ fontSize: C.fontSize.sm, fontWeight: 800, textTransform: 'uppercase', color: bloqueColor, lineHeight: 16 }}>{faseLabel}</Text>
        </Text>
        <Text style={[styles.exerciseHeaderCell, { width: 56, justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: bloqueColor + '20', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: 800, color: bloqueColor }}>VID</Text>
          </View>
        </Text>
        <Text style={[styles.exerciseHeaderCell, { flex: 1, minWidth: 180 }]}>EJERCICIO</Text>
        <Text style={[styles.exerciseHeaderCell, { width: 80, textAlign: 'center' }]}>SETS</Text>
        <Text style={[styles.exerciseHeaderCell, { width: 80, textAlign: 'center' }]}>REPS</Text>
        <Text style={[styles.exerciseHeaderCell, { width: 100, textAlign: 'left' }]}>TÉCNICA</Text>
        <Text style={[styles.exerciseHeaderCell, { width: 60, textAlign: 'center' }]}>RIR</Text>
        <Text style={[styles.exerciseHeaderCell, { width: 90, textAlign: 'center' }]}>DESCANSO</Text>
        <Text style={[styles.exerciseHeaderCell, { width: 160, textAlign: 'left' }]}>NOTAS</Text>
      </View>

      {bloque.ejercicios.map((ex: any, eIdx: number) => {
        const isOption = bloque.tipo === 'ELIGE 1 OPCIÓN';
        const exCode = ex.codigo || `${bloque.letra}${eIdx + 1}`;
        const parsed = parsePrescripcion(ex.prescripcion || '');

        return (
          <View key={eIdx} style={[
            styles.exerciseTableRow,
            isMulti && { paddingLeft: C.spacing.sm, position: 'relative' },
            eIdx === bloque.ejercicios.length - 1 && styles.exerciseTableRowLast
          ]}>
            {isMulti && <View style={styles.multiLine} />}

            <View style={{ width: 80, flexDirection: 'column' }}>
              <Text style={{ fontSize: C.fontSize.xs, fontWeight: 700, color: bloqueColor, textTransform: 'uppercase' }}>{tipoLabel}</Text>
            </View>

            <View style={{ width: 56, alignItems: 'center' }}>
              <View style={{ width: 10, height: 10, borderRadius: 4, backgroundColor: bloqueColor }} />
            </View>

            <Text style={{ width: 130, fontSize: C.fontSize.sm, fontWeight: 800, textTransform: 'uppercase', color: bloqueColor, lineHeight: 16, alignItems: 'center' }}>
              {faseLabel}
            </Text>

            <View style={{ width: 56, alignItems: 'center' }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: bloqueColor + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: 800, color: bloqueColor }}>VID</Text>
              </View>
            </View>

            <View style={{ flex: 1, minWidth: 180 }}>
              <Text style={{ fontSize: C.fontSize.base, fontWeight: 500, color: C.textPrimary }}>
                {isOption ? `Opción ${eIdx + 1}: ` : ''}{ex.nombre || '—'}
              </Text>
              {ex.badgeTecnica && (
                <Text style={{
                  fontSize: C.fontSize.xs,
                  fontWeight: 800,
                  marginTop: 2,
                  color: getTecnicaColor(ex.badgeTecnica),
                }}>
                  {ex.badgeTecnica}
                </Text>
              )}
            </View>

            <View style={{ width: 80, alignItems: 'center' }}>
              <Text style={{ fontSize: C.fontSize.base, fontWeight: 700, color: C.textPrimary }}>{parsed.sets}</Text>
            </View>

            <View style={{ width: 80, alignItems: 'center' }}>
              <Text style={{ fontSize: C.fontSize.base, fontWeight: 700, color: C.textPrimary }}>{parsed.reps}</Text>
            </View>

            <View style={{ width: 100, paddingLeft: C.spacing.sm }}>
              <Text style={{ fontSize: C.fontSize.base, fontWeight: 600, color: C.textSecondary }}>{parsed.tecnica}</Text>
            </View>

            <View style={{ width: 60, alignItems: 'center' }}>
              <Text style={{ fontSize: C.fontSize.base, fontWeight: 700, color: C.textPrimary }}>{parsed.rir}</Text>
            </View>

            <View style={{ width: 90, alignItems: 'center' }}>
              <Text style={{ fontSize: C.fontSize.sm, fontWeight: 600, color: C.textSecondary }}>{parsed.descanso}</Text>
            </View>

            <View style={{ width: 160, paddingLeft: C.spacing.sm }}>
              <Text style={{ fontSize: C.fontSize.base, fontWeight: 500, color: C.textPrimary }}>{parsed.notas}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function PatientPDF({ plan }: { plan: ClientPlan }) {
  const p = plan?.person || { nombre: 'Paciente' };
  const avances = plan?.avances || {};
  const estadisticas = plan?.estadisticas || {};
  const tNutri = plan?.tratamientoNutricional || {};
  const tEntre = plan?.tratamientoEntrenamiento || {};
  const clinico = plan?.clinico || {};
  const meals = plan?.meals || [];
  const routines = plan?.routines || {};
  const supplements = plan?.supplements || {};
  const guia = plan?.guia || [];
  const glosario = plan?.glosario || [];

  return (
    <Document>
      {/* ========== PÁGINA 1: HEADER + AVANCES + ESTRATEGIAS + CLÍNICO ========== */}
      <Page key="portada" size={[1080, 1920]} style={styles.page} footer={PageFooter}>
        <LogoHeader />
        <View style={styles.planBadge}>
          <Text style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: 'rgba(0,0,0,0.6)' }}>Plan activo</Text>
        </View>
        <Text style={styles.greeting}>Hola, {p.nombre?.split(' ')[0] || 'Paciente'}</Text>
        <Text style={styles.subtitle}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        {plan?.proximaConsulta && (
          <Text style={styles.nextUpdate}>Próxima actualización: {plan.proximaConsulta}</Text>
        )}

        <SectionTitle>Avances</SectionTitle>
        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, fontWeight: 600 }}>Comparativa mensual • Anterior vs Actual</Text>

        <NavCard
          title={avances.peso?.label || 'Peso'}
          value={avances.peso?.actual || '—'}
          unit=" kg"
          anterior={avances.peso?.anterior ? String(avances.peso.anterior) : undefined}
          delta={avances.peso?.anterior ? `↑ +${roundDelta((avances.peso.actual - avances.peso.anterior) || 0)}` : undefined}
        />

        <View style={styles.measureGrid}>
          {avances.abdomen && <MeasureCard title="Abdomen" anterior={avances.abdomen.anterior} actual={avances.abdomen.actual} delta={avances.abdomen.delta || 0} />}
          {avances.grasaKg && <MeasureCard title="Grasa kg" anterior={avances.grasaKg.anterior} actual={avances.grasaKg.actual} delta={avances.grasaKg.delta || 0} />}
          {avances.grasaPct && <MeasureCard title="Grasa %" anterior={avances.grasaPct.anterior} actual={avances.grasaPct.actual} delta={avances.grasaPct.delta || 0} />}
          {avances.pliegue && <MeasureCard title="Pliegue" anterior={avances.pliegue.anterior} actual={avances.pliegue.actual} delta={avances.pliegue.delta || 0} />}
        </View>

        <View style={styles.greenCard}>
          <Text style={styles.greenCardTitle}>Adherencia al plan</Text>
          <Text style={styles.greenCardValue}>{estadisticas.adherencia}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${estadisticas.adherencia}%` }]} />
          </View>
        </View>

        <View style={styles.miniGrid}>
          <MiniCard title="Nutrición" value={String(estadisticas.nutricion || 0)} suffix="%" pct={estadisticas.nutricion || 0} />
          <MiniCard title="Entreno" value={String(estadisticas.entrenamiento || 0)} suffix="%" pct={estadisticas.entrenamiento || 0} />
          <MiniCard title="Cardio" value={String(Math.min(Math.round((estadisticas.cardio || 0) / 3 * 100), 100))} suffix="%" pct={Math.min(Math.round((estadisticas.cardio || 0) / 3 * 100), 100)} />
          <MiniCard title="Descanso" value={String(Math.min(Math.round((parseFloat(estadisticas.descanso || '0') / 8) * 100), 100))} suffix="%" pct={Math.min(Math.round((parseFloat(estadisticas.descanso || '0') / 8) * 100), 100)} />
        </View>

        <Card title="Estrategia nutricional">
          <View style={styles.macroGrid}>
            <Text style={styles.strategyPill}>{tNutri.estrategia || '—'}</Text>
            <Text style={styles.macroPill}>{tNutri.kcal || '—'} kcal</Text>
            <Text style={styles.macroPill}>{tNutri.proteina || '—'}P</Text>
            <Text style={styles.macroPill}>{tNutri.carbos || '—'}C</Text>
            <Text style={styles.macroPill}>{tNutri.grasas || '—'}G</Text>
          </View>
        </Card>

        <Card title="Entrenamiento">
          <View style={styles.macroGrid}>
            <Text style={styles.macroPill}>{tEntre.dias || '—'} días</Text>
            <Text style={styles.macroPill}>{tEntre.cardio || '—'}</Text>
            <Text style={styles.macroPill}>{tEntre.pasos || '—'} pasos</Text>
          </View>
        </Card>

        {(clinico.retroalimentacion?.length > 0 || clinico.diagnostico?.length > 0 || clinico.objetivos?.length > 0) && (
          <Card title="Información clínica">
            {clinico.retroalimentacion?.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.cardTitle}>Retroalimentación</Text>
                {clinico.retroalimentacion.map((item, i) => (
                  <View key={i} style={styles.clinicalItem}>
                    <Text style={styles.clinicalNumber}>{i + 1}.</Text>
                    <Text style={styles.clinicalText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {clinico.diagnostico?.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.cardTitle}>Diagnóstico</Text>
                {clinico.diagnostico.map((item, i) => (
                  <View key={i} style={styles.clinicalItem}>
                    <Text style={styles.clinicalNumber}>{i + 1}.</Text>
                    <Text style={styles.clinicalText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {clinico.objetivos?.length > 0 && (
              <View>
                <Text style={styles.cardTitle}>Objetivos</Text>
                {clinico.objetivos.map((item, i) => (
                  <View key={i} style={styles.clinicalItem}>
                    <Text style={styles.clinicalNumber}>{i + 1}.</Text>
                    <Text style={styles.clinicalText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}
      </Page>

      {/* ========== PÁGINA DE CALENTAMIENTO GENERAL ========== */}
      {((plan?.warmupUpper?.length || 0) + (plan?.warmupLower?.length || 0) > 0) && (
        <Page key="warmup" size={[1080, 1920]} style={styles.page} footer={PageFooter}>
          <LogoHeader />
          <Text style={styles.sectionTitle}>Calentamiento general</Text>

          {plan.warmupLower?.length > 0 && (
            <Card title="Calentamiento Lower Body">
              {plan.warmupLower.map((fase: any) => (
                <View key={fase.id} style={{ marginBottom: 16 }}>
                  <View style={styles.bloqueHeader}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: fase.badgeColor || C.deep }} />
                    <Text style={styles.bloqueTitle}>{fase.nombre}</Text>
                  </View>
                  {fase.bloques.map((bloque: any) => (
                    <BloqueEjercicios key={bloque.letra} bloque={bloque} />
                  ))}
                </View>
              ))}
            </Card>
          )}

          {plan.warmupUpper?.length > 0 && (
            <Card title="Calentamiento Upper Body">
              {plan.warmupUpper.map((fase: any) => (
                <View key={fase.id} style={{ marginBottom: 16 }}>
                  <View style={styles.bloqueHeader}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: fase.badgeColor || C.deep }} />
                    <Text style={styles.bloqueTitle}>{fase.nombre}</Text>
                  </View>
                  {fase.bloques.map((bloque: any) => (
                    <BloqueEjercicios key={bloque.letra} bloque={bloque} />
                  ))}
                </View>
              ))}
            </Card>
          )}
        </Page>
      )}

      {/* ========== PÁGINAS DE ENTRENAMIENTO POR DÍA ========== */}
      {DAYS.map((day) => {
        const dayRoutine = routines[day.key];
        if (!dayRoutine || dayRoutine.tipo === 'rest') return null;
        const daySupps = supplements[day.key] || [];

        return (
          <Page key={day.key} size={[1080, 1920]} style={styles.page} footer={PageFooter}>
            <LogoHeader />
            <Text style={styles.dayLabel}>Entrenamiento - {day.full}</Text>

            {dayRoutine.fases?.filter((f) => f.grupo === 'main').length > 0 && (
              <Card title="Entrenamiento principal">
                {dayRoutine.fases.filter((f) => f.grupo === 'main').map((fase) => (
                  <View key={fase.id} style={{ marginBottom: 16 }}>
                    <View style={styles.bloqueHeader}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: fase.badgeColor || C.deep }} />
                      <Text style={styles.bloqueTitle}>{fase.nombre}</Text>
                    </View>
                    {fase.bloques.map((bloque: any) => (
                      <BloqueEjercicios key={bloque.letra} bloque={bloque} />
                    ))}
                  </View>
                ))}
              </Card>
            )}
          </Page>
        );
      })}

      {/* ========== PÁGINA DE NUTRICIÓN COMPLETA ========== */}
      <Page key="nutricion" size={[1080, 1920]} style={styles.page} footer={PageFooter}>
        <LogoHeader />
        <Text style={styles.sectionTitle}>Nutrición - Plan semanal</Text>

        {DAYS.map((day) => {
          const dayMeals = meals.filter((m: any) => m.dayKey === day.key);
          if (dayMeals.length === 0) return null;

          return (
            <View key={day.key} style={{ marginBottom: 24 }}>
              <View style={styles.nutritionDayHeader}>
                <Text style={styles.nutritionDayTitle}>{day.full}</Text>
              </View>

              <View style={styles.nutritionTableContainer}>
                {dayMeals.map((meal: any, i: number) => (
                  <View key={i} style={{ paddingVertical: 12, borderBottomWidth: i < dayMeals.length - 1 ? 1 : 0, borderBottomColor: '#E5E7EB' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <View style={{ backgroundColor: C.green, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ color: C.white, fontSize: 10, fontWeight: 800 }}>{meal.hour || meal.tiempo || ''}</Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: 700, color: C.deep }}>{meal.time || 'Comida'}</Text>
                      {meal.menuType === 'armar' && (
                        <View style={{ backgroundColor: C.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                          <Text style={{ color: C.white, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>Armar menú</Text>
                        </View>
                      )}
                      <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 'auto' }}>
                        {meal.kcal || 0} kcal
                        {meal.macros && (
                          <Text style={{ fontSize: 11, color: '#6B7280' }}>
                            {' '}• {(meal.macros.proteinas || 0)}p {(meal.macros.carbos || 0)}c {(meal.macros.grasas || 0)}g
                          </Text>
                        )}
                      </Text>
                    </View>

                    {meal.menuType === 'armar' && (
                      <View style={{ marginTop: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Elige 1 de cada grupo</Text>
                        <FoodCategorias foods={meal.foods || []} menuType={meal.menuType} />
                      </View>
                    )}

                    {meal.menuType === 'fijo' && meal.menus && meal.menus.length > 0 && (
                      <View style={{ marginTop: 8, gap: 12 }}>
                        {meal.menus.map((menu: any, mi: number) => (
                          <View key={mi}>
                            {menu.nombre && (
                              <Text style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{menu.nombre}</Text>
                            )}
                            <FoodCategorias foods={menu.alimentos || []} menuType="fijo" />
                          </View>
                        ))}
                      </View>
                    )}

                    {meal.menuType === 'fijo' && !meal.menus && (
                      <View style={{ marginTop: 8 }}>
                        <FoodCategorias foods={meal.foods || []} menuType="fijo" />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </Page>

      {/* ========== PÁGINA DE SUPLEMENTACIÓN ========== */}
      {(() => {
        const allSupps = Object.entries(supplements).flatMap(([dayKey, supps]: [string, any[]]) =>
          supps.map((s: any) => ({ ...s, dayKey }))
        );
        if (allSupps.length === 0) return null;

        const getHorarioColor = (horario: string): { bg: string; text: string } => {
          const h = (horario || '').toUpperCase();
          if (h.includes('MAÑANA') || h.includes('AM')) return { bg: C.primary, text: C.white };
          if (h.includes('TARDE') || h.includes('PM')) return { bg: C.orange, text: C.white };
          if (h.includes('NOCHE')) return { bg: C.deep, text: C.white };
          if (h.includes('POST') || h.includes('ENTRENO')) return { bg: C.green, text: C.white };
          return { bg: '#6B7280', text: C.white };
        };

        return (
          <Page key="suplementos" size={[1080, 1920]} style={styles.page} footer={PageFooter}>
            <LogoHeader />
            <Text style={styles.sectionTitle}>Suplementación</Text>

            {DAYS.map((day) => {
              const daySupps = supplements[day.key] || [];
              if (daySupps.length === 0) return null;

              return (
                <View key={day.key} style={{ marginBottom: 24 }}>
                  <View style={styles.nutritionDayHeader}>
                    <Text style={styles.nutritionDayTitle}>{day.full}</Text>
                  </View>

                  <View style={styles.nutritionTableContainer}>
                    {daySupps.map((s: any, i: number) => {
                      const colors = getHorarioColor(s.hora || s.horario || '');
                      return (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: i < daySupps.length - 1 ? 1 : 0, borderBottomColor: '#E5E7EB' }}>
                          <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                            <Text style={{ color: colors.text, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{s.hora || s.horario || ''}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: 700, color: C.deep }}>{s.nombre}</Text>
                            <Text style={{ fontSize: 12, color: '#6B7280' }}>{s.dosis}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </Page>
        );
      })()}

      {/* ========== PÁGINA DE GUÍA ========== */}
      {guia.length > 0 && (
        <Page key="guia" size={[1080, 1920]} style={styles.page} footer={PageFooter}>
          <LogoHeader />
          <View style={styles.guideHeader}>
            <Text style={styles.guideHeaderTitle}>Contenido educativo</Text>
            <Text style={styles.guideHeaderSubtitle}>Guía DocFitness</Text>
          </View>

          {guideSections.map((section, sIdx) => {
            const num = sIdx + 1;
            const badgeColor =
              section.type === 'faq' ? C.primary :
              section.type === 'split' ? C.green :
              section.type === 'grid' ? C.green :
              section.type === 'columns' ? C.primary :
              C.deep;
            const headerBg =
              section.type === 'faq' ? `${C.primary}10` :
              section.type === 'split' ? `${C.green}10` :
              section.type === 'grid' ? `${C.green}10` :
              section.type === 'columns' ? `${C.primary}10` :
              '#F6F6F6';

            if (section.type === 'faq') {
              return (
                <View key={section.id} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <View style={{ backgroundColor: badgeColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                      <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>{num}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 700, color: C.deep }}>{section.title}</Text>
                  </View>
                  {(section.items || []).map((f, i) => (
                    <View key={i} style={{ backgroundColor: C.white, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
                      <Text style={{ fontSize: 13, fontWeight: 700, color: C.deep, marginBottom: 6 }}>{f.q}</Text>
                      <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5 }}>{f.a}</Text>
                    </View>
                  ))}
                </View>
              );
            }

            if (section.type === 'split') {
              return (
                <View key={section.id} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <View style={{ backgroundColor: badgeColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                      <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>{num}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 700, color: C.deep }}>{section.title}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    {(section.sides || []).map((side, idx) => (
                      <View key={idx} style={{ flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' }}>
                        <Text style={{ fontSize: 14, fontWeight: 700, color: C.deep, marginBottom: 8 }}>{side.label}</Text>
                        <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, marginBottom: 8 }}>{side.body}</Text>
                        {side.dont?.map((d, i) => (
                          <View key={i} style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                            <Text style={{ color: C.red, fontSize: 14 }}>✕</Text>
                            <Text style={{ fontSize: 13, color: '#4B5563' }}>{d}</Text>
                          </View>
                        ))}
                        {side.swaps?.map((sw, i) => (
                          <View key={i} style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                            <Text style={{ fontWeight: 700, color: C.deep, fontSize: 13, minWidth: 70 }}>{sw.label}</Text>
                            <Text style={{ fontSize: 13, color: '#4B5563' }}>{sw.value}</Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            if (section.type === 'grid') {
              return (
                <View key={section.id} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <View style={{ backgroundColor: badgeColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                      <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>{num}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 700, color: C.deep }}>{section.title}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                    {(section.blocks || []).map((block, idx) => (
                      <View key={idx} style={{ width: 484, marginBottom: 12 }}>
                        <Text style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8, color: '#9CA3AF', marginBottom: 8 }}>{block.title}</Text>
                        {block.highlight ? (
                          <View style={{ backgroundColor: C.deep, padding: 16, borderRadius: 16 }}>
                            <Text style={{ color: C.white, fontSize: 14 }}>{(block.items || []).join(', ')}</Text>
                          </View>
                        ) : (
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {(block.items || []).map((t, i) => (
                              <View key={i} style={{ backgroundColor: C.green, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                                <Text style={{ color: C.white, fontSize: 12, fontWeight: 800 }}>{t}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            if (section.type === 'columns') {
              return (
                <View key={section.id} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <View style={{ backgroundColor: badgeColor, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
                      <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>{num}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 700, color: C.deep }}>{section.title}</Text>
                  </View>
                  <View style={styles.columnsRow}>
                    {(section.columns || []).map((col, idx) => (
                      <View key={idx} style={styles.column}>
                        <Text style={styles.columnTitle}>{col.title}</Text>
                        <Text style={styles.columnBody}>{col.body}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            return null;
          })}
        </Page>
      )}

      {/* ========== PÁGINA DE GLOSARIO ========== */}
      {glosario.length > 0 && (
        <Page key="glosario" size={[1080, 1920]} style={styles.page} footer={PageFooter}>
          <LogoHeader />
          <Text style={styles.sectionTitle}>Glosario</Text>
          {(() => {
            const grouped = glosario.reduce((acc, term) => {
              const cat = term.cat || 'General';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(term);
              return acc;
            }, {});

            return Object.entries(grouped).map(([cat, terms]) => (
              <View key={cat} style={{ marginBottom: 16 }}>
                <View style={{ backgroundColor: C.deep, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: C.white, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>{cat}</Text>
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                    <Text style={{ color: C.white, fontSize: 10, fontWeight: 800 }}>{terms.length}</Text>
                  </View>
                </View>
                <View style={styles.glossaryCat}>
                  {terms.map((term) => (
                    <View key={term.id} style={styles.glossaryTerm}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <View style={{ backgroundColor: C.deep, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
                          <Text style={{ color: C.white, fontSize: 10, fontWeight: 800 }}>{(term.term || '').slice(0, 2).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.glossaryTermTitle}>{term.term}</Text>
                      </View>
                      <Text style={[styles.glossaryTermDef, { marginLeft: 36 }]}>{term.def}</Text>
                      {term.body && (
                        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4, marginLeft: 36, lineHeight: 1.5 }}>{term.body}</Text>
                      )}
                      {term.example && (
                        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 6, marginLeft: 36 }}>
                          <View style={{ backgroundColor: C.deep, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
                            <Text style={{ color: C.white, fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>EJEMPLO</Text>
                          </View>
                          <Text style={{ fontSize: 12, color: C.deep, flex: 1 }}>{term.example}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ));
          })()}
        </Page>
      )}

      {/* ========== PÁGINA DE FOOTER ========== */}
      <Page key="contacto" size={[1080, 1920]} style={styles.page} footer={PageFooter}>
        <LogoHeader />
        <Text style={styles.sectionTitle}>Contacto</Text>

        <View style={{ backgroundColor: C.primary, borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 24 }}>
          <Image src="/doc-logo-white.svg" style={{ width: 120, height: 40, marginBottom: 16 }} />
          <Text style={{ color: C.white, fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Síguenos en redes</Text>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link src="https://wa.me/5212345678901" style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
              <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>WhatsApp</Text>
            </Link>
            <Link src="https://www.instagram.com/eldocfitness/" style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
              <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>Instagram</Text>
            </Link>
            <Link src="https://www.youtube.com/@docfitnesscoach" style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
              <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>YouTube</Text>
            </Link>
            <Link src="https://open.spotify.com/show/0xfjm7MDS0av4544Nl3lgH" style={{ padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999 }}>
              <Text style={{ color: C.white, fontSize: 11, fontWeight: 800 }}>Spotify</Text>
            </Link>
          </View>
        </View>

        <Text style={styles.footer}>
          Generado por DocFitness • {new Date().toLocaleDateString('es-ES')}
        </Text>
      </Page>
    </Document>
  );
}

export default PatientPDF;
