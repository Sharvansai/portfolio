"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Terminal, Cpu, Activity, Sparkles, Layers, ShieldCheck } from "lucide-react";

interface FloatingInterfaceProps {
  activeSkillMode?: string | null;
}

export const FloatingInterface: React.FC<FloatingInterfaceProps> = ({
  activeSkillMode,
}) => {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = normX;
      targetY = normY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const ticker = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (card1Ref.current) {
        card1Ref.current.style.transform = `translate3d(${(currentX * -10).toFixed(2)}px, ${(currentY * -8).toFixed(2)}px, 0)`;
      }
      if (card2Ref.current) {
        card2Ref.current.style.transform = `translate3d(${(currentX * 12).toFixed(2)}px, ${(currentY * 10).toFixed(2)}px, 0)`;
      }
      if (card3Ref.current) {
        card3Ref.current.style.transform = `translate3d(${(currentX * -8).toFixed(2)}px, ${(currentY * 12).toFixed(2)}px, 0)`;
      }
      if (card4Ref.current) {
        card4Ref.current.style.transform = `translate3d(${(currentX * 14).toFixed(2)}px, ${(currentY * -10).toFixed(2)}px, 0)`;
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-visible select-none hidden sm:block">
      {/* Top Left HUD Card: SYSTEM.STATUS */}
      <div
        ref={card1Ref}
        className={`absolute -top-6 -left-6 z-30 rounded-xl border border-white/10 bg-black/65 p-2.5 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          activeSkillMode ? "border-purple-400/40 bg-purple-950/40" : ""
        }`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          </span>
          <span className="text-slate-400 font-semibold tracking-wider">SYSTEM.STATUS</span>
          <span className="text-emerald-400 font-bold">ONLINE</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span>LATENCY: &lt;16MS</span>
          <span className="text-purple-300">60 FPS</span>
        </div>
      </div>

      {/* Top Right HUD Card: BUILD.MODE */}
      <div
        ref={card2Ref}
        className="absolute -top-4 -right-6 z-30 rounded-xl border border-white/10 bg-black/65 p-2.5 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <Cpu className="h-3 w-3 text-purple-400 animate-spin [animation-duration:8s]" />
          <span className="text-slate-400 font-semibold tracking-wider">BUILD.MODE</span>
          <span className="text-purple-300 font-bold">CREATIVE</span>
        </div>
        <div className="mt-1 text-[9px] font-mono text-slate-500">
          CORE: NEXT 15 / GSAP / THREE
        </div>
      </div>

      {/* Bottom Left HUD Card: STACK */}
      <div
        ref={card3Ref}
        className="absolute -bottom-6 -left-4 z-30 rounded-xl border border-white/10 bg-black/65 p-2.5 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <Layers className="h-3 w-3 text-sky-400" />
          <span className="text-slate-400 font-semibold tracking-wider">STACK</span>
          <span className="text-sky-300 font-bold">FULL STACK</span>
        </div>
        <div className="mt-1 text-[9px] font-mono text-slate-500">
          20+ DEPLOYED LABS & APPS
        </div>
      </div>

      {/* Bottom Right HUD Card: AI MODULE */}
      <div
        ref={card4Ref}
        className="absolute -bottom-8 -right-4 z-30 rounded-xl border border-white/10 bg-black/65 p-2.5 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <Sparkles className="h-3 w-3 text-pink-400 animate-pulse" />
          <span className="text-slate-400 font-semibold tracking-wider">AI MODULE</span>
          <span className="text-pink-300 font-bold">ACTIVE</span>
        </div>
        <div className="mt-1 text-[9px] font-mono text-slate-500">
          A* HEURISTICS & MODELS
        </div>
      </div>
    </div>
  );
};
