import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StepProps, CHARACTER_LIMITS, VALIDATION_MESSAGES } from "@/types/hypothesis-builder";
import { AuroraText } from "@/components/ui/aurora-text";
import { MagicCard } from "@/components/ui/magic-card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Lightbulb } from "lucide-react";

// Example changes for inspiration
const changeExamples = [
  { 
    title: "Visual Design",
    examples: [
      "Change checkout button color to green",
      "Add trust badges below the price",
      "Redesign the product card layout"
    ]
  },
  { 
    title: "User Experience",
    examples: [
      "Add a progress bar to the checkout flow",
      "Show estimated delivery time on product pages",
      "Implement one-click checkout for returning users"
    ]
  },
  { 
    title: "Content & Messaging",
    examples: [
      "Update CTA text from 'Buy Now' to 'Add to Cart'",
      "Add urgency messaging for limited stock items",
      "Show product recommendations on the cart page"
    ]
  }
];

export function StepOne({ value, onChange, className }: StepProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervention = typeof value === 'string' ? value : '';
  const characterCount = intervention.length;
  const maxCharacters = CHARACTER_LIMITS.intervention;
  const remainingCharacters = maxCharacters - characterCount;
  
  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Determine character counter color
  const getCharacterCountColor = () => {
    if (remainingCharacters < 10) return "text-destructive";
    if (remainingCharacters < 100) return "text-orange-500";
    return "text-muted-foreground";
  };

  // Validation
  const isValid = intervention.trim().length >= 10;
  const showError = intervention.length > 0 && !isValid;

  return (
    <motion.div 
      className={cn("space-y-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with aurora text */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AuroraText className="text-2xl font-semibold">
            What change do you want to test?
          </AuroraText>
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-base">
          Describe the specific change or feature you want to experiment with. Be as clear and specific as possible.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-2">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={intervention}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= maxCharacters) {
                onChange(newValue);
              }
            }}
            placeholder="Describe your change... (e.g., 'Change the checkout button from blue to green')"
            className={cn(
              "min-h-[120px] resize-none pr-20",
              showError && "border-destructive focus-visible:ring-destructive"
            )}
            aria-label="Change description"
            aria-describedby="character-count"
            maxLength={maxCharacters}
          />
          
          {/* Character counter - positioned absolutely */}
          <div 
            id="character-count"
            className={cn(
              "absolute bottom-2 right-2 text-xs font-medium",
              getCharacterCountColor()
            )}
          >
            {characterCount}/{maxCharacters}
          </div>
        </div>
        
        {/* Error message */}
        {showError && (
          <p className="text-sm text-destructive">
            {intervention.trim().length === 0 
              ? VALIDATION_MESSAGES.required 
              : VALIDATION_MESSAGES.tooShort}
          </p>
        )}
      </div>

      {/* Examples section with magic cards */}
      <div className="space-y-4">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Need inspiration?
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {changeExamples.map((category, idx) => (
            <MagicCard
              key={idx}
              className="cursor-pointer p-5 space-y-3"
              gradientColor="#10b98120"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{category.title}</h4>
                <Badge variant="secondary" className="text-xs">
                  {category.examples.length} ideas
                </Badge>
              </div>
              <ul className="space-y-2">
                {category.examples.map((example, exIdx) => (
                  <motion.li 
                    key={exIdx}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      type="button"
                      onClick={() => onChange(example)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left w-full flex items-start gap-2 group"
                    >
                      <span className="text-primary/50 group-hover:text-primary transition-colors">→</span>
                      <span>{example}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </MagicCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}