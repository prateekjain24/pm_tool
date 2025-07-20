import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

/**
 * Users table - represents authenticated users in the system
 * Maps to Clerk authentication with additional user data
 */
export const users = pgTable("users", {
  // Primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // Clerk integration
  clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),

  // User information
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),

  // Organization/workspace
  workspaceId: uuid("workspace_id").references(() => workspaces.id, {
    onDelete: "set null",
  }),

  // Role and permissions
  role: varchar("role", { length: 50 }).default("member").notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Soft delete
  deletedAt: timestamp("deleted_at"),
});

// Indexes for performance
export const usersIndexes = {
  clerkIdIdx: users.clerkId,
  emailIdx: users.email,
  workspaceIdIdx: users.workspaceId,
};

// Type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
