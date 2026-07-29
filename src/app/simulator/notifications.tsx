'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const SAMPLE = [
  { id: 1, type: 'envio', title: 'Enviaste $50.000 a Juan', time: 'Hoy · 2:14 pm' },
  { id: 2, type: 'deposito', title: 'Recibiste $120.000 de María', time: 'Hoy · 10:00 am' },
  { id: 3, type: 'retiro', title: 'Retiro en cajero $200.000', time: 'Ayer · 3:22 pm' },
  { id: 4, type: 'aprobacion', title: 'Tu préstamo fue aprobado', time: 'Hace 2 días' },
  { id: 5, type: 'mantenimiento', title: 'Mantenimiento programado el 30/07', time: 'Hace 3 días' },
];

export default function Notifications() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', padding: 20, background: '#f7fafc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Notificaciones</h2>
        </div>

        <div style={{ marginTop: 16 }}>
          {SAMPLE.map(n => (
            <div key={n.id} style={{ background: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{n.time}</div>
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{n.type}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}