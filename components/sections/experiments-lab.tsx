"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Sparkles, Terminal, Activity, Gamepad2, ArrowRight } from "lucide-react";

export const ExperimentsLab = () => {
  const [activeTab, setActiveTab] = useState<"pathfinding" | "particles">("pathfinding");

  // Pathfinding Grid State
  const GRID_ROWS = 12;
  const GRID_COLS = 20;
  const [grid, setGrid] = useState<number[][]>(() => {
    return Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
  });
  const [startPos] = useState<[number, number]>([2, 2]);
  const [targetPos] = useState<[number, number]>([9, 17]);
  const [pathSteps, setPathSteps] = useState<[number, number][]>([]);
  const [visitedCells, setVisitedCells] = useState<[number, number][]>([]);
  const [isSolving, setIsSolving] = useState(false);

  // Initialize some obstacles
  useEffect(() => {
    resetGrid();
  }, []);

  const resetGrid = () => {
    const newGrid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
    // Default obstacles
    for (let r = 2; r <= 8; r++) newGrid[r][7] = 1;
    for (let r = 4; r <= 10; r++) newGrid[r][13] = 1;
    setGrid(newGrid);
    setPathSteps([]);
    setVisitedCells([]);
  };

  const toggleWall = (r: number, c: number) => {
    if ((r === startPos[0] && c === startPos[1]) || (r === targetPos[0] && c === targetPos[1])) return;
    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === r && cIdx === c ? (cell === 1 ? 0 : 1) : cell))
    );
    setGrid(newGrid);
  };

  const runAStarVisualizer = async () => {
    if (isSolving) return;
    setIsSolving(true);
    setPathSteps([]);
    setVisitedCells([]);

    // Simple BFS/A* demonstration
    const queue: [number, number, [number, number][]][] = [[startPos[0], startPos[1], [startPos]]];
    const visited = new Set<string>();
    visited.add(`${startPos[0]},${startPos[1]}`);

    const newVisited: [number, number][] = [];
    let foundPath: [number, number][] | null = null;

    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (queue.length > 0) {
      // Sort queue by Manhattan distance to target for A* heuristic
      queue.sort((a, b) => {
        const distA = Math.abs(a[0] - targetPos[0]) + Math.abs(a[1] - targetPos[1]);
        const distB = Math.abs(b[0] - targetPos[0]) + Math.abs(b[1] - targetPos[1]);
        return distA - distB;
      });

      const [cr, cc, path] = queue.shift()!;
      newVisited.push([cr, cc]);

      if (cr === targetPos[0] && cc === targetPos[1]) {
        foundPath = path;
        break;
      }

      for (const [dr, dc] of dirs) {
        const nr = cr + dr;
        const nc = cc + dc;
        const key = `${nr},${nc}`;

        if (
          nr >= 0 &&
          nr < GRID_ROWS &&
          nc >= 0 &&
          nc < GRID_COLS &&
          grid[nr][nc] === 0 &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push([nr, nc, [...path, [nr, nc]]]);
        }
      }
    }

    // Step-by-step animation
    for (let i = 0; i < newVisited.length; i += 2) {
      setVisitedCells([...newVisited.slice(0, i + 1)]);
      await new Promise((r) => setTimeout(r, 20));
    }

    if (foundPath) {
      for (let i = 0; i <= foundPath.length; i++) {
        setPathSteps([...foundPath.slice(0, i)]);
        await new Promise((r) => setTimeout(r, 30));
      }
    }

    setIsSolving(false);
  };

  // Canvas Wave / Particle Lab
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (activeTab !== "particles") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.fillStyle = "rgba(10, 15, 30, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const count = 40;
      for (let i = 0; i < count; i++) {
        const x = (canvas.width / count) * i;
        const y =
          canvas.height / 2 +
          Math.sin(tick * 0.05 + i * 0.3) * 45 +
          Math.cos(tick * 0.03 + i * 0.2) * 20;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(tick * 2 + i * 8) % 360}, 80%, 65%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab]);

  return (
    <section id="playground" className="relative z-10 w-full py-24 scroll-mt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-3.5 py-1 text-xs font-mono text-pink-300">
            <Gamepad2 className="h-3.5 w-3.5 text-pink-400" />
            <span className="font-semibold tracking-wider">INTERACTIVE EXPERIMENTS & CODE LAB</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Live Algorithmic &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-sky-400">
              Physics Sandbox
            </span>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Test real-time pathfinding heuristics and dynamic canvas graphics directly in your browser.
          </p>
        </div>

        {/* Tab switch */}
        <div className="mt-10 flex justify-center gap-2">
          <button
            onClick={() => setActiveTab("pathfinding")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "pathfinding"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg"
                : "border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>A* Pathfinding Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab("particles")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "particles"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                : "border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Canvas Waveform Synthesizer</span>
          </button>
        </div>

        {/* Sandbox Card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-2xl">
          {activeTab === "pathfinding" ? (
            <div>
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="h-3 w-3 rounded bg-emerald-400 inline-block" /> Start
                  <span className="h-3 w-3 rounded bg-pink-500 inline-block ml-2" /> Target
                  <span className="h-3 w-3 rounded bg-slate-700 inline-block ml-2" /> Obstacle (Click grid to toggle)
                  <span className="h-3 w-3 rounded bg-sky-400 inline-block ml-2" /> Optimal Path
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={runAStarVisualizer}
                    disabled={isSolving}
                    className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-sky-400 disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Run Heuristic Search</span>
                  </button>
                  <button
                    onClick={resetGrid}
                    disabled={isSolving}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs text-slate-300 hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Grid Canvas */}
              <div className="mt-6 flex justify-center overflow-x-auto">
                <div
                  className="grid gap-1 rounded-xl bg-slate-950 p-3 shadow-inner"
                  style={{
                    gridTemplateColumns: `repeat(${GRID_COLS}, minmax(18px, 28px))`,
                  }}
                >
                  {grid.map((row, r) =>
                    row.map((cell, c) => {
                      const isStart = r === startPos[0] && c === startPos[1];
                      const isTarget = r === targetPos[0] && c === targetPos[1];
                      const isWall = cell === 1;
                      const isPath = pathSteps.some(([pr, pc]) => pr === r && pc === c);
                      const isVisited = visitedCells.some(([vr, vc]) => vr === r && vc === c);

                      let bgClass = "bg-slate-900/60 hover:bg-slate-800 cursor-pointer";
                      if (isStart) bgClass = "bg-emerald-400 shadow-md shadow-emerald-500/50";
                      else if (isTarget) bgClass = "bg-pink-500 shadow-md shadow-pink-500/50";
                      else if (isPath) bgClass = "bg-sky-400 shadow-md shadow-sky-400/50 animate-pulse";
                      else if (isVisited) bgClass = "bg-indigo-900/60";
                      else if (isWall) bgClass = "bg-slate-700";

                      return (
                        <div
                          key={`${r}-${c}`}
                          onClick={() => toggleWall(r, c)}
                          className={`aspect-square rounded transition-colors duration-150 ${bgClass}`}
                        />
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Inspired by Sharvan's AV Route Planner Algorithm Lab</span>
                <a
                  href="https://avrouteplanner.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-400 hover:underline"
                >
                  <span>Open Full AV Route Planner</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <canvas
                ref={canvasRef}
                width={700}
                height={260}
                className="w-full max-w-2xl rounded-xl bg-slate-950 shadow-inner"
              />
              <div className="mt-4 flex items-center justify-between w-full max-w-2xl text-xs font-mono text-slate-400">
                <span>Web Audio & Canvas Synthesis Loop (60 FPS)</span>
                <a
                  href="https://techgaminghub.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-pink-400 hover:underline"
                >
                  <span>Explore 20+ Games on Tech Gaming Hub</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
