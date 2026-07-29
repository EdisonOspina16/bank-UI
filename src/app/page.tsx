'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { LANDING_FEATURES } from '../lib/features';
import PremiumCard from '../components/landing/PremiumCard';
import { Reveal } from '../components/landing/Reveal';

const NAV_LINKS = [
  { label: 'Personal', href: '#productos' },
  { label: 'Empresas', href: '#planes' },
  { label: 'Blog', href: '#app' },
  { label: 'Ayuda', href: '#footer' },
];

const PLANS = [
  {
    name: 'Estándar',
    price: 'Gratis',
    features: ['Tarjeta virtual', 'Cambio hasta $1.000/mes', 'Transferencias gratis a Jes Bank'],
    cta: 'Empezar gratis',
    highlight: false,
  },
  {
    name: 'Plus',
    price: '$3,99',
    per: '/mes',
    features: ['Tarjeta Virtual', 'Cambio ilimitado', 'Soporte prioritario', '1% cashback'],
    cta: 'Obtener Plus',
    highlight: true,
  },
  {
    name: 'Metal',
    price: '$13,99',
    per: '/mes',
    features: ['Tarjeta Virtual', 'Cashback premium', 'Seguro de viaje', 'Acceso VIP aeropuertos'],
    cta: 'Obtener Metal',
    highlight: false,
  },
];

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${light ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <span className="font-[family-name:var(--font-display)] font-extrabold text-[11px] tracking-tight">JB</span>
      </div>
      <span className={`font-[family-name:var(--font-display)] font-bold text-lg tracking-tight ${light ? 'text-white' : 'text-black'}`}>
        Jes Bank
      </span>
    </div>
  );
}

