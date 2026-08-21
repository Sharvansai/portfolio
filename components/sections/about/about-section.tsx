"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Terminal, Sparkles } from "lucide-react";
import { SrmIdCard } from "./srm-id-card";
import { initialSharvanBaseData } from "@/lib/sharvan-base-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  const editorial = initialSharvanBaseData.editorial || {
    aboutEyebrow: "ABOUT ME",
    aboutTitle: "BUILDING DIGITAL EXPERIENCES WITH CODE.",
    aboutDescription:
      "I’m Sharvan Sai, a full stack developer and creative technologist focused on building modern digital experiences, intelligent applications and interfaces that combine engineering with visual storytelling.",
    whatIBuild: [
      {
        title: "Interactive Web Experiences",
        desc: "Fluid 3D WebGL scenes, physics-based simulations, and interactive 60fps web game architectures.",
        tag: "WEBGL / GSAP",
      },
      {
        title: "Full Stack Applications",
        desc: "Scalable cloud services, responsive state machines, and dynamic theming platforms like NEXORA.",
        tag: "REACT / NEXT.JS / NODE",
      },
      {
        title: "AI / ML Systems",
        desc: "Intelligent conversational bots, graph search heuristic labs, and autonomous route visualizers.",
        tag: "PYTHON / A* / AI",
      },
      {
        title: "Creative Developer Tools",
        desc: "Bespoke design token engines, generative algorithms, and high-performance tactile interfaces.",
        tag: "CREATIVE TECH",
      },
      {
        title: "Experimental Interfaces",
        desc: "SVG mask portals, gesture-driven canvas physics, and cinematic editorial web experiences.",
        tag: "SVG / SHADERS",
      },
    ],
  };

  useEffect(() => {
    if (!sectionRef.current || !textColRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered reveal for text content
      const elements = textColRef.current?.querySelectorAll(".about-reveal-item");
      if (elements && elements.length > 0) {
        gsap.fromTo(
          elements,
          {
            y: 50,
            opacity: 0,
            filter: "blur(10px)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textColRef.current,
              start: "top 80%",
              end: "top 40%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 w-full py-28 lg:py-36 bg-transparent text-white overflow-hidden scroll-mt-12"
    >
      {/* Background Layer: Deep Atmospheric Violet Glows */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-[600px] w-[600px] rounded-full bg-purple-900/10 blur-[180px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-10 h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[160px]"
        aria-hidden="true"
      />

      {/* Blueprint grid fragments */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column: Strong Editorial Hierarchy (60% on desktop) */}
          <div
            ref={textColRef}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-8"
          >
            {/* Eyebrow badge */}
            <div className="about-reveal-item inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/20 px-3.5 py-1.5 backdrop-blur-xl">
              <Terminal className="h-3.5 w-3.5 text-purple-400" />
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-purple-200 uppercase">
                {editorial.aboutEyebrow}
              </span>
            </div>

            {/* Editorial Title */}
            <div className="about-reveal-item space-y-3">
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.08]">
                {editorial.aboutTitle.split("WITH CODE.")[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-sky-300">
                  WITH CODE.
                </span>
              </h2>
            </div>

            {/* Primary Bio Paragraph */}
            <div className="about-reveal-item space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              <p>
                {editorial.aboutDescription}
              </p>
              <p className="text-slate-400 text-xs sm:text-sm">
                Behind the visual experience is an engineer who enjoys turning ideas into functional digital reality — whether that is an autonomous vehicle route simulator with heuristic graph backtracking, a 20+ web game arcade platform, or a responsive enterprise theming engine.
              </p>
            </div>

            {/* Academic Highlights & Distinction Strip */}
            <div className="about-reveal-item w-full grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-md">
                <div className="font-mono text-[10px] uppercase tracking-wider text-purple-300">
                  Academic Standing
                </div>
                <div className="mt-1 text-2xl font-black text-white">9.05 / 10</div>
                <div className="text-[11px] text-slate-400">SRM IST B.Tech CSE</div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-md">
                <div className="font-mono text-[10px] uppercase tracking-wider text-sky-300">
                  Intermediate MPC
                </div>
                <div className="mt-1 text-2xl font-black text-white">94.3%</div>
                <div className="text-[11px] text-slate-400">Math, Physics, Chem</div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-md">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                  Leadership
                </div>
                <div className="mt-1 text-2xl font-black text-white">6+ Teams</div>
                <div className="text-[11px] text-slate-400">Led & Coordinated</div>
              </div>
            </div>

            {/* WHAT I BUILD Cluster */}
            <div className="about-reveal-item w-full space-y-3 pt-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>WHAT I BUILD</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {editorial.whatIBuild.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5 transition-all hover:border-purple-500/30 hover:bg-purple-950/10"
                  >
                    <div>
                      <h4 className="font-sans text-xs sm:text-sm font-bold text-slate-100">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <span className="mt-2 sm:mt-0 self-start sm:self-center font-mono text-[9px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-400/20 whitespace-nowrap">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Draggable Oscillating SRM ID Badge */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <SrmIdCard />
          </div>
        </div>
      </div>
    </section>
  );
};

