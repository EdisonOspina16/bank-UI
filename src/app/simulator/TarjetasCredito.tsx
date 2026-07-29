'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  Check: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Upload: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 5 17 10" />
      <line x1="12" y1="5" x2="12" y2="19" />
    </svg>
  ),
  FileText: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  X: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Wifi: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0114.08 0" />
      <path d="M8.53 16.11a6 6 0 016.95 0" />
      <path d="M12 20v.01" />
    </svg>
  ),
};

export const PRODUCTS = [
  {
    id: 'clasica',
    nombre: 'Jes Clásica',
    franquicia: 'Visa',
    tag: 'Para empezar',
    bg: 'linear-gradient(160deg, #3c3c3c 0%, #1c1c1c 50%, #050505 100%)',
    accent: '#D8B879',
    network: 'VISA',
    cupo: '$500.000 – $5.000.000',
    cupoNumero: 3000000,
    cuotaManejo: '$0 los primeros 3 meses, luego según tarifa vigente',
    tasa: 'Hasta la tasa de usura vigente para crédito de consumo (informada mensualmente por la Superintendencia Financiera)',
    edad: '18 a 69 años',
    ingresos: 'Sin ingreso mínimo estricto — sujeta a estudio de crédito',
    beneficios: ['Compras a cuotas', 'Seguro de protección en compras', 'App de control total'],
  },
  {
    id: 'oro',
    nombre: 'Jes Oro',
    franquicia: 'Mastercard',
    tag: 'La más pedida',
    bg: 'linear-gradient(160deg, #F0DBA6 0%, #C9A15C 45%, #8F6B32 100%)',
    accent: '#3B2A12',
    network: 'MASTERCARD',
    cupo: '$3.000.000 – $15.000.000',
    cupoNumero: 9000000,
    cuotaManejo: 'Tarifa media, exonerable según nivel de consumo mensual',
    tasa: 'Hasta la tasa de usura vigente para crédito de consumo (informada mensualmente por la Superintendencia Financiera)',
    edad: '18 a 69 años',
    ingresos: 'Ingresos demostrables recomendados desde 2 SMMLV',
    beneficios: ['Acumulación de puntos', 'Seguro de viaje básico', 'Descuentos en aliados'],
  },
  {
    id: 'platinum',
    nombre: 'Jes Platinum',
    franquicia: 'Mastercard',
    tag: 'Premium',
    bg: 'linear-gradient(160deg, #EDEDEB 0%, #BEBEBC 45%, #8C8C8A 100%)',
    accent: '#1a1a1a',
    network: 'MASTERCARD',
    cupo: 'Desde $15.000.000',
    cupoNumero: 25000000,
    cuotaManejo: 'Exonerada de forma permanente cumpliendo consumo mínimo mensual',
    tasa: 'Hasta la tasa de usura vigente para crédito de consumo (informada mensualmente por la Superintendencia Financiera)',
    edad: '18 a 69 años',
    ingresos: 'Ingresos demostrables altos y excelente historial crediticio',
    beneficios: ['Salas VIP en aeropuertos', 'Seguro de viaje internacional', 'Asistente personal 24/7'],
  },
];

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

function Chip({ color }: { color: string }) {
  return (
    <div style={{ width: 30, height: 22, borderRadius: 5, background: `${color}26`, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, padding: 3, boxSizing: 'border-box' }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ background: color, borderRadius: 1, opacity: 0.85 }} />
      ))}
    </div>
  );
}

