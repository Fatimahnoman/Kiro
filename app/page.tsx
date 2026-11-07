"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ScanLine, Skull, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AgentCanvas } from "@/components/AgentCanvas";
import { ControlPanel } from "@/components/ControlPanel";
import { Terminal } from "@/components/Terminal";
import { ToggleButton } from "@/components/ToggleButton";
import { RITUAL_SPELLS } from "@/lib/presets";
import { sfxForEvent } from "@/lib/sfxMap";
import { useAgentStream } from "@/lib/useAgentStream";
import { useCyberSound } from "@/lib/useCyberSound";
import { useUiSettings } from "@/lib/useUiSettings";

const DEFAULT_CODE = RITUAL_SPELLS[RITUAL_SPELLS.length - 1].code;

export default function Home() {
  const { state, run, reset } = useAgentStream();
  const { settings, toggle } = useUiSettings();
  const { play } = useCyberSound(settings.soundOn);

  const [code, setCode] = useState(DEFAULT_CODE);
  const [selectedSpellId, setSelectedSpellId] = useState<string | null>(
    RITUAL_SPELLS[RITUAL_SPELLS.length - 1].id,
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

  const handleSelectSpell = (spellCode: string) => {
    setCode(spellCode);
    const match = RITUAL_SPELLS.find((p) => p.code === spellCode);
    setSelectedSpellId(match ? match.id : null);
    play("click");
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setSelectedSpellId(null); // custom edits deselect the preset
  };

  const handleRun = () => {
    if (state.running) return;
    lastSonifiedSeq.current = -1;
    play("click");
    run(code.trim().length > 0 ? code : DEFAULT_CODE);
  };

  const handleReset = () => {
    lastSonifiedSeq.current = -1;
    play("click");
    reset();
  };

  return (
    <main className="haunted-vignette relative min-h-screen overflow-hidden bg-void">
      {/* Eerie fog + ambient blood/haunt glows */}
      <div className="pointer-events-none fixed inset-0 bg-fog animate-fog-drift opacity-80" />
      <div className="pointer-events-none fixed -left-40 -top-40 h-96 w-96 rounded-full bg-blood/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-96 w-96 rounded-full bg-haunt/10 blur-3xl" />
      <div
        className={`pointer-events-none fixed inset-0 bg-grid-fade bg-grid opacity-[0.13] ${
          settings.gridAnimated ? "animate-grid-drift" : ""
        }`}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 p-4 lg:h-screen">
        {/* Top banner + toggle toolbar */}
        <header className="glass flex flex-col gap-3 rounded-2xl px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Skull className="h-5 w-5 text-blood animate-flicker" aria-hidden />
            <div className="flex flex-col gap-0.5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-bone/80">
                NecroCode <span className="text-blood">//</span> Code Exorcist
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-haunt/60">
                Haunted Cyber-Gothic AI · Kiroween 2026
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ToggleButton
              label="Cyber Sound FX"
              icon={settings.soundOn ? Volume2 : VolumeX}
              active={settings.soundOn}
              onToggle={() => {
                if (!settings.soundOn) play("click");
                toggle("soundOn");
              }}
              accent="haunt"
              title="Toggle synthesized Web Audio séance effects"
            />
            <ToggleButton
              label="Scanlines"
              icon={ScanLine}
              active={settings.scanlinesOn}
              onToggle={() => {
                play("click");
                toggle("scanlinesOn");
              }}
              accent="spectral"
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
              accent="blood"
              title="Toggle the animated haunted grid backdrop"
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
              className="flex items-center gap-2 rounded-xl border border-blood/40 bg-blood/10 px-4 py-2 font-mono text-xs text-blood"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden />
              {state.error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD grid */}
        <div className="grid flex-1 grid-cols-1 gap-4 lg:min-h-0 lg:grid-cols-[320px_1fr_380px]">
          <div className="lg:min-h-0">
            <ControlPanel
              code={code}
              onCodeChange={handleCodeChange}
              onSelectSpell={handleSelectSpell}
              selectedSpellId={selectedSpellId}
              onRun={handleRun}
              onReset={handleReset}
              running={state.running}
              phase={state.phase}
              progress={state.progress}
              bugCount={state.bugCount}
            />
          </div>

          <div className="min-h-[440px] lg:min-h-0">
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
