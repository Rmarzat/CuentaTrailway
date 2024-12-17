import { parse, isValid } from 'date-fns';

const EXCEL_EPOCH = new Date(1899, 11, 30);

export function parseExcelDate(value: any): Date | null {
  if (!value) return null;

  try {
    // Handle Excel serial number
    if (typeof value === 'number') {
      const date = new Date(EXCEL_EPOCH);
      date.setDate(date.getDate() + Math.floor(value));
      if (isValid(date)) {
        return date;
      }
    }

    // Try parsing as DD/MM/YYYY format
    const dateStr = String(value).trim();
    const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }

    return null;
  } catch (error) {
    return null;
  }
}