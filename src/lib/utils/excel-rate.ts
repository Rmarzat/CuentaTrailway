export function parseExchangeRate(value: any): number | null {
  if (!value) return null;

  try {
    // Convert to number, handling both formats:
    // - 42.336 (number)
    // - "42,336" (string with comma)
    let numValue = typeof value === 'number' 
      ? value 
      : Number(String(value).replace(',', '.'));

    if (isNaN(numValue) || numValue <= 0) {
      return null;
    }

    // Round to 3 decimal places
    return Math.round(numValue * 1000) / 1000;
  } catch (error) {
    return null;
  }
}