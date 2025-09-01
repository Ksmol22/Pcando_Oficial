const BaseScraper = require('./base-scraper');
const cheerio = require('cheerio');

/**
 * Scraper específico para Amazon
 * Extrae información de productos de tecnología de Amazon
 */
class AmazonScraper extends BaseScraper {
  constructor() {
    super({
      name: 'Amazon',
      baseUrl: 'https://www.amazon.com',
      delay: 2000, // Amazon es estricto con rate limiting
      selectors: {
        title: '#productTitle',
        price: '.a-price-whole, .a-offscreen',
        rating: '.a-icon-alt',
        reviewCount: '#acrCustomerReviewText',
        availability: '#availability span',
        brand: 'tr:contains("Brand") td:last-child, #brand',
        model: 'tr:contains("Model") td:last-child',
        description: '#feature-bullets li, .a-unordered-list .a-list-item',
        images: '#landingImage, .a-dynamic-image',
        specifications: '#productDetails_techSpec_section_1 tr, #productDetails_detailBullets_sections1 tr'
      },
      usePuppeteer: true // Amazon requiere JavaScript
    });
  }

  /**
   * Construir URL de búsqueda para Amazon
   */
  buildSearchUrl(searchTerm) {
    const encodedTerm = encodeURIComponent(searchTerm);
    return `${this.config.baseUrl}/s?k=${encodedTerm}&ref=sr_pg_1`;
  }

  /**
   * Extraer enlaces de productos de la página de búsqueda de Amazon
   */
  extractProductLinks(html) {
    const $ = cheerio.load(html);
    const links = [];

    // Selectores para diferentes tipos de productos en Amazon
    const productSelectors = [
      'h2.a-size-mini a',
      '.s-result-item h3 a',
      '[data-component-type="s-search-result"] h2 a',
      '.s-link-style a'
    ];

    productSelectors.forEach(selector => {
      $(selector).each((i, element) => {
        const href = $(element).attr('href');
        if (href && href.includes('/dp/')) {
          const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
          if (!links.includes(fullUrl)) {
            links.push(fullUrl);
          }
        }
      });
    });

    return links.slice(0, 20); // Limitar a 20 productos por búsqueda
  }

  /**
   * Scraping específico para productos de Amazon
   */
  async scrapeProduct(productUrl) {
    try {
      const content = await this.fetchContent(productUrl);
      const $ = cheerio.load(content);
      
      const productData = {
        title: this.extractTitle($),
        price: this.extractPrice($),
        rating: this.extractRating($),
        reviewCount: this.extractReviewCount($),
        availability: this.extractAvailability($),
        brand: this.extractBrand($),
        specifications: this.extractSpecifications($),
        images: this.extractImages($),
        description: this.extractDescription($),
        url: productUrl,
        source: 'Amazon',
        scrapedAt: new Date().toISOString()
      };

      return this.cleanProductData(productData);
    } catch (error) {
      console.error(`Error scraping Amazon product ${productUrl}:`, error);
      return null;
    }
  }

  /**
   * Extraer título del producto
   */
  extractTitle($) {
    const titleSelectors = ['#productTitle', 'h1.a-size-large'];
    
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim();
      if (title) return title;
    }
    
