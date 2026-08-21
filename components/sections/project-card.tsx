"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, ArrowRight, Activity, Terminal, Shield, Sparkles, Cpu } from "lucide-react";
import { ProjectItem } from "@/lib/sharvan-base-data";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setMousePos({ x: percentX, y: percentY });

    // Smooth 3D tilt calculation
    const rotX = ((y / rect.height) - 0.5) * -12;
    const rotY = ((x / rect.width) - 0.5) * 12;
    setTilt({ rotateX: rotX, rotateY: rotY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full w-full rounded-2xl select-none transition-all duration-300"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Dynamic Magnetic Outer Glow Border on Hover */}
      <div
        className="pointer-events-none absolute -inset-[1.5px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}% ${mousePos.y}%, var(--accent-color, #c084fc), transparent 70%)`,
        }}
      />

      {/* Main 3D Holographic Card Chassis */}
      <div
        className="relative z-10 flex flex-col justify-between h-full w-full rounded-2xl border border-white/10 bg-[#090814]/90 p-6 sm:p-7 backdrop-blur-2xl transition-transform duration-200 ease-out shadow-[0_15px_35px_rgba(0,0,0,0.6)] group-hover:border-white/25 overflow-hidden"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Specular Spotlight Reflection Follows Mouse */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.06), transparent 80%)`,
          }}
        />

        {/* Micro-Circuit Background Texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Card Header: Telemetry & Status HUD */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-wider text-slate-400">
                SYS.NODE //
              </span>
              <span
                className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border text-slate-200 transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderColor: "var(--accent-color, #c084fc)40",
                  color: "var(--accent-color, #c084fc)",
                }}
              >
                {project.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{project.status}</span>
            </div>
          </div>

          {/* Heading & Tagline */}
          <div className="mt-4">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-slate-400 font-medium line-clamp-1">
              {project.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-300">
            {project.description}
          </p>

          {/* Key Metrics HUD Pill Grid */}
          <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center bg-black/30 rounded-xl px-2">
            {project.metrics.map((m, mIdx) => (
              <div key={mIdx} className="p-1">
                <div
                  className="text-xs sm:text-sm font-black transition-colors"
                  style={{ color: "var(--accent-color, #c084fc)" }}
                >
                  {m.value}
                </div>
                <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((tech, tIdx) => (
              <span
                key={tIdx}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-mono text-slate-300 transition-colors group-hover:border-white/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            ENGINEERED BY <span className="text-white font-bold">SHARVAN SAI</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/projects/${project.slug}`}
              className="group/link inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all"
            >
              <span>Architecture</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
            </Link>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border"
              style={{
                backgroundColor: "var(--accent-color, #c084fc)",
                borderColor: "rgba(255,255,255,0.3)",
                boxShadow: "0 0 20px var(--accent-glow-subtle, rgba(192,132,252,0.3))",
              }}
            >
              <span>Launch Live</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
