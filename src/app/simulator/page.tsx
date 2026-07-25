'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExchangeRate } from '../../hooks/useExchangeRate';

// ─── Developer-adjustable rates ───────────────────────────────────────────────
const INTERNATIONAL_COMMISSION = 0.0; // e.g. 0.03 = 3%
const IVA_RATE = 0.0;                 // e.g. 0.19 = 19%

// ─── Static user data (mock for demo) ─────────────────────────────────────────
const USER = {
  name: 'Sara Quintero',
  initials: 'SQ',
  balanceCOP: 8_420_000,
  balanceUSD: 2_050.75,
  card: { last4: '3902', type: 'Jes Platinum', isBlocked: false },
};

const TRANSACTIONS = [
  { id: 1, name: 'Rappi',           category: 'Comidas',          amount: -48_500,   icon: '🛵', color: 'from-orange-500/20 to-orange-600/10', text: 'text-orange-400', date: 'Hoy · 2:14 pm' },
  { id: 2, name: 'Spotify',         category: 'Entretenimiento',  amount: -9_900,    icon: '🎵', color: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400', date: 'Hoy · 10:00 am' },
  { id: 3, name: 'Netflix',         category: 'Streaming',        amount: -22_900,   icon: '🎬', color: 'from-red-500/20 to-red-600/10', text: 'text-red-400', date: 'Ayer · 12:00 am' },
  { id: 4, name: 'Amazon Prime',    category: 'Compras',          amount: -50_000,   icon: '📦', color: 'from-yellow-500/20 to-yellow-600/10', text: 'text-yellow-400', date: 'Lun · 8:00 am' },
  { id: 5, name: 'Transferencia',   category: 'Recibido',         amount: +350_000,  icon: '💸', color: 'from-violet-500/20 to-violet-600/10', text: 'text-violet-400', date: 'Dom · 3:45 pm' },
];

type ActiveTool = 'dashboard' | 'simulator' | 'send' | 'receive' | 'exchange';

const copFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const copFmtFull = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

// ─── Sub-components ────────────────────────────────────────────────────────────

function CreditCard({ blocked, onToggleBlock }: { blocked: boolean; onToggleBlock: () => void }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="select-none">
      {/* Card container with 3D flip */}
      <div
        className="relative w-full aspect-[1.586/1] cursor-pointer"
        style={{ perspective: '1200px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative w-full h-full transition-all duration-700"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-[2rem] overflow-hidden flex flex-col justify-between p-6 shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
            {/* Decorative rings */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-600/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-indigo-600/15 blur-2xl" />
            <div className="absolute top-1/2 right-6 w-24 h-24 rounded-full border border-white/5" />
            <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full border border-white/5" />

            {/* Chip + logo row */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                    <span className="text-black font-black text-[8px]">JB</span>
                  </div>
                  <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">Jes Bank</span>
                </div>
                {/* Chip */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-inner">
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1 bg-yellow-700/40 rounded-sm" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${blocked ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>
                  {blocked ? 'BLOQUEADA' : 'ACTIVA'}
                </div>
                <svg width="28" height="17" viewBox="0 0 50 30" className="opacity-60">
                  <circle cx="18" cy="15" r="14" fill="#EB001B" fillOpacity="0.85" />
                  <circle cx="32" cy="15" r="14" fill="#F79E1B" fillOpacity="0.85" />
                  <path d="M25 5.7a14 14 0 010 18.6A14 14 0 0125 5.7z" fill="#FF5F00" />
                </svg>
              </div>
            </div>

            {/* Card number */}
            <div className="relative z-10">
              <p className="text-sm font-mono text-white/50 tracking-[0.2em] mb-4">
                {blocked ? '••••  ••••  ••••  ••••' : '••••  ••••  ••••  3902'}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] text-zinc-600 uppercase font-semibold mb-0.5">Titular</p>
                  <p className="text-xs text-zinc-300 font-semibold tracking-wide">{USER.name.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-zinc-600 uppercase font-semibold mb-0.5">Válida hasta</p>
                  <p className="text-xs text-zinc-300 font-semibold">12/28</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-[8px] text-zinc-600 uppercase font-semibold mb-0.5">Tipo</p>
                  <p className="text-[10px] text-zinc-400 font-bold tracking-wide">{USER.card.type}</p>
                </div>
                <p className="text-[9px] text-zinc-600 italic">Toca para ver reverso</p>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-[2rem] overflow-hidden flex flex-col justify-between p-6 shadow-2xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-indigo-600/20 blur-2xl" />

            {/* Magnetic stripe */}
            <div className="relative z-10 -mx-6 mt-2 h-9 bg-zinc-700/80" />

            <div className="relative z-10 flex flex-col gap-4">
              {/* CVV */}
              <div>
                <p className="text-[9px] text-zinc-500 uppercase font-semibold mb-1">Código de seguridad (CVV)</p>
                <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center justify-between border border-white/5">
                  <span className="text-white font-mono text-sm tracking-widest">{blocked ? '•••' : '742'}</span>
                  <span className="text-zinc-500 text-[10px]">No compartas</span>
                </div>
              </div>
              {/* Quick actions */}
              <div className="flex gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onToggleBlock(); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${blocked ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10' : 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10'}`}
                >
                  {blocked ? '🔓 Desbloquear' : '🔒 Bloquear'}
                </button>
                <button
                  onClick={e => e.stopPropagation()}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10 text-zinc-300 hover:bg-white/5"
                >
                  📋 Copiar datos
                </button>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-[8px] text-zinc-700 leading-relaxed text-center">
                Si esta tarjeta fue comprometida, bloquéala de inmediato desde el portal o comunícate con soporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulatorTool() {
  const { rateData, loading, error, fetchRate } = useExchangeRate();
  const [usdAmount, setUsdAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const parsedUsd = Number.parseFloat(usdAmount) || 0;
  const rate = rateData?.rate || 0;
  const subtotalCop = parsedUsd * rate;
  const commissionCop = subtotalCop * INTERNATIONAL_COMMISSION;
  const ivaCop = (subtotalCop + commissionCop) * IVA_RATE;
  const totalDebitCop = subtotalCop + commissionCop + ivaCop;

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessBanner(false);
    const val = Number.parseFloat(usdAmount);
    if (Number.isNaN(val) || val <= 0) {
      setValidationError('Ingresa un monto válido mayor a cero.');
      return;
    }
    const data = await fetchRate();
    if (data) {
      setShowResults(true);
      setSuccessBanner(true);
      setTimeout(() => setSuccessBanner(false), 4000);
    }
  };

  const handleReset = () => {
    setUsdAmount('');
    setShowResults(false);
    setValidationError(null);
    setSuccessBanner(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black">Simulador TRM</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">Calcula el costo real de tu compra en dólares</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          En vivo
        </div>
      </div>

      {/* Success banner */}
      {successBanner && rateData && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in flex items-center gap-2">
          <span className="text-emerald-400 text-sm">✓</span>
          <span className="text-xs font-semibold text-emerald-400">TRM actualizada · {rateData.date}</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl animate-fade-in flex items-start gap-2">
          <span className="text-rose-400 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-rose-300/80 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleConsult} className="space-y-3">
        <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-violet-500/30 transition-all duration-300">
          <label htmlFor="sim-usd" className="block text-[10px] text-zinc-500 uppercase font-bold mb-1.5 tracking-wider">
            Monto en USD
          </label>
          <div className="flex items-center justify-between gap-3">
            <input
              id="sim-usd"
              type="number"
              step="any"
              placeholder="100.00"
              value={usdAmount}
              onChange={e => { setUsdAmount(e.target.value); setValidationError(null); }}
              className="text-2xl font-black bg-transparent outline-none flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={loading}
            />
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 shrink-0">
              <span className="text-sm">🇺🇸</span>
              <span className="text-xs font-bold">USD</span>
            </div>
          </div>
        </div>

        {validationError && (
          <p className="text-xs text-rose-400 font-medium px-1 animate-fade-in">{validationError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-white text-black hover:bg-zinc-100 text-sm font-extrabold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin-custom h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Consultando TRM...
            </>
          ) : 'Consultar TRM'}
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-2 animate-pulse-custom">
          <div className="h-5 bg-white/5 rounded-lg w-2/3" />
          <div className="h-10 bg-white/5 rounded-xl" />
          <div className="h-4 bg-white/5 rounded w-full" />
          <div className="h-4 bg-white/5 rounded w-3/4" />
          <div className="h-4 bg-white/5 rounded w-full" />
        </div>
      ) : showResults && rateData ? (
        <div className="space-y-3 animate-fade-in">
          {/* TRM + conversion arrow */}
          <div className="rounded-2xl bg-zinc-900/60 border border-white/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tasa de cambio</span>
              <span className="text-[10px] text-zinc-500">{rateData.source}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[10px] text-zinc-500">1 USD =</span>
              <span className="text-xl font-black">{copFmtFull.format(rateData.rate)}</span>
            </div>
            {/* Conversion flow */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-2 rounded-xl flex-1 justify-center">
                <span>🇺🇸</span>
                <span className="text-xs font-black">{usdFmt.format(parsedUsd)}</span>
              </div>
              <span className="text-zinc-500">→</span>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl flex-1 justify-center">
                <span>🇨🇴</span>
                <span className="text-xs font-black text-emerald-400">{copFmt.format(subtotalCop)}</span>
              </div>
            </div>
          </div>

          {/* Invoice breakdown */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-3">Resumen de liquidación</h4>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Monto base', value: `${usdFmt.format(parsedUsd)} USD` },
                { label: 'TRM aplicada', value: copFmtFull.format(rate) },
                { label: `Comisión internacional (${INTERNATIONAL_COMMISSION * 100}%)`, value: copFmtFull.format(commissionCop) },
                { label: `IVA (${IVA_RATE * 100}%)`, value: copFmtFull.format(ivaCop) },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-zinc-500">{row.label}</span>
                  <span className="text-zinc-300 font-mono">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                <span className="font-bold text-white text-sm">Total debitado</span>
                <span className="font-black text-emerald-400 text-sm font-mono">{copFmt.format(totalDebitCop)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all duration-200 border border-white/5 cursor-pointer"
          >
            Simular otra compra
          </button>

          <p className="text-[9px] text-zinc-700 text-center leading-relaxed px-2">
            La TRM mostrada corresponde a la tasa vigente de DolarAPI. El valor aplicado por el banco puede variar según la franquicia (Visa/Mastercard), la fecha de procesamiento y las políticas internas.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-zinc-300">{label}</h3>
      <p className="text-xs text-zinc-600 max-w-xs">Esta funcionalidad estará disponible próximamente en tu portal bancario.</p>
    </div>
  );
}

// ─── MAIN PORTAL ──────────────────────────────────────────────────────────────
export default function UserPortal() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<ActiveTool>('dashboard');
  const [cardBlocked, setCardBlocked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NAV_ITEMS: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard', label: 'Inicio',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    },
    {
      id: 'simulator', label: 'Simulador TRM',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    },
    {
      id: 'send', label: 'Enviar Dinero',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>,
    },
    {
      id: 'receive', label: 'Recibir',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v20M2 12l10 10 10-10" /></svg>,
    },
    {
      id: 'exchange', label: 'Cambiar Divisas',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>,
    },
  ];

  const QUICK_ACTIONS = [
    { id: 'send' as ActiveTool,     label: 'Enviar',    emoji: '↑', color: 'bg-violet-500/15 border-violet-500/20 hover:bg-violet-500/25' },
    { id: 'receive' as ActiveTool,  label: 'Recibir',   emoji: '↓', color: 'bg-indigo-500/15 border-indigo-500/20 hover:bg-indigo-500/25' },
    { id: 'exchange' as ActiveTool, label: 'Cambiar',   emoji: '⇄', color: 'bg-emerald-500/15 border-emerald-500/20 hover:bg-emerald-500/25' },
    { id: 'simulator' as ActiveTool,label: 'Simular',   emoji: '$', color: 'bg-amber-500/15 border-amber-500/20 hover:bg-amber-500/25' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Ambient glow backgrounds */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-emerald-600/4 rounded-full blur-[100px]" />
      </div>

      {/* ── TOP NAVBAR ─────────────────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/5 bg-zinc-950/90 backdrop-blur-xl shrink-0">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          {/* Left: Logo + mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-black text-[9px]">JB</span>
              </div>
              <span className="font-bold text-sm tracking-tight hidden sm:block">Jes Bank <span className="text-zinc-500 font-normal">· Banca Virtual</span></span>
            </div>
          </div>

          {/* Center: Nav pills (desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-2xl p-1 border border-white/5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTool(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTool === item.id
                    ? 'bg-white text-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={activeTool === item.id ? 'text-black' : 'text-zinc-400'}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right: User avatar + exit */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="hidden sm:flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Salir
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-black ring-2 ring-violet-500/30">
              {USER.initials}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE SIDEBAR OVERLAY ────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="absolute top-0 left-0 h-full w-64 bg-zinc-900 border-r border-white/5 p-4 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4 mt-1">
              <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                <span className="text-black font-black text-[10px]">JB</span>
              </div>
              <span className="font-bold text-sm">Jes Bank</span>
            </div>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTool(item.id); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                  activeTool === item.id ? 'bg-white text-black' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <div className="mt-auto">
              <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors px-3 py-2 cursor-pointer">
                Salir del portal →
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6 md:py-8">

          {/* ═══ DASHBOARD VIEW ═══════════════════════════════════════════ */}
          {activeTool === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome bar */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Buenos días 👋</p>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-0.5">{USER.name}</h1>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-zinc-600 uppercase font-semibold">Última conexión</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Hoy · 10:24 AM</p>
                </div>
              </div>

              {/* ─ Main 2-column grid ─ */}
              <div className="grid lg:grid-cols-12 gap-5">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-7 space-y-5">

                  {/* Balance hero card */}
                  <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-white/8 p-6 shadow-xl">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/12 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/8 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Saldo disponible</p>
                        <p className="text-4xl md:text-5xl font-black tracking-tight">{copFmt.format(USER.balanceCOP)}</p>
                        <p className="text-sm text-zinc-400 mt-1.5 font-mono">{usdFmt.format(USER.balanceUSD)} <span className="text-zinc-600">USD</span></p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-bold text-emerald-400">
                          ↑ 12.4% este mes
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-zinc-400">
                            <path d="M3 3h18v4H3zM3 10h18v4H3zM3 17h18v4H3z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="relative z-10 grid grid-cols-4 gap-2">
                      {QUICK_ACTIONS.map(a => (
                        <button
                          key={a.id}
                          onClick={() => setActiveTool(a.id)}
                          className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer ${a.color}`}
                        >
                          <span className="text-sm font-bold">{a.emoji}</span>
                          <span className="text-[10px] font-semibold text-zinc-300">{a.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent transactions */}
                  <div className="rounded-[2rem] border border-white/8 bg-zinc-900/30 backdrop-blur-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm font-bold">Movimientos recientes</h2>
                      <button className="text-[11px] text-zinc-500 hover:text-white transition-colors cursor-pointer">Ver todos →</button>
                    </div>
                    <div className="space-y-1">
                      {TRANSACTIONS.map(tx => (
                        <div
                          key={tx.id}
                          className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/3 transition-colors group cursor-pointer"
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tx.color} flex items-center justify-center text-base shrink-0 border border-white/5`}>
                            {tx.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{tx.name}</p>
                            <p className="text-[10px] text-zinc-500">{tx.category} · {tx.date}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-sm font-black font-mono ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                              {tx.amount > 0 ? '+' : ''}{copFmt.format(tx.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-5 space-y-5">

                  {/* Credit card */}
                  <div className="rounded-[2rem] border border-white/8 bg-zinc-900/20 backdrop-blur-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm font-bold">Mi tarjeta</h2>
                      <span className="text-[10px] text-zinc-500">Toca la tarjeta para girarla</span>
                    </div>
                    <CreditCard blocked={cardBlocked} onToggleBlock={() => setCardBlocked(b => !b)} />
                    {cardBlocked && (
                      <div className="mt-3 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2">
                        <span className="text-rose-400 text-xs">🔒</span>
                        <p className="text-xs text-rose-300/80 font-semibold">Tarjeta temporalmente bloqueada</p>
                      </div>
                    )}
                  </div>

                  {/* TRM Simulator teaser — click to open full tool */}
                  <button
                    onClick={() => setActiveTool('simulator')}
                    className="w-full rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent p-5 text-left group transition-all hover:border-violet-500/40 hover:from-violet-600/15 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] text-violet-400 uppercase font-bold tracking-wider">Funcionalidad</p>
                        <h3 className="text-sm font-black mt-0.5">Simulador TRM</h3>
                        <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                          Calcula cuánto pagarías en COP por una compra en dólares con la TRM oficial de hoy.
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:bg-violet-500/25 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-violet-400">
                          <line x1="12" y1="1" x2="12" y2="23" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-400">
                      Abrir simulador
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ SIMULATOR VIEW ═══════════════════════════════════════════ */}
          {activeTool === 'simulator' && (
            <div className="space-y-5">
              {/* Back breadcrumb */}
              <button
                onClick={() => setActiveTool('dashboard')}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer group"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                Volver al inicio
              </button>

              <div className="grid lg:grid-cols-12 gap-5">
                {/* Credit card (left) */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="rounded-[2rem] border border-white/8 bg-zinc-900/20 backdrop-blur-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Tu tarjeta activa</p>
                        <h2 className="text-sm font-black mt-0.5">Jes Platinum</h2>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${cardBlocked ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'}`}>
                        {cardBlocked ? '🔒 BLOQUEADA' : '✓ ACTIVA'}
                      </div>
                    </div>
                    <CreditCard blocked={cardBlocked} onToggleBlock={() => setCardBlocked(b => !b)} />
                  </div>

                  {/* Balance widget */}
                  <div className="rounded-[2rem] border border-white/8 bg-zinc-900/20 p-5 space-y-3">
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Saldo disponible</p>
                    <div>
                      <p className="text-2xl font-black">{copFmt.format(USER.balanceCOP)}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">{usdFmt.format(USER.balanceUSD)} USD</p>
                    </div>
                    <div className="h-px bg-white/5" />
                    <p className="text-[10px] text-zinc-600 leading-relaxed">
                      Este saldo podría verse afectado según el valor total simulado.
                    </p>
                  </div>
                </div>

                {/* Simulator tool (right) */}
                <div className="lg:col-span-7">
                  <div className="rounded-[2rem] border border-white/8 bg-zinc-900/30 backdrop-blur-md p-6">
                    <SimulatorTool />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ OTHER TOOLS ══════════════════════════════════════════════ */}
          {activeTool === 'send' && (
            <div>
              <button onClick={() => setActiveTool('dashboard')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer mb-5 group">
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Volver
              </button>
              <div className="rounded-[2rem] border border-white/8 bg-zinc-900/30 p-6">
                <ComingSoon label="Enviar Dinero" />
              </div>
            </div>
          )}
          {activeTool === 'receive' && (
            <div>
              <button onClick={() => setActiveTool('dashboard')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer mb-5 group">
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Volver
              </button>
              <div className="rounded-[2rem] border border-white/8 bg-zinc-900/30 p-6">
                <ComingSoon label="Recibir Dinero" />
              </div>
            </div>
          )}
          {activeTool === 'exchange' && (
            <div>
              <button onClick={() => setActiveTool('dashboard')} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer mb-5 group">
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Volver
              </button>
              <div className="rounded-[2rem] border border-white/8 bg-zinc-900/30 p-6">
                <ComingSoon label="Cambiar Divisas" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── BOTTOM MOBILE NAV ─────────────────────────────────────────────── */}
      <nav className="md:hidden relative z-20 border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl">
        <div className="flex items-center justify-around h-14 px-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              className={`flex flex-col items-center gap-0.5 py-2 px-2 rounded-xl transition-all cursor-pointer ${
                activeTool === item.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-semibold leading-none">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── LEGAL FOOTER ─────────────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/5 bg-zinc-950 py-4 px-6 hidden md:block">
        <p className="text-[9px] text-zinc-700 text-center max-w-3xl mx-auto leading-relaxed">
          © 2026 Jes Bank Ltd. · Simulación bancaria con fines académicos. La TRM corresponde a datos de DolarAPI Colombia y puede variar según la franquicia, fecha de procesamiento y políticas del banco emisor.
        </p>
      </div>
    </div>
  );
}
