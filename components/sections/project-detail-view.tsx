"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  CheckCircle2,
  Cpu,
  Sparkles,
} from "lucide-react";
import { initialSharvanBaseData, getSharvanBaseData } from "@/lib/sharvan-base-data";

export function ProjectDetailView({ slug }: { slug: string }) {
  const [data, setData] = useState(initialSharvanBaseData);

  useEffect(() => {
    setData(getSharvanBaseData());
    const handleUpdate = () => setData(getSharvanBaseData());
    window.addEventListener("sharvan-base-updated", handleUpdate);
    return () => window.removeEventListener("sharvan-base-updated", handleUpdate);
  }, []);

  const project = data.projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-white">Project Case Study Not Found</h2>
        <p className="mt-2 text-sm text-slate-400">
          The requested system was not found in Sharvan Base.
        </p>
        <Link
          href="/#projects"
          className="mt-6 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-sky-400"
        >
          Return to Projects Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl border border-white/15 bg-slate-900/60 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: `${project.accentColor}20`,
              color: project.accentColor,
              border: `1px solid ${project.accentColor}40`,
            }}
          >
            {project.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{project.status}</span>
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-2 text-base font-mono text-slate-300 sm:text-lg">{project.tagline}</p>

        {/* Metrics Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {project.metrics.map((m, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/5 bg-slate-950/80 p-4 text-center"
            >
              <div
                className="text-xl sm:text-2xl font-extrabold"
                style={{ color: project.accentColor }}
              >
                {m.value}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-105 transition-all"
          >
            <span>Launch Live Deployment</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-5 py-3 text-xs font-semibold text-slate-200 hover:text-white"
            >
              <Github className="h-4 w-4" />
              <span>Source Repository</span>
            </a>
          )}
        </div>
      </div>

      {/* Deep Dive Narrative */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <span>System Overview & Problem Statement</span>
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-400" />
              <span>Architectural Pillars & Technical Decisions</span>
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {project.architecture.map((arch, aIdx) => (
                <li key={aIdx} className="flex items-start gap-3 rounded-xl bg-slate-950/60 p-3.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="leading-relaxed">{arch}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-300 tracking-wider">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1 text-xs text-sky-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold font-mono uppercase text-slate-300 tracking-wider">
              Deployment Info
            </h3>
            <div className="text-xs space-y-2 text-slate-400">
              <div>
                <span className="text-slate-500">Live URL:</span>{" "}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-400 hover:underline"
                >
                  {project.liveUrl.replace("https://", "")}
                </a>
              </div>
              <div>
                <span className="text-slate-500">Infrastructure:</span> Netlify Edge CI/CD
              </div>
              <div>
                <span className="text-slate-500">Author:</span> C S Sharvan Sai
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
