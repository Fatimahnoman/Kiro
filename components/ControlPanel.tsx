"use client";

import { motion } from "framer-motion";
import { Cpu, Ghost, RotateCcw, Sparkles } from "lucide-react";
import { NeonButton } from "@/components/NeonButton";
import { StatusPill } from "@/components/StatusPill";
import { WORKFLOW_PRESETS } from "@/lib/presets";
import type { AgentPhase } from "@/lib/types";

interface ControlPanelProps {
  directive: string;
  onDirectiveChange: (value: string) => void;
  onSelectPreset: (directive: string) => void;
  selectedPresetId: string | null;
  onRun: () => void;
  onReset: () => void;
  running: boolean;
  phase: AgentPhase;
  progress: number;
}

const ACCENT_TEXT = {
  blue: "text-neon-blue",
  purple: "text-neon-purple",
  green: "text-neon-green",
} as const;

export function ControlPanel({
  directive,
  onDirectiveChange,
  onSelectPreset,
  selectedPresetId,
  onRun,
  onReset,
  running,
  phase,
  progress,
}: ControlPanelProps) {
  return (
    <aside className="glass-strong flex h-full flex-col gap-5 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-neon-blue/40 bg-neon-blue/10 shadow-glow-blue">
          <Ghost className="h-5 w-5 text-neon-blue" aria-hidden />
        </div>
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-glow-blue">
            Necro<span className="text-neon-purple text-glow-purple">Code</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
            Agent Control Panel
          </p>
        </div>
      </div>

      <StatusPill phase={phase} />

      {/* Directive input */}
      <div className="space-y-2">
        <label
          htmlFor="directive"
          className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-400"
        >
          <Sparkles className="h-3.5 w-3.5 text-neon-purple" aria-hidden />
          Directive
        </label>
        <textarea
          id="directive"
          value={directive}
          onChange={(e) => onDirectiveChange(e.target.value)}
          rows={3}
          placeholder="Describe the ritual the agent should perform…"
          className="w-full resize-none rounded-xl border border-neon-blue/20 bg-black/40 p-3 font-mono text-sm text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-neon-blue/60 focus:shadow-glow-blue"
        />
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-slate-400">
          <Cpu className="h-3.5 w-3.5 text-neon-blue" aria-hidden />
          Preset Workflows
        </p>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {WORKFLOW_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const active = preset.id === selectedPresetId;
            return (
              <motion.button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.directive)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={[
                  "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                  active
                    ? "border-neon-blue/60 bg-neon-blue/10 shadow-glow-blue"
                    : "border-white/5 bg-black/20 hover:border-neon-blue/30 hover:bg-black/40",
                ].join(" ")}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${ACCENT_TEXT[preset.accent]}`}
                  aria-hidden
                />
                <span className="font-mono text-xs text-slate-200">
                  {preset.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-3">
        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <span>Progress</span>
            <span className="text-neon-blue">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.4 }}
            />
          </div>
        </div>

        <NeonButton
          label={running ? "Exorcising…" : "Run Agent Exorcism"}
          icon={Ghost}
          onClick={onRun}
          loading={running}
          accent="purple"
        />
        <button
          type="button"
          onClick={onReset}
          disabled={running}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-neon-blue/30 hover:text-neon-blue disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </button>
      </div>
    </aside>
  );
}
