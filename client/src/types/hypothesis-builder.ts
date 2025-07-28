// Types for the Hypothesis Builder form

export interface TargetAudience {
  selected: string[];
  customAudience?: string;
}

export interface Evidence {
  title: string;
  url: string;
}

export interface Reasoning {
  mainReasoning: string;
  evidence: Evidence[];
}

export interface ExpectedOutcome {
  metric: string;
  baseline: number;
  expectedLift: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface HypothesisFormData {
  intervention: string;      // Step 1: What change?
  targetAudience: TargetAudience;    // Step 2: Who will see this?
  reasoning: Reasoning;      // Step 3: Why will it work?
  expectedOutcome: ExpectedOutcome | null;   // Step 4: Expected impact
  successMetrics: string[];  // Step 5: How to measure
}

export interface StepProps {
  value: string | string[] | TargetAudience | Reasoning | ExpectedOutcome | null;
  onChange: (value: string | string[] | TargetAudience | Reasoning | ExpectedOutcome | null) => void;
  onValidate?: (value: string | string[] | TargetAudience | Reasoning | ExpectedOutcome | null) => boolean;
  className?: string;
}

export interface ValidationError {
  field: keyof HypothesisFormData;
  message: string;
}

export const CHARACTER_LIMITS = {
  intervention: 500,
  targetAudience: 300,
  reasoning: 1000,
  expectedOutcome: 300,
} as const;

export const VALIDATION_MESSAGES = {
  required: "This field is required",
  tooShort: "Please provide more detail (minimum 10 characters)",
  tooLong: "Text exceeds maximum character limit",
} as const;