const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

/**
 * Clase base para todos los scrapers
 * Proporciona funcionalidades comunes como manejo de proxies, rate limiting, etc.
 */
class BaseScraper {
  constructor(config) {
    this.config = {
      baseUrl: '',
      selectors: {},
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      delay: 1000, // Delay entre requests en ms
      timeout: 30000,
      retries: 3,
      useProxy: false,
      usePuppeteer: false, // True para sitios con JS, false para HTML estático
      ...config
    };
    
    this.browser = null;
    this.lastRequest = 0;
    this.requestCount = 0;
    this.errors = [];
  }

  /**
   * Inicializar el browser si es necesario
   */
  async initialize() {
    if (this.config.usePuppeteer) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--disable-features=site-per-process'
        ]
      });
    }
  }

  /**
   * Cerrar recursos
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Aplicar rate limiting
   */
  async applyRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.config.delay) {
      const waitTime = this.config.delay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequest = Date.now();
    this.requestCount++;
  }

  /**
   * Hacer request HTTP con axios
   */
  async makeHttpRequest(url) {
    await this.applyRateLimit();
    
    const config = {
      url,
      headers: {
        'User-Agent': this.config.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: this.config.timeout
    };

    if (this.config.useProxy && this.config.proxy) {
      config.proxy = this.config.proxy;
    }

    const response = await axios(config);
    return response.data;
  }

  /**
   * Hacer scraping con Puppeteer
   */
  async makePuppeteerRequest(url) {
    await this.applyRateLimit();
    
    const page = await this.browser.newPage();
    
    await page.setUserAgent(this.config.userAgent);
    await page.setViewport({ width: 1366, height: 768 });
    
    // Bloquear recursos innecesarios para acelerar
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: this.config.timeout 
    });
    
    const content = await page.content();
    await page.close();
    
    return content;
  }

  /**
   * Obtener contenido de una URL
   */
  async fetchContent(url) {
    try {
      if (this.config.usePuppeteer) {
        return await this.makePuppeteerRequest(url);
      } else {
        return await this.makeHttpRequest(url);
      }
    } catch (error) {
      this.errors.push({
        url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Parsear contenido HTML
   */
  parseContent(html, selectors) {
    const $ = cheerio.load(html);
    const result = {};

    for (const [key, selector] of Object.entries(selectors)) {
      try {
        const element = $(selector);
        
        if (element.length > 0) {
          // Si el selector devuelve múltiples elementos, tomar el primero
          const value = element.first().text().trim();
          result[key] = this.cleanText(value);
        } else {
          result[key] = null;
        }
      } catch (error) {
        console.warn(`Error parsing selector ${key}: ${selector}`, error);
        result[key] = null;
      }
    }

    return result;
  }

  /**
   * Limpiar texto extraído
   */
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\t/g, ' ')
      .trim();
  }

  /**
   * Extraer precio de texto
   */
  extractPrice(priceText) {
    if (!priceText) return null;
    
    // Buscar patrones de precio comunes
    const patterns = [
      /\$[\d,]+\.?\d*/,           // $1,999.99
      /€[\d,]+\.?\d*/,            // €1,999.99
      /[\d,]+\.?\d*\s*€/,         // 1,999.99 €
      /[\d,]+\.?\d*\s*USD/,       // 1999.99 USD
      /[\d,]+\.?\d*/              // 1999.99
    ];

    for (const pattern of patterns) {
      const match = priceText.match(pattern);
      if (match) {
        // Extraer solo números y puntos decimales
        const numericValue = match[0].replace(/[^\d.]/g, '');
        return parseFloat(numericValue);
      }
    }

    return null;
  }

  /**
   * Obtener información de un producto específico
   */
  async scrapeProduct(productUrl) {
    try {
      const content = await this.fetchContent(productUrl);
      const productData = this.parseContent(content, this.config.selectors);
      
      // Procesar precio si existe
      if (productData.price) {
        productData.priceNumeric = this.extractPrice(productData.price);
      }

      // Agregar metadatos
      productData.scrapedAt = new Date().toISOString();
      productData.sourceUrl = productUrl;
      productData.sourceName = this.config.name || 'Unknown';

      return productData;
    } catch (error) {
      console.error(`Error scraping product ${productUrl}:`, error);
      return null;
    }
  }

  /**
   * Buscar productos por término
   */
  async searchProducts(searchTerm, maxResults = 10) {
    const searchUrl = this.buildSearchUrl(searchTerm);
    
    try {
      const content = await this.fetchContent(searchUrl);
      const productLinks = this.extractProductLinks(content);
      
      const products = [];
      const limitedLinks = productLinks.slice(0, maxResults);
      
      for (const link of limitedLinks) {
        const productData = await this.scrapeProduct(link);
        if (productData) {
          products.push(productData);
        }
        
        // Delay entre productos para evitar ser bloqueado
        await new Promise(resolve => setTimeout(resolve, this.config.delay));
      }
      
      return products;
    } catch (error) {
      console.error(`Error searching products for "${searchTerm}":`, error);
      return [];
    }
  }

  /**
   * Construir URL de búsqueda - debe ser implementado por cada scraper
   */
  buildSearchUrl(searchTerm) {
    throw new Error('buildSearchUrl must be implemented by subclass');
  }

  /**
   * Extraer enlaces de productos de la página de búsqueda - debe ser implementado por cada scraper
   */
  extractProductLinks(html) {
    throw new Error('extractProductLinks must be implemented by subclass');
  }

  /**
   * Obtener estadísticas del scraper
   */
  getStats() {
    return {
      requestCount: this.requestCount,
      errorCount: this.errors.length,
      successRate: this.requestCount > 0 ? ((this.requestCount - this.errors.length) / this.requestCount * 100).toFixed(2) + '%' : '0%',
      lastRequest: new Date(this.lastRequest).toISOString(),
      errors: this.errors.slice(-10) // Últimos 10 errores
    };
  }
}

module.exports = BaseScraper;
