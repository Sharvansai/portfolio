"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingInterface } from "./floating-interface";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutPortraitProps {
  activeSkillMode?: string | null;
}

export const AboutPortrait: React.FC<AboutPortraitProps> = ({
  activeSkillMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const maskShapeRef = useRef<SVGPathElement>(null);
  const pulseOverlayRef = useRef<HTMLDivElement>(null);

  // ScrollTrigger entrance reveal
  useEffect(() => {
    if (!containerRef.current || !visualRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Image and frame scale & blur reveal
      gsap.fromTo(
        imageRef.current,
        {
          scale: 1.15,
          opacity: 0,
          filter: "blur(12px) brightness(0.6)",
        },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px) brightness(1)",
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "top 35%",
            scrub: 1,
          },
        }
      );

      // 2. Parallax drift during section scroll
      gsap.to(visualRef.current, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Micro-interactions triggered when skills are hovered
  useEffect(() => {
    if (!pulseOverlayRef.current) return;

    if (activeSkillMode) {
      gsap.to(pulseOverlayRef.current, {
        opacity: 0.35,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(pulseOverlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [activeSkillMode]);

  return (
    <div
      ref={containerRef}
      className="about-portrait-wrapper relative flex items-center justify-center w-full max-w-[460px] lg:max-w-[520px] xl:max-w-[560px] mx-auto select-none"
    >
      {/* Floating HUD Telemetry Interface */}
      <FloatingInterface activeSkillMode={activeSkillMode} />

      {/* Main Architectural Blueprint Frame */}
      <div
        ref={visualRef}
        className="relative aspect-[9/16] w-full max-h-[76svh] rounded-3xl overflow-hidden bg-[#06060a] border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(168,85,247,0.2)] will-change-transform"
      >
        {/* Primary Digital Portrait: IMAGE B */}
        <img
          ref={imageRef}
          src="/assets/sharvan_portrait_b.jpg"
          alt="Sharvan Sai — Digital System State & Holographic Interfaces"
          className="h-full w-full object-cover object-center will-change-[transform,filter,opacity]"
          loading="lazy"
          decoding="async"
        />

        {/* Reactive Skill Highlight Pulse Mesh */}
        <div
          ref={pulseOverlayRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-purple-600/40 via-indigo-600/30 to-sky-400/40 opacity-0 mix-blend-screen transition-opacity"
        />

        {/* Architectural Blueprint Vector Grids & Crosshairs */}
        <div className="pointer-events-none absolute inset-0">
          {/* Subtle Grid Lattice */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(192, 132, 252, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Topographic Contour Paths */}
          <svg
            className="absolute inset-0 h-full w-full opacity-20 stroke-purple-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,150 Q100,100 200,180 T400,220"
              fill="none"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />
            <path
              d="M0,450 Q120,400 250,470 T500,520"
              fill="none"
              strokeWidth="0.75"
              strokeDasharray="2 4"
            />
          </svg>

          {/* Precision Corner Crosshair Brackets */}
          <div className="absolute top-3 left-3 font-mono text-[9px] text-purple-400/70 font-bold">
            + [01.SYS]
          </div>
          <div className="absolute top-3 right-3 font-mono text-[9px] text-purple-400/70 font-bold">
            [ARCH.v2] +
          </div>
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-purple-400/70 font-bold">
            + [NODE.ONLINE]
          </div>
          <div className="absolute bottom-3 right-3 font-mono text-[9px] text-purple-400/70 font-bold">
            [SRM.CSE] +
          </div>
        </div>

        {/* Vignette Overlay for Depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06060a]/90 via-transparent to-[#06060a]/30" />

        {/* Bottom Banner inside Portrait */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
            <span className="font-mono text-[10px] text-purple-200 tracking-wider font-semibold">
              CHAPTER 02 • THE SYSTEM
            </span>
          </div>
          <span className="font-mono text-[9px] text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/5">
            DECODED
          </span>
        </div>
      </div>
    </div>
  );
};
