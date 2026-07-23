'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExchangeRate } from '../../hooks/useExchangeRate';

// Developer-adjustable commission and tax rates
const INTERNATIONAL_COMMISSION = 0.0; // e.g. 0.0 = 0%
const IVA_RATE = 0.0; // e.g. 0.0 = 0%

export default function InternationalPurchaseSimulator() {
  const router = useRouter();
  const { rateData, loading, error, fetchRate } = useExchangeRate();
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value);
    if (validationError) setValidationError(null);
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessBanner(false);

    const val = Number.parseFloat(usdAmount);
    if (Number.isNaN(val) || val <= 0) {
      setValidationError('Por favor ingresa un monto válido mayor a 0 dólares.');
      return;
    }

    const data = await fetchRate();
    if (data) {
      setShowResults(true);
      setSuccessBanner(true);
      // Auto dismiss success banner after 4 seconds
      setTimeout(() => {
        setSuccessBanner(false);
      }, 4000);
    }
  };

  const handleReset = () => {
    setUsdAmount('');
    setShowResults(false);
    setValidationError(null);
    setSuccessBanner(false);
  };

  // Computations
  const parsedUsd = Number.parseFloat(usdAmount) || 0;
  const rate = rateData?.rate || 0;
  
  // Commission calculation
  const subtotalCop = parsedUsd * rate;
  const commissionCop = subtotalCop * INTERNATIONAL_COMMISSION;
  const ivaCop = (subtotalCop + commissionCop) * IVA_RATE;
  const totalDebitCop = subtotalCop + commissionCop + ivaCop;

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden flex flex-col font-sans">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="relative z-10 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Salir a Inicio
          </button>
          
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-black font-black text-[10px]">JB</span>
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Banca Virtual</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
            S
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center">
        
        {/* Error Alert */}
        {error && (
          <div className="w-full max-w-lg mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-fade-in flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-400">Error de comunicación</h4>
              <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Success Toast Banner */}
        {successBanner && rateData && (
          <div className="w-full max-w-lg mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-fade-in flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">
              ✓
            </div>
            <span className="text-sm font-semibold text-emerald-400">TRM actualizada en vivo</span>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-8 w-full">
          
          {/* Card Left: Inputs & credit card visual */}
          <div className="md:col-span-6 flex flex-col gap-6">
            
            {/* Credit Card mockup for realism */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 p-6 shadow-xl aspect-[1.586/1] flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all" />
              <div className="flex justify-between items-start z-10">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Tarjeta Internacional</p>
                  <p className="text-xs font-semibold text-white/80 mt-1">Jes Platinum</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
              </div>
              <div className="z-10">
                <p className="text-sm font-mono text-zinc-400 tracking-wider">••••  ••••  ••••  3902</p>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[8px] text-zinc-600 uppercase font-semibold">Titular</p>
                    <p className="text-[10px] text-zinc-400 font-semibold tracking-wide">SARA QUINTERO</p>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-5 h-5 rounded-full bg-rose-500/70" />
                    <div className="w-5 h-5 rounded-full bg-amber-500/70 -ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Principal Simulator Input Card */}
            <div className="rounded-[2rem] border border-white/10 bg-zinc-900/40 backdrop-blur-md p-6 shadow-md">
              <h2 className="text-xl font-black mb-1">Compra internacional</h2>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Simula el valor final de tu compra en pesos colombianos con la TRM oficial de hoy.
              </p>

              <form onSubmit={handleConsult} className="space-y-4">
                <div className="rounded-2xl bg-white/5 border border-white/5 p-4 focus-within:border-white/15 transition-all">
                  <label htmlFor="usd-amount-input" className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Monto en USD</label>
                  <div className="flex items-center justify-between">
                    <input
                      id="usd-amount-input"
                      type="number"
                      step="any"
                      placeholder="100.00"
                      value={usdAmount}
                      onChange={handleInputChange}
                      className="text-3xl font-black bg-transparent outline-none w-2/3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                      <span className="text-base select-none">🇺🇸</span>
                      <span className="text-sm font-bold">USD</span>
                    </div>
                  </div>
                </div>

                {validationError && (
                  <p className="text-xs text-rose-400 font-medium px-1 animate-fade-in">{validationError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-white text-black hover:bg-zinc-100 text-sm font-extrabold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
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
                    'Consultar TRM'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Card Right: Results & invoice details */}
          <div className="md:col-span-6 flex flex-col justify-between">
            {loading ? (
              // Loading Skeleton
              <div className="rounded-[2rem] border border-white/5 bg-zinc-900/20 p-6 flex-1 space-y-6 animate-pulse-custom flex flex-col justify-between min-h-[380px]">
                <div className="space-y-4">
                  <div className="h-6 w-1/3 bg-white/10 rounded-lg" />
                  <div className="h-10 w-2/3 bg-white/10 rounded-lg" />
                  <div className="h-8 w-1/2 bg-white/10 rounded-lg" />
                </div>
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
              </div>
            ) : showResults && rateData ? (
              // Result Card
              <div className="rounded-[2rem] border border-white/10 bg-zinc-900/30 backdrop-blur-md p-6 flex flex-col justify-between flex-1 shadow-lg animate-fade-in min-h-[380px]">
                
                {/* Result header summary */}
                <div>
                  <div className="flex justify-between items-center text-xs text-zinc-400 mb-3">
                    <span>TASA DE CAMBIO VIGENTE</span>
                    <span>{rateData.source}</span>
                  </div>
                  
                  {/* TRM of the day */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-zinc-500 font-semibold">1 USD =</span>
                    <span className="text-3xl font-black text-white">{copFormatter.format(rateData.rate)}</span>
                  </div>
                  
                  {/* Update date */}
                  <p className="text-[10px] text-zinc-500 font-mono mt-1">Actualizado el: {rateData.date}</p>

                  {/* Flow diagram: USD -> COP */}
                  <div className="mt-4 rounded-xl bg-zinc-900/60 border border-white/5 p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <div>
                        <p className="text-[8px] text-zinc-500 font-bold uppercase">Monto</p>
                        <p className="text-xs font-black">{usdFormatter.format(parsedUsd)}</p>
                      </div>
                    </div>
                    <div className="text-zinc-500 text-sm animate-pulse-custom">↓</div>
                    <div className="flex items-center gap-2 text-right">
                      <div className="text-right">
                        <p className="text-[8px] text-zinc-500 font-bold uppercase">Pesos</p>
                        <p className="text-xs font-black text-emerald-400">{copFormatter.format(subtotalCop)}</p>
                      </div>
                      <span className="text-lg">🇨🇴</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Invoice details */}
                <div className="border-t border-white/5 pt-4 mt-6">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 mb-3">Resumen de liquidación</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Monto base</span>
                      <span className="text-zinc-300 font-mono font-medium">{usdFormatter.format(parsedUsd)} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">TRM aplicada</span>
                      <span className="text-zinc-300 font-mono">{copFormatter.format(rate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Comisión internacional ({INTERNATIONAL_COMMISSION * 100}%)</span>
                      <span className="text-zinc-300 font-mono">{copFormatter.format(commissionCop)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">IVA ({IVA_RATE * 100}%)</span>
                      <span className="text-zinc-300 font-mono">{copFormatter.format(ivaCop)}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                      <span className="text-sm font-bold text-white">Total debitado</span>
                      <span className="text-base font-black text-emerald-400 font-mono">{copFormatter.format(totalDebitCop)}</span>
                    </div>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  onClick={handleReset}
                  className="w-full mt-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all duration-200 border border-white/5 cursor-pointer"
                >
                  Simular otra compra
                </button>
              </div>
            ) : (
              // Empty State
              <div className="rounded-[2rem] border border-white/5 bg-zinc-900/10 p-8 flex flex-col items-center justify-center flex-1 text-center min-h-[380px] shadow-sm">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-zinc-400">Listo para simular</h3>
                <p className="text-xs text-zinc-500 max-w-xs mt-2 leading-relaxed">
                  Ingresa el monto de tu compra en dólares a la izquierda y presiona "Consultar TRM" para calcular el desglose bancario.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Legal Disclaimer */}
      <footer className="relative z-10 border-t border-white/5 bg-zinc-950 py-8 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            La TRM mostrada corresponde a la tasa de cambio vigente obtenida desde DolarAPI. El valor final aplicado por la entidad financiera puede variar según la franquicia de la tarjeta (Visa/Mastercard), la fecha de procesamiento y las políticas del banco.
          </p>
          <p className="text-[9px] text-zinc-700 mt-4">
            © 2026 Jes Bank Ltd. Simulación bancaria con fines académicos.
          </p>
        </div>
      </footer>
    </div>
  );
}
