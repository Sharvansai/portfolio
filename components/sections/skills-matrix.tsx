"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Database, Cpu, Wrench, Sparkles, Terminal } from "lucide-react";
import { initialSharvanBaseData, SkillCategory } from "@/lib/sharvan-base-data";

export const SkillsMatrix = () => {
  const skillCategories = initialSharvanBaseData.skills;
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const getCategoryIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Code className="h-4 w-4" />;
      case 1:
        return <Sparkles className="h-4 w-4" />;
      case 2:
        return <Database className="h-4 w-4" />;
      case 3:
        return <Cpu className="h-4 w-4" />;
      case 4:
        return <Wrench className="h-4 w-4" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  return (
    <section id="skills" className="relative z-10 w-full py-24 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-mono text-indigo-300">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold tracking-wider">TECHNICAL CAPABILITIES & FOUNDATIONS</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Skills, Languages &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-400">
              Core CS
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Rigorous foundations across low-level algorithms, operating systems, full-stack architecture, and interactive 3D rendering.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {skillCategories.map((cat, idx) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(idx)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                activeCategory === idx
                  ? "border border-sky-400/50 bg-gradient-to-r from-sky-500/20 to-indigo-600/20 text-white shadow-lg shadow-sky-500/10 backdrop-blur-md"
                  : "border border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <span className={activeCategory === idx ? "text-sky-400" : "text-slate-500"}>
                {getCategoryIcon(idx)}
              </span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Active Category Display - Uiverse Expanding Skill Accordion */}
        <div className="mt-10">
          <div className="uiverse-skills-container">
            {skillCategories[activeCategory].skills.map((skill, sIdx) => (
              <div key={skill.name} className="uiverse-skill-panel group/panel">
                <span className="skill-title-rotate">
                  {skill.name}
                </span>

                <div className="skill-reveal-details space-y-3 text-center">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="rounded bg-pink-500/20 px-2 py-0.5 font-bold text-pink-300 border border-pink-500/30">
                      {skill.badge || "PRO"}
                    </span>
                    <span className="font-bold text-sky-400 text-sm">
                      {skill.level}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      style={{ width: `${skill.level}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-sky-400"
                    />
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    Applied in real-world systems, games & production deployments.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CS Core Callout */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-sky-950/30 via-slate-900/50 to-indigo-950/30 p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center">
            <div className="md:col-span-1">
              <span className="text-xs font-mono text-sky-400 uppercase">Core Rigor</span>
              <h3 className="mt-1 text-xl font-bold text-white">Algorithms & System Concepts</h3>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-3 text-xs text-slate-300 sm:grid-cols-3">
              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <div className="font-semibold text-white">Graph Traversals</div>
                <div className="text-slate-400">BFS, DFS, Dijkstra, A*</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <div className="font-semibold text-white">Operating Systems</div>
                <div className="text-slate-400">CPU Scheduling, Threads</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <div className="font-semibold text-white">Database Systems</div>
                <div className="text-slate-400">DBMS, ER Models, MySQL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
