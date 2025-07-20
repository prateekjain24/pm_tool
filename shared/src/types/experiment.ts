export interface Variant {
  name: string;
  allocation: number;
  description?: string;
}

export interface Experiment {
  id: string;
  hypothesisId: string;
  workspaceId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dailyTraffic?: number;
  sampleSize?: number;
  confidenceLevel: number;
  statisticalPower: number;
  variants: Variant[];
  status: "planning" | "running" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExperimentInput {
  hypothesisId: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  dailyTraffic?: number;
  sampleSize?: number;
  confidenceLevel?: number;
  statisticalPower?: number;
  variants: Variant[];
}

export interface UpdateExperimentInput extends Partial<CreateExperimentInput> {
  status?: "planning" | "running" | "completed" | "cancelled";
}

export interface SampleSizeCalculation {
  baselineRate: number;
  minimumDetectableEffect: number;
  confidenceLevel: number;
  statisticalPower: number;
  sampleSizePerVariant: number;
  totalSampleSize: number;
  estimatedDuration: number;
}

export interface ExperimentTimeline {
  startDate: string;
  endDate: string;
  totalDays: number;
  weekdays: number;
  weekends: number;
  holidays: string[];
  warnings: string[];
}
