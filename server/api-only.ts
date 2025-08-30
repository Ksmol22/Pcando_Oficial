import express from "express";

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

// Mock API Routes
app.get('/api/auth/user', (req, res) => {
  res.json({
    id: "dev-user-123",
    email: "developer@pcando.com",
    firstName: "Developer",
    lastName: "User",
    profileImageUrl: "https://via.placeholder.com/150",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
});

app.get('/api/users', (req, res) => {
  res.json([
    {
      id: "1",
      email: "user1@example.com",
      firstName: "Juan",
      lastName: "García",
      profileImageUrl: "https://via.placeholder.com/150",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      email: "user2@example.com",
      firstName: "María",
      lastName: "López",
      profileImageUrl: "https://via.placeholder.com/150",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);
});

app.get('/api/components', (req, res) => {
  const { type } = req.query;
  
  const components = [
    {
      id: "1",
      type: "processor",
      name: "Intel Core i7-13700K",
      manufacturer: "Intel",
      price: 409.99,
      specifications: {
        cores: 16,
        threads: 24,
        baseClockGHz: 3.4,
        boostClockGHz: 5.4,
        socket: "LGA1700",
        tdp: 125
      },
      performance: {
        gaming: 95,
        productivity: 98,
        streaming: 92
      },
      imageUrl: "https://via.placeholder.com/300x200?text=Intel+i7-13700K",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "graphics_card",
      name: "NVIDIA RTX 4080",
      manufacturer: "NVIDIA",
      price: 1199.99,
      specifications: {
        vram: 16,
        baseClock: 2205,
        boostClock: 2505,
        memoryType: "GDDR6X",
        powerDraw: 320
      },
      performance: {
        gaming: 98,
        rayTracing: 95,
        dlss: 99
      },
      imageUrl: "https://via.placeholder.com/300x200?text=RTX+4080",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      type: "memory",
      name: "Corsair Vengeance LPX 32GB DDR4",
      manufacturer: "Corsair",
      price: 129.99,
      specifications: {
        capacity: 32,
        speed: 3200,
        type: "DDR4",
        latency: "16-18-18-36",
        voltage: 1.35
      },
      performance: {
        speed: 85,
        latency: 88,
        overclocking: 90
      },
      imageUrl: "https://via.placeholder.com/300x200?text=Corsair+32GB",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  if (type) {
    const filteredComponents = components.filter(c => c.type === type);
    res.json(filteredComponents);
  } else {
    res.json(components);
  }
});

app.get('/api/builds', (req, res) => {
  res.json([
    {
      id: "1",
      name: "Gaming Beast",
      description: "Ultimate gaming setup for 4K gaming",
      userId: "1",
      components: {
        processor: "1",
        graphics_card: "2",
        memory: "3"
      },
      totalPrice: 1739.97,
      estimatedPerformance: {
        gaming: 96,
        productivity: 93,
        streaming: 90
      },
      isPublic: true,
      tags: ["gaming", "4k", "high-end"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);
});

app.post('/api/builds', (req, res) => {
  const { name, description, components } = req.body;
  
  const newBuild = {
    id: Date.now().toString(),
    name,
    description,
    userId: "dev-user-123",
    components,
    totalPrice: 0,
    estimatedPerformance: {
      gaming: 80,
      productivity: 75,
      streaming: 70
    },
    isPublic: true,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  res.status(201).json(newBuild);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mode: 'API-only development server'
  });
});

const port = parseInt(process.env.PORT || '3001', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API Server running on http://localhost:${port}`);
  console.log(`📁 API available at http://localhost:${port}/api/`);
  console.log(`🎯 Frontend should run on http://localhost:5173`);
});
