import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepContainerProps {
  children: ReactNode;
  className?: string;
  stepNumber?: number;
}

export function StepContainer({ children, className, stepNumber = 1 }: StepContainerProps) {
  return (
    <motion.div
      className={cn("space-y-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        delay: stepNumber * 0.05,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}