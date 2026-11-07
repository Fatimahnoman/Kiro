"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileCode2,
  ScanSearch,
  Terminal as TerminalIcon,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import {
  type NodeStatus,
  type StageId,
  WORKFLOW_STAGES,
} from "@/lib/types";
import type { NodeStatusMap } from "@/lib/useAgentStream";

const STAGE_ICON: Record<StageId, LucideIcon> = {
  input_parsing: TerminalIcon,
  context_scanning: ScanSearch,
  kiro_hook_trigger: Webhook,
  code_generation: FileCode2,
};

type Accent = "blue" | "purple" | "green" | "rose" | "slate";

interface StatusStyle {
  ring: string;
  glow: string;
  glowXl: string;
  icon: string;
  chip: string;
  chipText: string;
  pulseBorder: string;
  accent: Accent;
}

const STATUS_STYLE: Record<NodeStatus, StatusStyle> = {
  pending: {
    ring: "border-white/10",
    glow: "",
    glowXl: "",
    icon: "text-slate-500",
    chip: "bg-slate-700/40",
    chipText: "text-slate-400",
    pulseBorder: "",
    accent: "slate",
  },
  active: {
    ring: "border-neon-blue/70",
    glow: "shadow-glow-blue",
    glowXl: "shadow-glow-blue-xl",
    icon: "text-neon-blue",
    chip: "bg-neon-blue/20",
    chipText: "text-neon-blue",
    pulseBorder: "border-neon-blue",
    accent: "blue",
  },
  done: {
    ring: "border-neon-green/60",
    glow: "shadow-glow-green",
    glowXl: "shadow-glow-green-xl",
    icon: "text-neon-green",
    chip: "bg-neon-green/20",
    chipText: "text-neon-green",
    pulseBorder: "border-neon-green",
    accent: "green",
  },
  error: {
    ring: "border-neon-rose/70",
    glow: "",
    glowXl: "",
    icon: "text-neon-rose",
    chip: "bg-neon-rose/20",
    chipText: "text-neon-rose",
    pulseBorder: "border-neon-rose",
    accent: "rose",
  },
};

function StageNode({
  index,
  stageId,
  label,
  description,
  status,
}: {
  index: number;
  stageId: StageId;
  label: string;
  description: string;
  status: NodeStatus;
}) {
  const Icon = STAGE_ICON[stageId];
  const s = STATUS_STYLE[status];
  const isActive = status === "active";

  return (
    <div
      className={[
        "glass relative flex flex-1 flex-col gap-3 rounded-2xl border p-5",
        "transition-[box-shadow,border-color] duration-500",
        s.ring,
        isActive ? s.glowXl : s.glow,
      ].join(" ")}
    >
      {/* Pulsing glow border when the stage is running (requirement 1a). */}
      {isActive && (
        <span
          aria-hidden
          className={`pointer-events-none absolute -inset-px rounded-2xl border-2 ${s.pulseBorder} animate-border-pulse`}
        />
      )}
      {/* Steady exit ring once a stage is done. */}
      {status === "done" && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-2xl border border-neon-green/40"
        />
      )}

      <div className="relative flex items-center justify-between">
        <span
          className={`rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${s.chip} ${s.chipText}`}
        >
          Stage {index + 1}
        </span>

        {/* Fixed-size status slot — reserves space so there is zero layout
            shift as the node moves pending -> active -> done. */}
        <span className="flex h-4 w-4 items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "active" && (
              <motion.span
                key="spin"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                }}
                className="h-4 w-4 rounded-full border-2 border-neon-blue/30 border-t-neon-blue"
              />
            )}
            {status === "done" && (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle2 className="h-4 w-4 text-neon-green" aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>

      <motion.div
        animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
        className={`relative grid h-12 w-12 place-items-center rounded-xl border ${s.ring} bg-black/40`}
      >
        <Icon className={`h-6 w-6 ${s.icon}`} aria-hidden />
      </motion.div>

      <div className="relative">
        <h3 className="font-mono text-sm font-semibold text-slate-100">
          {label}
        </h3>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Neon trail connector between two nodes (requirement 1b).
 * - "filled"  → the left node is done: a steady lit bar.
 * - "flowing" → the right node is active: an animated pulse of light travels
 *   along the trail, visually connecting the active nodes.
 */
function Connector({
  filled,
  flowing,
}: {
  filled: boolean;
  flowing: boolean;
}) {
  const lit = filled || flowing;
  return (
    <div className="relative flex items-center justify-center lg:w-12">
      {/* Horizontal on lg, vertical on small screens */}
      <div className="relative hidden h-0.5 w-full overflow-hidden rounded-full bg-white/10 lg:block">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-blue to-neon-green shadow-glow-blue"
          initial={{ width: 0 }}
          animate={{ width: lit ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {/* Traveling neon pulse along the trail while handing off. */}
        {flowing && (
          <span
            aria-hidden
            className="absolute inset-0 animate-trail-flow bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/90 to-transparent"
          />
        )}
      </div>
      <div className="relative h-6 w-0.5 overflow-hidden rounded-full bg-white/10 lg:hidden">
        <motion.div
          className="w-full bg-gradient-to-b from-neon-blue to-neon-green"
          initial={{ height: 0 }}
          animate={{ height: lit ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {flowing && (
          <span
            aria-hidden
            className="absolute inset-0 animate-trail-flow bg-[length:100%_200%] bg-gradient-to-b from-transparent via-white/90 to-transparent"
          />
        )}
      </div>
    </div>
  );
}

export function AgentCanvas({
  nodes,
  activeStage,
  gridAnimated = true,
}: {
  nodes: NodeStatusMap;
  activeStage: StageId | null;
  gridAnimated?: boolean;
}) {
  return (
    <section className="glass-strong relative flex h-full flex-col overflow-hidden rounded-2xl p-5">
      {/* Animated / static grid backdrop (requirement 1c). */}
      <div
        className={`pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-40 ${
          gridAnimated ? "animate-grid-drift" : ""
        }`}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-neon-purple/10 blur-3xl" />

      <header className="relative z-10 mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm font-semibold uppercase tracking-widest text-slate-200">
            Execution Canvas
          </h2>
          <p className="font-mono text-[11px] text-slate-500">
            Live agent workflow — nodes illuminate as the ritual progresses.
          </p>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-stretch justify-center gap-2 lg:flex-row lg:items-center">
        {WORKFLOW_STAGES.map((stage, i) => {
          const status = nodes[stage.id];
          const isLast = i === WORKFLOW_STAGES.length - 1;
          const nextStage = isLast ? null : WORKFLOW_STAGES[i + 1];
          // The trail "flows" when the node to its right is the active one.
          const flowing =
            nextStage !== null &&
            activeStage === nextStage.id &&
            status === "done";
          return (
            <div
              key={stage.id}
              className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center"
            >
              <StageNode
                index={i}
                stageId={stage.id}
                label={stage.label}
                description={stage.description}
                status={status}
              />
              {!isLast && (
                <Connector filled={status === "done"} flowing={flowing} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
