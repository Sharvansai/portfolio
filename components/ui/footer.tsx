"use client";
import React from "react";
import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail, ExternalLink, Shield } from "lucide-react";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 font-mono font-bold text-white">
                S
              </div>
              <span className="font-mono text-base font-bold tracking-wider text-white">
                SHARVAN — Creative Dev
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Crafting immersive web experiences, interactive 3D simulations, pathfinding algorithm labs, and production-grade architectures. Powered by Sharvan Base.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Status: Open for High-Impact Roles & Collaborations</span>
            </div>
          </div>

          {/* Direct Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-slate-200 uppercase">
              Featured Systems
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="https://techgaminghub.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-sky-400"
                >
                  <span>Tech Gaming Hub (20+ Games)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sai-games-online.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-sky-400"
                >
                  <span>Sai Games Online</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://avrouteplanner.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-sky-400"
                >
                  <span>AV Route Planner (A* Lab)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://nexorabytfi.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 transition-colors hover:text-sky-400"
                >
                  <span>NEXORA SaaS Engine</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Jump & Sharvan Base */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-slate-200 uppercase">
              Control & Recruiter
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
              >
                <span>Recruiter ATS Resume</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Sharvan Base CMS</span>
              </Link>
              <button
                onClick={scrollToTop}
                className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:text-white"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} C S Sharvan Sai. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:sharvansai123@gmail.com"
              className="hover:text-slate-300 transition-colors"
            >
              sharvansai123@gmail.com
            </a>
            <span>•</span>
            <span>+91 8328226454</span>
            <span>•</span>
            <span>SRM IST Kattankulathur</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
