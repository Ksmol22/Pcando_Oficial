import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  title: string;
  price: {
    value: number;
    currency: string;
    text: string;
  };
  url: string;
  source: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
  images?: string[];
  category?: string;
  scrapedAt: string;
}

interface SearchFilters {
  sources: string[];
  category?: string;
  maxResults: number;
  priceRange: {
    min?: number;
    max?: number;
  };
}

interface ProductSearchProps {
  onResults?: (products: Product[]) => void;
  realTimeUpdates?: boolean;
  defaultSources?: string[];
  apiBaseUrl?: string;
}

export function ProductSearch({ 
  onResults, 
  realTimeUpdates = false, 
  defaultSources = ['amazon', 'mercadolibre_mx'],
  apiBaseUrl = 'http://localhost:3001'
}: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sources: defaultSources,
    maxResults: 20,
    priceRange: {}
  });

  const availableSources = [
    { id: 'amazon', name: 'Amazon', color: 'bg-orange-500' },
    { id: 'mercadolibre_mx', name: 'MercadoLibre MX', color: 'bg-yellow-500' },
    { id: 'mercadolibre_ar', name: 'MercadoLibre AR', color: 'bg-blue-500' },
    { id: 'mercadolibre_co', name: 'MercadoLibre CO', color: 'bg-green-500' }
  ];

  const categories = [
    { id: 'processor', name: 'Procesadores' },
    { id: 'graphics', name: 'Tarjetas Gráficas' },
    { id: 'motherboard', name: 'Motherboards' },
    { id: 'memory', name: 'Memoria RAM' },
    { id: 'storage', name: 'Almacenamiento' },
    { id: 'case', name: 'Gabinetes' },
    { id: 'power', name: 'Fuentes de Poder' }
  ];

  const searchProducts = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        sources: searchFilters.sources.join(','),
        maxResults: searchFilters.maxResults.toString()
      });

      if (searchFilters.category) {
        params.append('category', searchFilters.category);
      }

      const response = await fetch(`${apiBaseUrl}/api/scraping/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      let filteredProducts = data.results || [];

      // Aplicar filtro de precio si está definido
      if (searchFilters.priceRange.min || searchFilters.priceRange.max) {
        filteredProducts = filteredProducts.filter((product: Product) => {
          if (!product.price?.value) return true;
          
          const price = product.price.value;
          if (searchFilters.priceRange.min && price < searchFilters.priceRange.min) return false;
          if (searchFilters.priceRange.max && price > searchFilters.priceRange.max) return false;
          
          return true;
        });
      }

      setProducts(filteredProducts);
      
      if (onResults) {
        onResults(filteredProducts);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al buscar productos: ${errorMessage}`);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, onResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(query, filters);
  };

  const formatPrice = (price: Product['price']) => {
    if (!price) return 'Precio no disponible';
    
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: price.currency || 'MXN'
    });
    
    return formatter.format(price.value);
  };

  const getSourceColor = (source: string) => {
    const sourceConfig = availableSources.find(s => s.id === source);
    return sourceConfig?.color || 'bg-gray-500';
  };

  const toggleSource = (sourceId: string) => {
    setFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(sourceId)
        ? prev.sources.filter(s => s !== sourceId)
        : [...prev.sources, sourceId]
    }));
  };

  // Auto-búsqueda en tiempo real (opcional)
  useEffect(() => {
    if (realTimeUpdates && query.length > 2) {
      const timeoutId = setTimeout(() => {
        searchProducts(query, filters);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [query, filters, realTimeUpdates, searchProducts]);

  return (
    <div className="space-y-6">
      {/* Formulario de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda de Productos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar componentes de PC..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Buscar
            </Button>
          </form>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fuentes */}
            <div>
              <label className="block text-sm font-medium mb-2">Fuentes</label>
              <div className="flex flex-wrap gap-2">
                {availableSources.map(source => (
                  <Badge
                    key={source.id}
                    variant={filters.sources.includes(source.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSource(source.id)}
                  >
                    {source.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  category: e.target.value || undefined
                }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de precio */}
            <div>
              <label className="block text-sm font-medium mb-2">Rango de Precio</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filters.priceRange.min || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: {
                      ...prev.priceRange,
                      min: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  }))}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filters.priceRange.max || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: {
                      ...prev.priceRange,
                      max: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  }))}
                />
              </div>
            </div>

            {/* Límite de resultados */}
            <div>
              <label className="block text-sm font-medium mb-2">Máximo de resultados</label>
              <select
                value={filters.maxResults}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  maxResults: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value={10}>10 productos</option>
                <option value={20}>20 productos</option>
                <option value={50}>50 productos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Resultados */}
      <div className="space-y-4">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {products.length} productos encontrados
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                        loading="lazy"
                      />
                    )}
                    
                    <div className="space-y-2">
                      <h4 className="font-medium line-clamp-2 text-sm">
                        {product.title}
                      </h4>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <Badge className={`${getSourceColor(product.source)} text-white`}>
                          {availableSources.find(s => s.id === product.source)?.name || product.source}
                        </Badge>
                      </div>

                      {product.rating && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>⭐ {product.rating.toFixed(1)}</span>
                          {product.reviewCount && (
                            <span>({product.reviewCount} reviews)</span>
                          )}
                        </div>
                      )}

                      {product.availability && (
                        <Badge variant={product.availability === 'In Stock' ? 'default' : 'secondary'}>
                          {product.availability}
                        </Badge>
                      )}

                      <Button
                        className="w-full mt-2"
                        onClick={() => window.open(product.url, '_blank')}
                      >
                        Ver Producto
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {!loading && products.length === 0 && query && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No se encontraron productos para "{query}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSearch;
