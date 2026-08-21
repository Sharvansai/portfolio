"use client";
import React from "react";
import Link from "next/link";
import { FileText, Download, ExternalLink, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { initialSharvanBaseData } from "@/lib/sharvan-base-data";

export const ResumeSection = () => {
  const profile = initialSharvanBaseData.profile;

  return (
    <section id="resume-preview" className="relative z-10 w-full py-24 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-mono text-sky-300">
            <FileText className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-semibold tracking-wider">RECRUITER & ATS FAST TRACK</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Recruiter-Friendly{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-400">
              Resume Snapshot
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Zero-friction, ATS-formatted view tailored for engineering hiring managers and technical recruiters.
          </p>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/resume"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:scale-105 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Open Dedicated Clean Resume Page</span>
          </Link>
          <a
            href="mailto:sharvansai123@gmail.com?subject=Job%20Opportunity%20for%20C%20S%20Sharvan%20Sai"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-6 py-2.5 text-xs font-semibold text-slate-200 hover:border-white/30 hover:text-white transition-all"
          >
            <Mail className="h-4 w-4 text-sky-400" />
            <span>Email Sharvan Directly</span>
          </a>
        </div>

        {/* ATS Resume Card */}
        <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-white/15 bg-slate-950 p-8 shadow-2xl backdrop-blur-2xl text-left">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-pink-400">
                C S SHARVAN SAI
              </h3>
              <p className="text-xs font-mono text-sky-400 mt-1 font-medium">
                3rd Year B.Tech in Computer Science and Engineering • SRM IST Kattankulathur
              </p>
            </div>
            <div className="flex flex-col text-xs font-mono text-slate-400 space-y-1 sm:text-right">
              <div>+91 8328226454 • sharvansai123@gmail.com</div>
              <div>CGPA: 9.05 / 10.0 • Chennai / Vijayawada, India</div>
            </div>
          </div>

          {/* Education */}
          <div className="mt-6">
            <h4 className="font-mono text-xs font-bold tracking-wider text-sky-400 uppercase">
              Education
            </h4>
            <div className="mt-3 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    SRM Institute of Science and Technology, Kattankulathur
                  </div>
                  <div className="text-xs text-slate-400">
                    3rd Year B.Tech in Computer Science and Engineering (CGPA: 9.05 / 10)
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-500">Aug 2024 — Present</div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">
                    Sri Chaitanya Junior College, Vijayawada
                  </div>
                  <div className="text-xs text-slate-400">
                    Intermediate (M.P.C) — Percentage: 94.3%
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-500">Jun 2022 — Apr 2024</div>
              </div>
            </div>
          </div>

          {/* Experience & Internships */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <h4 className="font-mono text-xs font-bold tracking-wider text-sky-400 uppercase">
              Experience & Internships
            </h4>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Google AI-ML Virtual Intern</span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                        GRADE O (OUTSTANDING)
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-purple-300 mt-0.5">
                      EduSkills • AICTE • Google for Developers
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Certificate ID: 4b859f21b1d7750a5fc6 • AICTE ID: STU69d47d1b3228a1775533339
                    </div>
                  </div>
                  <div className="text-xs font-mono text-slate-400 whitespace-nowrap">
                    Apr 2026 — Jun 2026 (8 Weeks)
                  </div>
                </div>

                <ul className="mt-2.5 list-disc pl-4 text-xs text-slate-300 space-y-1">
                  <li>
                    Engineered and trained deep neural networks, computer vision models, and NLP text processing classifiers using TensorFlow and Python.
                  </li>
                  <li>
                    Built end-to-end data preprocessing pipelines and hyperparameter tuning optimizations achieving high-precision validation metrics.
                  </li>
                  <li>
                    Earned Grade O Outstanding certification verified under the national EduSkills & AICTE technical internship framework.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <h4 className="font-mono text-xs font-bold tracking-wider text-sky-400 uppercase">
              Technical Core Competencies
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 text-slate-300">
              <div><strong className="text-white">Languages:</strong> Java, C++, Python, JavaScript, TypeScript</div>
              <div><strong className="text-white">Web Stack:</strong> React, Next.js (App Router), Tailwind CSS, Three.js, PHP</div>
              <div><strong className="text-white">Databases:</strong> MySQL, Relational Database Management (DBMS), ER Diagrams</div>
              <div><strong className="text-white">Core CS & AI:</strong> Graph Algorithms (BFS, DFS, Dijkstra, A*), OS, CPU Scheduling</div>
            </div>
          </div>

          {/* Featured Live Projects */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <h4 className="font-mono text-xs font-bold tracking-wider text-sky-400 uppercase">
              Featured Verified Projects
            </h4>
            <div className="mt-3 space-y-4 text-xs text-slate-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Tech Gaming Hub | Multi-Game Arcade</span>
                  <a
                    href="https://techgaminghub.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>techgaminghub.netlify.app</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-1 text-slate-400">
                  Engineered interactive web gaming portal with 20+ games, 60fps canvas engine, audio synthesizers, and real-time score tracking.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">AV Route Planner | Graph Algorithms Lab</span>
                  <a
                    href="https://avrouteplanner.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>avrouteplanner.netlify.app</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-1 text-slate-400">
                  Built an interactive algorithm learning lab visualizing BFS, DFS, Dijkstra, and A* pathfinding on preset city graphs (Chennai, London, Tokyo, NY) with dynamic obstacle avoidance.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">NEXORA | Dynamic SaaS Web Platform</span>
                  <a
                    href="https://nexorabytfi.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>nexorabytfi.netlify.app</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-1 text-slate-400">
                  Architected a multi-step SaaS platform generating tailored themed business websites with adaptive token remapping across industry categories.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Sharvani's Boutique | Full-Stack Platform</span>
                  <a
                    href="https://sharvanis-beautyparlour-botique.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>sharvanis-beautyparlour-botique.netlify.app</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="mt-1 text-slate-400">
                  Full-stack business web platform with custom AI-powered chatbot, WhatsApp booking integration, and interactive appointment widget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
