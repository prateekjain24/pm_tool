import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StepOneProps {
  className?: string;
}

export function StepOne({ className }: StepOneProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">What change do you want to test?</h2>
        <p className="text-muted-foreground">
          Describe the specific change or feature you want to experiment with.
        </p>
      </div>

      {/* Placeholder for form content */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Coming Soon</CardTitle>
          <CardDescription>
            This step will include a text area for describing your change,
            with examples and helpful tips.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Example section placeholder */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <p className="text-sm font-medium">💡 Examples:</p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
          <li>• "Change checkout button color to green"</li>
          <li>• "Add a progress bar to the checkout flow"</li>
          <li>• "Show product recommendations on the cart page"</li>
        </ul>
      </div>
    </div>
  );
}