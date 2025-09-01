import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  primaryKey,
  unique,
  pgEnum,
} from 'drizzle-orm/pg-core';

// User roles - Definir antes de usarlo
export const userRoleEnum = pgEnum('user_role', [
  'client',   // Usuario cliente regular
  'support',  // Agente de soporte
  'admin'     // Administrador
]);

// Component categories
export const componentTypeEnum = pgEnum('component_type', [
  'cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case', 'cooler', 'peripheral'
]);

import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    expireIndex: index("IDX_session_expire").on(table.expire)
  }),
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('client'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Component categories
export const componentTypeEnum = pgEnum('component_type', [
  'cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case', 'cooler', 'peripheral'
]);

// User roles
export const userRoleEnum = pgEnum('user_role', [
  'client', 'support', 'admin'
]);

// Components table
export const components = pgTable("components", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: componentTypeEnum("type").notNull(),
  brand: varchar("brand").notNull(),
  model: varchar("model").notNull(),
  imageUrl: varchar("image_url"),
  specifications: jsonb("specifications").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// PC Builds table
export const builds = pgTable("builds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  isTemplate: boolean("is_template").default(false),
  useCase: varchar("use_case"), // gaming, workstation, office
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Build components junction table
export const buildComponents = pgTable("build_components", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildId: varchar("build_id").references(() => builds.id).notNull(),
  componentId: varchar("component_id").references(() => components.id).notNull(),
  quantity: integer("quantity").default(1),
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }),
});

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  website: varchar("website"),
  logoUrl: varchar("logo_url"),
  shippingInfo: text("shipping_info"),
  isActive: boolean("is_active").default(true),
});

// Component prices from different suppliers
export const componentPrices = pgTable("component_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  componentId: varchar("component_id").references(() => components.id).notNull(),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default('0'),
  shippingDays: integer("shipping_days").default(3),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Shopping cart
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  componentId: varchar("component_id").references(() => components.id).notNull(),
  quantity: integer("quantity").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  builds: many(builds),
  cartItems: many(cartItems),
}));

export const buildsRelations = relations(builds, ({ one, many }) => ({
  user: one(users, {
    fields: [builds.userId],
    references: [users.id],
  }),
  components: many(buildComponents),
}));

export const componentsRelations = relations(components, ({ many }) => ({
  buildComponents: many(buildComponents),
  prices: many(componentPrices),
  cartItems: many(cartItems),
}));

export const buildComponentsRelations = relations(buildComponents, ({ one }) => ({
  build: one(builds, {
    fields: [buildComponents.buildId],
    references: [builds.id],
  }),
  component: one(components, {
    fields: [buildComponents.componentId],
    references: [components.id],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  componentPrices: many(componentPrices),
}));

export const componentPricesRelations = relations(componentPrices, ({ one }) => ({
  component: one(components, {
    fields: [componentPrices.componentId],
    references: [components.id],
  }),
  supplier: one(suppliers, {
    fields: [componentPrices.supplierId],
    references: [suppliers.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  component: one(components, {
    fields: [cartItems.componentId],
    references: [components.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertComponentSchema = createInsertSchema(components).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuildSchema = createInsertSchema(builds).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuildComponentSchema = createInsertSchema(buildComponents).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Component = typeof components.$inferSelect;
export type Build = typeof builds.$inferSelect;
export type BuildComponent = typeof buildComponents.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type ComponentPrice = typeof componentPrices.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type InsertBuild = z.infer<typeof insertBuildSchema>;
export type InsertBuildComponent = z.infer<typeof insertBuildComponentSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
