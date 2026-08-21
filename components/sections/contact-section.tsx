"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, X, CheckCircle2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

// Custom hook for typewriter text effect
export function useTypewriter(text: string, speed: number = 38, startDelay: number = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    let currentIndex = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayed(text.slice(0, currentIndex));
          if (currentIndex === text.length) {
            setDone(true);
            if (intervalId) clearInterval(intervalId);
          }
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export const ContactSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const prevXRef = useRef<number | null>(null);

  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePrompt, setActivePrompt] = useState(
    "Glad you stopped in. Good taste tends to find us. Now, what are we building?"
  );

  // Form modal state for Sharvan Base direct messages
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<string>("Pitch us an idea");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Pitch us an idea",
    message: "",
    honeypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const { displayed, done } = useTypewriter(activePrompt, 38, 600);

  // Background Video mouse-scrub controller (Luffy / Anime Head Turning)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration) {
        targetTimeRef.current = video.duration * 0.3;
        try {
          video.currentTime = targetTimeRef.current;
        } catch {}
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration || isNaN(video.duration)) return;

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const SENSITIVITY = 0.8;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;

      targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        try {
          video.currentTime = targetTimeRef.current;
        } catch {}
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!video.duration || isNaN(video.duration) || e.touches.length === 0) return;
      const clientX = e.touches[0].clientX;
      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        return;
      }
      const delta = clientX - prevXRef.current;
      prevXRef.current = clientX;
      const SENSITIVITY = 0.8;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeOffset));
      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        try {
          video.currentTime = targetTimeRef.current;
        } catch {}
      }
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    const handleSeeked = () => {
      if (!video) return;
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
        try {
          video.currentTime = targetTimeRef.current;
        } catch {}
      } else {
        isSeekingRef.current = false;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Action pill buttons reveal timer (400ms after load)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const email = "sharvansai123@gmail.com";
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePillClick = (label: string) => {
    setSelectedIntent(label);
    setFormData((prev) => ({
      ...prev,
      subject: label,
    }));

    if (label === "Pitch us an idea") {
      setActivePrompt("Let's hear it! What's the vision and timeline? Let's build something exceptional.");
    } else if (label === "Come work here") {
      setActivePrompt("Excited to collaborate! Share your engineering background or technical role.");
    } else if (label === "Send a brief hello") {
      setActivePrompt("Hello! Glad you reached out. Drop a direct note below.");
    } else if (label === "See how we operate") {
      setActivePrompt("We engineer high-impact interactive systems, AI tools, and fluid 3D architectures.");
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setIsSubmitting(true);
    setStatus("idle");

    try {
      // Save locally to Sharvan Base messages
      const existing = JSON.parse(localStorage.getItem("sharvan_base_messages") || "[]");
      const newMessage = {
        id: "msg-" + Date.now(),
        date: new Date().toISOString(),
        ...formData,
      };
      existing.unshift(newMessage);
      localStorage.setItem("sharvan_base_messages", JSON.stringify(existing));
      window.dispatchEvent(new Event("sharvan-base-message-received"));

      // Post to API route
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setStatus("success");
      setFormData({ name: "", email: "", subject: selectedIntent, message: "", honeypot: "" });

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}

      setTimeout(() => {
        setIsModalOpen(false);
        setStatus("idle");
      }, 2500);
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between py-12 sm:py-16 md:py-20 select-none scroll-mt-12 bg-white text-black"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Background Video: Full-screen mouse-scrub controlled anime turning head */}
      <video
        ref={videoRef}
        src="/anime-head.mp4"
        muted
        playsInline
        preload="auto"
        onError={(e) => e.stopPropagation()}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        style={{
          objectPosition: "70% center",
        }}
      />

      {/* Top subtle badge overlay */}
      <div className="relative z-10 w-full px-5 sm:px-8 md:px-12 flex justify-between items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 backdrop-blur-md px-3.5 py-1 text-xs font-mono font-medium text-black shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MOTION TRACKER INTERFACE // A.R.I.A</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-black/70 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full">
          <span>Move cursor horizontally to scrub motion tracker</span>
        </div>
      </div>

      {/* Hero / Contact Main Content (z-index: 1) */}
      <div className="relative z-10 w-full px-5 sm:px-8 md:px-12 flex flex-col justify-end pb-8 sm:pb-12 md:justify-center md:pb-0 my-auto">
        <div className="max-w-xl">
          {/* 1. Blurred intro label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: "1.3",
              fontWeight: 400,
              color: "#000000",
              filter: "blur(4px)",
              fontFamily: "var(--font-body)",
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* 2. Typewriter text */}
          <p
            className="text-black mb-5 sm:mb-6 min-h-[54px] select-text"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: "1.35",
              fontWeight: 400,
              fontFamily: "var(--font-body)",
            }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
            )}
          </p>

          {/* 3. Action pill buttons */}
          <div
            className="flex flex-wrap gap-y-1 transition-all duration-400 ease-out"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? "translateY(0px)" : "translateY(8px)",
            }}
          >
            {/* 4 White pill buttons */}
            {[
              "Pitch us an idea",
              "Come work here",
              "Send a brief hello",
              "See how we operate",
            ].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handlePillClick(label)}
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 shadow-sm active:scale-95 cursor-pointer font-normal"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
              </button>
            ))}

            {/* 1 Outline pill button with copy icon */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200 shadow-sm active:scale-95 cursor-pointer font-normal"
              style={{ fontFamily: "var(--font-body)" }}
              title="Click to copy email address"
            >
              <span>
                Reach us:{" "}
                <span className="underline underline-offset-1">
                  sharvansai123@gmail.com
                </span>
              </span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info Bar */}
      <div className="relative z-10 w-full px-5 sm:px-8 md:px-12 flex flex-wrap justify-between items-center text-xs font-mono text-black/75 pt-4">
        <div>
          <span>C S SHARVAN SAI // DIRECT TRANSMISSION HUB</span>
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <a
            href="mailto:sharvansai123@gmail.com"
            className="hover:underline underline-offset-2 transition-opacity hover:opacity-75"
          >
            sharvansai123@gmail.com
          </a>
          <span>•</span>
          <a
            href="tel:+918328226454"
            className="hover:underline underline-offset-2 transition-opacity hover:opacity-75"
          >
            +91 8328226454
          </a>
        </div>
      </div>

      {/* Interactive Sharvan Base Direct Message Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0f19] p-6 sm:p-8 text-white shadow-2xl"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300">
                  {selectedIntent}
                </span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white mb-1">
                Direct Message to Sharvan
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Connected directly to Sharvan Base & instant notifications.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={`Hi Sharvan, I would like to discuss ${selectedIntent.toLowerCase()}...`}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>

                {status === "success" && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Message transmitted successfully to Sharvan Base!</span>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Error delivering message. Direct email: sharvansai123@gmail.com</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 disabled:opacity-50 transition-all active:scale-95"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? "Transmitting..." : "Send Message"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
