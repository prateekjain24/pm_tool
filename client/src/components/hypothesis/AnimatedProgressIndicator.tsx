import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface AnimatedProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

const stepLabels = [
  "Intervention",
  "Target Audience", 
  "Reasoning",
  "Expected Impact",
  "Success Metrics"
];

export function AnimatedProgressIndicator({
  currentStep,
  totalSteps,
  onStepClick,
  className,
}: AnimatedProgressIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop view with enhanced design */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between relative">
          {/* Progress line background */}
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-muted" />
          
          {/* Animated progress line */}
          <motion.div
            className="absolute left-0 top-6 h-0.5 bg-gradient-to-r from-primary to-primary/80"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Steps */}
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const isClickable = onStepClick && (isCompleted || isActive);

            return (
              <motion.button
                key={stepNumber}
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-2",
                  isClickable && "cursor-pointer",
                )}
                whileHover={isClickable ? { scale: 1.05 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {/* Step circle */}
                <motion.div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                    "text-sm font-medium border-2",
                    isActive && "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25",
                    isCompleted && "bg-primary/20 text-primary border-primary",
                    !isActive && !isCompleted && "bg-background text-muted-foreground border-muted",
                  )}
                  animate={isActive ? {
                    boxShadow: [
                      "0 0 0 0 rgba(var(--primary), 0)",
                      "0 0 0 8px rgba(var(--primary), 0.1)",
                      "0 0 0 0 rgba(var(--primary), 0)",
                    ],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </motion.div>

                {/* Step label */}
                <span className={cn(
                  "text-xs font-medium transition-colors whitespace-nowrap",
                  isActive && "text-foreground",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}>
                  {stepLabels[i]}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-xs text-muted-foreground">
            {stepLabels[currentStep - 1]}
          </span>
        </div>
        
        {/* Enhanced progress bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80"
            initial={{ width: "0%" }}
            animate={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        </div>
      </div>
    </div>
  );
}