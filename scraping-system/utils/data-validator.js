/**
 * Validador de datos extraídos por scrapers
 * Asegura calidad y consistencia de la información
 */
class DataValidator {
  constructor() {
    this.validationRules = {
      product: {
        required: ['title', 'price', 'url', 'source'],
        optional: ['rating', 'reviewCount', 'availability', 'images', 'description']
      },
      price: {
        required: ['value'],
        optional: ['currency', 'text']
      }
    };
  }

  /**
   * Validar datos de un producto
   */
  validateProduct(productData) {
    const errors = [];
    const warnings = [];

    if (!productData || typeof productData !== 'object') {
      errors.push('Product data must be an object');
      return { isValid: false, errors, warnings };
    }

    // Validar campos requeridos
    for (const field of this.validationRules.product.required) {
      if (!productData[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validar título
    if (productData.title) {
      if (typeof productData.title !== 'string') {
        errors.push('Title must be a string');
      } else if (productData.title.length < 3) {
        warnings.push('Title is very short');
      } else if (productData.title.length > 500) {
        warnings.push('Title is very long');
      }
    }

    // Validar precio
    if (productData.price) {
      const priceValidation = this.validatePrice(productData.price);
      if (!priceValidation.isValid) {
        errors.push(...priceValidation.errors.map(e => `Price: ${e}`));
      }
      warnings.push(...priceValidation.warnings.map(w => `Price: ${w}`));
    }

    // Validar URL
    if (productData.url) {
      if (!this.isValidUrl(productData.url)) {
        errors.push('Invalid URL format');
      }
    }

    // Validar rating
    if (productData.rating !== undefined) {
      if (typeof productData.rating !== 'number' || productData.rating < 0 || productData.rating > 5) {
        warnings.push('Rating should be a number between 0 and 5');
      }
    }

    // Validar review count
    if (productData.reviewCount !== undefined) {
      if (typeof productData.reviewCount !== 'number' || productData.reviewCount < 0) {
        warnings.push('Review count should be a positive number');
      }
    }

    // Validar imágenes
    if (productData.images) {
      if (!Array.isArray(productData.images)) {
        warnings.push('Images should be an array');
      } else {
        for (const img of productData.images) {
          if (!this.isValidUrl(img)) {
            warnings.push(`Invalid image URL: ${img}`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validar datos de precio
   */
  validatePrice(priceData) {
    const errors = [];
    const warnings = [];

    if (!priceData || typeof priceData !== 'object') {
      errors.push('Price data must be an object');
      return { isValid: false, errors, warnings };
    }

    // Validar valor numérico
    if (priceData.value === undefined) {
      errors.push('Missing price value');
    } else {
      const value = parseFloat(priceData.value);
      if (isNaN(value)) {
        errors.push('Price value must be a number');
      } else if (value <= 0) {
        errors.push('Price value must be positive');
      } else if (value > 100000) {
        warnings.push('Price value seems very high');
      } else if (value < 1) {
        warnings.push('Price value seems very low');
      }
    }

    // Validar moneda
    if (priceData.currency) {
      if (!this.isValidCurrency(priceData.currency)) {
        warnings.push(`Unknown currency: ${priceData.currency}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validar formato de URL
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Validar código de moneda
   */
  isValidCurrency(currency) {
    const validCurrencies = [
      'USD', 'EUR', 'GBP', 'MXN', 'ARS', 'COP', 'CLP', 'PEN', 'BRL'
    ];
    return validCurrencies.includes(currency.toUpperCase());
  }

  /**
   * Limpiar y normalizar datos de producto
   */
  sanitizeProduct(productData) {
    if (!productData) return null;

    const sanitized = { ...productData };

    // Limpiar título
    if (sanitized.title) {
      sanitized.title = this.cleanText(sanitized.title);
    }

    // Limpiar descripción
    if (sanitized.description) {
      if (Array.isArray(sanitized.description)) {
        sanitized.description = sanitized.description.map(desc => this.cleanText(desc)).join('\n');
      } else {
        sanitized.description = this.cleanText(sanitized.description);
      }
    }

    // Normalizar precio
    if (sanitized.price && typeof sanitized.price === 'object') {
      if (sanitized.price.value) {
        sanitized.price.value = parseFloat(sanitized.price.value);
      }
      if (sanitized.price.currency) {
        sanitized.price.currency = sanitized.price.currency.toUpperCase();
      }
    }

    // Normalizar rating
    if (sanitized.rating !== undefined) {
      sanitized.rating = parseFloat(sanitized.rating);
      if (sanitized.rating > 5) sanitized.rating = 5;
      if (sanitized.rating < 0) sanitized.rating = 0;
    }

    // Normalizar review count
    if (sanitized.reviewCount !== undefined) {
      sanitized.reviewCount = parseInt(sanitized.reviewCount);
      if (sanitized.reviewCount < 0) sanitized.reviewCount = 0;
    }

    // Filtrar imágenes válidas
    if (sanitized.images && Array.isArray(sanitized.images)) {
      sanitized.images = sanitized.images.filter(img => this.isValidUrl(img));
      if (sanitized.images.length === 0) {
        delete sanitized.images;
      }
    }

    return sanitized;
  }

  /**
   * Limpiar texto de espacios y caracteres especiales
   */
  cleanText(text) {
    if (!text || typeof text !== 'string') return text;

    return text
      .replace(/\s+/g, ' ') // Múltiples espacios a uno
      .replace(/\n\s*\n/g, '\n') // Múltiples saltos de línea
      .replace(/[^\w\s\-.,!?()áéíóúñü]/gi, '') // Caracteres especiales
      .trim();
  }

  /**
   * Validar lote de productos
   */
  validateProductBatch(products) {
    if (!Array.isArray(products)) {
      return {
        isValid: false,
        errors: ['Input must be an array'],
        results: []
      };
    }

    const results = products.map((product, index) => {
      const validation = this.validateProduct(product);
      return {
        index,
        ...validation,
        product: validation.isValid ? this.sanitizeProduct(product) : product
      };
    });

    const validProducts = results.filter(r => r.isValid).map(r => r.product);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

    return {
      isValid: totalErrors === 0,
      totalProducts: products.length,
      validProducts: validProducts.length,
      totalErrors,
      totalWarnings,
      results,
      products: validProducts
    };
  }

  /**
   * Detectar productos duplicados
   */
  findDuplicates(products) {
    const duplicates = [];
    const seen = new Map();

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.title || !product.url) continue;

      // Crear clave única basada en título normalizado y dominio
      const normalizedTitle = product.title.toLowerCase().replace(/\s+/g, ' ').trim();
      const domain = this.extractDomain(product.url);
      const key = `${normalizedTitle}_${domain}`;

      if (seen.has(key)) {
        duplicates.push({
          original: seen.get(key),
          duplicate: { index: i, product }
        });
      } else {
        seen.set(key, { index: i, product });
      }
    }

    return duplicates;
  }

  /**
   * Extraer dominio de URL
   */
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Generar reporte de validación
   */
  generateReport(validationResult) {
    const report = {
      summary: {
        totalProducts: validationResult.totalProducts || 0,
        validProducts: validationResult.validProducts || 0,
        invalidProducts: (validationResult.totalProducts || 0) - (validationResult.validProducts || 0),
        totalErrors: validationResult.totalErrors || 0,
        totalWarnings: validationResult.totalWarnings || 0
      },
      details: {
        errorTypes: {},
        warningTypes: {},
        commonIssues: []
      }
    };

    // Analizar tipos de errores y advertencias
    if (validationResult.results) {
      for (const result of validationResult.results) {
        // Contar errores por tipo
        for (const error of result.errors || []) {
          report.details.errorTypes[error] = (report.details.errorTypes[error] || 0) + 1;
        }

        // Contar advertencias por tipo
        for (const warning of result.warnings || []) {
          report.details.warningTypes[warning] = (report.details.warningTypes[warning] || 0) + 1;
        }
      }
    }

    // Identificar problemas comunes (>10% de productos)
    const threshold = Math.max(1, Math.floor(report.summary.totalProducts * 0.1));
    
    Object.entries(report.details.errorTypes).forEach(([error, count]) => {
      if (count >= threshold) {
        report.details.commonIssues.push({ type: 'error', issue: error, count });
      }
    });

    Object.entries(report.details.warningTypes).forEach(([warning, count]) => {
      if (count >= threshold) {
        report.details.commonIssues.push({ type: 'warning', issue: warning, count });
      }
    });

    return report;
  }
}

module.exports = DataValidator;