function Navbar({ onEnter }: { readonly onEnter: () => void }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-white/80 border-b border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="group">
          <BrandMark />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative text-sm text-zinc-500 hover:text-black transition-colors font-medium after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-black after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              aria-expanded={accountOpen}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors font-medium px-3 py-2 rounded-full hover:bg-zinc-100"
            >
              Sucursal Virtual
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${accountOpen ? 'rotate-180' : ''}`}>
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-11 w-48 rounded-2xl border border-black/8 bg-white/95 backdrop-blur-xl p-2 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] z-50 animate-fade-in">
                <button onClick={onEnter} className="w-full text-left rounded-xl px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors">
                  Personas
                </button>
                <button onClick={onEnter} className="w-full text-left rounded-xl px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors">
                  Empresas
                </button>
              </div>
            )}
          </div>
          <button onClick={onEnter} className="btn-premium px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-zinc-800 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.6)]">
            Entrar
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-black rounded-xl hover:bg-zinc-100 transition-colors" aria-label="Menú">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-white/95 backdrop-blur-xl px-6 py-5 space-y-3 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="block text-sm text-zinc-600 hover:text-black font-medium py-2">
              {l.label}
            </a>
          ))}
          <div className="border-t border-black/5 pt-4 space-y-2">
            <button onClick={onEnter} className="block text-sm text-zinc-600 hover:text-black text-left w-full py-1">Personas</button>
            <button onClick={onEnter} className="block text-sm text-zinc-600 hover:text-black text-left w-full py-1">Empresas</button>
          </div>
          <button onClick={onEnter} className="btn-premium block w-full text-center py-3.5 bg-black text-white text-sm font-semibold rounded-full mt-2">
            Entrar
          </button>
        </div>
      )}
    </nav>
  );
}

function Hero({ onStart }: { readonly onStart: () => void }) {
  return (
    <section className="relative pt-28 pb-16 lg:pt-32 lg:pb-20 px-6 overflow-hidden hero-atmosphere">
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]" style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[min(78vh,720px)]">
        <div className="order-1">
          <p className="font-[family-name:var(--font-display)] text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.22em] mb-6 animate-fade-in">
            Banca digital · Colombia
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl lg:text-[4.75rem] font-extrabold text-black leading-[0.95] tracking-tight mb-6">
            El dinero,<br />
            <span className="bg-gradient-to-r from-black via-zinc-700 to-black bg-clip-text text-transparent">
              sin límites.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 leading-relaxed max-w-lg mb-10">
            Abre una cuenta en minutos. Paga, envía y cambia dinero en cualquier parte del mundo, sin comisiones ocultas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={onStart} className="btn-premium inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-black text-white text-sm font-semibold rounded-full shadow-[0_16px_40px_-18px_rgba(0,0,0,0.7)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </button>
            <button onClick={onStart} className="btn-premium inline-flex items-center justify-center gap-2.5 px-6 py-3.5 border border-black/12 bg-white/70 backdrop-blur text-black text-sm font-semibold rounded-full hover:border-black/30 hover:bg-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3.18 23.76a2 2 0 01-.69-1.54V1.77a2 2 0 01.69-1.53l.08-.07 12.45 12.44v.29L3.26 23.84zM20.3 16.1l-4.12-4.12 4.12-4.12 3.4 1.93a2 2 0 010 3.51zM3.18.24L15.62 12.7l-4.12 4.12L3.18.24z" />
              </svg>
              Google Play
            </button>
          </div>
        </div>

        <div className="order-2 relative">
          <PremiumCard />
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { n: '50M+', l: 'Clientes en el mundo' },
    { n: '36+', l: 'Divisas disponibles' },
    { n: '$0', l: 'Comisión por transferencia' },
    { n: '4.9★', l: 'Valoración App Store' },
  ];

  return (
    <section className="px-6 pb-20 bg-gradient-to-b from-zinc-50 to-white">
      <Reveal className="max-w-6xl mx-auto">
        <div className="rounded-[2rem] border border-black/[0.06] bg-white/80 backdrop-blur-sm px-6 py-10 sm:px-10 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.25)]">
          {stats.map((s, i) => (
            <div key={s.n} className="text-center md:text-left" style={{ transitionDelay: `${i * 80}ms` }}>
              <p className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold text-black mb-1 tracking-tight">{s.n}</p>
              <p className="text-sm text-zinc-400 font-medium">{s.l}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function PhoneSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        <Reveal className="flex justify-center order-2 lg:order-1">
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.08),transparent_70%)] blur-2xl" />
            <div className="relative w-64 h-[520px] bg-black rounded-[2.5rem] shadow-[0_40px_80px_-28px_rgba(0,0,0,0.55)] overflow-hidden border-[5px] border-zinc-900 transition-transform duration-700 hover:-translate-y-2">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20" />
              <div className="h-full bg-white pt-14 p-5 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-zinc-400">Buenos días, Sara</p>
                    <p className="text-2xl font-extrabold text-black mt-0.5 tracking-tight">$8.420.000</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-black">S</div>
                </div>

                <div className="rounded-2xl h-36 mb-5 relative overflow-hidden jes-card-black flex flex-col justify-between p-4 border border-white/10">
                  <div className="absolute inset-0 jes-holo opacity-30" />
                  <div className="relative flex justify-between items-start">
                    <div className="w-7 h-5 rounded-sm jes-chip" />
                    <span className="text-[#d4af37] text-xs font-bold tracking-wide">Jes</span>
                  </div>
                  <div className="relative">
                    <p className="text-white/50 text-xs font-mono tracking-widest mb-1">•••• 4821</p>
                    <p className="text-white/70 text-[10px] tracking-wider">SARA QUINTERO</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-5">
                  {[{ l: 'Enviar', i: '↑' }, { l: 'Recibir', i: '↓' }, { l: 'Cambio', i: '⇄' }, { l: 'Más', i: '⋯' }].map((a) => (
                    <div key={a.l} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-sm text-black transition-transform hover:scale-105">{a.i}</div>
                      <span className="text-[10px] text-zinc-400 font-medium">{a.l}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recientes</p>
                <div className="space-y-3 flex-1">
                  {[
                    { name: 'Rappi', amt: '-$48.500', bg: 'bg-orange-100', fg: 'text-orange-600' },
                    { name: 'Spotify', amt: '-$9.900', bg: 'bg-emerald-100', fg: 'text-emerald-600' },
                    { name: 'Transferencia', amt: '+$200.000', bg: 'bg-sky-100', fg: 'text-sky-600' },
                  ].map((tx) => (
                    <div key={tx.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg ${tx.bg} flex items-center justify-center`}>
                          <span className={`text-xs font-bold ${tx.fg}`}>{tx.name[0]}</span>
                        </div>
                        <span className="text-xs font-medium text-black">{tx.name}</span>
                      </div>
                      <span className={`text-xs font-semibold ${tx.amt.startsWith('+') ? 'text-emerald-600' : 'text-black'}`}>
                        {tx.amt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={100}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-5">Tu dinero, claro</p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold text-black leading-[1.05] mb-6 tracking-tight">
            Todo tu dinero<br />en una sola app
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed mb-10 max-w-md">
            Consulta tu saldo, analiza tus gastos, envía dinero y gestiona tus tarjetas — todo desde la palma de tu mano, en tiempo real.
          </p>
          <ul className="space-y-4">
            {[
              'Notificaciones instantáneas en cada gasto',
              'Control total: bloquea tu tarjeta con un toque',
              'Análisis de gastos por categorías automático',
              'Historial completo de transacciones',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 font-medium">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-[10px]">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureList() {
  return (
    <section id="productos" className="py-24 px-6 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 20% 0%, rgba(212,175,55,0.12), transparent 55%)',
      }} />
      <div className="relative max-w-6xl mx-auto">
        <Reveal className="mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-4">Lo que puedes hacer</p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold text-white leading-[1.05] tracking-tight">
            Una cuenta.<br />Infinitas posibilidades.
          </h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {LANDING_FEATURES.map((f, i) => (
            <Reveal key={f.id} delay={i * 70}>
              <article className="feature-tile overflow-hidden rounded-[1.75rem] bg-zinc-950 border border-white/8 flex flex-col h-full group">
                <div className="h-44 overflow-hidden bg-zinc-900 relative">
                  <img
                    src={f.image}
                    alt={f.shortTitle}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-sm font-extrabold leading-snug text-white tracking-wide">{f.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-zinc-500">{f.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExchangeSection() {
  const router = useRouter();
  const { rateData, loading, error, fetchRate } = useExchangeRate();
  const [usdAmount, setUsdAmount] = useState('100');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  const copFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    const val = Number.parseFloat(usdAmount);
    if (Number.isNaN(val) || val <= 0) {
      setValidationError('El monto en USD debe ser mayor a cero.');
      return;
    }
    const data = await fetchRate();
    if (data) setCalculated(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value);
    if (validationError) setValidationError(null);
  };

  const handleOpenVirtualBank = () => router.push('/login');
  const parsedUsd = Number.parseFloat(usdAmount) || 0;
  const convertedCop = rateData ? parsedUsd * rateData.rate : 0;

  return (
    <section className="py-24 px-6 bg-black text-white border-t border-white/5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-5">Simulador Rápido</p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold leading-[1.05] mb-6 tracking-tight">
            Compra en dólares<br />sin sorpresas.
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-md">
            Consulta la TRM del día y conoce cuánto pagarías por una compra internacional antes de utilizar tu tarjeta.
          </p>
          <button
            onClick={handleOpenVirtualBank}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white border-b border-white/25 pb-0.5 hover:border-white transition-colors"
          >
            Abrir banca virtual →
          </button>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[1.75rem] border border-white/10 p-7 sm:p-8 relative overflow-hidden bg-zinc-950/90 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] hover:border-white/20 transition-colors">
            <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />
            <div className="flex justify-between items-center mb-6 relative">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Simulador de compra express</span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-custom" />
                En tiempo real
              </span>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4 mb-6 relative">
              <div className="rounded-2xl bg-white/[0.04] border border-white/8 p-4 focus-within:border-white/25 transition-all">
                <label htmlFor="landing-usd" className="block text-xs text-zinc-500 mb-1 font-medium">Monto a simular</label>
                <div className="flex items-center justify-between">
                  <input
                    id="landing-usd"
                    type="number"
                    step="any"
                    value={usdAmount}
                    onChange={handleInputChange}
                    placeholder="100"
                    className="text-3xl font-extrabold text-white bg-transparent outline-none w-2/3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={loading}
                  />
                  <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors border border-white/5">
                    <span className="text-base select-none" aria-hidden>🇺🇸</span>
                    <span className="text-sm font-bold tracking-tight">USD</span>
                  </div>
                </div>
              </div>

              {validationError && <p className="text-xs text-rose-400 font-semibold px-2 animate-fade-in">{validationError}</p>}
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full py-4 rounded-2xl bg-white text-black hover:bg-zinc-100 text-sm font-extrabold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin-custom h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Consultando TRM...
                  </>
                ) : (
                  'Calcular'
                )}
              </button>
            </form>

            {calculated && rateData && !loading && !error && (
              <div className="space-y-4 border-t border-white/10 pt-5 animate-fade-in relative">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">TRM Oficial</span>
                  <span className="text-zinc-200 font-mono font-bold">1 USD = {copFormatter.format(rateData.rate)}</span>
                </div>
                <div className="rounded-2xl bg-zinc-900 border border-white/5 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Valor Simulado</p>
                    <p className="text-sm font-extrabold text-zinc-300">{usdFormatter.format(parsedUsd)} USD</p>
                  </div>
                  <div className="text-zinc-500 text-lg select-none">⇄</div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Total en Pesos</p>
                    <p className="text-lg font-black text-emerald-400">{copFormatter.format(convertedCop)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-500">
                  <span>Fuente: {rateData.source}</span>
                  <span>Actualizado: {rateData.date}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleOpenVirtualBank}
              className="w-full mt-4 py-3.5 rounded-2xl border border-white/10 text-white hover:bg-white/5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              Abrir banca virtual
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlansSection() {
  return (
    <section id="planes" className="py-24 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto">
        <Reveal className="mb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-4">Planes</p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold text-black leading-[1.05] tracking-tight">
            Empieza gratis.<br />Escala cuando quieras.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 90}>
              <div
                className={`h-full p-8 flex flex-col rounded-[1.75rem] border transition-all duration-400 hover:-translate-y-1 ${
                  plan.highlight
                    ? 'bg-black text-white border-black shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)]'
                    : 'bg-white text-black border-black/8 hover:border-black/20 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.3)]'
                }`}
              >
                <div className="mb-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-4 text-zinc-400">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    {plan.per && <span className="text-sm text-zinc-400">{plan.per}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      <span className={`mt-0.5 flex-shrink-0 font-bold ${plan.highlight ? 'text-white' : 'text-black'}`}>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn-premium w-full py-3.5 rounded-xl text-sm font-bold ${
                    plan.highlight
                      ? 'bg-white text-black hover:bg-zinc-100'
                      : 'border border-black/15 text-black hover:bg-black hover:text-white hover:border-black'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppDownload() {
  return (
    <section id="app" className="py-24 px-6 bg-white">
      <Reveal className="max-w-6xl mx-auto">
        <div className="rounded-[2rem] bg-black text-white p-10 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-50 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 50% 80% at 100% 50%, rgba(212,175,55,0.18), transparent 55%)',
          }} />
          <div className="max-w-lg relative">
            <h2 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl font-extrabold leading-[1.05] mb-5 tracking-tight">
              Descarga la app<br />y empieza hoy.
            </h2>
            <p className="text-zinc-400 text-lg">Crea tu cuenta en menos de 5 minutos. Sin papeleos, sin filas.</p>
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-auto relative">
            <a href="#" className="btn-premium flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full text-sm font-bold min-w-52">
              Descargar en App Store
            </a>
            <a href="#" className="btn-premium flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white rounded-full text-sm font-bold hover:border-white/50 min-w-52">
              Descargar en Google Play
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: 'Personal', links: ['Cuentas', 'Tarjetas', 'Cripto', 'Seguros'] },
    { title: 'Empresas', links: ['Business', 'Nómina', 'Gastos', 'API'] },
    { title: 'Compañía', links: ['Acerca de', 'Blog', 'Prensa', 'Careers'] },
    { title: 'Soporte', links: ['Ayuda', 'Comunidad', 'Estatus', 'Contacto'] },
  ];

  return (
    <footer id="footer" className="bg-zinc-50 border-t border-black/6 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6"><BrandMark /></div>
            <p className="text-zinc-400 text-sm leading-relaxed">Banca digital para el mundo moderno.</p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-black font-semibold text-sm mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-zinc-400 hover:text-black text-sm transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-black/8">
          <p className="text-zinc-400 text-xs">© {new Date().getFullYear()} Jes Bank Ltd. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            {['Privacidad', 'Términos', 'Cookies'].map((l) => (
              <a key={l} href="#" className="text-zinc-400 hover:text-black text-xs transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const router = useRouter();
  const handleEnter = () => router.push('/auth/login');

  return (
    <div className="bg-white text-black">
      <Navbar onEnter={handleEnter} />
      <Hero onStart={handleEnter} />
      <StatsStrip />
      <PhoneSection />
      <FeatureList />
      <ExchangeSection />
      <PlansSection />
      <AppDownload />
      <Footer />
    </div>
  );
}
