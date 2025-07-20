import { ArrowRight, Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const benefits = [
  { text: "Start free for 14 days", icon: Sparkles, color: "blue" },
  { text: "No credit card required", icon: Check, color: "green" },
  { text: "Full feature access", icon: Zap, color: "purple" },
  { text: "Cancel anytime", icon: Check, color: "emerald" },
];

export function CTA() {
  return (
    <section className="py-20 lg:py-24 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* CTA Card */}
        <div className="relative bg-gradient-to-br from-background via-background to-muted/20 rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12 lg:p-16">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-primary/20 opacity-50 blur-3xl" />

          <div className="relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 text-sm font-medium text-primary mb-6 border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span>Limited time offer</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--gradient-dark), var(--gradient-medium))",
                }}
              >
                Ready to bring scientific rigor
              </span>
              <br />
              <span className="text-muted-foreground">to your experiments?</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join <span className="text-primary font-semibold">500+ product teams</span> who've
              increased their experiment success rate by 25%.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
              {benefits.map((benefit, _index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl",
                      "bg-gradient-to-br from-background to-muted/30",
                      "border border-border/50",
                      "hover:shadow-lg transition-all duration-300",
                      "group cursor-pointer",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        benefit.color === "blue" &&
                          "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                        benefit.color === "green" &&
                          "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                        benefit.color === "purple" &&
                          "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                        benefit.color === "emerald" &&
                          "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8"
              >
                Get early access
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 hover:bg-muted/50 transition-all duration-300 px-8"
              >
                Schedule a demo
              </Button>
            </div>

            {/* Trust text */}
            <p className="text-sm text-muted-foreground mt-8">
              🔒 Enterprise-grade security • SOC2 compliant • GDPR ready
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
