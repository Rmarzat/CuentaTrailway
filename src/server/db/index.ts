import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';

// Database setup
const dbFile = join(process.cwd(), 'db.json');
const adapter = new JSONFile(dbFile);
export const db = new Low(adapter, { MasterExchangeRates: [] });

// Initialize database
export const initDb = async () => {
  try {
    await db.read();
    if (!db.data) {
      db.data = { MasterExchangeRates: [] };
      await db.write();
    }
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};