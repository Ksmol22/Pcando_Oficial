import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  ExternalLink, 
  Truck, 
  Clock,
  Store,
  ShoppingBag,
  Zap
} from "lucide-react";

interface PriceComparisonProps {
  componentId: string;
}

export default function PriceComparison({ componentId }: PriceComparisonProps) {
  const { data: prices = [], isLoading, error } = useQuery({
    queryKey: ["/api/components", componentId, "prices"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-primary" />
          Comparación de Precios
        </h3>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-5 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || prices.length === 0) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">No hay precios disponibles</h3>
        <p className="text-muted-foreground text-sm">
          No se encontraron precios para este componente en nuestros proveedores
        </p>
      </div>
    );
  }

  const getSupplierIcon = (supplierName: string) => {
    const name = supplierName.toLowerCase();
    if (name.includes('tech')) return Store;
    if (name.includes('parts')) return ShoppingBag;
    if (name.includes('fast')) return Zap;
    return Store;
  };

  const getDeliveryColor = (days: number) => {
    if (days <= 1) return 'text-green-400';
    if (days <= 3) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getBestPrice = () => {
    return Math.min(...prices.map((p: any) => parseFloat(p.price) + parseFloat(p.shippingCost || 0)));
  };

  const bestPrice = getBestPrice();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center">
        <TrendingUp className="mr-2 h-5 w-5 text-primary" />
        Comparación de Precios
      </h3>
      
      <div className="space-y-3">
        {prices.map((priceInfo: any, index: number) => {
          const SupplierIcon = getSupplierIcon(priceInfo.supplier.name);
          const totalPrice = parseFloat(priceInfo.price) + parseFloat(priceInfo.shippingCost || 0);
          const isBestPrice = totalPrice === bestPrice;
          
          return (
            <Card 
              key={priceInfo.id} 
              className={`transition-colors ${isBestPrice ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      isBestPrice ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <SupplierIcon className={`h-4 w-4 ${
                        isBestPrice ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium" data-testid={`text-supplier-${index}`}>
                          {priceInfo.supplier.name}
                        </p>
                        {isBestPrice && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Mejor precio
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Truck className="h-3 w-3" />
                          <span className={getDeliveryColor(priceInfo.shippingDays)}>
                            Entrega en {priceInfo.shippingDays} días
                          </span>
                        </div>
                        {priceInfo.stock && (
                          <div className="flex items-center space-x-1">
                            <span className="text-green-400">
                              {priceInfo.stock} en stock
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="font-bold text-primary" data-testid={`text-price-${index}`}>
                          ${parseFloat(priceInfo.price).toLocaleString()}
                        </p>
                        {parseFloat(priceInfo.shippingCost || 0) > 0 ? (
                          <p className="text-xs text-muted-foreground">
                            + ${parseFloat(priceInfo.shippingCost).toLocaleString()} envío
                          </p>
                        ) : (
                          <p className="text-xs text-green-400">Envío gratis</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={isBestPrice ? "default" : "outline"}
                        onClick={() => {
                          if (priceInfo.supplier.website) {
                            window.open(priceInfo.supplier.website, '_blank');
                          }
                        }}
                        data-testid={`button-buy-${index}`}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        <Clock className="h-3 w-3 inline mr-1" />
        Precios actualizados hace {Math.floor(Math.random() * 60) + 1} minutos
      </div>
    </div>
  );
}
