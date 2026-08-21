"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Cpu,
  BookOpen,
  Check,
} from "lucide-react";
import { initialSharvanBaseData, getSharvanBaseData } from "@/lib/sharvan-base-data";

export const TimelineSection = () => {
  const [timeline, setTimeline] = useState(initialSharvanBaseData.timeline);
  const [achievements, setAchievements] = useState(initialSharvanBaseData.achievements);
  const [liveCgpa, setLiveCgpa] = useState("9.05");
  const [expandedId, setExpandedId] = useState<string | null>("edu-internship");

  // Helper to extract clean CGPA number (prevents duplicate / 10.0)
  const getCleanCgpa = (raw: string) => {
    if (!raw) return "9.05";
    const cleaned = raw.replace(/\/.*$/, "").trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? "9.05" : num.toFixed(2);
  };

  const syncData = () => {
    const data = getSharvanBaseData();
    if (data?.timeline) setTimeline(data.timeline);
    if (data?.achievements) setAchievements(data.achievements);
    if (data?.profile?.cgpa) setLiveCgpa(getCleanCgpa(data.profile.cgpa));
  };

  useEffect(() => {
    syncData();

    window.addEventListener("sharvan-base-updated", syncData);
    window.addEventListener("storage", syncData);

    return () => {
      window.removeEventListener("sharvan-base-updated", syncData);
      window.removeEventListener("storage", syncData);
    };
  }, []);

  const cgpaDisplay = getCleanCgpa(liveCgpa);

  return (
    <section id="timeline" className="relative z-10 w-full py-28 scroll-mt-12 select-none">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-semibold tracking-wider transition-colors"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--accent-color, #c084fc)40",
              color: "var(--accent-color, #c084fc)",
            }}
          >
            <GraduationCap className="h-4 w-4" />
            <span>ACADEMIC TRAJECTORY & EXPERIENCE</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Education, Experience &{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--accent-color, #c084fc), #38bdf8, #34d399)",
              }}
            >
              Milestones
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Validated engineering programs, competitive academics, and Google AI-ML internship certification.
          </p>
        </div>

        {/* Live Academic Distinction HUD Gauge */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#090818]/90 p-6 backdrop-blur-2xl shadow-xl flex flex-wrap items-center justify-around gap-6">
          {/* 1. SRM CGPA HUD Item */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border text-xl font-black shadow-lg transition-transform hover:scale-105"
              style={{
                backgroundColor: "var(--accent-color, #c084fc)20",
                borderColor: "var(--accent-color, #c084fc)50",
                color: "var(--accent-color, #c084fc)",
              }}
            >
              {cgpaDisplay}
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">SRM IST B.TECH CSE</div>
              <div className="text-sm font-bold text-white">Cumulative GPA: {cgpaDisplay} / 10.0</div>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

          {/* 2. Intermediate MPC HUD Item */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-950/40 text-xl font-black text-emerald-300 shadow-lg transition-transform hover:scale-105">
              94.3%
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">SRI CHAITANYA JR COLLEGE</div>
              <div className="text-sm font-bold text-white">MPC (Mathematics, Physics, Chemistry)</div>
            </div>
          </div>

          <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

          {/* 3. Google AI-ML HUD Item */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/40 bg-sky-950/40 text-base font-black text-sky-300 shadow-lg transition-transform hover:scale-105">
              GRADE O
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">GOOGLE AI-ML INTERNSHIP</div>
              <div className="text-sm font-bold text-white">Outstanding (90-100%) Distinction</div>
            </div>
          </div>
        </div>

        {/* Timeline & Recognitions Layout */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Main Neural Timeline Column */}
          <div className="lg:col-span-8 space-y-6">
            {timeline.map((item, idx) => {
              const isInternship = item.id === "edu-internship" || item.title.includes("Intern");
              const isExpanded = expandedId === item.id;
              const isSrm = item.id === "edu-srm" || item.title.includes("B.Tech");

              // Format clean badge score string
              let badgeScore = item.score;
              if (isSrm) {
                badgeScore = `CGPA: ${cgpaDisplay} / 10.0`;
              }

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="group relative pl-8 border-l-2 transition-colors duration-300"
                  style={{
                    borderColor: isInternship
                      ? "var(--accent-color, #c084fc)"
                      : "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  {/* Glowing Pulse Node Marker with Laser Ring */}
                  <div
                    className="absolute -left-[9px] top-4 h-4 w-4 rounded-full border-2 bg-slate-950 transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer group-hover:scale-125"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{
                      borderColor: isInternship ? "var(--accent-color, #c084fc)" : "rgba(255,255,255,0.5)",
                      boxShadow: isInternship ? "0 0 14px var(--accent-color, #c084fc)" : "none",
                    }}
                  >
                    {isInternship && (
                      <span
                        className="h-1.5 w-1.5 rounded-full animate-ping"
                        style={{ backgroundColor: "var(--accent-color, #c084fc)" }}
                      />
                    )}
                  </div>

                  {/* Milestone Hologram Card Chassis with Hover Laser Scan */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="cursor-pointer relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0818]/90 p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 hover:border-white/30 hover:bg-[#0e0c20] shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
                  >
                    {/* Laser Scanner Line on Hover */}
                    <div
                      className="pointer-events-none absolute -inset-x-full top-0 h-[2px] opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity"
                      style={{
                        background: "linear-gradient(90deg, transparent, var(--accent-color, #c084fc), transparent)",
                      }}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        {isInternship ? (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-mono font-bold text-white border shadow-sm"
                            style={{
                              backgroundColor: "var(--accent-color, #c084fc)",
                              borderColor: "rgba(255,255,255,0.3)",
                            }}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>VIRTUAL INTERNSHIP</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{item.period}</span>
                          </span>
                        )}
                      </div>

                      {badgeScore && (
                        <span
                          className="rounded-full border px-3 py-0.5 text-xs font-mono font-bold"
                          style={{
                            backgroundColor: "rgba(52, 211, 153, 0.12)",
                            borderColor: "rgba(52, 211, 153, 0.4)",
                            color: "#34d399",
                          }}
                        >
                          {badgeScore}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {item.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                          <span className="text-slate-200 font-semibold">{item.institution}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </span>
                        </div>
                      </div>

                      <button
                        className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 group-hover:text-white transition-colors"
                        title="Toggle Details"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Expandable Highlights Matrix */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pt-4 mt-4 border-t border-white/10"
                        >
                          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                            {item.highlights.map((h, hIdx) => (
                              <li key={hIdx} className="flex items-start gap-2.5">
                                <CheckCircle2
                                  className="mt-0.5 h-4 w-4 shrink-0 transition-colors"
                                  style={{ color: "var(--accent-color, #c084fc)" }}
                                />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Key Recognitions & Academic Distinctions */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Academic Recognitions</span>
            </h3>

            <div className="space-y-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="rounded-2xl border border-white/10 bg-[#0a0818]/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/30 hover:bg-[#0e0c20]/80 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-amber-300">
                      {ach.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{ach.date}</span>
                  </div>

                  <h4 className="mt-2.5 text-base font-bold text-white">{ach.title}</h4>
                  <p className="mt-0.5 text-xs font-mono text-purple-300">{ach.issuer}</p>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
