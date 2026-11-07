"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Accent = "blood" | "haunt" | "spectral";

interface ToggleButtonProps {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onToggle: () => void;
  accent?: Accent;
  title?: string;
}

const ACCENT: Record<Accent, { on: string; text: string; dot: string }> = {
  blood: {
    on: "border-blood/60 bg-blood/10 shadow-glow-blood",
    text: "text-blood",
    dot: "bg-blood",
  },
  haunt: {
    on: "border-haunt/60 bg-haunt/10 shadow-glow-haunt",
    text: "text-haunt",
    dot: "bg-haunt",
  },
  spectral: {
    on: "border-spectral/60 bg-spectral/10 shadow-glow-spectral",
    text: "text-spectral",
    dot: "bg-spectral",
  },
};

export function ToggleButton({
  label,
  icon: Icon,
  active,
  onToggle,
  accent = "spectral",
  title,
}: ToggleButtonProps) {
  const a = ACCENT[accent];
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      aria-pressed={active}
      title={title ?? label}
      className={[
        "group inline-flex items-center gap-2 rounded-lg border px-3 py-1.5",
        "font-mono text-[10px] uppercase tracking-wider transition-all duration-300",
        active
          ? `${a.on} ${a.text}`
          : "border-white/10 bg-black/30 text-slate-500 hover:border-white/20 hover:text-slate-300",
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
      {/* Status LED — no layout shift between states. */}
      <span
        className={`h-1.5 w-1.5 rounded-full transition-colors ${
          active ? a.dot : "bg-slate-600"
        }`}
      />
    </motion.button>
  );
}
