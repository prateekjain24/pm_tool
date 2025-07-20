"use client";

import { motion } from "motion/react";
import { useId } from "react";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.2,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();

  const squares = Array.from({ length: numSquares }, (_, i) => ({
    id: i,
    x: Math.random() * width - width / 2,
    y: Math.random() * height - height / 2,
  }));

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path
            d={`M.5,${height}V.5H${width}`}
            fill="none"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeDasharray={strokeDasharray}
            strokeWidth={0.5}
            className="dark:stroke-white/10"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <g className="fill-blue-500/10 dark:fill-blue-400/10">
        {squares.map((square) => (
          <motion.rect
            key={square.id}
            width={width * 0.9}
            height={height * 0.9}
            x={square.x + (width / 2) * Math.floor(Math.random() * 20)}
            y={square.y + (height / 2) * Math.floor(Math.random() * 20)}
            animate={{
              opacity: [0, maxOpacity, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: Math.random() * duration,
              repeatDelay,
              ease: "easeInOut",
            }}
          />
        ))}
      </g>
    </svg>
  );
}
