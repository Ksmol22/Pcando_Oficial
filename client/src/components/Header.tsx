import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Cpu, Search, ShoppingCart, Menu, LogOut } from "lucide-react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  const navItems = [
    { href: "/configurator", label: "Configurador", icon: Cpu },
    { href: "/builds", label: "Builds" },
    { href: "/components", label: "Componentes" },
  ];

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
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl && (
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
                  onClick={() => window.location.href = "/api/logout"}
                  className="text-muted-foreground hover:text-primary"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-login"
              >
                Iniciar Sesión
              </Button>
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
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg transition-colors ${
                        isActive(item.href)
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      data-testid={`link-mobile-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
