import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Gamepad2,
  Video,
  Briefcase,
  Cpu,
  TrendingUp,
  Heart,
  Star
} from "lucide-react";

interface Build {
  id: string;
  name: string;
  description: string;
  useCase: 'gaming' | 'work' | 'creator' | 'budget';
  totalPrice: number;
  estimatedPerformance: number;
  popularity: number;
  isPublic: boolean;
  components: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard: string;
    psu: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function Builds() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState<string>("all");

  // Mock data - En una aplicación real, esto vendría de una API
  const mockBuilds: Build[] = [
    {
      id: "1",
      name: "Gaming Beast 2024",
      description: "Configuración ideal para gaming en 4K",
      useCase: 'gaming',
      totalPrice: 2500,
      estimatedPerformance: 95,
      popularity: 87,
      isPublic: true,
      components: {
        cpu: "AMD Ryzen 7 7800X3D",
        gpu: "NVIDIA RTX 4080 Super",
        ram: "32GB DDR5-5600",
        storage: "2TB NVMe SSD",
        motherboard: "MSI X670E Carbon WiFi",
        psu: "850W 80+ Gold Modular"
      },
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Workstation Pro",
      description: "Para trabajo profesional y rendering",
      useCase: 'work',
      totalPrice: 3200,
      estimatedPerformance: 92,
      popularity: 76,
      isPublic: true,
      components: {
        cpu: "Intel Core i9-14900K",
        gpu: "NVIDIA RTX 4090",
        ram: "64GB DDR5-5600",
        storage: "4TB NVMe SSD",
        motherboard: "ASUS ROG Maximus Z790",
        psu: "1000W 80+ Platinum"
      },
      createdAt: "2024-01-10",
      updatedAt: "2024-01-12"
    },
    {
      id: "3",
      name: "Budget Gamer",
      description: "Gaming accesible sin sacrificar rendimiento",
      useCase: 'budget',
      totalPrice: 1200,
      estimatedPerformance: 78,
      popularity: 92,
      isPublic: true,
      components: {
        cpu: "AMD Ryzen 5 7600X",
        gpu: "NVIDIA RTX 4060 Ti",
        ram: "16GB DDR5-5200",
        storage: "1TB NVMe SSD",
        motherboard: "MSI B650M Pro WiFi",
        psu: "650W 80+ Gold"
      },
      createdAt: "2024-01-05",
      updatedAt: "2024-01-05"
    }
  ];

  const handleDeleteBuild = async (buildId: string) => {
    try {
      // En una aplicación real, esto haría una llamada a la API
      toast({
        title: "Build Eliminada",
        description: "La build se ha eliminado exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la build",
        variant: "destructive",
      });
    }
  };

  const handleCopyBuild = async (buildId: string) => {
    try {
      toast({
        title: "Build Copiada",
        description: "La build se ha copiado a tus configuraciones",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar la build",
        variant: "destructive",
      });
    }
  };

  const getUseCaseIcon = (useCase: string) => {
    switch (useCase) {
      case 'gaming':
        return <Gamepad2 className="h-4 w-4" />;
      case 'work':
        return <Briefcase className="h-4 w-4" />;
      case 'creator':
        return <Video className="h-4 w-4" />;
      case 'budget':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  const getUseCaseColor = (useCase: string) => {
    switch (useCase) {
      case 'gaming':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'work':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'creator':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'budget':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredBuilds = mockBuilds.filter(build => {
    const matchesSearch = build.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         build.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUseCase = selectedUseCase === 'all' || build.useCase === selectedUseCase;
    return matchesSearch && matchesUseCase;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso no autorizado</h2>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para ver las builds
          </p>
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Builds</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus configuraciones de PC guardadas
          </p>
        </div>
        <Link href="/configurator">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Build
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar builds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedUseCase}
          onChange={(e) => setSelectedUseCase(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background text-foreground"
        >
          <option value="all">Todos los usos</option>
          <option value="gaming">Gaming</option>
          <option value="work">Trabajo</option>
          <option value="creator">Creador de Contenido</option>
          <option value="budget">Presupuesto</option>
        </select>
      </div>

      <Tabs defaultValue="my-builds" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-builds">Mis Builds ({filteredBuilds.length})</TabsTrigger>
          <TabsTrigger value="public-builds">Builds Públicas</TabsTrigger>
        </TabsList>

        <TabsContent value="my-builds" className="mt-6">
          {filteredBuilds.length === 0 ? (
            <div className="text-center py-12">
              <Cpu className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay builds</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedUseCase !== 'all' 
                  ? 'No se encontraron builds que coincidan con tu búsqueda.' 
                  : 'Aún no has creado ninguna build.'}
              </p>
              {!searchTerm && selectedUseCase === 'all' && (
                <Link href="/configurator">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primera Build
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuilds.map((build) => (
                <Card key={build.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getUseCaseIcon(build.useCase)}
                        <Badge className={getUseCaseColor(build.useCase)}>
                          {build.useCase === 'gaming' ? 'Gaming' :
                           build.useCase === 'work' ? 'Trabajo' :
                           build.useCase === 'creator' ? 'Creador' : 'Presupuesto'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{build.popularity}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{build.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{build.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">
                        ${build.totalPrice.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{build.estimatedPerformance}%</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPU:</span>
                        <span>{build.components.cpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GPU:</span>
                        <span>{build.components.gpu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RAM:</span>
                        <span>{build.components.ram}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-1 h-3 w-3" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopyBuild(build.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteBuild(build.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="public-builds" className="mt-6">
          <div className="text-center py-12">
            <Cpu className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Builds Públicas</h3>
            <p className="text-muted-foreground mb-6">
              Explora builds creadas por la comunidad
            </p>
            <Button variant="outline">
              Explorar Comunidad
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
