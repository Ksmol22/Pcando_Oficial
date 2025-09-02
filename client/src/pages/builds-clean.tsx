import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useBuilds } from "@/hooks/useData";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Search, 
  Filter,
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

export default function Builds() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [useCaseFilter, setUseCaseFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [activeTab, setActiveTab] = useState('my-builds');

  // Use our local data hooks
  const { builds: userBuilds, isLoading: userBuildsLoading, deleteBuild, updateBuild } = useBuilds(user?.id);
  const { builds: allBuilds, isLoading: publicBuildsLoading } = useBuilds(); // Get all builds for public tab

  // Filter builds for public tab (you could add a public flag to builds)
  const publicBuilds = allBuilds.filter(build => build.userId !== user?.id);

  const handleDeleteBuild = async (buildId: string) => {
    try {
      await deleteBuild(buildId);
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

  const handleShareBuild = async (build: any) => {
    const shareData = {
      title: `${build.name} - PCando`,
      text: `Mira esta configuración de PC: ${build.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Build Compartida",
          description: "La build se ha compartido exitosamente",
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "El enlace de la build se ha copiado al portapapeles",
      });
    }
  };

  if (userBuildsLoading || publicBuildsLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredBuilds = (activeTab === 'my-builds' ? userBuilds : publicBuilds)
    .filter(build => {
      const matchesSearch = build.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           build.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUseCase = useCaseFilter === 'all' || build.category === useCaseFilter;
      return matchesSearch && matchesUseCase;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.totalPrice || 0) - (b.totalPrice || 0);
        case 'price-high':
          return (b.totalPrice || 0) - (a.totalPrice || 0);
        case 'performance':
          return (b.performanceScore || 0) - (a.performanceScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
        default:
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Builds de PC
            </h1>
            <p className="text-lg text-muted-foreground">
              Explora y gestiona configuraciones de PC optimizadas
            </p>
          </div>
          <Link href="/configurator">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-new-build">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Build
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar builds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-builds"
            />
          </div>
          
          <Select value={useCaseFilter} onValueChange={setUseCaseFilter}>
            <SelectTrigger data-testid="select-use-case-filter">
              <SelectValue placeholder="Filtrar por uso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usos</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="workstation">Workstation</SelectItem>
              <SelectItem value="office">Oficina</SelectItem>
              <SelectItem value="streaming">Streaming</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger data-testid="select-sort-builds">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Más recientes</SelectItem>
              <SelectItem value="name">Nombre A-Z</SelectItem>
              <SelectItem value="price-low">Precio menor</SelectItem>
              <SelectItem value="price-high">Precio mayor</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="default">
            <Filter className="mr-2 h-4 w-4" />
            Más filtros
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-builds" data-testid="tab-my-builds">
            Mis Builds ({userBuilds.length})
          </TabsTrigger>
          <TabsTrigger value="explore" data-testid="tab-explore-builds">
            Explorar ({publicBuilds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-builds" className="space-y-6">
          {userBuildsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBuilds.length === 0 ? (
            <div className="text-center py-12">
              <Cpu className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || useCaseFilter !== 'all' 
                  ? 'No se encontraron builds' 
                  : 'No tienes builds guardados'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || useCaseFilter !== 'all' 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Crea tu primera configuración de PC personalizada'}
              </p>
              <Link href="/configurator">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Nueva Build
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuilds.map((build) => (
                <Card key={build.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold line-clamp-1">
                          {build.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {build.category}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            {build.performanceScore || 0}/100
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {build.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Componentes:</span>
                        <span className="font-medium">{build.components?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Precio total:</span>
                        <span className="font-semibold text-lg">
                          ${(build.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShareBuild(build)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteBuild(build.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="explore" className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Explora Builds Populares</h3>
            <p className="text-muted-foreground mb-6">
              Descubre configuraciones creadas por la comunidad
            </p>
            <Badge variant="outline">Próximamente</Badge>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
