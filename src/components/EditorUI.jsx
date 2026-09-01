import React, { useState } from 'react';
import ProfileSection from './ProfileSection.jsx';
import SummarySection from './SummarySection.jsx';
import CalendarSection from './CalendarSection.jsx';
import WarmupSection from './WarmupSection.jsx';
import RoutineSection from './RoutineSection.jsx';
import NutritionSection from './NutritionSection.jsx';
import EvolutionSection from './EvolutionSection.jsx';
import SupplementSection from './SupplementSection.jsx';
import DataSection from './DataSection.jsx';
import VistaPaciente from '../pages/VistaPaciente.jsx';
import { useAppContext } from '../context/AppContext.jsx';

import devLogo from '../assets/dev-logo.svg';

const TABS = [
  { key: 'dashboard', label: 'Dashboard', group: 'access' },
  { key: 'perfil', label: 'Perfil', group: 'patient' },
  { key: 'evolucion', label: 'Evolución', group: 'patient' },
  { key: 'nutricion', label: 'Nutrición', group: 'plan' },
  { key: 'entrenamiento', label: 'Entrenamiento', group: 'plan' },
  { key: 'suplementos', label: 'Suplementos', group: 'plan' },
  { key: 'configuracion', label: 'Configuración', group: 'config' },
  { key: 'vista_paciente', label: 'Vista paciente', group: 'config' },
];

export default function EditorUI() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, setters, devMode, toggleDevMode, isDev, showToast } = useAppContext();

  return (
      <div className={`editor-layout font-[Inter] typo-input ${sidebarOpen ? 'editor-sidebar-open' : ''}`}>
      <aside className="editor-sidebar">
        <div className="sidebar-logo">
          <img src="/doc-logo.svg" alt="DocFitness" className="h-10 w-auto" />
        </div>
        <nav className="sidebar-nav">
          {TABS.filter(t => t.group === 'access').map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`sidebar-btn ${activeTab === tab.key ? 'sidebar-btn--active' : ''}`}
            >
              <span className="sidebar-btn-label">{tab.label}</span>
            </button>
          ))}
          <div className="sidebar-divider" />
          {TABS.filter(t => t.group === 'patient').map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`sidebar-btn ${activeTab === tab.key ? 'sidebar-btn--active' : ''}`}
            >
              <span className="sidebar-btn-label">{tab.label}</span>
            </button>
          ))}
          <div className="sidebar-divider" />
          {TABS.filter(t => t.group === 'plan').map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`sidebar-btn ${activeTab === tab.key ? 'sidebar-btn--active' : ''}`}
            >
              <span className="sidebar-btn-label">{tab.label}</span>
            </button>
          ))}
          <div className="sidebar-divider" />
          {TABS.filter(t => t.group === 'config').map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
              className={`sidebar-btn sidebar-btn--config ${activeTab === tab.key ? 'sidebar-btn--active' : ''}`}
            >
              <span className="sidebar-btn-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-dev-footer">
          <span className="sidebar-dev-kicker">Desarrollado por</span>
          <a href="https://www.instagram.com/jossrva/" target="_blank" rel="noopener noreferrer"><img src={devLogo} alt="Soncultroia" className="sidebar-dev-logo" /></a>
        </div>

        <div className="sidebar-dev-toggle">
          <label className="sidebar-toggle-label">Dev Mode</label>
          <button
            onClick={() => { toggleDevMode(); showToast(devMode ? 'Datos de ejemplo desactivados' : 'Datos de ejemplo cargados'); }}
            className={`sidebar-toggle-switch ${devMode ? 'sidebar-toggle-switch--on' : ''}`}
            aria-label="Toggle dev mode"
          >
            <span className={`sidebar-toggle-knob ${devMode ? 'sidebar-toggle-knob--on' : ''}`} />
          </button>
          <span className={`sidebar-toggle-status ${devMode ? 'sidebar-toggle-status--on' : ''}`}>
            {devMode ? 'ON' : 'OFF'}
          </span>
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

      <div className="editor-main">
        <main className="editor-content">
          {activeTab === 'dashboard' && <SummarySection />}
          {activeTab === 'perfil' && <ProfileSection />}
          {activeTab === 'evolucion' && <EvolutionSection />}
          {activeTab === 'nutricion' && <NutritionSection />}
          {activeTab === 'entrenamiento' && (
            <div className="space-y-6">
              <CalendarSection mode="calendario" />
              <CalendarSection mode="calentamiento" />
              <RoutineSection />
            </div>
          )}
          {activeTab === 'suplementos' && <SupplementSection />}
          {activeTab === 'configuracion' && <DataSection />}
          {activeTab === 'vista_paciente' && <VistaPaciente />}
        </main>
      </div>
    </div>
  );
}
