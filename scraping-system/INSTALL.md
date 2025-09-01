# 🚀 Guía de Instalación y Uso - Sistema de Scraping PCando

Esta guía te ayudará a instalar y configurar el sistema de scraping para comparación de precios paso a paso.

## 📋 Prerrequisitos

### Requisitos del Sistema
- **Node.js** versión 16 o superior
- **npm** o **yarn**
- **Git**
- **4GB RAM** mínimo (recomendado 8GB)
- **2GB espacio libre** en disco

### Verificar Instalación
```bash
node --version  # Debe mostrar v16.0.0 o superior
npm --version   # Debe mostrar 6.0.0 o superior
```

## 🛠️ Instalación

### Paso 1: Navegar al Directorio del Sistema
```bash
cd /Users/kevinmolina/Documents/GitHub/Pcando_Oficial/scraping-system
```

### Paso 2: Instalar Dependencias
```bash
# Opción 1: Instalación automática (recomendado)
npm run setup

# Opción 2: Instalación manual
npm install
```

### Paso 3: Verificar Instalación
```bash
npm run config
```

Deberías ver la configuración del sistema en formato JSON.

## 🚀 Uso Básico

### Iniciar el Sistema
```bash
# Modo normal
npm start

# Modo desarrollo (con auto-restart)
npm run dev

# Modo prueba (incluye test automático)
npm run test
```

### Verificar que Funciona
Una vez iniciado, deberías ver:
```
🚀 Iniciando Sistema de Scraping PCando Oficial
================================================
✅ Sistema iniciado correctamente

📊 Endpoints de la API:
   http://localhost:3001/api/health
   http://localhost:3001/api/scraping/search?query=RTX%204070
   ...
```

### Probar la API
```bash
# Test de salud del sistema
curl "http://localhost:3001/api/health"

# Buscar productos
curl "http://localhost:3001/api/scraping/search?query=Intel%20Core%20i7&maxResults=5"

# Comparar precios
curl "http://localhost:3001/api/scraping/compare?productName=RTX%204070"

# Ver estadísticas
curl "http://localhost:3001/api/scraping/stats"
```

## 🔧 Configuración Avanzada

### Variables de Entorno (Opcional)
Crea un archivo `.env` en el directorio `scraping-system`:

```env
# Base de datos (opcional)
DATABASE_URL=postgresql://user:pass@localhost:5432/pcando_scraping

# Redis para cache (opcional)
REDIS_URL=redis://localhost:6379

# Proxies (opcional, para evitar bloqueos)
PROXY_LIST=proxy1.com:8080,proxy2.com:8080

# Resolver captchas (opcional)
CAPTCHA_SOLVER_KEY=your-2captcha-key

# Rate limiting
MAX_REQUESTS_PER_MINUTE=60
CONCURRENT_SCRAPERS=3

# Modo desarrollo
NODE_ENV=development
```

### Personalizar Configuración
Edita el archivo `config/scraping-config.json`:

```json
{
  "scrapers": {
    "amazon": {
      "enabled": true,
      "delay": 3000,  // Aumentar delay si hay bloqueos
      "maxConcurrent": 1
    },
    "mercadolibre": {
      "enabled": true,
      "delay": 1000   // Reducir delay para ir más rápido
    }
  }
}
```

## 🌐 Integración con Frontend

### Paso 1: Copiar Componentes
```bash
# Desde el directorio principal del proyecto
cp -r scraping-system/frontend-integration/* client/src/components/scraping/
```

### Paso 2: Importar en tu Página
```tsx
// En tu componente React
import ProductSearch from '@/components/scraping/ProductSearch';
import PriceComparison from '@/components/scraping/PriceComparison';
import MarketplacePage from '@/components/scraping/MarketplacePage';

// Usar el componente
function App() {
  return (
    <div>
      <MarketplacePage />
    </div>
  );
}
```

### Paso 3: Actualizar Rutas
```tsx
// En tu router principal
import MarketplacePage from '@/pages/MarketplacePage';

// Agregar ruta
<Route path="/marketplace" component={MarketplacePage} />
```

## 📱 Ejemplos de Uso

### Búsqueda Simple
```typescript
const searchProducts = async () => {
  const response = await fetch('http://localhost:3001/api/scraping/search?query=RTX 4070');
  const data = await response.json();
  console.log(data.results);
};
```

