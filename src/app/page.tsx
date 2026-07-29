'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExchangeRate } from '../hooks/useExchangeRate';

const NAV_LINKS = ['Personal', 'Empresas', 'Blog', 'Ayuda'];

const FEATURES = [
  {
    title: 'PRESTAMOS',
    desc: 'Obtén el respaldo que necesitas con opciones claras, flexibles y pensadas para tus proyectos.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=85',
    href: '/info-prestamos',
  },
  {
    title: 'TARJETAS DE CRÉDITO',
    desc: 'Compra lo que necesitas con una tarjeta diseñada para acompañar tu día a día.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'TRM DEL DÍA SI COMPRO EN DÓLARES',
    desc: 'Consulta el tipo de cambio del día y conoce cuánto pagarás cuando compres en dólares.',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'TARJETA DE CRÉDITO CONDICIONES ESPECÍFICAS',
    desc: 'Encuentra una opción que se ajuste a tus necesidades, con condiciones transparentes desde el inicio.',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=85',
  },
  {
    title: 'TARJETA VIRTUAL COMO SE REPRESENTA',
    desc: 'Visualiza y administra tu tarjeta virtual desde la app para comprar de forma rápida y segura.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=85',
  },
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

function Navbar({ onEnter }: { readonly onEnter: () => void }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-black text-xs">JB</span>
          </div>
          <span className="text-black font-bold text-lg tracking-tight">Jes Bank</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="text-sm text-zinc-500 hover:text-black transition-colors font-medium">
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              aria-expanded={accountOpen}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors font-medium"
            >
              Sucursal Virtual
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-9 w-44 rounded-xl border border-black/10 bg-white p-2 shadow-lg z-50">
                <button
                  onClick={onEnter}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black"
                >
                  Personas
                </button>
                <button
                  onClick={onEnter}
                  className="w-full text-left rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-black"
                >
                  Empresas
                </button>
              </div>
            )}
          </div>
          <button onClick={onEnter} className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors">
            Entrar
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-black">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-white px-6 py-5 space-y-4">
          {NAV_LINKS.map(l => (
            <a key={l} href="#" className="block text-sm text-zinc-600 hover:text-black font-medium py-1">{l}</a>
          ))}
          <div className="border-t border-black/5 pt-4">
            <p className="text-sm font-semibold text-black mb-2">Personas y empresas</p>
            <div className="space-y-2 pl-3">
              <button onClick={onEnter} className="block text-sm text-zinc-600 hover:text-black text-left w-full">Personas</button>
              <button onClick={onEnter} className="block text-sm text-zinc-600 hover:text-black text-left w-full">Empresas</button>
            </div>
          </div>
          <button onClick={onEnter} className="block w-full text-center py-3 bg-black text-white text-sm font-semibold rounded-full mt-4">
            Entrar
          </button>
        </div>
      )}
    </nav>
  );
}

