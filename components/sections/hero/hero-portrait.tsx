"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface HeroPortraitProps {
  isReady?: boolean;
  mode?: "base" | "cyber";
  onHoverChange?: (isHovered: boolean) => void;
}

export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  isReady = true,
  mode = "base",
  onHoverChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isCyber = mode === "cyber";

  // Parallax physics on mouse movement
  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      targetX = normX * 8;
      targetY = normY * 8;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const ticker = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (visual) {
        visual.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Cinematic Entrance Animation on page load
  useEffect(() => {
    if (!isReady || !visualRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        visualRef.current,
        {
          opacity: 0,
          scale: 1.08,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }, visualRef);

    return () => ctx.revert();
  }, [isReady]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  return (
    <div
      ref={containerRef}
      className="hero-portrait-container relative flex items-center justify-center w-full max-w-[480px] lg:max-w-[560px] xl:max-w-[620px] mx-auto select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Parallax visual frame wrapper */}
      <div
        ref={visualRef}
        className={`hero-visual relative aspect-[9/16] w-full max-h-[82svh] rounded-3xl overflow-hidden will-change-transform shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border transition-all ${
          isCyber
            ? "border-pink-500/40 shadow-[0_0_50px_rgba(236,72,153,0.3)] bg-[#080512]"
            : "border-white/[0.08] shadow-[0_0_40px_rgba(168,85,247,0.15)] bg-[#050508]"
        }`}
      >
        <div className="relative w-full h-full inset-0">
          {/* Portrait Image (IMAGE A in base mode, IMAGE B in cyber mode) */}
          <img
            ref={imgRef}
            src={isCyber ? "/assets/sharvan_portrait_b.jpg" : "/assets/sharvan_portrait_a.jpg"}
            alt={isCyber ? "Sharvan Sai — Digital System & Holographic Interfaces" : "Sharvan Sai — Full Stack Developer & Creative Technologist"}
            className="h-full w-full object-cover object-center"
            loading="eager"
            decoding="async"
          />

          {/* Vignette Edge Gradient */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${
              isCyber
                ? "from-[#080512]/80 via-transparent to-[#080512]/30"
                : "from-[#050508]/80 via-transparent to-[#050508]/30"
            }`}
          />

          {/* Holographic Corner UI Markers */}
          <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-1.5 font-mono text-[9px] text-purple-300/80 uppercase tracking-widest bg-black/50 px-2 py-1 rounded-md backdrop-blur-md border border-white/10">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCyber ? "bg-pink-400 animate-ping shadow-[0_0_8px_#ec4899]" : "bg-purple-400 animate-pulse"
              }`}
            />
            <span>{isCyber ? "SYSTEM: DIGITAL MATRIX" : "PORTAL: ACTIVE"}</span>
          </div>

          <div className="pointer-events-none absolute bottom-4 right-4 z-20 font-mono text-[9px] text-slate-300/80 uppercase tracking-widest bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10">
            <span>{isCyber ? "STATE: DIGITAL CODE" : "STATE: HUMAN DEVELOPER"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
