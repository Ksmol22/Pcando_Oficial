import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Video, 
  Radio, 
  Cpu, 
  Activity,
  Zap,
  Thermometer
} from "lucide-react";

interface PerformanceEstimateProps {
  selectedComponents: { [key: string]: any };
}

export default function PerformanceEstimate({ selectedComponents }: PerformanceEstimateProps) {
  // Performance calculation logic based on selected components
  const calculatePerformance = () => {
    const cpu = selectedComponents.cpu;
    const gpu = selectedComponents.gpu;
    const ram = selectedComponents.ram;
    
    // Mock performance calculations based on component specifications
    let gamingScore = 0;
    let workstationScore = 0;
    let streamingScore = 0;
    let powerConsumption = 0;
    
    // CPU performance contribution
    if (cpu) {
      const cpuName = cpu.name.toLowerCase();
      if (cpuName.includes('i9') || cpuName.includes('7950x') || cpuName.includes('7900x')) {
        gamingScore += 35;
        workstationScore += 40;
        streamingScore += 40;
        powerConsumption += 150;
      } else if (cpuName.includes('i7') || cpuName.includes('7700x') || cpuName.includes('7800x')) {
        gamingScore += 30;
        workstationScore += 35;
        streamingScore += 35;
        powerConsumption += 120;
      } else if (cpuName.includes('i5') || cpuName.includes('7600x') || cpuName.includes('5600x')) {
        gamingScore += 25;
        workstationScore += 25;
        streamingScore += 25;
        powerConsumption += 100;
      }
    }
    
    // GPU performance contribution
    if (gpu) {
      const gpuName = gpu.name.toLowerCase();
      if (gpuName.includes('4090') || gpuName.includes('4080')) {
        gamingScore += 45;
        workstationScore += 40;
        streamingScore += 35;
        powerConsumption += 400;
      } else if (gpuName.includes('4070') || gpuName.includes('7900')) {
        gamingScore += 35;
        workstationScore += 30;
        streamingScore += 30;
        powerConsumption += 250;
      } else if (gpuName.includes('4060') || gpuName.includes('7600')) {
        gamingScore += 25;
        workstationScore += 20;
        streamingScore += 20;
        powerConsumption += 150;
      }
    }
    
    // RAM contribution
    if (ram) {
      const ramSpecs = ram.specifications;
      if (ramSpecs?.capacity === '32GB' || ramSpecs?.size === '32GB') {
        gamingScore += 10;
        workstationScore += 15;
        streamingScore += 15;
      } else if (ramSpecs?.capacity === '16GB' || ramSpecs?.size === '16GB') {
        gamingScore += 8;
        workstationScore += 10;
        streamingScore += 10;
      }
    }
    
    return {
      gaming: Math.min(gamingScore, 100),
      workstation: Math.min(workstationScore, 100),
      streaming: Math.min(streamingScore, 100),
      powerConsumption: powerConsumption + 100 // Base system consumption
    };
  };

  const performance = calculatePerformance();
  
  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { level: 'Excelente', color: 'text-green-400' };
    if (score >= 60) return { level: 'Muy Bueno', color: 'text-blue-400' };
    if (score >= 40) return { level: 'Bueno', color: 'text-yellow-400' };
    if (score >= 20) return { level: 'Básico', color: 'text-orange-400' };
    return { level: 'Limitado', color: 'text-red-400' };
  };

  const getGamingFPS = (score: number) => {
    if (score >= 80) return '165+ FPS';
    if (score >= 60) return '120-165 FPS';
    if (score >= 40) return '60-120 FPS';
    if (score >= 20) return '30-60 FPS';
    return '<30 FPS';
  };

  const getWorkstationCapability = (score: number) => {
    if (score >= 80) return '4K/8K Edición';
    if (score >= 60) return '4K Edición';
    if (score >= 40) return '1440p Edición';
    if (score >= 20) return '1080p Edición';
    return 'Edición Básica';
  };

  const getStreamingQuality = (score: number) => {
    if (score >= 80) return '4K/60fps';
    if (score >= 60) return '1440p/60fps';
    if (score >= 40) return '1080p/60fps';
    if (score >= 20) return '1080p/30fps';
    return '720p/30fps';
  };

  const getThermalLevel = (power: number) => {
    if (power >= 500) return { level: 'Alto', color: 'text-red-400' };
    if (power >= 350) return { level: 'Medio-Alto', color: 'text-orange-400' };
    if (power >= 250) return { level: 'Medio', color: 'text-yellow-400' };
    return { level: 'Bajo', color: 'text-green-400' };
  };

  if (Object.keys(selectedComponents).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Estimación de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Selecciona componentes para ver la estimación de rendimiento
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Estimación de Rendimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gaming Performance */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <Gamepad2 className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Gaming 1080p</h3>
            <div className="space-y-2">
              <Progress 
                value={performance.gaming} 
                className="h-2" 
                data-testid="progress-gaming-performance"
              />
              <p className="text-2xl font-bold text-primary" data-testid="text-gaming-fps">
                {getGamingFPS(performance.gaming)}
              </p>
              <p className={`text-sm font-medium ${getPerformanceLevel(performance.gaming).color}`}>
                {getPerformanceLevel(performance.gaming).level}
              </p>
              <p className="text-xs text-muted-foreground">Ultra settings</p>
            </div>
          </div>

          {/* Workstation Performance */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <Video className="h-8 w-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Workstation</h3>
            <div className="space-y-2">
              <Progress 
                value={performance.workstation} 
                className="h-2" 
                data-testid="progress-workstation-performance"
              />
              <p className="text-xl font-bold text-secondary" data-testid="text-workstation-capability">
                {getWorkstationCapability(performance.workstation)}
              </p>
              <p className={`text-sm font-medium ${getPerformanceLevel(performance.workstation).color}`}>
                {getPerformanceLevel(performance.workstation).level}
              </p>
              <p className="text-xs text-muted-foreground">Render/Edición</p>
            </div>
          </div>

          {/* Streaming Performance */}
          <div className="text-center p-4 bg-muted rounded-lg">
            <Radio className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Streaming</h3>
            <div className="space-y-2">
              <Progress 
                value={performance.streaming} 
                className="h-2" 
                data-testid="progress-streaming-performance"
              />
              <p className="text-xl font-bold text-green-400" data-testid="text-streaming-quality">
                {getStreamingQuality(performance.streaming)}
              </p>
              <p className={`text-sm font-medium ${getPerformanceLevel(performance.streaming).color}`}>
                {getPerformanceLevel(performance.streaming).level}
              </p>
              <p className="text-xs text-muted-foreground">Sin drops</p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="font-medium">Consumo Estimado</span>
            </div>
            <div className="text-right">
              <span className="font-bold" data-testid="text-power-consumption">
                {performance.powerConsumption}W
              </span>
              <p className="text-xs text-muted-foreground">Recomendado: {Math.ceil(performance.powerConsumption * 1.2)}W PSU</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-blue-400" />
              <span className="font-medium">Nivel Térmico</span>
            </div>
            <div className="text-right">
              <span className={`font-bold ${getThermalLevel(performance.powerConsumption).color}`} data-testid="text-thermal-level">
                {getThermalLevel(performance.powerConsumption).level}
              </span>
              <p className="text-xs text-muted-foreground">Refrigeración requerida</p>
            </div>
          </div>
        </div>

        {/* Performance Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {performance.gaming >= 60 && (
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Gaming Ready
            </Badge>
          )}
          {performance.workstation >= 60 && (
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
              Workstation Ready
            </Badge>
          )}
          {performance.streaming >= 60 && (
            <Badge className="bg-green-400/10 text-green-400 border-green-400/20">
              Streaming Ready
            </Badge>
          )}
          {performance.powerConsumption <= 300 && (
            <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20">
              Eficiente
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
