export const validateExchangeRate = (rate: any) => {
  if (!rate.date || !rate.currency || typeof rate.rate !== 'number') {
    return 'Datos incompletos o inválidos';
  }

  const currency = String(rate.currency).trim().toUpperCase();
  if (currency !== 'U$S') {
    return `Moneda inválida "${rate.currency}" (debe ser U$S)`;
  }

  if (isNaN(rate.rate) || rate.rate <= 0 || rate.rate >= 1000) {
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
};