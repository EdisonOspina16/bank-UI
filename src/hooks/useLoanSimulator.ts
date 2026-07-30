import { useState, useCallback } from 'react';

export interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

export interface LoanSimulationResult {
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  monthlyRate: number;
  effectiveAnnualRate: number;
  amortizationTable: AmortizationRow[];
}

export interface LoanRequestResult {
  demo: boolean;
  status: string;
  disbursedAmount?: number;
  simulation: LoanSimulationResult;
  loan?: {
    id: string;
    amount: number;
    status: string;
    monthlyPayment: number;
    termMonths: number;
  };
}

const API_URL = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useLoanSimulator() {
  const [simulation, setSimulation] = useState<LoanSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulate = useCallback(async (amount: number, termMonths: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL()}/api/v1/loans/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, termMonths }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al simular el préstamo.');
      }

      const data: LoanSimulationResult = await response.json();
      setSimulation(data);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error de conexión con el servidor.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestLoan = useCallback(async (amount: number, termMonths: number, accountId?: string) => {
    setRequesting(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL()}/api/v1/loans/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, termMonths, accountId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al solicitar el préstamo.');
      }

      const data: LoanRequestResult = await response.json();
      setSimulation(data.simulation);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error de conexión con el servidor.';
      setError(message);
      return null;
    } finally {
      setRequesting(false);
    }
  }, []);

  return { simulation, loading, requesting, error, simulate, requestLoan };
}
