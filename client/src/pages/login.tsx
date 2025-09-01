import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validaciones básicas
      if (!formData.email || !formData.password) {
        setError("Por favor, completa todos los campos");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Por favor, ingresa un email válido");
        return;
      }

      // Simulación de login (en una app real aquí harías la petición al backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo: cualquier email/password funciona para el demo
      if (formData.email && formData.password.length >= 6) {
        // Guardar token en localStorage (simulado)
        localStorage.setItem('auth_token', 'demo-token-' + Date.now());
        localStorage.setItem('user_data', JSON.stringify({
          id: 'demo-user',
          email: formData.email,
          firstName: formData.email.split('@')[0],
          lastName: 'Usuario',
        }));

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });

        // Redirigir al dashboard
        setLocation("/home");
      } else {
        setError("La contraseña debe tener al menos 6 caracteres");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@pcando.com",
      password: "demo123"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-2">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Accede a tu cuenta de PCando Oficial
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                O prueba el demo
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              <User className="w-4 h-4 mr-2" />
              Llenar datos demo
            </Button>
          </div>

          <div className="text-center space-y-2">
            <Link href="/forgot-password">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                ¿Olvidaste tu contraseña?
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register">
                <Button variant="link" className="p-0 h-auto text-primary hover:underline">
                  Regístrate aquí
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
