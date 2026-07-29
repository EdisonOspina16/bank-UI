'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePageSimulator() {
  const router = useRouter();
  const [name, setName] = useState('Sara Quintero');
  const [email, setEmail] = useState('sara@example.com');
  const [phone, setPhone] = useState('+57 300 123 4567');

  const [showRecovery, setShowRecovery] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const save = () => {
    // Simular guardado
    alert('Datos guardados (simulado)');
  };

  const logout = () => {
    if (!confirm('¿Deseas cerrar sesión?')) return;
    // Simular cierre de sesión: limpia datos locales y redirige al inicio de sesión
    try { localStorage.removeItem('creditCardData'); } catch (e) {}
    alert('Sesión cerrada (simulado). Redirigiendo al inicio de sesión...');
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%, #111827 60%)', padding: 20, color: '#fff', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', padding: 18, borderRadius: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, background: '#fff', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22 }}>SQ</div>
            <div>
                          <div style={{ fontSize: 20, fontWeight: 800 }}>{name}</div>
                          <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>{email}</div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Nombre</div>
              <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'transparent', color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Teléfono</div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'transparent', color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Email</div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'transparent', color: '#fff' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Acciones</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={logout} style={{ background: '#dc2626', color: '#fff', padding: '10px 12px', borderRadius: 8, border: 'none' }}>Cerrar sesión</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                      <button onClick={save} style={{ background: '#7c3aed', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10 }}>Guardar cambios</button>
            <button onClick={() => { setName('Sara Quintero'); setEmail('sara@example.com'); setPhone('+57 300 123 4567'); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', padding: '10px 14px', borderRadius: 10 }}>Restablecer</button>
          </div>
        </div>

        <aside style={{ width: 320 }}>
          <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', padding: 12, borderRadius: 12 }}>
            <h4 style={{ margin: 0, color: '#cbd5e1' }}>Panel de seguridad</h4>
            <p style={{ color: '#9ca3af', marginTop: 8 }}>Desde aquí puedes recuperar contraseña, revisar sesiones y contactar soporte.</p>
            <div style={{ marginTop: 12 }}>
                          <button onClick={() => setShowRecovery(true)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', padding: '10px 12px', borderRadius: 8 }}>Recuperar contraseña</button>
            </div>
          </div>
        </aside>
      </div>

      {showRecovery && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowRecovery(false)}>
          <div style={{ background: '#0b1220', padding: 18, borderRadius: 10, minWidth: 320 }} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ margin: 0 }}>Recuperar contraseña</h4>
            <div style={{ marginTop: 12 }}>
              <input type="password" placeholder="Nueva contraseña" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 6, background: 'transparent', color: '#fff' }} />
              <input type="password" placeholder="Confirmar contraseña" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'transparent', color: '#fff' }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => {
                  if (!newPwd || newPwd.length < 6) { alert('La contraseña debe tener al menos 6 caracteres'); return; }
                  if (newPwd !== confirmPwd) { alert('Las contraseñas no coinciden'); return; }
                  // Simular cambio de contraseña
                  alert('Contraseña actualizada (simulado)');
                  setShowRecovery(false);
                  setNewPwd('');
                  setConfirmPwd('');
                }} style={{ background: '#7c3aed', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 8 }}>Aceptar</button>
                <button onClick={() => setShowRecovery(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', padding: '10px 12px', borderRadius: 8 }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}