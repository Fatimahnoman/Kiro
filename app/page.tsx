"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { AgentCanvas } from "@/components/AgentCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { Terminal } from "@/components/Terminal";
import { WORKFLOW_PRESETS } from "@/lib/presets";
import { useAgentStream } from "@/lib/useAgentStream";

const DEFAULT_DIRECTIVE =
  "Purge legacy spaghetti and regenerate a clean, typed module.";

export default function Home() {
  const { state, run, reset } = useAgentStream();
  const [directive, setDirective] = useState(DEFAULT_DIRECTIVE);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    "exorcism",
  );

  const handleSelectPreset = (presetDirective: string) => {
    setDirective(presetDirective);
    const match = WORKFLOW_PRESETS.find((p) => p.directive === presetDirective);
    setSelectedPresetId(match ? match.id : null);
  };

  const handleRun = () => {
    if (state.running) return;
    run(directive.trim().length > 0 ? directive : DEFAULT_DIRECTIVE);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-void">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-neon-blue/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-neon-purple/10 blur-3xl" />
      <div className="pointer-events-none fixed inset-0 bg-grid-fade bg-grid opacity-[0.15]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 p-4 lg:h-screen">
        {/* Top banner */}
        <header className="glass flex flex-col gap-2 rounded-2xl px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
            NecroCode <span className="text-neon-blue">//</span> Visual Agent
            Studio
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
            Next.js 15 · Framer Motion · SSE · Kiro-ready
          </p>
        </header>

        {/* Error banner */}
        <AnimatePresence>
          {state.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-xl border border-neon-rose/40 bg-neon-rose/10 px-4 py-2 font-mono text-xs text-neon-rose"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden />
              {state.error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD grid */}
        <div className="grid flex-1 grid-cols-1 gap-4 lg:min-h-0 lg:grid-cols-[300px_1fr_360px]">
          <div className="lg:min-h-0">
            <ControlPanel
              directive={directive}
              onDirectiveChange={setDirective}
              onSelectPreset={handleSelectPreset}
              selectedPresetId={selectedPresetId}
              onRun={handleRun}
              onReset={reset}
              running={state.running}
              phase={state.phase}
              progress={state.progress}
            />
          </div>

          <div className="min-h-[420px] lg:min-h-0">
            <AgentCanvas nodes={state.nodes} />
          </div>

          <div className="min-h-[360px] lg:min-h-0">
            <Terminal logs={state.logs} running={state.running} />
          </div>
        </div>
      </div>
    </main>
  );
}
