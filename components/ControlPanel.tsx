"use client";

import { motion } from "framer-motion";
import { FlaskConical, RotateCcw, Skull, Sparkles } from "lucide-react";
import { NeonButton } from "@/components/NeonButton";
import { StatusPill } from "@/components/StatusPill";
import { RITUAL_SPELLS } from "@/lib/presets";
import type { AgentPhase } from "@/lib/types";

interface ControlPanelProps {
  code: string;
  onCodeChange: (value: string) => void;
  onSelectSpell: (code: string) => void;
  selectedSpellId: string | null;
  onRun: () => void;
  onReset: () => void;
  running: boolean;
  phase: AgentPhase;
  progress: number;
  bugCount: number;
}

const ACCENT_TEXT = {
  blood: "text-blood",
  haunt: "text-haunt",
  spectral: "text-spectral",
} as const;

const ACCENT_ACTIVE = {
  blood: "border-blood/60 bg-blood/10 shadow-glow-blood",
  haunt: "border-haunt/60 bg-haunt/10 shadow-glow-haunt",
  spectral: "border-spectral/60 bg-spectral/10 shadow-glow-spectral",
} as const;

export function ControlPanel({
  code,
  onCodeChange,
  onSelectSpell,
  selectedSpellId,
  onRun,
  onReset,
  running,
  phase,
  progress,
  bugCount,
}: ControlPanelProps) {
  const lineCount = code.length === 0 ? 1 : code.split("\n").length;

  return (
    <aside className="glass-strong flex h-full flex-col gap-4 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-blood/40 bg-blood/10 shadow-glow-blood">
          <Skull className="h-5 w-5 text-blood" aria-hidden />
        </div>
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight">
            <span className="text-blood text-glow-blood">Necro</span>
            <span className="text-haunt text-glow-haunt">Code</span>
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-haunt/70">
            Ritual Spells &amp; Bug Exorcism
          </p>
        </div>
      </div>

      <StatusPill phase={phase} bugCount={bugCount} />

      {/* Code editor window */}
      <div className="space-y-2">
        <label
          htmlFor="code"
          className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-spectral/80"
        >
          <Sparkles className="h-3.5 w-3.5 text-haunt" aria-hidden />
          Cursed Code
        </label>

        <div className="overflow-hidden rounded-xl border border-haunt/25 bg-black/60 shadow-glow-haunt">
          {/* Editor title bar */}
          <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/50 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blood/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-haunt/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-spectral/80" />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              cursed.ts · {lineCount} ln
            </span>
          </div>
          <textarea
            id="code"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            spellCheck={false}
            rows={9}
            placeholder={"// paste JS/TS here, or pick a ritual spell below\nif (x == 1) var y = 1"}
            className="h-44 w-full resize-none bg-transparent p-3 font-mono text-[12px] leading-relaxed text-ecto/90 placeholder:text-slate-700 outline-none"
          />
        </div>
      </div>

      {/* Ritual spells */}
      <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
        <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-spectral/80">
          <FlaskConical className="h-3.5 w-3.5 text-spectral" aria-hidden />
          Ritual Spells
        </p>
        <div className="flex max-h-full flex-col gap-2 overflow-y-auto pr-1">
          {RITUAL_SPELLS.map((spell) => {
            const Icon = spell.icon;
            const active = spell.id === selectedSpellId;
            return (
              <motion.button
                key={spell.id}
                type="button"
                onClick={() => onSelectSpell(spell.code)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={[
                  "group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                  active
                    ? ACCENT_ACTIVE[spell.accent]
                    : "border-white/5 bg-black/30 hover:border-haunt/30 hover:bg-black/50",
                ].join(" ")}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${ACCENT_TEXT[spell.accent]}`}
                  aria-hidden
                />
                <span className="font-mono text-xs text-bone/90">
                  {spell.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <span>Exorcism Progress</span>
            <span className="text-spectral">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blood via-haunt to-spectral"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.4 }}
            />
          </div>
        </div>

        <NeonButton
          label={running ? "Exorcising…" : "Run Bug Exorcism"}
          icon={Skull}
          onClick={onRun}
          loading={running}
          accent="blood"
        />
        <button
          type="button"
          onClick={onReset}
          disabled={running}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-2 font-mono text-xs uppercase tracking-widest text-slate-400 transition hover:border-haunt/30 hover:text-haunt disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset Ritual
        </button>
      </div>
    </aside>
  );
}
