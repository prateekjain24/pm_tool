import { date, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { hypotheses } from "./hypotheses";
import { workspaces } from "./workspaces";

/**
 * Experiments table - tracks A/B test experiments linked to hypotheses
 * Manages experiment lifecycle from planning through completion
 */
export const experiments = pgTable("experiments", {
  // Primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // Foreign keys
  hypothesisId: uuid("hypothesis_id")
    .references(() => hypotheses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull(),

  // Experiment details
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  // Timeline
  startDate: date("start_date"),
  endDate: date("end_date"),

  // Traffic and sample size
  dailyTraffic: integer("daily_traffic"),
  sampleSize: integer("sample_size"),
  confidenceLevel: integer("confidence_level").default(95),
  statisticalPower: integer("statistical_power").default(80),

  // Variants (array of objects)
  variants: jsonb("variants").notNull().default([]),
  // Example: [{ name: "control", allocation: 50 }, { name: "treatment", allocation: 50 }]

  // Status
  status: varchar("status", { length: 50 }).default("planning").notNull(), // planning, running, completed, cancelled

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Indexes for performance
export const experimentsIndexes = {
  hypothesisIdIdx: experiments.hypothesisId,
  workspaceIdIdx: experiments.workspaceId,
  statusIdx: experiments.status,
};

// Type inference
export type Experiment = typeof experiments.$inferSelect;
export type NewExperiment = typeof experiments.$inferInsert;
