import type { ExcelData } from '@/lib/types/excel';

export function validateExcelRow(row: ExcelData, rowIndex: number): string | null {
  // Validate required fields
  if (!row.Moneda || !row.Fecha || !row.TipoCambio) {
    return `Fila ${rowIndex}: Datos incompletos`;
  }

  // Validate currency
  const currency = String(row.Moneda).trim().toUpperCase();
  if (currency !== 'U$S') {
    return `Fila ${rowIndex}: Moneda inválida "${row.Moneda}" (debe ser U$S)`;
  }

  return null;
}