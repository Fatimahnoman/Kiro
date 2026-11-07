"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

interface NeonButtonProps {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  accent?: "blue" | "purple" | "green";
}

const ACCENT: Record<
  NonNullable<NeonButtonProps["accent"]>,
  { ring: string; glow: string; text: string; grad: string }
> = {
  blue: {
    ring: "border-neon-blue/60",
    glow: "shadow-glow-blue",
    text: "text-neon-blue",
    grad: "from-neon-blue/20 to-neon-purple/10",
  },
  purple: {
    ring: "border-neon-purple/60",
    glow: "shadow-glow-purple",
    text: "text-neon-purple",
    grad: "from-neon-purple/20 to-neon-blue/10",
  },
  green: {
    ring: "border-neon-green/60",
    glow: "shadow-glow-green",
    text: "text-neon-green",
    grad: "from-neon-green/20 to-neon-blue/10",
  },
};

export function NeonButton({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  loading = false,
  accent = "blue",
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
        "group relative flex w-full items-center justify-center gap-2.5",
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
