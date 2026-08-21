"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ExternalLink, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ProjectItem } from "@/lib/sharvan-base-data";

interface HangingSheetCardProps {
  project: ProjectItem;
  index: number;
}

export const HangingSheetCard: React.FC<HangingSheetCardProps> = ({ project, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clothRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const wrinklesRef = useRef<SVGSVGElement>(null);

  // High-fidelity cloth physics simulation
  const physics = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    // Real-time displacement
    transX: 0,
    transY: 0,
    rotZ: 0,
    rotX: 0,
    rotY: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    // Velocities
    vx: 0,
    vy: 0,
    vRotZ: 0,
    vRotX: 0,
    vScaleX: 0,
    vScaleY: 0,
    // Breeze ripple phase
    breezePhase: index * 1.5 + Math.random() * 2,
    breezeSpeed: 0.022 + Math.random() * 0.012,
  });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const cloth = clothRef.current;
    const shadow = shadowRef.current;
    const wrinkles = wrinklesRef.current;
    if (!cloth) return;

    // Real cloth physics constants (elastic fabric with air damping)
    const kPos = 0.055;     // Spring stiffness for translation
    const kRot = 0.048;     // Restoring torque for swing
    const kScale = 0.075;   // Elastic fabric snap-back
    const damping = 0.938;  // Air friction damping

    const ticker = () => {
      const p = physics.current;

      if (!p.isDragging) {
        // Natural gentle wind breeze undulating through hanging cloth
        p.breezePhase += p.breezeSpeed;
        const windSwayZ = Math.sin(p.breezePhase) * 1.8;
        const windFlutterX = Math.cos(p.breezePhase * 1.3) * 2.2;
        const windStretchY = 1 + Math.sin(p.breezePhase * 0.8) * 0.015;

        // Spring pulling back to rest
        const fX = -kPos * p.transX;
        const fY = -kPos * p.transY;
        const tZ = -kRot * (p.rotZ - windSwayZ);
        const tX = -kRot * (p.rotX - windFlutterX);
        const sX = -kScale * (p.scaleX - 1);
        const sY = -kScale * (p.scaleY - windStretchY);

        p.vx = (p.vx + fX) * damping;
        p.vy = (p.vy + fY) * damping;
        p.vRotZ = (p.vRotZ + tZ) * damping;
        p.vRotX = (p.vRotX + tX) * damping;
        p.vScaleX = (p.vScaleX + sX) * damping;
        p.vScaleY = (p.vScaleY + sY) * damping;

        p.transX += p.vx;
        p.transY += p.vy;
        p.rotZ += p.vRotZ;
        p.rotX += p.vRotX;
        p.scaleX += p.vScaleX;
        p.scaleY += p.vScaleY;
        p.skewX = p.vRotZ * 0.5 + p.vx * 0.15;
      }

      // Apply 3D Elastic Cloth Deformation Anchored at Top Edge
      cloth.style.transform = `
        perspective(1100px)
        translate3d(${p.transX.toFixed(2)}px, ${p.transY.toFixed(2)}px, 0)
        rotateZ(${p.rotZ.toFixed(2)}deg)
        rotateX(${p.rotX.toFixed(2)}deg)
        rotateY(${(p.transX * -0.06).toFixed(2)}deg)
        skewX(${p.skewX.toFixed(2)}deg)
        scale(${p.scaleX.toFixed(3)}, ${p.scaleY.toFixed(3)})
      `;

      // Update dynamic fabric wrinkle folds in SVG
      if (wrinkles) {
        const pullIntensity = Math.min(1, Math.hypot(p.transX, p.transY) / 100);
        wrinkles.style.opacity = `${0.25 + pullIntensity * 0.45}`;
      }

      // Dynamic floor shadow following the draped cloth
      if (shadow) {
        const shadowScale = Math.max(0.75, 1 - (p.scaleY - 1) * 0.5);
        shadow.style.transform = `
          translate3d(${(p.transX * 0.35).toFixed(2)}px, ${(p.transY * 0.15).toFixed(2)}px, 0)
          scale(${shadowScale.toFixed(2)})
        `;
        shadow.style.opacity = `${Math.max(0.2, 0.5 - Math.abs(p.rotZ) * 0.01)}`;
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
    };
  }, []);

  // Mouse & Touch Dragging Handlers for Elastic Cloth Stretch
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;

    physics.current.isDragging = true;
    physics.current.startX = e.clientX;
    physics.current.startY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const p = physics.current;

    if (p.isDragging) {
      const deltaX = e.clientX - p.startX;
      const deltaY = e.clientY - p.startY;

      // Realistic non-linear elastic cloth stretching
      const dragDist = Math.hypot(deltaX, deltaY);
      const elasticResistance = 1 / (1 + dragDist * 0.0035);

      // Lateral swing and vertical stretch
      p.transX = deltaX * 0.7 * elasticResistance;
      p.transY = Math.max(-20, deltaY * 0.55 * elasticResistance);

      // Rotational torque from pull angle
      p.rotZ = Math.max(-32, Math.min(32, deltaX * 0.32 * elasticResistance));
      p.rotX = Math.max(-28, Math.min(28, -deltaY * 0.25 * elasticResistance));
      p.skewX = deltaX * 0.16 * elasticResistance;

      // ELASTIC FABRIC EXPANSION (Stretches when pulled down / outward)
      p.scaleY = Math.max(0.92, Math.min(1.28, 1 + (deltaY * 0.0018) + (Math.abs(deltaX) * 0.0008)));
      p.scaleX = Math.max(0.92, Math.min(1.22, 1 + (Math.abs(deltaX) * 0.0015) - (deltaY * 0.0006)));

      // Velocity tracking for spring release
      p.vx = deltaX * 0.08;
      p.vy = deltaY * 0.08;
      p.vRotZ = deltaX * 0.07;
      p.vScaleX = (p.scaleX - 1) * 0.1;
      p.vScaleY = (p.scaleY - 1) * 0.1;
    } else if (isHovered) {
      // Soft touch disturbance
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      p.vRotZ += relX * 0.45;
      p.vRotX += -relY * 0.35;
      p.vScaleY += Math.abs(relY) * 0.01;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (physics.current.isDragging) {
      physics.current.isDragging = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative pt-9 pb-6 flex flex-col items-center select-none"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* ========================================================================= */}
      {/* 1. CLOTHESLINE WIRE & REALISTIC WOODEN / BRASS CLOTHESPINS                */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 h-10 pointer-events-none z-30 flex items-center justify-between px-8">
        {/* Horizontal Clothesline Cord with natural sag */}
        <svg className="absolute inset-x-0 top-3.5 w-full h-3 overflow-visible" preserveAspectRatio="none">
          <path
            d="M0,4 Q50%,8 100%,4"
            fill="none"
            stroke="rgba(148, 163, 184, 0.45)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
        </svg>

        {/* Left Clothespin (Pinched on the cloth corner) */}
        <div className="relative z-10 flex flex-col items-center drop-shadow-md">
          {/* Peg spring hinge */}
          <div className="h-2 w-3 rounded-t-sm bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 border border-slate-200" />
          {/* Wood legs */}
          <div className="h-6 w-2.5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-b-sm border border-amber-600/80 shadow-md flex items-center justify-center">
            <div className="h-2 w-0.5 bg-amber-400 rounded-full opacity-60" />
          </div>
        </div>

        {/* Right Clothespin */}
        <div className="relative z-10 flex flex-col items-center drop-shadow-md">
          <div className="h-2 w-3 rounded-t-sm bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 border border-slate-200" />
          <div className="h-6 w-2.5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-b-sm border border-amber-600/80 shadow-md flex items-center justify-center">
            <div className="h-2 w-0.5 bg-amber-400 rounded-full opacity-60" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REALISTIC CLOTH DROP SHADOW ON THE WALL/FLOOR                          */}
      {/* ========================================================================= */}
      <div
        ref={shadowRef}
        className="pointer-events-none absolute -bottom-3 inset-x-6 h-10 rounded-[40%] bg-black/75 blur-2xl transition-opacity will-change-transform z-0"
      />

      {/* ========================================================================= */}
      {/* 3. REAL FABRIC CLOTH TAPESTRY CONTAINER (Anchored at Top)                 */}
      {/* ========================================================================= */}
      <div
        ref={clothRef}
        className="relative z-10 w-full rounded-b-3xl rounded-t-xl p-7 sm:p-8 backdrop-blur-2xl will-change-transform cursor-grab active:cursor-grabbing border-t-0 border-x border-b border-purple-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden"
        style={{
          transformOrigin: "top center",
          background: `
            linear-gradient(172deg, rgba(22, 16, 40, 0.96) 0%, rgba(12, 10, 24, 0.98) 55%, rgba(18, 12, 34, 0.96) 100%)
          `,
          clipPath: "polygon(0% 2.5%, 3% 0%, 97% 0%, 100% 2.5%, 100% 98%, 96% 100%, 50% 98.5%, 4% 100%, 0% 98%)",
        }}
      >
        {/* ===================================================================== */}
        {/* A. DYNAMIC TENSION WRINKLES & CLOTH FOLDS SVG                         */}
        {/* ===================================================================== */}
        <svg
          ref={wrinklesRef}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-35 mix-blend-overlay transition-opacity"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tension fold lines radiating from the 2 hanging clothespins */}
          <path d="M25,0 C45,120 70,260 110,480" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <path d="M25,0 C75,90 120,220 180,480" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" />
          <path d="M100%,0 C90%,110 80%,250 70%,480" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <path d="M100%,0 C80%,90 65%,220 50%,480" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" />

          {/* Central catenary sag shadow */}
          <path d="M25,2 C50%,20 100%,2" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="3" />
        </svg>

        {/* ===================================================================== */}
        {/* B. WOVEN FABRIC / LINEN THREAD TEXTURE                                */}
        {/* ===================================================================== */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `
              radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)
            `,
            backgroundSize: "8px 8px, 4px 4px, 4px 4px",
          }}
        />

        {/* ===================================================================== */}
        {/* C. SILKY CLOTH DRAPE SHEEN & HIGHLIGHTS                               */}
        {/* ===================================================================== */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.09] via-transparent to-black/40" />

        {/* Top Drape Fold Line (Where cloth is pinched by pins) */}
        <div className="pointer-events-none absolute top-0 inset-x-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* ===================================================================== */}
        {/* D. PROJECT CONTENT ON THE CLOTH TAPESTRY                             */}
        {/* ===================================================================== */}
        <div className="relative z-10">
          {/* Card Header Line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                SYSTEM //
              </span>
              <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                {project.category}
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{project.status}</span>
            </span>
          </div>

          {/* Heading & Tagline */}
          <h3 className="mt-4 text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {project.title}
          </h3>
          <p className="mt-1 text-xs font-mono text-purple-300/90 font-medium">
            {project.tagline}
          </p>

          {/* Description */}
          <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
            {project.description}
          </p>

          {/* Metrics Grid */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center">
            {project.metrics.map((m, mIdx) => (
              <div key={mIdx} className="rounded-xl bg-black/60 p-2.5 border border-white/5 shadow-inner">
                <div className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400">
                  {m.value}
                </div>
                <div className="text-[9.5px] font-mono text-slate-400 truncate mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="rounded-lg bg-white/[0.05] border border-white/10 px-2.5 py-1 text-[10px] font-mono text-slate-300 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-[11px] font-mono text-slate-400">
              by <span className="text-white font-bold">Sharvan Sai</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={`/projects/${project.slug}`}
                className="group/link inline-flex items-center gap-1 text-xs font-bold text-purple-300 hover:text-white transition-colors"
              >
                <span>Architecture</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
              </Link>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Live Site</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* E. REALISTIC BOTTOM CLOTH HEM STITCHING & TASSEL ACCENT               */}
        {/* ===================================================================== */}
        <div className="pointer-events-none absolute bottom-1.5 inset-x-6 h-[1.5px] border-b border-dashed border-purple-400/40 opacity-70" />
      </div>
    </div>
  );
};
