"use client";

import type React from "react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  ...props
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={
        {
          "--gradient-size": `${gradientSize}px`,
          "--gradient-color": gradientColor,
          "--gradient-opacity": gradientOpacity,
        } as React.CSSProperties
      }
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-background transition-colors hover:border-primary/50",
        "before:pointer-events-none before:absolute before:-inset-px before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 before:content-['']",
        "before:bg-[radial-gradient(var(--gradient-size)_circle_at_var(--x)_var(--y),rgba(255,255,255,0.1),transparent_50%)]",
        "hover:before:opacity-100",
        className,
      )}
      {...props}
    >
      <div className="relative">{children}</div>
    </div>
  );
}
