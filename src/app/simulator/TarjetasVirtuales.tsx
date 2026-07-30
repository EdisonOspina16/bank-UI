'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardFace } from './TarjetasCredito';
import { AuthService } from '../../services/auth.service';

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

const ICONOS_BOLSILLO = [
  { id: 'compras', label: 'Compras', Icon: Icon.ShoppingBag },
  { id: 'suscripciones', label: 'Suscripciones', Icon: Icon.Repeat },
  { id: 'viajes', label: 'Viajes', Icon: Icon.Plane },
  { id: 'otro', label: 'Otro', Icon: Icon.Wallet },
];

function iconoDe(id: string) {
  return ICONOS_BOLSILLO.find((i) => i.id === id)?.Icon || Icon.Wallet;
}

function PocketCard({ pocket, onClick }: { pocket: any; onClick: () => void }) {
  const IconComp = iconoDe(pocket.icono);
  const remaining = Math.max(0, pocket.limite - pocket.saldoUsado);
  return (
    <div onClick={onClick} style={{ ...s.pocketCard, cursor: 'pointer' }}>
      <div style={s.pocketIconWrap}>
        <IconComp size={16} />
      </div>
      <div style={s.pocketName}>{pocket.nombre}</div>
      <div style={s.pocketLimit}>{money(remaining)}</div>
      <div style={s.pocketNote}>Creado del saldo principal</div>
    </div>
  );
}

function CreatePocketModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: { nombre: string; limite: number; icono: string }) => void }) {
  const [nombre, setNombre] = useState('');
  const [limite, setLimite] = useState('');
  const [iconId, setIconId] = useState('compras');
  const listo = nombre.trim().length > 0 && limite.trim().length > 0;

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

        <label style={s.fieldLabel}>Monto de dinero a transferir</label>
        <input style={s.input} placeholder="$ 200.000" value={limite} onChange={(e) => setLimite(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />

        <label style={s.fieldLabel}>Categoría</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, marginTop: 8 }}>
          {ICONOS_BOLSILLO.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setIconId(id)} style={{ ...s.iconChoice, ...(iconId === id ? s.iconChoiceActive : {}) }} aria-label={label}>
              <Icon size={16} color={iconId === id ? '#fff' : '#111'} />
            </button>
          ))}
        </div>

        <div style={s.disclaimer}>Este monto se descontará directamente del saldo disponible en tu tarjeta de débito principal.</div>

        <button
          style={{ ...s.primaryBtn, marginTop: 14, opacity: listo ? 1 : 0.4 }}
          disabled={!listo}
          onClick={() => {
            onCreate({ nombre: nombre.trim(), limite: Number(limite), icono: iconId });
            onClose();
          }}
        >
          Crear bolsillo
        </button>
      </div>
    </div>
  );
}

function EditPocketModal({ pocket, onClose, onUpdate, onDelete }: { pocket: any; onClose: () => void; onUpdate: (p: { nombre: string; limite: number; icono: string }) => void; onDelete: () => void }) {
  const [nombre, setNombre] = useState(pocket.nombre);
  const [limite, setLimite] = useState(String(pocket.limite));
  const [iconId, setIconId] = useState(pocket.icono || 'otro');
  const listo = nombre.trim().length > 0 && limite.trim().length > 0;

  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={s.sectionLabel}>Editar bolsillo</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon.X />
          </button>
        </div>

        <label style={s.fieldLabel}>Nombre del bolsillo</label>
        <input style={s.input} value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label style={s.fieldLabel}>Saldo del bolsillo (Límite)</label>
        <input style={s.input} value={limite} onChange={(e) => setLimite(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />

        <label style={s.fieldLabel}>Categoría</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, marginTop: 8 }}>
          {ICONOS_BOLSILLO.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setIconId(id)} style={{ ...s.iconChoice, ...(iconId === id ? s.iconChoiceActive : {}) }} aria-label={label}>
              <Icon size={16} color={iconId === id ? '#fff' : '#111'} />
            </button>
          ))}
        </div>

        <div style={s.disclaimer}>El aumento o disminución del saldo ajustará el dinero disponible en tu cuenta principal de débito.</div>

        <button
          style={{ ...s.primaryBtn, marginTop: 14, opacity: listo ? 1 : 0.4 }}
          disabled={!listo}
          onClick={() => {
            onUpdate({ nombre: nombre.trim(), limite: Number(limite), icono: iconId });
            onClose();
          }}
        >
          Guardar cambios
        </button>

        <button
          style={{ ...s.primaryBtn, marginTop: 8, background: '#dc2626' }}
          onClick={() => {
            if (confirm(`¿Estás seguro de eliminar el bolsillo "${pocket.nombre}"? Los fondos restantes volverán a tu saldo principal.`)) {
              onDelete();
              onClose();
            }
          }}
        >
          Eliminar bolsillo
        </button>
      </div>
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

