'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExchangeRate } from '../../hooks/useExchangeRate';
import TarjetasCredito from './TarjetasCredito';
import TarjetasVirtuales from './TarjetasVirtuales';
import ProfileComponent from './profile';
import NotificationsComponent from './notifications';

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

interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  iconType: string;
  date: string;
}

const TRANSACTIONS: Transaction[] = [
  { id: 1, name: 'Rappi',           category: 'Comidas',          amount: -48_500,   iconType: 'rappi', date: 'Hoy · 2:14 pm' },
  { id: 2, name: 'Spotify',         category: 'Entretenimiento',  amount: -9_900,    iconType: 'spotify', date: 'Hoy · 10:00 am' },
  { id: 3, name: 'Netflix',         category: 'Streaming',        amount: -22_900,   iconType: 'netflix', date: 'Ayer · 12:00 am' },
  { id: 4, name: 'Amazon Prime',    category: 'Compras',          amount: -50_000,   iconType: 'amazon', date: 'Lun · 8:00 am' },
  { id: 5, name: 'Transferencia',   category: 'Recibido',         amount: +350_000,  iconType: 'transfer', date: 'Dom · 3:45 pm' },
];

type View = 'home' | 'prestamos' | 'tarjetas' | 'tmr' | 'simulacion' | 'condiciones' | 'virtual' | 'comprobante';

const copFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const copFmtFull = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

// ─── SVG Icons collection (Nu Bank inspired monochrome style) ────────────────

const Icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
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
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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

// ─── MODAL COMPONENTS ─────────────────────────────────────────────────────────

function DepositModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/8 rounded-[2rem] p-6 max-w-sm w-full shadow-lg text-black space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Depositar dinero</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-black transition-colors font-bold text-xs cursor-pointer">
            ✕
          </button>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
          Puedes transferir a tu cuenta Jes Bank desde cualquier banco en Colombia usando los siguientes datos:
        </p>
        <div className="bg-zinc-50 border border-black/5 rounded-2xl p-4 space-y-2 text-xs font-semibold">
          <div className="flex justify-between">
            <span className="text-zinc-400">Banco:</span>
            <span className="font-bold text-black">Jes Bank</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Tipo de cuenta:</span>
            <span className="font-bold text-black">Ahorros</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Número de cuenta:</span>
            <span className="font-bold text-black font-mono">4821 9302 4821</span>
          </div>
        </div>
        <div className="flex flex-col items-center py-2">
          {/* Mock QR */}
          <div className="grid grid-cols-5 gap-1.5 p-3.5 bg-white border border-black/8 rounded-xl shadow-sm">
            {[...Array(25)].map((_, i) => (
              <div key={i} className={`w-3.5 h-3.5 ${((i + 3) % 4 === 0 || (i % 3 === 0 && i > 5)) ? 'bg-black' : 'bg-transparent'}`} />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400 mt-2.5 font-bold uppercase tracking-wider">Tu código QR</span>
        </div>
        <button onClick={onClose} className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
          Entendido
        </button>
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
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/8 rounded-[2rem] p-6 max-w-sm w-full shadow-lg text-black space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Enviar dinero</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-black transition-colors font-bold text-xs cursor-pointer">
            ✕
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-black font-black text-lg">
              {Icons.check}
            </div>
            <p className="text-sm font-bold text-black">¡Envío Exitoso!</p>
            <p className="text-xs text-zinc-400 text-center font-semibold">El dinero ha sido debitado y enviado con éxito.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Número de Celular</label>
              <input
                type="tel"
                required
                placeholder="300 123 4567"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-3 bg-zinc-50 border border-black/8 rounded-xl outline-none focus:border-black/30 text-xs font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Monto a Enviar (COP)</label>
              <input
                type="number"
                required
                placeholder="Ej. 50000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-3 bg-zinc-50 border border-black/8 rounded-xl outline-none focus:border-black/30 text-xs font-semibold"
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer mt-2">
              Confirmar Envío
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function WithdrawModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1 $2');
      setCode(generated);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/8 rounded-[2rem] p-6 max-w-sm w-full shadow-lg text-black space-y-4 animate-fade-in">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Retirar sin tarjeta</h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-black transition-colors font-bold text-xs cursor-pointer">
            ✕
          </button>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
          Genera un código temporal para retirar dinero en efectivo en cualquier cajero electrónico Jes Bank.
        </p>

        {code ? (
          <div className="bg-zinc-50 border border-black/5 rounded-xl p-4 text-center space-y-3">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Código de retiro</span>
            <p className="text-2xl font-black font-mono tracking-widest text-black">{code}</p>
            <p className="text-[10px] text-zinc-400 font-semibold">Vence en 30 minutos</p>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Generando código...' : 'Generar código de retiro'}
          </button>
        )}

        <button onClick={onClose} className="w-full py-3 border border-black/15 text-black hover:border-black/30 text-xs font-bold rounded-xl transition-colors cursor-pointer">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────────

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
            className="absolute inset-0 rounded-[2rem] overflow-hidden flex flex-col justify-between p-6 shadow-xl border border-white/10"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Matte Black / Silver premium theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-zinc-500/10 blur-xl" />
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
                {/* Silver Chip */}
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-zinc-300 to-zinc-500 flex items-center justify-center shadow-inner">
                  <div className="grid grid-cols-2 gap-0.5 p-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1 bg-zinc-600/40 rounded-sm" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${blocked ? 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10' : 'border-zinc-300/30 text-white bg-zinc-300/10'}`}>
                  {blocked ? 'BLOQUEADA' : 'ACTIVA'}
                </div>
                <svg width="28" height="17" viewBox="0 0 50 30" className="opacity-60">
                  <circle cx="18" cy="15" r="14" fill="#888" fillOpacity="0.85" />
                  <circle cx="32" cy="15" r="14" fill="#ddd" fillOpacity="0.85" />
                  <path d="M25 5.7a14 14 0 010 18.6A14 14 0 0125 5.7z" fill="#aaa" />
                </svg>
              </div>
            </div>

            {/* Card number */}
            <div className="relative z-10">
              <p className="text-sm font-mono text-white/70 tracking-[0.2em] mb-4">
                {blocked ? '••••  ••••  ••••  ••••' : '••••  ••••  ••••  3902'}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase font-semibold mb-0.5">Titular</p>
                  <p className="text-xs text-zinc-200 font-semibold tracking-wide">{USER.name.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-zinc-500 uppercase font-semibold mb-0.5">Válida hasta</p>
                  <p className="text-xs text-zinc-200 font-semibold">12/28</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-[8px] text-zinc-500 uppercase font-semibold mb-0.5">Tipo</p>
                  <p className="text-[10px] text-zinc-400 font-bold tracking-wide">{USER.card.type}</p>
                </div>
                <p className="text-[9px] text-zinc-500 italic">Toca para ver reverso</p>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-[2rem] overflow-hidden flex flex-col justify-between p-6 shadow-xl border border-white/10"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-zinc-500/10 blur-2xl" />

            {/* Magnetic stripe */}
            <div className="relative z-10 -mx-6 mt-2 h-9 bg-zinc-700/80" />

            <div className="relative z-10 flex flex-col gap-4">
              {/* CVV */}
              <div>
                <p className="text-[9px] text-zinc-400 uppercase font-semibold mb-1">Código de seguridad (CVV)</p>
                <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center justify-between border border-white/5">
                  <span className="text-white font-mono text-sm tracking-widest">{blocked ? '•••' : '742'}</span>
                  <span className="text-zinc-500 text-[10px]">No compartas</span>
                </div>
              </div>
              {/* Quick actions */}
              <div className="flex gap-2">
                <button
                  onClick={e => { e.stopPropagation(); onToggleBlock(); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${blocked ? 'border-zinc-300 text-white hover:bg-white/5' : 'border-zinc-500 text-zinc-400 hover:bg-white/5'}`}
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
              <p className="text-[8px] text-zinc-600 leading-relaxed text-center">
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
          <h3 className="text-base font-black text-black">Simulador TRM</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">Calcula el costo real de tu compra en dólares</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-black bg-zinc-100 px-2.5 py-1 rounded-full border border-black/5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
          En vivo
        </div>
      </div>

      {/* Success banner */}
      {successBanner && rateData && (
        <div className="p-3 bg-zinc-50 border border-black/8 rounded-xl animate-fade-in flex items-center gap-2 text-zinc-800">
          <span className="text-black text-sm">{Icons.check}</span>
          <span className="text-xs font-bold">TRM actualizada · {rateData.date}</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in flex items-start gap-2">
          <span className="text-red-600 text-sm mt-0.5">{Icons.warning}</span>
          <p className="text-xs text-red-700 leading-relaxed font-semibold">{error}</p>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleConsult} className="space-y-3">
        <div className="rounded-2xl bg-zinc-50 border border-black/8 p-4 focus-within:border-black/30 transition-all duration-300">
          <label htmlFor="sim-usd" className="block text-[10px] text-zinc-400 uppercase font-bold mb-1.5 tracking-wider">
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
              className="text-2xl font-black bg-transparent outline-none flex-1 text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              disabled={loading}
            />
            <div className="flex items-center gap-1.5 bg-white border border-black/8 px-3 py-1.5 rounded-xl shrink-0">
              <span className="text-sm">🇺🇸</span>
              <span className="text-xs font-bold text-black">USD</span>
            </div>
          </div>
        </div>

        {validationError && (
          <p className="text-xs text-red-500 font-medium px-1 animate-fade-in">{validationError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-black text-white hover:bg-zinc-800 text-sm font-extrabold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
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
        <div className="space-y-2 animate-pulse">
          <div className="h-5 bg-zinc-100 rounded-lg w-2/3" />
          <div className="h-10 bg-zinc-100 rounded-xl" />
          <div className="h-4 bg-zinc-100 rounded w-full" />
        </div>
      ) : showResults && rateData ? (
        <div className="space-y-3 animate-fade-in">
          {/* TRM + conversion arrow */}
          <div className="rounded-2xl bg-zinc-50 border border-black/8 p-4 text-black">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tasa de cambio</span>
              <span className="text-[10px] text-zinc-400">{rateData.source}</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[10px] text-zinc-400">1 USD =</span>
              <span className="text-xl font-black">{copFmtFull.format(rateData.rate)}</span>
            </div>
            {/* Conversion flow */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white border border-black/5 px-3 py-2 rounded-xl flex-1 justify-center">
                <span>🇺🇸</span>
                <span className="text-xs font-black">{usdFmt.format(parsedUsd)}</span>
              </div>
              <span className="text-zinc-400">→</span>
              <div className="flex items-center gap-1.5 bg-zinc-100 border border-black/5 px-3 py-2 rounded-xl flex-1 justify-center">
                <span>🇨🇴</span>
                <span className="text-xs font-black text-black">{copFmt.format(subtotalCop)}</span>
              </div>
            </div>
          </div>

          {/* Invoice breakdown */}
          <div className="rounded-2xl border border-black/8 bg-zinc-50/50 p-4 text-black">
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-3">Resumen de liquidación</h4>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Monto base', value: `${usdFmt.format(parsedUsd)} USD` },
                { label: 'TRM aplicada', value: copFmtFull.format(rate) },
                { label: `Comisión internacional (${INTERNATIONAL_COMMISSION * 100}%)`, value: copFmtFull.format(commissionCop) },
                { label: `IVA (${IVA_RATE * 100}%)`, value: copFmtFull.format(ivaCop) },
              ].map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-zinc-500">{row.label}</span>
                  <span className="text-zinc-800 font-mono font-medium">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-black/8 pt-2 mt-1">
                <span className="font-bold text-black text-sm">Total debitado</span>
                <span className="font-black text-black text-sm font-mono">{copFmt.format(totalDebitCop)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold transition-all duration-200 border border-black/5 cursor-pointer"
          >
            Simular otra compra
          </button>

          <p className="text-[9px] text-zinc-400 text-center leading-relaxed px-2 font-medium">
            La TRM mostrada corresponde a la tasa de cambio vigente. El valor real procesado podría diferir levemente en base a las políticas de tu franquicia.
          </p>
        </div>
      ) : null}
    </div>
  );
}

// ─── VIEW: COMPROBANTE (tipo Nequi) ───────────────────────────────
interface ComprobanteViewProps {
  onBack: () => void;
  transaction?: Transaction | null;
}

function ComprobanteView({ onBack, transaction }: ComprobanteViewProps) {
  const ref = 'REV' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const now = new Date();
  const fecha = now.toLocaleDateString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const hora = now.toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit',
  });

  const displayAmount = transaction
    ? copFmt.format(Math.abs(transaction.amount))
    : '$70.000';

  const displayPaidAt = transaction ? `${transaction.name} Colombia` : 'Rappi Colombia';
  const displayDate = transaction ? transaction.date : `${fecha} · ${hora}`;

  // Mini QR made of divs
  function MiniQR() {
    const pattern = [
      [1,1,1,0,1,0,1,1,1],
      [1,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,0,1],
      [1,1,1,0,0,1,1,1,1],
      [0,0,0,1,0,1,0,0,0],
      [1,0,1,0,1,0,1,1,0],
      [1,1,1,0,0,1,0,1,1],
      [1,0,0,1,0,0,1,0,0],
      [1,1,0,0,1,0,0,1,1],
    ];
    return (
      <div className="inline-block p-3 bg-white rounded-xl border border-black/8">
        {pattern.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div key={j} className={`w-4 h-4 ${cell ? 'bg-black' : 'bg-white'}`} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-black">
      {/* Header */}
      <div className="bg-white border-b border-black/6 px-6 h-14 flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-black transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>
        <h1 className="text-sm font-bold text-black">Detalle del movimiento</h1>
      </div>

      {/* Receipt */}
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <div className="w-full max-w-sm">
          {/* Status badge */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-black text-black">¡Pago exitoso!</h2>
            <p className="text-sm text-zinc-400 mt-1">Tu transacción fue procesada</p>
          </div>

          {/* Ticket card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/6 relative">
            {/* Ticket notch top */}
            <div className="absolute top-0 left-0 right-0 flex justify-between px-3 -translate-y-1/2 pointer-events-none" style={{top: '38%'}}>
              <div className="w-5 h-5 rounded-full bg-zinc-50 border border-black/6" />
              <div className="w-5 h-5 rounded-full bg-zinc-50 border border-black/6" />
            </div>

            {/* Top section: amount */}
            <div className="px-7 pt-7 pb-5 text-center border-b border-dashed border-black/10">
              <p className="text-xs text-zinc-400 mb-1">Monto pagado</p>
              <p className="text-4xl font-black text-black">{displayAmount}</p>
              <p className="text-xs text-zinc-400 mt-1">COP</p>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center py-5 border-b border-dashed border-black/10">
              <MiniQR />
              <p className="text-xs text-zinc-400 mt-3">Escanea para validar este comprobante</p>
            </div>

            {/* Details */}
            <div className="px-7 py-5 space-y-4">
              {[
                { label: 'Pagado en', val: displayPaidAt },
                { label: 'Fecha', val: displayDate },
                { label: 'Referencia', val: ref },
                { label: 'Origen de los fondos', val: 'Cuenta de ahorros •••• 4821' },
                { label: 'Estado', val: '✓ Completado' },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs text-zinc-400 flex-shrink-0 pt-px">{label}</span>
                  <span className="text-xs font-semibold text-black text-right">{val}</span>
                </div>
              ))}
            </div>

            {/* Bottom section: ref code */}
            <div className="mx-7 mb-7 py-3 rounded-xl bg-zinc-50 border border-black/6 text-center">
              <p className="text-xs text-zinc-400 mb-0.5">Número de referencia</p>
              <p className="text-sm font-black text-black font-mono tracking-widest">{ref}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 space-y-3">
            <button className="w-full py-3 rounded-full border border-black/15 text-black text-sm font-semibold hover:border-black/40 transition-colors flex items-center justify-center gap-2">
              <span>↓</span> Descargar comprobante
            </button>
            <button className="w-full py-3 rounded-full border border-black/15 text-black text-sm font-semibold hover:border-black/40 transition-colors flex items-center justify-center gap-2">
              <span>⎘</span> Compartir
            </button>
            <button
              onClick={onBack}
              className="w-full py-3.5 rounded-full bg-black text-white text-sm font-bold hover:bg-zinc-800 transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-VIEWS ─────────────────────────────────────────────────────────────────

function HomeView({
  setView,
  setSelectedTransaction,
  balanceExpanded,
  setBalanceExpanded,
  setShowDeposit,
  setShowSend,
  setShowWithdraw,
}: {
  setView: (v: View) => void;
  setSelectedTransaction: (tx: Transaction | null) => void;
  balanceExpanded: boolean;
  setBalanceExpanded: (b: boolean) => void;
  setShowDeposit: (b: boolean) => void;
  setShowSend: (b: boolean) => void;
  setShowWithdraw: (b: boolean) => void;
}) {
  const MENU_CARDS: { id: View; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'prestamos', label: 'Préstamos', desc: 'Respaldo flexible y claro', icon: Icons.prestamos },
    { id: 'tarjetas', label: 'Tarjetas de crédito', desc: 'Límites y seguridad', icon: Icons.tarjetas },
    { id: 'tmr', label: 'TMR del día', desc: 'Tasa representativa oficial', icon: Icons.tmr },
    { id: 'virtual', label: 'Tarjeta virtual', desc: 'CVV dinámico seguro', icon: Icons.virtual },
    { id: 'simulacion', label: 'Simulador TRM', desc: 'Calcula compras en dólares', icon: Icons.simulacion },
    { id: 'condiciones', label: 'Condiciones', desc: 'Términos del producto', icon: Icons.condiciones },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="text-left">
        <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Banca Virtual</p>
        <h1 className="text-2xl font-black tracking-tight text-black mt-0.5">Hola, {USER.name.split(' ')[0]}</h1>
      </div>

      {/* Expandable Balance Card */}
      <div
        onClick={() => setBalanceExpanded(!balanceExpanded)}
        className="rounded-[2rem] bg-white border border-black/8 p-6 shadow-sm cursor-pointer select-none transition-all hover:border-black/20"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">Saldo disponible</p>
            <p className="text-4xl font-black text-black tracking-tight">{copFmt.format(USER.balanceCOP)}</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-zinc-50 border border-black/5 flex items-center justify-center text-black">
            {balanceExpanded ? Icons.chevronDown : Icons.chevronRight}
          </button>
        </div>

        {balanceExpanded && (
          <div className="pt-4 border-t border-black/5 mt-4 space-y-2.5 animate-fade-in text-left">
            <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Cuentas Jes Bank</p>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-xs text-zinc-500 font-semibold">Dinero en pesos</span>
              <span className="text-sm font-bold text-black">{copFmt.format(USER.balanceCOP)}</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-xs text-zinc-500 font-semibold">Dinero en dólares</span>
              <span className="text-sm font-mono font-bold text-black">
                {usdFmt.format(USER.balanceUSD)} <span className="text-[10px] font-sans text-zinc-400">USD</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Three Main Actions (Depositar, Enviar, Retirar) */}
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

      {/* Recent Movements (Nu Bank style) */}
      <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-black/5 pb-3">
          <h2 className="text-sm font-bold text-black">Movimientos</h2>
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Ver comprobantes</span>
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

      {/* Descubre Más Section */}
      <div className="mt-8 pt-6 border-t border-black/5 text-left space-y-4">
        <div>
          <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">Descubre más</p>
          <h2 className="text-base font-black text-black leading-tight mt-0.5">Una cuenta. Infinitas posibilidades.</h2>
        </div>

        {/* Square Cards Grid */}
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
  );
}

function PrestamosView() {
  const [amount, setAmount] = useState(5000000);
  const [months, setMonths] = useState(24);
  const [showAmortization, setShowAmortization] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const interestRate = 0.015; // 1.5% nominal mensual
  const r = interestRate;
  const n = months;
  const p = amount;
  const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalRepayment = monthlyPayment * n;
  const totalInterest = totalRepayment - p;

  const amortizationData = [];
  let balance = p;
  for (let i = 1; i <= n; i++) {
    const interestPart = balance * r;
    const principalPart = monthlyPayment - interestPart;
    balance -= principalPart;
    amortizationData.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPart,
      interest: interestPart,
      balance: Math.max(0, balance),
    });
  }

  const handleRequest = () => {
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 5000);
  };

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-lg font-black text-black">Simulador de Préstamos</h2>
          <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Obtén desembolso inmediato a tasa fija</p>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-zinc-100 border border-black/5 text-[9px] font-bold text-black uppercase">
          Tasa: 1.5% MV
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl animate-fade-in text-xs font-bold flex items-center gap-2">
          <span className="text-green-700">{Icons.check}</span>
          <span>¡Desembolso realizado! El dinero ha sido transferido a tu saldo disponible.</span>
        </div>
      )}

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-6 text-left">
        {/* Amount Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Monto</label>
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
          <div className="flex justify-between text-[9px] text-zinc-400 mt-1 font-semibold">
            <span>$1'000.000 COP</span>
            <span>$50'000.000 COP</span>
          </div>
        </div>

        {/* Plazo Buttons */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Plazo</label>
          <div className="grid grid-cols-5 gap-1.5">
            {[12, 24, 36, 48, 60].map(m => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`py-2 text-[10px] font-bold rounded-xl transition-all cursor-pointer border ${
                  months === m
                    ? 'bg-black text-white border-black'
                    : 'bg-zinc-50 border-black/5 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Amortization projection summary */}
      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-4 text-left">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Detalles de cuota</h3>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-zinc-400 font-medium">Cuota mensual estimada</p>
            <p className="text-2xl font-black text-black mt-0.5">{copFmtFull.format(monthlyPayment)}</p>
          </div>
          <div className="h-px bg-black/5" />
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Monto base</span>
              <span className="font-bold text-black">{copFmt.format(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Plazo</span>
              <span className="font-bold text-black">{months} meses</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-black/10 pt-2 mt-2">
              <span className="text-zinc-500">Total intereses</span>
              <span className="font-bold text-black">{copFmtFull.format(totalInterest)}</span>
            </div>
            <div className="flex justify-between border-t border-black/8 pt-2 mt-2">
              <span className="font-extrabold text-black">Total a pagar</span>
              <span className="font-black text-black">{copFmtFull.format(totalRepayment)}</span>
            </div>
          </div>
          <button
            onClick={handleRequest}
            className="w-full py-3.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-all cursor-pointer shadow-sm mt-2"
          >
            Solicitar Desembolso
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowAmortization(!showAmortization)}
        className="w-full py-3 rounded-xl border border-black/15 text-black hover:bg-zinc-50 text-[10px] font-bold transition-all cursor-pointer"
      >
        {showAmortization ? 'Ocultar proyecciones' : 'Ver tabla de amortización'}
      </button>

      {showAmortization && (
        <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm overflow-hidden animate-fade-in text-left">
          <h3 className="text-xs font-bold text-black mb-3">Tabla de amortización</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/8 text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                  <th className="py-2">Mes</th>
                  <th className="py-2">Cuota</th>
                  <th className="py-2">Capital</th>
                  <th className="py-2">Interés</th>
                  <th className="py-2 text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-mono text-zinc-600 divide-y divide-black/5">
                {amortizationData.map(row => (
                  <tr key={row.month}>
                    <td className="py-2 font-bold text-black">{row.month}</td>
                    <td className="py-2">{copFmtFull.format(row.payment)}</td>
                    <td className="py-2 text-green-600">+{copFmtFull.format(row.principal)}</td>
                    <td className="py-2 text-red-500">-{copFmtFull.format(row.interest)}</td>
                    <td className="py-2 text-right text-black font-semibold">{copFmtFull.format(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TarjetasView({
  cardBlocked,
  setCardBlocked,
}: {
  cardBlocked: boolean;
  setCardBlocked: (b: boolean) => void;
}) {
  const [dailyLimit, setDailyLimit] = useState(2500000);
  const [showNumbers, setShowNumbers] = useState(false);

  return (
    <div className="space-y-6 text-black">
      <div className="text-left">
        <h2 className="text-lg font-black text-black">Tarjetas de crédito</h2>
        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Controla la seguridad de tu plástico físico</p>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm flex flex-col justify-center text-left">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-[10px] font-bold text-black uppercase tracking-wider">Tarjeta Física</span>
          <span className="text-[9px] text-zinc-400 font-semibold">Toca la tarjeta para ver reverso</span>
        </div>
        <CreditCard blocked={cardBlocked} onToggleBlock={() => setCardBlocked(!cardBlocked)} />
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-6 text-left">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ajustes de la tarjeta</h3>

        {/* Limit slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-zinc-700">Límite Diario de Compras</label>
            <span className="text-xs font-black text-black">{copFmt.format(dailyLimit)}</span>
          </div>
          <input
            type="range"
            min="500000"
            max="10000000"
            step="100000"
            value={dailyLimit}
            onChange={e => setDailyLimit(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-[9px] text-zinc-400 mt-1 font-semibold">
            <span>$500.000 COP</span>
            <span>$10'000.000 COP</span>
          </div>
        </div>

        <div className="h-px bg-black/5" />

        {/* Safety */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black">Bloqueo Temporal</p>
              <p className="text-[9px] text-zinc-400 mt-0.5 font-semibold">Previene cualquier transacción al instante</p>
            </div>
            <button
              onClick={() => setCardBlocked(!cardBlocked)}
              className={`w-12 h-6 rounded-full p-1 transition-all cursor-pointer ${cardBlocked ? 'bg-black' : 'bg-zinc-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-all ${cardBlocked ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-black">Mostrar credenciales</p>
              <p className="text-[9px] text-zinc-400 mt-0.5 font-semibold">Ver números y código CVV en pantalla</p>
            </div>
            <button
              onClick={() => setShowNumbers(!showNumbers)}
              className="px-3 py-1.5 text-[10px] font-bold rounded-lg border border-black/15 hover:bg-zinc-50 transition-all cursor-pointer text-black"
            >
              {showNumbers ? 'Ocultar' : 'Ver datos'}
            </button>
          </div>
        </div>

        {showNumbers && (
          <div className="p-3.5 bg-zinc-50 border border-black/8 rounded-xl space-y-2 text-xs font-mono animate-fade-in text-black">
            <div className="flex justify-between">
              <span className="text-zinc-500">Tarjeta:</span>
              <span className="font-semibold">4821 9302 4810 3902</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Expiración:</span>
              <span className="font-semibold">12/28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">CVV:</span>
              <span className="font-semibold">742</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TMRView() {
  const { rateData, loading, fetchRate } = useExchangeRate();
  const [usdAmount, setUsdAmount] = useState('100');
  const [copAmount, setCopAmount] = useState('');

  useState(() => {
    fetchRate();
  });

  const rate = rateData?.rate || 4032.50;

  const handleConvertUsd = (val: string) => {
    setUsdAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCopAmount((num * rate).toFixed(0));
    } else {
      setCopAmount('');
    }
  };

  const handleConvertCop = (val: string) => {
    setCopAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setUsdAmount((num / rate).toFixed(2));
    } else {
      setUsdAmount('');
    }
  };

  const historyPoints = [3980, 4010, 3990, 4025, 4050, 4030, rate];
  const maxVal = Math.max(...historyPoints);
  const minVal = Math.min(...historyPoints);
  const spread = maxVal - minVal || 100;

  const svgWidth = 500;
  const svgHeight = 120;
  const pointsString = historyPoints
    .map((val, idx) => {
      const x = (idx / (historyPoints.length - 1)) * svgWidth;
      const y = svgHeight - 12 - ((val - minVal) / spread) * (svgHeight - 24);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-lg font-black text-black">TMR del Día</h2>
          <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Indicador oficial para compras en divisa extranjera</p>
        </div>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm text-left">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Histórico</span>
            <p className="text-sm font-bold text-black mt-0.5">Fluctuación Semanal</p>
          </div>
          <button
            onClick={() => fetchRate()}
            disabled={loading}
            className="px-2.5 py-1 text-[9px] font-bold rounded-lg border border-black/10 hover:bg-zinc-50 transition-colors cursor-pointer text-black"
          >
            Actualizar
          </button>
        </div>

        {/* SVG Chart */}
        <div className="w-full bg-zinc-50 border border-black/5 rounded-2xl p-4">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
            <polyline
              fill="none"
              stroke="black"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
            {historyPoints.map((val, idx) => {
              const x = (idx / (historyPoints.length - 1)) * svgWidth;
              const y = svgHeight - 12 - ((val - minVal) / spread) * (svgHeight - 24);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="3.5"
                  className="fill-black stroke-white stroke-2"
                />
              );
            })}
          </svg>
          <div className="flex justify-between text-[9px] text-zinc-400 mt-3 font-bold uppercase tracking-wider">
            <span>Hace 6d</span>
            <span>Hace 3d</span>
            <span className="text-black font-extrabold">Hoy ({copFmt.format(rate)})</span>
          </div>
        </div>
      </div>

      {/* Converter */}
      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-4 text-left">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Calculadora de Cambio</h3>
        <div className="space-y-3">
          <div className="p-3 bg-zinc-50 border border-black/5 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <label className="block text-[8px] text-zinc-400 font-bold uppercase">Monto USD</label>
              <input
                type="number"
                value={usdAmount}
                onChange={e => handleConvertUsd(e.target.value)}
                className="text-base font-black text-black bg-transparent outline-none w-full mt-0.5"
              />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 shrink-0 ml-2">USD 🇺🇸</span>
          </div>

          <div className="p-3 bg-zinc-50 border border-black/5 rounded-xl flex justify-between items-center">
            <div className="flex-1">
              <label className="block text-[8px] text-zinc-400 font-bold uppercase">Total COP</label>
              <input
                type="number"
                value={copAmount}
                onChange={e => handleConvertCop(e.target.value)}
                className="text-base font-black text-black bg-transparent outline-none w-full mt-0.5"
              />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 shrink-0 ml-2">COP 🇨🇴</span>
          </div>
        </div>
        <p className="text-[9px] text-zinc-400 font-semibold leading-normal">
          Conversión basada en TRM oficial {copFmtFull.format(rate)} COP por dólar. Datos provistos por DolarAPI.
        </p>
      </div>
    </div>
  );
}

function SimulacionView() {
  return (
    <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm text-left">
      <SimulatorTool />
    </div>
  );
}

function VirtualCardView() {
  const [cvv, setCvv] = useState('482');
  const [timeLeft, setTimeLeft] = useState(45);
  const [notification, setNotification] = useState('');

  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          const newCvv = Math.floor(100 + Math.random() * 900).toString();
          setCvv(newCvv);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  });

  const handleCopy = (field: string) => {
    setNotification(`Copiado: ${field}`);
    setTimeout(() => setNotification(''), 2500);
  };

  return (
    <div className="space-y-6 text-black">
      <div className="text-left">
        <h2 className="text-lg font-black text-black">Tarjeta Virtual</h2>
        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Seguridad mejorada para tus transacciones por internet</p>
      </div>

      {notification && (
        <div className="p-2.5 bg-black text-white rounded-xl text-[10px] font-bold animate-fade-in text-center max-w-xs mx-auto">
          {notification}
        </div>
      )}

      {/* Card display */}
      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm flex flex-col items-center justify-center">
        <div className="relative w-full aspect-[1.586/1] rounded-3xl border-2 border-black bg-zinc-50 flex flex-col justify-between p-5 overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-200/50 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-zinc-200/40 rounded-full blur-xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />

          <div className="flex justify-between items-start text-left">
            <div>
              <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">Tarjeta Virtual</span>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-4 h-4 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-black text-[7px]">JB</span>
                </div>
                <span className="text-[11px] font-bold text-black tracking-tight">Jes Bank</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[8px] font-bold border border-black/10 bg-white text-black">DIGITAL</span>
          </div>

          <div className="text-left">
            <p className="text-sm font-mono text-black tracking-wider mb-2.5">4821 7381 2940 1827</p>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[7px] text-zinc-400 uppercase font-semibold">Titular</span>
                <p className="text-[9px] font-bold text-black tracking-wide">SARA QUINTERO</p>
              </div>
              <div className="flex gap-3">
                <div>
                  <span className="text-[7px] text-zinc-400 uppercase font-semibold">Vence</span>
                  <p className="text-[9px] font-bold text-black">09/29</p>
                </div>
                <div>
                  <span className="text-[7px] text-zinc-400 uppercase font-semibold">CVV</span>
                  <p className="text-[9px] font-mono font-black text-black">{cvv}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy panel */}
      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-5 text-left">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-black">Credenciales Virtuales</h3>
          <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400">
            <span className="w-1 h-1 rounded-full bg-black animate-pulse inline-block" />
            CVV rota en: <span className="text-black font-extrabold">{timeLeft}s</span>
          </div>
        </div>

        <div className="space-y-2.5">
          {[
            { label: 'Número de Tarjeta', value: '4821 7381 2940 1827' },
            { label: 'Fecha de Expiración', value: '09/29' },
            { label: 'CVV Dinámico', value: cvv },
          ].map(item => (
            <div key={item.label} className="p-3 bg-zinc-50 border border-black/5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider">{item.label}</p>
                <p className="text-xs font-mono font-bold text-black mt-0.5">{item.value}</p>
              </div>
              <button
                onClick={() => handleCopy(item.value)}
                className="px-2 py-1 rounded-md border border-black/8 hover:bg-zinc-100 text-[9px] font-bold text-zinc-600 cursor-pointer"
              >
                Copiar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CondicionesView() {
  return (
    <div className="bg-white border border-black/8 rounded-[2rem] p-6 shadow-sm text-left text-black">
      <div className="mb-4">
        <h2 className="text-base font-black text-black">Condiciones de Uso</h2>
        <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Términos del portal de simulación Jes Bank</p>
      </div>

      <div className="h-px bg-black/5 mb-4" />

      <div className="space-y-4 text-xs text-zinc-600 leading-relaxed font-semibold">
        <section className="space-y-1">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">1. Tasas y Simulaciones</h3>
          <p>
            Las simulaciones contenidas en este portal corresponden a valores aproximados y no representan una oferta mercantil obligatoria. La tasa de interés cobrada en préstamos de consumo está fijada en 1.5% mensual (19.56% Efectivo Anual). Las tasas de tarjetas de crédito se calculan en base a la tasa de usura de la Superintendencia Financiera de Colombia vigente al momento de la compra.
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">2. Transacciones Internacionales y TRM</h3>
          <p>
            Las compras realizadas en moneda extranjera (USD, EUR, etc.) se procesarán utilizando la TRM (Tasa Representativa del Mercado) fijada por la franquicia emisora de la tarjeta (Visa / Mastercard) en el día hábil en que la transacción sea liquidada por el comercio. Adicionalmente, no se cobrará comisión por conversión internacional a los usuarios del plan Plus o Metal. Los usuarios del plan Estándar podrían incurrir en una comisión del 1.5%.
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">3. Seguridad y Bloqueo de Tarjeta</h3>
          <p>
            Es responsabilidad exclusiva del titular de la cuenta mantener las credenciales de seguridad en estricto secreto. En caso de pérdida, sospecha de fraude o robo, el usuario debe bloquear inmediatamente la tarjeta desde este portal de banca virtual o contactar al servicio de atención al cliente disponible las 24 horas del día.
          </p>
        </section>
      </div>
    </div>
  );
}

// ─── MAIN PORTAL / DASHBOARD SHELL ──────────────────────────────────────────────

export default function UserPortal() {
  const router = useRouter();
  const [view, setView] = useState<View>('home');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [cardBlocked, setCardBlocked] = useState(false);
  const [balanceExpanded, setBalanceExpanded] = useState(false);
  const [creditCardData, setCreditCardData] = useState<any | null>(null);
  const [virtualInitialTab, setVirtualInitialTab] = useState<'debito' | 'credito'>('debito');

  // Load persisted credit card (gastado) from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('creditCardData');
      if (raw) {
        setCreditCardData(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Modal states
  const [showDeposit, setShowDeposit] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const onBack = () => {
    if (view === 'home') {
      router.push('/');
    } else {
      setView('home');
    }
  };

  // Comprobante is full-screen, skip layout
  if (view === 'comprobante') {
    return <ComprobanteView onBack={() => setView('home')} transaction={selectedTransaction} />;
  }

  const titles: Record<View, string> = {
    home: 'Inicio',
    prestamos: 'Préstamos',
    tarjetas: 'Tarjetas de crédito',
    tmr: 'TMR del día',
    simulacion: 'Simulador',
    condiciones: 'Condiciones',
    virtual: 'Tarjeta virtual',
    comprobante: 'Comprobante',
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans flex flex-col items-center">
      {/* Centered, app-like wrapper viewport */}
      <div className="w-full max-w-xl min-h-screen bg-white md:shadow-md md:border-x md:border-black/6 flex flex-col">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/6 px-6 h-14 flex items-center justify-between shrink-0">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100 text-black transition-colors cursor-pointer"
            aria-label="Volver"
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
              <h1 className="text-xs font-bold uppercase tracking-wider text-black">{titles[view]}</h1>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotificationsModal(true)}
              aria-label="Notificaciones"
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              {Icons.bell}
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              aria-label="Perfil"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span className="text-[11px] font-black">JB</span>
            </button>
          </div>
        </header>

        {/* View Content Area */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {view === 'home' && (
            <HomeView
              setView={setView}
              setSelectedTransaction={setSelectedTransaction}
              balanceExpanded={balanceExpanded}
              setBalanceExpanded={setBalanceExpanded}
              setShowDeposit={setShowDeposit}
              setShowSend={setShowSend}
              setShowWithdraw={setShowWithdraw}
            />
          )}
          {view === 'prestamos' && <PrestamosView />}
          {view === 'tarjetas' && (
            <TarjetasCredito
              onAprobada={(p) => {
                // store approved credit product and navigate to virtual cards
                          const payload = { producto: p, cupoNumero: p.cupoNumero ?? (p.cupoNumero || 0), gastado: 0 };
                          setCreditCardData(payload);
                          try { localStorage.setItem('creditCardData', JSON.stringify(payload)); } catch (e) {}
                          setVirtualInitialTab('credito');
                          setView('virtual');
                        }}
                        onBackToHome={() => setView('home')}
                      />
                    )}
          {view === 'tmr' && <TMRView />}
          {view === 'simulacion' && <SimulacionView />}
          {view === 'condiciones' && <CondicionesView />}
          {view === 'virtual' && (
            <TarjetasVirtuales
              creditCard={creditCardData}
              initialTab={virtualInitialTab}
              onSolicitarCredito={() => setView('tarjetas')}
              onBackToHome={() => setView('home')}
                        onUpdateCreditCard={(c: any) => {
                          setCreditCardData(c);
                          try { localStorage.setItem('creditCardData', JSON.stringify(c)); } catch (e) {}
                        }}
                      />
                    )}
        </main>
      </div>

      {/* Pop-up Modals */}
      <DepositModal isOpen={showDeposit} onClose={() => setShowDeposit(false)} />
      <SendModal isOpen={showSend} onClose={() => setShowSend(false)} />
      <WithdrawModal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} />

      {/* Notifications / Profile Overlays (opened from header) */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <div className="p-4">
            <button
              onClick={() => setShowNotificationsModal(false)}
              className="mb-4 px-3 py-1 rounded-md border text-sm"
            >
              Volver
            </button>
            <NotificationsComponent />
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto">
          <div className="p-4">
            <button
              onClick={() => setShowProfileModal(false)}
              className="mb-4 px-3 py-1 rounded-md border text-sm"
            >
              Volver
            </button>
            <ProfileComponent />
          </div>
        </div>
      )}
    </div>
  );
}
