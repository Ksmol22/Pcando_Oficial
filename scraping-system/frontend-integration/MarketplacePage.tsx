import React, { useState, useEffect } from 'react';
import { Search, TrendingDown, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Importar componentes del sistema de scraping
import ProductSearch from '../scraping-system/frontend-integration/ProductSearch';
import PriceComparison from '../scraping-system/frontend-integration/PriceComparison';

/**
 * Página principal del sistema de comparación de precios
 * Integra el sistema de scraping con la interfaz de usuario
 */
export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonProduct, setComparisonProduct] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Guardar búsqueda reciente
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  const handleSearchResults = (products: any[]) => {
    console.log('Productos encontrados:', products.length);
  };

  const popularSearches = [
    'Intel Core i7',
    'RTX 4070',
    'AMD Ryzen 7',
    'DDR4 32GB',
    'SSD NVMe 1TB',
    'ASUS ROG',
    'MSI Gaming',
    'Corsair RAM'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Comparador de Precios de Componentes PC
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Encuentra los mejores precios de Amazon, MercadoLibre y más tiendas en tiempo real.
              Ahorra dinero en tu próxima build de PC.
            </p>
            
            {/* Quick Search */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Buscar componentes de PC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      saveRecentSearch(searchQuery);
                      setActiveTab('search');
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  onClick={() => {
                    saveRecentSearch(searchQuery);
                    setActiveTab('search');
                  }}
                  disabled={!searchQuery.trim()}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
              
              {/* Popular Searches */}
              <div className="text-left">
                <p className="text-sm text-muted-foreground mb-2">Búsquedas populares:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <Badge 
                      key={search}
                      variant="secondary" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => {
                        setSearchQuery(search);
                        saveRecentSearch(search);
                        setActiveTab('search');
                      }}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Búsqueda de Productos
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Comparar Precios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Búsquedas Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Badge 
                        key={search}
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => setSearchQuery(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Search Component */}
            <ProductSearch
              onResults={handleSearchResults}
              apiBaseUrl="http://localhost:3001"
              defaultSources={['amazon', 'mercadolibre_mx']}
            />
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            {/* Comparison Input */}
            <Card>
              <CardHeader>
                <CardTitle>Comparar Precios de un Producto Específico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nombre exacto del producto (ej: Intel Core i7-13700K)"
                    value={comparisonProduct}
                    onChange={(e) => setComparisonProduct(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && comparisonProduct.trim()) {
                        // El componente PriceComparison se actualizará automáticamente
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => {
                      // Forzar re-render del componente de comparación
                      setComparisonProduct(comparisonProduct + ' ');
                      setTimeout(() => setComparisonProduct(comparisonProduct.trim()), 10);
                    }}
                    disabled={!comparisonProduct.trim()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Comparar
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Tip: Usa el nombre exacto del producto para mejores resultados
                </p>
              </CardContent>
            </Card>

            {/* Price Comparison Component */}
            {comparisonProduct.trim() && (
              <PriceComparison
                productName={comparisonProduct.trim()}
                sources={['amazon', 'mercadolibre_mx', 'mercadolibre_ar']}
                apiBaseUrl="http://localhost:3001"
                autoRefresh={false}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Búsqueda Inteligente</h3>
              <p className="text-muted-foreground">
                Busca componentes en múltiples tiendas simultáneamente con filtros avanzados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Mejor Precio Garantizado</h3>
              <p className="text-muted-foreground">
                Compara precios en tiempo real y encuentra automáticamente la mejor oferta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Datos Actualizados</h3>
              <p className="text-muted-foreground">
                Información de productos y precios actualizada constantemente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <Card className="bg-muted/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tiendas Soportadas</h3>
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white">Amazon</Badge>
                  <span className="text-sm text-muted-foreground">Estados Unidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-white">MercadoLibre</Badge>
                  <span className="text-sm text-muted-foreground">México, Argentina, Colombia</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  + Más tiendas próximamente
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
