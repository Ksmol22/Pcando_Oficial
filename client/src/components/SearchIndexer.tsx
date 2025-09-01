import { useState, useEffect, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart } from 'lucide-react';
import { products, Product } from '@shared/productDatabase';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SearchIndexerProps {
  children: React.ReactNode;
}

// Crear un índice de búsqueda optimizado
const createSearchIndex = (products: Product[]) => {
  return products.map(product => ({
    ...product,
    searchTerms: [
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      product.category.toLowerCase(),
      ...Object.values(product.specifications || {}).map(val => val.toString().toLowerCase()),
      ...(product.keyFeatures || []).map(feature => feature.toLowerCase())
    ].join(' ')
  }));
};

export default function SearchIndexer({ children }: SearchIndexerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Índice de búsqueda optimizado
  const searchIndex = useMemo(() => createSearchIndex(products), []);

  // Filtrar productos basado en la búsqueda
  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return [];
    
    const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    
    return searchIndex
      .filter(product => {
        return product.isActive && queryTerms.every(term => 
          product.searchTerms.includes(term)
        );
      })
      .slice(0, 10) // Limitar resultados para performance
      .sort((a, b) => {
        // Priorizar matches exactos en nombre
        const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        // Luego por rating
        return b.rating - a.rating;
      });
  }, [query, searchIndex]);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      });
      return;
    }

    if (product.stock === 0) {
      toast({
        title: "Producto agotado",
        description: "Este producto no está disponible en stock",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      category: product.category,
      specifications: product.specifications,
    });

    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado al carrito`,
    });

    setOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Agotado</Badge>;
    if (stock < 10) return <Badge variant="secondary">Stock bajo</Badge>;
    return <Badge variant="default">Disponible</Badge>;
  };

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Buscar componentes... (Ej: RTX 4070, Ryzen 7, DDR5)"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length < 2 ? (
              <div className="p-6 text-center">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Búsqueda Inteligente</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Busca por nombre, marca, especificaciones o características
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">RTX 4090</Badge>
                  <Badge variant="outline">Ryzen 9 7950X</Badge>
                  <Badge variant="outline">DDR5 32GB</Badge>
                  <Badge variant="outline">SSD 2TB</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Tip: Usa Ctrl+K para abrir la búsqueda rápidamente
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <CommandEmpty>
                <div className="text-center p-6">
                  <Search className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p>No se encontraron productos para "{query}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Intenta con términos más específicos
                  </p>
                </div>
              </CommandEmpty>
            ) : (
              <CommandGroup heading={`${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''} encontrado${searchResults.length !== 1 ? 's' : ''}`}>
                {searchResults.map((product) => (
                  <CommandItem 
                    key={product.id} 
                    className="flex items-center gap-3 p-3"
                    onSelect={() => {}}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {product.brand} • {product.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {getStockBadge(product.stock)}
                          {isAuthenticated && (
                            <span className="font-semibold text-sm">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Especificaciones clave */}
                      {product.keyFeatures && product.keyFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {product.keyFeatures.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.rating})
                          </span>
                        </div>

                        {isAuthenticated && product.stock > 0 && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="h-6 px-2"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Agregar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
