import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { promisify } from 'util';

// Initialize database
const dbFile = join(process.cwd(), 'db.json');

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { 
  MasterExchangeRates: [],
  Users: []
});

// Ensure database is initialized with default structure
const initDb = async () => {
  await db.read();
  if (!db.data) {
    db.data = { 
      MasterExchangeRates: [],
      Users: []
    };
    await db.write();
  }
  
  // Add admin user if not exists
  if (!db.data.Users.some(u => u.email === 'admin@sistema.com')) {
    const adminUser = {
      id: '1',
      email: 'admin@sistema.com',
      name: 'Administrador',
      password: '123456',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.data.Users.push(adminUser);
    await db.write();
  }

  return true;
};

// Initialize database on startup
initDb().catch(err => {
  console.error('Database initialization error:', err);
  process.exit(1);
});

const api = express();

// CORS configuration
api.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

// Body parsing middleware
api.use(express.json({ limit: '50mb' }));
api.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
api.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db.data ? 'connected' : 'error'
  });
});
// Auth endpoints
api.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    await db.read();
    const user = db.data.Users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    if (user.status === 'suspended') {
      return res.status(401).json({ error: 'Usuario suspendido' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

api.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    await db.read();
    if (db.data.Users.some(u => u.email === email)) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      role: 'pending',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.data.Users.push(newUser);
    await db.write();
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Error handling middleware
api.use((req, res, next) => {
  res.on('error', (error) => {
    console.error('Response error:', error);
  });
  next();
});

api.use((err: any, req: any, res: any, next: any) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Health check endpoint
api.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Validate exchange rate data
const validateRate = (rate: any) => {
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

  return null;
};

// Exchange rates endpoints
api.get('/exchange-rates/master/rates', async (req, res) => {
  try {
    await db.read();
    
    const rates = db.data.MasterExchangeRates;
    
    // Sort rates by date in descending order
    const sortedRates = [...rates].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    res.json({ 
      success: true, 
      data: sortedRates
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ 
      error: 'Error al obtener tipos de cambio',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});
    }
    const rates = db.data.MasterExchangeRates || [];
    res.json({ data: rates });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ 
      error: 'Error al obtener tipos de cambio',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

api.post('/exchange-rates/master/upload', async (req, res) => {
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
    const errors: string[] = [];
    
    // Process rates with validation
    const processedRates = rates
      .map((rate, index) => {
        const error = validateRate(rate);
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
      return res.status(400).json({ 
        error: 'Error al procesar datos',
        message: errors.join('\n')
      });
    }

    // Update database
    db.data.MasterExchangeRates = [
      ...db.data.MasterExchangeRates,
      ...processedRates
    ];
    
    // Sort by date
    db.data.MasterExchangeRates.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    await db.write();

    res.json({ 
      success: true, 
      message: `Se importaron ${processedRates.length} registros correctamente`,
      warnings: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error uploading rates:', error);
    res.status(500).json({ 
      error: 'Error al subir tipos de cambio',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

api.delete('/exchange-rates/master/clear', async (req, res) => {
  try {
    await db.read();
    db.data.MasterExchangeRates = [];
    await db.write();
    
    res.json({ 
      success: true, 
      message: 'Todos los tipos de cambio han sido eliminados'
    });
  } catch (error) {
    console.error('Error clearing rates:', error);
    res.status(500).json({ 
      error: 'Error al limpiar tipos de cambio',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export const handler = serverless(api);