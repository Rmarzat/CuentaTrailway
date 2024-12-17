import { useState, useCallback } from 'react';
import { exchangeRatesApi } from '@/lib/api/exchange-rates';
import type { ExchangeRate } from '@/lib/types/exchange-rate';

export function useExchangeRates() {
  const [loading, setLoading] = useState(false);

  const loadRates = useCallback(async () => {
    try {
      setLoading(true);
      const rates = await exchangeRatesApi.getMasterRates();
      return rates;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadRates = useCallback(async (rates: ExchangeRate[], source: string) => {
    try {
      setLoading(true);
      const result = await exchangeRatesApi.uploadMasterRates(rates, source);
      return result;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRates = useCallback(async () => {
    try {
      setLoading(true);
      const result = await exchangeRatesApi.clearMasterRates();
      return result;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    loadRates,
    uploadRates,
    clearRates
  };
}