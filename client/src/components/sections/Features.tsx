import { Brain, CheckCircle, BarChart3, FileText, TestTube2, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "hypothesis-builder",
    title: "Hypothesis Builder",
    metric: "90%",
    metricLabel: "better hypotheses",
    description: "Guide your team through structured hypothesis creation with real-time quality scoring.",
    icon: Brain,
    accent: "blue",
    gradient: "from-blue-500 to-cyan-500",
    background: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: "pre-test-validator",
    title: "Pre-Test Validator",
    metric: "80%",
    metricLabel: "fewer failed tests",
    description: "Catch experiment design flaws before launch with automated validation.",
    icon: CheckCircle,
    accent: "emerald",
    gradient: "from-emerald-500 to-green-500",
    background: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  {
    id: "post-test-analyzer",
    title: "Post-Test Analyzer",
    metric: "2x",
    metricLabel: "faster insights",
    description: "Ensure statistical and practical significance with guided analysis.",
    icon: BarChart3,
    accent: "purple",
    gradient: "from-purple-500 to-pink-500",
    background: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    id: "smart-prd-generator",
    title: "Smart PRD Generator",
    metric: "75%",
    metricLabel: "time saved",
    description: "AI-powered PRD creation that never misses critical details.",
    icon: FileText,
    accent: "orange",
    gradient: "from-orange-500 to-red-500",
    background: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    id: "test-document-builder",
    title: "A/B Test Docs",
    metric: "100%",
    metricLabel: "compliance",
    description: "Standardized documentation linked to hypotheses and results.",
    icon: TestTube2,
    accent: "indigo",
    gradient: "from-indigo-500 to-purple-500",
    background: "bg-indigo-50 dark:bg-indigo-950/20",
  },
];

interface FeatureCardProps {
  feature: typeof features[0];
  className?: string;
  index: number;
}

function FeatureCard({ feature, className, index }: FeatureCardProps) {
  const Icon = feature.icon;
  
  return (
    <div
      className={cn(
        "group relative p-4 md:p-5 rounded-xl border border-border/50",
        "transition-all duration-200 ease-out",
        "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5",
        "hover:border-border",
        "cursor-pointer overflow-hidden",
        feature.background,
        className
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        `bg-gradient-to-br ${feature.gradient}`
      )} style={{ opacity: 0.03 }} />

      <div className="relative z-10 flex gap-4 md:gap-5">
        {/* Left column: Icon + Metric */}
        <div className="flex-shrink-0 w-20 md:w-24">
          <div className={cn(
            "p-2 rounded-lg mb-2",
            `bg-gradient-to-br ${feature.gradient}`,
            "text-white shadow-md"
          )}>
            <Icon className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <div className={cn(
              "text-2xl md:text-3xl font-bold tracking-tight leading-none",
              "bg-gradient-to-br",
              feature.gradient,
              "bg-clip-text text-transparent"
            )}>
              {feature.metric}
            </div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">
              {feature.metricLabel}
            </div>
          </div>
        </div>

        {/* Right column: Title + Description */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold mb-1.5 flex items-center gap-1.5">
            {feature.title}
            <ArrowUpRight className="w-3 h-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="pt-6 pb-16 lg:pt-8 lg:pb-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="max-w-2xl mb-8 lg:mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for modern product teams
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature designed to bring scientific rigor to your product development process.
          </p>
        </div>

        {/* Features grid - Balanced layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* First row - 2 cards */}
          <FeatureCard 
            feature={features[0]} 
            className="animate-in fade-in slide-in-from-bottom-3"
            index={0}
          />
          <FeatureCard 
            feature={features[1]} 
            className="animate-in fade-in slide-in-from-bottom-3"
            index={1}
          />
          
          {/* Second row - 2 cards */}
          <FeatureCard 
            feature={features[2]} 
            className="animate-in fade-in slide-in-from-bottom-3"
            index={2}
          />
          <FeatureCard 
            feature={features[3]} 
            className="animate-in fade-in slide-in-from-bottom-3"
            index={3}
          />
          
          {/* Third row - 1 card centered */}
          <FeatureCard 
            feature={features[4]} 
            className="md:col-span-2 animate-in fade-in slide-in-from-bottom-3"
            index={4}
          />
        </div>
      </div>
    </section>
  );
}