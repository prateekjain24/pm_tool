import { Logo, LogoIcon, LogoAnimated } from "@/components/ui/logo";

export function LogoDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold mb-8">PM Tools Logo System</h1>

        {/* Main Logo Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Main Logo Variants</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">Default</h3>
              <Logo size="md" showText animated />
            </div>
            
            <div className="p-6 border rounded-lg bg-primary space-y-4">
              <h3 className="font-medium text-sm text-primary-foreground/70">White</h3>
              <Logo size="md" showText animated variant="white" />
            </div>
            
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">Gradient</h3>
              <Logo size="md" showText animated variant="gradient" />
            </div>
          </div>
        </section>

        {/* Size Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Size Variants</h2>
          
          <div className="flex items-end gap-8 flex-wrap">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Small</p>
              <Logo size="sm" showText animated />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Medium</p>
              <Logo size="md" showText animated />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Large</p>
              <Logo size="lg" showText animated />
            </div>
          </div>
        </section>

        {/* Icon Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Icon Only</h2>
          
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Small</p>
              <LogoIcon size="sm" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Medium</p>
              <LogoIcon size="md" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Large</p>
              <LogoIcon size="lg" />
            </div>
          </div>
        </section>

        {/* Animated Loading Logo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Animated Loading State</h2>
          
          <div className="p-8 border rounded-lg bg-muted/20">
            <LogoAnimated size="lg" />
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-3">Header Usage</h3>
              <div className="bg-background border-b p-4">
                <Logo size="md" showText animated />
              </div>
            </div>
            
            <div className="p-6 border rounded-lg bg-slate-900">
              <h3 className="font-medium mb-3 text-white">Dark Background</h3>
              <div className="p-4">
                <Logo size="md" showText animated variant="white" />
              </div>
            </div>
          </div>
        </section>

        {/* Animation States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Animation States</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-medium">With Animation (Hover Me)</h3>
              <Logo size="lg" showText animated />
              <p className="text-sm text-muted-foreground">
                Idle: Subtle glow on dots, arrow pulse<br />
                Hover: Dots brighten, arrow moves forward
              </p>
            </div>
            
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-medium">Without Animation</h3>
              <Logo size="lg" showText animated={false} />
              <p className="text-sm text-muted-foreground">
                Static version for reduced motion preference
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}