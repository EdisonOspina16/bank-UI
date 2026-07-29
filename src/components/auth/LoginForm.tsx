'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../services/auth.service';

export default function LoginForm() {
  const router = useRouter();
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [pin, setPin] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }));

  const docNumberOk = docNumber.trim().length > 3;
  const pinOk = /^\d{4}$/.test(pin);

  const onBack = () => {
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumberOk || !pinOk) return;

    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({
        docType,
        docNumber,
        pin,
      });

      // Save tokens and user in localStorage
      AuthService.saveSession(response);

      // Redirect to simulator
      router.push('/simulator');
    } catch (err: any) {
      setError(err.message || 'Error de credenciales. Revisa tu documento y PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 relative overflow-hidden flex flex-col">

      {/* Decorative curved strokes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M-80 120 Q 60 40, 220 160 Q 340 260, 180 380" stroke="black" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.08"/>
        <path d="M-60 180 Q 80 80, 260 210 Q 380 310, 200 440" stroke="black" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.05"/>
        <path d="M-100 60 Q 80 -20, 300 100 Q 440 190, 260 340" stroke="black" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.04"/>
        <path d="M-60 700 Q 100 620, 200 760 Q 280 860, 100 940" stroke="black" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.06"/>
        <path d="M-40 780 Q 120 680, 240 830" stroke="black" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.04"/>
        <path d="M1520 -40 Q 1360 80, 1240 -20 Q 1100 -120, 1300 60" stroke="black" strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.07"/>
        <path d="M1560 40 Q 1380 140, 1220 60 Q 1060 -40, 1280 160" stroke="black" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.05"/>
        <path d="M1500 120 Q 1320 200, 1180 120" stroke="black" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.04"/>
        <path d="M1560 820 Q 1380 700, 1280 820 Q 1180 940, 1360 1000" stroke="black" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.08"/>
        <path d="M1540 880 Q 1340 760, 1220 880" stroke="black" strokeWidth="13" strokeLinecap="round" fill="none" opacity="0.05"/>
        <path d="M1580 760 Q 1400 640, 1280 750" stroke="black" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.04"/>
      </svg>

      {/* Header */}
      <header className="relative z-10 pt-10 pb-4 flex flex-col items-center">
        <button onClick={onBack} className="absolute left-8 top-10 flex items-center gap-1.5 text-sm text-zinc-400 hover:text-black transition-colors font-medium">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">JB</span>
          </div>
          <span className="text-black font-bold text-xl tracking-tight">Jes Bank</span>
        </div>

        <h1 className="text-2xl font-light text-zinc-700 tracking-wide">
          Banca de Personas y Empresas
        </h1>
      </header>

      {/* Main card */}
      <div className="relative z-10 max-w-md mx-auto w-full px-6 pb-16 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">
          
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-100 text-xs text-red-600 font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="p-8">
            <h2 className="text-2xl font-black text-black mb-1">Sucursal Virtual</h2>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              Ingresa tus credenciales de documento y PIN de 4 números.
            </p>

            {/* Doc type */}
            <div className="mb-4">
              <div className="flex items-center gap-2.5 border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400 flex-shrink-0">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20"/>
                </svg>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="flex-1 text-sm text-black outline-none bg-transparent py-1 appearance-none cursor-pointer"
                >
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PA">Pasaporte</option>
                  <option value="NIT">NIT (Empresas)</option>
                </select>
                <span className="text-zinc-400 text-xs">▾</span>
              </div>
            </div>

            {/* Doc number */}
            <div className="mb-4">
              <div className="flex items-center gap-2.5 border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400 flex-shrink-0">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <path d="M9 7h6M9 11h6M9 15h4"/>
                </svg>
                <input
                  type="text"
                  placeholder="Número de documento"
                  value={docNumber}
                  onChange={e => setDocNumber(e.target.value)}
                  onBlur={() => touch('docNumber')}
                  className="flex-1 text-sm text-black placeholder-zinc-400 outline-none bg-transparent py-1"
                />
              </div>
              {touched.docNumber && !docNumberOk && (
                <p className="text-xs text-red-500 mt-1.5">Ingresa tu número de documento</p>
              )}
            </div>

            {/* PIN (4 numbers) */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400 flex-shrink-0">
                  <rect x="5" y="11" width="14" height="10" rx="2"/>
                  <path d="M8 11V8a4 4 0 018 0v3M12 15v2"/>
                </svg>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="PIN de seguridad (4 números)"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={() => touch('pin')}
                  className="flex-1 text-sm text-black placeholder-zinc-400 outline-none bg-transparent py-1"
                />
              </div>
              {touched.pin && !pinOk && (
                <p className="text-xs text-red-500 mt-1.5">El PIN de seguridad debe ser exactamente de 4 números</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!docNumberOk || !pinOk || loading}
              className="w-full py-3.5 rounded-xl bg-black text-white text-sm font-bold transition-all hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Entrar'}
            </button>

            <p className="text-center text-xs text-zinc-400 mt-5">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/register')}
                className="text-black font-semibold underline underline-offset-2"
              >
                Regístrate
              </button>
            </p>
          </form>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="text-xs text-zinc-400">Conexión segura · Datos encriptados · Regulado por la Superfinanciera</span>
        </div>
      </div>
    </div>
  );
}
