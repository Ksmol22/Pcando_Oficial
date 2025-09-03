import express from "express";
import { db } from "./db-sqlite.js";
import { users, components, builds, categories } from "../shared/schema.js";
import { eq } from "drizzle-orm";

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

// API Routes with SQLite database
app.get('/api/auth/user', async (req, res) => {
  try {
    // For demo purposes, return first user
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
    
    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length > 0) {
      // In a real app, you'd verify the password hash
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
