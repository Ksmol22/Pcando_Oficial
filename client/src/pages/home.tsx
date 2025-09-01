import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Cpu, 
  Monitor, 
  HardDrive, 
  Gamepad2, 
  Video,
  Briefcase,
  Eye,
  Edit,
  Trash2,
  TrendingUp
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user, isAuthenticated, isLoading, canAccessAdminPanel, canAccessSupportPanel, getUserDisplayName, getRoleName } = useAuth();
  const { toast } = useToast();

  const { data: userBuilds = [], isLoading: buildsLoading, error: buildsError } = useQuery({
    queryKey: ["/api/builds"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: featuredBuilds = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/builds", "featured"],
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (buildsError && isUnauthorizedError(buildsError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [buildsError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getUseCaseIcon = (useCase: string) => {
    switch (useCase) {
      case 'gaming': return <Gamepad2 className="h-5 w-5 text-primary" />;
      case 'workstation': return <Video className="h-5 w-5 text-secondary" />;
      case 'office': return <Briefcase className="h-5 w-5 text-green-400" />;
      default: return <Cpu className="h-5 w-5 text-muted-foreground" />;
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              ¡Bienvenido, {getUserDisplayName()}!
            </h1>
            <p className="text-lg text-muted-foreground">
              {canAccessAdminPanel() ? 'Administra la plataforma y gestiona configuraciones' :
               canAccessSupportPanel() ? 'Brinda soporte y gestiona tickets de usuarios' :
               'Gestiona tus configuraciones y descubre nuevas builds para tu próximo proyecto'}
            </p>
          </div>
          <Badge variant={canAccessAdminPanel() ? 'destructive' : canAccessSupportPanel() ? 'secondary' : 'default'} 
                 className={`px-3 py-1 ${canAccessSupportPanel() && !canAccessAdminPanel() ? 'bg-green-100 text-green-800' : ''}`}>
            {getRoleName()}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Admin Panel Access */}
        {canAccessAdminPanel() && (
          <Link href="/admin">
            <Card className="hover:border-red-500 transition-colors cursor-pointer group border-red-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-red-500/20 transition-colors">
                  <Monitor className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-semibold mb-1">Panel Admin</h3>
                <p className="text-sm text-muted-foreground">Administrar sistema</p>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Support Panel Access */}
        {canAccessSupportPanel() && (
          <Link href="/support-panel">
            <Card className="hover:border-green-500 transition-colors cursor-pointer group border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/20 transition-colors">
                  <HardDrive className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-1">Panel Soporte</h3>
                <p className="text-sm text-muted-foreground">Gestionar tickets</p>
              </CardContent>
            </Card>
          </Link>
        )}

        <Link href="/configurator">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Nueva Build</h3>
              <p className="text-sm text-muted-foreground">Crear configuración personalizada</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/components">
          <Card className="hover:border-secondary transition-colors cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/20 transition-colors">
                <Monitor className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-1">Explorar Componentes</h3>
              <p className="text-sm text-muted-foreground">Ver catálogo completo</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/builds">
          <Card className="hover:border-green-400 transition-colors cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-400/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-400/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-1">Builds Populares</h3>
              <p className="text-sm text-muted-foreground">Configuraciones trending</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User's Builds */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Mis Builds</h2>
            <Link href="/configurator">
              <Button size="sm" data-testid="button-new-build">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Build
              </Button>
            </Link>
          </div>

          {buildsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-3" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : userBuilds.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HardDrive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No tienes builds aún</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu primera configuración de PC personalizada
                </p>
                <Link href="/configurator">
                  <Button data-testid="button-create-first-build">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Build
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userBuilds.slice(0, 5).map((build: any) => (
                <Card key={build.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getUseCaseIcon(build.useCase)}
                        <div>
                          <h3 className="font-semibold" data-testid={`text-build-name-${build.id}`}>
                            {build.name}
                          </h3>
                          {build.description && (
                            <p className="text-sm text-muted-foreground">
                              {build.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-view-${build.id}`}
                        >
                          <Eye className="h-4 w-4" />
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
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-delete-${build.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
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
                  </CardContent>
                </Card>
              ))}
              
              {userBuilds.length > 5 && (
                <div className="text-center">
                  <Link href="/builds">
                    <Button variant="outline" data-testid="button-view-all-builds">
                      Ver todas las builds
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured/Popular Builds */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Builds Populares</h2>
          
          {featuredLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-3" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {featuredBuilds.slice(0, 5).map((build: any) => (
                <Card key={build.id} className="hover:border-secondary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getUseCaseIcon(build.useCase)}
                        <div>
                          <h3 className="font-semibold" data-testid={`text-featured-name-${build.id}`}>
                            {build.name}
                          </h3>
                          {build.description && (
                            <p className="text-sm text-muted-foreground">
                              {build.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-view-featured-${build.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {build.useCase && (
                          <Badge 
                            variant="outline" 
                            className={getUseCaseColor(build.useCase)}
                            data-testid={`badge-featured-usecase-${build.id}`}
                          >
                            {build.useCase}
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-400/20">
                          Popular
                        </Badge>
                      </div>
                      {build.totalPrice && (
                        <span className="font-bold text-primary" data-testid={`text-featured-price-${build.id}`}>
                          ${parseFloat(build.totalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="text-center">
                <Link href="/builds">
                  <Button variant="outline" data-testid="button-explore-builds">
                    Explorar más builds
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
