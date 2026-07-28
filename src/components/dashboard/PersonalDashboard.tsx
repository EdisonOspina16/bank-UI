'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import { AuthService } from '../../services/auth.service';

const copFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const copFmtFull = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  iconType: string;
  date: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 1, name: 'Rappi',           category: 'Comidas',          amount: -48500,   iconType: 'rappi', date: 'Hoy · 2:14 pm' },
  { id: 2, name: 'Spotify',         category: 'Entretenimiento',  amount: -9900,    iconType: 'spotify', date: 'Hoy · 10:00 am' },
  { id: 3, name: 'Netflix',         category: 'Streaming',        amount: -22900,   iconType: 'netflix', date: 'Ayer · 12:00 am' },
  { id: 4, name: 'Amazon Prime',    category: 'Compras',          amount: -50000,   iconType: 'amazon', date: 'Lun · 8:00 am' },
  { id: 5, name: 'Transferencia',   category: 'Recibido',         amount: 350000,  iconType: 'transfer', date: 'Dom · 3:45 pm' },
];

type View = 'home' | 'prestamos' | 'tarjetas' | 'tmr' | 'simulacion' | 'condiciones' | 'virtual' | 'comprobante';

const Icons = {
  prestamos: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  tarjetas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  tmr: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  simulacion: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="16" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="22" x2="16" y2="16" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <line x1="4" y1="11" x2="20" y2="11" />
    </svg>
  ),
  virtual: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
      <rect x="8" y="6" width="8" height="5" rx="0.5" />
    </svg>
  ),
  condiciones: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  deposit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v13M19 9l-7 7-7-7M5 20h14" />
    </svg>
  ),
  send: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 14-7-7 14-2-7z" />
    </svg>
  ),
  withdraw: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M12 2v9M8 6l4-4 4 4" />
    </svg>
  ),
  chevronRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  chevronDown: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  back: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
};

function getTransactionIcon(type: string) {
  switch (type) {
    case 'rappi':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M21 7.5H3" />
          <path d="M7.5 21V7.5" />
          <path d="M16.5 21V7.5" />
        </svg>
      );
    case 'spotify':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'netflix':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case 'amazon':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'transfer':
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      );
  }
}

interface PersonalDashboardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    docNumber: string;
    docType: string;
  };
  onLogout: () => void;
}

