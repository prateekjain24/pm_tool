import { useState } from "react";
import { cn } from "@/lib/utils";
import { StepProps } from "@/types/hypothesis-builder";
import { AuroraText } from "@/components/ui/aurora-text";
import { MagicCard } from "@/components/ui/magic-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  MousePointer, 
  ShoppingCart,
  BarChart3,
  Plus,
  X,
  Target
} from "lucide-react";

// Predefined metrics with categories
const availableMetrics = [
  {
    id: "conversion-rate",
    name: "Conversion Rate",
    category: "primary",
    icon: TrendingUp,
    description: "Percentage of users who complete the desired action",
    unit: "%"
  },
  {
    id: "revenue-per-user",
    name: "Revenue per User",
    category: "primary",
    icon: DollarSign,
    description: "Average revenue generated per user",
    unit: "$"
  },
  {
    id: "click-through-rate",
    name: "Click-through Rate",
    category: "primary",
    icon: MousePointer,
    description: "Percentage of users who click on a specific element",
    unit: "%"
  },
  {
    id: "add-to-cart-rate",
    name: "Add to Cart Rate",
    category: "primary",
    icon: ShoppingCart,
    description: "Percentage of users who add items to their cart",
    unit: "%"
  },
  {
    id: "time-on-page",
    name: "Time on Page",
    category: "secondary",
    icon: Clock,
    description: "Average time users spend on the page",
    unit: "sec"
  },
  {
    id: "bounce-rate",
    name: "Bounce Rate",
    category: "guardrail",
    icon: BarChart3,
    description: "Percentage of users who leave without interaction",
    unit: "%"
  },
  {
    id: "user-satisfaction",
    name: "User Satisfaction",
    category: "secondary",
    icon: Users,
    description: "User satisfaction score from surveys",
    unit: "pts"
  },
  {
    id: "page-load-time",
    name: "Page Load Time",
    category: "guardrail",
    icon: Clock,
    description: "Time it takes for the page to fully load",
    unit: "ms"
  }
];

export function StepFive({ value, onChange, className }: StepProps) {
  const selectedMetrics = Array.isArray(value) ? value : [];
  const [customMetricName, setCustomMetricName] = useState("");

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      onChange(selectedMetrics.filter(id => id !== metricId));
    } else {
      onChange([...selectedMetrics, metricId]);
    }
  };

  const addCustomMetric = () => {
    if (customMetricName.trim() && !selectedMetrics.includes(`custom-${customMetricName}`)) {
      onChange([...selectedMetrics, `custom-${customMetricName}`]);
      setCustomMetricName("");
    }
  };

  const removeCustomMetric = (metricId: string) => {
    onChange(selectedMetrics.filter(id => id !== metricId));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "primary": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "secondary": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "guardrail": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default: return "text-purple-500 bg-purple-500/10 border-purple-500/20";
    }
  };

  const primaryMetrics = selectedMetrics.filter(id => 
    availableMetrics.find(m => m.id === id)?.category === "primary" || id.startsWith("custom-")
  );
  const secondaryMetrics = selectedMetrics.filter(id => 
    availableMetrics.find(m => m.id === id)?.category === "secondary"
  );
  const guardrailMetrics = selectedMetrics.filter(id => 
    availableMetrics.find(m => m.id === id)?.category === "guardrail"
  );

  return (
    <motion.div 
      className={cn("space-y-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AuroraText className="text-2xl font-semibold">
            How will you measure success?
          </AuroraText>
          <Target className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-base">
          Select metrics to track your experiment's performance. Choose at least one primary metric.
        </p>
      </div>

      {/* Selected metrics summary */}
      {selectedMetrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-lg bg-muted/30 space-y-3"
        >
          <h3 className="text-sm font-medium">Selected Metrics ({selectedMetrics.length})</h3>
          
          <div className="space-y-2">
            {primaryMetrics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Primary:</span>
                {primaryMetrics.map(id => {
                  const metric = availableMetrics.find(m => m.id === id);
                  const isCustom = id.startsWith("custom-");
                  return (
                    <Badge key={id} variant="secondary" className={cn("text-xs", getCategoryColor("primary"))}>
                      {isCustom ? id.replace("custom-", "") : metric?.name}
                      {isCustom && (
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeCustomMetric(id)}
                        />
                      )}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {secondaryMetrics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Secondary:</span>
                {secondaryMetrics.map(id => {
                  const metric = availableMetrics.find(m => m.id === id);
                  return (
                    <Badge key={id} variant="secondary" className={cn("text-xs", getCategoryColor("secondary"))}>
                      {metric?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {guardrailMetrics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">Guardrail:</span>
                {guardrailMetrics.map(id => {
                  const metric = availableMetrics.find(m => m.id === id);
                  return (
                    <Badge key={id} variant="secondary" className={cn("text-xs", getCategoryColor("guardrail"))}>
                      {metric?.name}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Available metrics */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Available Metrics</h3>
        
        <div className="grid gap-3 sm:grid-cols-2">
          <AnimatePresence>
            {availableMetrics.map((metric) => {
              const Icon = metric.icon;
              const isSelected = selectedMetrics.includes(metric.id);
              
              return (
                <motion.div
                  key={metric.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MagicCard
                    className={cn(
                      "cursor-pointer p-4 transition-all",
                      isSelected && "ring-2 ring-primary"
                    )}
                    gradientColor={isSelected ? "#10b98140" : "#10b98110"}
                    onClick={() => toggleMetric(metric.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        getCategoryColor(metric.category)
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{metric.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {metric.unit}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {metric.description}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs capitalize", getCategoryColor(metric.category))}
                        >
                          {metric.category}
                        </Badge>
                      </div>
                    </div>
                  </MagicCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom metric input */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Custom Metric</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customMetricName}
            onChange={(e) => setCustomMetricName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomMetric()}
            placeholder="Enter custom metric name..."
            className="flex-1 px-3 py-2 text-sm rounded-md border bg-background"
          />
          <Button
            onClick={addCustomMetric}
            disabled={!customMetricName.trim()}
            size="sm"
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-lg bg-muted/30 p-4 space-y-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Best Practices
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Choose 1-2 primary metrics directly related to your hypothesis</li>
          <li>• Add 2-3 guardrail metrics to ensure no negative side effects</li>
          <li>• Consider both leading and lagging indicators</li>
          <li>• Ensure metrics are measurable and have sufficient data</li>
        </ul>
      </div>
    </motion.div>
  );
}