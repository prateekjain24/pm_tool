import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { StepProps, ExpectedOutcome } from "@/types/hypothesis-builder";
import { TrendingUp, Info, Calculator, Target } from "lucide-react";

// Common metrics for PMs
const COMMON_METRICS = [
  { value: "conversion_rate", label: "Conversion Rate", unit: "%", example: "2.5" },
  { value: "revenue_per_user", label: "Revenue per User", unit: "$", example: "45.00" },
  { value: "click_through_rate", label: "Click-through Rate", unit: "%", example: "3.2" },
  { value: "cart_abandonment", label: "Cart Abandonment Rate", unit: "%", example: "68.0" },
  { value: "avg_order_value", label: "Average Order Value", unit: "$", example: "125.50" },
  { value: "time_on_page", label: "Time on Page", unit: "sec", example: "180" },
  { value: "bounce_rate", label: "Bounce Rate", unit: "%", example: "45.0" },
  { value: "signup_rate", label: "Sign-up Rate", unit: "%", example: "12.0" },
  { value: "retention_rate", label: "Retention Rate", unit: "%", example: "85.0" },
  { value: "engagement_rate", label: "Engagement Rate", unit: "%", example: "25.0" },
];

const CONFIDENCE_LEVELS = [
  { 
    value: "low", 
    label: "Low", 
    description: "Experimental, based on hypothesis",
    color: "bg-yellow-500"
  },
  { 
    value: "medium", 
    label: "Medium", 
    description: "Based on similar experiments",
    color: "bg-blue-500"
  },
  { 
    value: "high", 
    label: "High", 
    description: "Strong evidence from data",
    color: "bg-green-500"
  },
];

interface StepFourProps extends Omit<StepProps, 'value' | 'onChange'> {
  value: ExpectedOutcome | null;
  onChange: (value: ExpectedOutcome | null) => void;
}

export function StepFour({ value, onChange, className }: StepFourProps) {
  const [localData, setLocalData] = useState<ExpectedOutcome>({
    metric: value?.metric || "",
    baseline: value?.baseline || 0,
    expectedLift: value?.expectedLift || 0,
    confidence: value?.confidence || "medium",
  });

  // Update parent component when local data changes
  useEffect(() => {
    if (localData.metric && localData.baseline > 0 && localData.expectedLift > 0) {
      onChange(localData);
    } else if (value !== null) {
      onChange(null);
    }
  }, [localData, onChange, value]);

  // Calculate expected value
  const calculateExpectedValue = () => {
    if (localData.baseline <= 0 || localData.expectedLift <= 0) return null;
    
    const expectedValue = localData.baseline * (1 + localData.expectedLift / 100);
    return expectedValue;
  };

  const expectedValue = calculateExpectedValue();
  const selectedMetric = COMMON_METRICS.find(m => m.value === localData.metric);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">What impact do you expect?</h2>
        <p className="text-muted-foreground">
          Define the expected outcome and lift percentage.
        </p>
      </div>

      {/* Main form card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Expected Impact
          </CardTitle>
          <CardDescription>
            Set realistic expectations based on data and past experiments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metric selection */}
          <div className="space-y-2">
            <Label htmlFor="metric">Primary Metric</Label>
            <Select 
              value={localData.metric} 
              onValueChange={(value) => setLocalData(prev => ({ ...prev, metric: value }))}
            >
              <SelectTrigger id="metric">
                <SelectValue placeholder="Select the metric you want to improve" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_METRICS.map((metric) => (
                  <SelectItem key={metric.value} value={metric.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{metric.label}</span>
                      <span className="text-muted-foreground text-xs ml-2">({metric.unit})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Baseline input */}
          <div className="space-y-2">
            <Label htmlFor="baseline">Current Baseline</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="baseline"
                type="number"
                step="0.01"
                placeholder={selectedMetric ? `e.g., ${selectedMetric.example}` : "Enter current value"}
                value={localData.baseline || ""}
                onChange={(e) => setLocalData(prev => ({ 
                  ...prev, 
                  baseline: parseFloat(e.target.value) || 0 
                }))}
                className="flex-1"
              />
              {selectedMetric && (
                <Badge variant="secondary" className="min-w-fit">
                  {selectedMetric.unit}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              The current value of your selected metric
            </p>
          </div>

          {/* Expected lift */}
          <div className="space-y-2">
            <Label htmlFor="lift" className="flex items-center gap-2">
              Expected Lift
              <Calculator className="h-3 w-3" />
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="lift"
                type="number"
                step="0.1"
                placeholder="e.g., 15"
                value={localData.expectedLift || ""}
                onChange={(e) => setLocalData(prev => ({ 
                  ...prev, 
                  expectedLift: parseFloat(e.target.value) || 0 
                }))}
                className="flex-1"
              />
              <Badge variant="secondary" className="min-w-fit">%</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              The percentage improvement you expect to see
            </p>
          </div>

          {/* Visual feedback */}
          {expectedValue !== null && localData.baseline > 0 && (
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Projected Improvement
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="font-mono font-semibold">
                    {localData.baseline.toFixed(2)} {selectedMetric?.unit}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-muted-foreground">→</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected</p>
                  <p className="font-mono font-semibold text-green-600">
                    {expectedValue.toFixed(2)} {selectedMetric?.unit}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confidence selector */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Confidence Level
              <Info className="h-3 w-3" />
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {CONFIDENCE_LEVELS.map((level) => (
                <Button
                  key={level.value}
                  type="button"
                  variant={localData.confidence === level.value ? "default" : "outline"}
                  onClick={() => setLocalData(prev => ({ ...prev, confidence: level.value as 'low' | 'medium' | 'high' }))}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", level.color)} />
                    <span>{level.label}</span>
                  </div>
                  <span className="text-xs font-normal text-muted-foreground">
                    {level.description}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips and examples */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-3">
        <p className="text-sm font-medium">💡 Tips for Realistic Expectations:</p>
        <ul className="text-sm text-muted-foreground space-y-2 ml-4">
          <li>• Small improvements (5-15%) are often more achievable than large ones</li>
          <li>• Consider seasonality and external factors that might affect results</li>
          <li>• Review similar past experiments to calibrate expectations</li>
          <li>• Be conservative with estimates to avoid disappointment</li>
          <li>• Factor in implementation quality and user adoption rates</li>
        </ul>
        
        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">📊 Typical Lift Ranges by Experiment Type:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>• Copy changes: 2-10%</div>
            <div>• Layout redesign: 5-20%</div>
            <div>• New features: 10-30%</div>
            <div>• Pricing changes: 15-50%</div>
          </div>
        </div>
      </div>
    </div>
  );
}