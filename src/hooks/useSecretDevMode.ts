import { useEffect, useCallback, useState, useRef } from 'react';

interface SecretDevModeOptions {
  clickTarget?: React.RefObject<HTMLElement | null>;
  clickCount?: number;
  clickWindowMs?: number;
  keyCombo?: { ctrl: boolean; alt: boolean; shift: boolean; key: string };
}

export function useSecretDevMode(toggleDevMode: () => void, onActivate?: () => void, options: SecretDevModeOptions = {}) {
  const {
    clickTarget,
    clickCount = 5,
    clickWindowMs = 500,
    keyCombo = { ctrl: true, alt: true, shift: true, key: 'd' },
  } = options;

  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);
  const toggleDevModeRef = useRef(toggleDevMode);
  toggleDevModeRef.current = toggleDevMode;

  const handleSecretClick = useCallback((e: Event) => {
    const now = Date.now();
    const newTimestamps = [...clickTimestamps, now].filter(t => now - t < clickWindowMs);
    setClickTimestamps(newTimestamps);
    if (newTimestamps.length >= clickCount) {
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleDevModeRef.current();
      onActivate?.();
      setClickTimestamps([]);
    }
  }, [clickTimestamps, clickCount, clickWindowMs, onActivate]);

  useEffect(() => {
    if (!clickTarget?.current) return;
    const el = clickTarget.current;
    el.addEventListener('click', handleSecretClick, true);
    return () => el.removeEventListener('click', handleSecretClick, true);
  }, [clickTarget, handleSecretClick]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (keyCombo.ctrl && !e.ctrlKey && !e.metaKey) return;
      if (keyCombo.alt && !e.altKey) return;
      if (keyCombo.shift && !e.shiftKey) return;
      if (key !== keyCombo.key) return;
      toggleDevModeRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyCombo]);
}
