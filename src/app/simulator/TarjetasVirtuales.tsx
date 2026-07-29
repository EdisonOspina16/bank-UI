'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardFace } from './TarjetasCredito';

const Icon = {
  ChevronLeft: ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Bell: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  X: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Plus: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  ShoppingBag: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2l1.5 4h9L18 2" />
      <path d="M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
    </svg>
  ),
  Repeat: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11a9 9 0 0114-7l4 3" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13a9 9 0 01-14 7l-4-3" />
    </svg>
  ),
  Plane: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 19L21 12 2.5 5 6 12z" />
    </svg>
  ),
  Wallet: ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 11h.01" />
    </svg>
  ),
  ArrowRight: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

const money = (v: number) => '$' + v.toLocaleString('es-CO');

function Header({ title, onBack }: { title: string; onBack?: () => void }) {
  const router = useRouter();
  return (
    <div style={s.header}>
      <button aria-label="Volver" onClick={onBack} style={s.headerBtn}>
        <Icon.ChevronLeft size={22} />
      </button>
      <div style={s.headerTitle}>{title}</div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button aria-label="Notificaciones" style={s.headerBtn} onClick={() => router.push('/simulator/notifications')}>
          <Icon.Bell size={18} />
        </button>
        <button aria-label="Perfil" style={{ ...s.headerBtn, width: 34, height: 34, borderRadius: 9, background: '#fff' }} onClick={() => router.push('/simulator/profile')}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>JB</div>
        </button>
      </div>
    </div>
  );
}

function useCvvRotativo() {
  const [cvv, setCvv] = useState(() => String(Math.floor(100 + Math.random() * 900)));
  const [segundos, setSegundos] = useState(45);

  useEffect(() => {
    const t = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          setCvv(String(Math.floor(100 + Math.random() * 900)));
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return { cvv, segundos };
}

function LightCard({ label, badge, numero, vence }: { label: string; badge: string; numero: string; vence: string }) {
  return (
    <div style={s.lightCard}>
      <div style={s.lightCardTop}>
        <div>
          <div style={s.lightCardLabel}>{label}</div>
          <div style={s.lightCardBrand}>
            <div style={s.lightCardBadge}>JB</div>
            <span style={{ fontWeight: 700, fontSize: 13 }}>Jes Bank</span>
          </div>
        </div>
        <span style={s.pill}>{badge}</span>
      </div>

      <div style={s.lightCardNumber}>{numero}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={s.microLabel}>TITULAR</div>
          <div style={s.holder}>SARA QUINTERO</div>
        </div>
        <div style={{ display: 'flex', gap: 22 }}>
          <div>
            <div style={s.microLabel}>VENCE</div>
            <div style={s.holder}>{vence}</div>
          </div>
          <div>
            <div style={s.microLabel}>CVV</div>
            <div style={s.holder}>•••</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Credenciales({ titulo, numero, vence, cvv, segundos }: { titulo: string; numero: string; vence: string; cvv: string; segundos: number }) {
  const [copiadoKey, setCopiadoKey] = useState<string | null>(null);

  const copiar = (key: string, valor: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(valor).catch(() => {});
    setCopiadoKey(key);
    setTimeout(() => setCopiadoKey((k) => (k === key ? null : k)), 1200);
  };

  const filas = [
    ['numero', 'NÚMERO DE TARJETA', numero],
    ['vence', 'FECHA DE EXPIRACIÓN', vence],
    ['cvv', 'CVV DINÁMICO', cvv],
  ] as [string, string, string][];

  return (
    <div style={s.sectionCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={s.sectionLabel}>{titulo}</span>
        <span style={s.cvvTimer}>
          <span style={s.cvvDot} /> CVV rota en: <b>{segundos}s</b>
        </span>
      </div>
      {filas.map(([key, label, valor]) => (
        <div key={key} style={s.credRow}>
          <div>
            <div style={s.credLabel}>{label}</div>
            <div style={s.credValue}>{valor}</div>
          </div>
          <button style={s.copyBtn} onClick={() => copiar(key, valor)}>
            {copiadoKey === key ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      ))}
    </div>
  );
}

const ICONOS_BOLSILLO = [
  { id: 'compras', label: 'Compras', Icon: Icon.ShoppingBag },
  { id: 'suscripciones', label: 'Suscripciones', Icon: Icon.Repeat },
  { id: 'viajes', label: 'Viajes', Icon: Icon.Plane },
  { id: 'otro', label: 'Otro', Icon: Icon.Wallet },
];

function iconoDe(id: string) {
  return ICONOS_BOLSILLO.find((i) => i.id === id)?.Icon || Icon.Wallet;
}
function numeroBolsillo(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 9000;
  return String(1000 + h);
}

function PocketCard({ pocket }: { pocket: any }) {
  const IconComp = iconoDe(pocket.iconId);
  return (
    <div style={s.pocketCard}>
      <div style={s.pocketIconWrap}>
        <IconComp size={16} />
      </div>
      <div style={s.pocketName}>{pocket.nombre}</div>
      <div style={s.pocketNumber}>•••• {numeroBolsillo(pocket.id)}</div>
      <div style={s.pocketLimit}>{pocket.limite ? money(pocket.limite) : 'Sin límite'}</div>
      <div style={s.pocketNote}>Se descuenta de tu tarjeta principal</div>
    </div>
  );
}

function CreatePocketModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: any) => void }) {
  const [nombre, setNombre] = useState('');
  const [limite, setLimite] = useState('');
  const [iconId, setIconId] = useState('compras');
  const listo = nombre.trim().length > 0;

  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={s.sectionLabel}>Nuevo bolsillo</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon.X />
          </button>
        </div>

        <label style={s.fieldLabel}>Nombre del bolsillo</label>
        <input style={s.input} placeholder="Streaming, mercado, viajes…" value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label style={s.fieldLabel}>Límite mensual (opcional)</label>
        <input style={s.input} placeholder="$ 200.000" value={limite} onChange={(e) => setLimite(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />

        <label style={s.fieldLabel}>Categoría</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          {ICONOS_BOLSILLO.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setIconId(id)} style={{ ...s.iconChoice, ...(iconId === id ? s.iconChoiceActive : {}) }} aria-label={label}>
              <Icon size={16} />
            </button>
          ))}
        </div>

        <div style={s.disclaimer}>El saldo de este bolsillo no es independiente: cada compra se descuenta directamente del cupo de tu tarjeta principal.</div>

        <button
          style={{ ...s.primaryBtn, marginTop: 14, opacity: listo ? 1 : 0.4 }}
          disabled={!listo}
          onClick={() => {
            onCreate({ id: `${Date.now()}`, nombre: nombre.trim(), limite: limite ? Number(limite) : null, iconId });
            onClose();
          }}
        >
          Crear bolsillo
        </button>
      </div>
    </div>
  );
}

function Bolsillos({ pockets, onCreate }: { pockets: any[]; onCreate: (p: any) => void }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div style={s.sectionCard}>
      <div style={s.sectionLabel}>Bolsillos</div>
      <div style={{ ...s.uploadHint, marginBottom: 12 }}>
        Crea sub-tarjetas para gastos específicos. Todo se descuenta de tu tarjeta principal.
      </div>
      <div style={s.pocketRow}>
        {pockets.map((p) => (
          <PocketCard key={p.id} pocket={p} />
        ))}
        <button style={s.pocketAddCard} onClick={() => setAbierto(true)}>
          <Icon.Plus size={18} />
          <span style={{ fontSize: 11, color: '#8a8a8a', marginTop: 6 }}>Nuevo bolsillo</span>
        </button>
      </div>
      {abierto && <CreatePocketModal onClose={() => setAbierto(false)} onCreate={onCreate} />}
    </div>
  );
}

