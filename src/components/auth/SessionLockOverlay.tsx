'use client';

import { useState } from 'react';
import { AuthService } from '../../services/auth.service';

interface SessionLockOverlayProps {
  user: {
    firstName: string;
    lastName: string;
    docType: string;
    docNumber: string;
  };
  onUnlock: () => void;
}

export default function SessionLockOverlay({ user, onUnlock }: SessionLockOverlayProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      setError('Ingresa tu PIN de 4 números.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({
        docType: user.docType,
        docNumber: user.docNumber,
        pin,
      });
      AuthService.saveSession(response);
      setPin('');
      onUnlock();
    } catch (err: any) {
      setError(err.message || 'PIN incorrecto. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[2rem] border border-black/8 shadow-2xl p-6 space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-black">Sesión pausada</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Por seguridad, confirma tu PIN de 4 números para volver a ver tus datos.
          </p>
          <p className="text-[11px] text-zinc-400 font-semibold">
            Hola, {user.firstName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            autoFocus
            placeholder="PIN de 4 números"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="w-full p-3.5 bg-zinc-50 border border-black/8 rounded-xl text-center text-lg font-black tracking-[0.4em] outline-none"
          />
          {error && <p className="text-xs text-red-600 font-semibold text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="w-full py-3.5 rounded-xl bg-black text-white text-sm font-bold disabled:opacity-40"
          >
            {loading ? 'Verificando...' : 'Desbloquear'}
          </button>
        </form>
      </div>
    </div>
  );
}
