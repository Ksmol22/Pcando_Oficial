import { Link } from "wouter";
import { Cpu, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Cpu className="text-primary text-xl" />
              <h3 className="text-lg font-bold">PC Builder Pro</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              La plataforma líder para armar, personalizar y comprar PCs con garantía de compatibilidad.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/configurator"
                  className="hover:text-primary transition-colors"
                  data-testid="link-configurator"
                >
                  Configurador
                </Link>
              </li>
              <li>
                <Link
                  href="/builds"
                  className="hover:text-primary transition-colors"
                  data-testid="link-builds-gaming"
                >
                  Builds Gaming
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary transition-colors"
                  data-testid="link-workstations"
                >
                  Workstations
                </a>
              </li>
              <li>
                <Link
                  href="/components"
                  className="hover:text-primary transition-colors"
                  data-testid="link-components"
                >
                  Componentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help-center" className="hover:text-primary transition-colors" data-testid="link-help">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/live-chat" className="hover:text-primary transition-colors" data-testid="link-chat">
                  Chat en Vivo
                </Link>
              </li>
              <li>
                <Link href="/warranties" className="hover:text-primary transition-colors" data-testid="link-warranty">
                  Garantías
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors" data-testid="link-contact">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about-us" className="hover:text-primary transition-colors" data-testid="link-about">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors" data-testid="link-careers">
                  Carreras
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-primary transition-colors" data-testid="link-press">
                  Prensa
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-primary transition-colors" data-testid="link-partners">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 PC Builder Pro.ss Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-terms"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-cookies"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
