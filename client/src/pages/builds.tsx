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
    enabled: isAuthenticated && activeTab === 'explore',
    retry: false,
  });

  const deleteBuildMutation = useMutation({
    mutationFn: async (buildId: string) => {
      await apiRequest("DELETE", `/api/builds/${buildId}`);
    },
    onSuccess: () => {
      toast({
        title: "Build Eliminada",
        description: "La build se ha eliminado exitosamente",
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
        description: "No se pudo eliminar la build",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const error = activeTab === 'my-builds' ? userBuildsError : publicBuildsError;
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [userBuildsError, publicBuildsError, activeTab, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getUseCaseIcon = (useCase: string) => {
    switch (useCase) {
      case 'gaming': return <Gamepad2 className="h-4 w-4 text-primary" />;
      case 'workstation': return <Video className="h-4 w-4 text-secondary" />;
      case 'office': return <Briefcase className="h-4 w-4 text-green-400" />;
      default: return <Cpu className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getUseCaseColor = (useCase: string) => {
    switch (useCase) {
      case 'gaming': return 'bg-primary/10 text-primary border-primary/20';
      case 'workstation': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'office': return 'bg-green-400/10 text-green-400 border-green-400/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const currentBuilds = activeTab === 'my-builds' ? userBuilds : publicBuilds;
  const isLoadingBuilds = activeTab === 'my-builds' ? userBuildsLoading : publicBuildsLoading;

  const filteredBuilds = currentBuilds
    .filter((build: any) => {
      if (searchQuery && !build.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (useCaseFilter !== 'all' && build.useCase !== useCaseFilter) {
        return false;
      }
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return parseFloat(a.totalPrice || '0') - parseFloat(b.totalPrice || '0');
        case 'price-desc':
          return parseFloat(b.totalPrice || '0') - parseFloat(a.totalPrice || '0');
        default:
          return 0;
      }
    });

  const handleDeleteBuild = (buildId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta build?')) {
      deleteBuildMutation.mutate(buildId);
    }
  };

  const handleCopyBuild = (build: any) => {
    // This would copy the build configuration
    toast({
      title: "Build Copiada",
      description: "La configuración se ha copiado a tu colección",
    });
  };

  const handleShareBuild = (build: any) => {
    // This would share the build
    if (navigator.share) {
      navigator.share({
        title: build.name,
        text: build.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "El enlace de la build se ha copiado al portapapeles",
      });
    }
  };

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
              <SelectItem value="created">Más antiguos</SelectItem>
              <SelectItem value="name">Nombre A-Z</SelectItem>
              <SelectItem value="price">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center text-sm text-muted-foreground">
            {filteredBuilds.length} builds encontradas
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-builds" data-testid="tab-my-builds">
            Mis Builds
          </TabsTrigger>
          <TabsTrigger value="explore" data-testid="tab-explore">
            Explorar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-builds" className="space-y-6">
          {isLoadingBuilds ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-3" />
                    <Skeleton className="h-3 w-1/2 mb-4" />
                    <div className="flex space-x-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBuilds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Cpu className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? 'No se encontraron builds' : 'No tienes builds aún'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Crea tu primera configuración de PC personalizada'
                  }
                </p>
                <Link href="/configurator">
                  <Button data-testid="button-create-first-build">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primera Build
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuilds.map((build: any) => (
                <Card key={build.id} className="hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getUseCaseIcon(build.useCase)}
                        <CardTitle className="text-lg" data-testid={`text-build-name-${build.id}`}>
                          {build.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareBuild(build)}
                          data-testid={`button-share-${build.id}`}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-edit-${build.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBuild(build.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={deleteBuildMutation.isPending}
                          data-testid={`button-delete-${build.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {build.description && (
                      <p className="text-sm text-muted-foreground">
                        {build.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {build.useCase && (
                          <Badge 
                            variant="outline" 
                            className={getUseCaseColor(build.useCase)}
                            data-testid={`badge-usecase-${build.id}`}
                          >
                            {build.useCase}
                          </Badge>
                        )}
                        {build.isPublic && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/20">
                            Público
                          </Badge>
                        )}
                      </div>
                      {build.totalPrice && (
                        <span className="font-bold text-primary" data-testid={`text-price-${build.id}`}>
                          ${parseFloat(build.totalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        data-testid={`button-view-${build.id}`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        data-testid={`button-configure-${build.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Configurar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="explore" className="space-y-6">
          {isLoadingBuilds ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-3" />
                    <Skeleton className="h-3 w-1/2 mb-4" />
                    <div className="flex space-x-2 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBuilds.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron builds</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar los filtros para encontrar builds públicas
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuilds.map((build: any) => (
                <Card key={build.id} className="hover:border-secondary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getUseCaseIcon(build.useCase)}
                        <CardTitle className="text-lg" data-testid={`text-public-build-name-${build.id}`}>
                          {build.name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-favorite-${build.id}`}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareBuild(build)}
                          data-testid={`button-share-public-${build.id}`}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {build.description && (
                      <p className="text-sm text-muted-foreground">
                        {build.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {build.useCase && (
                          <Badge 
                            variant="outline" 
                            className={getUseCaseColor(build.useCase)}
                            data-testid={`badge-public-usecase-${build.id}`}
                          >
                            {build.useCase}
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-400/20">
                          <Star className="mr-1 h-3 w-3" />
                          Popular
                        </Badge>
                      </div>
                      {build.totalPrice && (
                        <span className="font-bold text-primary" data-testid={`text-public-price-${build.id}`}>
                          ${parseFloat(build.totalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        data-testid={`button-view-public-${build.id}`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCopyBuild(build)}
                        data-testid={`button-copy-${build.id}`}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
