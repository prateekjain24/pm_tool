import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatedProgressIndicator } from "./AnimatedProgressIndicator";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
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
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps && isCurrentStepValid) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, isCurrentStepValid]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleStepClick = (step: number) => {
    // Allow navigation to any previous step or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (isCurrentStepValid) {
      // TODO: Submit hypothesis for AI analysis
      console.log("Submitting hypothesis:", formData);
    }
  }, [isCurrentStepValid, formData]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handleBack();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (isCurrentStepValid) {
            handleNext();
          }
          break;
        case 'Enter':
          event.preventDefault();
          if (currentStep === totalSteps && isCurrentStepValid) {
            handleSubmit();
          } else if (isCurrentStepValid) {
            handleNext();
          }
          break;
        case 'Escape':
          event.preventDefault();
          // Quick jump to step 1
          setCurrentStep(1);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          event.preventDefault();
          const step = parseInt(event.key);
          if (step <= currentStep) {
            setCurrentStep(step);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isCurrentStepValid, handleNext, handleBack, handleSubmit]);

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
    <div className={cn("relative w-full max-w-3xl mx-auto", className)}>
      {/* Animated background pattern */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 -z-10",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />
      
      <Card className="relative shadow-2xl overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Border beam effect */}
        <BorderBeam size={250} duration={12} delay={9} />
        
        {/* Header with progress indicator */}
        <CardHeader className="space-y-6 pb-8 pt-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Create Your Hypothesis
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Let's build a clear, testable hypothesis for your experiment
            </p>
          </div>
          <AnimatedProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepClick={handleStepClick}
          />
        </CardHeader>

        {/* Main content area */}
        <CardContent className="min-h-[450px] px-6 md:px-10">
          <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
            {getCurrentStepComponent()}
          </div>
        </CardContent>

        {/* Footer with navigation */}
        <CardFooter className="flex flex-col gap-4 pt-8 px-6 md:px-10 pb-8 bg-muted/30">
          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-muted-foreground text-center w-full">
            <span className="hidden sm:inline">
              Use ← → arrow keys to navigate • Enter to continue • 1-5 to jump to step • Esc to reset
            </span>
          </div>
          
          <div className="flex justify-between items-center gap-4 w-full">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="min-w-[120px] h-11 transition-all hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <div className="flex items-center gap-2 text-sm">
            {isCurrentStepValid ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground hidden sm:inline">Ready to continue</span>
              </>
            ) : (
              <span className="text-muted-foreground hidden sm:inline">Complete this step to continue</span>
            )}
          </div>

          {currentStep === totalSteps ? (
            <ShimmerButton
              onClick={handleSubmit}
              disabled={!isCurrentStepValid}
              className="min-w-[120px] h-11"
              shimmerColor="#10b981"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Submit
            </ShimmerButton>
          ) : (
            <ShimmerButton
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className="min-w-[120px] h-11"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </ShimmerButton>
          )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}