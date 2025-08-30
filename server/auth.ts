import type { Express } from "express";
import { storage } from "./storage";

// Mock authentication for local development
export async function setupAuth(app: Express) {
  // En desarrollo local, crear un usuario mock
  if (process.env.NODE_ENV === "development" && !process.env.REPL_ID) {
    console.log("🔧 Usando autenticación mock para desarrollo local");
    
    // Middleware para crear un usuario mock
    app.use((req: any, res, next) => {
      if (!req.user) {
        req.user = {
          claims: {
            sub: "dev-user-123",
            email: "developer@pcando.com",
            given_name: "Developer",
            family_name: "User",
            picture: "https://via.placeholder.com/150",
          }
        };
      }
      next();
    });
    
    // Crear usuario de desarrollo en la base de datos si no existe
    try {
      let devUser = await storage.getUser("dev-user-123");
      if (!devUser) {
        devUser = await storage.upsertUser({
          email: "developer@pcando.com",
          firstName: "Developer",
          lastName: "User",
          profileImageUrl: "https://via.placeholder.com/150",
        });
        console.log("👤 Usuario de desarrollo creado:", devUser.email);
      }
    } catch (error) {
      console.warn("⚠️  No se pudo crear el usuario de desarrollo:", error);
    }
    
    return;
  }

  // Para producción con Replit, importar la autenticación real
  const replitAuth = await import("./replitAuth");
  return replitAuth.setupAuth(app);
}

export function isAuthenticated(req: any, res: any, next: any) {
  // En desarrollo local, siempre autenticado
  if (process.env.NODE_ENV === "development" && !process.env.REPL_ID) {
    return next();
  }
  
  // Para producción, usar la lógica de Replit Auth
  if (req.user) {
    return next();
  }
  
  res.status(401).json({ message: "No autenticado" });
}
