"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Printer,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Code,
  Award,
} from "lucide-react";
import { initialSharvanBaseData, getSharvanBaseData } from "@/lib/sharvan-base-data";

export default function ResumePage() {
  const [data, setData] = useState(initialSharvanBaseData);

  const syncData = () => {
    const fresh = getSharvanBaseData();
    setData(fresh);
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

  const handlePrint = () => {
    window.print();
  };

  const rawCgpa = data.profile?.cgpa || "9.05";
  const cgpaMatch = String(rawCgpa).match(/\d+(\.\d+)?/);
  const cgpa = cgpaMatch ? cgpaMatch[0] : "9.05";

  return (
    <div className="mx-auto max-w-4xl px-4 py-28 sm:px-6 lg:px-8">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Interactive Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:scale-105 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save as PDF</span>
          </button>
          <a
            href="mailto:sharvansai123@gmail.com?subject=Job%20Opportunity%20-%20C%20S%20Sharvan%20Sai"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white"
          >
            <Mail className="h-4 w-4 text-purple-400" />
            <span>Email Sharvan</span>
          </a>
        </div>
      </div>

      {/* Printable ATS Resume Document */}
      <div className="rounded-3xl border border-white/15 bg-slate-950 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-slate-200 print:border-0 print:bg-white print:p-0 print:text-black">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white print:text-black">
                C S SHARVAN SAI
              </h1>
              <p className="mt-1 text-sm font-semibold text-purple-300 print:text-slate-700">
                3rd Year B.Tech in Computer Science and Engineering • Full Stack Developer & AI/ML
              </p>
            </div>
            <div className="flex flex-col text-xs font-mono text-slate-400 print:text-slate-600 space-y-1 sm:text-right">
              <div>+91 8328226454 | sharvansai123@gmail.com</div>
              <div>SRM IST Kattankulathur, Chennai / Andhra Pradesh, India</div>
              <div>CGPA: <strong>{cgpa} / 10.0</strong> | Academic Distinction</div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mt-8">
          <h2 className="text-sm font-bold font-mono tracking-widest text-purple-300 uppercase print:text-slate-900">
            EDUCATION
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-white print:text-black">
                  SRM Institute of Science and Technology
                </h3>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  3rd Year B.Tech in Computer Science and Engineering (Reg No: <strong>RA2411003011706</strong>) | <strong>CGPA: {cgpa} / 10.0</strong>
                </p>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Kattankulathur, Chennai, Tamil Nadu
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 print:text-slate-600">
                Aug 2024 — Present
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-white print:text-black">
                  Sri Chaitanya Junior College
                </h3>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  Intermediate (M.P.C — Mathematics, Physics, Chemistry) | <strong>Percentage: 94.3%</strong>
                </p>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Vijayawada, Andhra Pradesh
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 print:text-slate-600">
                Jun 2022 — Apr 2024
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-white print:text-black">
                  Bhashyam High School
                </h3>
                <p className="text-xs text-slate-300 print:text-slate-700">
                  Secondary School Certificate (SSC) | <strong>CGPA: 90.3% (9.03 / 10.0)</strong>
                </p>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Guntur / Vijayawada, Andhra Pradesh
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 print:text-slate-600">
                Completed 2022
              </span>
            </div>
          </div>
        </div>

        {/* Experience & Internship */}
        <div className="mt-8 border-t border-slate-800 pt-6 print:border-slate-300">
          <h2 className="text-sm font-bold font-mono tracking-widest text-purple-300 uppercase print:text-slate-900">
            EXPERIENCE & INTERNSHIPS
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-white print:text-black">
                    Google AI-ML Virtual Intern
                  </h3>
                  <p className="text-xs font-semibold text-purple-300 print:text-purple-800">
                    EduSkills • AICTE • Google for Developers | <strong>Grade: O (Outstanding — 90-100%)</strong>
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                    Certificate ID: 4b859f21b1d7750a5fc6 | AICTE Student ID: STU69d47d1b3228a1775533339
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 print:text-slate-600">
                  Apr 2026 — Jun 2026 (8 Weeks)
                </span>
              </div>
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-300 print:text-slate-700 space-y-1">
                <li>
                  Engineered and deployed deep neural networks, computer vision pipelines, and NLP classifiers leveraging TensorFlow and Python.
                </li>
                <li>
                  Architected end-to-end data preprocessing pipelines and hyperparameter tuning achieving optimal validation accuracy.
                </li>
                <li>
                  Successfully earned Grade O Outstanding certification verified under AICTE and EduSkills national internship framework.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Core Projects */}
        <div className="mt-8 border-t border-slate-800 pt-6 print:border-slate-300">
          <h2 className="text-sm font-bold font-mono tracking-widest text-purple-300 uppercase print:text-slate-900">
            FEATURED ENGINEERING PROJECTS
          </h2>
          <div className="mt-4 space-y-5">
            {data.projects.slice(0, 4).map((p) => (
              <div key={p.id}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-sm font-bold text-white print:text-black">
                    {p.title} — <span className="font-normal text-xs text-slate-300 print:text-slate-700">{p.tagline}</span>
                  </h3>
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-sky-400 print:text-blue-700 hover:underline"
                  >
                    {p.liveUrl.replace("https://", "")}
                  </a>
                </div>
                <p className="mt-1 text-xs text-slate-300 print:text-slate-700">
                  {p.description}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-800 print:border-slate-300 print:bg-slate-100 print:text-black"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mt-8 border-t border-slate-800 pt-6 print:border-slate-300">
          <h2 className="text-sm font-bold font-mono tracking-widest text-purple-300 uppercase print:text-slate-900">
            TECHNICAL EXPERTISE
          </h2>
          <div className="mt-3 space-y-2 text-xs">
            <div>
              <strong className="text-white print:text-black">Languages & Core:</strong>{" "}
              <span className="text-slate-300 print:text-slate-700">
                C, C++, Java, Python, JavaScript (ES6+), TypeScript, SQL, HTML5/CSS3
              </span>
            </div>
            <div>
              <strong className="text-white print:text-black">Frontend & 3D Web:</strong>{" "}
              <span className="text-slate-300 print:text-slate-700">
                React, Next.js 15 (App Router), Three.js, WebGL, GSAP, Tailwind CSS, Framer Motion
              </span>
            </div>
            <div>
              <strong className="text-white print:text-black">Backend, AI & Cloud:</strong>{" "}
              <span className="text-slate-300 print:text-slate-700">
                Node.js, Express, REST APIs, Python AI/ML, TensorFlow, Git, Netlify, Vercel
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
