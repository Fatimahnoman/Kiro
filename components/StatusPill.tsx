"use client";

import { motion } from "framer-motion";
import { Skull } from "lucide-react";
import type { AgentPhase } from "@/lib/types";

const PHASE_META: Record<
  AgentPhase,
  { label: string; dot: string; text: string; ring: string }
> = {
  idle: {
    label: "Dormant",
    dot: "bg-slate-400",
    text: "text-slate-300",
    ring: "border-slate-500/40",
  },
  summoning: {
    label: "Summoning",
    dot: "bg-haunt",
    text: "text-haunt",
    ring: "border-haunt/50",
  },
  scanning: {
    label: "Scanning",
    dot: "bg-spectral",
    text: "text-spectral",
    ring: "border-spectral/50",
  },
  exorcising: {
    label: "Exorcising",
    dot: "bg-blood",
    text: "text-blood",
    ring: "border-blood/50",
  },
  complete: {
    label: "Cleansed",
    dot: "bg-ecto",
    text: "text-ecto",
    ring: "border-ecto/50",
  },
};

export function StatusPill({
  phase,
  bugCount,
}: {
  phase: AgentPhase;
  bugCount: number;
}) {
  const m = PHASE_META[phase];
  const animated = phase !== "idle" && phase !== "complete";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 rounded-full border bg-black/40 px-3 py-1.5 font-mono text-xs uppercase tracking-wider ${m.ring} ${m.text}`}
      >
        <span className="relative flex h-2 w-2">
          {animated && (
            <motion.span
              className={`absolute inline-flex h-full w-full rounded-full ${m.dot} opacity-70`}
              animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${m.dot}`} />
        </span>
        {m.label}
      </div>

      {/* Haunting (bug) counter */}
      {bugCount > 0 && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1 rounded-full border border-blood/60 bg-blood/15 px-2.5 py-1.5 font-mono text-xs text-blood shadow-glow-blood"
        >
          <Skull className="h-3 w-3" aria-hidden />
          {bugCount}
        </motion.div>
      )}
    </div>
  );
}