export default function TarjetasVirtuales({
  creditCard = null,
  initialTab = 'debito',
  onSolicitarCredito,
  onBackToHome,
  onUpdateCreditCard,
}: {
  creditCard?: any | null;
  initialTab?: 'debito' | 'credito';
  onSolicitarCredito?: () => void;
  onBackToHome?: () => void;
  onUpdateCreditCard?: (c: any) => void;
}) {
  const [tab, setTab] = useState<'debito' | 'credito'>(initialTab);
  
  // Debit card state loaded from backend
  const [debitCard, setDebitCard] = useState<any | null>(null);
  const [cvv, setCvv] = useState('');
  const [segundos, setSegundos] = useState(45);
  
  const [showCreatePocket, setShowCreatePocket] = useState(false);
  const [selectedPocket, setSelectedPocket] = useState<any | null>(null);

  // Credit Card Simulated Transactions
  const [txAmount, setTxAmount] = useState('');
  const [txTarget, setTxTarget] = useState<'principal' | string>('principal'); // 'principal' or pocketId
  const [txCardType, setTxCardType] = useState<'debito' | 'credito'>('debito');

  const [loading, setLoading] = useState(true);

  const fetchDebitCardData = async () => {
    let token = AuthService.getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      let res = await fetch(`${API_URL}/api/tarjeta-debito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        const refreshed = await AuthService.refreshSession();
        if (refreshed) {
          token = refreshed;
          res = await fetch(`${API_URL}/api/tarjeta-debito`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
      const body = await res.json();
      if (res.ok && body.card) {
        setDebitCard(body.card);
        setCvv(body.card.cvv);
      } else {
        console.error('Error fetching debit card details:', body.error || res.statusText);
      }
    } catch (e) {
      console.error('Error fetching debit card details:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCvv = async () => {
    const token = AuthService.getAccessToken();
    if (!token) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/tarjeta-debito/cvv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      if (res.ok && body.cvv) {
        setCvv(body.cvv);
        setSegundos(body.secondsLeft || 45);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    fetchDebitCardData();
  }, []);

  // CVV Rotate timer
  useEffect(() => {
    fetchCvv();
    const interval = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          fetchCvv();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pocket CRUD Actions
  const handleCreatePocket = async (payload: { nombre: string; limite: number; icono: string }) => {
    const token = AuthService.getAccessToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/tarjeta-debito/bolsillos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to create pocket');
      fetchDebitCardData();
    } catch (e: any) {
      alert(e.message || 'Error al crear bolsillo');
    }
  };

  const handleUpdatePocket = async (payload: { nombre: string; limite: number; icono: string }) => {
    if (!selectedPocket) return;
    const token = AuthService.getAccessToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/tarjeta-debito/bolsillos/${selectedPocket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to update pocket');
      fetchDebitCardData();
      setSelectedPocket(null);
    } catch (e: any) {
      alert(e.message || 'Error al actualizar bolsillo');
    }
  };

  const handleDeletePocket = async () => {
    if (!selectedPocket) return;
    const token = AuthService.getAccessToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/tarjeta-debito/bolsillos/${selectedPocket.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to delete pocket');
      fetchDebitCardData();
      setSelectedPocket(null);
    } catch (e: any) {
      alert(e.message || 'Error al eliminar bolsillo');
    }
  };

  // Debit Transaction Simulation
  const handleDebitTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(txAmount.replace(/\D/g, '')) || 0;
    if (amt <= 0) return;

    const token = AuthService.getAccessToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const payload = {
        amount: amt,
        bolsilloId: txTarget === 'principal' ? undefined : txTarget,
        tipo: 'compra', // Default to payment purchase
      };

      const res = await fetch(`${API_URL}/api/tarjeta-debito/transaccion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Transaction failed');

      alert(`Compra exitosa por ${money(amt)}.`);
      fetchDebitCardData();
      setTxAmount('');
    } catch (e: any) {
      alert(e.message || 'Error al procesar transacción');
    }
  };

  // Credit Card simulated transaction (Registers a Gasto)
  const handleCreditTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditCard) return;

    const amt = Number(txAmount.replace(/\D/g, '')) || 0;
    if (amt <= 0) return;

    const token = AuthService.getAccessToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_URL}/api/tarjetas-credito/${creditCard.id}/gasto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amt }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to record expense');

      alert(`Gasto registrado por ${money(amt)} con éxito.`);
      setTxAmount('');

      // Notify parent to refresh state
      if (onUpdateCreditCard) {
        const mergedProduct = {
          ...creditCard,
          gastado: body.tarjeta.gastado,
        };
        onUpdateCreditCard(mergedProduct);
      }
    } catch (e: any) {
      alert(e.message || 'Error al registrar el gasto');
    }
  };

  // Cancel Credit Card
  const handleCancelCreditCard = async () => {
    if (!creditCard) return;
    if (!confirm('¿Estás seguro de que deseas cancelar de forma permanente tu tarjeta de crédito? Esta acción no se puede deshacer.')) return;

    const token = AuthService.getAccessToken();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_URL}/api/tarjetas-credito/${creditCard.id}/cancelar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to cancel card');

      alert('Tarjeta de crédito cancelada con éxito.');

      // Update parent component state
      if (onUpdateCreditCard) {
        onUpdateCreditCard(null);
      }
    } catch (e: any) {
      alert(e.message || 'Error al cancelar la tarjeta');
    }
  };

  if (loading) {
    return (
      <div style={{ ...s.frame, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 700 }}>
        <p>Cargando tarjetas...</p>
      </div>
    );
  }

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

        {tab === 'debito' && !debitCard && (
          <div style={s.sectionCard}>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
              No se pudo cargar tu tarjeta de débito. Cierra sesión, vuelve a entrar e inténtalo de nuevo.
            </p>
            <button style={{ ...s.primaryBtn, marginTop: 12 }} onClick={() => { setLoading(true); fetchDebitCardData(); }}>
              Reintentar
            </button>
          </div>
        )}

        {tab === 'debito' && debitCard && (
          <>
            <div style={s.sectionCard}>
              <LightCard
                label="TARJETA DE DÉBITO"
                badge="DÉBITO"
                numero={debitCard.numero}
                vence={debitCard.vence}
                titular={debitCard.titular}
              />
            </div>

            <Credenciales
              titulo="Credenciales de débito"
              numero={debitCard.numero}
              vence={debitCard.vence}
              cvv={cvv}
              segundos={segundos}
            />

            <div style={s.sectionCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={s.sectionLabel}>Saldo principal</span>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{money(debitCard.saldo)}</span>
              </div>
            </div>

            <div style={s.sectionCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={s.sectionLabel}>Bolsillos</span>
                <button
                  onClick={() => setShowCreatePocket(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  <Icon.Plus size={14} /> Crear nuevo
                </button>
              </div>

              <div style={s.pocketRow}>
                {debitCard.bolsillos.length === 0 ? (
                  <div style={{ color: '#8a8a8a', fontSize: 12, padding: '10px 0' }}>No tienes bolsillos creados.</div>
                ) : (
                  debitCard.bolsillos.map((p: any) => (
                    <PocketCard key={p.id} pocket={p} onClick={() => setSelectedPocket(p)} />
                  ))
                )}
              </div>
            </div>

            <div style={s.sectionCard}>
              <div style={s.sectionLabel}>Simular gasto (Débito)</div>
              <form onSubmit={handleDebitTransactionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="Monto $ 50.000"
                    style={{ ...s.input, flex: 1 }}
                  />
                  <select
                    value={txTarget}
                    onChange={(e) => setTxTarget(e.target.value)}
                    style={{ ...s.input, width: 140, background: '#fff', border: '1px solid #EFEFEC', height: 41, padding: '0 8px', borderRadius: 12 }}
                  >
                    <option value="principal">Cuenta Principal</option>
                    {debitCard.bolsillos.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        Bolsillo: {b.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" style={s.primaryBtn}>
                  Realizar pago simulado
                </button>
              </form>
            </div>
          </>
        )}

        {tab === 'credito' && (
          <>
            {creditCard ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <CardFace producto={creditCard} />
                </div>

                <div style={s.sectionCard}>
                  <div style={s.sectionLabel}>Cupo de la tarjeta</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{ color: '#6b6b6b' }}>Cupo total</div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{money(creditCard.cupoAsignado)}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{ color: '#6b6b6b' }}>Gastado</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#dc2626' }}>{money(creditCard.gastado || 0)}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <div style={{ color: '#6b6b6b' }}>Disponible</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#10b981' }}>
                      {money(Math.max(0, creditCard.cupoAsignado - (creditCard.gastado || 0)))}
                    </div>
                  </div>

                  {/* Cupo progress bar */}
                  <div style={{ marginTop: 15 }}>
                    <div style={s.progressTrack}>
                      <div
                        style={{
                          ...s.progressFill,
                          width: `${Math.min(100, Math.round(((creditCard.gastado || 0) / creditCard.cupoAsignado) * 100))}%`,
                          background: (creditCard.gastado || 0) / creditCard.cupoAsignado > 0.85 ? '#dc2626' : '#111',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={s.sectionCard}>
                  <div style={s.sectionLabel}>Registrar gasto (Crédito)</div>
                  <form onSubmit={handleCreditTransactionSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value.replace(/\D/g, ''))}
                      placeholder="$ 50.000"
                      style={{ ...s.input, flex: 1 }}
                    />
                    <button type="submit" style={{ ...s.primaryBtn, padding: '10px 14px', width: 120, marginTop: 0 }}>
                      Registrar
                    </button>
                  </form>
                </div>

                <button
                  onClick={handleCancelCreditCard}
                  style={{ ...s.primaryBtn, background: '#dc2626', color: '#fff', marginBottom: 20 }}
                >
                  Cancelar tarjeta de crédito
                </button>
              </>
            ) : (
              <div style={s.sectionCard}>
                <SolicitarCreditoBanner onSolicitarCredito={onSolicitarCredito} />
              </div>
            )}
          </>
        )}
      </div>

      {showCreatePocket && (
        <CreatePocketModal onClose={() => setShowCreatePocket(false)} onCreate={handleCreatePocket} />
      )}

      {selectedPocket && (
        <EditPocketModal
          pocket={selectedPocket}
          onClose={() => setSelectedPocket(null)}
          onUpdate={handleUpdatePocket}
          onDelete={handleDeletePocket}
        />
      )}
    </div>
  );
}

function Credenciales({
  titulo,
  numero,
  vence,
  cvv,
  segundos,
}: {
  titulo: string;
  numero: string;
  vence: string;
  cvv: string;
  segundos: number;
}) {
  const [copiadoKey, setCopiadoKey] = useState<string | null>(null);

  const copiar = (key: string, valor: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(valor).catch(() => {});
    }
    setCopiadoKey(key);
    setTimeout(() => setCopiadoKey(null), 1200);
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

function LightCard({
  label,
  badge,
  numero,
  vence,
  titular,
}: {
  label: string;
  badge: string;
  numero: string;
  vence: string;
  titular?: string;
}) {
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
          <div style={s.holder}>{titular || '—'}</div>
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

  banner: { display: 'flex', alignItems: 'center', gap: 12, background: '#F7F7F5', borderRadius: 14, padding: 14, width: '100%', boxSizing: 'border-box' },
  bannerIcon: { width: 34, height: 34, borderRadius: 10, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bannerTitle: { fontSize: 13, fontWeight: 700, color: '#111' },
  bannerSub: { fontSize: 11, color: '#8a8a8a', marginTop: 2 },
  bannerBtn: { display: 'flex', alignItems: 'center', gap: 4, background: '#111', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0 },

  progressTrack: { width: '100%', height: 8, background: '#F0F0EE', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#111', borderRadius: 999 },
};
