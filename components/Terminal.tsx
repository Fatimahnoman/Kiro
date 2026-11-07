"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Circle, SquareTerminal } from "lucide-react";
import { useEffect, useRef } from "react";
import type { AgentEvent, LogLevel } from "@/lib/types";

const LEVEL_COLOR: Record<LogLevel, string> = {
  info: "text-slate-300",
  success: "text-neon-green text-glow-green",
  warn: "text-neon-amber",
  error: "text-neon-rose",
  system: "text-neon-blue",
  code: "text-neon-purple",
};

const LEVEL_PREFIX: Record<LogLevel, string> = {
  info: "info",
  success: " ok ",
  warn: "warn",
  error: "fail",
  system: "sys ",
  code: "code",
};

function timeOf(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "--:--:--";
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

export function Terminal({
  logs,
  running,
}: {
  logs: AgentEvent[];
  running: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest line.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <aside className="glass-strong scanlines flex h-full flex-col overflow-hidden rounded-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-black/40 px-4 py-3">
        <div className="flex gap-1.5">
          <Circle className="h-2.5 w-2.5 fill-neon-rose text-neon-rose" />
          <Circle className="h-2.5 w-2.5 fill-neon-amber text-neon-amber" />
          <Circle className="h-2.5 w-2.5 fill-neon-green text-neon-green" />
        </div>
        <div className="ml-2 flex items-center gap-1.5">
          <SquareTerminal className="h-3.5 w-3.5 text-neon-blue" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
            necrocode@agent — stream
          </span>
        </div>
      </div>

      {/* Log stream */}
      <div
        ref={scrollRef}
        className="relative flex-1 space-y-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed"
      >
        {logs.length === 0 && (
          <p className="text-slate-600">
            <span className="text-neon-green">$</span> awaiting directive… press{" "}
            <span className="text-neon-purple">Run Agent Exorcism</span> to begin.
          </p>
        )}

        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={`${log.seq}-${log.ts}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <span className="shrink-0 select-none text-slate-600">
                {timeOf(log.ts)}
              </span>
              <span
                className={`shrink-0 select-none uppercase ${LEVEL_COLOR[log.level]}`}
              >
                [{LEVEL_PREFIX[log.level]}]
              </span>
              <span className={`whitespace-pre-wrap break-words ${LEVEL_COLOR[log.level]}`}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor while running */}
        {running && (
          <div className="flex gap-2">
            <span className="text-neon-green">$</span>
            <motion.span
              className="inline-block h-4 w-2 bg-neon-blue"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
