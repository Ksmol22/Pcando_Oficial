import React, { useState, useEffect } from 'react';
import { Search, TrendingDown, ExternalLink, RefreshCw, ShoppingCart, Star, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  source: string;
  url: string;
  image?: string;
  rating?: number;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
}

interface SearchResult {
  query: string;
  products: Product[];
  totalResults: number;
  searchTime: number;
}

/**
 * Página principal del sistema de comparación de precios
 * Integra el sistema de scraping con la interfaz de usuario
 */
export default function Marketplace() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pcando-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Guardar búsquedas recientes
  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('pcando-recent-searches', JSON.stringify(updated));
  };

  // Función para buscar productos
  const searchProducts = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/search/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          sources: ['amazon', 'mercadolibre'],
          options: {
            maxResults: 20,
            sortBy: 'price',
            category: 'electronics'
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setSearchResults({
        query,
        products: data.products || [],
        totalResults: data.totalResults || 0,
        searchTime: data.searchTime || 0
      });

      saveRecentSearch(query);

    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'Error al buscar productos');
      
      // Datos de demo para mostrar la funcionalidad
      setSearchResults({
        query,
        products: [
          {
            id: '1',
            name: `${query} - Producto Demo 1`,
            price: 299.99,
            currency: 'USD',
            source: 'Amazon',
            url: 'https://amazon.com/demo',
            rating: 4.5,
            availability: 'in_stock'
          },
          {
            id: '2',
            name: `${query} - Producto Demo 2`,
            price: 349.99,
            currency: 'USD',
            source: 'MercadoLibre',
            url: 'https://mercadolibre.com/demo',
            rating: 4.2,
            availability: 'in_stock'
          }
        ],
        totalResults: 2,
        searchTime: 1.2
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchQuery);
  };

  const getAvailabilityBadge = (availability: Product['availability']) => {
    const variants = {
      in_stock: { variant: 'default' as const, text: 'En Stock' },
      out_of_stock: { variant: 'destructive' as const, text: 'Agotado' },
      limited: { variant: 'secondary' as const, text: 'Stock Limitado' }
    };
    
    const config = variants[availability];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Marketplace de Componentes</h1>
        <p className="text-muted-foreground text-lg">
          Compara precios de componentes de PC en múltiples tiendas
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">
            <Search className="w-4 h-4 mr-2" />
            Buscar Productos
          </TabsTrigger>
          <TabsTrigger value="compare">
            <TrendingDown className="w-4 h-4 mr-2" />
            Comparar Precios
          </TabsTrigger>
          <TabsTrigger value="trending">
            <Star className="w-4 h-4 mr-2" />
            Tendencias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Buscar Componentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Buscar componentes (ej: RTX 4090, Intel i9, DDR5)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isSearching ? 'Buscando...' : 'Buscar'}
                </Button>
              </form>

              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Búsquedas recientes:</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setSearchQuery(search);
                          searchProducts(search);
                        }}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <Alert className="mb-4">
                  <AlertDescription>
                    {error} - Mostrando datos de demostración
                  </AlertDescription>
                </Alert>
              )}

              {searchResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {searchResults.totalResults} resultados para "{searchResults.query}" 
                      ({searchResults.searchTime}s)
                    </p>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {searchResults.products.map((product) => (
                      <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{product.name}</h3>
                              <div className="flex items-center gap-4 mb-2">
                                <span className="text-2xl font-bold text-primary">
                                  ${product.price} {product.currency}
                                </span>
                                {product.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{product.source}</Badge>
                                {getAvailabilityBadge(product.availability)}
                              </div>
                            </div>
                            <Button asChild size="sm">
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Ver Producto
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Comparador de Precios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidad de comparación en desarrollo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle>Productos Tendencia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tendencias de productos en desarrollo...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
