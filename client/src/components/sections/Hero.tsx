import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-small-black/[0.02] dark:bg-grid-small-white/[0.02]" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo with enhanced presentation */}
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative bg-background/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                <Logo size="lg" animated className="relative" />
              </div>
            </div>
          </div>

          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 text-sm font-medium mb-8 shadow-sm" style={{ color: 'var(--badge-green)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Now in early access
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Main headline with gradient */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="block bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--gradient-dark), var(--gradient-medium))' }}>
              Scientific rigor for
            </span>
            <span className="block text-muted-foreground">product experiments</span>
          </h1>

          {/* Enhanced subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform hypothesis creation, validate experiments before launch, and analyze results with confidence. 
            <span className="text-foreground font-medium"> Built for modern product teams.</span>
          </p>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              Start building hypotheses
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2"
            >
              See how it works
            </Button>
          </div>

          {/* Enhanced trust indicators */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/20" style={{ color: 'var(--badge-green)' }}>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-medium">25% higher success rate</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/20" style={{ color: 'var(--badge-blue)' }}>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-medium">2 hours → 30 minutes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/20" style={{ color: 'var(--badge-purple)' }}>
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="font-medium">Trusted by 500+ teams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </section>
  );
}