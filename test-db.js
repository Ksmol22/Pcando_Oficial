import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, 'pcando.sqlite');

console.log('Database path:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Check if database file exists
  console.log('Database opened successfully');
  
  // Get table info
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables);
  
  // Get schema
  const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table'").all();
  console.log('Schema:', schema);
  
  db.close();
} catch (error) {
  console.error('Database error:', error);
}
