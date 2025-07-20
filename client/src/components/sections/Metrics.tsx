import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const metrics = [
  {
    value: 25,
    suffix: "%",
    label: "Higher success rate",
    description: "More conclusive A/B tests that drive real impact",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    background: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    value: 30,
    suffix: "min",
    label: "Hypothesis creation",
    description: "Down from 2 hours with traditional methods",
    color: "emerald",
    gradient: "from-emerald-500 to-green-500",
    background: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  {
    value: 80,
    suffix: "%",
    label: "Pre-launch catch rate",
    description: "Flawed experiments identified before resources are wasted",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    background: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    value: 90,
    suffix: "%+",
    label: "Documentation quality",
    description: "Consistent adherence to best practices across teams",
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    background: "bg-orange-50 dark:bg-orange-950/20",
  },
];

const companies = [
  { name: "Linear", className: "font-medium hover:text-primary" },
  { name: "Vercel", className: "font-medium hover:text-primary" },
  { name: "Stripe", className: "font-medium hover:text-primary" },
  { name: "Notion", className: "font-medium hover:text-primary" },
  { name: "Figma", className: "font-medium hover:text-primary" },
];

function AnimatedNumber({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateNumber = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - (1 - progress) ** 3;
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    updateNumber();
  }, [value, duration]);

  return <>{displayValue}</>;
}

export function Metrics() {
  return (
    <section className="pt-16 pb-6 lg:pt-20 lg:pb-8 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="max-w-2xl mb-12 lg:mb-16">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Proven impact, measured results
          </h2>
          <p className="text-lg text-muted-foreground">
            Join hundreds of product teams who've transformed their experimentation process.
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={cn(
                "relative p-6 rounded-2xl border border-border/50",
                "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5",
                "hover:-translate-y-0.5 transition-all duration-300",
                "group cursor-pointer overflow-hidden",
                metric.background,
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  `bg-gradient-to-br ${metric.gradient}`,
                )}
                style={{ opacity: 0.05 }}
              />

              {/* Decorative element */}
              <div className="absolute -right-4 -top-4 w-24 h-24 opacity-10">
                <div
                  className={cn(
                    "w-full h-full rounded-full",
                    `bg-gradient-to-br ${metric.gradient}`,
                  )}
                />
              </div>

              <div className="relative z-10">
                <div
                  className={cn(
                    "text-4xl md:text-5xl font-bold tracking-tight mb-2",
                    "bg-gradient-to-br",
                    metric.gradient,
                    "bg-clip-text text-transparent",
                  )}
                >
                  <AnimatedNumber value={metric.value} />
                  {metric.suffix}
                </div>
                <h3 className="text-base font-semibold mb-1">{metric.label}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 md:p-10 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by product teams at leading companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
              {companies.map((company, _index) => (
                <div
                  key={company.name}
                  className={cn(
                    "text-xl text-muted-foreground/60 transition-all duration-300",
                    company.className,
                  )}
                >
                  {company.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
