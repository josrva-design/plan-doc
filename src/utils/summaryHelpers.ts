export function toInputDate(raw: string | undefined | null): string {
  if (!raw) return '';
  const trimmed = String(raw).trim();
  if (!trimmed) return '';
  
  const hasSlash = trimmed.includes('/');
  const parts = hasSlash ? trimmed.split('/') : trimmed.split('-');
  if (parts.length !== 3) return '';
  
  const dd = parts[0].padStart(2, '0').slice(0, 2);
  const mm = parts[1].padStart(2, '0').slice(0, 2);
  let yy = parts[2].trim();
  if (yy.length === 2) yy = `20${yy}`;
  if (yy.length !== 4) return '';
  
  const yyyy = Number(yy);
  const month = Number(mm);
  const day = Number(dd);
  if (yyyy < 1900 || month < 1 || month > 12 || day < 1 || day > 31) return '';
  
  return `${yy}-${mm}-${dd}`;
}

export function fromInputDate(raw: string | undefined | null): string {
  if (!raw) return '';
  const parts = raw.split('-');
  if (parts.length === 3) {
    const dd = parts[2].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    const yy = parts[0].slice(-4);
    return `${dd}/${mm}/${yy}`;
  }
  return raw;
}

export function getProximaConsulta(fechaConsulta: string | undefined | null): string | null {
  const date = toInputDate(fechaConsulta);
  if (!date) return null;
  const next = new Date(date + 'T00:00:00');
  next.setDate(next.getDate() + 30);
  
  const dd = String(next.getDate()).padStart(2, '0');
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const yyyy = next.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function getFechaActual(fechaConsulta: string | undefined | null): string {
  const date = toInputDate(fechaConsulta);
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function calcularEdad(fechaNacimiento: string, fechaConsulta: string): string {
  if (!fechaNacimiento || !fechaConsulta) return '—';

  const fnParts = fechaNacimiento.split('/');
  if (fnParts.length !== 3) return '—';
  const fnDay = parseInt(fnParts[0], 10);
  const fnMonth = parseInt(fnParts[1], 10) - 1;
  const fnYear = parseInt(fnParts[2], 10);
  if (isNaN(fnDay) || isNaN(fnMonth) || isNaN(fnYear)) return '—';

  const fcParts = fechaConsulta.split('-');
  if (fcParts.length !== 3) return '—';
  const fcYear = parseInt(fcParts[0], 10);
  const fcMonth = parseInt(fcParts[1], 10) - 1;
  const fcDay = parseInt(fcParts[2], 10);
  if (isNaN(fcYear) || isNaN(fcMonth) || isNaN(fcDay)) return '—';

  const birthDate = new Date(fnYear, fnMonth, fnDay);
  const consultaDate = new Date(fcYear, fcMonth, fcDay);

  let edad = consultaDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = consultaDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && consultaDate.getDate() < birthDate.getDate())) {
    edad--;
  }

  return String(edad);
}
