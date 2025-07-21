import { HypothesisBuilder } from "@/components/hypothesis/HypothesisBuilder";

export function Hypotheses() {
  return (
    <div className="container mx-auto py-6 px-4 lg:px-8">
      {/* Page header */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Hypothesis Builder</h1>
        <p className="text-muted-foreground mt-2">
          Create well-structured, testable hypotheses for your experiments
        </p>
      </div>

      {/* Hypothesis Builder */}
      <HypothesisBuilder className="mb-8" />

      {/* Future: List of existing hypotheses could go here */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Your saved hypotheses will appear here</p>
      </div>
    </div>
  );
}