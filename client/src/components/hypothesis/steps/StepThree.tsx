import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StepProps } from "@/types/hypothesis-builder";

export function StepThree({ value, onChange, className }: StepProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Why do you think this will work?</h2>
        <p className="text-muted-foreground">
          Explain your reasoning with data, user research, or insights.
        </p>
      </div>

      {/* Placeholder for form content */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Coming Soon</CardTitle>
          <CardDescription>
            This step will include a rich text editor for detailed reasoning
            and fields for linking supporting evidence.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tips placeholder */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <p className="text-sm font-medium">🎯 Tips for Strong Reasoning:</p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
          <li>• Reference user research or survey data</li>
          <li>• Cite industry best practices</li>
          <li>• Include competitive analysis</li>
          <li>• Use behavioral psychology principles</li>
        </ul>
      </div>
    </div>
  );
}