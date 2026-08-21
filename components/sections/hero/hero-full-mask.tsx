"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

interface HeroFullMaskProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export const HeroFullMask: React.FC<HeroFullMaskProps> = ({ containerRef }) => {
  const maskPathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const contourPathRef = useRef<SVGPathElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    currentRadius: 220,
    targetRadius: 220,
    time: 0,
    width: 1920,
    height: 1080,
    hasMoved: false,
  });

  const pointsToPath = useCallback((pts: { x: number; y: number }[]) => {
    const len = pts.length;
    if (len < 3) return "";

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < len; i++) {
      const p0 = pts[(i - 1 + len) % len];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % len];
      const p3 = pts[(i + 2) % len];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d + " Z";
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const state = stateRef.current;
    const rect = container.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    state.currentX = state.targetX = rect.width * 0.55;
    state.currentY = state.targetY = rect.height * 0.45;

    const canvas = particlesCanvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvas) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx = canvas.getContext("2d");
    }

    const particleCount = 36;
    const particles = Array.from({ length: particleCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      distOffset: (Math.random() - 0.5) * 50,
      size: 1 + Math.random() * 2.5,
      speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      alpha: 0.2 + Math.random() * 0.7,
      pulse: Math.random() * Math.PI * 2,
    }));

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      state.targetX = clientX - r.left;
      state.targetY = clientY - r.top;
      state.hasMoved = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const onResize = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      state.width = r.width;
      state.height = r.height;
      if (canvas) {
        canvas.width = r.width;
        canvas.height = r.height;
      }
    };
    window.addEventListener("resize", onResize);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tickerCallback = () => {
      if (prefersReducedMotion) {
        if (maskPathRef.current) {
          const rx = state.width * 0.4;
          const ry = state.height * 0.4;
          maskPathRef.current.setAttribute(
            "d",
            `M ${state.width * 0.5 - rx} ${state.height * 0.5} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 -${rx * 2} 0`
          );
        }
        return;
      }

      state.time += 0.035;

      // Base radius with subtle organic breathing
      state.targetRadius = 240 + Math.sin(state.time * 0.7) * 15;

      // Smooth lerp
      const lerpPos = 0.14;
      state.currentX += (state.targetX - state.currentX) * lerpPos;
      state.currentY += (state.targetY - state.currentY) * lerpPos;

      // Velocity calculation
      state.vx = state.currentX - state.prevX;
      state.vy = state.currentY - state.prevY;
      state.speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
      state.prevX = state.currentX;
      state.prevY = state.currentY;

      state.currentRadius += (state.targetRadius - state.currentRadius) * 0.1;

      // Calculate organic 12-point spline
      const numPoints = 12;
      const pts: { x: number; y: number }[] = [];
      const moveAngle = Math.atan2(state.vy, state.vx);
      const stretchFactor = Math.min(0.45, state.speed / 30);

      for (let i = 0; i < numPoints; i++) {
        const phi = (i / numPoints) * Math.PI * 2;
        const stretch = 1 + stretchFactor * Math.cos(phi - moveAngle);
        const wave1 = Math.sin(phi * 3 + state.time) * 0.08;
        const wave2 = Math.cos(phi * 4 - state.time * 1.2) * 0.05;
        const r = state.currentRadius * stretch * (1 + wave1 + wave2);

        pts.push({
          x: state.currentX + Math.cos(phi) * r,
          y: state.currentY + Math.sin(phi) * r,
        });
      }

      const pathData = pointsToPath(pts);

      // 1. Update Full-Page SVG Mask Path
      if (maskPathRef.current) {
        maskPathRef.current.setAttribute("d", pathData);
      }

      // 2. Update Atmospheric Glow Edge Path
      if (glowPathRef.current) {
        glowPathRef.current.setAttribute("d", pathData);
      }

      // 3. Update Fine Technical Contour Line
      if (contourPathRef.current) {
        const contourPts = pts.map((p, idx) => {
          const phi = (idx / numPoints) * Math.PI * 2;
          const rOffset = 16 + Math.sin(phi * 5 + state.time * 1.5) * 5;
          return {
            x: p.x + Math.cos(phi) * rOffset,
            y: p.y + Math.sin(phi) * rOffset,
          };
        });
        contourPathRef.current.setAttribute("d", pointsToPath(contourPts));
      }

      // 4. Render Scanning Micro-Particles Canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.angle += p.speed;
          p.pulse += 0.05;
          const currentA = Math.sin(p.pulse) * 0.3 + p.alpha;

          const baseR = state.currentRadius + p.distOffset;
          const px = state.currentX + Math.cos(p.angle) * baseR;
          const py = state.currentY + Math.sin(p.angle) * baseR;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(192, 132, 252, ${Math.max(0.1, currentA)})`;
          ctx.shadowColor = "rgba(168, 85, 247, 0.9)";
          ctx.shadowBlur = 8;
          ctx.fill();
        }
      }
    };

    gsap.ticker.add(tickerCallback);

    return () => {
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
    };
  }, [containerRef, pointsToPath]);

  return (
    <>
      {/* Global Full-Page Hero SVG Mask Definition */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id="heroFullBlurFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>

          <mask id="heroFullPagePortalMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="black" />
            <path
              ref={maskPathRef}
              fill="white"
              filter="url(#heroFullBlurFilter)"
            />
          </mask>
        </defs>
      </svg>

      {/* Full-Page Portal Perimeter Vector Glowing Ring */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full z-30 select-none overflow-visible"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Layer 1: Radiant Laser Purple Rim */}
        <path
          ref={glowPathRef}
          fill="none"
          stroke="rgba(192, 132, 252, 0.55)"
          strokeWidth="3"
          style={{
            filter: "drop-shadow(0 0 16px rgba(168, 85, 247, 0.85)) drop-shadow(0 0 32px rgba(147, 51, 234, 0.5))",
          }}
        />

        {/* Layer 2: Technical Dashed Orbit Line */}
        <path
          ref={contourPathRef}
          fill="none"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Full-Page Ambient Perimeter Particles Canvas */}
      <canvas
        ref={particlesCanvasRef}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none"
        aria-hidden="true"
      />
    </>
  );
};
