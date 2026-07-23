import { useState, useCallback } from 'react';

export interface ExchangeRateResponse {
  currency: string;
  rate: number;
  date: string;
  source: string;
}

export function useExchangeRate() {
  const [rateData, setRateData] = useState<ExchangeRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/v1/exchange-rate/usd`);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al obtener la TRM desde el servidor.');
      }

      const data: ExchangeRateResponse = await response.json();
      setRateData(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { rateData, loading, error, fetchRate };
}
