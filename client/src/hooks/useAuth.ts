import { useState, useEffect } from "react";
import type { User } from "@shared/schema";

export type UserRole = 'customer' | 'support' | 'admin';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    const initAuth = () => {
      setIsClientSide(true);
      
      // Verificar si hay token y datos del usuario en localStorage
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        // Si hay error al parsear, limpiar localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        console.error('Error parsing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Pequeño delay para evitar problemas de hydration
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      let mockUser: User;

      // Diferentes usuarios con diferentes roles para demo
      if (email === "admin@pcando.com" && password === "admin123") {
        mockUser = {
          id: 1,
          email: "admin@pcando.com",
          firstName: "Administrador",
          lastName: "Principal",
          role: "admin",
          profileImageUrl: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email === "support@pcando.com" && password === "support123") {
        mockUser = {
          id: 2,
          email: "support@pcando.com",
          firstName: "Soporte",
          lastName: "Técnico",
          role: "support",
          profileImageUrl: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email === "demo@pcando.com" && password === "demo123") {
        mockUser = {
          id: 3,
          email: "demo@pcando.com",
          firstName: "Cliente",
          lastName: "Demo",
          role: "customer",
          profileImageUrl: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        return { success: false, message: 'Credenciales inválidas' };
      }

      // Guardar en localStorage
      localStorage.setItem('auth_token', 'demo_token_123');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setUser(mockUser);
      return { success: true, message: 'Inicio de sesión exitoso' };
    } catch (error) {
      return { success: false, message: 'Error al iniciar sesión' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simulación de registro para demo - por defecto cliente
      const mockUser: User = {
        id: Date.now(),
        email,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        role: 'customer',
        profileImageUrl: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar en localStorage
      localStorage.setItem('auth_token', 'demo_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      
      setUser(mockUser);
      return { success: true, message: 'Registro exitoso' };
    } catch (error) {
      return { success: false, message: 'Error al registrar usuario' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user_data', JSON.stringify(newUser));
    }
  };

  const isAuthenticated = !!user && isClientSide;

  // Funciones de utilidad para roles
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isSupport = (): boolean => {
    return hasRole('support') || hasRole('admin'); // Admin puede hacer funciones de soporte
  };

  const isClientRole = (): boolean => {
    return hasRole('customer');
  };

  const canAccessAdminPanel = (): boolean => {
    return hasRole('admin');
  };

  const canAccessSupportPanel = (): boolean => {
    return hasRole('support') || hasRole('admin');
  };

  const getUserDisplayName = (): string => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.email || 'Usuario';
  };

  const getRoleName = (): string => {
    if (!user) return '';
    switch (user.role) {
      case 'admin':
        return 'Administrador';
      case 'support':
        return 'Soporte';
      case 'customer':
        return 'Cliente';
      default:
        return 'Usuario';
    }
  };

  return {
    user,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated,
    isLoading,
    // Funciones de roles
    hasRole,
    isAdmin,
    isSupport,
    isClient: isClientRole,
    canAccessAdminPanel,
    canAccessSupportPanel,
    getUserDisplayName,
    getRoleName
  };
}
