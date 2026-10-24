import { useEffect, useRef, useState } from 'react';

export const OVERLAY_EXIT_MS = 180;

export const useOverlayPresence = (isOpen, exitMs = OVERLAY_EXIT_MS, onExited = null) => {
  const [mounted, setMounted] = useState(Boolean(isOpen));
  const [state, setState] = useState('closed');
  const frameRef = useRef(null);
  const onExitedRef = useRef(onExited);

  useEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => setState('open'));
      });

      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }

    if (!mounted) return undefined;

    setState('closed');
    const timer = window.setTimeout(() => {
      setMounted(false);
      onExitedRef.current?.();
    }, exitMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, mounted, exitMs]);

  return { mounted, state };
};
