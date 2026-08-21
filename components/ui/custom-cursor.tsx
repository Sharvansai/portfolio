"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Disable on touch / coarse devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let isPointer = false;
    let isPortrait = false;
    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) isVisible = true;

      const target = e.target as HTMLElement | null;
      if (target) {
        // Detect portrait area for "REVEAL" mode
        isPortrait = !!(
          target.closest(".hero-portrait-container") ||
          target.closest(".about-portrait-wrapper") ||
          target.closest(".hero-visual")
        );

        // Detect clickable links / buttons
        isPointer = !isPortrait && !!(
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          window.getComputedStyle(target).cursor === "pointer"
        );
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    const ticker = () => {
      // Smooth lerp
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${
          isPortrait || isPointer ? 0 : 1
        })`;
        dotRef.current.style.opacity = isVisible ? "1" : "0";
      }

      if (ringRef.current) {
        let size = 28;
        let borderColor = "rgba(192, 132, 252, 0.7)";
        let bgColor = "rgba(192, 132, 252, 0.05)";

        if (isPortrait) {
          size = 76;
          borderColor = "rgba(192, 132, 252, 0.9)";
          bgColor = "rgba(147, 51, 234, 0.25)";
        } else if (isPointer) {
          size = 48;
          borderColor = "rgba(56, 189, 248, 0.85)";
          bgColor = "rgba(56, 189, 248, 0.12)";
        }

        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
        ringRef.current.style.borderColor = borderColor;
        ringRef.current.style.backgroundColor = bgColor;
        ringRef.current.style.opacity = isVisible ? "1" : "0";
      }

      if (textRef.current) {
        textRef.current.style.opacity = isPortrait ? "1" : "0";
        textRef.current.style.transform = isPortrait ? "scale(1)" : "scale(0.5)";
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7] will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />

      {/* Dynamic Magnetic / Reveal Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 flex items-center justify-center rounded-full border border-purple-400/80 bg-purple-400/10 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur-[2px] will-change-[transform,width,height] transition-[width,height,border-color,background-color] duration-200 ease-out"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          width: "28px",
          height: "28px",
        }}
      >
        <span
          ref={textRef}
          className="font-mono text-[9px] font-black uppercase tracking-widest text-white opacity-0 transition-all duration-200 select-none drop-shadow-md"
        >
          REVEAL
        </span>
      </div>
    </div>
  );
};
