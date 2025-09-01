import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Cpu, Search, ShoppingCart, Menu, LogOut, Store, Building2, Settings, MessageSquare, HelpCircle } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";
import SearchIndexer from "@/components/SearchIndexer";

export default function Header() {
  const { isAuthenticated, user, logout, canAccessAdminPanel, canAccessSupportPanel, getUserDisplayName, getRoleName } = useAuth();
  const { itemCount } = useCart();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/configurator", label: "Configurador", icon: Cpu },
    { href: "/builds", label: "Builds" },
    { href: "/components", label: "Componentes" },
    { href: "/marketplace", label: "Marketplace", icon: Store },
    { href: "/company", label: "Empresa", icon: Building2 }
  ];

  // Agregar elementos de navegación específicos para roles
  const roleNavItems: Array<{href: string, label: string, icon?: any, color?: string}> = [];
  
  if (canAccessSupportPanel()) {
    roleNavItems.push(
      { href: "/support-panel", label: "Panel Soporte", icon: MessageSquare, color: "text-green-500" }
    );
  }
  
  if (canAccessAdminPanel()) {
    roleNavItems.push(
      { href: "/admin", label: "Administración", icon: Settings, color: "text-red-500" },
      { href: "/admin/users", label: "Usuarios", icon: Settings, color: "text-red-500" }
    );
  }

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
              <Cpu className="text-primary text-2xl h-8 w-8" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PC Builder Pro
              </h1>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    isActive(item.href)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Elementos de navegación específicos para roles */}
              {roleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    isActive(item.href)
                      ? `${item.color || "text-primary"} font-medium`
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <SearchIndexer>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary"
                data-testid="button-search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </SearchIndexer>

            {/* Support Button - Circular */}
            <Link href="/support">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-200"
                title="Centro de Soporte"
                data-testid="button-support"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart Button */}
            {isAuthenticated && (
              <CartDrawer>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary relative"
                  data-testid="button-cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      data-testid="badge-cart-count"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </CartDrawer>
            )}

            {/* Auth Buttons */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  <span className="font-medium">{getUserDisplayName()}</span>
                  <span className="ml-2 text-xs bg-primary/10 px-2 py-1 rounded-full">
                    {getRoleName()}
                  </span>
                </span>
                
                {user.profileImageUrl && (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                    data-testid="img-profile"
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-muted-foreground hover:text-primary"
                  data-testid="button-logout"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary"
                    data-testid="button-login"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-register"
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col space-y-4 mt-8">
                  {[...navItems, ...roleNavItems].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg transition-colors ${
                        isActive(item.href)
                          ? `${item.color || "text-primary"} font-medium`
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Authentication Options for Mobile */}
                  <div className="border-t pt-4 mt-6">
                    {isAuthenticated && user ? (
                      <div className="flex flex-col space-y-3">
                        <div className="text-sm text-muted-foreground">
                          <div className="font-medium">{getUserDisplayName()}</div>
                          <div className="text-xs bg-primary/10 px-2 py-1 rounded-full inline-block mt-1">
                            {getRoleName()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="justify-start text-muted-foreground hover:text-primary"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link href="/login">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Iniciar Sesión
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Registrarse
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
