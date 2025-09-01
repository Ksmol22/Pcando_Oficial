const BaseScraper = require('./base-scraper');
const cheerio = require('cheerio');

/**
 * Scraper específico para MercadoLibre
 * Extrae información de productos de tecnología de MercadoLibre
 */
class MercadoLibreScraper extends BaseScraper {
  constructor(country = 'MX') {
    const domains = {
      'MX': 'mercadolibre.com.mx',
      'AR': 'mercadolibre.com.ar',
      'CO': 'mercadolibre.com.co',
      'CL': 'mercadolibre.cl',
      'PE': 'mercadolibre.com.pe'
    };

    super({
      name: `MercadoLibre ${country}`,
      baseUrl: `https://${domains[country] || domains.MX}`,
      delay: 1500,
      selectors: {
        title: '.x-item-title-label, .ui-pdp-title',
        price: '.andes-money-amount__fraction, .price-tag-fraction',
        originalPrice: '.andes-money-amount--previous .andes-money-amount__fraction',
        currency: '.andes-money-amount__currency-symbol',
        rating: '.ui-review-rating .ui-review-rating__rating',
        reviewCount: '.ui-review-rating__count',
        condition: '.ui-pdp-subtitle',
        shipping: '.ui-pdp-color--GREEN, .shipping-info',
        seller: '.ui-pdp-seller__header__title',
        images: '.ui-pdp-gallery__figure img, .carousel-item img',
        attributes: '.ui-pdp-specs__table tr',
        description: '.ui-pdp-description__content'
      },
      usePuppeteer: false, // MercadoLibre funciona bien con requests HTTP
      country: country
    });
  }

  /**
   * Construir URL de búsqueda para MercadoLibre
   */
  buildSearchUrl(searchTerm, category = null) {
    const encodedTerm = encodeURIComponent(searchTerm);
    let url = `${this.config.baseUrl}/listado/${encodedTerm}`;
    
    // Agregar categoría si se especifica
    if (category) {
      url += `_CatID_${category}`;
    }
    
    // Agregar filtros para productos de tecnología
    url += '_NoIndex_True';
    
    return url;
  }

  /**
   * Construir URL de búsqueda específica para categorías de PC
   */
  buildPCSearchUrl(searchTerm) {
    const categories = {
      'processor': 'MLM1693', // Procesadores
      'graphics': 'MLM1694', // Tarjetas gráficas
      'motherboard': 'MLM1692', // Motherboards
      'memory': 'MLM1695', // Memoria RAM
      'storage': 'MLM1696', // Almacenamiento
      'case': 'MLM1697', // Gabinetes
      'power': 'MLM1698' // Fuentes de poder
    };

    const encodedTerm = encodeURIComponent(searchTerm);
    
    // Intentar detectar categoría por palabra clave
    let categoryId = null;
    for (const [key, id] of Object.entries(categories)) {
      if (searchTerm.toLowerCase().includes(key)) {
        categoryId = id;
        break;
      }
    }

    if (categoryId) {
      return `${this.config.baseUrl}/listado/${encodedTerm}_CatID_${categoryId}`;
    }

    // Si no se detecta categoría específica, buscar en computación
    return `${this.config.baseUrl}/listado/${encodedTerm}_CatID_MLM1648`; // Computación
  }

