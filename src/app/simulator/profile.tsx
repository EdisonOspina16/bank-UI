'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '../../hooks/useProfile';
import { AuthService } from '../../services/auth.service';

const Icon = {
  ChevronLeft: ({ size = 22 }: { size?: number }) => (
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
  Shield: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

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

  const reset = () => {
    if (!profile) return;
    setName(`${profile.firstName} ${profile.lastName}`.trim());
    setEmail(profile.email);
    setPhone(profile.phoneNumber);
    setOcupacion(profile.ocupacion || 'empleado');
    setSuccessMessage('');
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
      <div style={s.page}>
        <div style={s.header}>
          <button aria-label="Volver" onClick={() => router.back()} style={s.headerBtn}>
            <Icon.ChevronLeft />
          </button>
          <div style={s.headerTitle}>MI PERFIL</div>
          <button aria-label="Notificaciones" style={s.headerBtn} onClick={() => router.push('/simulator/notifications')}>
            <Icon.Bell />
          </button>
        </div>
        <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <style>{`
        .profile-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          align-items: start;
        }
        .profile-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .profile-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }
        .profile-actions button {
          flex: 0 0 auto;
        }
        @media (max-width: 860px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 560px) {
          .profile-form-grid {
            grid-template-columns: 1fr;
          }
          .profile-actions {
            flex-direction: column;
          }
          .profile-actions button {
            width: 100%;
          }
          .profile-content {
            padding: 20px 16px 32px !important;
          }
          .profile-card {
            padding: 18px !important;
          }
        }
      `}</style>

      <div style={s.header}>
        <div style={s.headerTitle}>MI PERFIL</div>
        <button aria-label="Notificaciones" style={s.headerBtn} onClick={() => router.push('/simulator/notifications')}>
          <Icon.Bell />
        </button>
      </div>

      <div className="profile-content" style={s.content}>
        <div style={s.titleBlock}>
          <h1 style={s.title}>Mi perfil</h1>
          <p style={s.subtitle}>Consulta y actualiza tu información personal</p>
        </div>

        {successMessage && (
          <div style={s.successBanner}>{successMessage}</div>
        )}

        {error && !validationErrors.nombre && !validationErrors.telefono && (
          <div style={s.errorBanner}>{error}</div>
        )}

        <div className="profile-layout">
          <div className="profile-card" style={s.card}>
            <div style={s.avatarRow}>
              <div style={s.avatar}>{initials}</div>
              <div>
                <div style={s.avatarName}>{name || '—'}</div>
                <div style={s.avatarEmail}>{email || '—'}</div>
              </div>
            </div>

            <div className="profile-form-grid">
              <div>
                <label style={s.label}>Nombre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={s.input}
                />
                {validationErrors.nombre && (
                  <div style={s.fieldError}>{validationErrors.nombre}</div>
                )}
              </div>

              <div>
                <label style={s.label}>Teléfono</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={s.input}
                />
                {validationErrors.telefono && (
                  <div style={s.fieldError}>{validationErrors.telefono}</div>
                )}
              </div>

              <div>
                <label style={s.label}>Email (solo lectura)</label>
                <input
                  value={email}
                  readOnly
                  disabled
                  style={{ ...s.input, ...s.inputReadonly }}
                />
              </div>

              <div>
                <label style={s.label}>Ocupación</label>
                <select
                  value={ocupacion}
                  onChange={(e) => setOcupacion(e.target.value)}
                  style={s.select}
                >
                  <option value="empleado">Empleado</option>
                  <option value="independiente">Independiente</option>
                  <option value="pensionado">Pensionado</option>
                  <option value="otro">Otro</option>
                </select>
                {validationErrors.ocupacion && (
                  <div style={s.fieldError}>{validationErrors.ocupacion}</div>
                )}
              </div>
            </div>

            <div className="profile-actions">
              <button onClick={logout} style={s.btnLogout}>
                Cerrar sesión
              </button>
              <button onClick={save} style={s.btnSave}>
                Guardar cambios
              </button>
              <button onClick={reset} style={s.btnReset}>
                Restablecer
              </button>
            </div>
          </div>

          <aside style={s.securityCard}>
            <div style={s.securityHeader}>
              <Icon.Shield size={15} />
              <span>PANEL DE SEGURIDAD</span>
            </div>
            <p style={s.securityText}>
              Desde aquí puedes cambiar el PIN de seguridad de tus tarjetas.
            </p>
            <button
              onClick={() => {
                setShowRecovery(true);
                setNewPwd('');
                setConfirmPwd('');
                setPinValError('');
              }}
              style={s.btnSecurity}
            >
              Cambiar PIN de seguridad
            </button>
          </aside>
        </div>
      </div>

      {showRecovery && (
        <div style={s.modalOverlay} onClick={() => setShowRecovery(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h4 style={s.modalTitle}>Cambiar PIN de seguridad</h4>
            <div style={{ marginTop: 14 }}>
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={4}
                placeholder="Nuevo PIN (4 dígitos)"
                value={newPwd}
                onChange={(e) => handlePinInputChange(e.target.value)}
                style={s.input}
              />
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={4}
                placeholder="Confirmar PIN"
                value={confirmPwd}
                onChange={(e) => handleConfirmPinInputChange(e.target.value)}
                style={{ ...s.input, marginTop: 10 }}
              />
              {pinValError && <div style={s.fieldError}>{pinValError}</div>}
              {validationErrors.pin && (
                <div style={s.fieldError}>{validationErrors.pin}</div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={handleSecuritySave} style={s.btnSave}>
                  Aceptar
                </button>
                <button onClick={() => setShowRecovery(false)} style={s.btnReset}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F7F7F5',
    color: '#111',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  header: {
    background: '#000',
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
  },
  content: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '28px 24px 40px',
  },
  titleBlock: {
    marginBottom: 22,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: '#111',
    letterSpacing: -0.3,
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#8a8a8a',
  },
  successBanner: {
    background: '#10b981',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 13,
    fontWeight: 700,
  },
  errorBanner: {
    background: '#ef4444',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 13,
    fontWeight: 700,
  },
  card: {
    background: '#fff',
    borderRadius: 18,
    padding: 24,
    border: '1px solid #EFEFEC',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  avatarRow: {
    display: 'flex',
    gap: 14,
    alignItems: 'center',
    marginBottom: 22,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    background: '#111',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 18,
    flexShrink: 0,
  },
  avatarName: {
    fontSize: 17,
    fontWeight: 800,
    color: '#111',
  },
  avatarEmail: {
    fontSize: 13,
    color: '#8a8a8a',
    marginTop: 3,
  },
  label: {
    display: 'block',
    fontSize: 12,
    color: '#8a8a8a',
    marginBottom: 7,
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #EFEFEC',
    background: '#F7F7F5',
    color: '#111',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputReadonly: {
    color: '#8a8a8a',
    cursor: 'not-allowed',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #EFEFEC',
    background: '#F7F7F5',
    color: '#111',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 11,
    marginTop: 5,
  },
  btnLogout: {
    background: '#ef4444',
    color: '#fff',
    padding: '11px 16px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
  },
  btnSave: {
    background: '#111',
    color: '#fff',
    padding: '11px 16px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
  },
  btnReset: {
    background: '#fff',
    color: '#111',
    padding: '11px 16px',
    borderRadius: 12,
    border: '1px solid #E1E1DC',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
  },
  securityCard: {
    background: '#fff',
    borderRadius: 18,
    padding: 20,
    border: '1px solid #EFEFEC',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  securityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#8a8a8a',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
  },
  securityText: {
    color: '#8a8a8a',
    marginTop: 10,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 1.5,
  },
  btnSecurity: {
    width: '100%',
    background: '#fff',
    border: '1px solid #E1E1DC',
    color: '#111',
    padding: '12px 14px',
    borderRadius: 12,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.45)',
    zIndex: 100,
    padding: 20,
  },
  modalCard: {
    background: '#fff',
    padding: 22,
    borderRadius: 18,
    minWidth: 300,
    maxWidth: 400,
    width: '100%',
    border: '1px solid #EFEFEC',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  modalTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
    color: '#111',
  },
};
