import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database configuration
const dbPath = join(__dirname, '..', '..', 'db.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, { 
  MasterExchangeRates: [] 
});

// Initialize database
export const initDatabase = async () => {
  try {
    await db.read();
    
    // Initialize collections if they don't exist
    db.data = db.data || { 
      MasterExchangeRates: [] 
    };
    
    await db.write();
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Database helper functions
export const dbGet = async (collection) => {
  await db.read();
  return db.data[collection] || [];
};

export const dbAdd = async (collection, item) => {
  await db.read();
  db.data[collection].push(item);
  await db.write();
  return item;
};

export const dbUpdate = async (collection, predicate, updates) => {
  await db.read();
  const index = db.data[collection].findIndex(predicate);
  if (index !== -1) {
    db.data[collection][index] = { 
      ...db.data[collection][index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await db.write();
    return db.data[collection][index];
  }
  return null;
};

export const dbRemove = async (collection, predicate) => {
  await db.read();
  const initialLength = db.data[collection].length;
  db.data[collection] = db.data[collection].filter(item => !predicate(item));
  await db.write();
  return initialLength !== db.data[collection].length;
};

export { db };