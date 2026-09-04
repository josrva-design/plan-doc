import type { ClientPlan } from "../core/types.ts";
import { guideSections, glossaryTerms } from '../data/guideContent.ts';
import { getDayType } from '../utils/dayType.ts';
import { exerciseDatabase } from '../data/exerciseDatabase.ts';
import { supplementDatabase } from '../data/supplementDatabase.ts';
import { getMealTotalKcal, getMealTotalMacros } from '../utils/nutritionHelpers.ts';
import { normalizeFood, normalizeMeal } from '../utils/normalizeEditorData.ts';
import { formatSupplementQty as formatSupplementQtyHelper, getFoodGroup, getFoodGroupBadge, formatQuantity, parseDate, formatRest } from './exportHelpers';
import { renderFoodItem, renderFoodList, renderMenu, renderArmar, renderArmarDetailed, renderSupplementsHTML, renderTratamientoDeportivo, renderInfoNutricional, renderCalendario } from './exportRenderers';

const COLORS = {
  navy: '#0D2640',
  blue: '#0066CC',
  green: '#2E9E70',
  gray: '#E8E8E8',
  white: '#FFFFFF',
  grayMedium: '#6B7280',
  light: '#F8F9FA',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  emerald500: '#10B981',
  emeraldLight: '#D1FAE5',
  emeraldDark: '#065F46',
  amberLight: '#FEF3C7',
  amberDark: '#92400E',
  bgBase: '#F6F6F5',
  grayLight: '#F3F4F6',
  textSecondary: '#4B5563',
};


