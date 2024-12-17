export function validateExchangeRate(rate) {
  if (!rate.currency || !rate.date || typeof rate.rate !== 'number') {
    return 'Datos incompletos o inválidos';
  }

  const currency = String(rate.currency).trim().toUpperCase();
  if (currency !== 'U$S') {
    return `Moneda inválida "${rate.currency}" (debe ser U$S)`;
  }

  const rateValue = Number(rate.rate);
  if (isNaN(rateValue) || rateValue <= 0 || rateValue >= 1000) {
    return `Tipo de cambio inválido "${rate.rate}"`;
  }

  try {
    const date = new Date(rate.date);
    if (isNaN(date.getTime())) {
      return `Fecha inválida "${rate.date}"`;
    }
  } catch {
    return `Fecha inválida "${rate.date}"`;
  }

  return null;
}