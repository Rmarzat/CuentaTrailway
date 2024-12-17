import express from 'express';
import { ExchangeRateService } from '../services/exchange-rates';

const router = express.Router();

// Get master exchange rates
router.get('/master/rates', async (req, res) => {
  try {
    const rates = await ExchangeRateService.getMasterRates();
    res.json({ data: rates });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al obtener tipos de cambio' 
    });
  }
});

// Upload master exchange rates
router.post('/master/upload', async (req, res) => {
  try {
    const { rates, source } = req.body;
    const result = await ExchangeRateService.uploadMasterRates(rates, source);
    res.json(result);
  } catch (error) {
    console.error('Error uploading rates:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al subir tipos de cambio' 
    });
  }
});

// Clear master exchange rates
router.delete('/master/clear', async (req, res) => {
  try {
    const result = await ExchangeRateService.clearMasterRates();
    res.json(result);
  } catch (error) {
    console.error('Error clearing rates:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al limpiar tipos de cambio' 
    });
  }
});

export const exchangeRatesRouter = router;