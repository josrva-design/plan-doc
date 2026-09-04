export const LOWER_KEYWORDS = ['pierna', 'core', 'inferior', 'leg', 'lower'];
export const UPPER_KEYWORDS = ['pecho', 'espalda', 'hombro', 'trapecio', 'tríceps', 'triceps', 'superior', 'push', 'pull', 'upper'];

export const getDayType = (actividad) => {
  const act = String(actividad || '').toLowerCase();
  if (!act || act === 'descanso') return 'rest';
  if (LOWER_KEYWORDS.some((k) => act.includes(k))) return 'lower';
  if (UPPER_KEYWORDS.some((k) => act.includes(k))) return 'upper';
  return 'full';
};
