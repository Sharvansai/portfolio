"use client";
import React, { useState } from "react";
import { Sparkles, Code2, Cpu, Globe, Layers, Terminal } from "lucide-react";

interface SkillClusterProps {
  onHoverSkill?: (skillName: string | null) => void;
}

export const AboutSkillsCluster: React.FC<SkillClusterProps> = ({
  onHoverSkill,
}) => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const categories = [
    {
      title: "Frontend Architecture",
      icon: <Globe className="h-3.5 w-3.5 text-sky-400" />,
      tag: "UI / UX / 3D",
      skills: [
        { name: "React & Next.js", level: "Advanced", reaction: "React" },
        { name: "Tailwind CSS", level: "Expert", reaction: "CSS" },
        { name: "GSAP & ScrollTrigger", level: "Advanced", reaction: "GSAP" },
        { name: "Three.js / WebGL", level: "Interactive", reaction: "Three.js" },
        { name: "HTML5 Canvas API", level: "60 FPS", reaction: "Canvas" },
        { name: "TypeScript", level: "Type Safe", reaction: "TS" },
      ],
    },
    {
      title: "Backend & Systems",
      icon: <Layers className="h-3.5 w-3.5 text-emerald-400" />,
      tag: "CLOUD & API",
      skills: [
        { name: "Node.js & Express", level: "REST / APIs", reaction: "Node" },
        { name: "Python", level: "Algorithms", reaction: "Python" },
        { name: "MySQL & Relational DB", level: "ACID / Schema", reaction: "SQL" },
        { name: "PHP & Server Logic", level: "Backend", reaction: "PHP" },
        { name: "Serverless & Edge", level: "CI/CD", reaction: "Cloud" },
      ],
    },
    {
      title: "AI / ML & Algorithms",
      icon: <Sparkles className="h-3.5 w-3.5 text-pink-400" />,
      tag: "CORE CS",
      skills: [
        { name: "Graph Search (A*, Dijkstra)", level: "Heuristics", reaction: "AI" },
        { name: "Machine Learning Concepts", level: "Models", reaction: "AI" },
        { name: "Computer Vision Foundations", level: "Vision", reaction: "AI" },
        { name: "Data Structures & Complexity", level: "Optimization", reaction: "Algorithms" },
        { name: "OS & Process Synchronization", level: "Core CS", reaction: "OS" },
      ],
    },
    {
      title: "Creative Technology",
      icon: <Cpu className="h-3.5 w-3.5 text-purple-400" />,
      tag: "INNOVATION",
      skills: [
        { name: "SVG Mask Portals", level: "Custom FX", reaction: "GSAP" },
        { name: "Interactive 2D Game Engines", level: "20+ Games", reaction: "Canvas" },
        { name: "Motion & Choreography", level: "Fluid UI", reaction: "GSAP" },
        { name: "Design System Architecture", level: "Tokens", reaction: "Design" },
        { name: "Technical Poster Art", level: "Visual", reaction: "Creative" },
      ],
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Category selector pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(idx)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-mono transition-all ${
              activeCategory === idx
                ? "bg-purple-600/30 text-purple-200 border border-purple-400/60 shadow-lg shadow-purple-500/20"
                : "bg-white/[0.03] text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-200"
            }`}
          >
            {cat.icon}
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Skills Pill Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
        {categories[activeCategory].skills.map((skill, idx) => (
          <div
            key={idx}
            onMouseEnter={() => onHoverSkill?.(skill.reaction)}
            onMouseLeave={() => onHoverSkill?.(null)}
            className="group relative flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 backdrop-blur-md transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-950/20 hover:scale-[1.02] cursor-pointer select-none"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 group-hover:animate-ping" />
              <span className="font-mono text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                {skill.name}
              </span>
            </div>
            <span className="font-mono text-[10px] text-purple-300/80 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-400/20 group-hover:border-purple-400/40">
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
