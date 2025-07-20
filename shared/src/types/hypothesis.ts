export interface Hypothesis {
  id: string;
  userId: string;
  workspaceId: string;
  intervention: string;
  targetAudience: string;
  expectedOutcome: string;
  reasoning: string;
  successMetrics: string[];
  status: "draft" | "analyzing" | "scored" | "approved";
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HypothesisScore {
  id: string;
  hypothesisId: string;
  scoredBy?: string;
  overallScore: number;
  clarityScore: number;
  measurabilityScore: number;
  reasoningScore: number;
  scopeScore: number;
  testabilityScore: number;
  aiFeedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  aiProvider?: string;
  createdAt: Date;
}

export interface CreateHypothesisInput {
  intervention: string;
  targetAudience: string;
  expectedOutcome: string;
  reasoning: string;
  successMetrics: string[];
}

export interface UpdateHypothesisInput extends Partial<CreateHypothesisInput> {
  status?: "draft" | "analyzing" | "scored" | "approved";
}

export interface ScoreHypothesisInput {
  hypothesisId: string;
  clarityScore: number;
  measurabilityScore: number;
  reasoningScore: number;
  scopeScore: number;
  testabilityScore: number;
  aiFeedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  aiProvider?: string;
}
