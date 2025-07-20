import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { workspaces } from "./workspaces";

/**
 * Hypotheses table - represents experiment hypotheses using the "We Believe That" framework
 * Tracks hypothesis creation, versioning, and status through the validation process
 */
export const hypotheses = pgTable("hypotheses", {
  // Primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // Foreign keys
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // "We Believe That" framework fields
  intervention: text("intervention").notNull(), // What change do you want to test?
  targetAudience: text("target_audience").notNull(), // Who will see this change?
  expectedOutcome: text("expected_outcome").notNull(), // What impact do you expect?
  reasoning: text("reasoning").notNull(), // Why do you think this will work?
  successMetrics: jsonb("success_metrics").notNull(), // Array of success metric objects

  // Status and versioning
  status: varchar("status", { length: 50 }).default("draft").notNull(), // draft, analyzing, scored, approved
  version: integer("version").default(1).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Indexes for performance
export const hypothesesIndexes = {
  userIdIdx: hypotheses.userId,
  workspaceIdIdx: hypotheses.workspaceId,
  statusIdx: hypotheses.status,
};

// Type inference
export type Hypothesis = typeof hypotheses.$inferSelect;
export type NewHypothesis = typeof hypotheses.$inferInsert;
