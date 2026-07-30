import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface PocketData {
  id: string;
  nombre: string;
  limite: number;
  icono: string;
  saldoUsado: number;
}

export interface DebitCardData {
  id: string;
  numero: string;
  cvv: string;
  vence: string;
  saldo: number;
  acumuladoGmfMes: number;
  bolsillos: PocketData[];
}

export function useDebitCard() {
  const [card, setCard] = useState<DebitCardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/tarjeta-debito');
      setCard(res.card);
    } catch (e: any) {
      setError(e.message || 'Error al obtener tarjeta de débito.');
    } finally {
      setLoading(false);
    }
  };

  const createPocket = async (payload: { nombre: string; limite: number; icono: string }) => {
    try {
      const res = await api.post('/api/tarjeta-debito/bolsillos', payload);
      await fetchCard();
      return res.pocket;
    } catch (e: any) {
      setError(e.message || 'Error al crear el bolsillo.');
      throw e;
    }
  };

  const updatePocket = async (
    pocketId: string,
    payload: { nombre: string; limite: number; icono: string }
  ) => {
    try {
      const res = await api.put(`/api/tarjeta-debito/bolsillos/${pocketId}`, payload);
      await fetchCard();
      return res.pocket;
    } catch (e: any) {
      setError(e.message || 'Error al actualizar el bolsillo.');
      throw e;
    }
  };

  const deletePocket = async (pocketId: string) => {
    try {
      const res = await api.delete(`/api/tarjeta-debito/bolsillos/${pocketId}`);
      await fetchCard();
      return res;
    } catch (e: any) {
      setError(e.message || 'Error al eliminar el bolsillo.');
      throw e;
    }
  };

  const recordTransaction = async (payload: {
    amount: number;
    bolsilloId?: string;
    tipo: string;
  }) => {
    try {
      const res = await api.post('/api/tarjeta-debito/transaccion', payload);
      await fetchCard();
      return res.transaction;
    } catch (e: any) {
      setError(e.message || 'Error al procesar la transacción.');
      throw e;
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  return {
    card,
    loading,
    error,
    createPocket,
    updatePocket,
    deletePocket,
    recordTransaction,
    refetch: fetchCard,
  };
}

export default useDebitCard;
