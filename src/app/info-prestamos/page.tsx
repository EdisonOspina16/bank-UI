'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const BENEFITS = [
  {
    title: 'Tasa dentro del tope legal',
    desc: 'La tasa efectiva anual nunca supera el máximo autorizado por la Superintendencia Financiera, y la ves en la app antes de aceptar.',
  },
  {
    title: 'Sin cobros ocultos',
    desc: 'No hay cuota de manejo ni seguros obligatorios: solo pagas el interés pactado desde el inicio.',
  },
  {
    title: 'Pago anticipado sin penalidad',
    desc: 'Abona o cancela tu préstamo antes de tiempo cuando quieras, sin costos adicionales.',
  },
  {
    title: 'Desembolso inmediato',
    desc: 'Una vez aceptas las condiciones, el dinero llega a tu cuenta Jes Bank en segundos.',
  },
];

const REQUIREMENTS = [
  'Ser mayor de edad',
  'Cédula de ciudadanía vigente',
  'Tener una cuenta de ahorros Jes Bank activa',
  'Buen historial de pago en tus productos Jes Bank',
  'Capacidad de pago acorde al monto solicitado',
];

const DOCUMENTS = [
  { name: 'Cédula', desc: 'Documento de identidad vigente, por ambas caras.' },
  { name: 'Certificado laboral', desc: 'Con fecha de expedición no mayor a 30 días.' },
  { name: 'Comprobante de ingresos', desc: 'Últimos 3 desprendibles de nómina o extractos.' },
];

const STEPS = [
  { n: '01', title: 'Simula tu préstamo', desc: 'Ajusta el monto, entre $100.000 y $5.000.000, y el plazo, hasta 60 cuotas, para ver tu cuota estimada.' },
  { n: '02', title: 'Revisa la tasa antes de aceptar', desc: 'Verás la tasa efectiva anual y el total a pagar con total claridad, sin letra pequeña.' },
  { n: '03', title: 'Confirma la solicitud', desc: 'Aceptas las condiciones directamente desde tu cuenta, sin papeleos ni firmas físicas.' },
  { n: '04', title: 'Recibe el dinero', desc: 'El desembolso llega a tu cuenta Jes Bank en segundos, listo para usar.' },
];

const FAQS = [
  {
    q: '¿Cuánto puedo solicitar?',
    a: 'Puedes simular montos entre $100.000 y $5.000.000, con plazos de 1 hasta 60 cuotas. El monto exacto disponible para ti depende de tu perfil y tu historial.',
  },
  {
    q: '¿Cómo se calcula la tasa de interés?',
    a: 'La tasa efectiva anual se ajusta cada mes y nunca supera el tope máximo autorizado por la Superintendencia Financiera de Colombia. La verás con claridad antes de aceptar cualquier condición.',
  },
  {
    q: '¿Tiene seguros o cuota de manejo?',
    a: 'No. El préstamo no incluye seguros obligatorios ni cuota de manejo; solo pagas el interés pactado desde el inicio.',
  },
  {
    q: '¿Puedo pagar mi préstamo antes de tiempo?',
    a: 'Sí. Puedes hacer abonos o cancelar tu préstamo de forma anticipada, sin penalidades por pago anticipado.',
  },
  {
    q: '¿Necesito ser cliente de Jes Bank para solicitar un préstamo?',
    a: 'Puedes simular sin ser cliente, pero para enviar la solicitud necesitas una cuenta de ahorros Jes Bank activa e iniciar sesión.',
  },
];

const NAV_LINKS = ['Personal', 'Empresas', 'Blog', 'Ayuda'];

