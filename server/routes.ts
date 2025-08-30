import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { 
  insertComponentSchema,
  insertBuildSchema,
  insertBuildComponentSchema,
  insertCartItemSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Component routes
  app.get('/api/components', async (req, res) => {
    try {
      const { type } = req.query;
      let components;
      
      if (type && typeof type === 'string') {
        components = await storage.getComponentsByType(type);
      } else {
        components = await storage.getComponents();
      }
      
      res.json(components);
    } catch (error) {
      console.error("Error fetching components:", error);
      res.status(500).json({ message: "Failed to fetch components" });
    }
  });

  app.get('/api/components/:id', async (req, res) => {
    try {
      const component = await storage.getComponent(req.params.id);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      res.json(component);
    } catch (error) {
      console.error("Error fetching component:", error);
      res.status(500).json({ message: "Failed to fetch component" });
    }
  });

  app.post('/api/components', isAuthenticated, async (req, res) => {
    try {
      const validatedComponent = insertComponentSchema.parse(req.body);
      const component = await storage.createComponent(validatedComponent);
      res.status(201).json(component);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid component data", errors: error.errors });
      }
      console.error("Error creating component:", error);
      res.status(500).json({ message: "Failed to create component" });
    }
  });

  // Component pricing routes
  app.get('/api/components/:id/prices', async (req, res) => {
    try {
      const prices = await storage.getComponentPrices(req.params.id);
      res.json(prices);
    } catch (error) {
      console.error("Error fetching component prices:", error);
      res.status(500).json({ message: "Failed to fetch component prices" });
    }
  });

  // Build routes
  app.get('/api/builds', async (req, res) => {
    try {
      const { userId } = req.query;
      const builds = await storage.getBuilds(userId as string);
      res.json(builds);
    } catch (error) {
      console.error("Error fetching builds:", error);
      res.status(500).json({ message: "Failed to fetch builds" });
    }
  });

  app.get('/api/builds/:id', async (req, res) => {
    try {
      const build = await storage.getBuild(req.params.id);
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      const components = await storage.getBuildComponents(req.params.id);
      res.json({ ...build, components });
    } catch (error) {
      console.error("Error fetching build:", error);
      res.status(500).json({ message: "Failed to fetch build" });
    }
  });

  app.post('/api/builds', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedBuild = insertBuildSchema.parse({ ...req.body, userId });
      const build = await storage.createBuild(validatedBuild);
      res.status(201).json(build);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid build data", errors: error.errors });
      }
      console.error("Error creating build:", error);
      res.status(500).json({ message: "Failed to create build" });
    }
  });

  app.put('/api/builds/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const build = await storage.getBuild(req.params.id);
      
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      if (build.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to modify this build" });
      }

      const validatedBuild = insertBuildSchema.partial().parse(req.body);
      const updatedBuild = await storage.updateBuild(req.params.id, validatedBuild);
      res.json(updatedBuild);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid build data", errors: error.errors });
      }
      console.error("Error updating build:", error);
      res.status(500).json({ message: "Failed to update build" });
    }
  });

  app.delete('/api/builds/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const build = await storage.getBuild(req.params.id);
      
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      if (build.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to delete this build" });
      }

      await storage.deleteBuild(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting build:", error);
      res.status(500).json({ message: "Failed to delete build" });
    }
  });

  // Build component routes
  app.post('/api/builds/:buildId/components', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const build = await storage.getBuild(req.params.buildId);
      
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      if (build.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to modify this build" });
      }

      const validatedBuildComponent = insertBuildComponentSchema.parse({
        ...req.body,
        buildId: req.params.buildId
      });
      
      const buildComponent = await storage.addComponentToBuild(validatedBuildComponent);
      res.status(201).json(buildComponent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid build component data", errors: error.errors });
      }
      console.error("Error adding component to build:", error);
      res.status(500).json({ message: "Failed to add component to build" });
    }
  });

  app.delete('/api/builds/:buildId/components/:componentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const build = await storage.getBuild(req.params.buildId);
      
      if (!build) {
        return res.status(404).json({ message: "Build not found" });
      }
      
      if (build.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized to modify this build" });
      }

      await storage.removeComponentFromBuild(req.params.buildId, req.params.componentId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing component from build:", error);
      res.status(500).json({ message: "Failed to remove component from build" });
    }
  });

  // Cart routes
  app.get('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedCartItem = insertCartItemSchema.parse({ ...req.body, userId });
      const cartItem = await storage.addToCart(validatedCartItem);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItemQuantity(req.params.id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Supplier routes
  app.get('/api/suppliers', async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
