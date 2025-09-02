import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with roles
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profileImageUrl: text("profile_image_url"),
  role: text("role", { enum: ["customer", "admin", "support"] }).default("customer").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Product categories
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Components (products)
export const components = sqliteTable("components", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  type: text("type").notNull(), // cpu, gpu, motherboard, ram, storage, psu, case, cooler
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  specifications: text("specifications"), // JSON string
  basePrice: real("base_price").notNull(),
  currentPrice: real("current_price"),
  discount: real("discount").default(0),
  stock: integer("stock").default(0).notNull(),
  minStock: integer("min_stock").default(5).notNull(),
  sku: text("sku").unique(),
  categoryId: integer("category_id").references(() => categories.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false).notNull(),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Component compatibility
export const compatibility = sqliteTable("compatibility", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  componentId: integer("component_id").references(() => components.id).notNull(),
  compatibleWithId: integer("compatible_with_id").references(() => components.id).notNull(),
  compatibilityType: text("compatibility_type").notNull(), // socket, chipset, form_factor, etc.
  notes: text("notes"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// User builds/configurations
export const builds = sqliteTable("builds", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  useCase: text("use_case").notNull(), // gaming, workstation, office, streaming
  budget: real("budget"),
  totalPrice: real("total_price").notNull(),
  configuration: text("configuration").notNull(), // JSON string
  isPublic: integer("is_public", { mode: "boolean" }).default(false).notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false).notNull(),
  likes: integer("likes").default(0),
  views: integer("views").default(0),
  tags: text("tags"), // JSON array of strings
  status: text("status", { enum: ["draft", "published", "archived"] }).default("draft").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Build components (many-to-many)
export const buildComponents = sqliteTable("build_components", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  buildId: integer("build_id").references(() => builds.id).notNull(),
  componentId: integer("component_id").references(() => components.id).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  priceAtTime: real("price_at_time").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Orders
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderNumber: text("order_number").unique().notNull(),
  status: text("status", { 
    enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] 
  }).default("pending").notNull(),
  subtotal: real("subtotal").notNull(),
  tax: real("tax").notNull(),
  shipping: real("shipping").notNull(),
  discount: real("discount").default(0),
  total: real("total").notNull(),
  paymentStatus: text("payment_status", { 
    enum: ["pending", "paid", "failed", "refunded"] 
  }).default("pending").notNull(),
  paymentMethod: text("payment_method"),
  shippingAddress: text("shipping_address").notNull(), // JSON string
  billingAddress: text("billing_address").notNull(), // JSON string
  trackingNumber: text("tracking_number"),
  estimatedDelivery: text("estimated_delivery"),
  notes: text("notes"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Order items
export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  componentId: integer("component_id").references(() => components.id).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  totalPrice: real("total_price").notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Support tickets
export const supportTickets = sqliteTable("support_tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  assignedToId: integer("assigned_to_id").references(() => users.id),
  ticketNumber: text("ticket_number").unique().notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium").notNull(),
  status: text("status", { 
    enum: ["open", "in_progress", "waiting", "resolved", "closed"] 
  }).default("open").notNull(),
  category: text("category").notNull(), // technical, billing, general, etc.
  attachments: text("attachments"), // JSON array of file URLs
  tags: text("tags"), // JSON array of strings
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Support ticket messages
export const ticketMessages = sqliteTable("ticket_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isInternal: integer("is_internal", { mode: "boolean" }).default(false).notNull(),
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Reviews
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  componentId: integer("component_id").references(() => components.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  verified: integer("verified", { mode: "boolean" }).default(false).notNull(),
  helpful: integer("helpful").default(0),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
  updatedAt: text("updated_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Inventory transactions
export const inventoryTransactions = sqliteTable("inventory_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  componentId: integer("component_id").references(() => components.id).notNull(),
  type: text("type", { enum: ["in", "out", "adjustment"] }).notNull(),
  quantity: integer("quantity").notNull(),
  reason: text("reason").notNull(),
  reference: text("reference"), // order_id, supplier_invoice, etc.
  userId: integer("user_id").references(() => users.id).notNull(),
  notes: text("notes"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Analytics data
export const analytics = sqliteTable("analytics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(), // page_view, product_view, add_to_cart, purchase, etc.
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  data: text("data").notNull(), // JSON string with event data
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertComponentSchema = createInsertSchema(components);
export const selectComponentSchema = createSelectSchema(components);
export const insertBuildSchema = createInsertSchema(builds);
export const selectBuildSchema = createSelectSchema(builds);
export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);
export const insertSupportTicketSchema = createInsertSchema(supportTickets);
export const selectSupportTicketSchema = createSelectSchema(supportTickets);

// Type exportss
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type User = SelectUser; // Alias for convenience
export type InsertComponent = typeof components.$inferInsert;
export type SelectComponent = typeof components.$inferSelect;
export type InsertBuild = typeof builds.$inferInsert;
export type SelectBuild = typeof builds.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrder = typeof orders.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;
export type SelectSupportTicket = typeof supportTickets.$inferSelect;
