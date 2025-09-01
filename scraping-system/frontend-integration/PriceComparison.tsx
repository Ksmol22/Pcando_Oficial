import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceData {
  title: string;
  price: {
    value: number;
    currency: string;
    text: string;
  };
  url: string;
  rating?: number;
  availability: string;
  scrapedAt: string;
}

interface ComparisonData {
  [source: string]: PriceData[];
}

interface BestPrice {
  title: string;
  price: {
    value: number;
    currency: string;
    text: string;
  };
  url: string;
  source: string;
  availability: string;
  rating?: number;
  scrapedAt: string;
}

interface PriceComparisonProps {
  productName: string;
  sources?: string[];
  apiBaseUrl?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function PriceComparison({ 
  productName, 
  sources = ['amazon', 'mercadolibre_mx'],
  apiBaseUrl = 'http://localhost:3001',
  autoRefresh = false,
  refreshInterval = 300000 // 5 minutos
}: PriceComparisonProps) {
  const [comparison, setComparison] = useState<ComparisonData>({});
  const [bestPrice, setBestPrice] = useState<BestPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const sourceNames: { [key: string]: string } = {
    'amazon': 'Amazon',
    'mercadolibre_mx': 'MercadoLibre México',
    'mercadolibre_ar': 'MercadoLibre Argentina',
    'mercadolibre_co': 'MercadoLibre Colombia'
  };

  const sourceColors: { [key: string]: string } = {
    'amazon': 'bg-orange-500',
    'mercadolibre_mx': 'bg-yellow-500',
    'mercadolibre_ar': 'bg-blue-500',
    'mercadolibre_co': 'bg-green-500'
  };

  const fetchComparison = async () => {
    if (!productName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        productName,
        sources: sources.join(',')
      });

      const response = await fetch(`${apiBaseUrl}/api/scraping/compare?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setComparison(data.comparison || {});
      setBestPrice(data.bestPrice || null);
      setLastUpdate(new Date());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al comparar precios: ${errorMessage}`);
      console.error('Price comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: PriceData['price']) => {
    if (!price) return 'Precio no disponible';
    
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: price.currency || 'MXN'
    });
    
    return formatter.format(price.value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSavings = (currentPrice: number, bestPriceValue: number) => {
    const savings = currentPrice - bestPriceValue;
    const percentage = (savings / currentPrice) * 100;
    return { amount: savings, percentage };
  };

  const isGoodDeal = (price: number, bestPriceValue: number) => {
    const difference = ((price - bestPriceValue) / bestPriceValue) * 100;
    return difference <= 10; // Dentro del 10% del mejor precio
  };

  // Efecto para auto-refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchComparison, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, productName, sources]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchComparison();
  }, [productName, sources]);

  if (!productName) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Especifica un producto para comparar precios
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del producto */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Comparación de Precios</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Producto: <span className="font-medium">{productName}</span>
              </p>
              {lastUpdate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Última actualización: {formatDate(lastUpdate.toISOString())}
                </p>
              )}
            </div>
            <Button 
              onClick={fetchComparison} 
              disabled={loading}
              size="sm"
              variant="outline"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualizar
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Mejor precio */}
      {bestPrice && !loading && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Mejor Precio Encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg text-green-900">
                  {formatPrice(bestPrice.price)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${sourceColors[bestPrice.source]} text-white`}>
                    {sourceNames[bestPrice.source] || bestPrice.source}
                  </Badge>
                  <Badge variant={bestPrice.availability === 'In Stock' ? 'default' : 'secondary'}>
                    {bestPrice.availability}
                  </Badge>
                  {bestPrice.rating && (
                    <span className="text-sm text-muted-foreground">
                      ⭐ {bestPrice.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Actualizado: {formatDate(bestPrice.scrapedAt)}
                </p>
              </div>
              <Button onClick={() => window.open(bestPrice.url, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Oferta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparación por fuente */}
      <div className="space-y-4">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: sources.length }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && Object.keys(comparison).length === 0 && (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">
                No se encontraron productos para comparar
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && Object.keys(comparison).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(comparison).map(([source, products]) => (
              <Card key={source}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{sourceNames[source] || source}</span>
                    <Badge className={`${sourceColors[source]} text-white`}>
                      {products.length} productos
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product, index) => {
                      const savings = bestPrice ? calculateSavings(product.price.value, bestPrice.price.value) : null;
                      const isGood = bestPrice ? isGoodDeal(product.price.value, bestPrice.price.value) : true;
                      
                      return (
                        <div key={index} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-sm line-clamp-2 flex-1 mr-2">
                              {product.title}
                            </p>
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {formatPrice(product.price)}
                              </p>
                              {savings && savings.amount > 0 && (
                                <p className="text-xs text-red-600 flex items-center">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  +{formatPrice({...product.price, value: savings.amount})}
                                </p>
                              )}
                              {isGood && bestPrice && product.price.value !== bestPrice.price.value && (
                                <Badge variant="secondary" className="text-xs mt-1">
                                  Buen precio
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Badge variant={product.availability === 'In Stock' ? 'default' : 'secondary'} className="text-xs">
                                {product.availability}
                              </Badge>
                              {product.rating && (
                                <span>⭐ {product.rating.toFixed(1)}</span>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(product.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(product.scrapedAt)}
                          </p>
                        </div>
                      );
                    })}
                    
                    {products.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{products.length - 3} productos más
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      {!loading && Object.keys(comparison).length > 0 && (
        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <p>
                Los precios se actualizan automáticamente y pueden cambiar. 
                Verifica la disponibilidad en la tienda antes de comprar.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PriceComparison;
