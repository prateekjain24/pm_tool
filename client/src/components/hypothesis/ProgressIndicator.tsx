import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  onStepClick,
  className,
}: ProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Mobile view: Step X of Y text */}
      <div className="sm:hidden text-center mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Desktop view: Progress dots */}
      <div className="hidden sm:flex items-center justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = onStepClick && (isCompleted || isActive);

          return (
            <button
              key={stepNumber}
              onClick={() => isClickable && onStepClick(stepNumber)}
              disabled={!isClickable}
              className={cn(
                "group relative flex items-center",
                isClickable && "cursor-pointer",
              )}
              aria-label={`Step ${stepNumber}`}
            >
              {/* Connecting line */}
              {i > 0 && (
                <div
                  className={cn(
                    "absolute right-full w-8 h-0.5 mr-1",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                />
              )}

              {/* Step dot */}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full transition-all",
                  "text-xs font-medium",
                  isActive && "bg-primary text-primary-foreground shadow-sm",
                  isCompleted &&
                    "bg-primary/20 text-primary hover:bg-primary/30",
                  !isActive &&
                    !isCompleted &&
                    "bg-muted text-muted-foreground",
                  isClickable && "hover:scale-110",
                )}
              >
                {stepNumber}
              </div>

              {/* Step label (shown on hover) */}
              {isClickable && (
                <span className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs text-muted-foreground">
                  Step {stepNumber}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress bar for mobile */}
      <div className="sm:hidden mt-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}