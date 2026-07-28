'use client';

import { useState } from 'react';
import { TMRSharedView, CondicionesSharedView } from './PersonalDashboard';

const copFmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const copFmtFull = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 2 });

type View = 'home' | 'nomina' | 'masivas' | 'gastos' | 'tmr' | 'condiciones';

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Icons = {
  nomina: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  masivas: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  gastos: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  tmr: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
  back: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
};

interface CompanyDashboardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    docNumber: string;
    docType: string;
  };
  onLogout: () => void;
}

export default function CompanyDashboard({ user, onLogout }: CompanyDashboardProps) {
  const [view, setView] = useState<View>('home');
  const [balanceExpanded, setBalanceExpanded] = useState(false);

  const onBack = () => {
    if (view === 'home') {
      onLogout();
    } else {
      setView('home');
    }
  };

  const MENU_CARDS: { id: View; label: string; desc: string }[] = [
    { id: 'nomina',      label: 'Pago de Nómina',    desc: 'Dispersa salarios al instante' },
    { id: 'masivas',     label: 'Transf. Masivas',    desc: 'Paga a múltiples proveedores' },
    { id: 'gastos',      label: 'Control de Gastos',  desc: 'Reportes y analítica de egresos' },
    { id: 'tmr',         label: 'TMR del día',         desc: 'Tasa representativa oficial' },
    { id: 'condiciones', label: 'Condiciones',         desc: 'Términos corporativos' },
  ];

  const viewTitles: Record<View, string> = {
    home:        '',
    nomina:      'Pago de Nómina',
    masivas:     'Transferencias Masivas',
    gastos:      'Control de Gastos',
    tmr:         'TMR del día',
    condiciones: 'Condiciones',
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans flex flex-col items-center">
      <div className="w-full max-w-xl min-h-screen bg-white md:shadow-md md:border-x md:border-black/6 flex flex-col">

        {/* ── Header Bar ── */}
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
                <span className="text-black font-bold text-sm tracking-tight">Jes Bank Business</span>
              </div>
            ) : (
              <h1 className="text-xs font-bold uppercase tracking-wider text-black">
                {viewTitles[view]}
              </h1>
            )}
          </div>

          <div className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-black cursor-pointer">
            {Icons.bell}
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {view === 'home' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="text-left flex justify-between items-center">
                <div>
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Banca Corporativa</p>
                  <h2 className="text-2xl font-black tracking-tight text-black mt-0.5">{user.firstName}</h2>
                  <p className="text-[10px] text-zinc-400 font-bold mt-0.5">NIT: {user.docNumber}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-white border border-black/5">
                  {user.firstName?.[0]?.toUpperCase() ?? 'E'}
                </div>
              </div>

              {/* Business Balance Card */}
              <div
                onClick={() => setBalanceExpanded(!balanceExpanded)}
                className="rounded-[2rem] bg-black text-white p-6 shadow-sm cursor-pointer select-none transition-all hover:bg-zinc-900"
              >
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">Saldo consolidado (COP)</p>
                    <p className="text-4xl font-black tracking-tight">{copFmt.format(145200000)}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-white">
                    {balanceExpanded ? <ChevronDown /> : <ChevronRight />}
                  </button>
                </div>
                {balanceExpanded && (
                  <div className="pt-4 border-t border-white/10 mt-4 space-y-2.5 text-left text-xs">
                    <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Cuentas Corrientes</p>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-zinc-300 font-semibold">Cuenta Corriente Principal</span>
                      <span className="font-bold">{copFmt.format(120200000)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-zinc-300 font-semibold">Reserva para Nómina</span>
                      <span className="font-bold">{copFmt.format(25000000)}</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-zinc-300 font-semibold">Fondo en Dólares (USD)</span>
                      <span className="font-mono font-bold">
                        {usdFmt.format(15420.50)}{' '}
                        <span className="text-[10px] font-sans text-zinc-400">USD</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick-action grid */}
              <div className="grid grid-cols-3 gap-3">
                {(['nomina', 'masivas', 'gastos'] as View[]).map(id => {
                  const card = MENU_CARDS.find(c => c.id === id)!;
                  const icon = id === 'nomina' ? Icons.nomina : id === 'masivas' ? Icons.masivas : Icons.gastos;
                  const label = id === 'nomina' ? 'Pagar Nómina' : id === 'masivas' ? 'T. Masivas' : 'Ver Gastos';
                  return (
                    <button
                      key={id}
                      onClick={() => setView(id)}
                      className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-black/5 bg-zinc-50 hover:bg-zinc-100 text-black transition-all cursor-pointer font-bold text-xs"
                    >
                      <span>{icon}</span>
                      <span className="text-[10px] text-zinc-600">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Recent Treasury movements */}
              <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-black/5 pb-3">
                  <h3 className="text-sm font-bold text-black text-left">Movimientos de Tesorería</h3>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Historial</span>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 1, name: 'Pago Proveedor Alimentos', category: 'Proveedores', amount: -4820000,  date: 'Hoy · 4:10 pm' },
                    { id: 2, name: 'Abono Clientes Nacionales', category: 'Recaudo',    amount: 15900000,  date: 'Hoy · 10:14 am' },
                    { id: 3, name: 'Suscripción AWS Cloud',     category: 'Servicios',  amount: -1850000,  date: 'Ayer · 12:00 am' },
                    { id: 4, name: 'Comisión Bancaria ACH',     category: 'Bancos',     amount: -15000,    date: 'Ayer · 9:00 am' },
                  ].map(tx => (
                    <div key={tx.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent text-left">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-black shrink-0 border border-black/5 font-bold text-[10px]">
                        {tx.amount > 0 ? 'IN' : 'OUT'}
                      </div>
                      <div className="flex-1 min-w-0">
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

              {/* Service grid cards */}
              <div className="mt-2 pt-6 border-t border-black/5 text-left space-y-4">
                <div>
                  <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">Servicios Corporativos</p>
                  <h3 className="text-base font-black text-black leading-tight mt-0.5">Control Financiero de tu Empresa</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {MENU_CARDS.map(card => (
                    <button
                      key={card.id}
                      onClick={() => setView(card.id)}
                      className="aspect-square bg-white border border-black/8 rounded-[1.5rem] p-5 flex flex-col justify-between hover:bg-zinc-50 transition-all text-left shadow-sm hover:scale-[1.01] cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-black/5 flex items-center justify-center text-black font-bold text-lg">
                        ★
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-black">{card.label}</h4>
                        <p className="text-[9px] text-zinc-400 font-medium leading-snug mt-1">{card.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'nomina'      && <NominaView />}
          {view === 'masivas'     && <BulkTransfersView />}
          {view === 'gastos'      && <CompanyExpensesView />}
          {view === 'tmr'         && <TMRSharedView />}
          {view === 'condiciones' && <CondicionesSharedView />}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-VIEWS
// ─────────────────────────────────────────────────────────────────────────────

function NominaView() {
  type Employee = { name: string; id: string; salary: number; status: string };
  const [employees, setEmployees] = useState<Employee[]>([
    { name: 'Sara Quintero',   id: '10293041', salary: 3200000, status: 'Pendiente' },
    { name: 'Carlos Gomez',    id: '80293812', salary: 2800000, status: 'Pendiente' },
    { name: 'Maria Restrepo',  id: '43920391', salary: 4500000, status: 'Pendiente' },
  ]);
  const [success, setSuccess] = useState(false);
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const allPaid = employees.every(emp => emp.status === 'Pagado');

  const handlePayPayroll = () => {
    setEmployees(prev => prev.map(emp => ({ ...emp, status: 'Pagado' })));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 text-left text-black">
      <div>
        <h2 className="text-lg font-black">Dispersión de Nómina</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">Dispersa los salarios a las cuentas de tus colaboradores</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-bold">
          ✓ ¡Nómina dispersada con éxito a los {employees.length} colaboradores!
        </div>
      )}

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold">Colaboradores registrados</h3>
        <div className="space-y-2">
          {employees.map(emp => (
            <div key={emp.id} className="p-3 bg-zinc-50 border border-black/5 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold">{emp.name}</p>
                <p className="text-[9px] text-zinc-400 font-semibold">C.C. {emp.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black font-mono">{copFmt.format(emp.salary)}</p>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${emp.status === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {emp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">Total a dispersar:</span>
          <span className="font-black text-sm">{copFmtFull.format(totalPayroll)}</span>
        </div>
        <button
          onClick={handlePayPayroll}
          disabled={allPaid}
          className="w-full py-3.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {allPaid ? '✓ Nómina Pagada' : 'Confirmar y Pagar Nómina'}
        </button>
      </div>
    </div>
  );
}

function BulkTransfersView() {
  type Transfer = { id: number; name: string; accountNumber: string; amount: number };
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !amount || !name) return;
    setTransfers(prev => [...prev, { id: Date.now(), name, accountNumber, amount: parseFloat(amount) }]);
    setName('');
    setAccountNumber('');
    setAmount('');
  };

  const handleExecute = () => {
    setSuccess(true);
    setTimeout(() => {
      setTransfers([]);
      setSuccess(false);
    }, 4000);
  };

  const totalAmount = transfers.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6 text-left text-black">
      <div>
        <h2 className="text-lg font-black">Transferencias Masivas</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">Realiza múltiples pagos en una sola transacción unificada</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-xs font-bold">
          ✓ ¡Lote de {transfers.length || 'todas las'} transferencias procesado correctamente!
        </div>
      )}

      <form onSubmit={handleAdd} className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold mb-1">Agregar destinatario</h3>
        <input
          type="text" required placeholder="Nombre / Empresa Proveedora" value={name} onChange={e => setName(e.target.value)}
          className="w-full p-3 bg-zinc-50 border border-black/8 rounded-xl text-xs outline-none focus:border-black/30 transition-colors"
        />
        <input
          type="text" required placeholder="Número de cuenta" value={accountNumber} onChange={e => setAccountNumber(e.target.value)}
          className="w-full p-3 bg-zinc-50 border border-black/8 rounded-xl text-xs outline-none focus:border-black/30 transition-colors"
        />
        <input
          type="number" required placeholder="Monto COP" value={amount} onChange={e => setAmount(e.target.value)}
          className="w-full p-3 bg-zinc-50 border border-black/8 rounded-xl text-xs outline-none focus:border-black/30 transition-colors"
        />
        <button type="submit" className="w-full py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all">
          Agregar al Lote
        </button>
      </form>

      {transfers.length > 0 && (
        <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold">Lista de Transferencias ({transfers.length})</h3>
          <div className="space-y-2">
            {transfers.map(tx => (
              <div key={tx.id} className="p-2.5 bg-zinc-50 border border-black/5 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold">{tx.name}</p>
                  <p className="text-[9px] text-zinc-400">Cta: {tx.accountNumber}</p>
                </div>
                <span className="font-mono font-bold">{copFmt.format(tx.amount)}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-black/5 flex justify-between items-center text-xs">
            <span className="text-zinc-500">Total lote:</span>
            <span className="font-black text-sm">{copFmtFull.format(totalAmount)}</span>
          </div>
          <button onClick={handleExecute} className="w-full py-3.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all">
            Ejecutar Transferencias Masivas
          </button>
        </div>
      )}
    </div>
  );
}

function CompanyExpensesView() {
  const categories = [
    { category: 'Nómina',                  pct: 60, amount: 25000000 },
    { category: 'Proveedores',             pct: 28, amount: 11600000 },
    { category: 'Servicios Cloud/Software', pct: 10, amount: 4200000 },
    { category: 'Otros',                   pct: 2,  amount: 800000 },
  ];

  return (
    <div className="space-y-6 text-left text-black">
      <div>
        <h2 className="text-lg font-black">Control de Gastos</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">Analítica y distribución de egresos corporativos del mes</p>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-black/5 pb-3">
          <h3 className="text-xs font-bold">Distribución mensual</h3>
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Julio 2026</span>
        </div>
        <div className="space-y-4">
          {categories.map(item => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-600">{item.category}</span>
                <span className="text-black font-bold font-mono">{copFmt.format(item.amount)} <span className="font-sans text-zinc-400">({item.pct}%)</span></span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-black/5 flex justify-between items-center text-xs">
          <span className="text-zinc-400">Total Egresos</span>
          <span className="font-black text-sm">{copFmt.format(categories.reduce((s, c) => s + c.amount, 0))}</span>
        </div>
      </div>

      <div className="bg-white border border-black/8 rounded-[2rem] p-5 shadow-sm">
        <h3 className="text-xs font-bold mb-4">Últimas Transacciones Corporativas</h3>
        <div className="space-y-2">
          {[
            { desc: 'Fact. 4821 — Proveedor Textiles',  monto: -8200000, fecha: '24 Jul' },
            { desc: 'Recaudo ACH Clientes',              monto: 31500000, fecha: '23 Jul' },
            { desc: 'Renovación Licencias Office 365',   monto: -1120000, fecha: '22 Jul' },
          ].map((t, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-black/5 text-xs">
              <div>
                <p className="font-bold text-black">{t.desc}</p>
                <p className="text-[9px] text-zinc-400">{t.fecha}</p>
              </div>
              <span className={`font-mono font-bold ${t.monto > 0 ? 'text-green-600' : 'text-black'}`}>
                {t.monto > 0 ? '+' : ''}{copFmt.format(t.monto)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
