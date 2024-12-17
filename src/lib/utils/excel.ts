import { format } from 'date-fns';
import type { ExchangeRate } from '@/lib/types/exchange-rate';
import type { ExcelData } from '@/lib/types/excel';
import { parseExcelFile } from './excel-parser';
import { parseExcelDate } from './excel-date';
import { parseExchangeRate } from './excel-rate';

export async function processExcelFile(file: File): Promise<ExchangeRate[]> {
  const buffer = await file.arrayBuffer();
  const rawData = parseExcelFile(buffer);
  
  const errors: string[] = [];
  const processedData: ExchangeRate[] = [];

  rawData.forEach((row, index) => {
    const rowNum = index + 2; // Add 2 for header row and 1-based index

    // Validate currency
    const currency = String(row.Moneda || '').trim().toUpperCase();
    if (currency !== 'U$S') {
      errors.push(`Fila ${rowNum}: Moneda inválida "${row.Moneda}" (debe ser U$S)`);
      return;
    }

    // Parse and validate date
    const date = parseExcelDate(row.Fecha);
    if (!date) {
      errors.push(`Fila ${rowNum}: Fecha inválida "${row.Fecha}". Use el formato DD/MM/YYYY.`);
      return;
    }

    // Parse and validate rate
    const rate = parseExchangeRate(row.TipoCambio);
    if (rate === null) {
      errors.push(`Fila ${rowNum}: Tipo de cambio inválido "${row.TipoCambio}". Use el formato numérico con 3 decimales.`);
      return;
    }

    processedData.push({
      date: format(date, 'yyyy-MM-dd'),
      currency: 'U$S',
      rate
    });
  });

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  if (processedData.length === 0) {
    throw new Error('No se encontraron datos válidos para procesar. Verifique el formato del archivo y los datos ingresados.');
  }

  return processedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}