    return null;
  }

  /**
   * Extraer precio del producto
   */
  extractPrice($) {
    const priceSelectors = [
      '.a-price-current .a-offscreen',
      '.a-price .a-offscreen',
      '#priceblock_dealprice',
      '#priceblock_ourprice',
      '.a-price-range .a-price .a-offscreen'
    ];

    for (const selector of priceSelectors) {
      const priceElement = $(selector).first();
      if (priceElement.length > 0) {
        const priceText = priceElement.text().trim();
        const numericPrice = this.extractPriceValue(priceText);
        if (numericPrice > 0) {
          return {
            text: priceText,
            value: numericPrice,
            currency: this.extractCurrency(priceText)
          };
        }
      }
    }

    return null;
  }

  /**
   * Extraer valor numérico del precio
   */
  extractPriceValue(priceText) {
    if (!priceText) return 0;
    
    const match = priceText.match(/[\d,]+\.?\d*/);
    if (match) {
      return parseFloat(match[0].replace(/,/g, ''));
    }
    
    return 0;
  }

  /**
   * Extraer moneda del precio
   */
  extractCurrency(priceText) {
    if (priceText.includes('$')) return 'USD';
    if (priceText.includes('€')) return 'EUR';
    if (priceText.includes('£')) return 'GBP';
    return 'USD'; // Default
  }

  /**
   * Extraer rating del producto
   */
  extractRating($) {
    const ratingElement = $('.a-icon-alt').first();
    if (ratingElement.length > 0) {
      const ratingText = ratingElement.text();
      const match = ratingText.match(/(\d\.\d)/);
      return match ? parseFloat(match[1]) : null;
    }
    return null;
  }

  /**
   * Extraer número de reviews
   */
  extractReviewCount($) {
    const reviewElement = $('#acrCustomerReviewText');
    if (reviewElement.length > 0) {
      const reviewText = reviewElement.text();
      const match = reviewText.match(/([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, '')) : null;
    }
    return null;
  }

  /**
   * Extraer disponibilidad
   */
  extractAvailability($) {
    const availabilitySelectors = [
      '#availability span',
      '#availability .a-color-success',
      '#availability .a-color-error'
    ];

    for (const selector of availabilitySelectors) {
      const availability = $(selector).first().text().trim();
      if (availability) {
        return this.normalizeAvailability(availability);
      }
    }
    
    return 'Unknown';
  }

  /**
   * Normalizar texto de disponibilidad
   */
  normalizeAvailability(availabilityText) {
    const text = availabilityText.toLowerCase();
    
    if (text.includes('in stock') || text.includes('available')) {
      return 'In Stock';
    } else if (text.includes('out of stock') || text.includes('unavailable')) {
      return 'Out of Stock';
    } else if (text.includes('limited')) {
      return 'Limited Stock';
    }
    
    return availabilityText;
  }

  /**
   * Extraer marca del producto
   */
  extractBrand($) {
    const brandSelectors = [
      'tr:contains("Brand") td:last-child',
      '#brand',
      '.po-brand .po-break-word',
      'a#bylineInfo'
    ];

    for (const selector of brandSelectors) {
      const brand = $(selector).first().text().trim();
      if (brand && brand.toLowerCase() !== 'visit the store') {
        return brand.replace('Visit the ', '').replace(' Store', '');
      }
    }
    
    return null;
  }

  /**
   * Extraer especificaciones técnicas
   */
  extractSpecifications($) {
    const specs = {};
    
    // Tabla de especificaciones técnicas
    $('#productDetails_techSpec_section_1 tr').each((i, row) => {
      const $row = $(row);
      const key = $row.find('td').first().text().trim();
      const value = $row.find('td').last().text().trim();
      
      if (key && value && key !== value) {
        specs[this.normalizeSpecKey(key)] = value;
      }
    });

    // Detalles del producto (formato alternativo)
    $('#productDetails_detailBullets_sections1 tr').each((i, row) => {
      const $row = $(row);
      const key = $row.find('td').first().text().trim();
      const value = $row.find('td').last().text().trim();
      
      if (key && value && key !== value) {
        specs[this.normalizeSpecKey(key)] = value;
      }
    });

    return Object.keys(specs).length > 0 ? specs : null;
  }

  /**
   * Normalizar claves de especificaciones
   */
  normalizeSpecKey(key) {
    return key
      .replace(/[:\s]+$/, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }

  /**
   * Extraer imágenes del producto
   */
  extractImages($) {
    const images = [];
    
    // Imagen principal
    const mainImage = $('#landingImage').attr('src');
    if (mainImage) images.push(mainImage);
    
    // Imágenes adicionales
    $('.a-dynamic-image').each((i, img) => {
      const src = $(img).attr('src');
      if (src && !images.includes(src)) {
        images.push(src);
      }
    });
    
    return images.length > 0 ? images : null;
  }

  /**
   * Extraer descripción del producto
   */
  extractDescription($) {
    const descriptions = [];
    
    $('#feature-bullets li .a-list-item').each((i, item) => {
      const text = $(item).text().trim();
      if (text && !text.includes('Make sure this fits')) {
        descriptions.push(text);
      }
    });
    
    return descriptions.length > 0 ? descriptions : null;
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
   * Validar si es un producto de tecnología/PC
   */
  isRelevantProduct(productData) {
    if (!productData.title) return false;
    
    const title = productData.title.toLowerCase();
    const relevantKeywords = [
      'processor', 'cpu', 'graphics card', 'gpu', 'motherboard', 'memory',
      'ram', 'ssd', 'hard drive', 'power supply', 'cooler', 'case',
      'intel', 'amd', 'nvidia', 'corsair', 'asus', 'msi', 'gigabyte',
      'gaming', 'pc', 'computer', 'desktop'
    ];
    
    return relevantKeywords.some(keyword => title.includes(keyword));
  }
}

module.exports = AmazonScraper;
