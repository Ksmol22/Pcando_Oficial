import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Settings, ShoppingBag, Wrench, FileText } from 'lucide-react';
import { Link } from 'wouter';

export default function UserDashboard() {
  const { user, getUserDisplayName, getRoleName } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso no autorizado</h2>
          <p className="text-muted-foreground mb-6">
            Debes iniciar sesión para acceder al dashboard
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Usuario</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido, {getUserDisplayName()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUserDisplayName()}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{getRoleName()}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {user.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuraciones</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Configuraciones guardadas
            </p>
            <Link href="/configurator">
              <Button variant="outline" size="sm" className="mt-2">
                Ver todas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Pedidos realizados
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Ver historial
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/configurator">
              <Button className="w-full justify-start" variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Nuevo Configurador
              </Button>
            </Link>
            
            <Link href="/components">
              <Button className="w-full justify-start" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Ver Componentes
              </Button>
            </Link>
            
            <Link href="/builds">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Mis Builds
              </Button>
            </Link>
            
            <Link href="/support">
              <Button className="w-full justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Contactar Soporte
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Configuración guardada</p>
                  <p className="text-xs text-muted-foreground">Gaming PC Build</p>
                </div>
                <span className="text-xs text-muted-foreground">Hace 2 días</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Componente añadido</p>
                  <p className="text-xs text-muted-foreground">RTX 4080 Super</p>
                </div>
                <span className="text-xs text-muted-foreground">Hace 5 días</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Perfil actualizado</p>
                  <p className="text-xs text-muted-foreground">Información personal</p>
                </div>
                <span className="text-xs text-muted-foreground">Hace 1 semana</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
