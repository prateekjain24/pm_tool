import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { experiments } from "./experiments";
import { users } from "./users";
import { workspaces } from "./workspaces";

/**
 * Documents table - stores all generated documents (PRDs, test plans, summaries)
 * Supports version control, collaborative editing, and export tracking
 */
export const documents = pgTable("documents", {
  // Primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // Foreign keys
  experimentId: uuid("experiment_id").references(() => experiments.id, {
    onDelete: "cascade",
  }),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Document metadata
  type: varchar("type", { length: 50 }).notNull(), // 'prd', 'test_plan', 'summary', 'hypothesis_doc'
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  format: varchar("format", { length: 20 }).default("markdown"), // 'markdown', 'pdf', 'html'

  // Version control
  version: integer("version").default(1).notNull(),
  previousVersionId: uuid("previous_version_id"),

  // Export tracking
  exportedAt: timestamp("exported_at"),
  exportedFormat: varchar("exported_format", { length: 20 }),

  // Collaborative editing support
  lastEditedBy: uuid("last_edited_by").references(() => users.id, {
    onDelete: "set null",
  }),
  editHistory: jsonb("edit_history").default([]).notNull(),
  // Example: [{ userId, timestamp, changes }]

  // Sharing
  shareableLink: varchar("shareable_link", { length: 255 }).unique(),
  shareExpiresAt: timestamp("share_expires_at"),

  // Creator and timestamps
  createdBy: uuid("created_by")
    .references(() => users.id, {
      onDelete: "set null",
    })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Indexes for performance
export const documentsIndexes = {
  experimentIdIdx: documents.experimentId,
  workspaceIdIdx: documents.workspaceId,
  typeIdx: documents.type,
  shareableLinkIdx: documents.shareableLink,
};

// Type inference
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
