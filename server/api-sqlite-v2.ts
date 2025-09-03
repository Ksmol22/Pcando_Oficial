import express from "express";
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, components, builds, categories } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize SQLite database
const dbPath = path.resolve(__dirname, '..', 'pcando.sqlite');
const sqlite = new Database(dbPath);
sqlite.pragma('foreign_keys = ON');
const db = drizzle(sqlite, { schema: { users, components, builds, categories } });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Simple logging
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} ${req.method} ${req.path}`);
  next();
});

// Initialize database tables if they don't exist
const initializeDatabase = () => {
  try {
    // Create tables
    sqlite.exec(`
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
    `);
    
    sqlite.exec(`
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
    `);
    
    sqlite.exec(`
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
    `);
    
    sqlite.exec(`
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
    `);
    
    // Insert sample data if tables are empty
    const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
      const insertUsers = sqlite.prepare(`
        INSERT INTO users (email, first_name, last_name, role)
        VALUES (?, ?, ?, ?)
      `);
      
      insertUsers.run('admin@pcando.com', 'Admin', 'User', 'admin');
      insertUsers.run('support@pcando.com', 'Support', 'User', 'support');
      insertUsers.run('demo@pcando.com', 'Demo', 'User', 'customer');
    }
    
    const categoryCount = sqlite.prepare('SELECT COUNT(*) as count FROM categories').get();
    if (categoryCount.count === 0) {
      const insertCategories = sqlite.prepare(`
        INSERT INTO categories (name, slug, description)
        VALUES (?, ?, ?)
      `);
      
      insertCategories.run('Procesadores', 'procesadores', 'CPUs para computadoras');
      insertCategories.run('Tarjetas Gráficas', 'tarjetas-graficas', 'GPUs para gaming y trabajo');
      insertCategories.run('Memoria RAM', 'memoria-ram', 'Memoria RAM DDR4 y DDR5');
      insertCategories.run('Almacenamiento', 'almacenamiento', 'SSDs y HDDs');
      insertCategories.run('Placas Base', 'placas-base', 'Motherboards para diferentes sockets');
      insertCategories.run('Fuentes de Poder', 'fuentes-poder', 'PSUs modulares y no modulares');
    }
    
    const componentCount = sqlite.prepare('SELECT COUNT(*) as count FROM components').get();
    if (componentCount.count === 0) {
      const insertComponents = sqlite.prepare(`
        INSERT INTO components (name, slug, type, brand, model, description, base_price, stock, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      // CPUs
      insertComponents.run('Intel Core i7-13700K', 'intel-i7-13700k', 'cpu', 'Intel', 'i7-13700K', 'Procesador de 16 núcleos para gaming', 389.99, 25, 1);
      insertComponents.run('AMD Ryzen 7 7800X3D', 'amd-ryzen-7-7800x3d', 'cpu', 'AMD', 'Ryzen 7 7800X3D', 'CPU gaming con 3D V-Cache', 449.99, 15, 1);
      
      // GPUs
      insertComponents.run('NVIDIA RTX 4080', 'nvidia-rtx-4080', 'gpu', 'NVIDIA', 'RTX 4080', 'Tarjeta gráfica high-end para 4K gaming', 1199.99, 10, 2);
      insertComponents.run('AMD RX 7900 XTX', 'amd-rx-7900-xtx', 'gpu', 'AMD', 'RX 7900 XTX', 'GPU potente para gaming y contenido', 999.99, 8, 2);
      
      // RAM
      insertComponents.run('Corsair Vengeance 32GB DDR5', 'corsair-vengeance-32gb-ddr5', 'memory', 'Corsair', 'Vengeance DDR5', '32GB DDR5-5600', 159.99, 30, 3);
      insertComponents.run('G.Skill Trident Z5 16GB', 'gskill-trident-z5-16gb', 'memory', 'G.Skill', 'Trident Z5', '16GB DDR5-6000', 89.99, 25, 3);
    }
    
    console.log('✅ Database initialized successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

// Initialize database on startup
initializeDatabase();

// API Routes with SQLite database
app.get('/api/auth/user', async (req, res) => {
  try {
    const user = await db.select().from(users).limit(1);
    if (user.length > 0) {
      res.json(user[0]);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length > 0) {
      res.json({
        user: user[0],
        token: `mock-token-${user[0].id}`
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/components', async (req, res) => {
  try {
    const { type, category } = req.query;
    
    let query = db.select().from(components);
    
    if (type) {
      query = query.where(eq(components.type, type as string));
    }
    
    const result = await query.limit(50);
    res.json(result);
  } catch (error) {
    console.error('Components error:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

app.get('/api/components/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const component = await db.select().from(components).where(eq(components.id, parseInt(id))).limit(1);
    
    if (component.length > 0) {
      res.json(component[0]);
    } else {
      res.status(404).json({ error: 'Component not found' });
    }
  } catch (error) {
    console.error('Component error:', error);
    res.status(500).json({ error: 'Failed to fetch component' });
  }
});

app.get('/api/builds', async (req, res) => {
  try {
    const result = await db.select().from(builds).limit(50);
    res.json(result);
  } catch (error) {
    console.error('Builds error:', error);
    res.status(500).json({ error: 'Failed to fetch builds' });
  }
});

app.get('/api/builds/featured', async (req, res) => {
  try {
    const result = await db.select().from(builds).limit(10);
    res.json(result);
  } catch (error) {
    console.error('Featured builds error:', error);
    res.status(500).json({ error: 'Failed to fetch featured builds' });
  }
});

app.post('/api/builds', async (req, res) => {
  try {
    const buildData = req.body;
    
    const [newBuild] = await db.insert(builds).values({
      name: buildData.name,
      description: buildData.description,
      useCase: buildData.useCase,
      components: JSON.stringify(buildData.components),
      totalPrice: buildData.totalPrice,
      performanceScore: buildData.performanceScore,
      category: buildData.category,
      userId: buildData.userId,
    }).returning();
    
    res.json(newBuild);
  } catch (error) {
    console.error('Create build error:', error);
    res.status(500).json({ error: 'Failed to create build' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const result = await db.select().from(categories);
    res.json(result);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: 'sqlite',
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 SQLite API Server running on http://localhost:${port}`);
  console.log(`📁 API available at http://localhost:${port}/api/`);
  console.log(`📊 Database: SQLite (pcando.sqlite)`);
  console.log(`🎯 Frontend should run on http://localhost:5173`);
});
