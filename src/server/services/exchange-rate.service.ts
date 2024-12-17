import db from '../db';
import { ExchangeRate } from '../types';

export class ExchangeRateService {
  static getMasterRates() {
    return db.prepare(`
      SELECT 
        id, date, currency, rate, source, createdAt, updatedAt
      FROM MasterExchangeRates 
      ORDER BY date DESC, currency
    `).all();
  }

  static uploadMasterRates(rates: ExchangeRate[], source: string) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO MasterExchangeRates 
      (date, currency, rate, source) 
      VALUES (?, ?, ?, ?)
    `);

    const results = db.transaction(() => {
      let inserted = 0;
      const errors: string[] = [];

      rates.forEach((rate, index) => {
        try {
          stmt.run(rate.date, rate.currency, rate.rate, source);
          inserted++;
        } catch (error) {
          errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

      return { inserted, errors };
    })();

    return results;
  }

  static clearMasterRates() {
    db.prepare('DELETE FROM MasterExchangeRates').run();
    return { success: true };
  }
}