export const generateDashboardFitnessHTML = (data: ClientPlan, mode = "todo") => {
  const person = data.person || {};
  const firstName = person.firstName || (person.nombre || '').trim().split(/\s+/)[0] || '';
  const lastName = person.lastName || (person.nombre || '').trim().split(/\s+/).slice(1).join(' ') || '';
  const nombre = person.nombre || `${firstName} ${lastName}`.trim() || 'Paciente';
  const edadSexo = [person.sexo, person.edad ? `${person.edad} años` : ''].filter(Boolean).join(' ');
  const routines = data.routines || {};
  const upper = data.warmupUpper || [];
  const lower = data.warmupLower || [];
  const general = data.warmupGeneral || [];
  const calendar = data.calendar || [];
  const meals = data.meals || [];
  const supplements = data.supplements || [];
  const stats = data.stats || {};
  const avances = data.avances || {};
  const estadisticas = data.estadisticas || {};
  const tNutri = data.tratamientoNutricional || {};
  const tEntre = data.tratamientoEntrenamiento || {};
  const clinico = data.clinico || {};
  const supplementsStrategy = data.supplementsStrategy || '';

  const hasTratamientoDeportivo = (() => {
    const hasStrategy = !!(tEntre?.estrategia && tEntre.estrategia !== '-') || !!(tEntre?.dias && tEntre.dias !== '-');
    const hasRoutineExercises = (Object.values(routines || {}) || []).some((r: any) => (r.fases || []).some((f: any) => (f.bloques || []).some((b: any) => (b.ejercicios || []).length > 0)));
    return hasStrategy || hasRoutineExercises;
  })();
  const hasEntrenamiento = (() => {
    const hasRoutineExercises = (Object.values(routines || {}) || []).some((r: any) => (r.fases || []).some((f: any) => (f.bloques || []).some((b: any) => (b.ejercicios || []).length > 0)));
    const hasCalendarDays = (calendar || []).some((day) => {
      const act = (day.actividad || '').toLowerCase();
      return act && act !== 'descanso';
    });
    return hasRoutineExercises && hasCalendarDays;
  })();
  const hasTratamientoNutricional = (() => {
    const hasStrategy = !!(tNutri?.estrategia && tNutri.estrategia !== '-');
    const totalKcal = (meals || []).reduce((sum, m) => sum + getMealTotalKcal(m), 0);
    const totalMacros = (meals || []).reduce((acc, m) => {
      const mt = getMealTotalMacros(m);
      acc.p += mt.p || 0;
      acc.c += mt.c || 0;
      acc.g += mt.g || 0;
      return acc;
    }, { p: 0, c: 0, g: 0 });
    return hasStrategy || totalKcal > 0 || totalMacros.p > 0 || totalMacros.c > 0 || totalMacros.g > 0;
  })();
  const hasCalentamiento = hasTratamientoDeportivo && (() => {
    const allGeneral = (general || []).flatMap(f => (f.bloques || []).flatMap(b => (b.ejercicios || [])));
    const allUpper = (upper || []).flatMap(f => (f.bloques || []).flatMap(b => (b.ejercicios || [])));
    const allLower = (lower || []).flatMap(f => (f.bloques || []).flatMap(b => (b.ejercicios || [])));
    return allGeneral.length > 0 || allUpper.length > 0 || allLower.length > 0;
  })();
  const hasSuplementos = (supplements || []).length > 0;

  const esc = (str) => String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const escRich = (str) => {
    const s = String(str ?? '');
    const unescaped = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return unescaped
      .replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>')
      .replace(/&lt;i&gt;/g, '<i>').replace(/&lt;\/i&gt;/g, '</i>')
      .replace(/&lt;br&gt;/g, '<br>')
      .replace(/&lt;span style=&quot;(.*?)&quot;&gt;/g, (_, style) => `<span style="${style}">`)
      .replace(/&lt;\/span&gt;/g, '</span>');
  };


  const diasEntrenamiento = (calendar || []).filter((day) => {
    const act = (day.actividad || '').toLowerCase();
    return act && act !== 'descanso';
  }).length;

  const isCardioDayExport = (day) => {
    const act = String(day.actividad || '').toLowerCase();
    if (act.includes('cardio')) return true;
    if (!day.routineId) return false;
    const routine = routines[day.routineId];
    if (!routine) return false;
    const ejercicios = (routine.fases || []).flatMap((f) => (f.bloques || [])).flatMap((b) => (b.ejercicios || []));
    return ejercicios.some((ej) => {
      const tipo = String(ej.tipo || '').toLowerCase();
      if (tipo === 'cardio') return true;
      if (tipo === 'normal') return false;
      return String(ej.musculo || '').toLowerCase().startsWith('cardio');
    });
  };

  const cardioSesiones = (calendar || []).reduce((sum, day) => {
    if (!isCardioDayExport(day)) return sum;
    const routine = routines[day.routineId];
    if (!routine) return sum;
    const ejercicios = (routine.fases || []).flatMap((f) => (f.bloques || [])).flatMap((b) => (b.ejercicios || []));
    return sum + ejercicios.length;
  }, 0);

  const cardioDias = (calendar || []).filter(isCardioDayExport).length;
  const cardioValue = cardioDias === 0 ? '—' : String(cardioDias);

  const volumenEntrenamiento = Object.values(routines || {}).reduce((sum, r) => {
    const ejercicios = (r.fases || []).flatMap((f) => (f.bloques || [])).flatMap((b) => (b.ejercicios || []));
    return sum + ejercicios.reduce((s, ej) => s + (parseInt(ej.semana1 || ej.sets || '0') || 0), 0);
  }, 0) || '—';


  const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const logoHTML = `<img src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTg2LjM5MyA1Mi4xNjE0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBpZD0iR3JvdXAgMyI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik0xNTguNTUyIDQyLjQ2MjNDMTYzLjcyNCAzNy4xNTY5IDE2Ny44OTMgMzEuMjM4OCAxNzAuODM0IDI0Ljc0MjlDMTcxLjk4IDIyLjIxNzIgMTcyLjg0OCAxOS43MDY1IDE3Mi44OTcgMTYuOTkxNUMxNzIuOTI5IDE1LjIxODEgMTcyLjMyNCAxMy4yMzA1IDE3MC42MzggMTIuMjc0QzE2My43NjMgOC4zNTM1IDE1MS43MDQgNi42NDk4IDE0My42MzQgNS45MDI1N0MxMzUuMTI3IDUuMTE1NDggMTI2Ljc0NiA1LjAxNTg1IDExOC4xNDIgNS4wMjA4M0wxMjQuMzU3IDMuNTc2MTdDMTQ0LjY1NCAtMC43MDc5NzggMTY1Ljc3NiAtMS44Mjg4MyAxODUuODQ1IDQuMDY0MzdDMTg2Ljc3OCA0LjMzODM1IDE4Ni4yNzYgNS40NzQxNSAxODYuMTAxIDYuMDYxOThDMTgyLjA2MyAxOS40NTI0IDE3NC45MjEgMzIuMzc0NiAxNjMuNjcgNDEuOTQ0MkMxNTguODY4IDQ2LjA5MzkgMTUzLjUxNiA0OS42MzU4IDE0Ny4zNDQgNTIuMTYxNEMxNTEuMjk1IDQ5LjAyOCAxNTUuMDcxIDQ2LjAzNDEgMTU4LjU1NyA0Mi40NjIzSDE1OC41NTJaIiBmaWxsPSIjMDA2NkNDIi8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTExMi4wODUgMzQuOTg1MkgxMDUuNzA3TDEwMy41OTUgMjEuOTg4M0wxMDAuMTUyIDM0Ljk4NTJIOTUuMjc0MkwxMDAuNzA5IDEzLjEzNkgxMDcuMDQ5TDEwOS4yNDggMjYuMTgyOEwxMTIuNjI2IDEzLjEzNkgxMTcuNTQyTDExMi4wODUgMzQuOTg1MloiIGZpbGw9IiMwMDY2Q0MiLz4KPHBhdGggaWQ9IlZlY3Rvcl8zIiBkPSJNMTguMjYyNiAxNC43OTQ5QzIxLjQxMDkgMTcuNTI5OCAxOC4zMTE3IDI2Ljc3MDYgMTYuODYwMyAyOS44NTkyQzE1LjQ0MTYgMzIuODgzIDEyLjU5MzQgMzQuOTQ1NCA4Ljk5NzYgMzQuOTg1MkgwTDUuNDQwMDMgMTMuMTM2SDEzLjQ5MzdDMTUuMzEwNyAxMy4xNTEgMTYuOTU4NSAxMy42OTQgMTguMjY4IDE0Ljc5NDlIMTguMjYyNlpNMTIuMDU4NiAyOC4xNTA1QzEzLjA3OSAyNS4zNTA5IDEzLjcwMSAyMi41NzYxIDE0LjE0ODQgMTkuNzE2N0MxNC4yNzM5IDE4LjkxNDcgMTQuMDMzOSAxNy44ODM1IDEzLjI5MTggMTcuNDg1QzEyLjI3MTQgMTYuOTM3IDExLjAwNTYgMTYuOTcxOSA5Ljg0ODggMTcuMTY2MUw2LjQ2NTgzIDMwLjk0NTJDOS4yNjQ5NyAzMS4xODQzIDExLjAzMjggMzAuOTY1MSAxMi4wNTg2IDI4LjE1MDVaIiBmaWxsPSIjMDA2NkNDIi8+CjxwYXRoIGlkPSJWZWN0b3JfNCIgZD0iTTMyLjE1NDYgMzMuOTgzNkMzMC4wMzIgMzUuMzgzNCAyNy41OTMgMzUuNDczMSAyNS4xNDMxIDM1LjM1ODVDMjEuODQ3NCAzNS4yMDQxIDE5Ljc3OTUgMzMuMDU3IDE5Ljk3NTkgMjkuOTYzNEMyMC4yMTYgMjYuMTYyNSAyMS4xMzgxIDIyLjMzNjcgMjIuNTM0OSAxOC42OTUxQzI0LjQwMSAxMy44MjgxIDI5LjI0MDkgMTEuOTY1IDM0LjQ1MTcgMTMuMDc1OUMzNi44NDE2IDEzLjU4NCAzOC40MTMxIDE1LjM0MjUgMzguMzU4NSAxNy43MTg3QzM4LjI3NjcgMjEuMzgwMiAzNy4yNTYzIDI1LjAzMTcgMzYuMDc3NyAyOC41ODM1QzM1LjM2MjkgMzAuNzMwNiAzNC4xODQ0IDMyLjY0ODUgMzIuMTYgMzMuOTgzNkgzMi4xNTQ2Wk0yNy45Njk1IDMxLjUzMjZDMjkuMjEzNiAzMS4yMjg4IDMwLjAzNzUgMzAuMjQyNCAzMC40MTQgMjkuMTM2NUMzMS41NzA3IDI1Ljc0OSAzMi4zNjc0IDIyLjMzMTcgMzIuOTIzOSAxOC44MTQ3QzMzLjAzMzEgMTguMTE3MyAzMi43MzI5IDE3LjIyNTYgMzIuMTQzNyAxNi44NzE5QzMxLjM1MjUgMTYuMzk4NiAzMC4zNTQgMTYuNTE4MiAyOS40OTE4IDE2LjkxNjdDMjguOTA4IDE3LjE4NTcgMjguMjgwNSAxNy45NzI4IDI3Ljk5MTMgMTguNzU0OUMyNi43MTQ1IDIyLjIyMjEgMjUuOTEyNCAyNS44Mjg3IDI1LjMzOTUgMjkuNDcwM0MyNS4yNDEzIDMwLjA5NzkgMjUuNjIzMyAzMC45MDUgMjYuMDMyNSAzMS4yMTM4QzI2LjUwMTcgMzEuNTY3NSAyNy4yNjAyIDMxLjcwMiAyNy45NzUgMzEuNTI3N0wyNy45Njk1IDMxLjUzMjZaIiBmaWxsPSIjMDA2NkNDIi8+CjxwYXRoIGlkPSJWZWN0b3JfNSIgZD0iTTE0NS45MSAyOS4yNzEyQzE0NS4yNjYgMzEuODIxNyAxNDMuNjU2IDMzLjg0OTIgMTQwLjkyMiAzNC43NjA5QzEzOC41NDMgMzUuNTQ4IDEzNS44MDQgMzUuNjU3NSAxMzMuNDE0IDM0LjkwMDNDMTI5Ljc0OCAzMy43Mzk2IDEzMC4wMjYgMzAuNTM2NSAxMzAuODcyIDI3LjY1NzFMMTM2LjA3MiAyNy42NzIxQzEzNS45NzkgMjguNzQzMSAxMzUuMzY4IDMwLjA1ODMgMTM2LjIwMyAzMC45NEMxMzcuMjk5IDMyLjEwMDcgMTM5LjQ3NiAzMS40MTgyIDE0MC4yMDggMzAuMjUyNUMxNDEuMDkyIDI4Ljg0NzcgMTQwLjU5NSAyNy40MzMgMTM5LjA4NCAyNi41MzEzTDEzNS40NDQgMjQuMzU5M0MxMzMuNjk4IDIzLjMxODIgMTMyLjkwMSAyMS42Mzk0IDEzMy4wNTQgMTkuNzc2M0MxMzMuMjc4IDE3LjA2NjMgMTM0LjkxNSAxNC43NTk5IDEzNy42NTkgMTMuNjI0MUMxMzkuNzYgMTIuNzU3MyAxNDIuMTU2IDEyLjU2OCAxNDQuNDA0IDEzLjAyMTNDMTQ2LjU0OCAxMy40NTQ3IDE0OC4wODEgMTQuOTA5MyAxNDguMjEyIDE2LjkxNjlDMTQ4LjI3MiAxNy44MjM1IDE0OC4xMTQgMTguNzI1MiAxNDcuODkgMTkuNjY2N0gxNDIuNDU2QzE0Mi42NTcgMTguNzk5OSAxNDMuMDk0IDE3Ljg3ODMgMTQyLjQ5OSAxNy4xMzExQzE0MS45MjYgMTYuNDA4OCAxNDAuNjcxIDE2LjUwMzQgMTM5LjgyNiAxNi44OTJDMTM5LjAyOSAxNy4yNTU2IDEzOC42MDMgMTguMDU3NyAxMzguNTY1IDE4Ljk2NDNDMTM4LjUyNyAyMC4wMDA1IDEzOS4wMTMgMjAuNzU3NyAxMzkuOTk1IDIxLjI5NTdDMTQzLjUzNiAyMy4yNDg1IDE0Ny4wMjggMjQuODQyNiAxNDUuOTEgMjkuMjc2MlYyOS4yNzEyWiIgZmlsbD0iIzAwNjZDQyIvPgo8cGF0aCBpZD0iVmVjdG9yXzYiIGQ9Ik0xNTcuNDQ1IDM0Ljc0MDVDMTU1LjEwOSAzNS41Mzc1IDE1Mi41MTcgMzUuNjIyMiAxNTAuMTg4IDM0Ljk5OTVDMTQ2LjM3OSAzMy45ODMzIDE0Ni40MTIgMzAuNjQwNiAxNDcuMzM5IDI3LjY0NjdIMTUyLjU0NUMxNTIuMzE2IDI4Ljc0NzYgMTUxLjgxNCAzMC44OTQ3IDE1My4yMDUgMzEuMzM4MUMxNTQuNDk4IDMxLjc1MTUgMTU1LjkxMSAzMS4zODc5IDE1Ni41ODggMzAuMzkxNkMxNTkuNTEzIDI2LjA4MjUgMTUwLjg5MSAyNS44Mzg0IDE0OS43NzMgMjEuNzM4NkMxNDguNzAzIDE3LjgzMyAxNTEuNDc1IDE0LjAyNzEgMTU1LjcyIDEzLjExNTVDMTU3LjY4NSAxMi42OTIgMTU5LjYzMyAxMi42MDczIDE2MS41MzcgMTMuMjA1MUMxNjQuNzM0IDE0LjIwNjQgMTY1LjE1NCAxNi45NTYzIDE2NC40MTIgMTkuNjcxMkwxNTguOTI5IDE5LjY0NjNDMTU5LjE1MiAxOC43NzQ1IDE1OS42NzEgMTcuNTk4OSAxNTguODUyIDE2Ljk5MTFDMTU3LjY3OSAxNi4xMjQzIDE1NS45IDE2LjcyMjEgMTU1LjI4OSAxNy44NDhDMTU0LjY3MyAxOC45OTM3IDE1NC45MDIgMjAuMzY4NiAxNTYuMTk1IDIxLjEzMDhMMTYwLjA5MSAyMy40MjczQzE2Mi40ODYgMjQuODQyMSAxNjMuMTAzIDI3LjI1MzIgMTYyLjMyOCAyOS42NzQyQzE2MS41ODYgMzEuOTgwNyAxNjAuMDg1IDMzLjgzMzggMTU3LjQ1IDM0LjczNTVMMTU3LjQ0NSAzNC43NDA1WiIgZmlsbD0iIzAwNjZDQyIvPgo8cGF0aCBpZD0iVmVjdG9yXzciIGQ9Ik00NC41Nzg3IDMxLjE0OTRDNDUuOTU5MiAzMi4xODA1IDQ3Ljc5MjYgMzEuMzk4NCA0OC40OTEgMzAuMTEzMkM0OS4wOTY2IDI5LjAwMjMgNDkuMzMxMyAyNy45MjEzIDQ5LjU4MjMgMjYuNjUxSDU1LjAyMjNDNTQuMTA1NiAzMS4xMTk1IDUxLjU5NTcgMzUuMTY0NSA0Ni4wNDEgMzUuMzYzOEM0NC43MjA2IDM1LjQxMzYgNDMuNDM4MyAzNS4zOTg2IDQyLjE3NzkgMzUuMDk0OEMzNy4zOTgxIDMzLjk0NCAzOC40Njc2IDI4LjczMzMgMzkuMjI2IDI1LjMzMDlDMzkuNzcxNiAyMi44NzUgNDAuMzYwOSAyMC41MTg3IDQxLjM1OTUgMTguMjIyMkM0Mi44NzA5IDE0Ljc0MDEgNDYuMjgxMSAxMi42NTc4IDUwLjM5NTMgMTIuNzY3NEM1MS43NzU3IDEyLjgwMjIgNTMuMDkwNyAxMi45MTE4IDU0LjM1MTEgMTMuNTA5NkM1Ny4zMDMxIDE0LjkxOTQgNTYuOTEwMiAxOC4yMDcyIDU2LjI4MjcgMjAuNzc3N0w1MC44NyAyMC44Mzc1TDUxLjMyMjggMTguNDAxNUM1MS40MTU2IDE3LjkwMzQgNTEuMTQyOCAxNy4yMTA5IDUwLjc5MzYgMTYuOTIyQzUwLjM1MTYgMTYuNTUzNCA0OS42MzY4IDE2LjQ3MzcgNDguOTY1NyAxNi41NzMzQzQ3LjcxNjIgMTYuNzYyNiA0Ni45Njg2IDE3Ljc5ODggNDYuNTQ4NSAxOC45Mzk1QzQ1LjMzNzIgMjIuMjUyMyA0NC42Mzg4IDI1LjY1OTcgNDQuMDQ0IDI5LjE0MThDNDMuOTQwMyAyOS43Mzk2IDQ0LjA0NCAzMC43MzU5IDQ0LjU4NDIgMzEuMTM5NEw0NC41Nzg3IDMxLjE0OTRaIiBmaWxsPSIjMDA2NkNDIi8+CjxwYXRoIGlkPSJWZWN0b3JfOCIgZD0iTTEyOS4xOCAyNS43MDQ2SDEyMi41MzRMMTIxLjIyNSAzMS4wMDQ5TDEyOC42NDYgMzEuMDA5OUwxMjcuNTcxIDM0Ljk4NTJIMTE0Ljg0MUwxMjAuMjg2IDEzLjEzNkgxMzIuOTRMMTMxLjkzIDE3LjIzNTlMMTI0LjY0MSAxNy4yMTFMMTIzLjQ5NSAyMS44Nzg3SDEzMC4xOUwxMjkuMTggMjUuNzA0NloiIGZpbGw9IiMwMDY2Q0MiLz4KPHBhdGggaWQ9IlZlY3Rvcl85IiBkPSJNNzEuNjk3MiAyMS44Nzg3TDcwLjc0MjQgMjUuNzA0Nkg2My4xNTI1TDYwLjg1NTQgMzQuOTg1Mkg1NS40MjYzTDYwLjg2NjMgMTMuMTM2SDc0LjM2TDczLjMzOTYgMTcuMjE2SDY1LjI0MjNMNjQuMDk2NSAyMS44Nzg3SDcxLjY5NzJaIiBmaWxsPSIjMDA2NkNDIi8+CjxwYXRoIGlkPSJWZWN0b3JfMTAiIGQ9Ik04OC42MTczIDM0Ljk4NTJIODMuMTU1NEw4Ny42MTMzIDE3LjIxNkg4Mi45MTU0TDgzLjkzNTcgMTMuMTM2SDk4LjYyOThMOTcuNjE0OSAxNy4yMTZIOTIuOTg3OUw4OC42MTczIDM0Ljk4NTJaIiBmaWxsPSIjMDA2NkNDIi8+CjxwYXRoIGlkPSJWZWN0b3JfMTEiIGQ9Ik03Ni40MjIzIDM0Ljk4NTJINzAuOTk4Nkw3Ni40Mzg3IDEzLjEzNkg4MS44NTY5TDc2LjQyMjMgMzQuOTg1MloiIGZpbGw9IiMwMDY2Q0MiLz4KPC9nPgo8L3N2Zz4K" style="height:28px;width:auto;display:block">`;


  const fechaConsulta = parseDate(data.fechaConsulta);
  const consultaLabel = fechaConsulta ? fechaConsulta.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const proxima = data.proximaConsulta || '';

  const dayRoutine = routines.monday || { tipo: 'rest', actividad: '', fases: [] };
  const dayMeals = meals || [];
  const daySupps = supplements || [];

  const warmupList = (title, w, type) => {
    const all = [...(w || [])];
    if (!all.length) return '';

    const faseColor = (fase) => {
      if (fase === 'GENERAL' || fase === 'CG') return '#0D2640';
      if (fase === 'MOVILIDAD' || fase === 'ED') return '#2E9E70';
      if (fase === 'ESPECÍFICO' || fase === 'CE') return '#0B63CE';
      return '#0D2640';
    };

    const exercises = all.flatMap(fase => (fase.bloques || []).flatMap(bloque => (bloque.ejercicios || []).map((ej, idx) => ({
      ...ej,
      fase: fase.nombre || fase.fase || '',
      idx: idx + 1,
    }))));

    return `
      <div class="training-card">
        <div class="training-header">
          <span class="training-label">${esc(title)}</span>
        </div>
        <div class="training-title">${type === 'lower' ? 'Tren Inferior' : type === 'upper' ? 'Tren Superior' : 'Calentamiento'}</div>
        <div class="training-list">
          ${exercises.map((ej, i) => {
            const isLastEj = i === exercises.length - 1;
            return `
              <div style="display:flex;gap:10px;padding:10px 0;border-bottom:${!isLastEj ? '1px solid rgba(0,0,0,0.04)' : 'none'}">
                <div style="width:16px;height:16px;border-radius:999px;background:#0D2640;color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:800;flex-shrink:0">${i + 1}</div>
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                    <span style="font-size:10px;font-weight:700;line-height:1.3;color:#0D2640">${esc(ej.nombre || '')}</span>
                  </div>
                <div style="font-size:9px;color:#6B7280;margin-top:1px">${esc(ej.prescripcion || ej.codigo || '')}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

    const avancesCard = () => {
    const pesoActual = avances.peso?.actual;
    const pesoAnterior = avances.peso?.anterior;
    const pesoDelta = avances.peso?.delta;

    const measures = [
      ['Abdomen', avances.abdomen?.actual, avances.abdomen?.anterior, avances.abdomen?.delta],
      ['Grasa kg', avances.grasaKg?.actual, avances.grasaKg?.anterior, avances.grasaKg?.delta],
      ['Grasa %', avances.grasaPct?.actual, avances.grasaPct?.anterior, avances.grasaPct?.delta],
      ['Pliegue', avances.pliegue?.actual, avances.pliegue?.anterior, avances.pliegue?.delta],
    ].filter(([, actual]) => actual);

    if (!pesoActual && !measures.length) return '<div style="text-align:center;padding:20px;color:#6B7280;font-size:11px">Sin datos de evolución</div>';

    const roundDelta = (d) => {
      const n = Number(d);
      if (!Number.isFinite(n)) return '0';
      return n.toFixed(1);
    };

    const miniCards = [
      { title: 'Nutrición', value: String(estadisticas.nutricion || 0), suffix: '%', pct: Number(estadisticas.nutricion || 0) },
      { title: 'Entreno', value: String(estadisticas.entrenamiento || 0), suffix: '%', pct: Number(estadisticas.entrenamiento || 0) },
      { title: 'Cardio', value: String(estadisticas.cardio || 0), suffix: '%', pct: Number(estadisticas.cardio || 0) },
      { title: 'Descanso', value: String(estadisticas.descanso || 0), suffix: '%', pct: Number(estadisticas.descanso || 0) },
    ];

     return `
       <div style="margin-bottom:16px">
         ${pesoActual ? `
            <div class="metric-card--hero" style="background:${COLORS.blue}">
             <div style="font-size:9px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;opacity:.7">${esc(avances.peso?.label || 'PESO')}</div>
             <div style="display:flex;align-items:baseline;gap:8px;margin-top:8px">
               <span style="font-size:14px;font-weight:600;opacity:.5">${pesoAnterior || '—'}</span>
               <span style="font-size:24px;font-weight:900;line-height:1">${pesoActual}</span>
               <span style="font-size:12px;opacity:.6">kg</span>
             </div>
             <div style="font-size:8px;font-weight:700;letter-spacing:0.1em;opacity:.4;margin-top:6px;text-transform:uppercase">Anterior → Actual</div>
             ${pesoDelta ? (() => { const d = roundDelta(pesoDelta); const isPositive = Number(d) > 0; const arrow = isPositive ? '↑ +' : '↓ '; return `<div style="position:absolute;top:16px;right:16px;font-size:11px;font-weight:800;background:rgba(255,255,255,0.15);padding:4px 10px;border-radius:999px">${esc(arrow + d)}</div>`; })() : ''}
           </div>
        ` : ''}

         ${measures.length > 0 ? `
           <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
             ${measures.map(([label, actual, anterior, delta]) => {
               const d = roundDelta(delta || (anterior ? Number(actual) - Number(anterior) : 0));
               const isPositive = Number(d) > 0;
               const arrow = isPositive ? '↑ +' : '↓ ';
               return `
                    <div class="metric-card--small">
                      <span style="font-size:9px;letter-spacing:1px;color:#0D2640;font-weight:700;display:block">${esc(label)}</span>
                      ${anterior ? `<div class="measure-delta" style="color:${COLORS.green};background:rgba(46,158,112,0.08)">${esc(arrow + d)}</div>` : ''}
                    <div style="display:flex;align-items:baseline;justify-content:center;gap:4px;margin-top:4px">
                      <span style="font-size:12px;font-weight:700;color:#9CA3AF">${anterior || '—'}</span>
                      <span style="font-size:16px;font-weight:900;color:${COLORS.navy}">${esc(actual || '—')}</span>
                    </div>
                     <div style="font-size:8px;font-weight:700;letter-spacing:0.1em;opacity:.4;margin-top:2px;text-transform:uppercase">Anterior → Actual</div>
                  </div>
               `;
             }).join('')}
           </div>
         ` : ''}

          <div style="background:#2E9E70;border-radius:16px;padding:14px;color:#fff;margin-bottom:12px">
           <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;opacity:.8">Adherencia al plan</span>
             <span style="font-size:20px;font-weight:900;line-height:1">${estadisticas.adherencia || 0}%</span>
           </div>
           <div style="height:8px;background:rgba(255,255,255,0.2);border-radius:999px;overflow:hidden">
             <div style="height:100%;background:#fff;border-radius:999px;width:${estadisticas.adherencia || 0}%"></div>
           </div>
         </div>

          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
             ${miniCards.map(card => `
                 <div class="metric-card--small">
                 <span style="font-size:9px;letter-spacing:1px;color:#0D2640;font-weight:700;display:block">${esc(card.title)}</span>
                 <div style="display:flex;align-items:baseline;justify-content:center;gap:2px;margin-top:4px">
                   <span style="font-size:16px;font-weight:900;color:#0D2640">${card.value}</span>
                   <span style="font-size:11px;font-weight:800;color:#0D2640">${card.suffix}</span>
                 </div>
                <div style="height:6px;background:${COLORS.light};border-radius:999px;overflow:hidden;margin-top:8px">
                  <div style="height:100%;background:${COLORS.green};border-radius:999px;width:${Math.min(card.pct, 100)}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
       </div>
    `;
  };

  const calentamientoHTML = () => {
    const generalFases = general || [];
    const upperFases = upper.filter(f => f.id !== 'CG');
    const lowerFases = lower.filter(f => f.id !== 'CG');

    const hasGeneral = generalFases.length > 0;
    const hasUpper = upperFases.length > 0;
    const hasLower = lowerFases.length > 0;

    if (!hasGeneral && !hasUpper && !hasLower) return '';

    const isTimeBased = (val) => {
      if (!val) return false;
      const s = String(val).toLowerCase();
      return s.includes('seg') || s.includes('min');
    };

    const renderEjercicioRow = (ex, exIdx, total, faseId) => {
      const isLastEj = exIdx === total - 1;
      const displayCode = ex.codigo || '—';
      const reps = ex.reps || '';
      const rawDescanso = ex.descanso || ex.pausa || '';
      const descanso = rawDescanso ? formatRest(rawDescanso) : '';
      
      // General usa tiempo, no reps
      let infoLine = '';
      if (faseId === 'CG') {
        const timeVal = reps;
        infoLine = timeVal ? `<div class="warmup-ejercicio-detail"><b>${esc(timeVal)}</b></div>` : '';
      } else {
        infoLine = (reps || descanso) ? `<div class="warmup-ejercicio-detail">${reps ? `<b>${esc(reps)}</b> reps` : ''}${reps && descanso ? ' • ' : ''}${descanso ? `<b>${esc(descanso)}</b> descanso` : ''}</div>` : '';
      }
      
      const musculo = ex.musculo || '';
      const movimiento = ex.movimiento || '';
      const musculoLine = (musculo || movimiento) ? `<div class="warmup-ejercicio-detail">${musculo ? `<b>${esc(musculo)}</b>` : ''}${musculo && movimiento ? ' · ' : ''}${movimiento ? `${esc(movimiento)}` : ''}</div>` : '';
      const noteLine = ex.notas ? `<div class="warmup-ejercicio-presc">${esc(ex.notas)}</div>` : '';

      return `
        <div class="warmup-ejercicio">
          <span class="warmup-ejercicio-code">${esc(displayCode)}</span>
          <div class="warmup-ejercicio-info">
            <div class="warmup-ejercicio-name">${esc(ex.nombre || '—')}</div>
            ${musculoLine}
            ${infoLine}
            ${noteLine}
          </div>
        </div>
      `;
    };

    const renderBloque = (bloque, bIdx, faseId) => {
      const isMulti = Boolean(bloque.tipo && bloque.tipo !== 'SERIE SIMPLE');
      return `
        <div class="warmup-bloque">
          <div class="warmup-bloque-header">
            <span class="warmup-bloque-letter">${esc(bloque.letra)}</span>
            <span class="warmup-bloque-type">${esc(bloque.tipo || 'BLOQUE')}</span>
          </div>
          ${isMulti ? `<div style="margin-left:10px;border-left:1px solid #F3F4F6;padding-left:8px">` : ''}
          ${(bloque.ejercicios || []).map((ex, exIdx) => renderEjercicioRow(ex, exIdx, (bloque.ejercicios || []).length, faseId)).join('')}
          ${isMulti ? `</div>` : ''}
        </div>
      `;
    };

    const getFasePill = (faseId) => {
      if (faseId === 'CG') return '<span class="warmup-fase-pill warmup-fase-pill--general">General</span>';
      if (faseId === 'ED') return '<span class="warmup-fase-pill warmup-fase-pill--movilidad">Movilidad</span>';
      if (faseId === 'CE') return '<span class="warmup-fase-pill warmup-fase-pill--especifico">Específico</span>';
      return '';
    };

    const renderFase = (fase, faseIdx) => {
      const bloques = fase.bloques || [];
      if (!bloques.length) return '';
      const pill = getFasePill(fase.id);
      return `
        <div class="warmup-fase-title">${pill}</div>
        ${bloques.map((bloque, bIdx) => renderBloque(bloque, bIdx, fase.id)).join('')}
      `;
    };

    const renderGroup = (title, fases) => {
      if (!fases.length) return '';
      const totalEj = fases.reduce((s, f) => s + (f.bloques || []).reduce((bs, b) => bs + (b.ejercicios || []).length, 0), 0);
      const totalBloques = fases.reduce((s, f) => s + (f.bloques || []).length, 0);
      return `
        <details class="card-collapsible warmup-group">
          <summary>
            <span>${title}</span>
            <span style="font-size:10px;color:#6B7280;font-weight:700">${totalEj} ejercicios ▼</span>
          </summary>
          <div class="card-content">
            <div class="warmup-stats">
              <span class="warmup-stat-badge">${totalEj} ejercicios</span>
              <span class="warmup-stat-badge">${totalBloques} bloques</span>
            </div>
            ${fases.map((fase, idx) => renderFase(fase, idx)).join('')}
          </div>
        </details>
      `;
    };

    return `
      <div>
        ${renderGroup('General', generalFases)}
        ${renderGroup('Tren Superior', upperFases)}
        ${renderGroup('Tren Inferior', lowerFases)}
      </div>
    `;
  };

  const renderGuiaContent = () => {
    if (!guideSections.length) return '';

    const fmt = (str) => {
      if (!str) return '';
      return String(str).replace(/\n/g, '<br>');
    };

     const badgeColor = (section) => {
       if (section.type === 'faq') return '#0066CC';
       if (section.type === 'split') return '#0066CC';
       if (section.type === 'grid') return '#0066CC';
       if (section.type === 'columns') return '#0066CC';
       return '#0066CC';
     };

     const sideBadge = (variant) => {
       if (variant === 'menu-fijo') return 'background:#0D2640;color:#fff';
       if (variant === 'armar-menu') return 'background:#0066CC;color:#fff';
       if (variant === 'green') return 'background:#059669;color:#fff';
       if (variant === 'red') return 'background:#DC2626;color:#fff';
       return 'background:#0D2640;color:#fff';
     };

    const renderSectionInner = (section) => {
      switch (section.type) {
         case 'split':
           return `
             <div style="display:flex;flex-direction:column;gap:10px">
               ${(section.sides || []).map(side => `
                 <div>
                   <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:999px;display:inline-block;margin-bottom:6px;${sideBadge(side.variant)}">${esc(side.label || '')}</span>
                    <div style="font-size:10px;color:#0D2640;line-height:1.5">${fmt(escRich(side.body || ''))}</div>
                   ${(side.dont || []).map(d => `
                     <div style="display:flex;align-items:center;gap:4px;margin-top:4px;font-size:10px;color:#DC2626"><span>✕</span> ${escRich(d)}</div>
                   `).join('')}
                   ${(side.swaps || []).map(sw => `
                      <div style="display:flex;gap:4px;margin-top:4px;font-size:10px"><span style="font-weight:700;color:#0D2640;min-width:70px">${esc(sw.label || '')}</span><span style="color:#0D2640">${escRich(sw.value || '')}</span></div>
                   `).join('')}
                   ${(side.categories || []).map(cat => `
                     <div style="margin-top:6px;padding-top:6px;border-top:1px solid #F3F4F6">
                        <div style="font-size:9px;font-weight:700;color:#0D2640;margin-bottom:4px">${esc(cat.name || '')}</div>
                        ${(cat.items || []).map(item => `
                          <div style="display:flex;align-items:flex-start;gap:4px;font-size:10px;color:#0D2640;line-height:1.5"><span style="color:#0D2640;margin-top:1px">•</span> ${fmt(escRich(String(item)))}</div>
                        `).join('')}
                     </div>
                   `).join('')}
                 </div>
               `).join('')}
             </div>
           `;
         case 'columns':
           return `
             <div style="display:flex;flex-direction:column;gap:8px">
               ${(section.columns || []).map(col => `
                 <div style="padding:8px 0;border-bottom:1px solid #F3F4F6">
                    <div style="font-size:11px;font-weight:700;color:#0D2640;margin-bottom:4px">${esc(col.title || '')}</div>
                    <div style="font-size:10px;color:#0D2640;line-height:1.5">${fmt(escRich(col.body || ''))}</div>
                 </div>
               `).join('')}
             </div>
           `;
         case 'grid':
           return `
              ${section.note ? `<span class="note-badge note-badge--success">${esc(section.note || '')}</span>` : ''}
             <div style="display:flex;flex-direction:column;gap:10px">
               ${(section.blocks || []).map(block => `
                 <div style="padding:6px 0">
                   <div style="font-size:11px;font-weight:700;color:#0D2640;margin-bottom:6px">${esc(block.title || '')}</div>
                   ${block.highlight
                     ? `<div style="background:#0D2640;border-radius:12px;padding:12px"><div style="font-size:10px;color:rgba(255,255,255,0.8);line-height:1.5">${fmt((block.items || []).join('; '))}</div></div>`
                      : `<div style="display:flex;flex-wrap:wrap;gap:6px">
                          ${(block.items || []).map(item => `
                            <span class="tag-pill">${escRich(item)}</span>
                          `).join('')}
                        </div>`
                   }
                 </div>
               `).join('')}
             </div>
           `;
         case 'faq':
           return `
             <div style="display:flex;flex-direction:column;gap:4px">
               ${(section.items || []).map((f, idx) => `
                 <details class="card-collapsible">
                   <summary style="padding:10px 0;cursor:pointer;list-style:none;font-size:11px;font-weight:700;display:flex;justify-content:space-between;align-items:center;color:#0D2640">
                     <span style="flex:1">${escRich(f.q || '')}</span>
                     <span style="font-size:9px;color:#6B7280;flex-shrink:0">▼</span>
                   </summary>
                    <div class="card-content" style="padding:8px 0 12px 0;font-size:10px;color:#0D2640;line-height:1.5">${fmt(escRich(f.a || ''))}</div>
                 </details>
               `).join('')}
             </div>
           `;
         default:
            return `<div style="font-size:10px;color:#0D2640;line-height:1.5;padding:8px 0;border-bottom:1px solid #F3F4F6">${fmt(escRich(section.contenido || section.body || ''))}</div>`;
      }
    };

    return guideSections.map((section, i) => `
      <details class="guia-inner">
        <summary>
          <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;padding:8px 12px">
            <span style="width:16px;height:16px;border-radius:999px;background:${badgeColor(section)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;flex-shrink:0">${i + 1}</span>
            <span style="font-size:11px;font-weight:700;color:#0D2640;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(section.title || '')}</span>
          </div>
          <span style="font-size:10px;color:#6B7280;flex-shrink:0;padding:6px 8px">▼</span>
        </summary>
        <div class="guia-inner-content">
          ${renderSectionInner(section)}
        </div>
      </details>
    `).join('');
  };

  const guiaHTML = () => {
    if (!guideSections.length) return '';
    return `
      <details class="guia-outer">
        <summary style="background:#0066CC;border-radius:12px;padding:16px;cursor:pointer;list-style:none;color:#fff;display:flex;justify-content:space-between;align-items:center">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="display:flex;flex-direction:column">
              <span style="font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:.7">Contenido educativo</span>
              <span style="font-size:15px;font-weight:900">Guía DocFitness</span>
            </div>
          </div>
          <span style="font-size:9px;opacity:.6">Léelo ▼</span>
        </summary>
        <div class="guia-content">
          ${renderGuiaContent()}
        </div>
      </details>
    `;
  };

  const renderGlosarioContent = () => {
    if (!glossaryTerms.length) return '';

    const fmt = (str) => {
      if (!str) return '';
      return String(str).replace(/\n/g, '<br>');
    };

    const catColor = (cat) => {
      const map = {
        'Intensidad': '#059669',
        'Series': '#6B7280',
        'Notación': '#374151',
        'Nutrición': '#059669',
        'Composición corporal': '#6B7280',
        'Calentamiento': '#92400E',
        'Hábitos': '#92400E',
      };
      return map[cat] || '#0D2640';
    };

    const grouped = {};
    glossaryTerms.forEach(term => {
      const cat = term.cat || 'General';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(term);
    });

    const cats = ['Intensidad','Series','Notación','Calentamiento','Nutrición','Composición corporal','Hábitos'].filter(c => grouped[c]);

    return cats.map(cat => `
      <div style="margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:5px">
          <span style="width:6px;height:6px;border-radius:999px;background:${catColor(cat)}"></span>
          <span style="font-size:10px;font-weight:700;color:#0D2640">${esc(cat)}</span>
        </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${grouped[cat].map(term => `
           <details class="card-collapsible">
              <summary style="padding:10px 12px;cursor:pointer;list-style:none;font-size:13px;font-weight:800;display:flex;justify-content:space-between;align-items:center;color:#0D2640;border-radius:12px">
                <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:0;flex-wrap:wrap">
                  <span style="font-size:11px;font-weight:800;color:#0D2640;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:1;min-width:0">${esc(term.title || '')}</span>
                </div>
                <span style="font-size:9px;color:#6B7280;flex-shrink:0;padding:6px 8px">▼</span>
              </summary>
             <div class="card-content" style="font-size:10px;color:#0D2640;line-height:1.5">
               ${term.subtitle ? `<div style="font-size:10px;font-weight:600;color:#0066CC;margin-bottom:4px">${esc(term.subtitle)}</div>` : ''}
               <div style="margin-bottom:${term.example ? '6px' : '0'}">${fmt(escRich(term.body || ''))}</div>
               ${term.example ? `<div style="display:flex;align-items:flex-start;gap:3px"><span style="color:#0D2640;margin-top:1px">•</span> <span style="font-weight:700">Ej:</span> <span style="font-style:italic">${fmt(escRich(term.example))}</span></div>` : ''}
             </div>
           </details>
           `).join('')}
          </div>
      </div>
    `).join('');
  };

  const faqsHTML = () => {
    const guia = renderGuiaContent();
    const glosario = renderGlosarioContent();
    if (!guia && !glosario) return '';
    return `
      <details class="faqs-card">
        <summary style="padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px">
          <span style="display:flex;align-items:center;gap:6px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            FAQs
          </span>
          <span style="font-size:10px;color:#6B7280;font-weight:700">${guideSections.length + glossaryTerms.length} temas ▼</span>
        </summary>
        <div class="card-content">
          ${guia ? `
            <details class="guia-outer">
              <summary style="background:#0066CC;border-radius:12px;padding:16px;cursor:pointer;list-style:none;color:#fff;display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="display:flex;flex-direction:column">
                    <span style="font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:.7">Contenido educativo</span>
                    <span style="font-size:15px;font-weight:900">Guía DocFitness</span>
                  </div>
                </div>
                <span style="font-size:9px;opacity:.6">Léelo ▼</span>
              </summary>
              <div class="guia-content">
                ${guia}
              </div>
            </details>
          ` : ''}
          ${glosario ? `
            <details class="guia-outer" style="margin-top:10px">
              <summary style="background:#0D2640;border-radius:12px;padding:16px;cursor:pointer;list-style:none;color:#fff;display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="display:flex;flex-direction:column">
                    <span style="font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:.7">Diccionario</span>
                    <span style="font-size:15px;font-weight:900">Glosario DocFitness</span>
                  </div>
                </div>
                <span style="font-size:9px;opacity:.6">Léelo ▼</span>
              </summary>
              <div class="guia-content">
                ${glosario}
              </div>
            </details>
          ` : ''}
        </div>
      </details>
    `;
  };

  const heroHTML = () => {
    return `
    <div style="margin-top:12px;margin-bottom:16px">
      <div style="font-size:22px;font-weight:900;line-height:1.1;color:#0D2640">Hola, ${esc(firstName)}${lastName ? ' ' + esc(lastName) : ''}</div>
      ${edadSexo ? `<div style="font-size:13px;font-weight:600;color:#4B5563;margin-top:2px">${esc(edadSexo)}</div>` : ''}
      <div style="display:flex;justify-content:center;margin-top:12px">
        <div style="display:flex;gap:32px;align-items:center">
          ${consultaLabel ? `
            <div>
              <div style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6B7280;margin-bottom:4px">Consulta</div>
              <div style="font-size:13px;font-weight:700;color:#0D2640">${esc(consultaLabel)}</div>
            </div>
          ` : ''}
          ${consultaLabel && proxima ? `<div style="width:1px;background:#E5E7EB;height:32px"></div>` : ''}
          ${proxima ? `
            <div>
              <div style="font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6B7280;margin-bottom:4px">Próxima consulta</div>
              <div style="font-size:13px;font-weight:700;color:#0066CC">${esc(proxima)}</div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
    `;
  };


  const comidasHTML = () => {
    if (!dayMeals.length) return '<div style="text-align:center;padding:20px;opacity:.6;font-size:11px;color:#6B7280">Sin comidas cargadas</div>';

    const normalizedDayMeals = dayMeals.map(normalizeMeal);

    const grouped = {};
    normalizedDayMeals.forEach(meal => {
      const key = meal.time || meal.tiempo || 'Comida';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(meal);
    });

    return Object.entries(grouped).map(([time, meals]) => {
      const totalKcal = meals.reduce((sum, m) => sum + getMealTotalKcal(m), 0);
      const macrosTotal = meals.reduce((acc, m) => {
        const mt = getMealTotalMacros(m);
        acc.p += mt.p || 0;
        acc.c += mt.c || 0;
        acc.g += mt.g || 0;
        return acc;
      }, { p: 0, c: 0, g: 0 });
      const p = macrosTotal.p;
      const c = macrosTotal.c;
      const g = macrosTotal.g;

      const meal = meals[0];
      const normalizedMeal = normalizeMeal(meal);
      const menuTypeLabel = normalizedMeal.menuType === 'armar' ? 'ARMAR MENÚ' : normalizedMeal.menuType === 'fijo' ? 'MENÚ FIJO' : '';
      const menuTypeStyle = normalizedMeal.menuType === 'armar'
        ? 'background:#2E9E70;color:#fff'
        : 'background:#0D2640;color:#fff';

      const GROUP_ORDER = { 'proteinas': 0, 'carbohidratos': 1, 'grasas': 2 };



      const renderFoodListLocal = (foods) => {
        if (!foods.length) return '';
        const filtered = foods.filter(f => f.name && String(f.name).trim() !== '');
        if (!filtered.length) return '';
        const hasAnyMacros = filtered.some(f => f.macros);
        let sortedFoods = filtered;
        if (hasAnyMacros) {
          sortedFoods = [...filtered].sort((a, b) => {
            const oa = getFoodGroup(a) ? GROUP_ORDER[getFoodGroup(a).key] : 99;
            const ob = getFoodGroup(b) ? GROUP_ORDER[getFoodGroup(b).key] : 99;
            return oa - ob;
          });
        }
        return sortedFoods.map((f, i) => renderFoodItem(f, i === sortedFoods.length - 1, esc)).join('');
      };

      const renderMenuLocal = (menu, menuIdx, totalMenus) => {
        const menuName = menu.nombre || (totalMenus > 1 ? `Opción ${menuIdx + 1}` : '');
        const alimentos = (menu.alimentos || []).filter(a => a.name && String(a.name).trim() !== '');
        const hasAlimentos = alimentos.length > 0;
        const hasMenuName = menuName.length > 0;

        if (!hasAlimentos) return '';

        return `
          ${hasMenuName ? `<div style="font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#0D2640;margin-bottom:4px;margin-top:${menuIdx > 0 ? '10px' : '6px'};padding-top:${menuIdx > 0 ? '8px' : '0'}">${esc(menuName)}</div>` : ''}
          ${renderFoodListLocal(alimentos)}
        `;
      };

      const renderArmarLocal = () => renderArmarDetailed(normalizedMeal, meals, renderFoodListLocal, esc);

      const allMenus = meals.flatMap(m => (m.menus || [])).filter((menu) => (menu.alimentos || []).some(a => a.name && String(a.name).trim() !== ''));
      const hasMenus = allMenus.length > 0;
      const hasArmar = normalizedMeal.menuType === 'armar' && meals.flatMap(m => m.foods || []).some(f => f.name && String(f.name).trim() !== '');
      
      return `
        <details class="card-collapsible meal-details">
          <summary style="padding:11px 12px;cursor:pointer;list-style:none;color:#0D2640;display:flex;flex-direction:column;gap:2px">
            <div style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:6px">
              <div style="display:flex;align-items:center;gap:4px;flex:1;min-width:0">
                <span style="font-size:9px;font-weight:800;padding:3px 8px;border-radius:999px;background:#2E9E70;color:#fff;white-space:nowrap">${esc((normalizedMeal.hour || normalizedMeal.tiempo || '').toUpperCase())}</span>
                ${menuTypeLabel ? `<span style="font-size:9px;font-weight:800;padding:3px 8px;border-radius:999px;${menuTypeStyle};white-space:nowrap">${esc(menuTypeLabel)}</span>` : ''}
              </div>
              <span style="font-size:10px;color:#6B7280;white-space:nowrap;flex-shrink:0"><b>${totalKcal} kcal</b> • <span style="color:#0066CC;font-weight:700">${p}P</span> <span style="color:#2E9E70;font-weight:700">${c}C</span> <span style="color:#CC6600;font-weight:700">${g}G</span> ▼</span>
            </div>
            <span style="font-size:13px;font-weight:700;color:#0D2640">${esc(time)}</span>
          </summary>
          <div class="card-content">
            ${hasMenus ? allMenus.map((menu, idx) => renderMenuLocal(menu, idx, allMenus.length)).join('') : ''}
            ${hasArmar ? renderArmarLocal() : ''}
          </div>
        </details>
      `;
    }).join('');
  };
   
    const suplementosHTML = () => renderSupplementsHTML(daySupps, supplementDatabase, esc);

  const metricCard = (label, value, valueColor = COLORS.navy, unit = '', helper = '') => `
    <div class="metric-card">
      <span style="font-size:8px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.grayMedium};display:block;margin-bottom:4px">${esc(label)}</span>
      <span style="font-size:14px;font-weight:800;color:${valueColor}">${esc(value)}${unit ? ' ' + esc(unit) : ''}</span>
      ${helper ? `<div style="font-size:9px;color:${COLORS.grayMedium};margin-top:4px">${esc(helper)}</div>` : ''}
    </div>
  `;


  const infoClinicaHTML = () => {
    if (!clinico.retroalimentacion?.length && !clinico.diagnostico?.length && !clinico.objetivos?.length) return '';
    return `
      <details class="card-collapsible">
        <summary style="padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px">
          <span style="display:flex;align-items:center;gap:6px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Información clínica
          </span>
          <span style="font-size:10px;color:#6B7280;flex-shrink:0;padding:6px 8px">▼</span>
        </summary>
        <div class="card-content">
          ${clinico.retroalimentacion?.length ? `
            <div style="padding-bottom:10px;margin-bottom:10px">
              <div style="font-size:9px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#6B7280;margin-bottom:6px">RETROALIMENTACIÓN</div>
              ${clinico.retroalimentacion.map((item, i) => `
                <div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #F3F4F6">
                   <span style="width:16px;height:16px;border-radius:999px;background:#0066CC;color:#fff;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;flex-shrink:0">${i + 1}</span>
                   <span style="font-size:10px;color:#0D2640;line-height:1.4">${esc(item)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${clinico.diagnostico?.length ? `
            <div style="padding-bottom:10px;margin-bottom:10px">
              <div style="font-size:9px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#6B7280;margin-bottom:6px">DIAGNÓSTICO</div>
              ${clinico.diagnostico.map((item, i) => `
                 <div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #F3F4F6">
                   <span style="width:16px;height:16px;border-radius:999px;background:#0066CC;color:#fff;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;flex-shrink:0">${i + 1}</span>
                   <span style="font-size:10px;color:#0D2640;line-height:1.4">${esc(item)}</span>
                 </div>
               `).join('')}
             </div>
           ` : ''}
           ${clinico.objetivos?.length ? `
             <div style="padding-top:10px;margin-top:10px">
               <div style="font-size:9px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#6B7280;margin-bottom:6px">OBJETIVOS Y PLAN A SEGUIR</div>
               ${clinico.objetivos.map((item, i) => `
                 <div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #F3F4F6">
                   <span style="width:16px;height:16px;border-radius:999px;background:#0066CC;color:#fff;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;flex-shrink:0">${i + 1}</span>
                   <span style="font-size:10px;color:#0D2640;line-height:1.4">${esc(item)}</span>
                 </div>
               `).join('')}
             </div>
           ` : ''}
        </div>
      </details>
    `;
  };


  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plan DocFitness — ${esc(nombre)}</title>
<meta name="theme-color" content="#0D2640">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="description" content="Plan de entrenamiento y nutrición para ${esc(nombre)}">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none';">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{font-family:system-ui,-apple-system,sans-serif;background:#F8F9FC;color:#0D2640;line-height:1.45;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
img{max-width:100%;display:block}
a{color:#0D2640;text-decoration:none}
.wrap{max-width:560px;margin:0 auto;padding:0 14px 0;overflow:hidden}
.app-footer{font-size:9px;letter-spacing:0.8px;color:#6B7280;font-weight:700;text-align:center;margin-top:0;text-transform:uppercase}
.app-footer-sub{font-size:8px;letter-spacing:0.8px;color:#9CA3AF;font-weight:600;text-align:center;margin-top:0;text-transform:uppercase}

.hero{margin-bottom:16px}

.stats{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.stat{background:#fff;border-radius:14px;padding:10px;text-align:center;flex:1 1 calc(33.333% - 6px);min-width:0}
.stat span{font-size:9px;letter-spacing:1px;color:#6B7280;font-weight:700;display:block}
.stat b{font-size:14px;font-weight:800;margin-top:2px;display:block;color:#0D2640}

.training-card{background:#fff;border-radius:16px;padding:16px;color:#0D2640;margin-bottom:12px;max-width:100%}
.training-header{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.training-label{font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#6B7280}
.training-title{font-size:20px;font-weight:900;line-height:1.1;margin-top:4px;color:#0D2640}
.training-list{margin-top:12px}
.training-item{padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.04)}
.training-item:last-child{border-bottom:none}
.training-item-meta{font-size:10px;color:#6B7280;margin-top:2px}
.training-badge{font-size:9px;font-weight:800;padding:2px 8px;border-radius:999px;background:#0B63CE;color:#fff;white-space:nowrap;margin-left:8px}

.section-card{background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;max-width:100%}
.section-title{font-size:11px;font-weight:800;letter-spacing:1px;color:#0D2640;margin-bottom:10px;text-transform:uppercase}

.metric-card{background:#fff;border-radius:16px;padding:16px;text-align:center;min-width:70px;flex:1 1 calc(25% - 6px);max-width:100%}
.metric-card--small{background:#fff;border-radius:16px;padding:12px;text-align:center;flex:1 1 calc(50% - 4px);min-width:0;position:relative;max-width:100%}
.metric-card--hero{background:#fff;border-radius:18px;padding:20px 16px 16px 16px;color:#fff;margin-bottom:12px;position:relative;max-width:100%}

.strategy-card{padding:16px;border-radius:16px;text-align:center;margin-bottom:10px}
.strategy-card--navy{background:#0D2640;color:#fff}
.strategy-card--green{background:#2E9E70;color:#fff}

.measure-delta{position:absolute;top:10px;right:8px;font-size:8px;font-weight:800;padding:1px 6px;border-radius:9999px}

.note-badge{font-size:8px;font-weight:700;padding:2px 8px;border-radius:999px;display:inline-block;margin-bottom:8px}
.note-badge--success{background:#DCFCE7;color:#166534;border:1px solid #86EFAC}
.tag-pill{font-size:10px;color:#0066CC;background:#F3F4F6;border-radius:999px;padding:3px 10px;display:inline-block}

.supp-pill{font-size:9px;font-weight:800;padding:4px 10px;border-radius:999px;background:#2E9E70;color:#fff;white-space:nowrap}

.dia-section{margin-bottom:24px}

/* Cards colapsables estándar */
.card-collapsible{border-radius:12px;margin:0 0 10px 0;background:#fff;overflow:visible}
.card-collapsible summary{padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px}
.card-collapsible summary::-webkit-details-marker{display:none}
.card-collapsible[open] summary{background:#fafafa;border-radius:12px 12px 0 0}
.card-collapsible .card-content{padding:10px 12px 12px 12px}

/* Variante azul para Guía/FAQs */
.faqs-card summary{background:#0066CC;color:#fff;border-radius:12px}
.faqs-card[open] summary{background:#0066CC;border-radius:12px 12px 0 0}
.faqs-card .card-content{padding:12px}

/* Variante sin fondo en contenedor (como FAQs) */
.no-bg-collapsible{background:transparent;border-radius:12px;margin:0 0 10px 0;overflow:visible}
.no-bg-collapsible .card-content{padding:10px 12px 12px 12px}

/* Meal details override */
.meal-details summary{flex-direction:column;gap:2px;align-items:stretch}
.meal-details .card-content{padding:10px 12px 12px 12px}

details:not(.guia-outer):not(.faqs-card):not(.day-details):not(.week-details):not(.meal-details):not(.no-bg-collapsible){border-radius:12px;margin:0 0 10px 0;background:#fff;overflow:visible}
details:not(.guia-outer):not(.faqs-card):not(.day-details):not(.week-details):not(.meal-details):not(.no-bg-collapsible) summary{padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px}
details:not(.guia-outer):not(.faqs-card):not(.day-details):not(.week-details):not(.meal-details):not(.no-bg-collapsible) summary::-webkit-details-marker{display:none}
details:not(.guia-outer):not(.faqs-card):not(.day-details):not(.week-details):not(.meal-details):not(.no-bg-collapsible)[open] summary{background:#fafafa;border-radius:12px 12px 0 0}
details:not(.guia-outer):not(.faqs-card):not(.day-details):not(.week-details):not(.meal-details):not(.no-bg-collapsible) .content{padding:10px 12px 12px 12px}
.day-details[open] summary{background:#0D2640;color:#fff;border-radius:12px 12px 0 0;border-bottom:1px solid #F3F4F6}
.week-details summary{border-radius:12px 12px 12px 12px}
.week-details[open] summary{background:#fafafa;border-radius:12px 12px 0 0;border-bottom:1px solid #F3F4F6}
.week-details .day-details{margin-bottom:8px}
.week-details .day-details:last-child{margin-bottom:0}

/* Collapsible sections */
.collapsible{border-radius:16px;background:#fff;margin-bottom:12px;width:100%;box-sizing:border-box}
.collapsible summary{padding:12px 16px;cursor:pointer;list-style:none;font-size:12px;font-weight:800;letter-spacing:1px;color:#0D2640;display:flex;justify-content:space-between;align-items:center;text-transform:uppercase}
.collapsible summary::-webkit-details-marker{display:none}
.collapsible[open] summary{border-bottom:1px solid #E8E8E8}
.collapsible .collapsed-content{padding:0 16px 16px}

.day-nav select{width:100%;padding:10px 12px;border-radius:12px;border:1px solid #E8E8E8;background:#fff;font-size:12px;font-weight:700;color:#0D2640}

/* Guía */
.guia-outer{border-radius:12px;background:#fff;margin-bottom:12px}
.guia-outer > summary{padding:16px;cursor:pointer;list-style:none;color:#fff;background:#0066CC;border-radius:12px;display:flex;justify-content:space-between;align-items:center}
.guia-outer[open] > summary{border-bottom:1px solid #E8E8E8;background:#0066CC;border-radius:12px 12px 0 0}
.guia-outer > .guia-content{padding:12px}
.guia-inner{border-radius:12px;background:#fff;margin-bottom:8px;overflow:hidden}
.guia-inner > summary{padding:0;cursor:pointer;list-style:none;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:space-between;color:#0D2640;background:#fff;border-radius:12px}
.guia-inner[open] > summary{background:#F8F9FC;border-radius:12px 12px 0 0}
.guia-inner .guia-inner-content{padding:16px;font-size:12px;color:#4B5563;line-height:1.6}

/* Warmup cards */
.warmup-group{margin-bottom:12px}
.warmup-group:last-child{margin-bottom:0}
.warmup-group summary{padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px}
.warmup-group summary::-webkit-details-marker{display:none}
.warmup-group[open] summary{background:#fafafa;border-radius:12px 12px 0 0}
.warmup-group .card-content{padding:10px 12px 12px 12px}
.warmup-fase-title{font-size:11px;font-weight:800;color:#0D2640;margin-top:10px;margin-bottom:6px}
.warmup-fase-title:first-child{margin-top:0}
.warmup-bloque{margin-bottom:8px;padding-top:6px}
.warmup-bloque-header{display:flex;align-items:center;gap:4px;margin-bottom:4px;opacity:.7}
.warmup-bloque-letter{width:14px;height:14px;border-radius:999px;background:#0D2640;color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;flex-shrink:0}
.warmup-bloque-type{font-size:8px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0D2640}
.warmup-ejercicio{display:flex;align-items:flex-start;gap:6px;padding:4px 0;border-bottom:1px solid #F3F4F6}
.warmup-ejercicio:last-child{border-bottom:none}
.warmup-ejercicio-code{width:16px;height:16px;border-radius:999px;background:#0D2640;color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:800;flex-shrink:0}
.warmup-ejercicio-info{flex:1;min-width:0}
.warmup-ejercicio-name{font-size:10px;font-weight:700;color:#0D2640;line-height:1.3}
.warmup-ejercicio-presc{font-size:9px;color:#6B7280;margin-top:1px}
.warmup-ejercicio-detail{font-size:9px;color:#6B7280;margin-top:1px}
.warmup-stats{display:flex;gap:8px;align-items:center;padding:0 0 8px 0}
.warmup-stat-badge{font-size:9px;font-weight:700;color:#6B7280;background:#F3F4F6;padding:3px 8px;border-radius:999px}
.warmup-fase-pill{display:inline-flex;align-items:center;font-size:9px;font-weight:700;padding:4px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:0.05em}
.warmup-fase-pill--general{color:#0D2640;background:rgba(13,38,64,0.08)}
.warmup-fase-pill--movilidad{color:#2E9E70;background:rgba(46,158,112,0.1)}
.warmup-fase-pill--especifico{color:#0066CC;background:rgba(0,102,204,0.1)}
</style>
</head>
<body>
<header style="background:#0066CC;padding:12px 16px;display:flex;justify-content:center;align-items:center">
  <div style="height:28px;width:auto;display:block;filter:brightness(0) invert(1)">${logoHTML}</div>
</header>

<div class="wrap">
  <!-- HERO -->
   ${heroHTML()}

    <!-- AVANCES -->
    <div style="margin-top:4px;margin-bottom:8px;font-size:11px;font-weight:800;letter-spacing:1px;color:#0D2640;text-transform:uppercase;display:flex;align-items:center;gap:6px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
      Avances
    </div>
    ${avancesCard()}

     <!-- INFORMACIÓN CLÍNICA -->
     ${infoClinicaHTML()}

      ${hasTratamientoDeportivo ? `
      <!-- TRATAMIENTO DEPORTIVO -->
      <div style="margin-top:4px;margin-bottom:8px;font-size:11px;font-weight:800;letter-spacing:1px;color:#0D2640;text-transform:uppercase;display:flex;align-items:center;gap:6px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5v14"></path><path d="M18 5v14"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M6 12h4"></path><path d="M14 12h4"></path></svg>
        Tratamiento deportivo
      </div>
      ${renderTratamientoDeportivo({ tEntre, dias: diasEntrenamiento, cardio: cardioValue, volumen: volumenEntrenamiento, COLORS, esc, metricCard })}
      ` : ''}

       ${hasCalentamiento ? `
       <!-- CALENTAMIENTO (card principal con sub-cards) -->
       <details class="no-bg-collapsible">
         <summary style="padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px">
           <span style="display:flex;align-items:center;gap:6px">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
             Calentamiento
           </span>
           <span style="font-size:10px;color:#6B7280;font-weight:700">${upper ? 'Tren Superior' : ''}${upper && lower ? ' · ' : ''}${lower ? 'Tren Inferior' : ''} ▼</span>
         </summary>
         <div class="card-content">
           ${calentamientoHTML()}
         </div>
       </details>
       ` : ''}

         ${hasEntrenamiento ? `
         <!-- ENTRENAMIENTO SEMANAL -->
         <details class="no-bg-collapsible">
           <summary style="padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px">
             <span style="display:flex;align-items:center;gap:6px">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="1" x2="8" y2="4"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
               Entrenamiento semanal
             </span>
             <span style="font-size:10px;color:#6B7280;font-weight:700">${(calendar || []).length} días ▼</span>
           </summary>
           <div class="card-content">
             ${renderCalendario({ calendar, routines, esc })}
           </div>
         </details>
         ` : ''}

      ${hasTratamientoNutricional ? `
      <!-- TRATAMIENTO NUTRICIONAL -->
      <div style="margin-top:4px;margin-bottom:8px;font-size:11px;font-weight:800;letter-spacing:1px;color:#0D2640;text-transform:uppercase;display:flex;align-items:center;gap:6px">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
        Tratamiento nutricional
      </div>
      ${renderInfoNutricional({ tNutri, meals, getMealTotalKcal, getMealTotalMacros, COLORS, esc, metricCard })}

      <!-- COMIDAS -->
      <details class="no-bg-collapsible">
        <summary style="padding:11px 12px;font-weight:700;font-size:13px;cursor:pointer;list-style:none;color:#0D2640;background:#fff;display:flex;align-items:center;justify-content:space-between;border-radius:12px">
          <span style="display:flex;align-items:center;gap:6px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
            Comidas
          </span>
          <span style="font-size:10px;color:#6B7280;font-weight:700">${dayMeals.length} comidas ▼</span>
        </summary>
        <div class="card-content">
          ${comidasHTML()}
        </div>
      </details>
      ` : ''}

       ${hasSuplementos ? `
       <!-- SUPLEMENTOS -->
       <div style="margin-top:4px;margin-bottom:8px;font-size:11px;font-weight:800;letter-spacing:1px;color:#0D2640;text-transform:uppercase;display:flex;align-items:center;gap:6px">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5L3.5 13.5C2.5 12.5 2.5 10.5 3.5 9.5L9.5 3.5C10.5 2.5 12.5 2.5 13.5 3.5L20.5 10.5C21.5 11.5 21.5 13.5 20.5 14.5L14.5 20.5C13.5 11.5 10.5 20.5Z"></path><path d="M8.5 12.5L15.5 5.5"></path></svg>
         Tratamiento de suplementación
       </div>
        ${supplementsStrategy ? `
         <div class="strategy-card strategy-card--navy">
           <span style="font-size:8px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.7);display:block;margin-bottom:4px">ESTRATEGIA</span>
           <span style="font-size:14px;font-weight:800;color:#fff">${esc(supplementsStrategy)}</span>
         </div>
        ` : ''}
        ${suplementosHTML()}
        ` : ''}

        <!-- GUÍA / FAQS -->
        <div style="margin-top:24px;margin-bottom:8px;font-size:11px;font-weight:800;letter-spacing:1px;color:#0D2640;text-transform:uppercase;display:flex;align-items:center;gap:6px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          FAQs
        </div>
        ${faqsHTML()}

  <div style="text-align:center;margin-top:16px">
    <div style="font-size:9px;font-weight:800;letter-spacing:1px;color:#6B7280;text-transform:uppercase;margin-bottom:4px">DOCFITNESS ${new Date().getFullYear()}</div>
    <div style="font-size:10px;color:#9CA3AF;line-height:1.6;letter-spacing:1.2px">Estética corporal · Medicina · Nutrición · Entrenamiento</div>
  </div>
  </div>
</body>
</html>`;
};

export const downloadDashboardFitness = (data, fileName, mode = 'todo') => {
  try {
    const html = generateDashboardFitnessHTML(data, mode);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (fileName || data.person?.id || 'Paciente').replace(/[^a-zA-Z0-9-_]/g, '').trim() || 'Paciente';
    a.href = url;
    a.download = `Plan-${safeName}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return true;
  } catch (err) {
    const win = window.open('', '_blank');
    if (!win) return false;
    win.document.write(generateDashboardFitnessHTML(data, mode));
    win.document.close();
    return true;
  }
};
