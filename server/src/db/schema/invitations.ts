import { pgTable, timestamp, uuid, varchar, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { workspaces } from "./workspaces";

/**
 * Invitations table - represents team invitations sent to join a workspace
 */
export const invitations = pgTable("invitations", {
  // Primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // Invitation details
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(), // Unique token for accepting invitation
  message: text("message"), // Optional personal message from inviter

  // Relationships
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  invitedById: uuid("invited_by_id")
    .references(() => users.id, { onDelete: "set null" }),

  // Status tracking
  status: varchar("status", { length: 50 })
    .default("pending")
    .notNull(), // pending, accepted, expired, revoked

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // Invitation expiration
  acceptedAt: timestamp("accepted_at"), // When the invitation was accepted
  revokedAt: timestamp("revoked_at"), // When the invitation was revoked

  // User who accepted (if accepted)
  acceptedByUserId: uuid("accepted_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
});

// Indexes for performance
export const invitationsIndexes = {
  emailIdx: invitations.email,
  tokenIdx: invitations.token,
  workspaceIdIdx: invitations.workspaceId,
  statusIdx: invitations.status,
  expiresAtIdx: invitations.expiresAt,
};

// Type inference
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;