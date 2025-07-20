import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { documents } from "./documents";
import { users } from "./users";

/**
 * DocumentVersions table - tracks version history for documents
 * Stores complete content snapshots for each version
 */
export const documentVersions = pgTable("document_versions", {
  // Primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // Foreign keys
  documentId: uuid("document_id")
    .references(() => documents.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Version information
  version: integer("version").notNull(),
  content: text("content").notNull(),
  changesSummary: text("changes_summary"),

  // Creator
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Indexes for performance
export const documentVersionsIndexes = {
  documentIdIdx: documentVersions.documentId,
  versionIdx: documentVersions.version,
};

// Type inference
export type DocumentVersion = typeof documentVersions.$inferSelect;
export type NewDocumentVersion = typeof documentVersions.$inferInsert;