function SolicitarCreditoBanner({ onSolicitarCredito }: { onSolicitarCredito?: () => void }) {
  return (
    <div style={s.banner}>
      <div style={s.bannerIcon}>
        <Icon.Wallet size={18} color="#fff" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={s.bannerTitle}>Aún no tienes tarjeta de crédito</div>
        <div style={s.bannerSub}>Solicítala y actívala en minutos, sin papeleo.</div>
      </div>
      <button style={s.bannerBtn} onClick={onSolicitarCredito}>
        Solicitar <Icon.ArrowRight size={14} />
      </button>
    </div>
  );
}

function TabDebito() {
  const numero = '4821 7381 2940 1827';
  const vence = '09/29';
  const { cvv, segundos } = useCvvRotativo();
  const [pockets, setPockets] = useState([{ id: 'seed-1', nombre: 'Streaming', limite: 80000, iconId: 'suscripciones' }]);

  return (
    <>
      <div style={s.sectionCard}>
        <LightCard label="TARJETA DE DÉBITO" badge="DÉBITO" numero={numero} vence={vence} />
      </div>
      <Credenciales titulo="Credenciales de débito" numero={numero} vence={vence} cvv={cvv} segundos={segundos} />
      <Bolsillos pockets={pockets} onCreate={(p) => setPockets((prev) => [...prev, p])} />
    </>
  );
}

