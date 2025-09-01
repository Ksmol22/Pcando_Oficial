import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ComponentCard from "@/components/ComponentCard";
import BuildSummary from "@/components/BuildSummary";
import PerformanceEstimate from "@/components/PerformanceEstimate";
import { 
  Cpu, 
  Monitor, 
  MemoryStick, 
  HardDrive, 
  Zap, 
  Box,
  Fan,
  Mouse,
  Save,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface ComponentType {
  id: string;
  name: string;
  icon: any;
  required: boolean;
}

const componentTypes: ComponentType[] = [
  { id: 'cpu', name: 'Procesador', icon: Cpu, required: true },
  { id: 'gpu', name: 'Tarjeta Gráfica', icon: Monitor, required: true },
  { id: 'ram', name: 'Memoria RAM', icon: MemoryStick, required: true },
  { id: 'motherboard', name: 'Placa Base', icon: Settings, required: true },
  { id: 'storage', name: 'Almacenamiento', icon: HardDrive, required: true },
  { id: 'psu', name: 'Fuente', icon: Zap, required: true },
  { id: 'case', name: 'Gabinete', icon: Box, required: false },
  { id: 'cooler', name: 'Refrigeración', icon: Fan, required: false },
];

export default function Configurator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedType, setSelectedType] = useState('cpu');
  const [selectedComponents, setSelectedComponents] = useState<{[key: string]: any}>({});
  const [buildName, setBuildName] = useState('');
  const [buildDescription, setBuildDescription] = useState('');
  const [buildUseCase, setBuildUseCase] = useState('');
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);

  const { data: components = [], isLoading: componentsLoading, error: componentsError } = useQuery({
    queryKey: ["/api/components", selectedType],
    enabled: isAuthenticated,
    retry: false,
  });

  const createBuildMutation = useMutation({
    mutationFn: async (buildData: any) => {
      const response = await apiRequest("POST", "/api/builds", buildData);
      return response.json();
    },
    onSuccess: (newBuild) => {
      setCurrentBuildId(newBuild.id);
      toast({
        title: "Build Creada",
        description: `${newBuild.name} se ha guardado exitosamente`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/builds"] });
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
        description: "No se pudo guardar la build",
        variant: "destructive",
      });
    },
  });

  const addComponentToBuildMutation = useMutation({
    mutationFn: async ({ buildId, componentId, priceAtTime }: any) => {
      const response = await apiRequest("POST", `/api/builds/${buildId}/components`, {
        componentId,
        priceAtTime,
        quantity: 1,
      });
      return response.json();
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
        description: "No se pudo añadir el componente",
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

  const selectedComponentsCount = Object.keys(selectedComponents).length;
  const requiredComponents = componentTypes.filter(t => t.required).length;
  const progress = (selectedComponentsCount / componentTypes.length) * 100;

  const totalPrice = Object.values(selectedComponents).reduce((total: number, component: any) => {
    return total + parseFloat(component.basePrice || 0);
  }, 0);

  const checkCompatibility = () => {
    const issues: string[] = [];
    let totalPowerConsumption = 0;
    
    const cpu = selectedComponents.cpu;
    const motherboard = selectedComponents.motherboard;
    const ram = selectedComponents.ram;
    const gpu = selectedComponents.gpu;
    const psu = selectedComponents.psu;
    const cooler = selectedComponents.cooler;
    const case_ = selectedComponents.case;

    // CPU + Motherboard compatibility
    if (cpu && motherboard) {
      const cpuSocket = cpu.specifications?.socket;
      const mbSocket = motherboard.specifications?.socket;
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        issues.push(`❌ Socket incompatible: CPU ${cpuSocket} vs Motherboard ${mbSocket}`);
      } else if (cpuSocket && mbSocket && cpuSocket === mbSocket) {
        // Compatible
      }
    }

    // RAM + Motherboard compatibility
    if (ram && motherboard) {
      const ramType = ram.specifications?.type;
      const mbRamType = motherboard.specifications?.ramType;
      if (ramType && mbRamType && ramType !== mbRamType) {
        issues.push(`❌ RAM incompatible: ${ramType} vs ${mbRamType} en motherboard`);
      }
    }

    // Power consumption calculation
    if (cpu) totalPowerConsumption += parseInt(cpu.specifications?.tdp || '65');
    if (gpu) totalPowerConsumption += parseInt(gpu.specifications?.powerConsumption || '220');
    totalPowerConsumption += 100; // Base consumption (motherboard, RAM, storage, etc.)

    // PSU capacity check
    if (psu) {
      const psuWattage = parseInt(psu.specifications?.wattage || '0');
      if (psuWattage > 0 && totalPowerConsumption > psuWattage * 0.8) {
        issues.push(`⚠️ PSU insuficiente: Necesitas al menos ${Math.ceil(totalPowerConsumption / 0.8)}W, tienes ${psuWattage}W`);
      }
    }

    // GPU + Case compatibility (GPU length)
    if (gpu && case_) {
      const gpuLength = parseInt(gpu.specifications?.length || '0');
      const caseMaxGpu = parseInt(case_.specifications?.maxGpuLength || '0');
      if (gpuLength > 0 && caseMaxGpu > 0 && gpuLength > caseMaxGpu) {
        issues.push(`❌ GPU muy larga: ${gpuLength}mm vs máximo ${caseMaxGpu}mm del case`);
      }
    }

    // CPU Cooler + Case compatibility (cooler height)
    if (cooler && case_) {
      const coolerHeight = parseInt(cooler.specifications?.height || '0');
      const caseMaxCooler = parseInt(case_.specifications?.maxCpuCoolerHeight || '0');
      if (coolerHeight > 0 && caseMaxCooler > 0 && coolerHeight > caseMaxCooler) {
        issues.push(`❌ Cooler muy alto: ${coolerHeight}mm vs máximo ${caseMaxCooler}mm del case`);
      }
    }

    // CPU + Cooler compatibility
    if (cpu && cooler) {
      const cpuSocket = cpu.specifications?.socket;
      const coolerCompatibility = cooler.specifications?.compatibility || '';
      if (cpuSocket && coolerCompatibility && !coolerCompatibility.includes(cpuSocket)) {
        issues.push(`❌ Cooler incompatible con socket ${cpuSocket}`);
      }
    }

    // Warning if required components are missing
    const requiredTypes = ['cpu', 'motherboard', 'ram', 'storage', 'psu'];
    const missingRequired = requiredTypes.filter(type => !selectedComponents[type]);
    if (missingRequired.length > 0) {
      issues.push(`⚠️ Componentes requeridos faltantes: ${missingRequired.join(', ')}`);
    }

    return { 
      compatible: issues.length === 0 || issues.every(i => i.startsWith('⚠️')), 
      issues,
      totalPowerConsumption
    };
  };

  const compatibility = checkCompatibility();

  const handleComponentSelect = (component: any) => {
    setSelectedComponents(prev => ({
      ...prev,
      [selectedType]: component
    }));

    // If we have a build ID, add the component to the build
    if (currentBuildId) {
      addComponentToBuildMutation.mutate({
        buildId: currentBuildId,
        componentId: component.id,
        priceAtTime: component.basePrice,
      });
    }

    toast({
      title: "Componente Seleccionado",
      description: `${component.name} añadido a tu build`,
    });
  };

  const handleSaveBuild = () => {
    if (!buildName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un nombre para la build",
        variant: "destructive",
      });
      return;
    }

    if (selectedComponentsCount === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un componente",
        variant: "destructive",
      });
      return;
    }

    createBuildMutation.mutate({
      name: buildName,
      description: buildDescription,
      useCase: buildUseCase,
      totalPrice: totalPrice.toString(),
      isPublic: false,
    });
  };

  const handleQuickBuild = (useCase: string) => {
    // Set use case and generate automatic build name
    setBuildUseCase(useCase);
    setBuildName(`Build ${useCase.charAt(0).toUpperCase() + useCase.slice(1)} ${new Date().getFullYear()}`);
    
    toast({
      title: "Configuración Automática",
      description: `Generando build optimizada para ${useCase}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Configurador de PC
            </h1>
            <p className="text-lg text-muted-foreground">
              Construye tu PC perfecta con validación de compatibilidad en tiempo real
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Button
              onClick={() => handleQuickBuild('gaming')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-auto-gaming"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Build Gaming
            </Button>
            <Button
              onClick={() => handleQuickBuild('workstation')}
              variant="outline"
              data-testid="button-auto-workstation"
            >
              <Settings className="mr-2 h-4 w-4" />
              Build Workstation
            </Button>
            <Button
              onClick={() => handleQuickBuild('office')}
              variant="outline"
              data-testid="button-auto-office"
            >
              <Settings className="mr-2 h-4 w-4" />
              Build Oficina
            </Button>
          </div>
        </div>

        {/* Build Info Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información de la Build</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre de la Build</label>
                <Input
                  placeholder="Mi nueva PC Gaming"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  data-testid="input-build-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Uso Principal</label>
                <Select value={buildUseCase} onValueChange={setBuildUseCase}>
                  <SelectTrigger data-testid="select-use-case">
                    <SelectValue placeholder="Seleccionar uso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="workstation">Workstation</SelectItem>
                    <SelectItem value="office">Oficina</SelectItem>
                    <SelectItem value="streaming">Streaming</SelectItem>
                    <SelectItem value="server">Servidor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSaveBuild}
                  disabled={createBuildMutation.isPending}
                  className="w-full"
                  data-testid="button-save-build"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createBuildMutation.isPending ? 'Guardando...' : 'Guardar Build'}
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium mb-2 block">Descripción (Opcional)</label>
              <Textarea
                placeholder="Describe tu build..."
                value={buildDescription}
                onChange={(e) => setBuildDescription(e.target.value)}
                rows={2}
                data-testid="textarea-build-description"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Build Summary - Left Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <BuildSummary
            selectedComponents={selectedComponents}
            totalPrice={totalPrice}
            progress={progress}
            compatibility={compatibility}
            onRemoveComponent={(type: string) => {
              setSelectedComponents(prev => {
                const updated = { ...prev };
                delete updated[type];
                return updated;
              });
            }}
          />

          {/* Compatibility Check */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                {compatibility.compatible ? (
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                )}
                Compatibilidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              {compatibility.issues.length === 0 ? (
                <div className="text-green-600 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Todos compatibles
                </div>
              ) : (
                <div className="space-y-2">
                  {compatibility.issues.map((issue, index) => (
                    <div key={index} className={`text-xs flex items-start ${
                      issue.startsWith('❌') ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      <span className="mr-1">{issue.slice(0, 2)}</span>
                      <span>{issue.slice(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {compatibility.totalPowerConsumption > 0 && (
                <div className="mt-3 p-2 bg-muted rounded-lg">
                  <div className="text-xs font-medium mb-1">Consumo Estimado</div>
                  <div className="text-sm font-bold text-primary">
                    {compatibility.totalPowerConsumption}W
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PSU recomendado: {Math.ceil(compatibility.totalPowerConsumption / 0.8)}W
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          {/* Component Type Selector */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Seleccionar Componentes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {componentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                const hasComponent = selectedComponents[type.id];
                
                return (
                  <Button
                    key={type.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center space-y-2 relative ${
                      hasComponent ? 'border-green-400' : ''
                    }`}
                    onClick={() => setSelectedType(type.id)}
                    data-testid={`button-type-${type.id}`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-medium text-center">{type.name}</span>
                    {type.required && (
                      <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                        !
                      </Badge>
                    )}
                    {hasComponent && (
                      <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-400 bg-background rounded-full" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Components Grid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  {(() => {
                    const selectedTypeData = componentTypes.find(t => t.id === selectedType);
                    const Icon = selectedTypeData?.icon;
                    return (
                      <>
                        {Icon && <Icon className="mr-2 h-5 w-5 text-primary" />}
                        {selectedTypeData?.name}
                      </>
                    );
                  })()}
                </CardTitle>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las marcas</SelectItem>
                      <SelectItem value="intel">Intel</SelectItem>
                      <SelectItem value="amd">AMD</SelectItem>
                      <SelectItem value="nvidia">NVIDIA</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="price">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Precio</SelectItem>
                      <SelectItem value="performance">Rendimiento</SelectItem>
                      <SelectItem value="rating">Valoración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {componentsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
                      <div className="h-12 bg-muted rounded mb-3"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : components.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No hay componentes disponibles</h3>
                  <p className="text-muted-foreground">
                    No se encontraron componentes para esta categoría
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {components.map((component: any) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      isSelected={selectedComponents[selectedType]?.id === component.id}
                      onSelect={() => handleComponentSelect(component)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Estimate */}
          {Object.keys(selectedComponents).length > 0 && (
            <div className="mt-6">
              <PerformanceEstimate selectedComponents={selectedComponents} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
