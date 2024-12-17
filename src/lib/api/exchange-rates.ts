import api from './index';
import type { ExchangeRate, ExchangeRateResponse } from '@/lib/types/exchange-rate';

export const exchangeRatesApi = {
  getMasterRates: async (): Promise<ExchangeRate[]> => {
    try {
      const response = await api.get<ExchangeRateResponse>('/exchange-rates/master/rates');
      if (!response.data?.data) {
        throw new Error('No se encontraron datos');
      }
      
      // Sort rates by date in descending order
      const sortedRates = [...response.data.data].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      return sortedRates;
    } catch (error) {
      console.error('Error fetching rates:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al cargar los tipos de cambio');
    }
  },

  uploadMasterRates: async (rates: ExchangeRate[], source: string) => {
    try {
      const response = await api.post('/exchange-rates/master/upload', { 
        rates, 
        source 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading rates:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al subir tipos de cambio');
    }
  },

  clearMasterRates: async () => {
    try {
      const response = await api.delete('/exchange-rates/master/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing rates:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al limpiar tipos de cambio');
    }
  }
};