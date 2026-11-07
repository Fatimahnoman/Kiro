"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ToggleButtonProps {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onToggle: () => void;
  accent?: "blue" | "purple" | "green";
  title?: string;
}

const ACCENT: Record<
  NonNullable<ToggleButtonProps["accent"]>,
  { on: string; text: string; dot: string }
> = {
  blue: {
    on: "border-neon-blue/60 bg-neon-blue/10 shadow-glow-blue",
    text: "text-neon-blue",
    dot: "bg-neon-blue",
  },
  purple: {
    on: "border-neon-purple/60 bg-neon-purple/10 shadow-glow-purple",
    text: "text-neon-purple",
    dot: "bg-neon-purple",
  },
  green: {
    on: "border-neon-green/60 bg-neon-green/10 shadow-glow-green",
    text: "text-neon-green",
    dot: "bg-neon-green",
  },
};

export function ToggleButton({
  label,
  icon: Icon,
  active,
  onToggle,
  accent = "blue",
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
