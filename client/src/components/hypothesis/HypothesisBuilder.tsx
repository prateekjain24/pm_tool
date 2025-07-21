import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProgressIndicator } from "./ProgressIndicator";

// Import step components
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";

interface HypothesisBuilderProps {
  className?: string;
}

export function HypothesisBuilder({ className }: HypothesisBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step components mapping
  const stepComponents = {
    1: StepOne,
    2: StepTwo,
    3: StepThree,
    4: StepFour,
    5: StepFive,
  };

  const CurrentStepComponent = stepComponents[currentStep as keyof typeof stepComponents];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // In the future, this might have validation logic
    // For now, allow navigation to any previous step
    if (step <= currentStep) {
      setCurrentStep(step);
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
        <CardContent className="min-h-[300px] px-6 md:px-8">
          <div className="animate-in fade-in-50 duration-300">
            <CurrentStepComponent className="space-y-4" />
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
              Press Enter to continue
            </span>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            className="min-w-[100px]"
          >
            {currentStep === totalSteps ? "Submit" : "Continue"}
          </Button>
        </CardFooter>
      </Card>

    </div>
  );
}