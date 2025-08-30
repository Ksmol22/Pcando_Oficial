import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} ${req.method} ${req.path}`);
  next();
});

// API Routes with mock data
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

app.get('/api/components', (req, res) => {
  const mockComponents = [
    {
      id: "cpu-1",
      name: "AMD Ryzen 7 7800X3D",
      type: "cpu",
      brand: "AMD",
      model: "7800X3D",
      basePrice: "449.99",
      specifications: {
        cores: 8,
        threads: 16,
        baseClock: "4.2 GHz",
        boostClock: "5.0 GHz",
      },
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "gpu-1",
      name: "NVIDIA RTX 4080",
      type: "gpu",
      brand: "NVIDIA",
      model: "RTX 4080",
      basePrice: "1199.99",
      specifications: {
        memory: "16GB GDDR6X",
        powerConsumption: "320W",
      },
      isActive: true,
      createdAt: new Date().toISOString(),
    }
  ];

  const { type } = req.query;
  if (type) {
    res.json(mockComponents.filter(c => c.type === type));
  } else {
    res.json(mockComponents);
  }
});

app.get('/api/builds', (req, res) => {
  res.json([
    {
      id: "build-1",
      userId: "dev-user-123",
      name: "Gaming PC 2024",
      description: "High-end gaming build",
      isPublic: true,
      totalPrice: "2500.00",
      createdAt: new Date().toISOString(),
    }
  ]);
});

// Serve static files in production
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const distPath = path.resolve(__dirname, '..', 'dist', 'public');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  // In development, we'll set up Vite manually
  console.log('🔧 Development mode: Setting up Vite...');
  
  // Import and setup Vite dynamically to avoid dependency issues
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
});
