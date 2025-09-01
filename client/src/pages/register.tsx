import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Cpu, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validaciones
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Por favor, completa todos los campos");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Por favor, ingresa un email válido");
        return;
      }

      if (!passwordValidation.isValid) {
        setError("La contraseña debe cumplir con todos los requisitos de seguridad");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      if (!formData.agreeTerms) {
        setError("Debes aceptar los términos y condiciones");
        return;
      }

      // Simulación de registro
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular respuesta exitosa
      const userData = {
        id: 'new-user-' + Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      // Guardar datos de usuario
      localStorage.setItem('auth_token', 'demo-token-' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(userData));

      toast({
        title: "¡Registro exitoso! 🎉",
        description: `Bienvenido ${formData.firstName}! Tu cuenta ha sido creada.`,
      });

      // Redirigir al home
      setLocation("/home");

    } catch (error) {
      setError("Error al crear la cuenta. Por favor, inténtalo de nuevo.");
      console.error("Error en registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRegister = () => {
    setFormData({
      firstName: "Juan",
      lastName: "García",
      email: "juan@ejemplo.com",
      password: "MiPassword123!",
      confirmPassword: "MiPassword123!",
      agreeTerms: true,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl border-2">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Cpu className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Únete a la comunidad PCando y arma tu PC ideal
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Nombre
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Juan"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="García"
                  disabled={isLoading}
                />
              </div>
            </div>

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
              
              {/* Indicadores de validación de contraseña */}
              {formData.password && (
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg text-sm">
                  <div className="font-medium text-muted-foreground">Requisitos de contraseña:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`} />
                      <span className="text-xs">8+ caracteres</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-muted-foreground'}`} />
                      <span className="text-xs">Mayúsculas</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-muted-foreground'}`} />
                      <span className="text-xs">Minúsculas</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <CheckCircle className={`h-3 w-3 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-muted-foreground'}`} />
                      <span className="text-xs">Números</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500">Las contraseñas no coinciden</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleChange({ 
                  target: { name: 'agreeTerms', type: 'checkbox', checked } 
                } as any)}
                disabled={isLoading}
              />
              <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
                Acepto los{" "}
                <Link href="/terms">
                  <Button variant="link" className="p-0 h-auto text-primary hover:underline text-sm">
                    términos y condiciones
                  </Button>
                </Link>
                {" "}y la{" "}
                <Link href="/privacy">
                  <Button variant="link" className="p-0 h-auto text-primary hover:underline text-sm">
                    política de privacidad
                  </Button>
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !passwordValidation.isValid || formData.password !== formData.confirmPassword || !formData.agreeTerms}
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
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
              onClick={handleDemoRegister}
              disabled={isLoading}
            >
              <User className="w-4 h-4 mr-2" />
              Llenar datos demo
            </Button>
          </div>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto text-primary hover:underline">
                  Inicia sesión aquí
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
