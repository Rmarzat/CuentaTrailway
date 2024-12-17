import { db } from '../db';
import { validateExchangeRate } from '../validators/exchange-rate';
import { randomUUID } from 'crypto';

export class ExchangeRateService {
  static async getMasterRates() {
    await db.read();
    if (!db.data) {
      db.data = { MasterExchangeRates: [] };
      await db.write();
    }
    return db.data.MasterExchangeRates;
  }

  static async uploadMasterRates(rates: any[], source: string) {
    if (!Array.isArray(rates) || rates.length === 0) {
      throw new Error('No se proporcionaron datos válidos para procesar');
    }

    await db.read();
    const timestamp = new Date().toISOString();
    const errors: string[] = [];
    
    const processedRates = rates
      .map((rate, index) => {
        const error = validateExchangeRate(rate);
        if (error) {
          errors.push(`Fila ${index + 1}: ${error}`);
          return null;
        }

        return {
          id: randomUUID(),
          date: new Date(rate.date).toISOString().split('T')[0],
          currency: String(rate.currency).trim().toUpperCase(),
          rate: Number(rate.rate),
          source: source || 'excel_import',
          createdAt: timestamp,
          updatedAt: timestamp
        };
      })
      .filter(rate => rate !== null);

    if (processedRates.length === 0) {
      throw new Error(errors.join('\n'));
    }

    db.data.MasterExchangeRates = [
      ...db.data.MasterExchangeRates,
      ...processedRates
    ];
    
    db.data.MasterExchangeRates.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    await db.write();

    return { 
      success: true, 
      message: `Se importaron ${processedRates.length} registros correctamente`,
      warnings: errors.length > 0 ? errors : undefined
    };
  }

  static async clearMasterRates() {
    await db.read();
    db.data.MasterExchangeRates = [];
    await db.write();
    
    return { 
      success: true, 
      message: 'Todos los tipos de cambio han sido eliminados'
    };
  }
}