function Navbar({ onEnter }: { readonly onEnter: () => void }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-1.5">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-black text-xs">JB</span>
          </div>
          <span className="text-black font-bold text-lg tracking-tight">Jes Bank</span>
        </button>

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

function Hero({ onSimulate }: { readonly onSimulate: () => void }) {
  return (
    <section className="pt-32 pb-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-8">
            Financiación · Jes Bank
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black leading-[1] tracking-tight mb-5">
            Préstamos<br />Jes Bank
          </h1>


          <p className="text-xl text-zinc-500 leading-relaxed max-w-xl mb-12">
            Desde $100.000 hasta $5.000.000, a un plazo de hasta 60 cuotas. Simula tu préstamo
            en minutos y mira tu tasa y tu cuota antes de aceptar nada.
          </p>
          <button
            onClick={onSimulate}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-zinc-800 transition-colors"
          >
            Simular ahora
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="rounded-[2rem] overflow-hidden h-80 lg:h-[420px] bg-zinc-100">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85"
            alt="Persona revisando documentos financieros"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function WhatIsSection() {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">¿Qué es?</p>
          <h2 className="text-3xl lg:text-4xl font-black text-black leading-tight">
            ¿Qué es un<br />préstamo?
          </h2>
        </div>
        <div className="lg:col-span-2">
          <p className="text-lg text-zinc-600 leading-relaxed mb-4">
            Un préstamo es un monto de dinero que Jes Bank te entrega para financiar tus proyectos,
            imprevistos o metas personales, y que devuelves en cuotas fijas durante un plazo definido,
            junto con los intereses correspondientes.
          </p>
          <p className="text-lg text-zinc-600 leading-relaxed">
            A diferencia de un crédito rotativo, el préstamo tiene un monto y un plazo cerrados desde
            el inicio: eliges cuánto pedir (entre $100.000 y $5.000.000) y en cuántas cuotas pagarlo
            (hasta 60), y desde ese momento sabes exactamente cuánto vas a pagar cada mes hasta liquidarlo.
          </p>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="py-24 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Beneficios</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Pensado para que<br />tengas el control.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(b => (
            <div key={b.title} className="rounded-3xl bg-zinc-900 p-7">
              <h3 className="text-lg font-black leading-tight text-white mb-3">{b.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RequirementsAndDocs() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Requisitos</p>
          <h2 className="text-3xl lg:text-4xl font-black text-black leading-tight mb-8">
            Lo que necesitas<br />para aplicar
          </h2>
          <ul className="space-y-4">
            {REQUIREMENTS.map(r => (
              <li key={r} className="flex items-start gap-3 text-zinc-600">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                <span className="text-base">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Documentos</p>
          <h2 className="text-3xl lg:text-4xl font-black text-black leading-tight mb-8">
            Documentos<br />necesarios
          </h2>
          <div className="space-y-4">
            {DOCUMENTS.map(d => (
              <div key={d.name} className="rounded-2xl border border-black/8 p-5">
                <h3 className="text-base font-bold text-black mb-1">{d.name}</h3>
                <p className="text-sm text-zinc-500">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Proceso</p>
          <h2 className="text-4xl lg:text-5xl font-black text-black leading-tight">
            ¿Cómo funciona?
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(s => (
            <div key={s.n}>
              <p className="text-sm font-black text-zinc-300 mb-4">{s.n}</p>
              <h3 className="text-lg font-black text-black mb-2">{s.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { readonly q: string; readonly a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/8 py-6">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-left gap-4"
      >
        <span className="text-base font-bold text-black">{q}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border border-black/15 flex items-center justify-center text-sm transition-transform duration-300 ${open ? 'rotate-45' : ''
            }`}
        >
          +
        </span>
      </button>
      {open && (
        <p className="mt-4 text-sm text-zinc-500 leading-relaxed max-w-2xl">{a}</p>
      )}
    </div>
  );
}

function FAQSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Preguntas frecuentes</p>
        <h2 className="text-4xl lg:text-5xl font-black text-black leading-tight mb-10">
          Resolvemos tus dudas
        </h2>
        <div>
          {FAQS.map(f => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onSimulate }: { readonly onSimulate: () => void }) {
  return (
    <section className="py-24 px-6 bg-zinc-50">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl bg-black text-white p-16 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
          <div className="max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-5">
              ¿Listo para ver<br />tu cuota estimada?
            </h2>
            <p className="text-zinc-400 text-lg">
              Simula tu préstamo en minutos y descubre las condiciones que aplican para ti.
            </p>
          </div>
          <button
            onClick={onSimulate}
            className="px-8 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors min-w-52"
          >
            Simular ahora
          </button>
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

export default function InfoPrestamos() {
  const router = useRouter();

  const handleSimulate = () => {
    router.push('/login');
  };

  const handleEnter = () => {
    router.push('/login');
  };

  return (
    <div className="bg-white">
      <Navbar onEnter={handleEnter} />
      <Hero onSimulate={handleSimulate} />
      <WhatIsSection />
      <BenefitsSection />
      <RequirementsAndDocs />
      <HowItWorks />
      <FAQSection />
      <FinalCTA onSimulate={handleSimulate} />
      <Footer />
    </div>
  );
}