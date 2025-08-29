
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, ShoppingCart, Eye } from "lucide-react";

interface ComponentCardProps {
  component: any;
  isSelected?: boolean;
  onSelect: () => void;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
  isAddingToCart?: boolean;
  viewMode?: 'grid' | 'list';
}

export default function ComponentCard({ 
  component, 
  isSelected = false, 
  onSelect, 
  showAddToCart = false,
  onAddToCart,
  isAddingToCart = false,
  viewMode = 'grid'
}: ComponentCardProps) {
  const renderStars = (rating: number = 4.5, reviewCount: number = 234) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {Array.from({ length: fullStars }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
          {hasHalfStar && <StarHalf className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Star key={i} className="h-3 w-3 text-muted-foreground" />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      </div>
    );
  };

  const getStockStatus = () => {
    // Mock stock status
    const statuses = ['En stock', 'Pocas unidades', 'Agotado'];
    const colors = ['text-green-400', 'text-orange-400', 'text-destructive'];
    const randomStatus = Math.floor(Math.random() * 3);
    return { status: statuses[randomStatus], color: colors[randomStatus] };
  };

  const stockInfo = getStockStatus();

  if (viewMode === 'list') {
    return (
      <Card className={`hover:border-primary transition-colors cursor-pointer ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Component Image */}
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              {component.imageUrl ? (
                <img
                  src={component.imageUrl}
                  alt={component.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                  <span className="text-primary text-xs font-semibold">
                    {component.brand?.[0] || 'C'}
                  </span>
                </div>
              )}
            </div>

            {/* Component Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate" data-testid={`text-component-name-${component.id}`}>
                    {component.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{component.brand}</p>
                  
                  {/* Specifications */}
                  {component.specifications && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(component.specifications).slice(0, 3).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {String(value)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="text-right">
                    <p className="text-primary font-bold text-lg" data-testid={`text-price-${component.id}`}>
                      ${parseFloat(component.basePrice).toLocaleString()}
                    </p>
                    <p className={`text-xs ${stockInfo.color}`}>{stockInfo.status}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onSelect}
                      data-testid={`button-view-details-${component.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {showAddToCart && onAddToCart && (
                      <Button
                        size="sm"
                        onClick={onAddToCart}
                        disabled={isAddingToCart}
                        data-testid={`button-add-cart-${component.id}`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {isAddingToCart ? 'Añadiendo...' : 'Añadir'}
                      </Button>
                    )}
                    {!showAddToCart && (
                      <Button
                        size="sm"
                        onClick={onSelect}
                        className={isSelected ? 'bg-green-500 hover:bg-green-600' : ''}
                        data-testid={`button-select-${component.id}`}
                      >
                        {isSelected ? 'Seleccionado' : 'Seleccionar'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mt-2">
                {renderStars()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:border-primary transition-colors cursor-pointer ${
      isSelected ? 'border-primary bg-primary/5' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Component Image */}
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              {component.imageUrl ? (
                <img
                  src={component.imageUrl}
                  alt={component.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                  <span className="text-primary text-xs font-semibold">
                    {component.brand?.[0] || 'C'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate" data-testid={`text-component-name-${component.id}`}>
                {component.name}
              </h3>
              <p className="text-xs text-muted-foreground">{component.brand}</p>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className="text-primary font-bold" data-testid={`text-price-${component.id}`}>
              ${parseFloat(component.basePrice).toLocaleString()}
            </p>
            <p className={`text-xs ${stockInfo.color}`}>{stockInfo.status}</p>
          </div>
        </div>

        {/* Specifications */}
        {component.specifications && (
          <div className="flex justify-between text-xs text-muted-foreground mb-3">
            {Object.entries(component.specifications).slice(0, 3).map(([key, value], index) => (
              <span key={key} className="truncate">
                {String(value)}
              </span>
            ))}
          </div>
        )}

        {/* Rating and Actions */}
        <div className="flex justify-between items-center">
          {renderStars()}
          
          <div className="flex space-x-2">
            {showAddToCart && onAddToCart ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSelect}
                  data-testid={`button-view-${component.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={onAddToCart}
                  disabled={isAddingToCart}
                  data-testid={`button-add-cart-${component.id}`}
                >
                  <ShoppingCart className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={onSelect}
                className={`text-sm ${isSelected ? 'bg-green-500 hover:bg-green-600' : ''}`}
                data-testid={`button-select-${component.id}`}
              >
                {isSelected ? 'Seleccionado' : 'Seleccionar'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
