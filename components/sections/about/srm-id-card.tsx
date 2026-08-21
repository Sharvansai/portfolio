"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { Mail, Phone, ShieldCheck, Award } from "lucide-react";
import { getSharvanBaseData } from "@/lib/sharvan-base-data";

export const SrmIdCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lanyardPathRef = useRef<SVGPathElement>(null);
  const lanyardClipRef = useRef<SVGGElement>(null);

  const [liveCgpa, setLiveCgpa] = useState("9.05");

  useEffect(() => {
    const updateCgpa = () => {
      const data = getSharvanBaseData();
      if (data?.profile?.cgpa) {
        setLiveCgpa(data.profile.cgpa);
      }
    };
    updateCgpa();

    window.addEventListener("sharvan-base-updated", updateCgpa);
    window.addEventListener("storage", updateCgpa);

    return () => {
      window.removeEventListener("sharvan-base-updated", updateCgpa);
      window.removeEventListener("storage", updateCgpa);
    };
  }, []);

  // Heavy Weighted 2D Physical Oscillation State (Zero Rotation)
  const physics = useRef({
    anchorX: 190,
    anchorY: 10,
    clipX: 190,
    clipY: 135,
    vx: 0,
    vy: 0,
    isDragging: false,
    dragGrabOffsetX: 0,
    dragGrabOffsetY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    pointerVx: 0,
    pointerVy: 0,
  });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const p = physics.current;
    const newAnchorX = rect.width > 0 ? rect.width / 2 : 190;
    p.anchorX = newAnchorX;
    if (!p.isDragging && Math.hypot(p.vx, p.vy) < 0.05) {
      p.clipX = p.anchorX;
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const p = physics.current;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        p.anchorX = rect.width / 2;
        p.clipX = p.anchorX;
      }
    }

    // Physics parameters for heavy weighted pendulum
    const naturalLength = 135;
    const kX = 0.065;
    const kY = 0.090;
    const damping = 0.968;
    const mass = 3.6;

    const tickerCallback = () => {
      const card = cardRef.current;
      const lanyardPath = lanyardPathRef.current;
      const lanyardClip = lanyardClipRef.current;
      if (!card || !containerRef.current) return;

      if (!p.isDragging) {
        const dispX = p.clipX - p.anchorX;
        const restY = p.anchorY + naturalLength;
        const dispY = p.clipY - restY;

        const forceX = -kX * dispX;
        const forceY = -kY * dispY;

        const ax = forceX / mass;
        const ay = forceY / mass;

        p.vx = (p.vx + ax) * damping;
        p.vy = (p.vy + ay) * damping;

        p.clipX += p.vx;
        p.clipY += p.vy;

        if (Math.abs(p.clipX - p.anchorX) < 0.02 && Math.abs(p.vx) < 0.01) {
          p.clipX = p.anchorX;
          p.vx = 0;
        }
        if (Math.abs(p.clipY - restY) < 0.02 && Math.abs(p.vy) < 0.01) {
          p.clipY = restY;
          p.vy = 0;
        }
      }

      const cardLeft = p.clipX - 155;
      const cardTop = p.clipY;
      card.style.transform = `translate3d(${cardLeft.toFixed(2)}px, ${cardTop.toFixed(2)}px, 0)`;

      if (lanyardPath) {
        const topX = p.anchorX;
        const topY = p.anchorY;
        const botX = p.clipX;
        const botY = p.clipY;
        const midX = (topX + botX) / 2 + (p.vx * 1.5);
        const midY = (topY + botY) / 2;

        lanyardPath.setAttribute("d", `M ${topX} ${topY} Q ${midX} ${midY} ${botX} ${botY}`);
      }

      if (lanyardClip) {
        lanyardClip.setAttribute("transform", `translate(${p.clipX}, ${p.clipY})`);
      }
    };

    gsap.ticker.add(tickerCallback);

    return () => {
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    const p = physics.current;
    p.isDragging = true;
    p.dragGrabOffsetX = p.clipX - pointerX;
    p.dragGrabOffsetY = p.clipY - pointerY;
    p.lastPointerX = pointerX;
    p.lastPointerY = pointerY;
    p.pointerVx = 0;
    p.pointerVy = 0;
    p.vx = 0;
    p.vy = 0;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physics.current;
    if (!p.isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    p.pointerVx = pointerX - p.lastPointerX;
    p.pointerVy = pointerY - p.lastPointerY;
    p.lastPointerX = pointerX;
    p.lastPointerY = pointerY;

    const targetClipX = pointerX + p.dragGrabOffsetX;
    const targetClipY = pointerY + p.dragGrabOffsetY;

    const pullSensitivity = 0.58;
    const maxDragX = 140;
    const rawDeltaX = (targetClipX - p.anchorX) * pullSensitivity;
    const clampedDeltaX = Math.max(-maxDragX, Math.min(maxDragX, rawDeltaX));

    p.clipX = p.anchorX + clampedDeltaX;
    p.clipY = Math.max(90, Math.min(230, p.anchorY + 135 + (targetClipY - (p.anchorY + 135)) * 0.45));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = physics.current;
    if (p.isDragging) {
      p.isDragging = false;
      const releaseImpulseScale = 0.28;
      p.vx = Math.max(-10, Math.min(10, p.pointerVx * releaseImpulseScale));
      p.vy = Math.max(-8, Math.min(8, p.pointerVy * releaseImpulseScale));

      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[640px] max-w-[380px] mx-auto select-none touch-none flex items-start justify-center"
    >
      {/* Ceiling Anchor Plate */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
        <div className="h-2 w-14 rounded-full bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border border-slate-300 shadow-md" />
        <div className="h-2 w-3.5 bg-gradient-to-b from-slate-600 to-slate-800 rounded-b" />
        <span className="mt-1 font-mono text-[8px] font-bold text-purple-300/80 uppercase tracking-widest bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/20">
          PHYSICAL SRM ID BADGE • DRAG ME
        </span>
      </div>

      {/* SVG Lanyard Ribbon & Metallic Swivel Carabiner */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
        <defs>
          <linearGradient id="srmRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="35%" stopColor="#7e22ce" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="65%" stopColor="#7e22ce" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
        </defs>

        <path
          ref={lanyardPathRef}
          d="M 190 10 Q 190 70 190 135"
          fill="none"
          stroke="url(#srmRibbonGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.7))"
        />

        <g ref={lanyardClipRef} transform="translate(190, 135)">
          <rect x="-10" y="-18" width="20" height="7" rx="2" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="1" />
          <ellipse cx="0" cy="-6" rx="4.5" ry="6" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          <path d="M -7 0 L 7 0 L 5 12 L -5 12 Z" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
        </g>
      </svg>

      {/* Physical SRM Student ID Card (Zero Rotation Physics) - Always visible */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute top-0 left-0 w-[310px] rounded-3xl p-5 z-20 backdrop-blur-2xl will-change-transform cursor-grab active:cursor-grabbing border-2 border-purple-400/40 shadow-[0_30px_70px_rgba(0,0,0,0.9)] bg-gradient-to-b from-[#130d24] via-[#0d091a] to-[#150f28] text-white opacity-100 visible"
        style={{
          transform: "translate3d(35px, 135px, 0)",
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.95),
            0 0 35px var(--accent-glow-subtle, rgba(168, 85, 247, 0.25)),
            inset 0 1px 1px rgba(255, 255, 255, 0.2),
            inset 0 -1px 1px rgba(0, 0, 0, 0.8)
          `,
        }}
      >
        {/* Top Punch Slot */}
        <div className="mx-auto -mt-2 mb-2.5 h-2.5 w-12 rounded-full bg-slate-950/90 border border-white/20 shadow-inner flex items-center justify-center">
          <span className="h-1 w-6 rounded-full bg-white/20" />
        </div>

        {/* SRM Header Banner */}
        <div className="border-b-2 border-purple-500/40 pb-2.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-700 via-indigo-600 to-sky-500 font-black text-xs text-white shadow-md">
              SRM
            </div>
            <div className="text-left">
              <div className="font-sans text-xs font-black tracking-wider text-white uppercase leading-none">
                SRM INSTITUTE OF SCIENCE & TECH
              </div>
              <div className="font-mono text-[8.5px] text-purple-300 font-semibold tracking-tight mt-0.5">
                KATTANKULATHUR • CHENNAI
              </div>
            </div>
          </div>
          <div className="mt-1.5 font-mono text-[9px] font-extrabold tracking-[0.25em] text-amber-300 uppercase">
            STUDENT IDENTITY CARD
          </div>
        </div>

        {/* Card Body: Official Passport Photo + Verified Details */}
        <div className="mt-3.5 flex items-start gap-3.5">
          {/* Framed Official Passport Photo (Standard 3:4 aspect ratio) */}
          <div className="relative h-28 w-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white/60 shadow-xl bg-slate-900 ring-1 ring-purple-400/40">
            <img
              src="/assets/sharvan_passport.jpg"
              alt="Sharvan C S Official Student Passport Photograph"
              className="h-full w-full object-cover object-[center_15%]"
              draggable={false}
            />
            {/* Holographic Security Seal */}
            <div className="pointer-events-none absolute bottom-1 right-1 h-5 w-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border border-amber-100 flex items-center justify-center text-[8px] font-black text-slate-950 shadow-md">
              ★
            </div>
          </div>

          {/* Student Core Details */}
          <div className="flex-1 space-y-1.5 text-left">
            <div>
              <div className="text-[7.5px] font-mono text-purple-300 font-bold uppercase tracking-widest">
                STUDENT NAME
              </div>
              <div className="text-sm font-black text-white leading-tight">
                SHARVAN C S
              </div>
            </div>

            <div>
              <div className="text-[7.5px] font-mono text-slate-400 uppercase tracking-wide">
                REG / ROLL NO
              </div>
              <div className="text-xs font-mono font-black text-sky-400 tracking-wider">
                RA2411003011706
              </div>
            </div>

            <div>
              <div className="text-[7.5px] font-mono text-slate-400 uppercase">
                BRANCH / PROGRAM
              </div>
              <div className="text-[10.5px] font-bold text-purple-200 leading-tight">
                B.Tech CSE (3rd Year)
              </div>
            </div>

            {/* Dynamic Live CGPA Badge */}
            <div className="pt-0.5">
              <span
                className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md border text-white"
                style={{
                  backgroundColor: "var(--accent-color, #c084fc)30",
                  borderColor: "var(--accent-color, #c084fc)60",
                }}
              >
                <Award className="h-2.5 w-2.5 text-amber-300" />
                <span>
                  CGPA: {(() => {
                    const match = String(liveCgpa || "9.05").match(/\d+(\.\d+)?/);
                    return match ? match[0] : "9.05";
                  })()} / 10.0
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* AICTE & Google AI-ML Internship Verification Stamp */}
        <div className="mt-3 rounded-xl border border-emerald-500/50 bg-emerald-950/40 p-2 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-[8.5px] font-mono font-bold text-emerald-300 uppercase">
                AICTE: STU69d47d1b3228a1775533339
              </div>
              <div className="text-[8px] font-mono text-slate-200 font-medium">
                Google AI-ML Virtual Intern (Grade O)
              </div>
            </div>
          </div>
          <span className="text-[7.5px] font-mono font-black text-emerald-300 bg-emerald-500/25 px-1.5 py-0.5 rounded border border-emerald-400/40">
            VERIFIED
          </span>
        </div>

        {/* Contact, Email & Validity */}
        <div className="mt-3 space-y-1.5 text-[9px] font-mono border-t border-white/15 pt-2.5 text-slate-300">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-purple-400 flex-shrink-0" />
            <span className="truncate text-white font-medium">sharvansai123@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-sky-400 flex-shrink-0" />
            <span className="text-white font-medium">+91 8328226454</span>
          </div>
          <div className="flex items-center justify-between text-[8.5px] text-slate-400 pt-0.5">
            <span>BLOOD GRP: <strong className="text-white">O+ve</strong></span>
            <span>VALIDITY: <strong className="text-white">2024 — 2028</strong></span>
          </div>
        </div>

        {/* Card Footer: Digital Barcode & Gold Smart Microchip */}
        <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-[1.5px] h-5">
              <span className="w-[1.5px] h-full bg-white" />
              <span className="w-[3px] h-full bg-white" />
              <span className="w-[1px] h-full bg-white" />
              <span className="w-[4px] h-full bg-white" />
              <span className="w-[1.5px] h-full bg-white" />
              <span className="w-[2px] h-full bg-white" />
              <span className="w-[3px] h-full bg-white" />
              <span className="w-[4.5px] h-full bg-white" />
              <span className="w-[1px] h-full bg-white" />
              <span className="w-[2.5px] h-full bg-white" />
              <span className="w-[1.5px] h-full bg-white" />
            </div>
            <div className="text-[7px] font-mono text-slate-400 font-semibold tracking-wider">
              *RA2411003011706*
            </div>
          </div>

          <div className="h-6 w-8 rounded bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 border border-amber-600 shadow-md flex items-center justify-center">
            <div className="h-4 w-5 border border-amber-700/70 rounded-sm grid grid-cols-2 gap-0.5">
              <span className="bg-amber-600/40" />
              <span className="bg-amber-600/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
