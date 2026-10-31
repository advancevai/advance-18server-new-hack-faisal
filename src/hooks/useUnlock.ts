import { useState, useEffect, useCallback } from 'react';
import { verifyPassGate, checkPassGateSession } from '../lib/passgate';

export function useUnlock() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Clear any old legacy demo sessions and strictly verify with PassGate API
  useEffect(() => {
    try {
      sessionStorage.removeItem('lah_unlocked');
    } catch {
      // Ignore
    }

    const token = localStorage.getItem('pg_token');
    if (!token) {
      setIsUnlocked(false);
      return;
    }

    checkPassGateSession().then((isValid) => {
      setIsUnlocked(isValid);
      if (!isValid) {
        localStorage.removeItem('pg_token');
      }
    });
  }, []);

  const unlockWithPassGate = useCallback(
    async (password: string): Promise<{ success: boolean; message: string }> => {
      const res = await verifyPassGate(password);
      if (res.valid) {
        setIsUnlocked(true);
        return { success: true, message: '' };
      }
      setIsUnlocked(false);
      return { success: false, message: res.message };
    },
    []
  );

  const lock = useCallback(() => {
    setIsUnlocked(false);
    try {
      localStorage.removeItem('pg_token');
      sessionStorage.removeItem('lah_unlocked');
    } catch {
      // Ignore
    }
  }, []);

  return { isUnlocked, unlockWithPassGate, lock };
}
