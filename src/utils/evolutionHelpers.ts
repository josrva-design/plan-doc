export const isConsultaVencida = (fechaConsulta: string): boolean => {
  const raw = fechaConsulta;
  if (!raw) return false;
  const parts = String(raw).split('/');
  let y: number, m: number, d: number;
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const dd = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10) - 1;
      const yy = parseInt(parts[2], 10);
      y = yy; m = mm; d = dd;
    } else {
      const dd = parseInt(parts[0], 10);
      const mm = parseInt(parts[1], 10) - 1;
      const yy = parseInt(parts[2], 10);
      y = yy >= 0 && yy <= 99 ? 2000 + yy : yy;
      m = mm; d = dd;
    }
  } else {
    const isoParts = String(raw).split('-');
    if (isoParts.length !== 3) return false;
    y = parseInt(isoParts[0], 10);
    m = parseInt(isoParts[1], 10) - 1;
    d = parseInt(isoParts[2], 10);
  }
  const next = new Date(y, m, d);
  next.setMonth(next.getMonth() + 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return next < today;
};
