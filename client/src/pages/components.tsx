import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentCard from "@/components/ComponentCard";
import PriceComparison from "@/components/PriceComparison";
import { 
  Cpu, 
  Monitor, 
  MemoryStick, 
  HardDrive, 
  Zap, 
  Box,
  Fan,
  Mouse,
  Search,
  Filter,
  Grid3X3,
  List,
  ShoppingCart
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

const componentTypes = [
  { id: 'all', name: 'Todos', icon: Grid3X3 },
  { id: 'cpu', name: 'Procesadores', icon: Cpu },
  { id: 'gpu', name: 'Tarjetas Gráficas', icon: Monitor },
  { id: 'ram', name: 'Memoria RAM', icon: MemoryStick },
  { id: 'motherboard', name: 'Placas Base', icon: Box },
  { id: 'storage', name: 'Almacenamiento', icon: HardDrive },
  { id: 'psu', name: 'Fuentes', icon: Zap },
  { id: 'case', name: 'Gabinetes', icon: Box },
  { id: 'cooler', name: 'Refrigeración', icon: Fan },
  { id: 'peripheral', name: 'Periféricos', icon: Mouse },
];

export default function Components() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [brandFilter, setBrandFilter] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: components = [], isLoading: componentsLoading, error: componentsError } = useQuery({
    queryKey: ["/api/components", selectedType === 'all' ? undefined : selectedType],
    enabled: isAuthenticated,
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (componentId: string) => {
      const response = await apiRequest("POST", "/api/cart", {
        componentId,
        quantity: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Añadido al Carrito",
        description: "Componente añadido exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo añadir al carrito",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (componentsError && isUnauthorizedError(componentsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [componentsError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter and sort components
  const filteredComponents = components
    .filter((component: any) => {
      if (searchQuery && !component.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (brandFilter !== 'all' && component.brand.toLowerCase() !== brandFilter.toLowerCase()) {
        return false;
      }
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.basePrice) - parseFloat(b.basePrice);
        case 'price-desc':
          return parseFloat(b.basePrice) - parseFloat(a.basePrice);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        default:
          return 0;
      }
    });

  // Get unique brands for filter
  const brands = [...new Set(components.map((c: any) => c.brand))];

  const handleAddToCart = (componentId: string) => {
    addToCartMutation.mutate(componentId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Catálogo de Componentes
        </h1>
        <p className="text-lg text-muted-foreground">
          Explora nuestra amplia selección de componentes de PC con precios actualizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar componentes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-components"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <div className="space-y-1">
                  {componentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant={selectedType === type.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedType(type.id)}
                        data-testid={`button-category-${type.id}`}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {type.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Marca</label>
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger data-testid="select-brand-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las marcas</SelectItem>
                      {brands.map((brand: string) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="select-sort-by">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="brand">Marca A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                {selectedType === 'all' ? 'Todos los Componentes' : 
                 componentTypes.find(t => t.id === selectedType)?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredComponents.length} componentes encontrados
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                data-testid="button-view-grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Components Grid/List */}
          {componentsLoading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                  <div className="h-12 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredComponents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No se encontraron componentes</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar los filtros para encontrar lo que buscas
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredComponents.map((component: any) => (
                <div key={component.id} className="relative">
                  <ComponentCard
                    component={component}
                    isSelected={false}
                    onSelect={() => setSelectedComponent(component)}
                    showAddToCart={true}
                    onAddToCart={() => handleAddToCart(component.id)}
                    isAddingToCart={addToCartMutation.isPending}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Component Detail Modal/Sidebar */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedComponent.name}</CardTitle>
                  <p className="text-muted-foreground">{selectedComponent.brand}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">
                    ${parseFloat(selectedComponent.basePrice).toLocaleString()}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(selectedComponent.id)}
                    disabled={addToCartMutation.isPending}
                    data-testid="button-add-to-cart-modal"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {addToCartMutation.isPending ? 'Añadiendo...' : 'Añadir'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComponent(null)}
                    data-testid="button-close-modal"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                  <TabsTrigger value="prices">Precios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {selectedComponent.imageUrl && (
                        <img
                          src={selectedComponent.imageUrl}
                          alt={selectedComponent.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Información General</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Marca:</span>
                          <span>{selectedComponent.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Modelo:</span>
                          <span>{selectedComponent.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="capitalize">{selectedComponent.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Precio Base:</span>
                          <span className="font-semibold text-primary">
                            ${parseFloat(selectedComponent.basePrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="specs" className="space-y-4">
                  <h3 className="font-semibold">Especificaciones Técnicas</h3>
                  {selectedComponent.specifications && typeof selectedComponent.specifications === 'object' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedComponent.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-3 bg-muted rounded">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay especificaciones disponibles</p>
                  )}
                </TabsContent>
                
                <TabsContent value="prices">
                  <PriceComparison componentId={selectedComponent.id} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