### Comparación de Precios
```typescript
const compareProducts = async () => {
  const response = await fetch('http://localhost:3001/api/scraping/compare?productName=Intel Core i7-13700K');
  const data = await response.json();
  console.log(data.bestPrice);
};
```

### Con Filtros Avanzados
```typescript
const advancedSearch = async () => {
  const params = new URLSearchParams({
    query: 'gaming motherboard',
    sources: 'amazon,mercadolibre_mx',
    maxResults: '20',
    category: 'motherboard'
  });
  
  const response = await fetch(`http://localhost:3001/api/scraping/search?${params}`);
  const data = await response.json();
};
```

## 🔍 Solución de Problemas

### Error: "ENOTSUP: operation not supported"
```bash
# Cambiar la configuración de red
export HOST=127.0.0.1
npm start
```

### Error: "Puppeteer download failed"
```bash
# Instalar Puppeteer manualmente
npm install puppeteer --ignore-scripts=false

# O usar versión ligera
npm install puppeteer-core
```

### Error: "Rate limiting" o "Blocked"
```bash
# Reducir la velocidad en config/scraping-config.json
{
  "scrapers": {
    "amazon": {
      "delay": 5000  // Aumentar delay
    }
  }
}
```

### Error de Memoria
```bash
# Iniciar con más memoria
node --max-old-space-size=4096 start.js
```

### Captcha o Bloqueos Frecuentes
1. **Usar proxies**: Configurar `PROXY_LIST` en `.env`
2. **Reducir velocidad**: Aumentar `delay` en configuración
3. **User agents**: El sistema rota automáticamente
4. **Headers**: Se incluyen headers realistas

## 📊 Monitoreo

### Ver Estadísticas en Tiempo Real
```bash
# Estadísticas generales
curl "http://localhost:3001/api/scraping/stats"

# Estado del sistema
curl "http://localhost:3001/api/health"
```

### Logs del Sistema
```bash
# Ver logs en consola
npm start

# Logs en archivo (opcional)
npm start > logs/scraping.log 2>&1
```

### Métricas Importantes
- **Success Rate**: % de requests exitosos
- **Cache Hit Rate**: % de respuestas desde cache
- **Average Response Time**: Tiempo promedio de respuesta
- **Active Scrapers**: Scrapers funcionando

## 🚦 Estados del Sistema

### ✅ Todo Funcionando
```
🚀 Sistema iniciado correctamente
✅ Amazon (con Puppeteer)
✅ MercadoLibre (MX, AR, CO)
```

### ⚠️ Advertencias Comunes
```
⚠️  Rate limiting active for amazon
⚠️  Cache hit rate low (15%)
⚠️  Some products returned null
```

### ❌ Errores Críticos
```
❌ Puppeteer failed to launch
❌ Network connection failed
❌ Invalid configuration
```

## 🔒 Consideraciones Legales

### ✅ Permitido
- Scraping de datos públicos
- Información de precios públicamente disponible
- Respeto de robots.txt
- Rate limiting apropiado

### ❌ No Permitido
- Scraping de contenido protegido por derechos de autor
- Saturar servidores con requests
- Ignorar términos de servicio
- Vender datos sin permiso

### 📋 Buenas Prácticas
1. **Rate Limiting**: No más de 60 requests/minuto por sitio
2. **User Agents**: Usar user agents realistas
3. **Horarios**: Evitar scraping en horarios pico
4. **Cache**: Usar cache para reducir requests
5. **Monitoreo**: Supervisar tasa de éxito

## 🆘 Soporte

### Obtener Ayuda
```bash
# Ver ayuda del sistema
npm run help

# Ver configuración actual
npm run config

# Ejecutar en modo debug
DEBUG=* npm start
```

### Reportar Problemas
1. **Logs completos**: Incluir salida de consola
2. **Configuración**: Compartir configuración (sin claves)
3. **Pasos para reproducir**: Detallar el problema
4. **Entorno**: Sistema operativo, versión Node.js, etc.

### Contacto
- **GitHub Issues**: https://github.com/Ksmol22/Pcando_Oficial/issues
- **Email**: kevin@pcando.com
- **Discord**: PCando Community

---

## 🎉 ¡Listo para Usar!

Una vez que hayas seguido estos pasos, tu sistema de scraping estará funcionando y podrás:

✅ Buscar productos en múltiples tiendas  
✅ Comparar precios automáticamente  
✅ Integrar con tu frontend React  
✅ Monitorear el rendimiento del sistema  
✅ Expandir con nuevos scrapers  

**¡Feliz scraping! 🚀**
