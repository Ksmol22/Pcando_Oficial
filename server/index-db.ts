import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { users, components, builds } from "@shared/schema";
import { eq } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database setup
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set');
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware para permitir comunicación con scraping system
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Simple logging
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} ${req.method} ${req.path}`);
  next();
});

// API Routes with real database
app.get('/api/auth/user', async (req, res) => {
  try {
    // Get or create dev user
    let user = await db.select().from(users).where(eq(users.id, "dev-user-123")).limit(1);
    
    if (user.length === 0) {
      // Create dev user if doesn't exist
      const [newUser] = await db.insert(users).values({
        id: "dev-user-123",
        email: "developer@pcando.com",
        firstName: "Developer",
        lastName: "User",
        profileImageUrl: "https://via.placeholder.com/150",
      }).returning();
      
      res.json(newUser);
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

app.get('/api/components', async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = db.select().from(components).where(eq(components.isActive, true));
    
    if (type && typeof type === 'string') {
      query = query.where(eq(components.type, type as any));
    }
    
    const result = await query;
    res.json(result);
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ message: "Error fetching components" });
  }
});

app.get('/api/builds', async (req, res) => {
  try {
    const result = await db.select().from(builds).where(eq(builds.isPublic, true));
    res.json(result);
  } catch (error) {
    console.error('Error fetching builds:', error);
    res.status(500).json({ message: "Error fetching builds" });
  }
});

// Endpoints para sistema de scraping
app.post('/api/scraping/products', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Invalid products data' });
    }

    // Aquí podrías guardar los productos en la base de datos
    // Por ahora solo los devolvemos como confirmación
    console.log(`📦 Received ${products.length} products from scraping system`);
    
    res.json({ 
      success: true, 
      message: `Processed ${products.length} products`,
      count: products.length 
    });
  } catch (error) {
    console.error('Error processing scraped products:', error);
    res.status(500).json({ message: 'Error processing products' });
  }
});

app.get('/api/scraping/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'backend',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const distPath = path.resolve(__dirname, '..', 'dist');
  const clientPath = path.resolve(__dirname, '..', 'client');
  
  // Try multiple possible paths for static files
  if (fs.existsSync(distPath)) {
    console.log('📁 Serving built files from dist/');
    app.use(express.static(distPath));
  } else if (fs.existsSync(clientPath)) {
    console.log('⚠️  No dist folder, serving client files directly');
    app.use(express.static(clientPath));
  }
  
  app.get('*', (req, res) => {
    const distIndexPath = path.resolve(distPath, 'index.html');
    const clientIndexPath = path.resolve(clientPath, 'index.html');
    
    if (fs.existsSync(distIndexPath)) {
      res.sendFile(distIndexPath);
    } else if (fs.existsSync(clientIndexPath)) {
      res.sendFile(clientIndexPath);
    } else {
      // Send a basic HTML page if no index.html found
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PCando Oficial</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
              .status { background: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0; }
              ul { list-style-type: none; padding: 0; }
              li { margin: 10px 0; }
              a { color: #007acc; text-decoration: none; padding: 8px 12px; border: 1px solid #007acc; border-radius: 4px; display: inline-block; }
              a:hover { background: #007acc; color: white; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🖥️ PCando Oficial</h1>
              <div class="status">✅ Server running successfully!</div>
              <p>API endpoints available:</p>
              <ul>
                <li><a href="/api/users">👥 Users API</a></li>
                <li><a href="/api/components">⚙️ Components API</a></li>
                <li><a href="/api/builds">🔧 Builds API</a></li>
                <li><a href="/health">❤️ Health Check</a></li>
              </ul>
              <p><small>To access the full application, run: <code>npm run dev:db</code></small></p>
            </div>
          </body>
        </html>
      `);
    }
  });
} else {
  // In development, we'll set up Vite manually
  console.log('🔧 Development mode: Setting up Vite...');
  
  // Import and setup Vite dynamically
  import('vite').then(({ createServer }) => {
    createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.resolve(__dirname, '..', 'client'),
    }).then(vite => {
      app.use(vite.middlewares);
      
      app.use('*', async (req, res, next) => {
        try {
          const url = req.originalUrl;
          const template = await import('fs').then(fs => 
            fs.promises.readFile(
              path.resolve(__dirname, '..', 'client', 'index.html'), 
              'utf-8'
            )
          );
          const html = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
          vite.ssrFixStacktrace(e);
          next(e);
        }
      });
    });
  }).catch(console.error);
}

const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📁 API available at http://localhost:${port}/api/`);
  console.log(`💾 Database connected: ${pool.options.database || 'pcando_db'}`);
});
