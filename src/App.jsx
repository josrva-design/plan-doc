import React from 'react';
import EditorUI from './components/EditorUI';
import { AppProvider, useAppContext } from './context/AppContext';

function AppInner() {
  const { toast } = useAppContext();

  return (
    <>
      <EditorUI />
      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white px-5 py-2.5 rounded-full typo-btn z-50">
          {toast}
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
