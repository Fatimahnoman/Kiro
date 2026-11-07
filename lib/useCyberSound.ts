"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Lightweight cyberpunk sound-effects engine built entirely on the Web Audio
 * API — no audio files, zero assets, fully synthesized. Every effect is a short
 * oscillator blip so the bundle stays tiny and nothing needs to load.
 *
 * The AudioContext is created lazily on first use (browsers require a user
 * gesture before audio can start), and all calls are no-ops when muted or when
 * running on the server.
 */

export type CyberSfx =
  | "click" // UI button press
  | "node" // a stage node activates
  | "tool" // a tool-call event
  | "success" // a stage completes
  | "complete" // whole workflow finishes
  | "error" // stream failure
  | "copy"; // copy-to-clipboard

interface Blip {
  type: OscillatorType;
  /** Start frequency in Hz. */
  freq: number;
  /** Optional end frequency for a pitch sweep. */
  toFreq?: number;
  /** Duration in seconds. */
  dur: number;
  /** Peak gain 0..1. */
  gain: number;
}

// A short "chord" is just a list of blips played together / in sequence.
const RECIPES: Record<CyberSfx, Blip[]> = {
  click: [{ type: "square", freq: 660, dur: 0.05, gain: 0.05 }],
  node: [{ type: "triangle", freq: 440, toFreq: 880, dur: 0.12, gain: 0.07 }],
  tool: [{ type: "sawtooth", freq: 320, toFreq: 520, dur: 0.1, gain: 0.05 }],
  success: [
    { type: "sine", freq: 523.25, dur: 0.09, gain: 0.07 },
    { type: "sine", freq: 783.99, dur: 0.12, gain: 0.06 },
  ],
  complete: [
    { type: "sine", freq: 523.25, dur: 0.1, gain: 0.07 },
    { type: "sine", freq: 659.25, dur: 0.1, gain: 0.07 },
    { type: "sine", freq: 987.77, dur: 0.22, gain: 0.08 },
  ],
  error: [{ type: "sawtooth", freq: 180, toFreq: 80, dur: 0.25, gain: 0.08 }],
  copy: [{ type: "square", freq: 880, toFreq: 1320, dur: 0.07, gain: 0.05 }],
};

export function useCyberSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (sfx: CyberSfx) => {
      if (!enabled) return;
      const ctx = ensureCtx();
      if (!ctx) return;

      // Resume if the context was suspended (autoplay policy).
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      let offset = 0;

      for (const blip of RECIPES[sfx]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = blip.type;
        osc.frequency.setValueAtTime(blip.freq, now + offset);
        if (blip.toFreq !== undefined) {
          osc.frequency.exponentialRampToValueAtTime(
            Math.max(1, blip.toFreq),
            now + offset + blip.dur,
          );
        }

        // Quick attack + exponential decay envelope for a clean blip.
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(blip.gain, now + offset + 0.008);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + offset + blip.dur,
        );

        osc.connect(gain).connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + blip.dur + 0.02);

        // Stack chord tones with a tiny stagger so they feel arpeggiated.
        offset += blip.dur * 0.6;
      }
    },
    [enabled, ensureCtx],
  );

  // Close the AudioContext on unmount to free resources.
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx && ctx.state !== "closed") {
        void ctx.close();
      }
      ctxRef.current = null;
    };
  }, []);

  return { play };
}
