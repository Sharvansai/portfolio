"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

interface HeroMaskProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isHovered: boolean;
  onRevealRatio?: (ratio: number) => void;
}

export const HeroMask: React.FC<HeroMaskProps> = ({
  containerRef,
  isHovered,
  onRevealRatio,
}) => {
  const maskPathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const contourPathRef = useRef<SVGPathElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);

  // Track physics state in refs for 60-120fps execution without React re-renders
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
    baseRadius: 180,
    targetRadius: 180,
    currentRadius: 180,
    time: 0,
    isActive: false,
    hasMoved: false,
    width: 600,
    height: 900,
  });

  // Helper: create smooth closed cubic spline path from points
  const pointsToPath = useCallback((pts: { x: number; y: number }[]) => {
    const len = pts.length;
    if (len < 3) return "";

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < len; i++) {
      const p0 = pts[(i - 1 + len) % len];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % len];
      const p3 = pts[(i + 2) % len];

      // Catmull-Rom to Cubic Bezier control points
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
    state.currentX = state.targetX = rect.width * 0.5;
    state.currentY = state.targetY = rect.height * 0.42;

    const canvas = particlesCanvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvas) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx = canvas.getContext("2d");
    }

    // Floating particles around the mask perimeter
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      angle: Math.random() * Math.PI * 2,
      distOffset: (Math.random() - 0.5) * 40,
      size: 1 + Math.random() * 2,
      speed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
      alpha: 0.2 + Math.random() * 0.6,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Mouse / Pointer Move listener
    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      state.targetX = clientX - r.left;
      state.targetY = clientY - r.top;
      state.hasMoved = true;
      state.isActive = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      state.isActive = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave);

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

    // GSAP Ticker animation loop
    const tickerCallback = () => {
      if (prefersReducedMotion) {
        if (maskPathRef.current) {
          const rx = state.width * 0.35;
          const ry = state.height * 0.3;
          maskPathRef.current.setAttribute(
            "d",
            `M ${state.width * 0.5 - rx} ${state.height * 0.45} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 -${rx * 2} 0`
          );
        }
        return;
      }

      state.time += 0.035;

      // Adjust target radius depending on hover and location
      if (isHovered) {
        state.targetRadius = 240;
      } else if (state.isActive) {
        state.targetRadius = 190;
      } else {
        // Idle gentle breathing mode
        state.targetRadius = 150 + Math.sin(state.time * 0.8) * 15;
      }

      // Smooth lerping
      const lerpPos = 0.14;
      state.currentX += (state.targetX - state.currentX) * lerpPos;
      state.currentY += (state.targetY - state.currentY) * lerpPos;

      // Calculate velocity for stretching
      state.vx = state.currentX - state.prevX;
      state.vy = state.currentY - state.prevY;
      state.speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
      state.prevX = state.currentX;
      state.prevY = state.currentY;

      state.currentRadius += (state.targetRadius - state.currentRadius) * 0.1;

      // Calculate organic control points (10 points)
      const numPoints = 10;
      const pts: { x: number; y: number }[] = [];
      const moveAngle = Math.atan2(state.vy, state.vx);
      const stretchFactor = Math.min(0.45, state.speed / 35);

      for (let i = 0; i < numPoints; i++) {
        const phi = (i / numPoints) * Math.PI * 2;
        // Directional stretch based on movement vector
        const stretch = 1 + stretchFactor * Math.cos(phi - moveAngle);
        // Organic undulating ripples
        const wave1 = Math.sin(phi * 3 + state.time) * 0.07;
        const wave2 = Math.cos(phi * 4 - state.time * 1.2) * 0.05;
        const r = state.currentRadius * stretch * (1 + wave1 + wave2);

        pts.push({
          x: state.currentX + Math.cos(phi) * r,
          y: state.currentY + Math.sin(phi) * r,
        });
      }

      const pathData = pointsToPath(pts);

      // 1. Update SVG Mask Path
      if (maskPathRef.current) {
        maskPathRef.current.setAttribute("d", pathData);
      }

      // 2. Update Glow rim path
      if (glowPathRef.current) {
        glowPathRef.current.setAttribute("d", pathData);
      }

      // 3. Update Fine contour path (slightly expanded with phase shift)
      if (contourPathRef.current) {
        const contourPts = pts.map((p, idx) => {
          const phi = (idx / numPoints) * Math.PI * 2;
          const rOffset = 14 + Math.sin(phi * 5 + state.time * 1.5) * 4;
          return {
            x: p.x + Math.cos(phi) * rOffset,
            y: p.y + Math.sin(phi) * rOffset,
          };
        });
        contourPathRef.current.setAttribute("d", pointsToPath(contourPts));
      }

      // 4. Render rim micro-particles on canvas
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
          ctx.shadowColor = "rgba(168, 85, 247, 0.8)";
          ctx.shadowBlur = 6;
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
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [containerRef, isHovered, pointsToPath]);

  return (
    <>
      {/* SVG Definitions containing the mask */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <filter id="maskBlurFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>

          <mask id="heroPortalMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            {/* White background reveals, black hides */}
            <rect width="100%" height="100%" fill="black" />
            <path
              ref={maskPathRef}
              fill="white"
              filter="url(#maskBlurFilter)"
            />
          </mask>
        </defs>
      </svg>

      {/* SVG Vector Edge Enhancements Overlay (Glow + Contours) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full z-10 select-none overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 3: Atmospheric Purple Glow Edge */}
        <path
          ref={glowPathRef}
          fill="none"
          stroke="rgba(192, 132, 252, 0.45)"
          strokeWidth="3.5"
          style={{
            filter: "drop-shadow(0 0 14px rgba(168, 85, 247, 0.75)) drop-shadow(0 0 28px rgba(147, 51, 234, 0.45))",
          }}
        />

        {/* Layer 4: Fine Technical Contour Line */}
        <path
          ref={contourPathRef}
          fill="none"
          stroke="rgba(192, 132, 252, 0.25)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Layer 5: Ambient Scanning Micro-Particles Canvas */}
      <canvas
        ref={particlesCanvasRef}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full select-none"
      />
    </>
  );
};