  /**
   * Extraer enlaces de productos de la página de búsqueda
   */
  extractProductLinks(html) {
    const $ = cheerio.load(html);
    const links = [];

    // Selectores para enlaces de productos
    const linkSelectors = [
      '.ui-search-item__group__element .ui-search-link',
      '.ui-search-item .ui-search-item__title a',
      '.ui-search-result__wrapper a'
    ];

    linkSelectors.forEach(selector => {
      $(selector).each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('/p/')) {
          // Limpiar parámetros de tracking
          const cleanUrl = href.split('?')[0];
          const fullUrl = cleanUrl.startsWith('http') ? cleanUrl : `${this.config.baseUrl}${cleanUrl}`;
          
          if (!links.includes(fullUrl)) {
            links.push(fullUrl);
          }
        }
      });
    });

    return links.slice(0, 25); // Limitar a 25 productos
  }

  /**
   * Scraping específico para productos de MercadoLibre
   */
  async scrapeProduct(productUrl) {
    try {
      const content = await this.fetchContent(productUrl);
      const $ = cheerio.load(content);
      
      const productData = {
        title: this.extractTitle($),
        price: this.extractPrice($),
        originalPrice: this.extractOriginalPrice($),
        discount: null, // Calculado después
        condition: this.extractCondition($),
        rating: this.extractRating($),
        reviewCount: this.extractReviewCount($),
        shipping: this.extractShipping($),
        seller: this.extractSeller($),
        attributes: this.extractAttributes($),
        images: this.extractImages($),
        description: this.extractDescription($),
        url: productUrl,
        source: this.config.name,
        country: this.config.country,
        scrapedAt: new Date().toISOString()
      };

      // Calcular descuento si hay precio original
      if (productData.price && productData.originalPrice) {
        const discount = ((productData.originalPrice.value - productData.price.value) / productData.originalPrice.value * 100);
        productData.discount = Math.round(discount);
      }

      return this.cleanProductData(productData);
    } catch (error) {
      console.error(`Error scraping MercadoLibre product ${productUrl}:`, error);
      return null;
    }
  }

  /**
   * Extraer título del producto
   */
  extractTitle($) {
    const titleSelectors = ['.ui-pdp-title', '.x-item-title-label'];
    
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title) return title;
    }
    
    return null;
  }

  /**
   * Extraer precio actual
   */
  extractPrice($) {
    const priceSelectors = [
      '.andes-money-amount__fraction',
      '.price-tag-fraction'
    ];

    const currencySelectors = [
      '.andes-money-amount__currency-symbol',
      '.price-tag-symbol'
    ];

    for (const selector of priceSelectors) {
      const priceElement = $(selector).first();
      if (priceElement.length > 0) {
        const priceText = priceElement.text().trim();
        const numericPrice = this.extractPriceValue(priceText);
        
        if (numericPrice > 0) {
          // Obtener moneda
          let currency = 'MXN'; // Default para México
          for (const currSelector of currencySelectors) {
            const currElement = $(currSelector).first().text().trim();
            if (currElement) {
              currency = this.normalizeCurrency(currElement);
              break;
            }
          }

          return {
            text: priceText,
            value: numericPrice,
            currency: currency
          };
        }
      }
    }

    return null;
  }

  /**
   * Extraer precio original (antes del descuento)
   */
  extractOriginalPrice($) {
    const originalPriceElement = $('.andes-money-amount--previous .andes-money-amount__fraction').first();
    
    if (originalPriceElement.length > 0) {
      const priceText = originalPriceElement.text().trim();
      const numericPrice = this.extractPriceValue(priceText);
      
      if (numericPrice > 0) {
        return {
          text: priceText,
          value: numericPrice
        };
      }
    }
    
    return null;
  }

  /**
   * Extraer valor numérico del precio
   */
  extractPriceValue(priceText) {
    if (!priceText) return 0;
    
    // Remover puntos de miles y convertir comas decimales
    const cleanPrice = priceText.replace(/\./g, '').replace(',', '.');
    const match = cleanPrice.match(/[\d,]+\.?\d*/);
    
    if (match) {
      return parseFloat(match[0]);
    }
    
    return 0;
  }

  /**
   * Normalizar código de moneda
   */
  normalizeCurrency(currencySymbol) {
    const currencyMap = {
      '$': 'MXN', // México
      'ARS$': 'ARS', // Argentina
      'COL$': 'COP', // Colombia
      'CLP$': 'CLP', // Chile
      'S/': 'PEN' // Perú
    };

    return currencyMap[currencySymbol] || 'MXN';
  }

  /**
   * Extraer condición del producto
   */
  extractCondition($) {
    const conditionElement = $('.ui-pdp-subtitle').first();
    if (conditionElement.length > 0) {
      const conditionText = conditionElement.text().trim().toLowerCase();
      
      if (conditionText.includes('nuevo')) return 'New';
      if (conditionText.includes('usado')) return 'Used';
      if (conditionText.includes('reacondicionado')) return 'Refurbished';
    }
    
    return 'Unknown';
  }

  /**
   * Extraer rating del producto
   */
  extractRating($) {
    const ratingElement = $('.ui-review-rating__rating').first();
    if (ratingElement.length > 0) {
      const ratingText = ratingElement.text().trim();
      const numericRating = parseFloat(ratingText);
      return !isNaN(numericRating) ? numericRating : null;
    }
    
    return null;
  }

  /**
   * Extraer número de reviews
   */
  extractReviewCount($) {
    const reviewElement = $('.ui-review-rating__count').first();
    if (reviewElement.length > 0) {
      const reviewText = reviewElement.text().trim();
      const match = reviewText.match(/\((\d+)\)/);
      return match ? parseInt(match[1]) : null;
    }
    
    return null;
  }

  /**
   * Extraer información de envío
   */
  extractShipping($) {
    const shippingSelectors = [
      '.ui-pdp-color--GREEN',
      '.shipping-info',
      '.ui-pdp-shipping'
    ];

    for (const selector of shippingSelectors) {
      const shippingElement = $(selector).first();
      if (shippingElement.length > 0) {
        const shippingText = shippingElement.text().trim();
        
        return {
          text: shippingText,
          isFree: shippingText.toLowerCase().includes('gratis') || shippingText.toLowerCase().includes('free'),
          isFast: shippingText.toLowerCase().includes('full') || shippingText.toLowerCase().includes('rápido')
        };
      }
    }
    
    return null;
  }

  /**
   * Extraer información del vendedor
   */
  extractSeller($) {
    const sellerElement = $('.ui-pdp-seller__header__title').first();
    if (sellerElement.length > 0) {
      return sellerElement.text().trim();
    }
    
    return null;
  }

  /**
   * Extraer atributos/especificaciones
   */
  extractAttributes($) {
    const attributes = {};
    
    $('.ui-pdp-specs__table tr').each((i, row) => {
      const $row = $(row);
      const key = $row.find('th').text().trim();
      const value = $row.find('td').text().trim();
      
      if (key && value) {
        attributes[this.normalizeAttributeKey(key)] = value;
      }
    });

    return Object.keys(attributes).length > 0 ? attributes : null;
  }

  /**
   * Normalizar claves de atributos
   */
  normalizeAttributeKey(key) {
    return key
      .replace(/[:\s]+$/, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
  }

  /**
   * Extraer imágenes del producto
   */
  extractImages($) {
    const images = [];
    
    $('.ui-pdp-gallery__figure img, .carousel-item img').each((i, img) => {
      const src = $(img).attr('src') || $(img).attr('data-src');
      if (src && !images.includes(src)) {
        // Obtener imagen en mejor calidad
        const highResImg = src.replace(/\-I\.jpg$/, '-O.jpg').replace(/\-S\.jpg$/, '-O.jpg');
        images.push(highResImg);
      }
    });
    
    return images.length > 0 ? images : null;
  }

  /**
   * Extraer descripción del producto
   */
  extractDescription($) {
    const descriptionElement = $('.ui-pdp-description__content').first();
    if (descriptionElement.length > 0) {
      return descriptionElement.text().trim();
    }
    
    return null;
  }

  /**
   * Limpiar datos del producto
   */
  cleanProductData(productData) {
    // Remover campos nulos o vacíos
    Object.keys(productData).forEach(key => {
      if (productData[key] === null || productData[key] === undefined || productData[key] === '') {
        delete productData[key];
      }
    });
    
    return productData;
  }

  /**
   * Búsqueda específica por categoría de PC
   */
  async searchPCComponents(category, searchTerm, maxResults = 15) {
    const searchUrl = this.buildPCSearchUrl(`${category} ${searchTerm}`);
    
    try {
      const content = await this.fetchContent(searchUrl);
      const productLinks = this.extractProductLinks(content);
      
      const products = [];
      const limitedLinks = productLinks.slice(0, maxResults);
      
      for (const link of limitedLinks) {
        const productData = await this.scrapeProduct(link);
        if (productData && this.isRelevantPCProduct(productData, category)) {
          productData.category = category;
          products.push(productData);
        }
        
        // Delay entre productos
        await new Promise(resolve => setTimeout(resolve, this.config.delay));
      }
      
      return products;
    } catch (error) {
      console.error(`Error searching PC components for "${category} ${searchTerm}":`, error);
      return [];
    }
  }

  /**
   * Validar si es un producto relevante para PC
   */
  isRelevantPCProduct(productData, category = null) {
    if (!productData.title) return false;
    
    const title = productData.title.toLowerCase();
    const pcKeywords = [
      'procesador', 'cpu', 'tarjeta grafica', 'gpu', 'placa madre', 'motherboard',
      'memoria ram', 'disco duro', 'ssd', 'fuente poder', 'gabinete', 'cooler',
      'intel', 'amd', 'nvidia', 'corsair', 'asus', 'msi', 'gigabyte',
      'gaming', 'pc gamer', 'computadora'
    ];
    
    if (category) {
      const categoryKeywords = {
        'processor': ['procesador', 'cpu', 'intel', 'amd', 'ryzen', 'core'],
        'graphics': ['tarjeta grafica', 'gpu', 'nvidia', 'geforce', 'radeon'],
        'motherboard': ['placa madre', 'motherboard', 'tarjeta madre'],
        'memory': ['memoria ram', 'ddr4', 'ddr5', 'corsair', 'kingston'],
        'storage': ['disco duro', 'ssd', 'nvme', 'hdd'],
        'case': ['gabinete', 'case', 'caja'],
        'power': ['fuente poder', 'psu', 'power supply']
      };
      
      const relevantKeywords = categoryKeywords[category] || pcKeywords;
      return relevantKeywords.some(keyword => title.includes(keyword));
    }
    
    return pcKeywords.some(keyword => title.includes(keyword));
  }
}

module.exports = MercadoLibreScraper;
