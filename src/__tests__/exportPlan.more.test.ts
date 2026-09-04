import { describe, it, expect } from 'vitest';
import { generateDashboardFitnessHTML } from '../services/ExportPlan';

describe('ExportPlan content checks', () => {
  it('no incluye HÁBITOS dentro de Información clínica (sección eliminada)', () => {
    const plan = { person: { nombre: 'Ana' }, habits: { 'Dormir': '8h' }, meals: [], routines: [], warmup: [], calendar: [], supplements: [], stats: {}, clinico: { objetivos: ['Plan'] } };
    const html = generateDashboardFitnessHTML(plan as any);
    // debug: save to temp file for inspection
    const fs = require('fs');
    try { fs.writeFileSync('/tmp/docfitness_export_debug.html', html); } catch (e) { /* ignore */ }
    expect(html).not.toContain('HÁBITOS');
    expect(html).not.toContain('Dormir');
  });

  it('no incluye la etiqueta SUPLEMENTACIÓN RECOMENDADA dentro de Información clínica (sección eliminada)', () => {
    const plan = { person: { nombre: 'Ana' }, supplementsStrategy: 'Creatina 3g', meals: [], routines: [], warmup: [], calendar: [], supplements: [], stats: {}, clinico: { objetivos: ['Plan'] } };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('SUPLEMENTACIÓN RECOMENDADA');
    // supplementsStrategy es un campo informativo; la sección principal de Suplementación muestra elementos de supplements[].
  });

  it('escapes HTML in names', () => {
    const plan = { person: { nombre: '<script>alert(1)</script>' }, meals: [], routines: [], warmup: [], calendar: [], supplements: [], stats: {} };
    const html = generateDashboardFitnessHTML(plan as any);
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
