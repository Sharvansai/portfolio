"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSharvanBaseData, SharvanBaseConfig } from "@/lib/sharvan-base-data";
import { Sparkles, FileText, Settings, Menu, X, ArrowUpRight } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<SharvanBaseConfig>(getSharvanBaseData());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleUpdate = () => {
      setData(getSharvanBaseData());
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("sharvan-base-updated", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("sharvan-base-updated", handleUpdate);
    };
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Timeline", href: "#timeline" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 py-3 shadow-2xl backdrop-blur-xl border-b border-white/10"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-sky-500 font-mono text-lg font-bold text-white shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105">
            <span>S</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-wider text-white group-hover:text-purple-400 transition-colors">
              SHARVAN
            </span>
            <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">
              Creative Dev
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-slate-900/60 p-1.5 backdrop-blur-md md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/resume"
            className="flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 transition-all hover:border-purple-400/60 hover:bg-purple-500/20"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Recruiter View</span>
          </Link>

          <Link
            href="/admin"
            title="Sharvan Base Admin Control"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-slate-400 transition-all hover:border-white/20 hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/resume"
            className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300"
          >
            Resume
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-slate-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-slate-950/95 px-6 py-4 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <div className="my-2 border-t border-white/10 pt-3 flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Sharvan Base CMS</span>
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
