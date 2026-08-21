"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Sparkles, Terminal, FileText, ArrowUpRight, Cpu, Activity, Zap } from "lucide-react";
import Link from "next/link";
import { getSharvanBaseData } from "@/lib/sharvan-base-data";

interface HeroTypographyProps {
  headline?: string;
  tagline?: string;
  role?: string;
  isReady?: boolean;
  mode?: "base" | "cyber";
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({
  headline = "SHARVAN SAI",
  tagline = "CODE • DESIGN • INNOVATE",
  role = "FULL STACK DEVELOPER • AI/ML • CREATIVE TECHNOLOGIST",
  isReady = true,
  mode = "base",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const [liveCgpa, setLiveCgpa] = useState("9.05");

  useEffect(() => {
    const updateProfile = () => {
      const data = getSharvanBaseData();
      if (data?.profile?.cgpa) {
        setLiveCgpa(data.profile.cgpa);
      }
    };
    updateProfile();

    window.addEventListener("sharvan-base-updated", updateProfile);
    window.addEventListener("storage", updateProfile);

    return () => {
      window.removeEventListener("sharvan-base-updated", updateProfile);
      window.removeEventListener("storage", updateProfile);
    };
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (metaRef.current) {
        tl.fromTo(
          metaRef.current,
          { opacity: 0, y: -20, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 }
        );
      }

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".hero-word");
        tl.fromTo(
          words,
          { opacity: 0, y: 55, filter: "blur(14px)", scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
          },
          "-=0.4"
        );
      }

      if (tagRef.current) {
        tl.fromTo(
          tagRef.current,
          { opacity: 0, y: 25, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          "-=0.6"
        );
      }

      if (roleRef.current) {
        tl.fromTo(
          roleRef.current,
          { opacity: 0, y: 20, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
          "-=0.5"
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  const words = headline.split(" ");
  const isCyber = mode === "cyber";

  return (
    <div
      ref={containerRef}
      className="relative z-20 flex flex-col items-start text-left max-w-2xl select-none"
    >
      {/* Telemetry pill with Live Dynamic CGPA */}
      <div
        ref={metaRef}
        className={`mb-4 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 backdrop-blur-xl will-change-[transform,opacity,filter] border transition-all ${
          isCyber
            ? "border-pink-500/70 bg-black/80 shadow-[0_0_25px_rgba(236,72,153,0.6)] text-pink-200"
            : "bg-black/60 text-purple-200 border"
        }`}
        style={
          !isCyber
            ? {
                borderColor: "var(--accent-color, #c084fc)50",
                boxShadow: "0 0 15px var(--accent-glow-subtle, rgba(192,132,252,0.3))",
              }
            : {}
        }
      >
        <span className="relative flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${isCyber ? "bg-pink-400" : "bg-emerald-400"}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isCyber ? "bg-pink-400 shadow-[0_0_8px_#ec4899]" : "bg-emerald-400 shadow-[0_0_8px_#34d399]"}`} />
        </span>
        <span className="font-mono text-[11px] font-bold tracking-wider">
          SRM IST • B.TECH CSE ({(() => {
            const match = String(liveCgpa || "9.05").match(/\d+(\.\d+)?/);
            return match ? match[0] : "9.05";
          })()} CGPA)
        </span>
        <span
          className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${
            isCyber
              ? "bg-pink-500/40 text-pink-200 border border-pink-400 shadow-[0_0_10px_#ec4899]"
              : "text-white border"
          }`}
          style={
            !isCyber
              ? {
                  backgroundColor: "var(--accent-color, #c084fc)30",
                  borderColor: "var(--accent-color, #c084fc)50",
                }
              : {}
          }
        >
          {isCyber ? "NEURAL.ONLINE" : "SYS.ONLINE"}
        </span>
      </div>

      {/* Primary giant heading with Glowing Effect Colors */}
      <h1
        ref={headlineRef}
        className="font-sans font-black tracking-[-0.035em] uppercase leading-[0.92] text-[clamp(2.6rem,12vw,4.5rem)] sm:text-[clamp(3.5rem,8.5vw,6rem)] lg:text-[clamp(4.2rem,7.5vw,8.5rem)] select-none"
      >
        {words.map((word, idx) => {
          const isFirstWord = idx === 0; // "SHARVAN" vs "SAI"
          return (
            <span
              key={idx}
              className="hero-word inline-block mr-[0.25em] last:mr-0 will-change-[transform,opacity,filter] transition-colors duration-300"
              style={{
                color: isCyber
                  ? isFirstWord
                    ? "#f472b6"
                    : "#38bdf8"
                  : isFirstWord
                    ? "#ffffff"
                    : "#e0f2fe",
                textShadow: isCyber
                  ? isFirstWord
                    ? "0 0 20px rgba(244,114,182,0.95), 0 0 45px rgba(217,70,239,0.85), 0 0 80px rgba(168,85,247,0.7)"
                    : "0 0 20px rgba(56,189,248,0.95), 0 0 45px rgba(14,165,233,0.85), 0 0 80px rgba(99,102,241,0.7)"
                  : isFirstWord
                    ? "0 0 25px var(--accent-glow, rgba(192,132,252,0.85)), 0 0 50px var(--accent-glow-subtle, rgba(168,85,247,0.5)), 0 10px 35px rgba(0,0,0,0.9)"
                    : "0 0 25px rgba(56,189,248,0.85), 0 0 50px rgba(14,165,233,0.5), 0 10px 35px rgba(0,0,0,0.9)",
              }}
            >
              {word}
            </span>
          );
        })}
      </h1>

      {/* Secondary Tagline: CODE • DESIGN • INNOVATE */}
      <div
        ref={tagRef}
        className="mt-4 sm:mt-5 will-change-[transform,opacity,filter]"
      >
        <p
          className="font-mono text-xs sm:text-sm lg:text-base font-extrabold tracking-[0.25em] uppercase transition-colors"
          style={{
            color: isCyber ? "#e879f9" : "var(--accent-color, #d8b4fe)",
            textShadow: isCyber
              ? "0 0 16px rgba(232,121,249,0.9), 0 0 32px rgba(168,85,247,0.7)"
              : "0 0 15px var(--accent-glow-subtle, rgba(192,132,252,0.65))",
          }}
        >
          {tagline}
        </p>
      </div>

      {/* Subtitle: FULL STACK DEVELOPER • AI/ML • CREATIVE TECHNOLOGIST */}
      <div
        ref={roleRef}
        className="mt-2.5 will-change-[transform,opacity,filter]"
      >
        <p
          className="font-mono text-[11px] sm:text-xs tracking-[0.14em] uppercase max-w-xl font-semibold"
          style={{
            color: isCyber ? "#7dd3fc" : "#bae6fd",
            textShadow: isCyber
              ? "0 0 14px rgba(56,189,248,0.8)"
              : "0 0 10px rgba(56,189,248,0.5)",
          }}
        >
          {role}
        </p>
      </div>

      {/* Action Buttons with Dynamic Theme Color Reactivity */}
      <div
        ref={ctaRef}
        className="mt-7 sm:mt-9 flex flex-wrap items-center gap-3.5 will-change-[transform,opacity]"
      >
        <a
          href="#projects"
          className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
          style={{
            backgroundColor: isCyber ? "#db2777" : "var(--accent-color, #9333ea)",
            boxShadow: `0 0 25px var(--accent-glow-subtle, rgba(147,51,234,0.5))`,
          }}
        >
          {isCyber && <Zap className="h-3.5 w-3.5 text-amber-300 animate-bounce" />}
          <span>Explore Featured Systems</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <Link
          href="/resume"
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs sm:text-sm font-semibold backdrop-blur-xl transition-all duration-300 active:scale-95 shadow-sm ${
            isCyber
              ? "border-cyan-400 bg-cyan-950/60 text-cyan-200 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
              : "border-white/20 bg-black/50 text-slate-100 hover:bg-white/[0.08] hover:text-white"
          }`}
          style={
            !isCyber
              ? {
                  borderColor: "var(--accent-color, #c084fc)40",
                }
              : {}
          }
        >
          <FileText className={`h-3.5 w-3.5 ${isCyber ? "text-cyan-300" : "text-purple-400"}`} />
          <span>Recruiter Resume</span>
        </Link>
      </div>

      {/* Technical Coordinates metadata */}
      <div
        className={`mt-8 flex items-center gap-4 text-[10px] font-mono ${
          isCyber ? "text-purple-200 font-bold drop-shadow-[0_0_8px_#c084fc]" : "text-slate-400 font-medium"
        }`}
      >
        <span>LOC: 12.8231° N, 80.0442° E</span>
        <span>•</span>
        <span>{isCyber ? "GOOGLE AI-ML CERTIFIED (GRADE O) • SRM IST" : "ENGINE: NEXT 15 / GSAP / THREE"}</span>
      </div>
    </div>
  );
};
