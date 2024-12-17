import { format } from 'date-fns';
import type { ExcelData } from '@/lib/types/excel';
import type { ExchangeRate } from '@/lib/types/exchange-rate';
import { parseExcelDate } from './excel-date';
import { parseExchangeRate } from './excel-rate';

export function transformExcelData(data: ExcelData[]): ExchangeRate[] {
  return data.map(row => {
    const date = parseExcelDate(row.Fecha);
    if (!date) {
      throw new Error(`Fecha inválida: ${row.Fecha}`);
    }

    const rate = parseExchangeRate(row.TipoCambio);
    if (rate === null) {
      throw new Error(`Tipo de cambio inválido: ${row.TipoCambio}`);
    }

    return {
      date: format(date, 'yyyy-MM-dd'),
      currency: String(row.Moneda).trim().toUpperCase(),
      rate
    };
  });
}