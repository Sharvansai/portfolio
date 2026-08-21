"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * World-Class Starburst SVG Mask Aperture & Chromatic Portal
 * Spans across Hero & About sections with glowing chromatic edge rays,
 * neon aura reveal, and dual-layer interactive lighting that sits over the viewport.
 */
export const GlobalSvgMask: React.FC = () => {
  const maskBackdropRef = useRef<HTMLDivElement>(null);
  const maskOverlayRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdropEl = maskBackdropRef.current;
    const overlayEl = maskOverlayRef.current;
    const glowEl = glowRingRef.current;

    let animId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let rotation = 0;
    let isVisible = false;
    let isInHeroAbout = true;
    const maskSize = 420; // Expanded Starburst SVG mask aperture

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        currentX = mouseX;
        currentY = mouseY;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleScroll = () => {
      const projectsEl = document.getElementById("projects");
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect();
        isInHeroAbout = rect.top > 60;
      } else {
        isInHeroAbout = window.scrollY < 2000;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);

    handleScroll();

    const loop = () => {
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;
      rotation += 0.4;

      const active = isVisible && isInHeroAbout && currentX > -500;
      const posX = currentX - maskSize / 2;
      const posY = currentY - maskSize / 2;

      // 1. Background Mask Layer
      if (backdropEl) {
        if (active) {
          backdropEl.style.opacity = "1";
          backdropEl.style.webkitMaskImage = "url('/mask.svg')";
          backdropEl.style.maskImage = "url('/mask.svg')";
          backdropEl.style.webkitMaskPosition = `${posX}px ${posY}px`;
          backdropEl.style.maskPosition = `${posX}px ${posY}px`;
          backdropEl.style.webkitMaskSize = `${maskSize}px ${maskSize}px`;
          backdropEl.style.maskSize = `${maskSize}px ${maskSize}px`;
          backdropEl.style.webkitMaskRepeat = "no-repeat";
          backdropEl.style.maskRepeat = "no-repeat";
        } else {
          backdropEl.style.opacity = "0";
        }
      }

      // 2. Foreground Starburst Chromatic Overlay (z-30 above text/cards)
      if (overlayEl) {
        if (active) {
          overlayEl.style.opacity = "1";
          overlayEl.style.webkitMaskImage = "url('/mask.svg')";
          overlayEl.style.maskImage = "url('/mask.svg')";
          overlayEl.style.webkitMaskPosition = `${posX}px ${posY}px`;
          overlayEl.style.maskPosition = `${posX}px ${posY}px`;
          overlayEl.style.webkitMaskSize = `${maskSize}px ${maskSize}px`;
          overlayEl.style.maskSize = `${maskSize}px ${maskSize}px`;
          overlayEl.style.webkitMaskRepeat = "no-repeat";
          overlayEl.style.maskRepeat = "no-repeat";
        } else {
          overlayEl.style.opacity = "0";
        }
      }

      // 3. Glowing Starburst Rim Light Follower
      if (glowEl) {
        if (active) {
          glowEl.style.opacity = "1";
          glowEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(${rotation}deg)`;
        } else {
          glowEl.style.opacity = "0";
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* 1. Backdrop Mask Layer (z-0) */}
      <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden select-none" aria-hidden="true">
        <div className="absolute inset-0 bg-slate-950/70" />

        <div
          ref={maskBackdropRef}
          className="pointer-events-none absolute inset-0 h-full w-full will-change-[mask-position,opacity] transition-opacity duration-300 ease-out opacity-0"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Radiant Sunset & Nebula Cosmic Mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/60 via-rose-500/50 via-purple-600/45 to-sky-400/50 animate-gradient-text" />
          
          {/* Holographic Cyber Lattice */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.8) 1.5px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>
      </div>

      {/* 2. Top-Layer Chromatic Starburst Overlay (z-30) - Overlays Hero & About */}
      <div className="pointer-events-none fixed inset-0 z-30 h-full w-full overflow-hidden select-none" aria-hidden="true">
        <div
          ref={maskOverlayRef}
          className="pointer-events-none absolute inset-0 h-full w-full will-change-[mask-position,opacity] transition-opacity duration-300 ease-out opacity-0"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Chromatic Prism Flare */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/25 via-pink-500/20 to-amber-300/25 mix-blend-color-dodge" />
          <div
            className="absolute inset-0 opacity-40 mix-blend-screen"
            style={{
              backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* 3. Radiant Starburst Rim Halo */}
        <div
          ref={glowRingRef}
          className="pointer-events-none fixed top-0 left-0 h-[440px] w-[440px] rounded-full opacity-0 transition-opacity duration-300 ease-out will-change-transform"
          style={{
            background: "radial-gradient(circle, rgba(232, 28, 255, 0.25) 0%, rgba(56, 189, 248, 0.2) 45%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>
    </>
  );
};

export interface MaskContainerProps {
  children?: React.ReactNode;
  revealText?: React.ReactNode;
  size?: number;
  revealSize?: number;
  className?: string;
  isImageMask?: boolean;
  frontImage?: string;
  backImage?: string;
}

export const MaskContainer = ({
  children,
  revealText,
  size = 40,
  revealSize = 280,
  className,
  isImageMask = false,
  frontImage,
  backImage,
}: MaskContainerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 200,
    y: 200,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMousePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateMousePosition(e.clientX, e.clientY);
    if (!isHovered) setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
    setIsHovered(true);
  };

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: rect.width / 2,
        y: rect.height / 2,
      });
    }
  }, []);

  const maskSize = isHovered ? revealSize : size;
  const posX = mousePosition.x - maskSize / 2;
  const posY = mousePosition.y - maskSize / 2;

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[34rem] w-full overflow-hidden select-none cursor-crosshair", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Background / Revealed Color Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center bg-black/95 text-6xl text-white [mask-repeat:no-repeat]"
        animate={
          {
            WebkitMaskPosition: `${posX}px ${posY}px`,
            WebkitMaskSize: `${maskSize}px`,
            maskPosition: `${posX}px ${posY}px`,
            maskSize: `${maskSize}px`,
          } as any
        }
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.15,
        }}
        style={{
          maskImage: "url('/mask.svg')",
          WebkitMaskImage: "url('/mask.svg')",
        }}
      >
        <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-pink-500/20 opacity-60" />

        {isImageMask && frontImage ? (
          <div className="relative z-10 flex h-full w-full items-center justify-center p-3">
            <img
              src={frontImage}
              alt="Sharvan Front Color Portrait"
              className="max-h-[92%] max-w-[95%] rounded-2xl object-cover shadow-2xl ring-2 ring-sky-400/60"
            />
          </div>
        ) : (
          <div className="relative z-10 mx-auto max-w-4xl p-6 text-center text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {revealText}
          </div>
        )}
      </motion.div>

      {/* Base Monochrome Layer (Visible normally) */}
      <div className="flex h-full w-full items-center justify-center p-3 text-slate-300">
        {isImageMask && backImage ? (
          <div className="relative flex h-full w-full items-center justify-center p-3">
            <img
              src={backImage}
              alt="Sharvan Monochrome Portrait"
              className="max-h-[92%] max-w-[95%] rounded-2xl object-cover grayscale contrast-125 opacity-70 ring-1 ring-white/10"
            />
          </div>
        ) : (
          <div className="mx-auto max-w-4xl text-center text-3xl font-semibold tracking-tight text-slate-300 md:text-4xl lg:text-5xl">
            {children}
          </div>
        )}
      </div>

      {/* Floating Hover Indicator */}
      <div className="pointer-events-none absolute bottom-3 right-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
        <span>Move pointer over portrait</span>
      </div>
    </div>
  );
};
