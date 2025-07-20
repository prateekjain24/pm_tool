import { z } from "zod";

/**
 * Status enum for hypothesis
 */
export const HypothesisStatus = {
  DRAFT: "draft",
  ANALYZING: "analyzing",
  SCORED: "scored",
  APPROVED: "approved",
} as const;

export type HypothesisStatus = typeof HypothesisStatus[keyof typeof HypothesisStatus];

/**
 * Base hypothesis schema
 */
export const hypothesisSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  intervention: z.string().min(10, "Intervention must be at least 10 characters"),
  targetAudience: z.string().min(5, "Target audience must be at least 5 characters"),
  expectedOutcome: z.string().min(10, "Expected outcome must be at least 10 characters"),
  reasoning: z.string().min(20, "Reasoning must be at least 20 characters"),
  successMetrics: z.array(z.string()).min(1, "At least one success metric is required"),
  status: z.enum([HypothesisStatus.DRAFT, HypothesisStatus.ANALYZING, HypothesisStatus.SCORED, HypothesisStatus.APPROVED]),
  version: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * AI feedback schema
 */
export const aiFeedbackSchema = z.object({
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  suggestions: z.array(z.string()),
});

/**
 * Hypothesis score schema
 */
export const hypothesisScoreSchema = z.object({
  id: z.string().uuid(),
  hypothesisId: z.string().uuid(),
  scoredBy: z.string().optional(),
  overallScore: z.number().min(0).max(10),
  clarityScore: z.number().min(0).max(10),
  measurabilityScore: z.number().min(0).max(10),
  reasoningScore: z.number().min(0).max(10),
  scopeScore: z.number().min(0).max(10),
  testabilityScore: z.number().min(0).max(10),
  aiFeedback: aiFeedbackSchema,
  aiProvider: z.string().optional(),
  createdAt: z.date(),
});

/**
 * Create hypothesis input schema
 */
export const createHypothesisInputSchema = z.object({
  intervention: z.string().min(10, "Intervention must be at least 10 characters"),
  targetAudience: z.string().min(5, "Target audience must be at least 5 characters"),
  expectedOutcome: z.string().min(10, "Expected outcome must be at least 10 characters"),
  reasoning: z.string().min(20, "Reasoning must be at least 20 characters"),
  successMetrics: z.array(z.string()).min(1, "At least one success metric is required"),
});

/**
 * Update hypothesis input schema
 */
export const updateHypothesisInputSchema = createHypothesisInputSchema.partial().extend({
  status: z.enum([HypothesisStatus.DRAFT, HypothesisStatus.ANALYZING, HypothesisStatus.SCORED, HypothesisStatus.APPROVED]).optional(),
});

/**
 * Score hypothesis input schema
 */
export const scoreHypothesisInputSchema = z.object({
  hypothesisId: z.string().uuid(),
  clarityScore: z.number().min(0).max(10),
  measurabilityScore: z.number().min(0).max(10),
  reasoningScore: z.number().min(0).max(10),
  scopeScore: z.number().min(0).max(10),
  testabilityScore: z.number().min(0).max(10),
  aiFeedback: aiFeedbackSchema,
  aiProvider: z.string().optional(),
});

/**
 * Type guards
 */
export function isValidHypothesisStatus(status: string): status is HypothesisStatus {
  return Object.values(HypothesisStatus).includes(status as HypothesisStatus);
}

/**
 * Validation helpers
 */
export function validateHypothesis(data: unknown) {
  return hypothesisSchema.safeParse(data);
}

export function validateCreateHypothesisInput(data: unknown) {
  return createHypothesisInputSchema.safeParse(data);
}

export function validateUpdateHypothesisInput(data: unknown) {
  return updateHypothesisInputSchema.safeParse(data);
}

export function validateScoreHypothesisInput(data: unknown) {
  return scoreHypothesisInputSchema.safeParse(data);
}

/**
 * Constants
 */
export const HYPOTHESIS_SCORE_DIMENSIONS = [
  "clarityScore",
  "measurabilityScore",
  "reasoningScore",
  "scopeScore",
  "testabilityScore",
] as const;

export const MIN_HYPOTHESIS_SCORE = 0;
export const MAX_HYPOTHESIS_SCORE = 10;
export const PASSING_HYPOTHESIS_SCORE = 7;