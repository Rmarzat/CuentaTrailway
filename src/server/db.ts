import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(process.cwd(), 'database.sqlite');
const schemaPath = join(process.cwd(), 'schema.sql');

// Create database instance
const db = new Database(dbPath);

// Initialize database with schema
try {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('✅ Database schema initialized');
} catch (error) {
  console.error('❌ Database initialization error:', error);
  process.exit(1);
}

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;