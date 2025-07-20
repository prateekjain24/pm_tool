import { decimal, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { hypotheses } from "./hypotheses";
import { users } from "./users";

/**
 * HypothesisScores table - tracks AI-powered scoring history for hypotheses
 * Stores individual dimension scores and detailed feedback from AI providers
 */
export const hypothesisScores = pgTable("hypothesis_scores", {
  // Primary key
  id: uuid("id").defaultRandom().primaryKey(),

  // Foreign keys
  hypothesisId: uuid("hypothesis_id")
    .references(() => hypotheses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  scoredBy: uuid("scored_by").references(() => users.id, {
    onDelete: "set null",
  }),

  // Overall and dimension scores (0.0 to 10.0)
  overallScore: decimal("overall_score", { precision: 3, scale: 1 }).notNull(),
  clarityScore: decimal("clarity_score", { precision: 3, scale: 1 }).notNull(),
  measurabilityScore: decimal("measurability_score", { precision: 3, scale: 1 }).notNull(),
  reasoningScore: decimal("reasoning_score", { precision: 3, scale: 1 }).notNull(),
  scopeScore: decimal("scope_score", { precision: 3, scale: 1 }).notNull(),
  testabilityScore: decimal("testability_score", { precision: 3, scale: 1 }).notNull(),

  // AI feedback and metadata
  aiFeedback: jsonb("ai_feedback").notNull().default({}),
  // Example: { strengths: [], improvements: [], suggestions: [] }

  aiProvider: varchar("ai_provider", { length: 50 }),
  // openai, claude, gemini

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Indexes for performance
export const hypothesisScoresIndexes = {
  hypothesisIdIdx: hypothesisScores.hypothesisId,
  createdAtIdx: hypothesisScores.createdAt,
};

// Type inference
export type HypothesisScore = typeof hypothesisScores.$inferSelect;
export type NewHypothesisScore = typeof hypothesisScores.$inferInsert;
