import { utils, read } from 'xlsx';
import type { ExcelData } from '@/lib/types/excel';

export function parseExcelFile(buffer: ArrayBuffer): ExcelData[] {
  const workbook = read(buffer, { type: 'array' });
  
  if (!workbook.SheetNames?.length) {
    throw new Error('El archivo Excel está vacío');
  }

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Convert to array of objects with original headers
  const rawData = utils.sheet_to_json<any>(worksheet, {
    raw: true,
    defval: null,
    header: ['Moneda', 'Fecha', 'TipoCambio']
  });

  if (!rawData || rawData.length < 2) {
    throw new Error('El archivo no contiene datos');
  }

  // Skip header row and return data
  return rawData.slice(1);
}