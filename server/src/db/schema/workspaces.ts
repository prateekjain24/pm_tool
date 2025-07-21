import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Workspaces table - represents organizations/teams
 * This is a minimal implementation to support the User schema
 */
export const workspaces = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  
  // Clerk integration
  clerkOrgId: varchar("clerk_org_id", { length: 255 }).unique(),
  
  // Plan and limits
  plan: varchar("plan", { length: 50 }).default("free").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type inference
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
