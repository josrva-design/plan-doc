import React, { useState, useEffect } from 'react';
import { downloadDashboardFitness, generateDashboardFitnessHTML } from '../services/ExportPlan.ts';
import { exportToExcel } from '../services/ExportExcel.ts';
import { useAppContext } from '../context/AppContext.tsx';
import usePatientData from '../hooks/usePatientData.tsx';
import { runAllSafetyChecks } from '../utils/safetyRules.ts';
import { generatePatientId } from '../utils/patientFiles.ts';
import { validatePlan, type ValidationWarning } from '../utils/planValidator.ts';

import { HardDrive, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function ExportSection() {
  const { data, setters, showToast, createManualBackup, restoreBackup, listBackups, devMode, setActiveTab } = useAppContext();
  const patientData = usePatientData(data);
  const person = data.person || {};
  const fechaConsulta = data.fechaConsulta || '';
  const patientId = person.id || '';
  const showBackupSection = devMode || Boolean(person.nombre);

  const [backups, setBackups] = useState([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [showCheckup, setShowCheckup] = useState(false);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);

  const loadBackups = async () => {
    setLoadingBackups(true);
    try {
      const list = await listBackups();
      setBackups(list);
    } catch {
      showToast('Error al cargar backups');
    }
    setLoadingBackups(false);
  };

  const handleCreateBackup = async () => {
    await createManualBackup();
    loadBackups();
  };

  const handleRestoreBackup = async (id: string) => {
    if (window.confirm('¿Restaurar este backup? Se reemplazará el estado actual.')) {
      await restoreBackup(id);
      loadBackups();
    }
  };

  const runCheckup = () => {
    const results = validatePlan(data);
    setWarnings(results);
    setShowCheckup(true);
    if (results.length === 0) {
      showToast('✨ El plan está completo y listo para exportar');
    } else {
      showToast(`Se encontraron ${results.length} puntos a revisar`);
    }
  };

  const goToSection = (section: string) => {
    setActiveTab(section);
    setShowCheckup(false);
  };

  const computedId = patientId || generatePatientId(person.nombre || '', person.fechaNacimiento || '');

  const [fileName, setFileName] = useState(() => {
    const idPart = computedId ? computedId.replace(/[^a-zA-Z0-9-_]/g, '') : '';
    return idPart || 'paciente';
  });

  useEffect(() => {
    const idPart = computedId ? computedId.replace(/[^a-zA-Z0-9-_]/g, '') : '';
    if (idPart) {
      setFileName(idPart);
    }
  }, [computedId]);

  const handleWhatsApp = () => {
    const safety = runAllSafetyChecks(data);
    if (safety.hasBlockers) {
      showToast(`⚠️ ${safety.summary.critical + safety.summary.high} alertas detectadas. Revisá el perfil antes de exportar.`);
      return;
    }
    const ok = downloadDashboardFitness(patientData, fileName);
    showToast(ok ? 'Archivo HTML generado' : 'Error al generar archivo');
  };

  const handleExcel = () => {
    exportToExcel(data, fileName);
    showToast('Archivo Excel generado');
  };

  const handlePreview = () => {
    const html = generateDashboardFitnessHTML(patientData);
    const win = window.open('', '_blank');
    if (!win) {
      showToast('No se pudo abrir la vista previa');
      return;
    }
    win.document.write(html);
    win.document.close();
  };

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const safety = runAllSafetyChecks(data);

  const criticalAlerts = safety.alerts.filter(a => a.level === 'critical' || a.level === 'high');

  return (
      <div className="w-full bg-transparent text-[var(--color-navy)] p-3 md:p-4 font-[Inter]">
      <div className="mb-6">
          <div className="premium-page-title">
            <span className="mr-2 inline-flex items-center justify-center text-[var(--color-primary)]"><HardDrive size={24} /></span>
            Datos
          </div>
         <p className="premium-subtitle">Configurá los datos del plan y generá archivos para exportar.</p>
       </div>

       <div className="space-y-6">
         <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-2xl p-6">
           <h3 className="typo-value-lg text-[var(--color-navy)] mb-4">Archivo</h3>
           <div className="space-y-4">
             <div>
               <label className="typo-label block mb-2">Fecha de consulta</label>
               <input
                 type="date"
                 value={fechaConsulta}
                 onChange={(e) => setters.setFechaConsulta(e.target.value)}
                 className="w-full bg-transparent outline-none typo-input border-b border-transparent focus:border-[var(--color-primary)]"
               />
             </div>
             <div>
               <label className="typo-label block mb-2">Nombre del archivo</label>
               <input
                 type="text"
                 value={fileName}
                 onChange={(e) => setFileName(e.target.value)}
                 placeholder="paciente"
                 className="w-full bg-transparent outline-none typo-input border-b border-transparent focus:border-[var(--color-primary)] input-placeholder"
               />
               <p className="typo-muted-sm mt-1">
                 Generado automáticamente desde el ID del paciente.
               </p>
             </div>
           </div>
         </div>

         {showBackupSection && (
           <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-2xl p-6">
             <h3 className="typo-value-lg text-[var(--color-navy)] mb-4">Backup automático</h3>
             <p className="typo-muted-sm mb-4">Se guarda automáticamente cada 5 minutos en el navegador.</p>
             <div className="flex flex-wrap gap-3 mb-4">
               <button onClick={handleCreateBackup} className="premium-btn-pill premium-btn-pill--primary">
                 Crear backup ahora
               </button>
               <button onClick={loadBackups} className="premium-btn-pill premium-btn-pill--ghost" disabled={loadingBackups}>
                 {loadingBackups ? 'Cargando...' : 'Ver backups'}
               </button>
             </div>
             {backups.length > 0 && (
               <div className="max-h-60 overflow-y-auto border border-[var(--color-border)] rounded-xl">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-[var(--color-bg-base)]">
                     <tr>
                       <th className="px-3 py-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Fecha</th>
                       <th className="px-3 py-2 text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider text-right">Acciones</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[var(--color-border)]">
                     {backups.slice(0, 10).map((backup) => (
                       <tr key={backup.id}>
                         <td className="px-3 py-2 text-[var(--color-text-primary)]">
                           {new Date(backup.fecha).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </td>
                         <td className="px-3 py-2 text-right">
                           <button onClick={() => handleRestoreBackup(backup.id)} className="text-xs text-[var(--color-primary)] font-semibold hover:underline">
                             Restaurar
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
           </div>
         )}

         <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-2xl p-6">
           <h3 className="typo-value-lg text-[var(--color-navy)] mb-4">Exportar Excel</h3>
           <p className="typo-muted-sm mb-4">Genera un archivo .xlsx con todas las secciones del plan en tablas planas, ideal para backup interno y análisis.</p>
           <div className="flex flex-wrap gap-3">
             <button onClick={handleExcel} className="premium-btn-pill premium-btn-pill--primary">
               Generar Excel
             </button>
           </div>
         </div>

         <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-2xl p-6 relative">
           <h3 className="typo-value-lg text-[var(--color-navy)] mb-4">Exportar HTML</h3>
           <div className="space-y-4">
             {criticalAlerts.length > 0 && (
               <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                 <p className="typo-label text-red-800 mb-2">Alertas de seguridad ({criticalAlerts.length})</p>
                 <ul className="space-y-1">
                   {criticalAlerts.map((alert, i) => (
                     <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                       <span className="mt-0.5">•</span>
                       <span>{alert.message}</span>
                     </li>
                   ))}
                 </ul>
                 <p className="typo-muted-sm mt-3">Resolvé estas alertas en el perfil antes de exportar.</p>
               </div>
             )}
             <label className="flex items-start gap-3 cursor-pointer">
               <input
                 type="checkbox"
                 checked={disclaimerAccepted}
                 onChange={e => setDisclaimerAccepted(e.target.checked)}
                 className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
               />
               <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                 Confirmo que este plan fue revisado por un profesional de la salud y que el paciente fue informado de que este documento no reemplaza el consejo médico, nutricional o de entrenamiento profesional. El paciente ha sido orientado a consultar a su médico antes de iniciar cualquier cambio en su dieta o rutina de ejercicios.
               </span>
             </label>
             <div className="flex flex-wrap gap-3">
               <button
                 onClick={runCheckup}
                 className="premium-btn-pill premium-btn-pill--ghost flex items-center gap-2"
               >
                 <AlertCircle size={16} />
                 Revisar Plan
               </button>
               <button onClick={handlePreview} className="premium-btn-pill premium-btn-pill--ghost">
                 Vista previa
               </button>
               <button
                 onClick={handleWhatsApp}
                 disabled={!disclaimerAccepted}
                 className="premium-btn-pill premium-btn-pill--primary disabled:opacity-30 btn-whatsapp"
               >
                 Generar archivo para WhatsApp
               </button>
             </div>
             <p className="typo-muted-sm">Genera un archivo HTML offline mobile-ready para enviar por WhatsApp. Las secciones vacías se omiten automáticamente.</p>
           </div>

           {showCheckup && (
             <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="typo-value-md text-[var(--color-navy)] flex items-center gap-2">
                   <AlertCircle size={20} className="text-[var(--color-primary)]" />
                   Revisión del Plan
                 </h4>
                 <button onClick={() => setShowCheckup(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                   <X size={20} />
                 </button>
               </div>

               <div className="flex-1 overflow-y-auto space-y-3 mb-6">
                 {warnings.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-8 text-center">
                     <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                       <CheckCircle2 size={24} />
                     </div>
                     <p className="font-bold text-[var(--color-navy)]">¡Todo perfecto!</p>
                     <p className="typo-muted-sm">No se encontraron errores ni omisiones.</p>
                   </div>
                 ) : (
                   <div className="space-y-2">
                     {warnings.map((w) => (
                       <div 
                         key={w.id} 
                         onClick={() => goToSection(w.section)}
                         className="flex items-center justify-between p-3 bg-white border border-[var(--color-border)] rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-all group"
                       >
                         <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${w.severity === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
                           <span className="text-xs text-[var(--color-text-primary)] font-medium">{w.message}</span>
                         </div>
                         <ChevronRight size={14} className="text-gray-400 group-hover:text-[var(--color-primary)] transition-colors" />
                       </div>
                     ))}
                   </div>
                 )}
               </div>

               <button 
                 onClick={() => setShowCheckup(false)} 
                 className="w-full py-2 bg-[var(--color-navy)] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3a5c] transition-colors"
               >
                 Volver al editor
               </button>
             </div>
           )}
         </div>
       </div>
     </div>
   );
}
