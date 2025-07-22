import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StepProps } from "@/types/hypothesis-builder";

export function StepFour({ value, onChange, className }: StepProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">What impact do you expect?</h2>
        <p className="text-muted-foreground">
          Define the expected outcome and lift percentage.
        </p>
      </div>

      {/* Placeholder for form content */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Coming Soon</CardTitle>
          <CardDescription>
            This step will include metric selection, baseline input,
            and a lift calculator with visual feedback.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Impact examples placeholder */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <p className="text-sm font-medium">📈 Common Impact Metrics:</p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
          <li>• Conversion rate increase</li>
          <li>• Revenue per visitor lift</li>
          <li>• Cart abandonment reduction</li>
          <li>• Click-through rate improvement</li>
          <li>• Time on page increase</li>
        </ul>
      </div>
    </div>
  );
}