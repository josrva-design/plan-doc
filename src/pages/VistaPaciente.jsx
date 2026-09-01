import PatientPDF from '../client/PatientPDF.tsx';
import usePatientData from '../hooks/usePatientData.tsx';
import { useAppContext } from '../context/AppContext.jsx';
import { generateShareUrl } from '../utils/shareUtils.js';
import { useState } from 'react';
import { Copy, Share2, FileDown } from 'lucide-react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

export default function VistaPaciente() {
  const { data, devMode, showToast } = useAppContext();
  const patientData = usePatientData(data);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = async () => {
    const nombre = patientData?.person?.nombre || '';
    const url = generateShareUrl(data, { name: nombre });
    if (!url) {
      showToast('Error al generar el link');
      return;
    }
    setShareUrl(url);
    setShowShareDialog(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Link copiado! Pega directamente en WhatsApp');
    } catch {
      showToast('No se pudo copiar.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg-subtle)] flex flex-col items-center py-6">
      {devMode && (
        <div className="w-full max-w-[430px] px-6 mb-4">
          <div className="bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold px-4 py-2 rounded-full text-center">
            MODO TESTEO VISUAL — Datos de ejemplo
          </div>
        </div>
      )}

      <div className="w-full max-w-[430px] px-6 mb-4 flex justify-end">
        <button
          onClick={handleShare}
          className="text-[11px] font-bold px-4 py-2 rounded-full bg-[var(--color-primary)] text-white hover:bg-blue-700 transition-colors active:scale-95"
        >
          Compartir plan
        </button>
      </div>

      <div className="relative w-[390px] h-[852px] bg-black rounded-[60px] p-[12px] shadow-[0_40px_100px_rgba(13,38,64,0.25),0_0_0_1px_rgba(0,0,0,0.8)]">
        <div className="absolute -left-[3px] top-[110px] w-[4px] h-[28px] bg-[#2a2a2a] rounded-l-[4px]" />
        <div className="absolute -left-[3px] top-[150px] w-[4px] h-[58px] bg-[#2a2a2a] rounded-l-[4px]" />
        <div className="absolute -left-[3px] top-[216px] w-[4px] h-[58px] bg-[#2a2a2a] rounded-l-[4px]" />
        <div className="absolute -right-[3px] top-[170px] w-[4px] h-[88px] bg-[#2a2a2a] rounded-r-[4px]" />

        <div className="w-full h-full bg-white rounded-[48px] overflow-hidden relative flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-[32px] flex justify-center z-50 pointer-events-none">
            <div className="w-[100px] h-[28px] bg-black rounded-full mt-[10px] flex items-center justify-end pr-3">
              <div className="w-3 h-3 rounded-full bg-[#1a1a3a] ring-1 ring-white/10" />
            </div>
          </div>

          <div className="h-[44px] shrink-0 bg-white" />

          <div className="flex-1 overflow-hidden bg-[var(--color-bg-base)]">
            <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-black flex items-center justify-center pt-28">
              <div className="w-full max-w-[390px] scale-[1] zoom-1">
                <PDFViewer width="100%" height="852" showToolbar={false} style={{ width: '100%', maxWidth: '100%', objectFit: 'contain', transform: 'none', zoom: 1 }}>
                  <PatientPDF plan={patientData} />
                </PDFViewer>
              </div>
            </div>
          </div>

          <div className="h-[34px] flex justify-center items-center shrink-0 bg-white">
            <div className="w-[134px] h-[5px] bg-black rounded-full" />
          </div>
        </div>
      </div>

      <p className="text-[10px] mt-6 opacity-30 text-center max-w-[300px]">
        Vista previa del PDF 9:16 — Diseño optimizado para celular
      </p>

      {showShareDialog && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowShareDialog(false)}
        >
          <div
            className="w-full bg-white sm:max-w-sm sm:rounded-t-none sm:rounded-[20px] sm:shadow-xl sm:mx-4"
            style={{ borderRadius: '20px 20px 0 0' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 size={20} className="text-[var(--color-primary)]" />
              </div>
              <h3 className="text-center font-bold text-[var(--color-navy)] mb-1">Compartir plan</h3>
              <p className="text-[11px] text-[var(--color-muted)] text-center mb-4">
                Elegí cómo entregar el plan:
              </p>

              <div className="space-y-2">
                <PDFDownloadLink
                  document={<PatientPDF plan={patientData} />}
                  fileName={`plan-${(patientData?.person?.nombre || 'paciente').replace(/[^a-zA-Z0-9-_]/g, '')}.pdf`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--color-green)] text-white font-bold text-[11px] transition-colors hover:bg-green-600 active:scale-[0.98]"
                >
                  <FileDown size={14} />
                  Descargar PDF
                </PDFDownloadLink>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--color-navy)] text-white font-bold text-[11px] transition-colors hover:bg-navy/90 active:scale-[0.98]"
                >
                  <Copy size={14} />
                  Copiar link del plan
                </button>
              </div>

              <button
                onClick={() => setShowShareDialog(false)}
                className="w-full py-2 text-[11px] text-[var(--color-muted)] mt-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
