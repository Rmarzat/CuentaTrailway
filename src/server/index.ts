```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { initDb } from './db';
import { exchangeRatesRouter } from './routes/exchange-rates';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/exchange-rates', exchangeRatesRouter);

// Initialize database and start server
async function startServer() {
  try {
    await initDb();
    console.log('Database initialized successfully');

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('Server Error:', err);
      res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor'
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`
🚀 Server running successfully

📡 API URLs:
   - Local:   http://localhost:${PORT}
   - Health:  http://localhost:${PORT}/api/health

💾 Database: Connected
      `);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```