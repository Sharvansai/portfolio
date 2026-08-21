"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Sparkles } from "lucide-react";
import { initialSharvanBaseData, ProjectItem } from "@/lib/sharvan-base-data";
import { ProjectCard } from "./project-card";

export const ProjectsGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const projects = initialSharvanBaseData.projects;
  const categories = ["All", "Interactive 3D / Games", "Algorithms / AI", "Full-Stack", "Frontend Architecture"];

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative z-10 w-full py-24 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-semibold tracking-wider transition-colors"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderColor: "var(--accent-color, #c084fc)40",
              color: "var(--accent-color, #c084fc)",
            }}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>FEATURED SYSTEMS & DEPLOYMENTS</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Engineered Systems &{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--accent-color, #c084fc), #38bdf8, #f472b6)",
              }}
            >
              Deployments
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Real production-deployed web applications, multi-game platforms, algorithm visualizers, and full-stack SaaS engines.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 border ${
                  isSelected
                    ? "text-white shadow-lg"
                    : "border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: "var(--accent-color, #c084fc)",
                        borderColor: "rgba(255,255,255,0.3)",
                        boxShadow: "0 0 20px var(--accent-glow-subtle, rgba(192,132,252,0.3))",
                      }
                    : {}
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3D Holographic Projects Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="h-full"
              >
                <ProjectCard project={project} index={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
