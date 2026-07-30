'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_TIMEOUT_MS = 150_000; // 2.5 minutos

export function useIdleLock(enabled: boolean) {
  const [locked, setLocked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleLock = useCallback(() => {
    clearTimer();
    if (!enabled || locked) return;
    timerRef.current = setTimeout(() => setLocked(true), IDLE_TIMEOUT_MS);
  }, [clearTimer, enabled, locked]);

  const unlock = useCallback(() => {
    setLocked(false);
    scheduleLock();
  }, [scheduleLock]);

  const resetActivity = useCallback(() => {
    if (!enabled || locked) return;
    scheduleLock();
  }, [enabled, locked, scheduleLock]);

  useEffect(() => {
    if (!enabled) {
      clearTimer();
      setLocked(false);
      return;
    }

    scheduleLock();

    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'] as const;
    events.forEach((event) => window.addEventListener(event, resetActivity, { passive: true }));

    const onVisibilityChange = () => {
      if (document.hidden) {
        setLocked(true);
      } else {
        resetActivity();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearTimer();
      events.forEach((event) => window.removeEventListener(event, resetActivity));
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled, resetActivity, scheduleLock, clearTimer]);

  return { locked, unlock, resetActivity };
}
