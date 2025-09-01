const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Importar scrapers
const AmazonScraper = require('../scrapers/amazon-scraper');
const MercadoLibreScraper = require('../scrapers/mercadolibre-scraper');

// Importar utilidades
const CacheManager = require('../utils/cache-manager');
const DataValidator = require('../utils/data-validator');

/**
 * API principal para el sistema de scraping
 * Maneja requests de búsqueda y comparación de precios
 */
class ScrapingAPI {
  constructor(port = 3001) {
    this.app = express();
    this.port = port;
    this.scrapers = new Map();
    this.cache = new CacheManager();
    this.validator = new DataValidator();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeScrapers();
  }

  /**
   * Configurar middleware de Express
   */
  setupMiddleware() {
    // Seguridad
    this.app.use(helmet());
    this.app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 requests por ventana
      message: {
        error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
      }
    });
    this.app.use('/api/scraping', limiter);

    // Parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging middleware
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
      });
      next();
    });
  }

  /**
   * Configurar rutas de la API
   */
  setupRoutes() {
    // Ruta de salud del sistema
    this.app.get('/api/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        scrapers: Array.from(this.scrapers.keys()),
        uptime: process.uptime()
      });
    });

    // Búsqueda de productos
    this.app.get('/api/scraping/search', async (req, res) => {
      try {
        const { query, sources, maxResults = 10, category } = req.query;
        
        if (!query) {
          return res.status(400).json({
            error: 'El parámetro query es requerido'
          });
        }

        const results = await this.searchProducts(query, {
          sources: sources ? sources.split(',') : null,
          maxResults: parseInt(maxResults),
          category
        });

        res.json({
          query,
          results,
          totalResults: results.length,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error in search endpoint:', error);
        res.status(500).json({
          error: 'Error interno del servidor',
          message: error.message
        });
      }
    });

    // Comparación de precios para un producto específico
    this.app.get('/api/scraping/compare', async (req, res) => {
      try {
        const { productName, sources } = req.query;
        
        if (!productName) {
          return res.status(400).json({
            error: 'El parámetro productName es requerido'
          });
        }

        const comparison = await this.compareProductPrices(productName, {
          sources: sources ? sources.split(',') : null
        });

        res.json({
          productName,
          comparison,
          bestPrice: this.findBestPrice(comparison),
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error in compare endpoint:', error);
        res.status(500).json({
          error: 'Error interno del servidor',
          message: error.message
        });
      }
    });

    // Obtener información detallada de un producto
    this.app.get('/api/scraping/product', async (req, res) => {
      try {
        const { url, source } = req.query;
        
        if (!url || !source) {
          return res.status(400).json({
            error: 'Los parámetros url y source son requeridos'
          });
        }

        const scraper = this.scrapers.get(source.toLowerCase());
        if (!scraper) {
          return res.status(400).json({
            error: `Source '${source}' no soportado`
          });
        }

        const product = await scraper.scrapeProduct(url);
        
        if (!product) {
          return res.status(404).json({
            error: 'Producto no encontrado o error al extraer información'
          });
        }

        res.json({
          product,
          source,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error in product endpoint:', error);
        res.status(500).json({
          error: 'Error interno del servidor',
          message: error.message
        });
      }
    });

    // Trigger manual de scraping
    this.app.post('/api/scraping/trigger', async (req, res) => {
      try {
        const { source, action, params } = req.body;
        
        if (!source || !action) {
          return res.status(400).json({
            error: 'Los parámetros source y action son requeridos'
          });
        }

        const scraper = this.scrapers.get(source.toLowerCase());
        if (!scraper) {
          return res.status(400).json({
            error: `Source '${source}' no soportado`
          });
        }

        let result;
        switch (action) {
          case 'search':
            result = await scraper.searchProducts(params.query, params.maxResults);
            break;
          case 'scrape':
            result = await scraper.scrapeProduct(params.url);
            break;
          default:
            return res.status(400).json({
              error: `Acción '${action}' no soportada`
            });
        }

        res.json({
          source,
          action,
          result,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error in trigger endpoint:', error);
        res.status(500).json({
          error: 'Error interno del servidor',
          message: error.message
        });
      }
    });

    // Obtener estadísticas de los scrapers
    this.app.get('/api/scraping/stats', (req, res) => {
      const stats = {};
      
      for (const [name, scraper] of this.scrapers.entries()) {
        stats[name] = scraper.getStats();
      }

      res.json({
        scrapers: stats,
        cacheStats: this.cache.getStats(),
        timestamp: new Date().toISOString()
      });
    });

    // Limpiar cache
    this.app.delete('/api/scraping/cache', (req, res) => {
      const cleared = this.cache.clear();
      res.json({
        message: 'Cache limpiado',
        itemsCleared: cleared,
        timestamp: new Date().toISOString()
      });
    });

    // Ruta 404 para endpoints no encontrados
    this.app.use('/api/scraping/*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint no encontrado',
        availableEndpoints: [
          'GET /api/scraping/search',
          'GET /api/scraping/compare',
          'GET /api/scraping/product',
          'POST /api/scraping/trigger',
          'GET /api/scraping/stats',
          'DELETE /api/scraping/cache'
        ]
      });
    });
  }

  /**
   * Inicializar scrapers disponibles
   */
  async initializeScrapers() {
    try {
      // Amazon Scraper
      const amazonScraper = new AmazonScraper();
      await amazonScraper.initialize();
      this.scrapers.set('amazon', amazonScraper);

      // MercadoLibre Scrapers para diferentes países
      const countries = ['MX', 'AR', 'CO'];
      for (const country of countries) {
        const mlScraper = new MercadoLibreScraper(country);
        await mlScraper.initialize();
        this.scrapers.set(`mercadolibre_${country.toLowerCase()}`, mlScraper);
      }

      console.log(`Inicializados ${this.scrapers.size} scrapers:`, Array.from(this.scrapers.keys()));

    } catch (error) {
      console.error('Error inicializando scrapers:', error);
    }
  }

  /**
   * Buscar productos en múltiples fuentes
   */
  async searchProducts(query, options = {}) {
    const { sources, maxResults = 10, category } = options;
    const results = [];
    const errors = [];

    // Verificar cache primero
    const cacheKey = `search_${query}_${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log(`Returning cached results for: ${query}`);
      return cached;
    }

    // Determinar qué scrapers usar
    const scrapersToUse = sources 
      ? sources.filter(source => this.scrapers.has(source.toLowerCase()))
      : Array.from(this.scrapers.keys());

    // Buscar en paralelo en todas las fuentes
    const searchPromises = scrapersToUse.map(async (sourceName) => {
      try {
        const scraper = this.scrapers.get(sourceName.toLowerCase());
        const products = await scraper.searchProducts(query, maxResults);
        
        return products.map(product => ({
          ...product,
          source: sourceName,
          searchQuery: query,
          category: category || this.detectCategory(product.title || product.name)
        }));

      } catch (error) {
        console.error(`Error searching in ${sourceName}:`, error);
        errors.push({ source: sourceName, error: error.message });
        return [];
      }
    });

    // Esperar todos los resultados
    const allResults = await Promise.allSettled(searchPromises);
    
    // Combinar resultados exitosos
    allResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      } else {
        errors.push({ 
          source: scrapersToUse[index], 
          error: result.reason.message 
        });
      }
    });

    // Ordenar por relevancia y precio
    const sortedResults = this.sortResults(results, query);
    
    // Limitar resultados
    const limitedResults = sortedResults.slice(0, maxResults);

    // Cachear resultados por 1 hora
    this.cache.set(cacheKey, limitedResults, 3600);

    if (errors.length > 0) {
      console.warn('Search errors:', errors);
    }

    return limitedResults;
  }

  /**
   * Comparar precios de un producto en múltiples fuentes
   */
  async compareProductPrices(productName, options = {}) {
    const { sources } = options;
    const comparison = {};
    
    // Buscar el producto en todas las fuentes
    const searchResults = await this.searchProducts(productName, {
      sources,
      maxResults: 5
    });

    // Agrupar por fuente
    for (const product of searchResults) {
      const source = product.source;
      
      if (!comparison[source]) {
        comparison[source] = [];
      }
      
      comparison[source].push({
        title: product.title || product.name,
        price: product.price,
        url: product.url,
        rating: product.rating,
        availability: product.availability,
        scrapedAt: product.scrapedAt
      });
    }

    return comparison;
  }

  /**
   * Encontrar el mejor precio
   */
  findBestPrice(comparison) {
    let bestPrice = null;
    let bestProduct = null;

    for (const [source, products] of Object.entries(comparison)) {
      for (const product of products) {
        if (product.price && product.price.value) {
          if (!bestPrice || product.price.value < bestPrice) {
            bestPrice = product.price.value;
            bestProduct = {
              ...product,
              source
            };
          }
        }
      }
    }

    return bestProduct;
  }

  /**
   * Detectar categoría del producto basado en el título
   */
  detectCategory(title) {
    if (!title) return 'unknown';
    
    const titleLower = title.toLowerCase();
    
    const categories = {
      'processor': ['processor', 'cpu', 'procesador', 'intel', 'amd', 'ryzen', 'core i'],
      'graphics': ['graphics card', 'gpu', 'tarjeta grafica', 'nvidia', 'geforce', 'radeon'],
      'motherboard': ['motherboard', 'placa madre', 'tarjeta madre'],
      'memory': ['memory', 'ram', 'memoria', 'ddr4', 'ddr5'],
      'storage': ['ssd', 'hdd', 'hard drive', 'disco duro', 'nvme'],
      'case': ['case', 'gabinete', 'torre', 'caja'],
      'power': ['power supply', 'psu', 'fuente', 'alimentacion'],
      'cooling': ['cooler', 'cooling', 'ventilador', 'refrigeracion']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        return category;
      }
    }

    return 'component';
  }

  /**
   * Ordenar resultados por relevancia y precio
   */
  sortResults(results, query) {
    const queryWords = query.toLowerCase().split(' ');
    
    return results.sort((a, b) => {
      const titleA = (a.title || a.name || '').toLowerCase();
      const titleB = (b.title || b.name || '').toLowerCase();
      
      // Calcular relevancia basada en coincidencias de palabras
      const relevanceA = queryWords.filter(word => titleA.includes(word)).length;
      const relevanceB = queryWords.filter(word => titleB.includes(word)).length;
      
      // Priorizar por relevancia
      if (relevanceA !== relevanceB) {
        return relevanceB - relevanceA;
      }
      
      // Si tienen la misma relevancia, ordenar por precio (menor primero)
      const priceA = (a.price && a.price.value) ? a.price.value : Infinity;
      const priceB = (b.price && b.price.value) ? b.price.value : Infinity;
      
      return priceA - priceB;
    });
  }

  /**
   * Iniciar el servidor
   */
  async start() {
    try {
      await this.initializeScrapers();
      
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Scraping API iniciada en puerto ${this.port}`);
        console.log(`📊 Endpoints disponibles:`);
        console.log(`   GET  http://localhost:${this.port}/api/health`);
        console.log(`   GET  http://localhost:${this.port}/api/scraping/search?query=RTX%204070`);
        console.log(`   GET  http://localhost:${this.port}/api/scraping/compare?productName=RTX%204070`);
        console.log(`   GET  http://localhost:${this.port}/api/scraping/stats`);
      });

      // Manejo de cierre graceful
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());

    } catch (error) {
      console.error('Error starting API:', error);
      process.exit(1);
    }
  }

  /**
   * Cerrar servidor y recursos
   */
  async shutdown() {
    console.log('Cerrando servidor...');
    
    if (this.server) {
      this.server.close();
    }
    
    // Cerrar scrapers
    for (const scraper of this.scrapers.values()) {
      if (scraper.close) {
        await scraper.close();
      }
    }
    
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  }
}

module.exports = ScrapingAPI;
