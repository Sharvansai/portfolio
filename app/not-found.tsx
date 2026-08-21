import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1 font-mono text-xs text-sky-400">
        404 — Page Not Found
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        Lost in Orbit
      </h1>
      <p className="mt-3 max-w-md text-base text-slate-400">
        The system page you're searching for does not exist or has been shifted in coordinates.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-105 transition-all"
      >
        Return to Headquarters
      </Link>
    </div>
  );
}
