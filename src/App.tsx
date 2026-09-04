import React from 'react';
import EditorUI from './components/EditorUI';
import { AppProvider, useAppContext } from './context/AppContext';

function AppInner(): JSX.Element {
  const { devMode } = useAppContext();

  return (
    <>
      <EditorUI />
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
