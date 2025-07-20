import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "gradient";
  animated?: boolean;
  showText?: boolean;
}

export function Logo({
  size = "md",
  variant = "default",
  animated = false,
  showText = false,
  className,
  ...props
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const colorVariants = {
    default: "text-primary",
    white: "text-white",
    gradient: "text-primary",
  };

  return (
    <div className="flex items-center gap-2 group">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="PM Tools Logo"
        className={cn(
          sizeClasses[size],
          colorVariants[variant],
          animated && "transition-transform duration-200 ease-out group-hover:scale-110",
          className,
        )}
        {...props}
      >
        {/* Ultra-minimal design: Three lines transforming into arrow */}
        <path
          d="M4 6L14 6M4 12L20 12L16 8M20 12L16 16M4 18L10 18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span
          className={cn(
            "font-semibold transition-colors duration-200",
            textSizeClasses[size],
            colorVariants[variant],
            animated && "group-hover:text-primary/80",
          )}
        >
          PM Tools
        </span>
      )}
    </div>
  );
}

// Icon-only variant (same as main logo but guaranteed no text)
export function LogoIcon({
  size = "sm",
  variant = "default",
  animated = false,
  className,
  ...props
}: Omit<LogoProps, "showText">) {
  return (
    <Logo
      size={size}
      variant={variant}
      animated={animated}
      showText={false}
      className={className}
      {...props}
    />
  );
}

// Simple animated variant
export function LogoAnimated({
  size = "md",
  variant = "default",
  className,
  ...props
}: Omit<LogoProps, "showText" | "animated">) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorVariants = {
    default: "text-primary",
    white: "text-white",
    gradient: "text-primary",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PM Tools Logo"
      className={cn(sizeClasses[size], colorVariants[variant], "animate-pulse", className)}
      {...props}
    >
      <path
        d="M4 6L14 6M4 12L20 12L16 8M20 12L16 16M4 18L10 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