export default function PersonalDashboard({ user, onLogout }: PersonalDashboardProps) {
  const router = useRouter();
  const [view, setView] = useState<View>('home');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [cardBlocked, setCardBlocked] = useState(false);
  const [balanceExpanded, setBalanceExpanded] = useState(false);

  // Modals
  const [showDeposit, setShowDeposit] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const onBack = () => {
    if (view === 'home') {
      onLogout();
    } else {
      setView('home');
    }
  };

  const MENU_CARDS: { id: View; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'prestamos', label: 'Préstamos', desc: 'Respaldo flexible y claro', icon: Icons.prestamos },
    { id: 'tarjetas', label: 'Mi Tarjeta', desc: 'Límites y seguridad', icon: Icons.tarjetas },
    { id: 'tmr', label: 'TMR del día', desc: 'Tasa representativa oficial', icon: Icons.tmr },
    { id: 'virtual', label: 'Tarjeta virtual', desc: 'CVV dinámico seguro', icon: Icons.virtual },
    { id: 'simulacion', label: 'Simulador TRM', desc: 'Calcula compras en dólares', icon: Icons.simulacion },
    { id: 'condiciones', label: 'Condiciones', desc: 'Términos del producto', icon: Icons.condiciones },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans flex flex-col items-center">
      <div className="w-full max-w-xl min-h-screen bg-white md:shadow-md md:border-x md:border-black/6 flex flex-col">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/6 px-6 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 text-black transition-colors cursor-pointer"
            aria-label={view === 'home' ? 'Cerrar sesión' : 'Volver'}
          >
            {Icons.back}
          </button>
          
          <div className="flex-1 flex justify-center">
            {view === 'home' ? (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">JB</span>
                </div>
                <span className="text-black font-bold text-sm tracking-tight">Jes Bank</span>
              </div>
            ) : (
              <h1 className="text-xs font-bold uppercase tracking-wider text-black">
                {view === 'prestamos' && 'Préstamos'}
                {view === 'tarjetas' && 'Tarjetas'}
                {view === 'tmr' && 'TMR del día'}
                {view === 'simulacion' && 'Simulador'}
                {view === 'condiciones' && 'Condiciones'}
                {view === 'virtual' && 'Tarjeta virtual'}
              </h1>
            )}
          </div>
          
          <div className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black cursor-pointer">
            {Icons.bell}
          </div>
        </header>

        {/* View Content Area */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {view === 'home' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="text-left flex justify-between items-center">
                <div>
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Banca Virtual Personas</p>
                  <h1 className="text-2xl font-black tracking-tight text-black mt-0.5">Hola, {user.firstName}</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-black border border-black/5">
                  {user.firstName?.[0] ?? 'U'}{user.lastName?.[0] ?? 'B'}
                </div>
              </div>

              {/* Balance */}
              <div
                onClick={() => setBalanceExpanded(!balanceExpanded)}
                className="rounded-[2rem] bg-white border border-black/8 p-6 shadow-sm cursor-pointer select-none transition-all hover:border-black/20"
              >
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">Saldo disponible</p>
                    <p className="text-4xl font-black text-black tracking-tight">{copFmt.format(8420000)}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-zinc-50 border border-black/5 flex items-center justify-center text-black">
                    {balanceExpanded ? Icons.chevronDown : Icons.chevronRight}
                  </button>
                </div>
                {balanceExpanded && (
                  <div className="pt-4 border-t border-black/5 mt-4 space-y-2.5 animate-fade-in text-left">
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Cuentas Personales</p>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-xs text-zinc-500 font-semibold">Cuenta de Ahorros</span>
                      <span className="text-sm font-bold text-black">{copFmt.format(8420000)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-xs text-zinc-500 font-semibold">Cuenta Digital (USD)</span>
                      <span className="text-sm font-mono font-bold text-black">
                        {usdFmt.format(2050.75)} <span className="text-[10px] font-sans text-zinc-400">USD</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setShowDeposit(true)}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-black/5 bg-zinc-50 hover:bg-zinc-100 text-black transition-all cursor-pointer font-bold text-xs"
                >
                  <span className="text-black">{Icons.deposit}</span>
                  <span className="text-[10px] text-zinc-600">Depositar</span>
                </button>
                <button
                  onClick={() => setShowSend(true)}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-black/5 bg-zinc-50 hover:bg-zinc-100 text-black transition-all cursor-pointer font-bold text-xs"
                >
                  <span className="text-black">{Icons.send}</span>
                  <span className="text-[10px] text-zinc-600">Enviar</span>
                </button>
                <button
                  onClick={() => setShowWithdraw(true)}
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-black/5 bg-zinc-50 hover:bg-zinc-100 text-black transition-all cursor-pointer font-bold text-xs"
                >
                  <span className="text-black">{Icons.withdraw}</span>
                  <span className="text-[10px] text-zinc-600">Retirar</span>
                </button>
              </div>

              {/* Movements */}
              <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-black/5 pb-3">
                  <h2 className="text-sm font-bold text-black">Movimientos Recientes</h2>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Historial</span>
                </div>
                <div className="space-y-1">
                  {TRANSACTIONS.map(tx => (
                    <div
                      key={tx.id}
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setView('comprobante');
                      }}
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group cursor-pointer border border-transparent hover:border-black/5"
                    >
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-black shrink-0 border border-black/5">
                        {getTransactionIcon(tx.iconType)}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold text-black truncate">{tx.name}</p>
                        <p className="text-[9px] text-zinc-400 font-medium">{tx.category} · {tx.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs font-black font-mono ${tx.amount > 0 ? 'text-green-600' : 'text-black'}`}>
                          {tx.amount > 0 ? '+' : ''}{copFmt.format(tx.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discover More */}
              <div className="mt-8 pt-6 border-t border-black/5 text-left space-y-4">
                <div>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">Descubre más</p>
                  <h2 className="text-base font-black text-black leading-tight mt-0.5">Una cuenta. Infinitas posibilidades.</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {MENU_CARDS.map(card => (
                    <button
                      key={card.id}
                      onClick={() => setView(card.id)}
                      className="aspect-square bg-white border border-black/8 rounded-[1.5rem] p-5 flex flex-col justify-between hover:bg-zinc-50 transition-all text-left shadow-sm hover:scale-[1.01] cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-black/5 flex items-center justify-center text-black">
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-black">{card.label}</h3>
                        <p className="text-[9px] text-zinc-400 font-medium leading-snug mt-1">{card.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'prestamos' && <PrestamosInnerView />}
          {view === 'tarjetas' && <TarjetasInnerView cardBlocked={cardBlocked} setCardBlocked={setCardBlocked} />}
          {view === 'tmr' && <TMRSharedView />}
          {view === 'simulacion' && <SimulacionInnerView />}
          {view === 'condiciones' && <CondicionesSharedView />}
          {view === 'virtual' && <VirtualCardInnerView user={user} />}
        </main>
      </div>

      {/* Modals */}
      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
      <SendModal isOpen={showSend} onClose={() => setShowSend(false)} />
      <WithdrawModal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} />
    </div>
  );
}

// ─── SUBVIEWS (INLINED OR MODULAR) ───

function PrestamosInnerView() {
  const [amount, setAmount] = useState(5000000);
  const [months, setMonths] = useState(24);
  const [showAmortization, setShowAmortization] = useState(false);
  const [success, setSuccess] = useState(false);

  const interestRate = 0.015;
  const monthlyPayment = (amount * interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1);
  const totalRepayment = monthlyPayment * months;
  const totalInterest = totalRepayment - amount;

  const handleRequest = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center text-left">
        <div>
          <h2 className="text-lg font-black text-black">Préstamos Personales</h2>
          <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Simula y solicita desembolso inmediato</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <span>✓</span> Desembolso aprobado de inmediato en tu cuenta.
        </div>
      )}

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-6 text-left">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase">Monto a solicitar</label>
            <span className="text-base font-black text-black">{copFmt.format(amount)}</span>
          </div>
          <input
            type="range"
            min="1000000"
            max="50000000"
            step="500000"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2.5">Plazo de pago</label>
          <div className="grid grid-cols-5 gap-1.5">
            {[12, 24, 36, 48, 60].map(m => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`py-2 text-[10px] font-bold rounded-xl transition-all border ${months === m ? 'bg-black text-white' : 'bg-zinc-50 border-black/5'}`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-4 text-left">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase">Proyección de Cuotas</h3>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-zinc-400">Cuota mensual estimada</p>
            <p className="text-2xl font-black text-black mt-0.5">{copFmtFull.format(monthlyPayment)}</p>
          </div>
          <div className="text-xs space-y-1.5 border-t border-black/5 pt-3">
            <div className="flex justify-between">
              <span>Monto base</span>
              <span className="font-bold">{copFmt.format(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Plazo</span>
              <span className="font-bold">{months} meses</span>
            </div>
            <div className="flex justify-between">
              <span>Total intereses</span>
              <span className="font-bold">{copFmtFull.format(totalInterest)}</span>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-2 font-black">
              <span>Total a pagar</span>
              <span>{copFmtFull.format(totalRepayment)}</span>
            </div>
          </div>
          <button
            onClick={handleRequest}
            className="w-full py-3.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold mt-2"
          >
            Solicitar Desembolso
          </button>
        </div>
      </div>
    </div>
  );
}

function TarjetasInnerView({ cardBlocked, setCardBlocked }: { cardBlocked: boolean; setCardBlocked: (b: boolean) => void }) {
  const [limit, setLimit] = useState(2500000);
  return (
    <div className="space-y-6 text-black text-left">
      <div>
        <h2 className="text-lg font-black">Tarjeta de Crédito</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">Configura los límites de tu plástico físico</p>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider">Tarjeta Física</span>
          <span className="text-[9px] text-zinc-400">Estado: {cardBlocked ? 'Bloqueada' : 'Activa'}</span>
        </div>

        {/* Card View Mockup */}
        <div className="bg-gradient-to-br from-zinc-900 to-black text-white rounded-3xl p-6 aspect-[1.586/1] flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-widest">JES PLATINUM</span>
            <span className="text-[10px] font-bold opacity-60">VISA</span>
          </div>
          <div className="my-4">
            <p className="text-lg font-mono tracking-[0.2em]">{cardBlocked ? '••••  ••••  ••••  ••••' : '••••  ••••  ••••  3902'}</p>
          </div>
          <div className="flex justify-between text-xs">
            <div>
              <p className="text-[7px] uppercase opacity-40">Titular</p>
              <p className="font-semibold">SARA QUINTERO</p>
            </div>
            <div>
              <p className="text-[7px] uppercase opacity-40">Vence</p>
              <p className="font-semibold">12/28</p>
            </div>
          </div>
        </div>

        {/* Temporal block switch */}
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold">Bloqueo Temporal de Tarjeta</p>
            <p className="text-[9px] text-zinc-400">Desactívala al instante si no sabes dónde está</p>
          </div>
          <button
            onClick={() => setCardBlocked(!cardBlocked)}
            className={`w-12 h-6 rounded-full p-1 transition-all ${cardBlocked ? 'bg-black' : 'bg-zinc-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-all ${cardBlocked ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-zinc-700">Límite Diario de Compras</label>
          <span className="text-xs font-black">{copFmt.format(limit)}</span>
        </div>
        <input
          type="range"
          min="500000"
          max="10000000"
          step="100000"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="w-full h-1 bg-zinc-200 rounded-lg appearance-none accent-black cursor-pointer"
        />
      </div>
    </div>
  );
}

function SimulacionInnerView() {
  const { rateData, fetchRate } = useExchangeRate();
  const [usd, setUsd] = useState('100');
  const [cop, setCop] = useState('');

  useState(() => { fetchRate(); });
  const rate = rateData?.rate || 4032.50;

  const handleUsdChange = (val: string) => {
    setUsd(val);
    const num = parseFloat(val);
    if (!isNaN(num)) setCop((num * rate).toFixed(0));
    else setCop('');
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-lg font-black text-black">Simulador de Compras en Dólares</h2>
        <p className="text-[11px] text-zinc-400 font-medium">Calcula tus compras internacionales a la TRM actual</p>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-[8px] text-zinc-400 font-bold uppercase">Monto en USD</label>
          <input
            type="number"
            value={usd}
            onChange={e => handleUsdChange(e.target.value)}
            className="w-full p-3 bg-zinc-50 border border-black/5 rounded-xl text-base font-black text-black mt-1 outline-none"
          />
        </div>
        <div>
          <label className="block text-[8px] text-zinc-400 font-bold uppercase">Equivalente estimado en COP</label>
          <input
            type="text"
            disabled
            value={copFmtFull.format(parseFloat(cop) || (parseFloat(usd) * rate))}
            className="w-full p-3 bg-zinc-100 border border-black/5 rounded-xl text-base font-black text-zinc-500 mt-1"
          />
        </div>
        <p className="text-[9px] text-zinc-400 leading-normal">
          Basado en TRM del día: {copFmtFull.format(rate)} COP. No incluye IVA ni comisiones bancarias internacionales.
        </p>
      </div>
    </div>
  );
}

function VirtualCardInnerView({ user }: { user: any }) {
  const [cvv, setCvv] = useState('482');
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-lg font-black">Tarjeta Virtual</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">Seguridad mejorada con CVV dinámico para e-commerce</p>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm flex flex-col items-center">
        <div className="relative w-full aspect-[1.586/1] rounded-3xl border-2 border-black bg-zinc-50 flex flex-col justify-between p-5 shadow-md">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-zinc-400 font-bold tracking-widest">TARJETA VIRTUAL</span>
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border border-black/10 bg-white">DIGITAL</span>
          </div>
          <div>
            <p className="text-sm font-mono tracking-wider mb-2">4821 7381 2940 1827</p>
            <div className="flex justify-between text-[9px]">
              <div>
                <p className="text-[7px] text-zinc-400">Titular</p>
                <p className="font-bold">{(user.firstName ?? 'Usuario').toUpperCase()} {(user.lastName ?? 'Banco').toUpperCase()}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-[7px] text-zinc-400">Vence</p>
                  <p className="font-bold">09/29</p>
                </div>
                <div>
                  <p className="text-[7px] text-zinc-400">CVV</p>
                  <p className="font-mono font-black">{cvv}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED VIEW COMPONENTS ───

function TMRSharedView() {
  const { rateData, loading, fetchRate } = useExchangeRate();
  useState(() => { fetchRate(); });
  const rate = rateData?.rate || 4032.50;

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-lg font-black text-black">TRM del Día</h2>
        <p className="text-[11px] text-zinc-400 font-medium">Indicador oficial para liquidación de divisas</p>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm text-center space-y-4">
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Tasa Representativa del Mercado</span>
        <p className="text-4xl font-black text-black">{copFmtFull.format(rate)} <span className="text-xs text-zinc-400 font-bold">COP</span></p>
        <button
          onClick={() => fetchRate()}
          disabled={loading}
          className="px-4 py-2 text-xs font-bold rounded-xl border border-black/10 hover:bg-zinc-50 transition-all"
        >
          {loading ? 'Cargando...' : 'Actualizar TRM'}
        </button>
      </div>
    </div>
  );
}

function CondicionesSharedView() {
  return (
    <div className="bg-white border border-black/8 rounded-[2rem] p-6 shadow-sm text-left text-black space-y-4">
      <div>
        <h2 className="text-base font-black">Condiciones de Uso</h2>
        <p className="text-[10px] text-zinc-400 font-semibold">Términos del portal de simulación Jes Bank</p>
      </div>
      <div className="h-px bg-black/5" />
      <div className="space-y-4 text-xs text-zinc-600 leading-relaxed font-semibold">
        <section className="space-y-1">
          <h3 className="text-xs font-bold text-black uppercase">1. Tasas y Simulaciones</h3>
          <p>Las simulaciones corresponden a valores de mercado referenciales fijadas en 1.5% nominal mensual.</p>
        </section>
        <section className="space-y-1">
          <h3 className="text-xs font-bold text-black uppercase">2. Transacciones</h3>
          <p>Las transacciones y conversiones internacionales se liquidan usando la TRM provista de forma oficial.</p>
        </section>
      </div>
    </div>
  );
}

// ─── MODAL COMPONENTS (SHARED) ───

function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/8 rounded-[2rem] p-6 max-w-sm w-full shadow-lg text-black space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Depositar dinero</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-black text-xs font-bold">✕</button>
        </div>
        <p className="text-xs text-zinc-500 font-semibold leading-relaxed">Transfiere a tu cuenta Jes Bank desde cualquier banco usando estos datos:</p>
        <div className="bg-zinc-50 border border-black/5 rounded-2xl p-4 space-y-2 text-xs font-semibold">
          <div className="flex justify-between"><span>Banco:</span><span className="font-bold">Jes Bank</span></div>
          <div className="flex justify-between"><span>Tipo:</span><span className="font-bold">Ahorros</span></div>
          <div className="flex justify-between"><span>Número:</span><span className="font-bold font-mono">4821 9302 4821</span></div>
        </div>
        <button onClick={onClose} className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors">Entendido</button>
      </div>
    </div>
  );
}

function SendModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setPhone('');
      setAmount('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/8 rounded-[2rem] p-6 max-w-sm w-full shadow-lg text-black space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Enviar dinero</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-black text-xs font-bold">✕</button>
        </div>
        {success ? (
          <div className="flex flex-col items-center py-4 space-y-2">
            <span className="text-2xl">✓</span>
            <p className="text-sm font-bold">¡Envío Exitoso!</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <input
              type="tel" required placeholder="Número de celular" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-black/8 rounded-xl text-xs outline-none"
            />
            <input
              type="number" required placeholder="Monto COP" value={amount} onChange={e => setAmount(e.target.value)}
              className="w-full p-3 bg-zinc-50 border border-black/8 rounded-xl text-xs outline-none"
            />
            <button type="submit" className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800">Confirmar Envío</button>
          </form>
        )}
      </div>
    </div>
  );
}

function WithdrawModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [code, setCode] = useState('');
  if (!isOpen) return null;

  const handleGenerate = () => {
    setCode(Math.floor(100000 + Math.random() * 900000).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/8 rounded-[2rem] p-6 max-w-sm w-full shadow-lg text-black space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Retirar sin tarjeta</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-black text-xs font-bold">✕</button>
        </div>
        <p className="text-xs text-zinc-500 font-semibold leading-relaxed">Genera un código temporal para cajeros Jes Bank:</p>
        {code ? (
          <div className="bg-zinc-50 border border-black/5 rounded-xl p-4 text-center">
            <span className="text-[10px] text-zinc-400 font-bold block mb-1">CÓDIGO TEMPORAL</span>
            <p className="text-2xl font-black font-mono tracking-widest text-black">{code}</p>
          </div>
        ) : (
          <button onClick={handleGenerate} className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800">Generar código</button>
        )}
      </div>
    </div>
  );
}
export { TMRSharedView, CondicionesSharedView };
