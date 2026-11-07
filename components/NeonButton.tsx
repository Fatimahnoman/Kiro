"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

type Accent =
  | "blood"
  | "haunt"
  | "spectral"
  // legacy aliases (kept so older callers still compile)
  | "blue"
  | "purple"
  | "green";

interface NeonButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  accent?: Accent;
}

const ACCENT: Record<
  Accent,
  { ring: string; glow: string; text: string; grad: string }
> = {
  blood: {
    ring: "border-blood/60",
    glow: "shadow-glow-blood",
    text: "text-blood",
    grad: "from-blood/25 to-haunt/10",
  },
  haunt: {
    ring: "border-haunt/60",
    glow: "shadow-glow-haunt",
    text: "text-haunt",
    grad: "from-haunt/25 to-spectral/10",
  },
  spectral: {
    ring: "border-spectral/60",
    glow: "shadow-glow-spectral",
    text: "text-spectral",
    grad: "from-spectral/25 to-haunt/10",
  },
  // legacy aliases → map onto the haunted palette
  blue: {
    ring: "border-spectral/60",
    glow: "shadow-glow-spectral",
    text: "text-spectral",
    grad: "from-spectral/25 to-haunt/10",
  },
  purple: {
    ring: "border-haunt/60",
    glow: "shadow-glow-haunt",
    text: "text-haunt",
    grad: "from-haunt/25 to-spectral/10",
  },
  green: {
    ring: "border-ecto/60",
    glow: "shadow-glow-ecto",
    text: "text-ecto",
    grad: "from-ecto/25 to-spectral/10",
  },
};

export function NeonButton({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  loading = false,
  accent = "blood",
}: NeonButtonProps) {
  const a = ACCENT[accent];
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      aria-busy={loading}
      className={[
        "group relative flex w-full items-center justify-center gap-2.5 overflow-hidden",
        "rounded-xl border px-5 py-3.5 font-mono text-sm font-semibold uppercase tracking-widest",
        "bg-gradient-to-r transition-all duration-300",
        a.ring,
        a.text,
        a.grad,
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : `${a.glow} hover:brightness-125`,
      ].join(" ")}
    >
      {/* Animated sweep highlight */}
      {!isDisabled && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute -inset-y-6 -left-1/3 w-1/3 rotate-12 bg-white/10 blur-md transition-transform duration-700 group-hover:translate-x-[320%]" />
        </span>
      )}

      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden />
      )}
      <span className="relative">{label}</span>
    </motion.button>
  );
}
