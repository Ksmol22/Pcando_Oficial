# Sistema de Scraping de Productos - PCando Oficial

## 📋 Descripción General

Este sistema permite extraer información de productos de diferentes fabricantes y tiendas virtuales, incluyendo precios, especificaciones y disponibilidad. Los datos se almacenan y sirven a través de una API REST.

## 🏗️ Arquitectura del Sistema

```
scraping-system/
├── README.md                 # Esta documentación
├── scrapers/                 # Scrapers específicos por sitio
│   ├── amazon-scraper.js
│   ├── mercadolibre-scraper.js
│   ├── newegg-scraper.js
│   └── fabricantes/
│       ├── intel-scraper.js
│       ├── amd-scraper.js
│       └── nvidia-scraper.js
├── api/                      # API endpoints
│   ├── products-api.js
│   ├── price-comparison.js
│   └── middleware/
│       ├── rate-limiter.js
│       └── cache.js
├── database/                 # Esquemas y migraciones
│   ├── models/
│   │   ├── Product.js
│   │   ├── Price.js
│   │   └── Source.js
│   └── migrations/
├── scheduler/                # Sistema de tareas programadas
│   ├── cron-jobs.js
│   └── queue-manager.js
├── utils/                    # Utilidades compartidas
│   ├── proxy-manager.js
│   ├── captcha-solver.js
│   └── data-validator.js
├── config/                   # Configuraciones
│   ├── sites-config.json
│   └── scraping-rules.json
└── frontend-integration/     # Componentes para el frontend
    ├── ProductSearch.tsx
    ├── PriceComparison.tsx
    └── ProductCard.tsx
```

## 🚀 Funcionalidades Principales

### 1. **Scrapers por Categoría**
- **Tiendas Online**: Amazon, MercadoLibre, Newegg, Best Buy
- **Fabricantes**: Intel, AMD, NVIDIA, ASUS, MSI
- **Distribuidores**: CDW, B&H Photo, Micro Center

### 2. **API Endpoints**
- `GET /api/products/search` - Buscar productos
- `GET /api/products/:id/prices` - Obtener historial de precios
- `GET /api/products/compare` - Comparar precios entre sitios
- `POST /api/scraping/trigger` - Activar scraping manual

### 3. **Características Técnicas**
- **Rate Limiting**: Respeta límites de cada sitio
- **Proxy Rotation**: Evita bloqueos por IP
- **Cache Inteligente**: Reduce requests innecesarios
- **Queue System**: Maneja trabajos de scraping
- **Real-time Updates**: WebSocket para actualizaciones

## 📊 Estructura de Datos

### Producto
```json
{
  "id": "uuid",
  "name": "Intel Core i7-13700K",
  "category": "CPU",
  "brand": "Intel",
  "model": "i7-13700K",
  "specifications": {
    "cores": 16,
    "threads": 24,
    "baseClock": "3.4GHz",
    "maxClock": "5.4GHz",
    "socket": "LGA1700"
  },
  "images": ["url1", "url2"],
  "createdAt": "2025-01-09T10:00:00Z",
  "updatedAt": "2025-01-09T10:00:00Z"
}
```

### Precio
```json
{
  "id": "uuid",
  "productId": "product-uuid",
  "sourceId": "source-uuid",
  "price": 399.99,
  "currency": "USD",
  "availability": "In Stock",
  "url": "https://tienda.com/producto",
  "scrapedAt": "2025-01-09T10:00:00Z"
}
```

### Fuente
```json
{
  "id": "uuid",
  "name": "Amazon",
  "baseUrl": "https://amazon.com",
  "country": "US",
  "isActive": true,
  "lastScraped": "2025-01-09T09:45:00Z",
  "successRate": 98.5
}
```

## 🛡️ Consideraciones Legales y Éticas

1. **Respeto por robots.txt**
2. **Rate limiting apropiado**
3. **No sobrecarga de servidores**
4. **Cumplimiento de términos de servicio**
5. **Datos públicos únicamente**

## ⚡ Instalación y Configuración

### Prerrequisitos
```bash
npm install puppeteer cheerio axios
npm install node-cron bull redis
npm install express helmet cors
```

### Variables de Entorno
```env
# Base de datos
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379

# Proxies (opcional)
PROXY_LIST=proxy1.com:8080,proxy2.com:8080

# APIs externas
CAPTCHA_SOLVER_KEY=your-key
PROXY_SERVICE_KEY=your-key

# Rate limiting
MAX_REQUESTS_PER_MINUTE=60
CONCURRENT_SCRAPERS=3
```

## 🔧 Uso Básico

### 1. Inicializar el Sistema
```javascript
const ScrapingSystem = require('./api/scraping-system');
const system = new ScrapingSystem();
await system.initialize();
```

### 2. Agregar un Scraper
```javascript
system.addScraper('amazon', {
  baseUrl: 'https://amazon.com',
  selectors: {
    title: 'h1#productTitle',
    price: '.a-price-whole',
    availability: '#availability span'
  }
});
```

### 3. Buscar Productos
```javascript
const results = await system.searchProducts('RTX 4070');
// Retorna productos de múltiples fuentes con precios actualizados
```

## 📈 Monitoreo y Análisis

### Métricas Importantes
- **Éxito de Scraping**: % de requests exitosos
- **Tiempo de Respuesta**: Latencia promedio
- **Cobertura de Productos**: Cantidad de productos monitoreados
- **Frecuencia de Actualización**: Qué tan actualizados están los precios

### Dashboard de Administración
- Vista en tiempo real del estado del sistema
- Logs de scraping y errores
- Gestión de fuentes y productos
- Configuración de alertas

## 🔄 Integración con Frontend

### Componente de Búsqueda
```tsx
import { ProductSearch } from './scraping-system/frontend-integration';

function App() {
  return (
    <ProductSearch 
      onResults={(products) => setProducts(products)}
      realTimeUpdates={true}
    />
  );
}
```

### Comparador de Precios
```tsx
import { PriceComparison } from './scraping-system/frontend-integration';

function ProductDetail({ productId }) {
  return (
    <PriceComparison 
      productId={productId}
      showHistorical={true}
    />
  );
}
```

## 🚨 Manejo de Errores Comunes

1. **Captcha**: Integración con servicios de resolución
2. **Rate Limiting**: Cola de requests y retry logic
3. **Cambios de Estructura**: Sistema de alertas para cambios en sitios
4. **Proxies Bloqueados**: Rotación automática de proxies

## 📅 Roadmap

- [ ] **Fase 1**: Scrapers básicos (Amazon, MercadoLibre)
- [ ] **Fase 2**: API REST completa
- [ ] **Fase 3**: Sistema de alertas de precios
- [ ] **Fase 4**: Machine Learning para detección de ofertas
- [ ] **Fase 5**: Móvil app con notificaciones push

## 🤝 Contribuir

1. Fork el repositorio
2. Crear branch para nueva feature
3. Agregar tests para el scraper
4. Documentar selectores CSS utilizados
5. Crear pull request

## ⚖️ Limitaciones y Disclaimers

- **Responsabilidad**: El uso debe cumplir términos de servicio
- **Exactitud**: Los precios pueden cambiar entre scraping
- **Disponibilidad**: Algunos sitios pueden bloquear bots
- **Legalidad**: Verificar leyes locales sobre web scraping

---
*Creado para PCando Oficial - Sistema de Comparación de Precios*
