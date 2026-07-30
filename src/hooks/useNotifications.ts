import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface NotificationItem {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/notificaciones');
      setNotifications(res.notifications || []);
    } catch (e: any) {
      setError(e.message || 'Error al obtener notificaciones.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/api/notificaciones/${id}/leida`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (e: any) {
      setError(e.message || 'Error al marcar la notificación como leída.');
      throw e;
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/api/notificaciones/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e: any) {
      setError(e.message || 'Error al eliminar la notificación.');
      throw e;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
}

export default useNotifications;
