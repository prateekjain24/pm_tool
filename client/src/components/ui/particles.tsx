"use client";

import { useEffect, useState } from "react";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

export function Particles({
  className = "",
  quantity = 100,
  // staticity = 50,
  // ease = 50,
  size = 0.4,
  // refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [particles, setParticles] = useState<any[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    }

    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("particles-canvas") as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      setContext(ctx);
    }
  }, []);

  useEffect(() => {
    if (context && canvasSize.width && canvasSize.height) {
      const newParticles = [];
      for (let i = 0; i < quantity; i++) {
        newParticles.push({
          x: Math.random() * canvasSize.width,
          y: Math.random() * canvasSize.height,
          translateX: 0,
          translateY: 0,
          size: Math.random() * 2 + size,
          alpha: Math.random() * 0.5 + 0.5,
          targetAlpha: Math.random() * 0.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.2 + vx * 0.5,
          dy: (Math.random() - 0.5) * 0.2 + vy * 0.5,
          magnetism: 0.1 + Math.random() * 4,
        });
      }
      setParticles(newParticles);
    }
  }, [context, quantity, canvasSize, size, vx, vy]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (context) {
      let animationFrame: number;

      const render = () => {
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);

        particles.forEach((particle, i) => {
          const distanceFromMouse = Math.hypot(
            particle.x - mousePosition.x,
            particle.y - mousePosition.y,
          );

          if (distanceFromMouse < 200) {
            const angle = Math.atan2(particle.y - mousePosition.y, particle.x - mousePosition.x);
            const force = (200 - distanceFromMouse) * 0.01;
            particle.dx += Math.cos(angle) * force * particle.magnetism;
            particle.dy += Math.sin(angle) * force * particle.magnetism;
          }

          particle.x += particle.dx;
          particle.y += particle.dy;

          particle.translateX *= 0.95;
          particle.translateY *= 0.95;

          particle.dx *= 0.98;
          particle.dy *= 0.98;

          if (
            particle.x < 0 ||
            particle.x > canvasSize.width ||
            particle.y < 0 ||
            particle.y > canvasSize.height
          ) {
            particle.x = Math.random() * canvasSize.width;
            particle.y = Math.random() * canvasSize.height;
            particle.dx = (Math.random() - 0.5) * 0.2 + vx * 0.5;
            particle.dy = (Math.random() - 0.5) * 0.2 + vy * 0.5;
          }

          context.save();
          context.translate(particle.x + particle.translateX, particle.y + particle.translateY);
          context.beginPath();
          context.arc(0, 0, particle.size, 0, 2 * Math.PI);
          context.fillStyle = color;
          context.globalAlpha = particle.alpha;
          context.fill();
          context.restore();

          particles[i] = particle;
        });

        animationFrame = requestAnimationFrame(render);
      };

      render();

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [particles, context, mousePosition, color, canvasSize, vx, vy]);

  return (
    <canvas
      id="particles-canvas"
      className={`pointer-events-none absolute inset-0 ${className}`}
      width={canvasSize.width}
      height={canvasSize.height}
    />
  );
}