function TabCredito({ creditCard, onSolicitarCredito }: { creditCard: any | null; onSolicitarCredito?: () => void }) {
  const numero = '5312 4470 8821 ' + (creditCard ? '3902' : '0000');
  const vence = '12/28';

  if (!creditCard) {
    return (
      <div style={s.sectionCard}>
        <SolicitarCreditoBanner onSolicitarCredito={onSolicitarCredito} />
      </div>
    );
  }

  const { producto, cupoNumero, gastado } = creditCard;
  const disponible = Math.max(cupoNumero - gastado, 0);
  const pct = Math.min(100, Math.round((gastado / cupoNumero) * 100));

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <CardFace producto={producto} />
      </div>

      <div style={s.sectionCard}>
        <div style={s.sectionLabel}>Cupo de la tarjeta</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ color: '#6b6b6b' }}>Cupo total</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{money(cupoNumero)}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ color: '#6b6b6b' }}>Disponible</div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{money(Math.max(cupoNumero - (creditCard.gastado||0), 0))}</div>
        </div>
        <div style={{ marginTop: 10, color: '#9ca3af', fontSize: 12 }}>Se muestra solo el cupo y disponible. El detalle de consumo no está disponible en esta vista.</div>
      </div>
    </>
  );
}

export default function TarjetasVirtuales({ creditCard = null, initialTab = 'debito', onSolicitarCredito, onBackToHome, onUpdateCreditCard }: { creditCard?: any | null; initialTab?: 'debito' | 'credito'; onSolicitarCredito?: () => void; onBackToHome?: () => void; onUpdateCreditCard?: (c: any) => void }) {
  const [tab, setTab] = useState<'debito' | 'credito'>(initialTab);
  const [localCard, setLocalCard] = useState<any | null>(creditCard);
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setLocalCard(creditCard);
  }, [creditCard]);

  // simulate a purchase on credit card
  const simulatePurchase = (amount: number) => {
    if (!localCard) return;
    const newGastado = Math.min(localCard.cupoNumero, (localCard.gastado || 0) + amount);
    const updated = { ...localCard, gastado: newGastado };
    setLocalCard(updated);
    if (onUpdateCreditCard) onUpdateCreditCard(updated);
  };

  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(txAmount.replace(/\D/g, '')) || 0;
    if (amt <= 0) return;
    simulatePurchase(amt);
    setTxAmount('');
    setTxDesc('');
  };

  return (
    <div style={s.frame}>
      <Header title="TARJETAS VIRTUALES" onBack={onBackToHome} />
      <div style={s.body}>
        <div style={s.h1}>Tarjetas virtuales</div>
        <div style={s.sub}>
          {tab === 'debito' ? 'Seguridad mejorada para tus transacciones por internet' : 'Tu tarjeta de crédito, siempre a la mano'}
        </div>

        <div style={s.tabs}>
          <button onClick={() => setTab('debito')} style={{ ...s.tabBtn, ...(tab === 'debito' ? s.tabBtnActive : {}) }}>
            Débito
          </button>
          <button onClick={() => setTab('credito')} style={{ ...s.tabBtn, ...(tab === 'credito' ? s.tabBtnActive : {}) }}>
            Crédito
          </button>
        </div>

        {tab === 'debito' && <TabDebito />}
        {tab === 'credito' && <>
          <TabCredito creditCard={localCard} onSolicitarCredito={onSolicitarCredito} />

          {/* Simulación de gasto: formulario simple (solo disponible si NO hay tarjeta de crédito activa) */}
          {!localCard && (
            <div style={{ ...s.sectionCard }}>
              <div style={s.sectionLabel}>Simular compra</div>
              <form onSubmit={handleSubmitTx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={txAmount} onChange={(e) => setTxAmount(e.target.value)} placeholder="$ 50.000" style={{ ...s.input, flex: 1 }} />
                <button type="submit" style={{ ...s.primaryBtn, padding: '10px 14px', width: 140 }}>
                  Hacer compra
                </button>
              </form>
              <div style={{ marginTop: 12, color: '#6a6a6a', fontSize: 13 }}>
                Si tienes tarjeta de crédito aprobada, el simulador no estará disponible aquí. Cuando tu tarjeta aparece en "Tarjetas virtuales", solo se muestra el cupo y consumo.
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

const s: Record<string, any> = {
  frame: {
    maxWidth: 400,
    margin: '0 auto',
    background: '#FAFAF9',
    minHeight: 700,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    borderRadius: 28,
    overflow: 'hidden',
    boxShadow: '0 0 0 1px #EFEFEC',
  },
  header: { background: '#000', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4 },
  headerTitle: { color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 1 },
  body: { padding: '20px 18px 32px' },
  h1: { fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4 },
  sub: { fontSize: 13, color: '#8a8a8a', marginBottom: 18, lineHeight: 1.5 },

  tabs: { display: 'flex', gap: 6, background: '#F2F2F0', borderRadius: 12, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, border: 'none', background: 'transparent', borderRadius: 9, padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#8a8a8a', cursor: 'pointer' },
  tabBtnActive: { background: '#fff', color: '#111', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' },

  sectionCard: { background: '#fff', border: '1px solid #EFEFEC', borderRadius: 20, padding: 18, marginBottom: 14 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#9a9a9a', textTransform: 'uppercase', marginBottom: 12 },
  condLabel: { fontSize: 13, color: '#111', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#adadad', lineHeight: 1.5, marginTop: 12 },

  pill: { background: '#fff', border: '1px solid #E1E1DC', color: '#6a6a6a', fontSize: 9, fontWeight: 700, letterSpacing: 0.5, padding: '5px 10px', borderRadius: 999 },

  lightCard: {
    borderRadius: 18,
    padding: 18,
    minHeight: 190,
    background: "radial-gradient(circle, #E3E3E0 1px, transparent 1px), linear-gradient(155deg, #F6F6F4 0%, #ECECE9 100%)",
    backgroundSize: '14px 14px, 100% 100%',
    border: '1px solid #E7E7E3',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  lightCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  lightCardLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: '#9a9a9a', marginBottom: 8 },
  lightCardBrand: { display: 'flex', alignItems: 'center', gap: 6, color: '#111' },
  lightCardBadge: { width: 22, height: 22, borderRadius: 6, background: '#111', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  lightCardNumber: { fontSize: 16, letterSpacing: 2, color: '#111', fontFamily: 'monospace', margin: '22px 0' },
  microLabel: { fontSize: 9, color: '#adadad', letterSpacing: 0.5 },
  holder: { fontSize: 12, fontWeight: 700, color: '#111', marginTop: 2 },

  cvvTimer: { fontSize: 10, color: '#adadad', display: 'flex', alignItems: 'center', gap: 5 },
  cvvDot: { width: 6, height: 6, borderRadius: '50%', background: '#111', display: 'inline-block' },
  credRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F7F7F5', borderRadius: 12, padding: '12px 14px', marginBottom: 10 },
  credLabel: { fontSize: 10, color: '#9a9a9a', letterSpacing: 0.4, marginBottom: 3 },
  credValue: { fontSize: 13, fontWeight: 700, color: '#111', fontFamily: 'monospace' },
  copyBtn: { background: '#fff', border: '1px solid #E1E1DC', borderRadius: 9, padding: '7px 12px', fontSize: 11, fontWeight: 600, color: '#111', cursor: 'pointer' },

  pocketRow: { display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 },
  pocketCard: { flex: '0 0 128px', background: '#F7F7F5', border: '1px solid #EFEFEC', borderRadius: 14, padding: 12 },
  pocketIconWrap: { width: 26, height: 26, borderRadius: 8, background: '#fff', border: '1px solid #E7E7E3', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  pocketName: { fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 4 },
  pocketNumber: { fontSize: 10, color: '#9a9a9a', fontFamily: 'monospace', marginBottom: 6 },
  pocketLimit: { fontSize: 11, fontWeight: 600, color: '#111', marginBottom: 6 },
  pocketNote: { fontSize: 9, color: '#b6b6b6', lineHeight: 1.3 },
  pocketAddCard: { flex: '0 0 128px', background: '#fff', border: '1.5px dashed #E1E1E1', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 128 },

  iconChoice: { width: 36, height: 36, borderRadius: 10, background: '#F2F2F0', border: '1px solid #EFEFEC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  iconChoiceActive: { background: '#111', border: '1px solid #111' },

  fieldLabel: { fontSize: 11, color: '#9a9a9a', marginTop: 10, marginBottom: 6, display: 'block' },
  input: { width: '100%', background: '#F7F7F5', border: '1px solid #EFEFEC', borderRadius: 12, padding: '11px 12px', fontSize: 13, color: '#111', boxSizing: 'border-box' },
  primaryBtn: { width: '100%', background: '#111', color: '#fff', border: 'none', borderRadius: 14, padding: '15px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4 },

  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 },
  modalCard: { background: '#fff', borderRadius: 20, padding: 20, maxWidth: 360, maxHeight: '80vh', overflowY: 'auto' },

  banner: { display: 'flex', alignItems: 'center', gap: 12, background: '#F7F7F5', borderRadius: 14, padding: 14 },
  bannerIcon: { width: 34, height: 34, borderRadius: 10, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bannerTitle: { fontSize: 13, fontWeight: 700, color: '#111' },
  bannerSub: { fontSize: 11, color: '#8a8a8a', marginTop: 2 },
  bannerBtn: { display: 'flex', alignItems: 'center', gap: 4, background: '#111', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 },

  progressTrack: { width: '100%', height: 8, background: '#F0F0EE', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#111', borderRadius: 999 },
  rangeEnd: { fontSize: 10, color: '#adadad' },
};
