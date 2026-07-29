'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

/**
 * Premium Jes Bank card — Revolut-like floating 3D with cursor tilt.
 * Matte black primary + brushed silver secondary (matches brand cards).
 */
export default function PremiumCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 40 });
  const [ready, setReady] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => setReady(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion.current || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (py - 0.5) * -18,
      y: (px - 0.5) * 22,
    });
    setShine({ x: px * 100, y: py * 100 });
  };

  const onLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 40 });
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative w-full max-w-[420px] mx-auto aspect-[1.05/1] flex items-center justify-center [perspective:1200px] select-none ${
        ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      aria-hidden="true"
    >
      {/* Soft ambient glow */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.12),transparent_70%)] blur-2xl pointer-events-none" />

      <div className="relative w-[86%] h-full jes-card-float">
        <div
          className="relative w-full h-full preserve-3d"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.18s ease-out',
          }}
        >
        {/* Back silver card */}
        <div className="absolute inset-x-[6%] top-[18%] aspect-[1.586/1] rounded-[1.15rem] jes-card-silver shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] rotate-[-8deg] translate-y-4 translate-x-3 overflow-hidden border border-black/10">
          <div className="absolute inset-0 jes-brushed" />
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-9 h-7 rounded-md border border-black/25 bg-gradient-to-br from-zinc-300 to-zinc-500" />
              <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-zinc-900/80">Jes</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="w-6 h-6 opacity-50">
                <Contactless dark />
              </div>
              <MastercardMark />
            </div>
          </div>
        </div>

        {/* Front black card */}
        <div className="absolute inset-x-[4%] top-[8%] aspect-[1.586/1] rounded-[1.2rem] jes-card-black shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55)] rotate-[7deg] overflow-hidden border border-white/10">
          {/* Dynamic lighting */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-70 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.35), transparent 45%)`,
            }}
          />
          {/* Holo sweep */}
          <div className="absolute inset-0 jes-holo pointer-events-none opacity-40" />
          {/* Specular stripe */}
          <div className="absolute -inset-y-8 -left-1/2 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/15 to-transparent jes-shine pointer-events-none" />

          <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-8 rounded-md jes-chip shadow-inner" />
                <Contactless />
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold tracking-tight text-[#d4af37]">
                Jes
              </span>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-1">Metal · Black</p>
                <p className="font-mono text-sm tracking-[0.28em] text-white/70">•••• 4821</p>
              </div>
              <VisaMark />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function Contactless({ dark = false }: { dark?: boolean }) {
  const stroke = dark ? 'rgba(0,0,0,0.55)' : 'rgba(212,175,55,0.85)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 8c2.2 2.2 2.2 5.8 0 8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 5.5c3.6 3.6 3.6 9.4 0 13" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 3c5 5 5 13 0 18" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function VisaMark() {
  return (
    <span className="font-[family-name:var(--font-display)] text-lg italic font-bold tracking-wide text-[#d4af37]">
      VISA
    </span>
  );
}

function MastercardMark() {
  return (
    <div className="flex items-center -space-x-2" aria-hidden>
      <span className="w-5 h-5 rounded-full bg-[#eb001b]/80" />
      <span className="w-5 h-5 rounded-full bg-[#f79e1b]/80" />
    </div>
  );
}
