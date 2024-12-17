import express from 'express';
import { db, dbGet } from '../db.js';
import { randomUUID } from 'crypto';
import { validateExchangeRate } from '../validators/exchange-rate.js';

const router = express.Router();

// Get master exchange rates
router.get('/master/rates', async (req, res, next) => {
  try {
    const rates = await dbGet('MasterExchangeRates');
    
    // Create a map to store unique rates by date
    const uniqueRates = new Map();
    
    // Process rates to keep only the latest version for each date
    rates.forEach(rate => {
      const key = rate.date;
      if (!uniqueRates.has(key) || new Date(rate.updatedAt) > new Date(uniqueRates.get(key).updatedAt)) {
        uniqueRates.set(key, rate);
      }
    });

    // Convert map to array and sort by date descending
    const sortedRates = Array.from(uniqueRates.values())
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ data: sortedRates });
  } catch (error) {
    next(error);
  }
});

// Upload master exchange rates
router.post('/master/upload', async (req, res, next) => {
  try {
    const { rates, source } = req.body;
    
    if (!Array.isArray(rates) || rates.length === 0) {
      return res.status(400).json({ 
        error: 'Datos inválidos',
        message: 'No se proporcionaron datos válidos para procesar'
      });
    }

    await db.read();
    const timestamp = new Date().toISOString();
    const ratesMap = new Map();

    // First, add existing rates to the map
    db.data.MasterExchangeRates.forEach(rate => {
      ratesMap.set(rate.date, {
        ...rate,
        updatedAt: new Date(rate.updatedAt).toISOString()
      });
    });

    // Process new rates
    let newCount = 0;
    let updateCount = 0;
    const errors = [];

    for (const [index, rate] of rates.entries()) {
      try {
        const validationError = validateExchangeRate(rate);
        if (validationError) {
          errors.push(`Fila ${index + 2}: ${validationError}`);
          continue;
        }

        const formattedDate = new Date(rate.date).toISOString().split('T')[0];
        const existing = ratesMap.get(formattedDate);
        
        const newRate = {
          id: existing?.id || randomUUID(),
          date: formattedDate,
          currency: String(rate.currency).trim().toUpperCase(),
          rate: Number(rate.rate),
          source: source || 'excel_import',
          createdAt: existing?.createdAt || timestamp,
          updatedAt: timestamp
        };

        existing ? updateCount++ : newCount++;
        ratesMap.set(formattedDate, newRate);
      } catch (err) {
        errors.push(`Fila ${index + 2}: ${err.message || 'Error desconocido'}`);
      }
    }

    // Update database with unique rates
    db.data.MasterExchangeRates = Array.from(ratesMap.values());
    await db.write();

    const message = [
      `Proceso completado:`,
      newCount > 0 ? `- ${newCount} nuevos registros agregados` : null,
      updateCount > 0 ? `- ${updateCount} registros actualizados` : null
    ].filter(Boolean).join('\n');

    res.json({ 
      success: true, 
      message,
      warnings: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    next(error);
  }
});

// Clear all exchange rates
router.delete('/master/clear', async (req, res, next) => {
  try {
    await db.read();
    db.data.MasterExchangeRates = [];
    await db.write();
    
    res.json({ 
      success: true, 
      message: 'Todos los tipos de cambio han sido eliminados'
    });
  } catch (error) {
    next(error);
  }
});

export default router;