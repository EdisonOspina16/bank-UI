'use client';

import React, { useState } from 'react';
import { useNotifications, NotificationItem } from '../../hooks/useNotifications';

export default function Notifications() {
  const { notifications, loading, error, markAsRead, deleteNotification } = useNotifications();

  // Gesture State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setTouchStart(e.targetTouches[0].clientX);
    setSwipingId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = touchStart - currentX; // swipe left is positive diff
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 100)); // cap at 100px
    } else {
      setSwipeOffset(0);
    }
  };

  const handleTouchEnd = async (id: string) => {
    setTouchStart(null);
    setSwipingId(null);
    if (swipeOffset > 75) {
      try {
        await deleteNotification(id);
      } catch (err) {}
    }
    setSwipeOffset(0);
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.leida) {
      try {
        await markAsRead(n.id);
      } catch (err) {}
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div style={{ padding: 20, background: '#f7fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: 20, background: '#f7fafc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', gap: 12 }}>
          <h2 style={{ margin: 0, color: '#1e293b' }}>Notificaciones</h2>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: 13, fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              🔔 No tienes notificaciones pendientes.
            </div>
          ) : (
            notifications.map((n) => {
              const isSwiping = swipingId === n.id;
              const transform = isSwiping ? `translateX(-${swipeOffset}px)` : 'translateX(0)';

              return (
                <div
                  key={n.id}
                  onTouchStart={(e) => handleTouchStart(e, n.id)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(n.id)}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    position: 'relative',
                    background: '#fff',
                    borderRadius: 12,
                    marginBottom: 12,
                    overflow: 'hidden',
                    border: n.leida ? '1px solid #f1f5f9' : '1px solid #cbd5e1',
                    boxShadow: n.leida ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)',
                    transition: 'border 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  {/* Underlay delete background */}
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 100,
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 14,
                      zIndex: 1,
                    }}
                  >
                    Eliminar
                  </div>

                  {/* Notification Card Content */}
                  <div
                    style={{
                      position: 'relative',
                      background: '#fff',
                      padding: 16,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transform,
                      transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
                      zIndex: 2,
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {!n.leida && (
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} />
                        )}
                        <div style={{ fontWeight: n.leida ? 600 : 800, color: n.leida ? '#475569' : '#0f172a', fontSize: 14 }}>
                          {n.titulo}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                        {n.mensaje}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 11, background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: 20, textTransform: 'capitalize' }}>
                        {n.tipo.replace('_', ' ')}
                      </span>
                      
                      {/* Desktop Delete Button */}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await deleteNotification(n.id);
                          } catch (err) {}
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          fontSize: 16,
                          padding: '6px 8px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s, background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#94a3b8';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}