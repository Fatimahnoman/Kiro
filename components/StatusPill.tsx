"use client";

import { motion } from "framer-motion";
import type { AgentPhase } from "@/lib/types";

const PHASE_META: Record<
  AgentPhase,
  { label: string; dot: string; text: string; ring: string }
> = {
  idle: {
    label: "Idle",
    dot: "bg-slate-400",
    text: "text-slate-300",
    ring: "border-slate-500/40",
  },
  thinking: {
    label: "Thinking",
    dot: "bg-neon-purple",
    text: "text-neon-purple",
    ring: "border-neon-purple/50",
  },
  tool_call: {
    label: "Tool Call",
    dot: "bg-neon-blue",
    text: "text-neon-blue",
    ring: "border-neon-blue/50",
  },
  executing: {
    label: "Executing",
    dot: "bg-neon-blue",
    text: "text-neon-blue",
    ring: "border-neon-blue/50",
  },
  complete: {
    label: "Complete",
    dot: "bg-neon-green",
    text: "text-neon-green",
    ring: "border-neon-green/50",
  },
};

export function StatusPill({ phase }: { phase: AgentPhase }) {
  const m = PHASE_META[phase];
  const animated = phase !== "idle" && phase !== "complete";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border bg-black/30 px-3 py-1.5 font-mono text-xs uppercase tracking-wider ${m.ring} ${m.text}`}
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
  );
}
