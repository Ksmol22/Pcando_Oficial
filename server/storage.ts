import {
  users,
  components,
  builds,
  buildComponents,
  suppliers,
  componentPrices,
  cartItems,
  type User,
  type UpsertUser,
  type Component,
  type Build,
  type BuildComponent,
  type Supplier,
  type ComponentPrice,
  type CartItem,
  type InsertComponent,
  type InsertBuild,
  type InsertBuildComponent,
  type InsertCartItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Component operations
  getComponents(): Promise<Component[]>;
  getComponentsByType(type: string): Promise<Component[]>;
  getComponent(id: string): Promise<Component | undefined>;
  createComponent(component: InsertComponent): Promise<Component>;
  
  // Build operations
  getBuilds(userId?: string): Promise<Build[]>;
  getBuild(id: string): Promise<Build | undefined>;
  createBuild(build: InsertBuild): Promise<Build>;
  updateBuild(id: string, build: Partial<InsertBuild>): Promise<Build>;
  deleteBuild(id: string): Promise<void>;
  
  // Build component operations
  getBuildComponents(buildId: string): Promise<(BuildComponent & { component: Component })[]>;
  addComponentToBuild(buildComponent: InsertBuildComponent): Promise<BuildComponent>;
  removeComponentFromBuild(buildId: string, componentId: string): Promise<void>;
  
  // Supplier and pricing operations
  getSuppliers(): Promise<Supplier[]>;
  getComponentPrices(componentId: string): Promise<(ComponentPrice & { supplier: Supplier })[]>;
  
  // Cart operations
  getCartItems(userId: string): Promise<(CartItem & { component: Component })[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Component operations
  async getComponents(): Promise<Component[]> {
    return await db.select().from(components).where(eq(components.isActive, true));
  }

  async getComponentsByType(type: string): Promise<Component[]> {
    return await db
      .select()
      .from(components)
      .where(and(eq(components.type, type as any), eq(components.isActive, true)));
  }

  async getComponent(id: string): Promise<Component | undefined> {
    const [component] = await db.select().from(components).where(eq(components.id, id));
    return component;
  }

  async createComponent(component: InsertComponent): Promise<Component> {
    const [newComponent] = await db.insert(components).values(component).returning();
    return newComponent;
  }

  // Build operations
  async getBuilds(userId?: string): Promise<Build[]> {
    if (userId) {
      return await db
        .select()
        .from(builds)
        .where(eq(builds.userId, userId))
        .orderBy(desc(builds.updatedAt));
    }
    return await db
      .select()
      .from(builds)
      .where(eq(builds.isPublic, true))
      .orderBy(desc(builds.updatedAt));
  }

  async getBuild(id: string): Promise<Build | undefined> {
    const [build] = await db.select().from(builds).where(eq(builds.id, id));
    return build;
  }

  async createBuild(build: InsertBuild): Promise<Build> {
    const [newBuild] = await db.insert(builds).values(build).returning();
    return newBuild;
  }

  async updateBuild(id: string, build: Partial<InsertBuild>): Promise<Build> {
    const [updatedBuild] = await db
      .update(builds)
      .set({ ...build, updatedAt: new Date() })
      .where(eq(builds.id, id))
      .returning();
    return updatedBuild;
  }

  async deleteBuild(id: string): Promise<void> {
    await db.delete(buildComponents).where(eq(buildComponents.buildId, id));
    await db.delete(builds).where(eq(builds.id, id));
  }

  // Build component operations
  async getBuildComponents(buildId: string): Promise<{ build_components: BuildComponent; components: Component }[]> {
    return await db
      .select()
      .from(buildComponents)
      .innerJoin(components, eq(buildComponents.componentId, components.id))
      .where(eq(buildComponents.buildId, buildId));
  }

  async addComponentToBuild(buildComponent: InsertBuildComponent): Promise<BuildComponent> {
    // Remove existing component of same type first
    const component = await this.getComponent(buildComponent.componentId);
    if (component) {
      const existingComponents = await db
        .select()
        .from(buildComponents)
        .innerJoin(components, eq(buildComponents.componentId, components.id))
        .where(
          and(
            eq(buildComponents.buildId, buildComponent.buildId),
            eq(components.type, component.type)
          )
        );
      
      if (existingComponents.length > 0) {
        await db
          .delete(buildComponents)
          .where(
            inArray(
              buildComponents.id,
              existingComponents.map(ec => ec.build_components.id)
            )
          );
      }
    }

    const [newBuildComponent] = await db
      .insert(buildComponents)
      .values(buildComponent)
      .returning();
    return newBuildComponent;
  }

  async removeComponentFromBuild(buildId: string, componentId: string): Promise<void> {
    await db
      .delete(buildComponents)
      .where(
        and(
          eq(buildComponents.buildId, buildId),
          eq(buildComponents.componentId, componentId)
        )
      );
  }

  // Supplier and pricing operations
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).where(eq(suppliers.isActive, true));
  }

  async getComponentPrices(componentId: string): Promise<{ component_prices: ComponentPrice; suppliers: Supplier }[]> {
    return await db
      .select()
      .from(componentPrices)
      .innerJoin(suppliers, eq(componentPrices.supplierId, suppliers.id))
      .where(eq(componentPrices.componentId, componentId))
      .orderBy(componentPrices.price);
  }

  // Cart operations
  async getCartItems(userId: string): Promise<{ cart_items: CartItem; components: Component }[]> {
    return await db
      .select()
      .from(cartItems)
      .innerJoin(components, eq(cartItems.componentId, components.id))
      .where(eq(cartItems.userId, userId));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.componentId, cartItem.componentId)
        )
      );

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: (existingItem.quantity || 1) + (cartItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    const [newCartItem] = await db.insert(cartItems).values(cartItem).returning();
    return newCartItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }
}

export const storage = new DatabaseStorage();
