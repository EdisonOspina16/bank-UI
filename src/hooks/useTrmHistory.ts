import { useState, useCallback } from 'react';

export interface TrmHistoryPoint {
  date: string;
  rate: number;
}

export function useTrmHistory() {
  const [history, setHistory] = useState<TrmHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/exchange-rate/usd/history`);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al obtener el historial de TRM.');
      }

      const data = await response.json();
      setHistory(data.history || []);
      return data.history as TrmHistoryPoint[];
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { history, loading, error, fetchHistory };
}
