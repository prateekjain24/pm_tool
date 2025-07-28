import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "./ProgressIndicator";
import type { HypothesisFormData, TargetAudience, Reasoning, ExpectedOutcome } from "@/types/hypothesis-builder";

// Import step components
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";

interface HypothesisBuilderProps {
  className?: string;
}

// Initial form state
const initialFormData: HypothesisFormData = {
  intervention: "",
  targetAudience: {
    selected: [],
    customAudience: ""
  },
  reasoning: {
    mainReasoning: "",
    evidence: []
  },
  expectedOutcome: null,
  successMetrics: [],
};

export function HypothesisBuilder({ className }: HypothesisBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<HypothesisFormData>(initialFormData);
  
  const totalSteps = 5;

  // Update form data for a specific field
  const updateFormData = useCallback((field: keyof HypothesisFormData) => {
    return (value: string | string[] | TargetAudience | Reasoning | ExpectedOutcome | null) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };
  }, []);

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.intervention.trim().length >= 10;
      case 2:
        return formData.targetAudience.selected.length > 0 || 
               (formData.targetAudience.customAudience?.trim().length ?? 0) >= 10;
      case 3:
        return formData.reasoning.mainReasoning.trim().length >= 10;
      case 4:
        return formData.expectedOutcome !== null && 
               formData.expectedOutcome.metric.trim().length > 0 &&
               formData.expectedOutcome.baseline > 0 &&
               formData.expectedOutcome.expectedLift > 0;
      case 5:
        return formData.successMetrics.length > 0;
      default:
        return false;
    }
  };

  // Check if current step is valid
  const isCurrentStepValid = validateStep(currentStep);

  // Handle navigation
  const handleNext = () => {
    if (currentStep < totalSteps && isCurrentStepValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Allow navigation to any previous step or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (isCurrentStepValid) {
      // TODO: Submit hypothesis for AI analysis
      console.log("Submitting hypothesis:", formData);
    }
  };

  // Get the current step component with props
  const getCurrentStepComponent = () => {
    const commonProps = {
      className: "space-y-4",
    };

    switch (currentStep) {
      case 1:
        return (
          <StepOne 
            {...commonProps}
            value={formData.intervention}
            onChange={updateFormData('intervention')}
          />
        );
      case 2:
        return (
          <StepTwo 
            {...commonProps}
            value={formData.targetAudience}
            onChange={updateFormData('targetAudience')}
          />
        );
      case 3:
        return (
          <StepThree
            {...commonProps}
            value={formData.reasoning}
            onChange={updateFormData('reasoning')}
          />
        );
      case 4:
        return (
          <StepFour
            {...commonProps}
            value={formData.expectedOutcome}
            onChange={updateFormData('expectedOutcome')}
          />
        );
      case 5:
        return (
          <StepFive
            {...commonProps}
            value={formData.successMetrics}
            onChange={updateFormData('successMetrics')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card className="shadow-lg">
        {/* Header with progress indicator */}
        <CardHeader className="space-y-6 pb-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Create Your Hypothesis</h1>
            <p className="text-muted-foreground">
              Let's build a clear, testable hypothesis for your experiment
            </p>
          </div>
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepClick={handleStepClick}
          />
        </CardHeader>

        {/* Main content area */}
        <CardContent className="min-h-[400px] px-6 md:px-8">
          <div className="animate-in fade-in-50 duration-300">
            {getCurrentStepComponent()}
          </div>
        </CardContent>

        {/* Footer with navigation */}
        <CardFooter className="flex justify-between gap-4 pt-8 px-6 md:px-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="min-w-[100px]"
          >
            Back
          </Button>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="hidden sm:inline">
              {isCurrentStepValid ? "Ready to continue" : "Complete this step to continue"}
            </span>
          </div>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentStepValid}
              className="min-w-[100px]"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className="min-w-[100px]"
            >
              Continue
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}