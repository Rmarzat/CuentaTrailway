import { ExchangeRate } from '@/lib/types/exchange-rate';
import api from '../api';

export class ExchangeRateService {
  static async getMasterRates() {
    const response = await api.get('/exchange-rates/master/rates');
    return response.data;
  }

  static async uploadMasterRates(rates: ExchangeRate[], source: string) {
    const response = await api.post('/exchange-rates/master/upload', { rates, source });
    return response.data;
  }

  static async clearMasterRates() {
    const response = await api.delete('/exchange-rates/master/clear');
    return response.data;
  }
}