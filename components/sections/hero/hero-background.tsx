"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const HeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);
  const gridLayerRef = useRef<HTMLDivElement>(null);
  const contourLayerRef = useRef<SVGSVGElement>(null);
  const archLayerRef = useRef<SVGSVGElement>(null);
  const dataPathLayerRef = useRef<SVGSVGElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);

  // Parallax physics coordinates
  const parallax = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    time: 0,
  });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      parallax.current.targetX = normX;
      parallax.current.targetY = normY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Setup particles on canvas
    const canvas = particlesCanvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    let width = (canvas ? (canvas.width = window.innerWidth) : 1920);
    let height = (canvas ? (canvas.height = window.innerHeight) : 1080);

    if (canvas) {
      ctx = canvas.getContext("2d");
    }

    const particleCount = typeof window !== "undefined" && window.innerWidth < 768 ? 14 : 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.12 - Math.random() * 0.22,
      size: 0.8 + Math.random() * 1.5,
      baseAlpha: 0.12 + Math.random() * 0.3,
      alpha: 0.2,
      pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? "192, 132, 252" : "147, 197, 253",
    }));

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Continuous 60-120 FPS Parallax & Particle Ticker
    const tickerCallback = () => {
      const p = parallax.current;
      p.time += 0.012;

      // Smooth mouse lerping
      p.currentX += (p.targetX - p.currentX) * 0.05;
      p.currentY += (p.targetY - p.currentY) * 0.05;

      const px = p.currentX;
      const py = p.currentY;

      // 1. Parallax Layers (Subtle staggered pixel translations)
      if (glowLayerRef.current) {
        glowLayerRef.current.style.transform = `translate3d(${(px * 4).toFixed(2)}px, ${(py * 3).toFixed(2)}px, 0)`;
      }
      if (gridLayerRef.current) {
        gridLayerRef.current.style.transform = `translate3d(${(px * 6).toFixed(2)}px, ${(py * 5).toFixed(2)}px, 0)`;
      }
      if (contourLayerRef.current) {
        contourLayerRef.current.style.transform = `translate3d(${(px * 10).toFixed(2)}px, ${(py * 8).toFixed(2)}px, 0)`;
      }
      if (archLayerRef.current) {
        archLayerRef.current.style.transform = `translate3d(${(px * 14).toFixed(2)}px, ${(py * 10).toFixed(2)}px, 0)`;
      }
      if (dataPathLayerRef.current) {
        dataPathLayerRef.current.style.transform = `translate3d(${(px * 12).toFixed(2)}px, ${(py * 9).toFixed(2)}px, 0)`;
      }

      // 2. Render subtle ambient particles on canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.pulse += 0.02;

          // Screen wrap
          if (pt.y < -10) pt.y = height + 10;
          if (pt.x < -10) pt.x = width + 10;
          if (pt.x > width + 10) pt.x = -10;

          // Parallax offset
          const drawX = pt.x + px * 16;
          const drawY = pt.y + py * 12;
          const alpha = pt.baseAlpha + Math.sin(pt.pulse) * 0.15;

          ctx.beginPath();
          ctx.arc(drawX, drawY, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pt.color}, ${Math.max(0.05, alpha)})`;
          ctx.shadowColor = "rgba(168, 85, 247, 0.4)";
          ctx.shadowBlur = 4;
          ctx.fill();
        }
      }
    };

    gsap.ticker.add(tickerCallback);

    return () => {
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-background-system pointer-events-none absolute inset-0 h-full w-full overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* LAYER 1: DEEP LUXURY AMBIENT GRADIENT LIGHT FIELDS                        */}
      {/* ========================================================================= */}
      <div ref={glowLayerRef} className="absolute inset-0 w-full h-full will-change-transform">
        {/* Soft Center-Left Ambient Violet Field */}
        <div className="absolute top-[30%] left-[8%] h-[500px] w-[500px] rounded-full bg-purple-900/12 blur-[170px]" />
        
        {/* Soft Behind-Portrait Atmospheric Aura */}
        <div className="absolute top-[40%] right-[12%] h-[600px] w-[600px] rounded-full bg-indigo-900/14 blur-[200px]" />
        
        {/* Far Left Upper Field */}
        <div className="absolute -top-[10%] left-[2%] h-[450px] w-[450px] rounded-full bg-purple-950/15 blur-[160px]" />
        
        {/* Subtle Central Indigo Bridge */}
        <div className="absolute top-[50%] left-[45%] -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-purple-950/8 blur-[240px]" />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: MULTI-SCALE ATMOSPHERIC TECHNICAL GRID WITH VIGNETTE MASK       */}
      {/* ========================================================================= */}
      <div
        ref={gridLayerRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      >
        {/* Large Blueprint Grid (80px) */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Medium Technical Grid (24px) */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(192, 132, 252, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(192, 132, 252, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: DIGITAL TOPOGRAPHIC ELEVATION CONTOUR FIELD (LEFT & CENTER)      */}
      {/* ========================================================================= */}
      <svg
        ref={contourLayerRef}
        className="absolute inset-0 h-full w-full overflow-visible will-change-transform"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="contourGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.03" />
            <stop offset="35%" stopColor="#c084fc" stopOpacity="0.14" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="contourGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.02" />
            <stop offset="40%" stopColor="#a855f7" stopOpacity="0.12" />
            <stop offset="80%" stopColor="#c084fc" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Topographic Contour Curves */}
        <g stroke="url(#contourGrad1)" fill="none" strokeWidth="1">
          <path d="M-60,180 C240,120 480,260 840,190 S1400,320 1980,220" />
          <path d="M-60,240 C280,180 540,330 920,260 S1460,400 1980,310" strokeDasharray="6 8" strokeOpacity="0.8" />
          <path d="M-60,310 C320,250 600,410 1000,340 S1520,490 1980,400" />
          <path d="M-60,390 C360,330 660,500 1080,430 S1580,590 1980,500" strokeWidth="1.2" />
          <path d="M-60,480 C400,420 720,600 1160,530 S1640,700 1980,610" strokeDasharray="4 6" />
          <path d="M-60,580 C440,520 780,710 1240,640 S1700,820 1980,730" />
          <path d="M-60,690 C480,630 840,830 1320,760 S1760,950 1980,860" />
          <path d="M-60,810 C520,750 900,960 1400,890 S1820,1090 1980,1000" strokeDasharray="8 10" />
        </g>

        {/* Organic Secondary Micro-Contours */}
        <g stroke="url(#contourGrad2)" fill="none" strokeWidth="0.8">
          <path d="M-30,120 Q220,90 380,210 T760,290" />
          <path d="M-30,220 Q260,170 440,310 T860,410" />
          <path d="M-30,340 Q300,270 500,430 T960,550" strokeDasharray="3 5" />
          <path d="M-30,470 Q340,390 560,570 T1060,710" />
          <path d="M-30,620 Q380,530 620,730 T1160,890" />
          <path d="M-30,780 Q420,690 680,910 T1260,1080" strokeDasharray="4 6" />
        </g>

        {/* Subtle Contour Rings around the Portrait Zone to soften borders */}
        <g stroke="rgba(192, 132, 252, 0.08)" fill="none" strokeWidth="1">
          <ellipse cx="1480" cy="500" rx="340" ry="460" strokeDasharray="8 12" />
          <ellipse cx="1480" cy="500" rx="380" ry="510" strokeOpacity="0.5" />
          <ellipse cx="1480" cy="500" rx="430" ry="570" strokeDasharray="4 8" strokeOpacity="0.3" />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* LAYER 4: ABSTRACT DIGITAL ARCHITECTURE & WIREFRAME MAP (FAR LEFT & BOTTOM) */}
      {/* ========================================================================= */}
      <svg
        ref={archLayerRef}
        className="absolute inset-0 h-full w-full overflow-visible will-change-transform"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="archGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Far-Left Blueprint Geometric Architecture */}
        <g stroke="url(#archGrad)" fill="none" strokeWidth="0.9">
          <line x1="80" y1="100" x2="80" y2="980" strokeDasharray="3 6" />
          <line x1="160" y1="180" x2="160" y2="900" />
          <line x1="260" y1="240" x2="260" y2="820" strokeDasharray="5 7" />

          <line x1="40" y1="280" x2="340" y2="280" />
          <line x1="40" y1="520" x2="420" y2="520" strokeDasharray="6 8" />
          <line x1="40" y1="760" x2="380" y2="760" />

          <rect x="70" y="320" width="130" height="160" strokeOpacity="0.6" />
          <rect x="150" y="560" width="180" height="140" strokeDasharray="4 6" strokeOpacity="0.5" />
          <rect x="90" y="740" width="110" height="100" strokeOpacity="0.4" />

          <line x1="80" y1="320" x2="200" y2="280" />
          <line x1="200" y1="480" x2="330" y2="430" />
          <line x1="150" y1="700" x2="280" y2="650" />
        </g>

        {/* Technical Coordinate Typography */}
        <g fill="rgba(168, 85, 247, 0.25)" fontFamily="monospace" fontSize="8" letterSpacing="0.15em">
          <text x="88" y="274">SYS.01 // ARCH_GRID</text>
          <text x="168" y="514">NODE_07 [ACTIVE]</text>
          <text x="168" y="754">LAT_12.8231° N</text>
          <text x="268" y="234">LNG_80.0442° E</text>
          <text x="96" y="910">CORE_V2.5 // SRM_IST</text>
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* LAYER 5: DATA FLOW PATHWAYS WITH SLOW GLOWING NODES                       */}
      {/* ========================================================================= */}
      <svg
        ref={dataPathLayerRef}
        className="absolute inset-0 h-full w-full overflow-visible will-change-transform"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="dataLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.02" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <g stroke="url(#dataLineGrad)" fill="none" strokeWidth="1.2">
          <path d="M120,920 L380,780 L620,780 L880,620 L1200,620" />
          <path d="M80,460 L240,460 L440,360 L780,360 L1080,480" strokeDasharray="6 6" />
          <path d="M220,140 L480,220 L720,220 L960,340 L1340,340" />
        </g>

        {/* Traveling data packets */}
        <circle r="3" fill="#c084fc">
          <animateMotion
            path="M120,920 L380,780 L620,780 L880,620 L1200,620"
            dur="16s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="2.5" fill="#38bdf8">
          <animateMotion
            path="M80,460 L240,460 L440,360 L780,360 L1080,480"
            dur="22s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="2.5" fill="#e879f9">
          <animateMotion
            path="M220,140 L480,220 L720,220 L960,340 L1340,340"
            dur="18s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* ========================================================================= */}
      {/* LAYER 6: AMBIENT DATA PARTICLES CANVAS                                    */}
      {/* ========================================================================= */}
      <canvas
        ref={particlesCanvasRef}
        className="absolute inset-0 h-full w-full will-change-transform"
      />
    </div>
  );
};
