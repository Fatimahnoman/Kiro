"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileCode2,
  Ghost,
  ScanSearch,
  Skull,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { type NodeStatus, type StageId, WORKFLOW_STAGES } from "@/lib/types";
import type { NodeStatusMap } from "@/lib/useAgentStream";

const STAGE_ICON: Record<StageId, LucideIcon> = {
  input_code: FileCode2,
  glitch_scanner: ScanSearch,
  exorcism_reasoning: Skull,
  clean_output: Sparkles,
};

interface StatusStyle {
  ring: string;
  glow: string;
  icon: string;
  chip: string;
  chipText: string;
  haloBorder: string;
  halo: boolean;
  bloodPulse: boolean;
}

const STATUS_STYLE: Record<NodeStatus, StatusStyle> = {
  pending: {
    ring: "border-white/10",
    glow: "",
    icon: "text-slate-600",
    chip: "bg-slate-800/60",
    chipText: "text-slate-500",
    haloBorder: "",
    halo: false,
    bloodPulse: false,
  },
  active: {
    ring: "border-spectral/70",
    glow: "shadow-glow-spectral-xl",
    icon: "text-spectral",
    chip: "bg-spectral/20",
    chipText: "text-spectral",
    haloBorder: "border-spectral",
    halo: true,
    bloodPulse: false,
  },
  haunted: {
    ring: "border-blood",
    glow: "shadow-glow-blood-xl",
    icon: "text-blood",
    chip: "bg-blood/25",
    chipText: "text-blood",
    haloBorder: "border-blood",
    halo: true,
    bloodPulse: true,
  },
  cleansed: {
    ring: "border-ecto/70",
    glow: "shadow-glow-ecto-xl",
    icon: "text-ecto",
    chip: "bg-ecto/20",
    chipText: "text-ecto",
    haloBorder: "border-haunt",
    halo: false,
    bloodPulse: false,
  },
  error: {
    ring: "border-blood/70",
    glow: "shadow-glow-blood",
    icon: "text-blood",
    chip: "bg-blood/20",
    chipText: "text-blood",
    haloBorder: "border-blood",
    halo: false,
    bloodPulse: false,
  },
};

function GhostNode({
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
  const isWorking = status === "active" || status === "haunted";

  return (
    <div
      className={[
        "glass relative flex flex-1 flex-col items-center gap-3 rounded-2xl border p-5 text-center",
        "transition-[box-shadow,border-color] duration-500",
        s.ring,
        s.glow,
        s.bloodPulse ? "animate-blood-pulse" : "",
      ].join(" ")}
    >
      {/* Haunted halo ring */}
      {s.halo && (
        <span
          aria-hidden
          className={`pointer-events-none absolute -inset-px rounded-2xl border-2 ${s.haloBorder} ${
            s.bloodPulse ? "animate-blood-pulse" : "animate-border-pulse"
          }`}
        />
      )}

      <div className="relative flex w-full items-center justify-between">
        <span
          className={`rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${s.chip} ${s.chipText}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* Fixed-size status slot → zero layout shift */}
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
                className="h-4 w-4 rounded-full border-2 border-spectral/30 border-t-spectral"
              />
            )}
            {status === "haunted" && (
              <motion.span
                key="haunt"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Skull className="h-4 w-4 text-blood" aria-hidden />
              </motion.span>
            )}
            {status === "cleansed" && (
              <motion.span
                key="done"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle2 className="h-4 w-4 text-ecto" aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>

      {/* Floating ghost/skull orb */}
      <motion.div
        animate={
          status === "haunted"
            ? { scale: [1, 1.1, 1] }
            : isWorking
              ? { y: [0, -8, 0] }
              : { y: 0, scale: 1 }
        }
        transition={{
          duration: status === "haunted" ? 1.1 : 4,
          repeat: isWorking ? Infinity : 0,
          ease: "easeInOut",
        }}
        className={`relative grid h-16 w-16 place-items-center rounded-full border ${s.ring} bg-black/50`}
      >
        <Icon className={`h-7 w-7 ${s.icon}`} aria-hidden />
        {/* Little hovering ghost when haunted */}
        {status === "haunted" && (
          <motion.span
            className="absolute -right-2 -top-2"
            animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <Ghost className="h-4 w-4 text-blood" aria-hidden />
          </motion.span>
        )}
      </motion.div>

      <div className="relative">
        <h3 className="font-mono text-sm font-semibold text-bone/90">{label}</h3>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/** Spectral connector between two ghost nodes. */
function Connector({
  filled,
  flowing,
  haunted,
}: {
  filled: boolean;
  flowing: boolean;
  haunted: boolean;
}) {
  const lit = filled || flowing || haunted;
  const grad = haunted
    ? "from-blood to-haunt"
    : "from-spectral to-ecto";
  return (
    <div className="relative flex items-center justify-center lg:w-10">
      <div className="relative hidden h-0.5 w-full overflow-hidden rounded-full bg-white/10 lg:block">
        <motion.div
          className={`h-full bg-gradient-to-r ${grad}`}
          initial={{ width: 0 }}
          animate={{ width: lit ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        {flowing && (
          <span
            aria-hidden
            className="absolute inset-0 animate-trail-flow bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/80 to-transparent"
          />
        )}
      </div>
      <div className="relative h-5 w-0.5 overflow-hidden rounded-full bg-white/10 lg:hidden">
        <motion.div
          className={`w-full bg-gradient-to-b ${grad}`}
          initial={{ height: 0 }}
          animate={{ height: lit ? "100%" : "0%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
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
      {/* Animated grid + eerie fog backdrop */}
      <div
        className={`pointer-events-none absolute inset-0 bg-grid-fade bg-grid opacity-40 ${
          gridAnimated ? "animate-grid-drift" : ""
        }`}
      />
      <div className="pointer-events-none absolute inset-0 bg-fog animate-fog-drift opacity-70" />

      <header className="relative z-10 mb-5 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-widest text-bone/90">
            <Skull className="h-4 w-4 text-blood" aria-hidden />
            Haunted Node Graph
          </h2>
          <p className="font-mono text-[11px] text-slate-500">
            Nodes bleed red when a demon is found · turn spectral when cleansed.
          </p>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-stretch justify-center gap-2 lg:flex-row lg:items-center">
        {WORKFLOW_STAGES.map((stage, i) => {
          const status = nodes[stage.id];
          const isLast = i === WORKFLOW_STAGES.length - 1;
          const nextStage = isLast ? null : WORKFLOW_STAGES[i + 1];
          const nextStatus = nextStage ? nodes[nextStage.id] : "pending";
          const doneLike = status === "cleansed" || status === "haunted";
          const flowing =
            nextStage !== null &&
            activeStage === nextStage.id &&
            doneLike;
          const haunted = status === "haunted" || nextStatus === "haunted";
          return (
            <div
              key={stage.id}
              className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center"
            >
              <GhostNode
                index={i}
                stageId={stage.id}
                label={stage.label}
                description={stage.description}
                status={status}
              />
              {!isLast && (
                <Connector
                  filled={doneLike}
                  flowing={flowing}
                  haunted={haunted}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
