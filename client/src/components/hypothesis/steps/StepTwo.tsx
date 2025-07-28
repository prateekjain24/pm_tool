import { useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { StepProps, TargetAudience } from "@/types/hypothesis-builder";
import { Info, Users } from "lucide-react";

// Define preset audiences with tooltips
const presetAudiences = [
  {
    id: "all-users",
    label: "All users",
    tooltip: "Every visitor to your website or app",
    estimatedSize: "100%"
  },
  {
    id: "mobile-users", 
    label: "Mobile users",
    tooltip: "Visitors using smartphones or tablets",
    estimatedSize: "~65%"
  },
  {
    id: "desktop-users",
    label: "Desktop users", 
    tooltip: "Visitors using desktop or laptop computers",
    estimatedSize: "~35%"
  },
  {
    id: "new-visitors",
    label: "New visitors",
    tooltip: "First-time visitors to your site",
    estimatedSize: "~40%"
  },
  {
    id: "returning-customers",
    label: "Returning customers",
    tooltip: "Users who have made at least one purchase",
    estimatedSize: "~25%"
  },
  {
    id: "logged-in-users",
    label: "Logged-in users",
    tooltip: "Users with active accounts who are signed in",
    estimatedSize: "~30%"
  },
  {
    id: "high-value-customers",
    label: "High-value customers",
    tooltip: "Customers with high lifetime value or frequent purchases",
    estimatedSize: "~10%"
  },
  {
    id: "cart-abandoners",
    label: "Cart abandoners",
    tooltip: "Users who added items to cart but didn't complete purchase",
    estimatedSize: "~15%"
  }
];

export function StepTwo({ value, onChange, className }: StepProps) {
  const customInputRef = useRef<HTMLInputElement>(null);
  
  // Parse the value correctly based on type, handling null
  const targetAudience: TargetAudience = value && typeof value === 'object' && 'selected' in value
    ? value as TargetAudience
    : { selected: [], customAudience: '' };

  const [showCustomInput, setShowCustomInput] = useState(
    targetAudience.selected.includes('other') || !!targetAudience.customAudience
  );

  // Calculate estimated audience size
  const getEstimatedAudienceSize = () => {
    if (targetAudience.selected.includes('all-users')) {
      return "100%";
    }
    
    // Find selected presets
    const selectedPresets = presetAudiences.filter(
      preset => targetAudience.selected.includes(preset.id)
    );
    
    if (selectedPresets.length === 0 && !showCustomInput) {
      return "0%";
    }
    
    if (selectedPresets.length === 0 && showCustomInput) {
      return "Custom segment";
    }
    
    // Simple approximation - would be more complex in production
    const percentages = selectedPresets.map(p => 
      parseInt(p.estimatedSize.replace(/[~%]/g, ''))
    );
    const total = Math.min(100, percentages.reduce((a, b) => a + b, 0));
    
    return `~${total}%`;
  };

  // Handle checkbox changes
  const handleCheckboxChange = (audienceId: string, checked: boolean) => {
    const newSelected = checked
      ? [...targetAudience.selected, audienceId]
      : targetAudience.selected.filter(id => id !== audienceId);

    onChange({
      ...targetAudience,
      selected: newSelected
    });

    // Show custom input when "other" is selected
    if (audienceId === 'other') {
      setShowCustomInput(checked);
      if (checked) {
        setTimeout(() => customInputRef.current?.focus(), 100);
      } else {
        // Clear custom audience when unchecking "other"
        onChange({
          selected: newSelected,
          customAudience: ''
        });
      }
    }
  };

  // Handle custom audience input
  const handleCustomAudienceChange = (customValue: string) => {
    onChange({
      ...targetAudience,
      customAudience: customValue
    });
  };

  // Validation
  const isValid = targetAudience.selected.length > 0 || 
                  (targetAudience.customAudience?.trim().length ?? 0) >= 10;

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Who will see this change?</h2>
          <p className="text-muted-foreground">
            Select one or more audience segments for your experiment. You can combine multiple segments or define a custom audience.
          </p>
        </div>

        {/* Audience Selection */}
        <div className="space-y-4">
          <div className="space-y-3">
            {presetAudiences.map((audience) => (
              <div key={audience.id} className="flex items-start space-x-3">
                <Checkbox
                  id={audience.id}
                  checked={targetAudience.selected.includes(audience.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(audience.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Label 
                      htmlFor={audience.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {audience.label}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{audience.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-xs text-muted-foreground">
                      ({audience.estimatedSize} of traffic)
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Other option */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="other"
                  checked={targetAudience.selected.includes('other') || showCustomInput}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('other', checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor="other"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Other (specify)
                  </Label>
                </div>
              </div>

              {/* Custom input field */}
              {showCustomInput && (
                <div className="ml-6 space-y-2">
                  <Input
                    ref={customInputRef}
                    value={targetAudience.customAudience || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= 200) {
                        handleCustomAudienceChange(newValue);
                      }
                    }}
                    placeholder="Describe your custom audience segment..."
                    className="w-full"
                    maxLength={200}
                  />
                  <p className={cn(
                    "text-xs",
                    (targetAudience.customAudience?.length ?? 0) > 180 
                      ? "text-orange-500" 
                      : "text-muted-foreground"
                  )}>
                    {targetAudience.customAudience?.length ?? 0}/200 characters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audience Size Estimation */}
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Estimated audience size</p>
              <p className="text-2xl font-bold text-primary">
                {getEstimatedAudienceSize()}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on typical traffic distribution. Actual percentages may vary.
          </p>
        </div>

        {/* Tips */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <span className="text-lg">💡</span> Best practices
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            <li className="flex items-start gap-1">
              <span className="text-muted-foreground/70 mt-0.5">•</span>
              <span>Start with a smaller, specific audience to minimize risk</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-muted-foreground/70 mt-0.5">•</span>
              <span>Ensure your audience is large enough for statistical significance</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-muted-foreground/70 mt-0.5">•</span>
              <span>Consider excluding employees and beta testers from experiments</span>
            </li>
          </ul>
        </div>

        {/* Validation message */}
        {!isValid && targetAudience.selected.length === 0 && !targetAudience.customAudience && (
          <p className="text-sm text-muted-foreground">
            Select at least one audience segment to continue
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}