import { Router, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Home from "./pages/home";
import Configurator from "./pages/configurator";
import Components from "./pages/components";
import Builds from "./pages/builds";
import Marketplace from "./pages/marketplace";
import Support from "./pages/support";
import Company from "./pages/company";
import Admin from "./pages/admin";
import AdminUsers from "./pages/admin-users";
import SupportPanel from "./pages/support-panel";
import Login from "./pages/login";
import Register from "./pages/register";
import HelpCenter from "./pages/help-center";
import LiveChat from "./pages/live-chat";
import Warranties from "./pages/warranties";
import Contact from "./pages/contact";
import AboutUs from "./pages/about-us";
import Careers from "./pages/careers";
import Press from "./pages/press";
import Partners from "./pages/partners";
import Header from "./components/Header";
import Footer from "./components/Footer";

function RouterComponent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine base path for GitHub Pages
  const basePath = window.location.pathname.includes('/Pcando_Oficial') ? '/Pcando_Oficial' : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Router base={basePath}>
        {/* Authentication Routes - Available to all users */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/support" component={Support} />
            <Route path="/company" component={Company} />
            <Route path="/help-center" component={HelpCenter} />
            <Route path="/live-chat" component={LiveChat} />
            <Route path="/warranties" component={Warranties} />
            <Route path="/contact" component={Contact} />
            <Route path="/about-us" component={AboutUs} />
            <Route path="/careers" component={Careers} />
            <Route path="/press" component={Press} />
            <Route path="/partners" component={Partners} />
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/configurator" component={Configurator} />
            <Route path="/components" component={Components} />
            <Route path="/builds" component={Builds} />
            <Route path="/marketplace" component={Marketplace} />
            <Route path="/support" component={Support} />
            <Route path="/company" component={Company} />
            <Route path="/admin" component={Admin} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/support-panel" component={SupportPanel} />
            <Route path="/help-center" component={HelpCenter} />
            <Route path="/live-chat" component={LiveChat} />
            <Route path="/warranties" component={Warranties} />
            <Route path="/contact" component={Contact} />
            <Route path="/about-us" component={AboutUs} />
            <Route path="/careers" component={Careers} />
            <Route path="/press" component={Press} />
            <Route path="/partners" component={Partners} />
          </>
        )}
        <Route component={NotFound} />
      </Router>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <RouterComponent />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