function Hero({ onStart }: { readonly onStart: () => void }) {
  return (
    <section className="pt-32 pb-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-8">
            Banca digital · Colombia
          </p>
          <h1 className="text-6xl lg:text-8xl font-black text-black leading-none tracking-tight mb-8">
            El dinero,<br />sin límites.
          </h1>
          <p className="text-xl text-zinc-500 leading-relaxed max-w-xl mb-12">
            Abre una cuenta en minutos. Paga, envía y cambia dinero en cualquier parte del mundo, sin comisiones ocultas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onStart} className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </button>
            <button onClick={onStart} className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 border border-black/15 text-black text-sm font-semibold rounded-full hover:border-black/40 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76a2 2 0 01-.69-1.54V1.77a2 2 0 01.69-1.53l.08-.07 12.45 12.44v.29L3.26 23.84zM20.3 16.1l-4.12-4.12 4.12-4.12 3.4 1.93a2 2 0 010 3.51zM3.18.24L15.62 12.7l-4.12 4.12L3.18.24z" />
              </svg>
              Google Play
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-24 pt-10 border-t border-black/8 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { n: '50M+', l: 'Clientes en el mundo' },
            { n: '36+', l: 'Divisas disponibles' },
            { n: '$0', l: 'Comisión por transferencia' },
            { n: '4.9★', l: 'Valoración App Store' },
          ].map(s => (
            <div key={s.n}>
              <p className="text-3xl font-black text-black mb-1">{s.n}</p>
              <p className="text-sm text-zinc-400">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhoneSection() {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        {/* Phone mockup */}
        <div className="flex justify-center order-2 lg:order-1">
          <div className="relative w-64 h-[520px] bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-black">
            {/* Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20" />

            <div className="h-full bg-white pt-14 p-5 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-zinc-400">Buenos días, Sara</p>
                  <p className="text-2xl font-black text-black mt-0.5">$8.420.000</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-black">S</div>
              </div>

              {/* Card */}
              <div className="rounded-2xl h-36 mb-5 relative overflow-hidden bg-black flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <div className="w-5 h-5 rounded-sm bg-white/20" />
                  <div className="w-6 h-4 rounded border border-white/30" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-mono tracking-widest mb-1">•••• 4821</p>
                  <p className="text-white/70 text-xs">SARA QUINTERO</p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {[{ l: 'Enviar', i: '↑' }, { l: 'Recibir', i: '↓' }, { l: 'Cambio', i: '⇄' }, { l: 'Más', i: '⋯' }].map(a => (
                  <div key={a.l} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-sm text-black">{a.i}</div>
                    <span className="text-xs text-zinc-400">{a.l}</span>
                  </div>
                ))}
              </div>

              {/* Transactions */}
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Recientes</p>
              <div className="space-y-3 flex-1">
                {[
                  { name: 'Rappi', amt: '-$48.500', bg: 'bg-orange-100', fg: 'text-orange-600' },
                  { name: 'Spotify', amt: '-$9.900', bg: 'bg-green-100', fg: 'text-green-600' },
                  { name: 'Transferencia', amt: '+$200.000', bg: 'bg-blue-100', fg: 'text-blue-600' },
                ].map(tx => (
                  <div key={tx.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${tx.bg} flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${tx.fg}`}>{tx.name[0]}</span>
                      </div>
                      <span className="text-xs font-medium text-black">{tx.name}</span>
                    </div>
                    <span className={`text-xs font-semibold ${tx.amt.startsWith('+') ? 'text-green-600' : 'text-black'}`}>
                      {tx.amt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">Tu dinero, claro</p>
          <h2 className="text-4xl lg:text-5xl font-black text-black leading-tight mb-6">
            Todo tu dinero<br />en una sola app
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed mb-10">
            Consulta tu saldo, analiza tus gastos, envía dinero y gestiona tus tarjetas — todo desde la palma de tu mano, en tiempo real.
          </p>
          <ul className="space-y-4">
            {[
              'Notificaciones instantáneas en cada gasto',
              'Control total: bloquea tu tarjeta con un toque',
              'Análisis de gastos por categorías automático',
              'Historial completo de transacciones',
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-sm text-zinc-600">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeatureList() {
  const router = useRouter();

  return (
    <section className="py-24 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Lo que puedes hacer</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Una cuenta.<br />Infinitas posibilidades.
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(f => {
            const clickable = Boolean(f.href);

            return (
              <article
                key={f.title}
                onClick={clickable ? () => router.push(f.href!) : undefined}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={
                  clickable
                    ? e => {
                        if (e.key === 'Enter' || e.key === ' ') router.push(f.href!);
                      }
                    : undefined
                }
                className={`overflow-hidden rounded-[2rem] bg-zinc-900 flex flex-col transition-transform duration-300 ${
                  clickable ? 'cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/40' : ''
                }`}
              >
                <div className="h-48 overflow-hidden bg-zinc-800">
                  <img
                    src={f.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black leading-tight text-white">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500">{f.desc}</p>
                  </div>
                  {clickable && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                      Conocer más
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExchangeSection() {
  const router = useRouter();
  const { rateData, loading, error, fetchRate } = useExchangeRate();
  const [usdAmount, setUsdAmount] = useState<string>('100');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [calculated, setCalculated] = useState(false);

  const copFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const val = Number.parseFloat(usdAmount);
    if (Number.isNaN(val) || val <= 0) {
      setValidationError('El monto en USD debe ser mayor a cero.');
      return;
    }

    const data = await fetchRate();
    if (data) {
      setCalculated(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value);
    if (validationError) setValidationError(null);
  };

  const handleOpenVirtualBank = () => {
    router.push('/login');
  };

  const parsedUsd = Number.parseFloat(usdAmount) || 0;
  const convertedCop = rateData ? parsedUsd * rateData.rate : 0;

  return (
    <section className="py-24 px-6 bg-black text-white border-t border-white/5">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">Simulador Rápido</p>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
            Compra en dólares<br />sin sorpresas.
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            Consulta la TRM del día y conoce cuánto pagarías por una compra internacional antes de utilizar tu tarjeta.
          </p>
          <button
            onClick={handleOpenVirtualBank}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white border-b border-white/30 pb-0.5 hover:border-white transition-colors cursor-pointer"
          >
            Abrir banca virtual →
          </button>
        </div>

        {/* Exchange widget (Revolut-like) */}
        <div className="rounded-3xl border border-white/10 p-8 relative overflow-hidden bg-zinc-950/80 backdrop-blur-md shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Simulador de compra express</span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              En tiempo real
            </span>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4 mb-6">
            {/* Input USD */}
            <div className="rounded-2xl bg-white/5 border border-white/8 p-4 focus-within:border-white/20 transition-all">
              <label htmlFor="landing-usd" className="block text-xs text-zinc-500 mb-1 font-medium">Monto a simular</label>
              <div className="flex items-center justify-between">
                <input
                  id="landing-usd"
                  type="number"
                  step="any"
                  value={usdAmount}
                  onChange={handleInputChange}
                  placeholder="100"
                  className="text-3xl font-black text-white bg-transparent outline-none w-2/3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors border border-white/5">
                  <span className="text-base select-none">🇺🇸</span>
                  <span className="text-sm font-bold tracking-tight">USD</span>
                </div>
              </div>
            </div>

            {validationError && (
              <p className="text-xs text-rose-400 font-semibold px-2 animate-fade-in">{validationError}</p>
            )}

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium animate-fade-in flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black hover:bg-zinc-100 text-sm font-extrabold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin-custom h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Consultando TRM...</span>
                </>
              ) : (
                'Calcular'
              )}
            </button>
          </form>

          {/* Results section */}
          {calculated && rateData && !loading && !error && (
            <div className="space-y-4 border-t border-white/10 pt-5 animate-fade-in">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">TRM Oficial</span>
                <span className="text-zinc-200 font-mono font-bold">1 USD = {copFormatter.format(rateData.rate)}</span>
              </div>

              {/* Conversion Display */}
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

          {/* Open full simulator button */}
          <button
            onClick={handleOpenVirtualBank}
            className="w-full mt-4 py-3.5 rounded-2xl border border-white/10 text-white hover:bg-white/5 text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-zinc-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Abrir banca virtual
          </button>
        </div>
      </div>
    </section>
  );
}

function PlansSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Planes</p>
          <h2 className="text-4xl lg:text-5xl font-black text-black leading-tight">
            Empieza gratis.<br />Escala cuando quieras.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-black/8 rounded-2xl overflow-hidden border border-black/8">
          {PLANS.map(plan => (
            <div key={plan.name}
              className={`p-8 flex flex-col ${plan.highlight ? 'bg-black text-white' : 'bg-white text-black'}`}>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-zinc-400">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.per && <span className="text-sm text-zinc-400">{plan.per}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    <span className={`mt-0.5 flex-shrink-0 font-bold ${plan.highlight ? 'text-white' : 'text-black'}`}>—</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  plan.highlight
                    ? 'bg-white text-black hover:bg-zinc-100'
                    : 'border border-black/15 text-black hover:border-black hover:bg-black hover:text-white'
                }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppDownload() {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-black text-white p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-5">
              Descarga la app<br />y empieza hoy.
            </h2>
            <p className="text-zinc-400 text-lg">
              Crea tu cuenta en menos de 5 minutos. Sin papeleos, sin filas.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <a href="#" className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors min-w-52">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Descargar en App Store
            </a>
            <a href="#" className="flex items-center justify-center gap-3 px-8 py-4 border border-white/20 text-white rounded-full text-sm font-bold hover:border-white/50 transition-colors min-w-52">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76a2 2 0 01-.69-1.54V1.77a2 2 0 01.69-1.53l.08-.07 12.45 12.44v.29L3.26 23.84zM20.3 16.1l-4.12-4.12 4.12-4.12 3.4 1.93a2 2 0 010 3.51zM3.18.24L15.62 12.7l-4.12 4.12L3.18.24z" />
              </svg>
              Descargar en Google Play
            </a>
          </div>
        </div>
      </div>
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
    <footer className="bg-white border-t border-black/8 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-6">
              <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
                <span className="text-white font-black text-xs">R</span>
              </div>
              <span className="text-black font-bold text-lg">Jes Bank</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Banca digital para el mundo moderno.
            </p>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-black font-semibold text-sm mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-zinc-400 hover:text-black text-sm transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-black/8">
          <p className="text-zinc-400 text-xs">© 2024 Jes Bank Ltd. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            {['Privacidad', 'Términos', 'Cookies'].map(l => (
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

  const handleEnter = () => {
    router.push('/login');
  };

  return (
    <div className="bg-white">
      <Navbar onEnter={handleEnter} />
      <Hero onStart={handleEnter} />
      <PhoneSection />
      <FeatureList />
      <ExchangeSection />
      <PlansSection />
      <AppDownload />
      <Footer />
    </div>
  );
}
