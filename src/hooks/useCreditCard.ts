import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface CreditCardData {
  id: string;
  productoId: string;
  estado: string;
  cupoAsignado: number;
  gastado: number;
  numero: string;
  cvv: string;
  vence: string;
  createdAt: string;
}

export function useCreditCard() {
  const [cards, setCards] = useState<CreditCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/tarjetas-credito');
      setCards(res.cards || []);
    } catch (e: any) {
      setError(e.message || 'Error al obtener tarjetas.');
    } finally {
      setLoading(false);
    }
  };

  const applyCard = async (payload: {
    productoId: string;
    urlDocumentoCedula?: string;
    urlDocumentoIngresos?: string;
  }) => {
    setError(null);
    try {
      const res = await api.post('/api/tarjetas-credito/solicitar', payload);
      await fetchCards();
      return res;
    } catch (e: any) {
      setError(e.message || 'Error al enviar la solicitud.');
      throw e;
    }
  };

  const recordExpense = async (cardId: string, amount: number) => {
    setError(null);
    try {
      const res = await api.post(`/api/tarjetas-credito/${cardId}/gasto`, { amount });
      await fetchCards();
      return res;
    } catch (e: any) {
      setError(e.message || 'Error al registrar el gasto.');
      throw e;
    }
  };

  const cancelCard = async (cardId: string) => {
    setError(null);
    try {
      const res = await api.post(`/api/tarjetas-credito/${cardId}/cancelar`);
      await fetchCards();
      return res;
    } catch (e: any) {
      setError(e.message || 'Error al cancelar la tarjeta.');
      throw e;
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    loading,
    error,
    applyCard,
    recordExpense,
    cancelCard,
    refetch: fetchCards,
  };
}

export default useCreditCard;
