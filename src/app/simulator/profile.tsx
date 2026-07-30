'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '../../hooks/useProfile';
import { AuthService } from '../../services/auth.service';

export default function ProfilePageSimulator() {
  const router = useRouter();
  const {
    profile,
    loading,
    error,
    validationErrors,
    updateProfile,
    changePassword,
    refetch,
  } = useProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ocupacion, setOcupacion] = useState('empleado');

  const [showRecovery, setShowRecovery] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pinValError, setPinValError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setName(`${profile.firstName} ${profile.lastName}`.trim());
      setEmail(profile.email);
      setPhone(profile.phoneNumber);
      setOcupacion(profile.ocupacion || 'empleado');
    }
  }, [profile]);

  const save = async () => {
    try {
      setSuccessMessage('');
      await updateProfile({
        nombre: name,
        telefono: phone,
        ocupacion,
      });
      setSuccessMessage('Cambios guardados');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      // Errors handled by useProfile hook
    }
  };

  const handleSecuritySave = async () => {
    try {
      if (!/^\d{4}$/.test(newPwd)) {
        setPinValError('El PIN debe tener exactamente 4 dígitos.');
        return;
      }
      if (newPwd !== confirmPwd) {
        alert('Los PINs no coinciden.');
        return;
      }
      await changePassword({ pin: newPwd });
      alert('PIN actualizado con éxito');
      setShowRecovery(false);
      setNewPwd('');
      setConfirmPwd('');
      setPinValError('');
    } catch (e: any) {
      // Errors handled by hook
    }
  };

  const handlePinInputChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    if (cleanVal.length > 4) {
      setPinValError('El PIN debe tener exactamente 4 dígitos.');
      return;
    }
    setPinValError('');
    setNewPwd(cleanVal);
  };

  const handleConfirmPinInputChange = (val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    if (cleanVal.length > 4) {
      return;
    }
    setConfirmPwd(cleanVal);
  };

  const logout = () => {
    if (!confirm('¿Deseas cerrar sesión?')) return;
    AuthService.logout();
    router.push('/');
  };

  const initials = profile
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : 'SQ';

  if (loading && !profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%, #111827 60%)', padding: 20, color: '#fff', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', padding: 18, borderRadius: 14 }}>
          
          {successMessage && (
            <div style={{ background: '#10b981', color: '#fff', padding: '10px 14px', borderRadius: 8, marginBottom: 15, fontSize: 13, fontWeight: 'bold' }}>
              {successMessage}
            </div>
          )}

          {error && !validationErrors.nombre && !validationErrors.telefono && (
            <div style={{ background: '#ef4444', color: '#fff', padding: '10px 14px', borderRadius: 8, marginBottom: 15, fontSize: 13, fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, background: '#fff', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{name}</div>
              <div style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>{email}</div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Nombre</div>
              <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'transparent', color: '#fff' }} />
              {validationErrors.nombre && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{validationErrors.nombre}</div>}
            </div>
            
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Teléfono</div>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'transparent', color: '#fff' }} />
              {validationErrors.telefono && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{validationErrors.telefono}</div>}
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Email (Solo Lectura)</div>
              <input value={email} readOnly disabled style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'rgba(255,255,255,0.02)', color: '#9ca3af', cursor: 'not-allowed' }} />
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Ocupación</div>
              <select value={ocupacion} onChange={(e) => setOcupacion(e.target.value)} style={{ width: '100%', padding: '11px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: '#0b1220', color: '#fff', outline: 'none' }}>
                <option value="empleado">Empleado</option>
                <option value="independiente">Independiente</option>
                <option value="pensionado">Pensionado</option>
                <option value="otro">Otro</option>
              </select>
              {validationErrors.ocupacion && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{validationErrors.ocupacion}</div>}
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: 'span 2' }}>
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Acciones</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={logout} style={{ background: '#dc2626', color: '#fff', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar sesión</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
            <button onClick={save} style={{ background: '#7c3aed', border: 'none', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer', fontWeight: 'bold' }}>Guardar cambios</button>
            <button onClick={() => refetch()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', padding: '10px 14px', borderRadius: 10, cursor: 'pointer' }}>Restablecer</button>
          </div>
        </div>

        <aside style={{ width: 320 }}>
          <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', padding: 12, borderRadius: 12 }}>
            <h4 style={{ margin: 0, color: '#cbd5e1' }}>Panel de seguridad</h4>
            <p style={{ color: '#9ca3af', marginTop: 8, fontSize: 12, lineHeight: 1.5 }}>Desde aquí puedes cambiar el PIN de seguridad de tus tarjetas.</p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => { setShowRecovery(true); setNewPwd(''); setConfirmPwd(''); setPinValError(''); }} style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }}>Cambiar PIN de seguridad</button>
            </div>
          </div>
        </aside>
      </div>

      {showRecovery && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 100 }} onClick={() => setShowRecovery(false)}>
          <div style={{ background: '#0b1220', padding: 18, borderRadius: 10, minWidth: 320, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ margin: 0 }}>Cambiar PIN de seguridad</h4>
            <div style={{ marginTop: 12 }}>
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={4}
                placeholder="Nuevo PIN (4 dígitos)"
                value={newPwd}
                onChange={(e) => handlePinInputChange(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 6, background: 'transparent', color: '#fff' }}
              />
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={4}
                placeholder="Confirmar PIN"
                value={confirmPwd}
                onChange={(e) => handleConfirmPinInputChange(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', marginTop: 8, background: 'transparent', color: '#fff' }}
              />
              {pinValError && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{pinValError}</div>}
              {validationErrors.pin && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{validationErrors.pin}</div>}

              <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
                <button onClick={handleSecuritySave} style={{ background: '#7c3aed', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Aceptar</button>
                <button onClick={() => setShowRecovery(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}