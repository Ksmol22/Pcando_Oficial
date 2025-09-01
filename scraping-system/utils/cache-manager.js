/**
 * Gestor de caché para optimizar requests de scraping
 * Evita hacer requests repetidos y mejora la performance
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      totalItems: 0
    };
    
    // Limpieza automática cada 30 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 30 * 60 * 1000);
  }

  /**
   * Obtener item del cache
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Verificar si expiró
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return item.data;
  }

  /**
   * Guardar item en cache
   */
  set(key, data, ttlSeconds = 3600) {
    const item = {
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + (ttlSeconds * 1000)
    };

    this.cache.set(key, item);
    this.stats.totalItems = this.cache.size;
  }

  /**
   * Verificar si existe en cache
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Eliminar item del cache
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    this.stats.totalItems = this.cache.size;
    return deleted;
  }

  /**
   * Limpiar cache completo
   */
  clear() {
    const itemCount = this.cache.size;
    this.cache.clear();
    this.stats.totalItems = 0;
    return itemCount;
  }

  /**
   * Limpiar items expirados
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    this.stats.totalItems = this.cache.size;
    
    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired items`);
    }
  }

  /**
   * Obtener estadísticas del cache
   */
  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests * 100).toFixed(2) : 0;

    return {
      totalItems: this.stats.totalItems,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: `${hitRate}%`,
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * Estimar uso de memoria (aproximado)
   */
  getMemoryUsage() {
    let totalSize = 0;
    
    for (const item of this.cache.values()) {
      totalSize += JSON.stringify(item).length;
    }

    const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
    return `${sizeInMB} MB`;
  }

  /**
   * Limpiar al cerrar
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

module.exports = CacheManager;
