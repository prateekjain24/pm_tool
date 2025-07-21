import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StepTwoProps {
  className?: string;
}

export function StepTwo({ className }: StepTwoProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Who will see this change?</h2>
        <p className="text-muted-foreground">
          Define your target audience for this experiment.
        </p>
      </div>

      {/* Placeholder for form content */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Coming Soon</CardTitle>
          <CardDescription>
            This step will include checkboxes for common audiences
            and a custom field for specific segments.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Audience options placeholder */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <p className="text-sm font-medium">📊 Common Audiences:</p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
          <li>• All users</li>
          <li>• Mobile users</li>
          <li>• Desktop users</li>
          <li>• New visitors</li>
          <li>• Returning customers</li>
        </ul>
      </div>
    </div>
  );
}