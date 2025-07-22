// Types for the Hypothesis Builder form

export interface HypothesisFormData {
  intervention: string;      // Step 1: What change?
  targetAudience: string;    // Step 2: Who will see this?
  reasoning: string;         // Step 3: Why will it work?
  expectedOutcome: string;   // Step 4: Expected impact
  successMetrics: string[];  // Step 5: How to measure
}

export interface StepProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onValidate?: (value: string | string[]) => boolean;
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