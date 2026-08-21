"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const HeroScrollIndicator: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    // Line extension-retraction loop
    const lineTween = gsap.fromTo(
      lineRef.current,
      { scaleY: 0.15, transformOrigin: "top center", opacity: 0.3 },
      {
        scaleY: 1,
        opacity: 0.9,
        duration: 1.4,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      }
    );

    // ScrollTrigger fade out
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom-=100",
      end: "+=200",
      onUpdate: (self) => {
        const opacity = Math.max(0, 1 - self.progress * 3);
        if (containerRef.current) {
          containerRef.current.style.opacity = `${opacity}`;
          containerRef.current.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
        }
      },
    });

    return () => {
      lineTween.kill();
      st.kill();
    };
  }, []);

  const handleScrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutEl = document.getElementById("about");
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer transition-opacity duration-300 select-none group"
      onClick={handleScrollClick}
      role="button"
      tabIndex={0}
      aria-label="Scroll to explore About section"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 group-hover:text-purple-300 transition-colors">
        Scroll to Explore
      </span>
      <div className="relative h-10 w-[1.5px] overflow-hidden rounded-full bg-white/10">
        <div
          ref={lineRef}
          className="h-full w-full bg-gradient-to-b from-purple-400 via-indigo-400 to-sky-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]"
        />
      </div>
    </div>
  );
};
