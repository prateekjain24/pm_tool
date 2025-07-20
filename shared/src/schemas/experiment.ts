import { z } from "zod";

/**
 * Status enum for experiment
 */
export const ExperimentStatus = {
  PLANNING: "planning",
  RUNNING: "running",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type ExperimentStatus = (typeof ExperimentStatus)[keyof typeof ExperimentStatus];

/**
 * Variant schema
 */
export const variantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  allocation: z.number().min(0).max(100, "Allocation must be between 0 and 100"),
  description: z.string().optional(),
});

/**
 * Base experiment schema
 */
export const experimentSchema = z.object({
  id: z.string().uuid(),
  hypothesisId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  name: z.string().min(3, "Experiment name must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  dailyTraffic: z.number().int().positive().optional(),
  sampleSize: z.number().int().positive().optional(),
  confidenceLevel: z.number().min(80).max(99.9),
  statisticalPower: z.number().min(50).max(99.9),
  variants: z.array(variantSchema).min(2, "At least 2 variants are required"),
  status: z.enum([
    ExperimentStatus.PLANNING,
    ExperimentStatus.RUNNING,
    ExperimentStatus.COMPLETED,
    ExperimentStatus.CANCELLED,
  ]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Sample size calculation schema
 */
export const sampleSizeCalculationSchema = z.object({
  baselineRate: z.number().min(0).max(1),
  minimumDetectableEffect: z.number().min(0).max(1),
  confidenceLevel: z.number().min(80).max(99.9),
  statisticalPower: z.number().min(50).max(99.9),
  sampleSizePerVariant: z.number().int().positive(),
  totalSampleSize: z.number().int().positive(),
  estimatedDuration: z.number().positive(),
});

/**
 * Experiment timeline schema
 */
export const experimentTimelineSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  totalDays: z.number().int().positive(),
  weekdays: z.number().int().min(0),
  weekends: z.number().int().min(0),
  holidays: z.array(z.string().datetime()),
  warnings: z.array(z.string()),
});

/**
 * Create experiment input schema
 */
export const createExperimentInputSchema = z.object({
  hypothesisId: z.string().uuid(),
  name: z.string().min(3, "Experiment name must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  dailyTraffic: z.number().int().positive().optional(),
  sampleSize: z.number().int().positive().optional(),
  confidenceLevel: z.number().min(80).max(99.9).default(95),
  statisticalPower: z.number().min(50).max(99.9).default(80),
  variants: z.array(variantSchema).min(2, "At least 2 variants are required"),
});

/**
 * Update experiment input schema
 */
export const updateExperimentInputSchema = createExperimentInputSchema.partial().extend({
  status: z
    .enum([
      ExperimentStatus.PLANNING,
      ExperimentStatus.RUNNING,
      ExperimentStatus.COMPLETED,
      ExperimentStatus.CANCELLED,
    ])
    .optional(),
});

/**
 * Type guards
 */
export function isValidExperimentStatus(status: string): status is ExperimentStatus {
  return Object.values(ExperimentStatus).includes(status as ExperimentStatus);
}

/**
 * Validation helpers
 */
export function validateExperiment(data: unknown) {
  return experimentSchema.safeParse(data);
}

export function validateCreateExperimentInput(data: unknown) {
  return createExperimentInputSchema.safeParse(data);
}

export function validateUpdateExperimentInput(data: unknown) {
  return updateExperimentInputSchema.safeParse(data);
}

export function validateVariants(variants: unknown[]) {
  const result = z.array(variantSchema).safeParse(variants);
  if (!result.success) return result;

  // Additional validation: allocations must sum to 100
  const totalAllocation = result.data.reduce((sum, variant) => sum + variant.allocation, 0);
  if (Math.abs(totalAllocation - 100) > 0.01) {
    return {
      success: false,
      error: new Error("Variant allocations must sum to 100%"),
    };
  }

  return result;
}

/**
 * Constants
 */
export const DEFAULT_CONFIDENCE_LEVEL = 95;
export const DEFAULT_STATISTICAL_POWER = 80;
export const MIN_SAMPLE_SIZE = 100;
export const MIN_EXPERIMENT_DURATION_DAYS = 7;
export const MAX_EXPERIMENT_DURATION_DAYS = 90;

/**
 * Utility functions
 */
export function calculateMinimumDuration(sampleSize: number, dailyTraffic: number): number {
  return Math.ceil(sampleSize / dailyTraffic);
}

export function isExperimentActive(status: ExperimentStatus): boolean {
  return status === ExperimentStatus.RUNNING;
}

export function canEditExperiment(status: ExperimentStatus): boolean {
  return status === ExperimentStatus.PLANNING;
}
