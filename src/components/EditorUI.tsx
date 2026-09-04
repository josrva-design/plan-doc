import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ProfileSection from './ProfileSection.tsx';
import SummarySection from './SummarySection.tsx';
import TrainingEditor from './TrainingEditor.tsx';
import NutritionSection from './NutritionSection.tsx';
import EvolutionSection from './EvolutionSection.tsx';
import SupplementSection from './SupplementSection.tsx';
import ExportSection from './ExportSection.tsx';
import VistaPaciente from '../pages/VistaPaciente.tsx';
import DocLogo from './DocLogo.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import { useSecretDevMode } from '../hooks/useSecretDevMode.ts';
import PatientModal from './PatientModal.tsx';
import CloseConfirmModal from './CloseConfirmModal.tsx';
import { createAutoUpdater, type UpdaterState, type UpdateInfo } from '../services/autoUpdater.ts';

import devLogo from '../assets/dev-logo.svg';

import { LayoutDashboard, User, TrendingUp, Apple, Dumbbell, Pill, Settings, Eye, UserPlus, FolderOpen } from 'lucide-react';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: '1' },
  { key: 'perfil', label: 'Perfil', icon: User, group: '2' },
  { key: 'evolucion', label: 'Evolución', icon: TrendingUp, group: '2' },
  { key: 'nutricion', label: 'Nutrición', icon: Apple, group: '3' },
  { key: 'entrenamiento', label: 'Entrenamiento', icon: Dumbbell, group: '3' },
  { key: 'suplementos', label: 'Suplementos', icon: Pill, group: '3' },
  { key: 'configuracion', label: 'Configuración', icon: Settings, group: '4' },
  { key: 'vista_paciente', label: 'Vista paciente', icon: Eye, group: '4' },
];

