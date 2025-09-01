import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Star, Filter } from "lucide-react";
import { products, productCategories } from "@shared/productDatabase";
import { useAuth } from "@/hooks/useAuth";

export default function Components() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory && product.isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'destructive', text: 'Agotado' };
    if (stock < 10) return { color: 'secondary', text: `${stock} disponibles` };
    return { color: 'default', text: 'En stock' };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Catálogo de Componentes</h1>
        <p className="text-muted-foreground text-lg">
          Explora nuestra amplia selección de componentes de PC de alta calidad
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-64">
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {productCategories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre A-Z</SelectItem>
            <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="rating">Mejor Calificado</SelectItem>
            <SelectItem value="stock">Más en Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 text-sm text-muted-foreground">
        Mostrando {filteredProducts.length} de {products.length} productos
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          const categoryName = productCategories.find(c => c.id === product.category)?.name || product.category;
          
          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-4xl text-muted-foreground">
                    {product.category === 'processors' && '🔲'}
                    {product.category === 'graphics_cards' && '🎮'}
                    {product.category === 'motherboards' && '🔧'}
                    {product.category === 'memory' && '📊'}
                    {product.category === 'storage' && '💾'}
                    {product.category === 'power_supplies' && '⚡'}
                    {product.category === 'cases' && '📦'}
                    {product.category === 'cooling' && '❄️'}
                  </div>
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {categoryName}
                  </Badge>
                  <CardTitle className="text-base line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <CardDescription className="text-xs line-clamp-2">
                    {product.description}
                  </CardDescription>
                  
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        ${product.price}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        {product.currency}
                      </span>
                    </div>
                    <Badge variant={stockStatus.color as any}>
                      {stockStatus.text}
                    </Badge>
                  </div>
                  
                  {/* Características principales */}
                  {product.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {isAuthenticated ? (
                    <Button 
                      className="w-full" 
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Inicia sesión para ver precios
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
          <p className="text-muted-foreground">
            Intenta ajustar tus filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
