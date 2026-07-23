'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();
  const [step, setStep] = useState<'account' | 'personal' | 'verify'>('account');
  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    docType: 'CC',
    docNumber: '',
    code: ['', '', '', '', '', ''],
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const touch = (k: string) => setTouched(t => ({ ...t, [k]: true }));

  const usernameOk = form.username.trim().length >= 3;
  const passwordOk = form.password.length >= 6;

  const onBack = () => {
    router.push('/');
  };

  const onComplete = () => {
    router.push('/simulator');
  };

  return (
    <div className="min-h-screen bg-zinc-50 relative overflow-hidden flex flex-col">

      {/* ── Decorative curved strokes ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-left cluster */}
        <path d="M-80 120 Q 60 40, 220 160 Q 340 260, 180 380" stroke="black" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.08"/>
        <path d="M-60 180 Q 80 80, 260 210 Q 380 310, 200 440" stroke="black" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.05"/>
        <path d="M-100 60 Q 80 -20, 300 100 Q 440 190, 260 340" stroke="black" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.04"/>

        {/* Bottom-left */}
        <path d="M-60 700 Q 100 620, 200 760 Q 280 860, 100 940" stroke="black" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.06"/>
        <path d="M-40 780 Q 120 680, 240 830" stroke="black" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.04"/>

        {/* Top-right cluster */}
        <path d="M1520 -40 Q 1360 80, 1240 -20 Q 1100 -120, 1300 60" stroke="black" strokeWidth="20" strokeLinecap="round" fill="none" opacity="0.07"/>
        <path d="M1560 40 Q 1380 140, 1220 60 Q 1060 -40, 1280 160" stroke="black" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.05"/>
        <path d="M1500 120 Q 1320 200, 1180 120" stroke="black" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.04"/>

        {/* Bottom-right cluster */}
        <path d="M1560 820 Q 1380 700, 1280 820 Q 1180 940, 1360 1000" stroke="black" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.08"/>
        <path d="M1540 880 Q 1340 760, 1220 880" stroke="black" strokeWidth="13" strokeLinecap="round" fill="none" opacity="0.05"/>
        <path d="M1580 760 Q 1400 640, 1280 750" stroke="black" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.04"/>
      </svg>

      {/* ── Header ── */}
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
          {step === 'account' && 'Abre tu cuenta'}
          {step === 'personal' && 'Datos personales'}
          {step === 'verify' && 'Verificación'}
        </h1>
      </header>

      {/* ── Progress bar ── */}
      <div className="relative z-10 max-w-md mx-auto w-full px-6 mt-2 mb-4">
        <div className="h-0.5 bg-black/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-500"
            style={{ width: step === 'account' ? '33%' : step === 'personal' ? '66%' : '100%' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {['Cuenta', 'Perfil', 'Verificar'].map((s, i) => {
            const active = (step === 'account' && i === 0) || (step === 'personal' && i === 1) || (step === 'verify' && i === 2);
            const done = (step === 'personal' && i === 0) || (step === 'verify' && i <= 1);
            return (
              <span key={s} className={`text-xs font-medium transition-colors ${done ? 'text-black' : active ? 'text-black' : 'text-zinc-400'}`}>
                {s}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="relative z-10 max-w-md mx-auto w-full px-6 mb-6">
        <div className="flex gap-3 p-4 rounded-xl border border-black/8 bg-white/70 backdrop-blur-sm">
          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
              <path d="M5 1v4M5 7.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong className="text-black font-semibold">Proceso 100% digital.</strong>{' '}
            Abre tu cuenta desde tu celular en menos de 5 minutos. Sin filas, sin papeleos, sin sucursales.
          </p>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="relative z-10 max-w-md mx-auto w-full px-6 pb-16 flex-1">
        <div className="bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">

          {/* ─── STEP 1: Account ─── */}
          {step === 'account' && (
            <div className="p-8">
              <h2 className="text-2xl font-black text-black mb-1">¡Hola!</h2>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Ingresa tus datos para crear tu cuenta Jes Bank.
              </p>

              {/* Username */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 border-b border-black/15 pb-2 focus-within:border-black transition-colors group">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400 flex-shrink-0">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 21a8 8 0 0116 0"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={form.username}
                    onChange={e => set('username', e.target.value)}
                    onBlur={() => touch('username')}
                    className="flex-1 text-sm text-black placeholder-zinc-400 outline-none bg-transparent py-1"
                  />
                </div>
                {touched.username && !usernameOk && (
                  <p className="text-xs text-red-500 mt-1.5">El usuario debe tener al menos 3 caracteres</p>
                )}
                {touched.username && usernameOk && (
                  <p className="text-xs text-zinc-400 mt-1.5">
                    <button className="font-semibold text-black underline underline-offset-2">¿Olvidaste tu usuario?</button>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-8">
                <div className="flex items-center gap-2.5 border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400 flex-shrink-0">
                    <rect x="5" y="11" width="14" height="10" rx="2"/>
                    <path d="M8 11V8a4 4 0 018 0v3M12 15v2"/>
                  </svg>
                  <input
                    type="password"
                    placeholder="Clave"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    onBlur={() => touch('password')}
                    className="flex-1 text-sm text-black placeholder-zinc-400 outline-none bg-transparent py-1"
                  />
                </div>
                {touched.password && !passwordOk && (
                  <p className="text-xs text-red-500 mt-1.5">La clave debe tener al menos 6 caracteres</p>
                )}
                <p className="text-xs text-zinc-400 mt-1.5">
                  <button className="font-semibold text-black underline underline-offset-2">¿Olvidaste tu clave?</button>
                </p>
              </div>

              <button
                onClick={() => setStep('personal')}
                disabled={!usernameOk || !passwordOk}
                className="w-full py-3.5 rounded-xl bg-black text-white text-sm font-bold transition-all hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continuar
              </button>

              <p className="text-center text-xs text-zinc-400 mt-5">
                ¿Ya tienes cuenta?{' '}
                <button className="text-black font-semibold underline underline-offset-2">Inicia sesión</button>
              </p>
            </div>
          )}

          {/* ─── STEP 2: Personal ─── */}
          {step === 'personal' && (
            <div className="p-8">
              <h2 className="text-2xl font-black text-black mb-1">Cuéntanos más</h2>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Necesitamos verificar tu identidad para proteger tu cuenta.
              </p>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      onBlur={() => touch('firstName')}
                      className="w-full text-sm text-black placeholder-zinc-400 outline-none bg-transparent py-1"
                    />
                  </div>
                  {touched.firstName && !form.firstName && (
                    <p className="text-xs text-red-500 mt-1">Requerido</p>
                  )}
                </div>
                <div>
                  <div className="border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      onBlur={() => touch('lastName')}
                      className="w-full text-sm text-black placeholder-zinc-400 outline-none bg-transparent py-1"
                    />
                  </div>
                  {touched.lastName && !form.lastName && (
                    <p className="text-xs text-red-500 mt-1">Requerido</p>
                  )}
                </div>
              </div>

              {/* Doc type */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400 flex-shrink-0">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <path d="M2 10h20"/>
                  </svg>
                  <select
                    value={form.docType}
                    onChange={e => set('docType', e.target.value)}
                    className="flex-1 text-sm text-black outline-none bg-transparent py-1 appearance-none cursor-pointer"
                  >
                    <option value="CC">Cédula de ciudadanía</option>
                    <option value="CE">Cédula de extranjería</option>
                    <option value="PA">Pasaporte</option>
                    <option value="NIT">NIT</option>
                  </select>
                  <span className="text-zinc-400 text-xs">▾</span>
                </div>
              </div>

              {/* Doc number */}
              <div className="mb-8">
                <div className="flex items-center gap-2.5 border-b border-black/15 pb-2 focus-within:border-black transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400 flex-shrink-0">
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <path d="M9 7h6M9 11h6M9 15h4"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Número de documento"
                    value={form.docNumber}
                    onChange={e => set('docNumber', e.target.value)}
                    onBlur={() => touch('docNumber')}
                    className="flex-1 text-sm text-black placeholder-zinc-400 outline-none bg-transparent py-1"
                  />
                </div>
                {touched.docNumber && !form.docNumber && (
                  <p className="text-xs text-red-500 mt-1.5">Ingresa tu número de documento</p>
                )}
              </div>

              <button
                onClick={() => setStep('verify')}
                disabled={!form.firstName || !form.lastName || !form.docNumber}
                className="w-full py-3.5 rounded-xl bg-black text-white text-sm font-bold transition-all hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continuar
              </button>

              <button
                onClick={() => setStep('account')}
                className="w-full py-3 mt-2 text-sm text-zinc-400 hover:text-black transition-colors font-medium"
              >
                Atrás
              </button>
            </div>
          )}

          {/* ─── STEP 3: Verify ─── */}
          {step === 'verify' && (
            <div className="p-8">
              <h2 className="text-2xl font-black text-black mb-1">Verifica tu cuenta</h2>
              <p className="text-sm text-zinc-400 mb-2 leading-relaxed">
                Ingresa el código de verificación de tu cuenta
              </p>
              <p className="text-sm font-semibold text-black mb-8">Usuario: {form.username}</p>

              {/* OTP inputs */}
              <div className="flex gap-2.5 justify-center mb-8">
                {form.code.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 1);
                      const next = [...form.code];
                      next[i] = val;
                      setForm(f => ({ ...f, code: next }));
                      if (val && i < 5) {
                        document.getElementById(`otp-${i + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    className={`w-11 h-14 text-center text-lg font-black rounded-xl border transition-all outline-none ${
                      digit
                        ? 'border-black bg-black text-white'
                        : 'border-black/15 bg-zinc-50 text-black focus:border-black focus:bg-white'
                    }`}
                  />
                ))}
              </div>

              {/* Terms */}
              <p className="text-xs text-zinc-400 text-center leading-relaxed mb-6">
                Al continuar aceptas nuestros{' '}
                <button className="text-black font-semibold underline underline-offset-2">Términos y condiciones</button>
                {' '}y la{' '}
                <button className="text-black font-semibold underline underline-offset-2">Política de privacidad</button>
              </p>

              <button
                onClick={onComplete}
                disabled={form.code.some(d => !d)}
                className="w-full py-3.5 rounded-xl bg-black text-white text-sm font-bold transition-all hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Crear mi cuenta
              </button>

              <div className="flex items-center justify-center gap-1 mt-4">
                <span className="text-xs text-zinc-400">¿No recibiste el código?</span>
                <button className="text-xs font-semibold text-black underline underline-offset-2">Reenviar</button>
              </div>

              <button
                onClick={() => setStep('personal')}
                className="w-full py-3 mt-1 text-sm text-zinc-400 hover:text-black transition-colors font-medium"
              >
                Atrás
              </button>
            </div>
          )}
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="text-xs text-zinc-400">Conexión segura · Datos encriptados · Regulado por la FCA</span>
        </div>
      </div>
    </div>
  );
}
