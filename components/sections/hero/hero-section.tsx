"use client";
import React, { useState, useEffect, useRef } from "react";
import { HeroBackground } from "./hero-background";
import { HeroTypography } from "./hero-typography";
import { HeroPortrait } from "./hero-portrait";
import { HeroFullMask } from "./hero-full-mask";
import { HeroScrollIndicator } from "./hero-scroll-indicator";
import { initialSharvanBaseData } from "@/lib/sharvan-base-data";

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const editorial = initialSharvanBaseData.editorial || {
    heroHeadline: "SHARVAN SAI",
    heroTagline: "CODE • DESIGN • INNOVATE",
    heroRole: "FULL STACK DEVELOPER • AI/ML • CREATIVE TECHNOLOGIST",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-transparent text-white pt-24 pb-16 lg:py-0 select-none cursor-crosshair"
    >
      {/* ========================================================================= */}
      {/* 0. INDEPENDENT DIGITAL ARCHITECTURE & TOPOGRAPHIC BACKGROUND ENVIRONMENT */}
      {/* ========================================================================= */}
      <HeroBackground />

      {/* ========================================================================= */}
      {/* 1. BASE LAYER: CLEAN HUMAN / EDITORIAL DESIGN STATE                       */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto z-10">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 flex flex-col justify-center min-h-[calc(100svh-6rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8 xl:gap-12">
            {/* Left: Base Editorial Typography */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              <HeroTypography
                headline={editorial.heroHeadline}
                tagline={editorial.heroTagline}
                role={editorial.heroRole}
                isReady={isInitialized}
                mode="base"
              />
            </div>

            {/* Right: Base Professional Portrait (IMAGE A - Clean Suit & Spectacles) */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
              <HeroPortrait
                isReady={isInitialized}
                mode="base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REVEALED MASKED LAYER: CHROMATIC DIGITAL / CYBER SYSTEM                */}
      {/*    (Revealed wherever cursor moves across the ENTIRE Hero screen)         */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-center z-20 overflow-hidden"
        style={{
          maskImage: "url(#heroFullPagePortalMask)",
          WebkitMaskImage: "url(#heroFullPagePortalMask)",
        }}
        aria-hidden="true"
      >
        {/* Cyber Cosmic Glowing Background */}
        <div className="absolute inset-0 bg-[#070512]" />

        <div
          className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-pink-900/30 to-cyan-900/40 opacity-70 animate-gradient-text"
          style={{ backgroundSize: "200% 200%" }}
        />

        {/* Radiant Cyber Lattice Grid */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-screen"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(236, 72, 153, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Cyber Circuit Topographic Paths */}
        <svg
          className="absolute inset-0 h-full w-full opacity-35 stroke-cyan-400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-100,150 C400,50 800,350 1400,200 S2200,500 2800,250" fill="none" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="M-100,500 C500,400 900,750 1500,550 S2300,900 2900,600" fill="none" strokeWidth="1.5" strokeDasharray="4 6" stroke="rgba(236,72,153,0.5)" />
        </svg>

        {/* Masked Layout Grid (1:1 identical coordinate positioning) */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 flex flex-col justify-center min-h-[calc(100svh-6rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8 xl:gap-12">
            {/* Left: Cyber Chromatic Typography with Glowing Text Effects */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              <HeroTypography
                headline={editorial.heroHeadline}
                tagline={editorial.heroTagline}
                role={editorial.heroRole}
                isReady={isInitialized}
                mode="cyber"
              />
            </div>

            {/* Right: Cyber Digital Portrait (IMAGE B - Sunglasses & Holographic Code Panels) */}
            <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
              <HeroPortrait
                isReady={isInitialized}
                mode="cyber"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULL-PAGE ORGANIC SVG MASK PORTAL CONTROLLER & PERIMETER GLOW          */}
      {/* ========================================================================= */}
      <HeroFullMask containerRef={sectionRef} />

      {/* ========================================================================= */}
      {/* 4. HERO BOTTOM SCROLL PROMPT                                              */}
      {/* ========================================================================= */}
      <HeroScrollIndicator />
    </section>
  );
};
