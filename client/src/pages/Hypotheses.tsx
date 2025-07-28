import { HypothesisBuilder } from "@/components/hypothesis/HypothesisBuilder";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export function Hypotheses() {
  return (
    <div className="container mx-auto py-6 px-4 lg:px-8">
      {/* Page header with modern design */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AnimatedGradientText className="text-4xl font-bold tracking-tight">
            Hypothesis Builder
          </AnimatedGradientText>
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        
        <p className="text-muted-foreground text-lg mb-4 max-w-2xl mx-auto">
          Transform your ideas into scientifically rigorous experiments with our AI-powered hypothesis builder
        </p>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            5-Step Process
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            Best Practices
          </Badge>
        </div>
      </div>

      {/* Hypothesis Builder */}
      <HypothesisBuilder className="mb-8" />

      {/* Future: List of existing hypotheses */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse" />
          <p className="text-sm text-muted-foreground">Your saved hypotheses will appear here</p>
        </div>
      </div>
    </div>
  );
}