export function CardFace({ producto, mini }: { producto: any; mini?: boolean }) {
  // Versión interactiva: tarjeta con efecto flip para ver anverso y reverso al tocar
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ ...(mini ? s.miniCard : s.card), perspective: 1000, position: 'relative' }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((v) => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped((v) => !v); }}
        style={{ ...s.flippableWrap }}
      >
        <div style={{ ...s.flippableInner, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {/* Front */}
          <div style={{ ...s.frontFace, background: producto.bg, opacity: flipped ? 0 : 1, pointerEvents: flipped ? 'none' : 'auto', transform: 'rotateY(0deg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* left: subtle chip-like mark */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 28, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.12)' }} />
              </div>

              {/* center: JES branding, tipografía clásica y elegante */}
              <div style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
                <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'normal', fontWeight: 700, letterSpacing: 1.5, fontSize: mini ? 16 : 20, color: producto.accent, textTransform: 'uppercase' }}>
                  JES
                </span>
              </div>

              {/* right: small JB badge */}
              <div style={{ marginLeft: 'auto' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 800 }}>JB</div>
              </div>
            </div>

            <div style={{ marginTop: mini ? 20 : 34 }}>
              <div style={{ fontSize: mini ? 15 : 17, fontWeight: 700, color: producto.accent }}>{producto.nombre}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: producto.accent, opacity: 0.75, marginTop: 2 }}>
                {producto.network}
              </div>
            </div>

            {/* Small accent animation */}
            <div style={{ position: 'absolute', right: 18, bottom: 18, width: 64, height: 64, borderRadius: 999, boxShadow: 'inset -8px -8px 30px rgba(255,255,255,0.02), inset 8px 8px 30px rgba(0,0,0,0.08)', opacity: 0.06 }} />

          </div>

          {/* Back */}
          <div style={{ ...s.backFace, opacity: flipped ? 1 : 0, pointerEvents: flipped ? 'auto' : 'none' }}>
            <div style={{ height: 42, background: '#111', borderRadius: 6, marginBottom: 18 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
              <div style={{ fontSize: 10, color: '#9a9a9a', letterSpacing: 1.5, textTransform: 'uppercase' }}>TITULAR</div>
              <div style={{ fontSize: mini ? 15 : 18, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{producto.nombre}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a9a9a', fontSize: 11, textAlign: 'center', lineHeight: 1.6 }}>
              Tarjeta digital para tus gastos premium. Mantén tus datos seguros y gestiona tu crédito desde la app.
            </div>
            <div style={{ position: 'absolute', right: 14, bottom: 14, fontSize: 10, color: '#bdbdbd' }}>JES BANK • 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Catalogo({ onSelect }: { onSelect: (p: any) => void }) {
  return (
    <div style={s.body}>
      <div style={s.h1}>Elige tu tarjeta</div>
      <div style={s.sub}>Compara condiciones reales y solicita en minutos</div>

      {PRODUCTS.map((p) => (
        <button key={p.id} onClick={() => onSelect(p)} style={s.catalogCardBtn}>
          <CardFace producto={p} mini />
          <div style={s.catalogRow}>
            <span style={s.catalogLabel}>{p.tag} · Cupo</span>
            <span style={s.catalogValue}>{p.cupo}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function Detalle({ producto, onSolicitar }: { producto: any; onSolicitar: () => void }) {
  const rows = [
    ['Cupo de crédito', producto.cupo],
    ['Cuota de manejo', producto.cuotaManejo],
    ['Tasa de interés', producto.tasa],
    ['Edad requerida', producto.edad],
    ['Ingresos', producto.ingresos],
  ];
  return (
    <div style={s.body}>
      <div style={{ marginBottom: 20 }}>
        <CardFace producto={producto} mini />
      </div>

      <div style={s.sectionCard}>
        <div style={s.sectionLabel}>Condiciones</div>
        {rows.map(([label, value]) => (
          <div key={label as string} style={s.condRow}>
            <span style={s.condLabel}>{label}</span>
            <span style={s.condValue}>{value as string}</span>
          </div>
        ))}
        <div style={s.disclaimer}>
          Las tasas y cupos se calculan según tu estudio de crédito y pueden variar mes a mes según la
          Superintendencia Financiera de Colombia.
        </div>
      </div>

      <div style={s.sectionCard}>
        <div style={s.sectionLabel}>Beneficios</div>
        {producto.beneficios.map((b: string) => (
          <div key={b} style={s.benefitRow}>
            <Icon.Check />
            <span style={s.condLabel}>{b}</span>
          </div>
        ))}
      </div>

      <button style={s.primaryBtn} onClick={onSolicitar}>
        Solicitar {producto.nombre}
      </button>
    </div>
  );
}

function UploadZone({ label, done, onToggle }: { label: string; done: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ ...s.uploadZone, borderColor: done ? '#111' : '#E1E1E1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ ...s.uploadIcon, background: done ? '#111' : '#F2F2F0' }}>
          {done ? <Icon.Check /> : <Icon.Upload />}
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={s.uploadLabel}>{label}</div>
          <div style={s.uploadHint}>{done ? 'Documento cargado' : 'JPG, PNG o PDF · máx 5MB'}</div>
        </div>
      </div>
      <Icon.FileText />
    </button>
  );
}

function Solicitud({ producto, onEnviar }: { producto: any; onEnviar: () => void }) {
  const [nombre, setNombre] = useState('');
  const [ingresos, setIngresos] = useState('');
  const [cedula, setCedula] = useState(false);
  const [comprobante, setComprobante] = useState(false);
  const [acepta, setAcepta] = useState(false);
  const [verReglamento, setVerReglamento] = useState(false);

  const listo = nombre.trim() && ingresos.trim() && cedula && comprobante && acepta;

  return (
    <div style={s.body}>
      <div style={s.h1}>Completa tu solicitud</div>
      <div style={s.sub}>{producto.nombre} · {producto.franquicia}</div>

      <div style={s.sectionCard}>
        <div style={s.sectionLabel}>Datos personales</div>
        <label style={s.fieldLabel}>Nombre completo</label>
        <input style={s.input} placeholder="Como aparece en tu cédula" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <label style={s.fieldLabel}>Ingresos mensuales</label>
        <input style={s.input} placeholder="$ 2.000.000" value={ingresos} onChange={(e) => setIngresos(e.target.value)} inputMode="numeric" />
      </div>

      <div style={s.sectionCard}>
        <div style={s.sectionLabel}>Documentos</div>
        <UploadZone label="Cédula de ciudadanía" done={cedula} onToggle={() => setCedula((v) => !v)} />
        <div style={{ height: 10 }} />
        <UploadZone label="Comprobante de ingresos" done={comprobante} onToggle={() => setComprobante((v) => !v)} />
      </div>

      <div style={s.sectionCard}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} style={{ marginTop: 3 }} />
          <div style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.5 }}>
            Acepto el{' '}
            <span style={{ color: '#111', fontWeight: 600, cursor: 'pointer' }} onClick={() => setVerReglamento(true)}>
              reglamento de tarjeta de crédito
            </span>{' '}
            de JES BANK y autorizo la consulta de mi historial crediticio.
          </div>
        </div>
      </div>

      <button style={{ ...s.primaryBtn, opacity: listo ? 1 : 0.4 }} disabled={!listo} onClick={onEnviar}>
        Enviar solicitud
      </button>

      {verReglamento && <ReglamentoModal onClose={() => setVerReglamento(false)} />}
    </div>
  );
}

function ReglamentoModal({ onClose }: { onClose: () => void }) {
  const puntos = [
    'La aprobación depende del estudio de crédito, capacidad de endeudamiento e historial financiero del solicitante.',
    'El titular debe tener entre 18 y 69 años y presentar cédula vigente y comprobante de ingresos.',
    'El cupo asignado, la cuota de manejo y la tasa de interés se informan al momento de la aprobación y pueden actualizarse mes a mes.',
    'El titular es responsable de custodiar su tarjeta, su clave y el código de seguridad (CVV).',
    'Ante pérdida, robo o uso no autorizado, el titular debe bloquear la tarjeta de inmediato desde la app o la línea de atención.',
    'El incumplimiento en los pagos genera intereses de mora y puede afectar el historial crediticio ante centrales de riesgo.',
  ];
  return (
    <div style={s.modalOverlay} onClick={onClose}>
      <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={s.sectionLabel}>Reglamento — resumen</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Icon.X />
          </button>
        </div>
        {puntos.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{i + 1}.</span>
            <span style={{ fontSize: 13, color: '#4a4a4a', lineHeight: 1.5 }}>{p}</span>
          </div>
        ))}
        <div style={s.disclaimer}>Documento completo disponible en el archivo de reglamento adjunto.</div>
      </div>
    </div>
  );
}

function Procesando() {
  return (
    <div style={{ ...s.body, alignItems: 'center', justifyContent: 'center', minHeight: 420, display: 'flex', flexDirection: 'column' }}>
      <div style={s.spinner} />
      <div style={{ ...s.h1, marginTop: 22, textAlign: 'center' }}>Verificando tu información</div>
      <div style={{ ...s.sub, textAlign: 'center' }}>Esto solo toma unos segundos</div>
    </div>
  );
}

function Aprobada({ producto, onVerTarjeta }: { producto: any; onVerTarjeta: (p: any) => void }) {
  return (
    <div style={{ ...s.body, alignItems: 'center', textAlign: 'center' }}>
      <div style={s.checkCircle}>
        <Icon.Check />
      </div>
      <div style={s.h1}>Solicitud aprobada</div>
      <div style={s.sub}>
        Tu {producto.nombre} fue aprobada. Ya puedes verla y usarla desde Tarjetas virtuales mientras te llega el
        plástico físico.
      </div>
      <button style={{ ...s.primaryBtn, marginTop: 24 }} onClick={() => onVerTarjeta(producto)}>
        Ver mi tarjeta
      </button>
    </div>
  );
}

export default function TarjetasCredito({ onAprobada, onBackToHome }: { onAprobada?: (p: any) => void; onBackToHome?: () => void }) {
  const [screen, setScreen] = useState<'catalog' | 'detail' | 'apply' | 'processing' | 'approved'>('catalog');
  const [producto, setProducto] = useState<any | null>(null);

  const titles = {
    catalog: 'TARJETAS',
    detail: producto?.nombre?.toUpperCase() || 'TARJETA',
    apply: 'SOLICITUD',
    processing: 'TARJETAS',
    approved: 'TARJETAS',
  } as const;

  return (
    <div style={s.frame}>
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      <Header
        title={titles[screen]}
        onBack={() => {
          if (screen === 'catalog') onBackToHome && onBackToHome();
          else if (screen === 'detail') setScreen('catalog');
          else if (screen === 'apply') setScreen('detail');
          else setScreen('catalog');
        }}
      />

      {screen === 'catalog' && (
        <Catalogo
          onSelect={(p) => {
            setProducto(p);
            setScreen('detail');
          }}
        />
      )}
      {screen === 'detail' && <Detalle producto={producto} onSolicitar={() => setScreen('apply')} />}
      {screen === 'apply' && (
        <Solicitud
          producto={producto}
          onEnviar={() => {
            setScreen('processing');
            setTimeout(() => setScreen('approved'), 1800);
          }}
        />
      )}
      {screen === 'processing' && <Procesando />}
      {screen === 'approved' && (
        <Aprobada
          producto={producto}
          onVerTarjeta={(p) => {
            onAprobada && onAprobada(p);
            setScreen('catalog');
          }}
        />
      )}
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

  catalogCardBtn: { display: 'block', width: '100%', background: '#fff', border: '1px solid #EFEFEC', borderRadius: 20, padding: 14, marginBottom: 14, cursor: 'pointer', textAlign: 'left' },
  miniCard: { borderRadius: 16, padding: 16, height: 150, boxSizing: 'border-box' },
  card: { borderRadius: 20, padding: 18, height: 190, boxSizing: 'border-box' },
  cardTopRow: { display: 'flex', alignItems: 'center' },
  catalogRow: { display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '0 2px' },
  catalogLabel: { fontSize: 12, color: '#9a9a9a' },
  catalogValue: { fontSize: 12, fontWeight: 600, color: '#111' },

  /* Styles para tarjeta interactiva */
  flippableWrap: { width: '100%', height: '100%', cursor: 'pointer', display: 'block', borderRadius: 16, position: 'relative', transformStyle: 'preserve-3d' },
  flippableInner: { width: '100%', height: '100%', position: 'relative', transition: 'transform 0.6s ease', transformStyle: 'preserve-3d' },
  frontFace: { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 16, padding: 18, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' },
  backFace: { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 16, padding: 18, boxSizing: 'border-box', background: '#111', color: '#fff', transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' },

  sectionCard: { background: '#fff', border: '1px solid #EFEFEC', borderRadius: 20, padding: 18, marginBottom: 14 },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#9a9a9a', textTransform: 'uppercase', marginBottom: 12 },
  condRow: { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderTop: '1px solid #F4F4F2' },
  condLabel: { fontSize: 13, color: '#111', fontWeight: 500 },
  condValue: { fontSize: 12, color: '#6a6a6a', textAlign: 'right', maxWidth: '58%' },
  disclaimer: { fontSize: 11, color: '#adadad', lineHeight: 1.5, marginTop: 12 },
  benefitRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' },

  primaryBtn: { width: '100%', background: '#111', color: '#fff', border: 'none', borderRadius: 14, padding: '15px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 4 },

  fieldLabel: { fontSize: 11, color: '#9a9a9a', marginTop: 10, marginBottom: 6, display: 'block' },
  input: { width: '100%', background: '#F7F7F5', border: '1px solid #EFEFEC', borderRadius: 12, padding: '11px 12px', fontSize: 13, color: '#111', boxSizing: 'border-box' },

  uploadZone: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAF9', border: '1.5px dashed #E1E1E1', borderRadius: 14, padding: '12px 14px', cursor: 'pointer' },
  uploadIcon: { width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uploadLabel: { fontSize: 13, fontWeight: 600, color: '#111' },
  uploadHint: { fontSize: 11, color: '#adadad', marginTop: 1 },

  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 },
  modalCard: { background: '#fff', borderRadius: 20, padding: 20, maxWidth: 360, maxHeight: '80vh', overflowY: 'auto' },

  spinner: { width: 44, height: 44, borderRadius: '50%', border: '3px solid #EFEFEC', borderTopColor: '#111', animation: 'spin 0.8s linear infinite' },
  checkCircle: { width: 56, height: 56, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
};
