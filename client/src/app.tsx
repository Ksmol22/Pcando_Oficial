import { Router, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { CartProvider } from "./hooks/useCart";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Home from "./pages/home";
import Configurator from "./pages/configurator";
import Components from "./pages/components";
import Builds from "./pages/builds";
import UserDashboard from "./pages/user-dashboard";
import Marketplace from "./pages/marketplace";
import Support from "./pages/support";
import Company from "./pages/company";
import Admin from "./pages/admin";
import AdminUsers from "./pages/admin-users";
import SupportPanel from "./pages/support-panel";
import Login from "./pages/login";
import Register from "./pages/register";
import HelpCenter from "./pages/help-center";
import LiveChatPage from "./pages/live-chat";
import LiveChat from "./components/LiveChat";
import Warranties from "./pages/warranties";
import Contact from "./pages/contact";
import AboutUs from "./pages/about-us";
import Careers from "./pages/careers";
import Press from "./pages/press";
import Partners from "./pages/partners";
import Header from "./components/Header";
import Footer from "./components/Footer";

function RouterComponent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [chatMinimized, setChatMinimized] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <div className="ml-4 text-foreground">Cargando aplicación...</div>
      </div>
    );
  }

  // Determine base path for GitHub Pages
  const basePath = window.location.hostname.includes('github.io') ? '/Pcando_Oficial' : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Router base={basePath}>
        {/* Home route - conditional rendering */}
        <Route path="/" component={isAuthenticated ? Home : Landing} />
        
        {/* Always available authentication routes */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Protected authenticated routes */}
        <Route path="/configurator" component={Configurator} />
        <Route path="/components" component={Components} />
        <Route path="/builds" component={Builds} />
        <Route path="/dashboard" component={UserDashboard} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/support-panel" component={SupportPanel} />
        
        {/* Public/Mixed access routes */}
        <Route path="/support" component={Support} />
        <Route path="/company" component={Company} />
        <Route path="/help-center" component={HelpCenter} />
        <Route path="/live-chat" component={LiveChatPage} />
        <Route path="/warranties" component={Warranties} />
        <Route path="/contact" component={Contact} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/careers" component={Careers} />
        <Route path="/press" component={Press} />
        <Route path="/partners" component={Partners} />
        
        {/* Catch all route for unmatched paths */}
        <Route path="*" component={NotFound} />
      </Router>
      <Footer />
      
      {/* Live Chat - Available for all authenticated users */}
      {isAuthenticated && chatVisible && (
        <LiveChat
          isMinimized={chatMinimized}
          onMinimize={() => setChatMinimized(true)}
          onMaximize={() => setChatMinimized(false)}
          onClose={() => setChatVisible(false)}
          userId={user?.id.toString()}
          userRole={user?.role || 'customer'}
        />
      )}
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
