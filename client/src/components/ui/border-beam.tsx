"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = "#00000000",
  colorTo = "#FFFFFF",
  reverse = false,
  initialOffset = 0,
  borderWidth = 2,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--delay": delay,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--initial-offset": initialOffset,
          "--border-width": borderWidth,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[var(--size)] after:animate-border-beam",
        "[animation-delay:var(--delay)]",
        reverse && "after:animate-border-beam-reverse",
        className,
      )}
    >
      <div
        className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-[var(--color-from)] to-[var(--color-to)]"
        style={{
          padding: `calc(var(--border-width) * 1px)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}
