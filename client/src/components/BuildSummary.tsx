import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  X,
  Cpu,
  Monitor,
  MemoryStick,
  Settings,
  HardDrive,
  Zap,
  Box,
  Fan
} from "lucide-react";

interface BuildSummaryProps {
  selectedComponents: { [key: string]: any };
  totalPrice: number;
  progress: number;
  compatibility: { compatible: boolean; issues: string[] };
  onRemoveComponent: (type: string) => void;
}

const componentIcons: { [key: string]: any } = {
  cpu: Cpu,
  gpu: Monitor,
  ram: MemoryStick,
  motherboard: Settings,
  storage: HardDrive,
  psu: Zap,
  case: Box,
  cooler: Fan,
};

const componentNames: { [key: string]: string } = {
  cpu: 'Procesador',
  gpu: 'Tarjeta Gráfica',
  ram: 'Memoria RAM',
  motherboard: 'Placa Base',
  storage: 'Almacenamiento',
  psu: 'Fuente',
  case: 'Gabinete',
  cooler: 'Refrigeración',
};

export default function BuildSummary({ 
  selectedComponents, 
  totalPrice, 
  progress, 
  compatibility,
  onRemoveComponent 
}: BuildSummaryProps) {
  const componentCount = Object.keys(selectedComponents).length;
  const totalComponents = 8; // Total possible components

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tu Build</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-save-build-summary">
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Build Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progreso</span>
            <span data-testid="text-component-progress">
              {componentCount}/{totalComponents} componentes
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-build" />
        </div>

        {/* Selected Components */}
        <div className="space-y-3">
          {Object.entries(selectedComponents).map(([type, component]) => {
            const Icon = componentIcons[type] || Cpu;
            return (
              <div 
                key={type}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                data-testid={`component-summary-${type}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate" data-testid={`text-component-name-${type}`}>
                      {component.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {componentNames[type]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary font-medium text-sm" data-testid={`text-component-price-${type}`}>
                    ${parseFloat(component.basePrice).toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveComponent(type)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    data-testid={`button-remove-${type}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Add Component Placeholders */}
          {componentCount < totalComponents && (
            <>
              {!selectedComponents.motherboard && (
                <button 
                  className="w-full p-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors text-left"
                  data-testid="button-add-motherboard"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Agregar Placa Base</span>
                  </div>
                </button>
              )}
              {!selectedComponents.storage && (
                <button 
                  className="w-full p-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors text-left"
                  data-testid="button-add-storage"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Agregar Almacenamiento</span>
                  </div>
                </button>
              )}
              {!selectedComponents.psu && (
                <button 
                  className="w-full p-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors text-left"
                  data-testid="button-add-psu"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Agregar Fuente</span>
                  </div>
                </button>
              )}
            </>
          )}
        </div>

        {/* Compatibility Status */}
        {componentCount > 0 && (
          <div className={`rounded-lg p-4 border ${
            compatibility.compatible 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-destructive/10 border-destructive/20'
          }`}>
            <div className="flex items-center space-x-2" data-testid="compatibility-status">
              {compatibility.compatible ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">
                    Componentes compatibles
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-destructive font-medium text-sm">
                    Problemas de compatibilidad
                  </span>
                </>
              )}
            </div>
            {!compatibility.compatible && compatibility.issues.length > 0 && (
              <ul className="mt-2 text-xs text-destructive space-y-1">
                {compatibility.issues.map((issue, index) => (
                  <li key={index} data-testid={`compatibility-issue-${index}`}>
                    • {issue}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Price Summary */}
        {componentCount > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span data-testid="text-subtotal">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Envío estimado</span>
                <span>$25</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold text-primary">
                <span>Total</span>
                <span data-testid="text-total-price">
                  ${(totalPrice + 25).toLocaleString()}
                </span>
              </div>
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                disabled={!compatibility.compatible || componentCount === 0}
                data-testid="button-continue-purchase"
              >
                Continuar Compra
              </Button>
            </div>
          </>
        )}

        {componentCount === 0 && (
          <div className="text-center py-8">
            <Cpu className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Selecciona componentes para ver el resumen de tu build
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
