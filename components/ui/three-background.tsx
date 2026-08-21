"use client";
import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  // Natural wandering trajectory
  roamVx: number;
  roamVy: number;
  // Mouse displacement offset (softly decays to 0 over 3-4s without bouncing)
  offsetX: number;
  offsetY: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
  glowColor?: string;
  isBright: boolean;
}

export const ThreeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & interaction
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      radius: 140,
    };

    // Starlight palette (Delicate white, ethereal lavender, subtle cyan, warm stellar gold)
    const starColors = [
      "255, 255, 255",   // Starlight White
      "216, 180, 254",   // Soft Lavender Violet
      "186, 230, 253",   // Ethereal Ice Cyan
      "254, 240, 138",   // Warm Stellar Gold
      "192, 132, 252",   // Faint Purple
    ];

    // 450 - 600 stars on desktop, 180 on mobile (Looks like a vast deep starry cosmos)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const starCount = isMobile ? 180 : Math.min(550, Math.floor((width * height) / 2800));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const isBright = Math.random() < 0.15; // 15% are slightly brighter anchor stars

      // Gentle, slow cosmic roaming drift
      const speed = (0.08 + Math.random() * 0.18) * (isBright ? 1.2 : 0.8);
      const angle = Math.random() * Math.PI * 2;
      const size = isBright ? 1.2 + Math.random() * 0.8 : 0.5 + Math.random() * 0.7;
      const baseAlpha = isBright ? 0.35 + Math.random() * 0.25 : 0.12 + Math.random() * 0.22;

      stars.push({
        x,
        y,
        roamVx: Math.cos(angle) * speed,
        roamVy: Math.sin(angle) * speed - 0.04, // Subtle upward starlight drift
        offsetX: 0,
        offsetY: 0,
        size,
        baseAlpha,
        alpha: baseAlpha,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.015 + Math.random() * 0.035,
        color,
        glowColor: isBright ? `rgba(${color}, 0.4)` : undefined,
        isBright,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    const render = () => {
      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Render Stars with subtle non-intrusive glow
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // 1. Natural Organic Starlight Roaming throughout the universe
        star.x += star.roamVx;
        star.y += star.roamVy;

        // Seamless wrap-around screen bounds
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;

        // 2. Gentle Cursor Deflection (Soft fluid push, NO BOUNCING)
        const currentDrawX = star.x + star.offsetX;
        const currentDrawY = star.y + star.offsetY;

        const dx = currentDrawX - mouse.x;
        const dy = currentDrawY - mouse.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = mouse.radius * mouse.radius;

        if (distSq < radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          const pushAngle = Math.atan2(dy, dx);

          // Smooth viscous push
          star.offsetX += Math.cos(pushAngle) * force * 2.2;
          star.offsetY += Math.sin(pushAngle) * force * 2.2;
        }

        // 3. SMOOTH ASYMPTOTIC RESTORATION (Decays to 0 over 3-4 seconds with ZERO bouncing)
        // 0.985 factor: at 60fps, 0.985^180 ≈ 0.065 (Smooth 3-4s ease back)
        star.offsetX *= 0.983;
        star.offsetY *= 0.983;

        // 4. Subtle Natural Starlight Twinkling
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.15;
        star.alpha = Math.max(0.06, Math.min(0.7, star.baseAlpha + twinkle));

        // 5. Draw Star Particle (Crisp, delicate, non-dominant)
        const renderX = star.x + star.offsetX;
        const renderY = star.y + star.offsetY;

        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.alpha})`;

        if (star.isBright && star.glowColor) {
          ctx.shadowColor = star.glowColor;
          ctx.shadowBlur = 3;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full select-none opacity-85"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
};