export default function EditorUI({ onLogout }: { onLogout?: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [updaterOpen, setUpdaterOpen] = useState(false);
  const [updaterState, setUpdaterState] = useState<UpdaterState>({
    status: 'idle',
    update: null,
    progress: null,
    error: null,
  });
  const [pendingUpdate, setPendingUpdate] = useState<Update | null>(null);
  const { data, setters, devMode, toggleDevMode, isDev, showToast, activeTab, setActiveTab, savePatientJSON, loadPatientJSON } = useAppContext();
  const logoRef = useRef<HTMLButtonElement>(null);
  const previousDataRef = useRef(data);

  const secretDevModeOptions = useMemo(() => ({
    clickTarget: logoRef,
    clickCount: 5,
    clickWindowMs: 500,
    keyCombo: { ctrl: true, alt: true, shift: true, key: 'd' },
  }), []);

  useSecretDevMode(toggleDevMode, undefined, secretDevModeOptions);

  const person = data?.person || {};
  const isEmptyPatient = !person.nombre && !person.pesoIni && !person.estatura;

  useEffect(() => {
    if (devMode) {
      setPatientModalOpen(false);
    }
  }, [devMode]);

  useEffect(() => {
    if (person.nombre && isEmptyPatient && activeTab !== 'perfil') {
      setActiveTab('perfil');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person.nombre, isEmptyPatient, setActiveTab]);

  const handleSaveAndClose = useCallback(() => {
    setCloseModalOpen(false);
    showToast('Cambios guardados');
  }, [showToast]);

  const handleDiscardAndClose = useCallback(() => {
    setCloseModalOpen(false);
  }, []);

  // Fallback para navegador: confirmación nativa al cerrar la pestaña
  useEffect(() => {
    if (devMode) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (JSON.stringify(previousDataRef.current) !== JSON.stringify(data)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [devMode, data]);

  // Tauri: interceptar cierre de ventana
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).__TAURI__) return;
    const win = (window as any).__TAURI__.window.getCurrentWindow();
    win.listen('tauri://close-requested', () => {
      setCloseModalOpen(true);
    });
  }, []);

  // Auto-updater
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).__TAURI__) return;
    const updater = createAutoUpdater();
    updater.onChange(setUpdaterState);
    updater.check().then((update) => {
      if (update) {
        setPendingUpdate(update);
        setUpdaterOpen(true);
      }
    });
    return () => updater.stop();
  }, []);

  const renderContent = () => {
    if (devMode) {
      return (
        <>
          {activeTab === 'dashboard' && <SummarySection />}
          {activeTab === 'perfil' && <ProfileSection />}
          {activeTab === 'evolucion' && <EvolutionSection />}
          {activeTab === 'nutricion' && <NutritionSection />}
          {activeTab === 'entrenamiento' && <TrainingEditor />}
          {activeTab === 'suplementos' && <SupplementSection />}
          {activeTab === 'configuracion' && <ExportSection />}
          {activeTab === 'vista_paciente' && <VistaPaciente />}
        </>
      );
    }

    const effectiveTab = (!person.nombre) ? 'dashboard' : activeTab;

    return (
      <>
        {effectiveTab === 'dashboard' && <SummarySection />}
        {effectiveTab === 'perfil' && <ProfileSection />}
        {effectiveTab === 'evolucion' && <EvolutionSection />}
        {effectiveTab === 'nutricion' && <NutritionSection />}
        {effectiveTab === 'entrenamiento' && <TrainingEditor />}
        {effectiveTab === 'suplementos' && <SupplementSection />}
        {effectiveTab === 'configuracion' && <ExportSection />}
        {effectiveTab === 'vista_paciente' && <VistaPaciente />}
      </>
    );
  };

  const showPatientModal = !devMode && (patientModalOpen || activeTab === 'paciente' || (!person.nombre && !devMode));

  const showSidebar = true;

  const editorMainClass = showSidebar
    ? 'editor-main'
    : 'editor-main editor-main--no-sidebar';

  return (
      <div className={`editor-layout font-[Inter] typo-input ${sidebarOpen ? 'editor-sidebar-open' : ''}`}>
      {showSidebar ? (
        <>
      <aside className="editor-sidebar">
        <div className="sidebar-logo">
          <button
            ref={logoRef}
            className="w-full flex items-center justify-center"
            aria-label="DocFitness"
          >
            <DocLogo className="h-8 w-auto" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {['1', '2', '3', '4'].map((group) => (
            <React.Fragment key={group}>
              {group !== '1' && <div className="sidebar-divider" />}
              {TABS.filter(t => t.group === group).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSidebarOpen(false);
                  }}
                  className={`sidebar-btn ${activeTab === tab.key ? 'sidebar-btn--active' : ''}`}
                >
                  <span className="sidebar-btn-label">
                     {tab.icon && <tab.icon size={16} className="mr-2 ml-1 inline-flex items-center justify-center" />}
                    {tab.label}
                  </span>
                </button>
              ))}
            </React.Fragment>
          ))}

          <div className="sidebar-divider sidebar-divider--strong" />

          <div className="sidebar-actions">
            {/* Paciente actual */}
            {person.nombre && (
              <div className="sidebar-patient-info">
                <div className="sidebar-patient-avatar">
                  <User size={14} />
                </div>
                <div className="sidebar-patient-details">
                  <div className="sidebar-patient-name">{person.nombre}</div>
                  <div className="sidebar-patient-id">{person.id || 'Sin ID'}</div>
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="sidebar-actions-buttons">
              <button
                onClick={() => {
                  setPatientModalOpen(true);
                  setSidebarOpen(false);
                }}
                className="sidebar-btn sidebar-btn--sm"
                title="Crear nuevo paciente"
              >
                <UserPlus size={14} />
                <span>Nuevo</span>
              </button>
              <button
                onClick={() => {
                  setPatientModalOpen(true);
                  setSidebarOpen(false);
                }}
                className="sidebar-btn sidebar-btn--sm"
                title="Cargar paciente existente"
              >
                <FolderOpen size={14} />
                <span>Abrir</span>
              </button>
            </div>
            
            {onLogout && (
              <button
                onClick={() => {
                  setCloseModalOpen(true);
                }}
                className="sidebar-btn sidebar-btn--danger"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </nav>

        <div className="sidebar-dev-footer">
          <span className="sidebar-dev-kicker">Desarrollado por</span>
          <a href="https://www.instagram.com/jossrva/" target="_blank" rel="noopener noreferrer"><img src={devLogo} alt="Soncultroia" className="sidebar-dev-logo" /></a>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation"
      >
        <span className={`sidebar-toggle-line ${sidebarOpen ? 'active' : ''}`} />
        <span className={`sidebar-toggle-line ${sidebarOpen ? 'active' : ''}`} />
        <span className={`sidebar-toggle-line ${sidebarOpen ? 'active' : ''}`} />
      </button>

      <div className={editorMainClass}>
        <main className="editor-content">
          <ErrorBoundary>
            {renderContent()}
          </ErrorBoundary>
        </main>
      </div>
      {showPatientModal && (
        <PatientModal open={true} onClose={() => { setPatientModalOpen(false); setActiveTab('dashboard'); }} />
      )}
      <CloseConfirmModal
        open={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        onSaveAndClose={handleSaveAndClose}
        onDiscardAndClose={handleDiscardAndClose}
      />
      {updaterOpen && updaterState.update && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-[#0D2640] mb-2">Actualización disponible</h3>
            <p className="text-sm text-[#4B5563] mb-1">Versión {updaterState.update.version}</p>
            {updaterState.update.notes && (
              <p className="text-xs text-[#6B7280] mb-4 whitespace-pre-wrap">{updaterState.update.notes}</p>
            )}
            {(updaterState.status === 'downloading' || updaterState.status === 'installing') && updaterState.progress !== null && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-[#0D2640] h-2 rounded-full transition-all" style={{ width: `${updaterState.progress}%` }} />
              </div>
            )}
            <div className="flex flex-col gap-2">
              {(updaterState.status === 'available' || updaterState.status === 'downloading') && (
                <button
                  onClick={async () => {
                    if (pendingUpdate) {
                      setUpdaterOpen(false);
                      await pendingUpdate.downloadAndInstall((event) => {
                        if (event.event === 'Progress') {
                          setUpdaterState((prev) => ({ ...prev }));
                        } else if (event.event === 'Finished') {
                          setUpdaterState((prev) => ({ ...prev, status: 'installing', progress: 100 }));
                        }
                      });
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-[#0D2640] text-white rounded-xl font-semibold text-sm hover:bg-[#1a3a5c] transition-colors"
                >
                  {updaterState.status === 'downloading' ? 'Instalando...' : 'Descargar e instalar'}
                </button>
              )}
              <button
                onClick={() => setUpdaterOpen(false)}
                className="w-full py-2.5 px-4 text-[#6B7280] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                {updaterState.status === 'downloading' ? 'Cancelar' : 'Ahora no'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
      ) : (
        <div className={editorMainClass}>
          <main className="editorContent">
            <ErrorBoundary>
              {renderContent()}
            </ErrorBoundary>
          </main>
        </div>
      )}
    </div>
  );
}
