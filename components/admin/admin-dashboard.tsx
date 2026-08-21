"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  Mail,
  User,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  Eye,
  Lock,
  Unlock,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Palette,
  CheckCircle2,
  Copy,
  Send,
  Inbox,
} from "lucide-react";
import {
  getSharvanBaseData,
  saveSharvanBaseData,
  resetSharvanBaseData,
  SharvanBaseConfig,
  ProjectItem,
} from "@/lib/sharvan-base-data";

interface ContactMessage {
  id: string;
  date: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<"projects" | "profile" | "messages" | "theme">("projects");
  const [config, setConfig] = useState<SharvanBaseConfig>(getSharvanBaseData());
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    // Check if session authenticated
    const authSession = sessionStorage.getItem("sharvan_admin_auth");
    if (authSession === "true") {
      setIsAuthenticated(true);
    }
    loadData();

    const handleMsgReceived = () => {
      loadData();
    };

    window.addEventListener("sharvan-base-message-received", handleMsgReceived);
    window.addEventListener("storage", handleMsgReceived);

    return () => {
      window.removeEventListener("sharvan-base-message-received", handleMsgReceived);
      window.removeEventListener("storage", handleMsgReceived);
    };
  }, []);

  const loadData = () => {
    const data = getSharvanBaseData();
    setConfig(data);
    try {
      const storedMsgs = JSON.parse(localStorage.getItem("sharvan_base_messages") || "[]");
      setMessages(storedMsgs);
    } catch {}
  };

  const applyThemeLive = (color: string, name: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--accent-color", color);
      document.documentElement.style.setProperty("--accent-glow", color + "80");
      document.documentElement.style.setProperty("--accent-glow-subtle", color + "25");
      document.documentElement.style.setProperty("--theme-accent", color);
    }
    const newConf = {
      ...config,
      theme: { ...config.theme, accentColor: color, accentName: name },
    };
    setConfig(newConf);
    saveSharvanBaseData(newConf);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Strictly require passcode Sujju@2007 (no hints)
    if (pinInput === "Sujju@2007" || pinInput === "sujju@2007") {
      setIsAuthenticated(true);
      sessionStorage.setItem("sharvan_admin_auth", "true");
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("sharvan_admin_auth");
    localStorage.removeItem("sharvan_admin_auth");
    setPinInput("");
    setAuthError(false);
  };

  const handleSave = () => {
    // Ensure name is strictly locked
    const safeConfig = {
      ...config,
      profile: {
        ...config.profile,
        name: "C S SHARVAN SAI",
      },
    };
    const success = saveSharvanBaseData(safeConfig);
    if (success) {
      if (typeof document !== "undefined" && safeConfig.theme?.accentColor) {
        document.documentElement.style.setProperty("--accent-color", safeConfig.theme.accentColor);
        document.documentElement.style.setProperty("--accent-glow", safeConfig.theme.accentColor + "80");
        document.documentElement.style.setProperty("--accent-glow-subtle", safeConfig.theme.accentColor + "25");
        document.documentElement.style.setProperty("--theme-accent", safeConfig.theme.accentColor);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset Sharvan Base to official master defaults?")) {
      const def = resetSharvanBaseData();
      setConfig(def);
      setEditingProject(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem("sharvan_base_messages", JSON.stringify(updated));
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleSaveProject = () => {
    if (!editingProject) return;
    const exists = config.projects.some((p) => p.id === editingProject.id);
    let updatedProjects: ProjectItem[];
    if (exists) {
      updatedProjects = config.projects.map((p) => (p.id === editingProject.id ? editingProject : p));
    } else {
      updatedProjects = [...config.projects, editingProject];
    }
    const newConfig = { ...config, projects: updatedProjects };
    setConfig(newConfig);
    saveSharvanBaseData(newConfig);
    setEditingProject(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Delete this project from Sharvan Base?")) {
      const updatedProjects = config.projects.filter((p) => p.id !== id);
      const newConfig = { ...config, projects: updatedProjects };
      setConfig(newConfig);
      saveSharvanBaseData(newConfig);
    }
  };

  const themePalettes = [
    { name: "Electric Violet", color: "#c084fc", desc: "Signature Creative Tech & AI" },
    { name: "Cyber Sky", color: "#38bdf8", desc: "Modern High-Performance Developer" },
    { name: "Neon Pink", color: "#f43f5e", desc: "Vibrant Futuristic Cyberpunk" },
    { name: "Star Gold", color: "#fbbf24", desc: "Luxury Prestige & Engineering" },
    { name: "Neon Emerald", color: "#34d399", desc: "Algorithmic Precision & Clean CS" },
    { name: "Sunset Orange", color: "#fb923c", desc: "Creative Passion & Dynamic Flow" },
    { name: "Indigo Starlight", color: "#818cf8", desc: "Deep Cosmic Intelligence" },
    { name: "Pure Silver", color: "#f8fafc", desc: "Minimalist Editorial Monolith" },
  ];

  // 1. PIN LOGIN SCREEN (NO HINTS, PASSWORD Sujju@2007)
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl border text-white shadow-lg"
              style={{
                backgroundColor: "var(--accent-color, #c084fc)20",
                borderColor: "var(--accent-color, #c084fc)50",
                color: "var(--accent-color, #c084fc)",
              }}
            >
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Sharvan Base Portal</h2>
            <p className="mt-2 text-xs font-mono text-slate-400">
              Private Content Architecture & Admin Control System
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300">Access Key</label>
              <input
                type="password"
                required
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Enter Access Key"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                style={{ borderColor: "var(--accent-color, #c084fc)40" }}
              />
            </div>

            {authError && (
              <p className="text-xs font-mono text-rose-400">
                Invalid Access Key. Access Denied.
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.01]"
              style={{
                backgroundColor: "var(--accent-color, #c084fc)",
                boxShadow: "0 0 25px var(--accent-glow-subtle, rgba(192,132,252,0.3))",
              }}
            >
              Unlock Sharvan Base
            </button>
          </form>

          {/* EXIT BASE BUTTON (Back to Portfolio) */}
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" style={{ color: "var(--accent-color, #c084fc)" }} />
              <span>Exit Base (Return to Portfolio)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED-IN SHARVAN BASE DASHBOARD
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Top Bar with EXIT BASE BUTTON */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl font-extrabold text-white">Sharvan Base Control CMS</h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Single Source of Truth for Projects, Portfolio Identity & Live Theme Tokens
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <Check className="h-3.5 w-3.5" />
              <span>Saved & Synced Live</span>
            </span>
          )}

          {/* EXIT BASE BUTTON */}
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white hover:bg-white/[0.12] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" style={{ color: "var(--accent-color, #c084fc)" }} />
            <span>Exit Base</span>
          </Link>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-colors"
            style={{ backgroundColor: "var(--accent-color, #c084fc)" }}
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save All Changes</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:text-white"
            title="Reset to initial data"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/50 bg-rose-950/60 px-4 py-2 text-xs font-bold text-rose-200 hover:bg-rose-900/80 shadow-lg shadow-rose-950/50 transition-all hover:scale-105 active:scale-95"
            title="Lock Sharvan Base and require passcode again"
          >
            <Lock className="h-3.5 w-3.5 text-rose-400" />
            <span>Lock Base</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => {
            setActiveTab("projects");
            setEditingProject(null);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "projects"
              ? "text-white shadow-md"
              : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
          }`}
          style={activeTab === "projects" ? { backgroundColor: "var(--accent-color, #c084fc)" } : {}}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Projects ({config.projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "profile"
              ? "text-white shadow-md"
              : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
          }`}
          style={activeTab === "profile" ? { backgroundColor: "var(--accent-color, #c084fc)" } : {}}
        >
          <User className="h-3.5 w-3.5" />
          <span>Profile & Identity</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "theme"
              ? "text-white shadow-md"
              : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
          }`}
          style={activeTab === "theme" ? { backgroundColor: "var(--accent-color, #c084fc)" } : {}}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Theme & Palette Tokens</span>
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            activeTab === "messages"
              ? "text-white shadow-md"
              : "border border-white/10 bg-slate-900 text-slate-400 hover:text-white"
          }`}
          style={activeTab === "messages" ? { backgroundColor: "var(--accent-color, #c084fc)" } : {}}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Contact Messages ({messages.length})</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="mt-8">
        {/* 1. THEME TOKENS TAB (LIVE INTERACTIVE IMPLEMENTATION) */}
        {activeTab === "theme" && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" style={{ color: "var(--accent-color, #c084fc)" }} />
                  <span>Visual Theme & Live Color Palette</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click any theme to instantly apply and sync color tokens across the entire portfolio in real-time.
                </p>
              </div>
              <span
                className="font-mono text-xs px-3 py-1.5 rounded-lg border font-bold"
                style={{
                  backgroundColor: "var(--accent-color, #c084fc)20",
                  borderColor: "var(--accent-color, #c084fc)50",
                  color: "var(--accent-color, #c084fc)",
                }}
              >
                ACTIVE: {config.theme?.accentName || "Electric Violet"} ({config.theme?.accentColor || "#c084fc"})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {themePalettes.map((p) => {
                const isSelected = config.theme.accentColor === p.color;
                return (
                  <button
                    key={p.name}
                    onClick={() => applyThemeLive(p.color, p.name)}
                    className={`flex flex-col items-start gap-3 rounded-2xl border p-5 transition-all text-left group ${
                      isSelected
                        ? "bg-white/[0.06] shadow-lg"
                        : "border-white/10 bg-slate-950/60 hover:border-white/25 hover:bg-slate-900/50"
                    }`}
                    style={isSelected ? { borderColor: p.color } : {}}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className="h-10 w-10 rounded-xl shadow-md transition-transform group-hover:scale-105 border border-white/20"
                        style={{ backgroundColor: p.color }}
                      />
                      {isSelected && <CheckCircle2 className="h-5 w-5" style={{ color: p.color }} />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{p.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{p.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. PROFILE & IDENTITY TAB */}
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">Sharvan Identity & Academic Info</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* DISPLAY NAME - STRICTLY LOCKED TO C S SHARVAN SAI */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-slate-300">Display Name</label>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    <Lock className="h-3 w-3" />
                    <span>LOCKED</span>
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  readOnly
                  value="C S SHARVAN SAI"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-300 font-bold cursor-not-allowed"
                />
                <p className="mt-1 text-[10px] font-mono text-slate-500">
                  Identity permanently locked to C S SHARVAN SAI for portfolio authenticity.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300">Professional Title</label>
                <input
                  type="text"
                  value={config.profile.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, title: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={config.profile.email}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, email: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={config.profile.phone}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, phone: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300">Location / Cities</label>
                <input
                  type="text"
                  value={config.profile.location}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, location: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>

              {/* LIVE CGPA FIELD */}
              <div>
                <label className="block text-xs font-mono text-slate-300">CGPA / Academic Score</label>
                <input
                  type="text"
                  value={config.profile.cgpa}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, cgpa: e.target.value },
                    })
                  }
                  placeholder="9.05"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />
                <p className="mt-1 text-[10px] font-mono text-slate-400">
                  Changing CGPA immediately updates Hero telemetry, ID card, Timeline, and Resume.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300">Hero Subheading</label>
                <input
                  type="text"
                  value={config.profile.subheading}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, subheading: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-slate-300">About Story Bio</label>
                <textarea
                  rows={4}
                  value={config.profile.aboutStory}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      profile: { ...config.profile, aboutStory: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={handleSave}
                className="rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-md transition-colors"
                style={{ backgroundColor: "var(--accent-color, #c084fc)" }}
              >
                Save Identity & Synchronize Live
              </button>
            </div>
          </div>
        )}

        {/* 3. PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Project Engineering Matrix ({config.projects.length})</h3>
              <button
                onClick={() => {
                  const newProj: ProjectItem = {
                    id: "proj-" + Date.now(),
                    slug: "new-system-" + Date.now(),
                    title: "New Featured System",
                    tagline: "High-Performance Interactive Deployment",
                    category: "Full-Stack",
                    description: "Describe the core system architecture and capabilities.",
                    longDescription: "Detailed engineering overview, technical challenges, and deployment highlights.",
                    metrics: [{ label: "Performance", value: "60 FPS" }],
                    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
                    architecture: ["Client State Machine", "Modular Components"],
                    liveUrl: "https://",
                    githubUrl: "https://github.com",
                    featured: true,
                    order: config.projects.length + 1,
                    accentColor: "#38bdf8",
                    previewGradient: "from-sky-500/20 to-indigo-500/20",
                    status: "Live & Deployed",
                  };
                  setEditingProject(newProj);
                }}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-colors"
                style={{ backgroundColor: "var(--accent-color, #c084fc)" }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>

            {editingProject && (
              <div className="rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-bold text-white">Edit: {editingProject.title}</h4>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300">Project Title</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300">Slug / Route</label>
                    <input
                      type="text"
                      value={editingProject.slug}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300">Live URL</label>
                    <input
                      type="text"
                      value={editingProject.liveUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300">GitHub Repository URL</label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-slate-300">Tagline</label>
                    <input
                      type="text"
                      value={editingProject.tagline}
                      onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-slate-300">Summary Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProject}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-colors"
                    style={{ backgroundColor: "var(--accent-color, #c084fc)" }}
                  >
                    Save Project
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: "var(--accent-color, #c084fc)20",
                          borderColor: "var(--accent-color, #c084fc)40",
                          color: "var(--accent-color, #c084fc)",
                        }}
                      >
                        {proj.category}
                      </span>
                      <h4 className="mt-2 text-base font-bold text-white">{proj.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{proj.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="p-1.5 rounded-lg border border-white/10 bg-slate-800 text-slate-300 hover:text-white"
                        title="Edit Project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 font-bold"
                      style={{ color: "var(--accent-color, #c084fc)" }}
                    >
                      <span>Live Site</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Link
                      href={`/projects/${proj.slug}`}
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Case Study</span>
                      <Eye className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MESSAGES TAB (VIEW CONTACT SUBMISSIONS) */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Inbox className="h-5 w-5" style={{ color: "var(--accent-color, #c084fc)" }} />
                  <span>Contact Submissions & Recruiter Inquiries ({messages.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  All messages sent through your portfolio contact form are recorded here in real-time.
                </p>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-12 text-center text-slate-400 space-y-3">
                <Mail className="h-8 w-8 mx-auto text-slate-600" />
                <div className="font-semibold text-slate-300">No contact messages received yet</div>
                <div className="text-xs max-w-sm mx-auto">
                  When visitors or recruiters submit messages on your portfolio contact form, they will appear here instantly with one-click reply tools.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-xl space-y-4 shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">{msg.name}</span>
                          <span className="text-xs font-mono text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/30">
                            {msg.email}
                          </span>
                        </div>
                        {msg.subject && (
                          <div className="mt-1 text-xs font-mono text-slate-300 font-semibold">
                            Subject: <span className="text-white">{msg.subject}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">
                          {new Date(msg.date).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-950/20 text-rose-300 hover:bg-rose-900/40"
                          title="Delete message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-black/40 p-4 border border-white/5">
                      <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    {/* Quick Response Actions */}
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(
                          `Re: ${msg.subject || "Portfolio Contact Inquiry"}`
                        )}&body=${encodeURIComponent(`Hi ${msg.name},\n\nThank you for reaching out!\n\nBest regards,\nC S Sharvan Sai`)}`}
                        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
                        style={{ backgroundColor: "var(--accent-color, #c084fc)" }}
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Reply via Email</span>
                      </a>

                      <button
                        onClick={() => handleCopyEmail(msg.email, msg.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        {copiedEmailId === msg.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Email Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
