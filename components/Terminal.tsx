"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Circle, Copy, Flame } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AgentEvent, LogLevel } from "@/lib/types";

const LEVEL_COLOR: Record<LogLevel, string> = {
  info: "text-slate-300",
  success: "text-ecto text-glow-ecto",
  warn: "text-blood",
  error: "text-blood text-glow-blood",
  system: "text-spectral",
  code: "text-haunt text-glow-haunt",
  haunt: "text-haunt text-glow-haunt",
};

const LEVEL_PREFIX: Record<LogLevel, string> = {
  info: "info",
  success: " ok ",
  warn: "warn",
  error: "fail",
  system: "sys ",
  code: "code",
  haunt: "rite",
};

function timeOf(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "--:--:--";
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

export function Terminal({
  logs,
  running,
  scanlines = true,
  onCopied,
}: {
  logs: AgentEvent[];
  running: boolean;
  scanlines?: boolean;
  /** Fired after a successful copy so the page can play an SFX. */
  onCopied?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Auto-scroll to the newest line.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  // Only the cleansed-code lines are worth copying.
  const codeLines = logs.filter((l) => l.level === "code").map((l) => l.message);
  const hasCode = codeLines.length > 0;

  const handleCopy = useCallback(async () => {
    if (!hasCode) return;
    const text = codeLines.join("\n");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for insecure contexts / older browsers.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard denied — silently ignore; the button simply won't confirm.
    }
  }, [codeLines, hasCode, onCopied]);

  return (
    <aside
      className={`glass-strong flex h-full flex-col overflow-hidden rounded-2xl ${
        scanlines ? "scanlines" : ""
      }`}
    >
      {/* Title bar */}
      <div className="relative z-10 flex items-center gap-2 border-b border-white/5 bg-black/50 px-4 py-3">
        <div className="flex gap-1.5">
          <Circle className="h-2.5 w-2.5 fill-blood text-blood" />
          <Circle className="h-2.5 w-2.5 fill-haunt text-haunt" />
          <Circle className="h-2.5 w-2.5 fill-spectral text-spectral" />
        </div>
        <div className="ml-2 flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-blood" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-wider text-haunt/80">
            exorcist@crypt — séance log
          </span>
        </div>

        {/* Copy cleansed code */}
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasCode}
            title={hasCode ? "Copy cleansed code" : "No clean code yet"}
            className={[
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-all",
              hasCode
                ? "border-spectral/40 text-spectral hover:bg-spectral/10 hover:shadow-glow-spectral"
                : "cursor-not-allowed border-white/10 text-slate-600",
            ].join(" ")}
          >
            {copied ? (
              <Check className="h-3 w-3" aria-hidden />
            ) : (
              <Copy className="h-3 w-3" aria-hidden />
            )}
            <span className="hidden sm:inline">Copy</span>
          </button>

          {/* Glowing "Copied!" badge. */}
          <AnimatePresence>
            {copied && (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.8 }}
                className="absolute right-0 top-full z-20 mt-1.5 inline-flex items-center gap-1 rounded-md border border-ecto/60 bg-ecto/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ecto shadow-glow-ecto"
              >
                <Check className="h-3 w-3" aria-hidden />
                Copied!
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Log stream */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 space-y-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed"
      >
        {logs.length === 0 && (
          <p className="text-slate-600">
            <span className="text-ecto">$</span> the crypt is silent… press{" "}
            <span className="text-blood">Run Bug Exorcism</span> to begin the
            séance.
          </p>
        )}

        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={`${log.seq}-${log.ts}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-2 ${
                log.bug ? "rounded bg-blood/5 px-1" : ""
              }`}
            >
              <span className="shrink-0 select-none text-slate-600">
                {timeOf(log.ts)}
              </span>
              <span
                className={`shrink-0 select-none uppercase ${LEVEL_COLOR[log.level]}`}
              >
                [{LEVEL_PREFIX[log.level]}]
              </span>
              <span
                className={`whitespace-pre-wrap break-words ${LEVEL_COLOR[log.level]}`}
              >
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor while running */}
        {running && (
          <div className="flex gap-2">
            <span className="text-ecto">$</span>
            <motion.span
              className="inline-block h-4 w-2 bg-blood"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
