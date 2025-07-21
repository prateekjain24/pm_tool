import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StepFiveProps {
  className?: string;
}

export function StepFive({ className }: StepFiveProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">How will you measure success?</h2>
        <p className="text-muted-foreground">
          Choose primary and secondary metrics to track experiment results.
        </p>
      </div>

      {/* Placeholder for form content */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Coming Soon</CardTitle>
          <CardDescription>
            This step will include metric categories, custom metric builder,
            and guardrail metric selection.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Metric categories placeholder */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <p className="text-sm font-medium">📊 Metric Categories:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Primary Metrics</p>
            <ul className="space-y-1 ml-4 mt-1">
              <li>• Main success indicator</li>
              <li>• Directly tied to hypothesis</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground">Guardrail Metrics</p>
            <ul className="space-y-1 ml-4 mt-1">
              <li>• Protect against negative effects</li>
              <li>• Monitor system health</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}