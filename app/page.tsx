"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ScanLine, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AgentCanvas } from "@/components/AgentCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { Terminal } from "@/components/Terminal";
import { ToggleButton } from "@/components/ToggleButton";
import { WORKFLOW_PRESETS } from "@/lib/presets";
import { sfxForEvent } from "@/lib/sfxMap";
import { useAgentStream } from "@/lib/useAgentStream";
import { useCyberSound } from "@/lib/useCyberSound";
import { useUiSettings } from "@/lib/useUiSettings";

const DEFAULT_DIRECTIVE =
  "Purge legacy spaghetti and regenerate a clean, typed module.";

export default function Home() {
  const { state, run, reset } = useAgentStream();
  const { settings, toggle } = useUiSettings();
  const { play } = useCyberSound(settings.soundOn);

  const [directive, setDirective] = useState(DEFAULT_DIRECTIVE);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    "exorcism",
  );

  // Track which events we've already sonified so re-renders don't replay them.
  const lastSonifiedSeq = useRef<number>(-1);

  useEffect(() => {
    if (!settings.soundOn) return;
    for (const log of state.logs) {
      if (log.seq <= lastSonifiedSeq.current) continue;
      lastSonifiedSeq.current = log.seq;
      const sfx = sfxForEvent(log);
      if (sfx) play(sfx);
    }
  }, [state.logs, settings.soundOn, play]);

  const handleSelectPreset = (presetDirective: string) => {
    setDirective(presetDirective);
    const match = WORKFLOW_PRESETS.find((p) => p.directive === presetDirective);
    setSelectedPresetId(match ? match.id : null);
    play("click");
  };

  const handleRun = () => {
    if (state.running) return;
    lastSonifiedSeq.current = -1;
    play("click");
    run(directive.trim().length > 0 ? directive : DEFAULT_DIRECTIVE);
  };

  const handleReset = () => {
    lastSonifiedSeq.current = -1;
    play("click");
    reset();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-void">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-neon-blue/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-neon-purple/10 blur-3xl" />
      <div
        className={`pointer-events-none fixed inset-0 bg-grid-fade bg-grid opacity-[0.15] ${
          settings.gridAnimated ? "animate-grid-drift" : ""
        }`}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 p-4 lg:h-screen">
        {/* Top banner + toggle toolbar */}
        <header className="glass flex flex-col gap-3 rounded-2xl px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
              NecroCode <span className="text-neon-blue">//</span> Visual Agent
              Studio
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">
              Next.js 15 · Framer Motion · SSE · Kiro-ready
            </p>
          </div>

          {/* Interactive toggles (requirements 1c + 2a). */}
          <div className="flex flex-wrap items-center gap-2">
            <ToggleButton
              label="Cyber Sound FX"
              icon={settings.soundOn ? Volume2 : VolumeX}
              active={settings.soundOn}
              onToggle={() => {
                // Audible confirmation only when turning ON.
                if (!settings.soundOn) play("click");
                toggle("soundOn");
              }}
              accent="purple"
              title="Toggle synthesized Web Audio sound effects"
            />
            <ToggleButton
              label="Scanlines"
              icon={ScanLine}
              active={settings.scanlinesOn}
              onToggle={() => {
                play("click");
                toggle("scanlinesOn");
              }}
              accent="blue"
              title="Toggle the CRT scanline overlay on the terminal"
            />
            <ToggleButton
              label="Grid FX"
              icon={Zap}
              active={settings.gridAnimated}
              onToggle={() => {
                play("click");
                toggle("gridAnimated");
              }}
              accent="green"
              title="Toggle the animated cyberpunk grid backdrop"
            />
          </div>
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
              onReset={handleReset}
              running={state.running}
              phase={state.phase}
              progress={state.progress}
            />
          </div>

          <div className="min-h-[420px] lg:min-h-0">
            <AgentCanvas
              nodes={state.nodes}
              activeStage={state.activeStage}
              gridAnimated={settings.gridAnimated}
            />
          </div>

          <div className="min-h-[360px] lg:min-h-0">
            <Terminal
              logs={state.logs}
              running={state.running}
              scanlines={settings.scanlinesOn}
              onCopied={() => play("copy")}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
