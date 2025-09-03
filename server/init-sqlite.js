import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "../shared/schema.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '..', 'pcando.sqlite');

console.log('Initializing SQLite database at:', dbPath);

try {
  // Create or open SQLite database
  const sqlite = new Database(dbPath);
  
  // Enable foreign keys
  sqlite.pragma('foreign_keys = ON');
  
  console.log('Database opened successfully');
  
  // Create tables manually
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      profile_image_url TEXT,
      role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'support')),
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  const createComponentsTable = `
    CREATE TABLE IF NOT EXISTS components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      specifications TEXT,
      base_price REAL NOT NULL,
      current_price REAL,
      discount REAL DEFAULT 0,
      stock INTEGER DEFAULT 0 NOT NULL,
      min_stock INTEGER DEFAULT 5 NOT NULL,
      sku TEXT UNIQUE,
      category_id INTEGER REFERENCES categories(id),
      is_active INTEGER NOT NULL DEFAULT 1,
      is_featured INTEGER NOT NULL DEFAULT 0,
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  const createBuildsTable = `
    CREATE TABLE IF NOT EXISTS builds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      use_case TEXT,
      components TEXT,
      total_price REAL DEFAULT 0,
      performance_score INTEGER DEFAULT 0,
      category TEXT DEFAULT 'custom',
      user_id TEXT,
      is_public INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      views_count INTEGER DEFAULT 0,
      likes_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Execute table creation
  sqlite.exec(createUsersTable);
  sqlite.exec(createCategoriesTable);
  sqlite.exec(createComponentsTable);
  sqlite.exec(createBuildsTable);
  
  console.log('Tables created successfully');
  
  // Insert sample data
  const insertSampleUsers = sqlite.prepare(`
    INSERT OR IGNORE INTO users (email, first_name, last_name, role)
    VALUES (?, ?, ?, ?)
  `);
  
  insertSampleUsers.run('admin@pcando.com', 'Admin', 'User', 'admin');
  insertSampleUsers.run('support@pcando.com', 'Support', 'User', 'support');
  insertSampleUsers.run('demo@pcando.com', 'Demo', 'User', 'customer');
  
  // Insert sample categories
  const insertCategory = sqlite.prepare(`
    INSERT OR IGNORE INTO categories (name, slug, description)
    VALUES (?, ?, ?)
  `);
  
  insertCategory.run('Procesadores', 'procesadores', 'CPUs para computadoras');
  insertCategory.run('Tarjetas Gráficas', 'tarjetas-graficas', 'GPUs para gaming y trabajo');
  insertCategory.run('Memoria RAM', 'memoria-ram', 'Memoria RAM DDR4 y DDR5');
  insertCategory.run('Almacenamiento', 'almacenamiento', 'SSDs y HDDs');
  insertCategory.run('Placas Base', 'placas-base', 'Motherboards para diferentes sockets');
  insertCategory.run('Fuentes de Poder', 'fuentes-poder', 'PSUs modulares y no modulares');
  
  // Insert sample components
  const insertComponent = sqlite.prepare(`
    INSERT OR IGNORE INTO components (name, slug, type, brand, model, description, base_price, stock, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // CPUs
  insertComponent.run('Intel Core i7-13700K', 'intel-i7-13700k', 'cpu', 'Intel', 'i7-13700K', 'Procesador de 16 núcleos para gaming', 389.99, 25, 1);
  insertComponent.run('AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d', 'cpu', 'AMD', 'Ryzen 7 7800X3D', 'CPU gaming con 3D V-Cache', 449.99, 15, 1);
  
  // GPUs
  insertComponent.run('NVIDIA RTX 4080', 'nvidia-rtx-4080', 'gpu', 'NVIDIA', 'RTX 4080', 'Tarjeta gráfica high-end para 4K gaming', 1199.99, 10, 2);
  insertComponent.run('AMD RX 7900 XTX', 'amd-rx-7900-xtx', 'gpu', 'AMD', 'RX 7900 XTX', 'GPU potente para gaming y contenido', 999.99, 8, 2);
  
  // RAM
  insertComponent.run('Corsair Vengeance 32GB DDR5', 'corsair-vengeance-32gb-ddr5', 'memory', 'Corsair', 'Vengeance DDR5', '32GB DDR5-5600', 159.99, 30, 3);
  insertComponent.run('G.Skill Trident Z5 16GB', 'gskill-trident-z5-16gb', 'memory', 'G.Skill', 'Trident Z5', '16GB DDR5-6000', 89.99, 25, 3);
  
  console.log('Sample data inserted successfully');
  
  // Verify data
  const users = sqlite.prepare('SELECT COUNT(*) as count FROM users').get();
  const components = sqlite.prepare('SELECT COUNT(*) as count FROM components').get();
  const categories = sqlite.prepare('SELECT COUNT(*) as count FROM categories').get();
  
  console.log(`Database initialized with:
    - Users: ${users.count}
    - Components: ${components.count}
    - Categories: ${categories.count}`);
  
  sqlite.close();
  console.log('Database initialization completed successfully');
  
} catch (error) {
  console.error('Database initialization failed:', error);
}
