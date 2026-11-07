import type { NextRequest } from "next/server";
import {
  type AgentEvent,
  type AgentPhase,
  type LogLevel,
  type NodeStatus,
  type StageId,
  WORKFLOW_STAGES,
} from "@/lib/types";
import { exorcise, type Haunting, SAMPLE_CURSED_CODE } from "@/lib/exorcist";

// Ensure this route is always dynamically rendered and never cached —
// SSE must stream, not be statically optimized.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** A single step the exorcist emits over SSE. */
interface ScriptStep {
  phase: AgentPhase;
  stage: StageId | null;
  nodeStatus: NodeStatus | null;
  level: LogLevel;
  message: string;
  bug: boolean;
  /** Milliseconds to wait before emitting this step. */
  delay: number;
}

const SEV_ICON: Record<Haunting["severity"], string> = {
  syntax: "✖",
  logic: "⚠",
  smell: "☍",
};

/**
 * Build the full exorcism transcript from a REAL analysis of the submitted
 * code. Every message reflects actual findings from lib/exorcist.ts.
 */
function buildScript(rawCode: string): {
  steps: ScriptStep[];
  bugTotal: number;
} {
  const code =
    rawCode.trim().length > 0 ? rawCode : SAMPLE_CURSED_CODE;
  const result = exorcise(code);
  const lineCount = code.split("\n").length;
  const bugTotal = result.hauntings.length;

  const steps: ScriptStep[] = [];
  const push = (s: Omit<ScriptStep, "bug"> & { bug?: boolean }) =>
    steps.push({ bug: false, ...s });

  // ── Lifecycle intro ──────────────────────────────────────────
  push({
    phase: "summoning",
    stage: null,
    nodeStatus: null,
    level: "haunt",
    message: "🕯️  NecroCode Exorcist awakened — lighting the candles…",
    delay: 220,
  });

  // ── Stage 1: Input Code ──────────────────────────────────────
  push({
    phase: "summoning",
    stage: "input_code",
    nodeStatus: "active",
    level: "system",
    message: `[input_code] receiving cursed snippet · ${lineCount} line(s)…`,
    delay: 420,
  });
  push({
    phase: "summoning",
    stage: "input_code",
    nodeStatus: "cleansed",
    level: "success",
    message: "[input_code] ✓ snippet parsed & structure mapped",
    delay: 460,
  });

  // ── Stage 2: Glitch Scanner ──────────────────────────────────
  push({
    phase: "scanning",
    stage: "glitch_scanner",
    nodeStatus: "active",
    level: "system",
    message: "[glitch_scanner] sweeping for syntax & logic demons…",
    delay: 500,
  });

  if (bugTotal === 0) {
    push({
      phase: "scanning",
      stage: "glitch_scanner",
      nodeStatus: "cleansed",
      level: "success",
      message: "[glitch_scanner] ✓ no hauntings found — the code is pure (for now)",
      delay: 480,
    });
  } else {
    // Mark the scanner HAUNTED and enumerate each real bug.
    push({
      phase: "scanning",
      stage: "glitch_scanner",
      nodeStatus: "haunted",
      level: "error",
      message: `[glitch_scanner] ✖ ${bugTotal} haunting(s) detected!`,
      bug: true,
      delay: 460,
    });
    for (const h of result.hauntings) {
      push({
        phase: "scanning",
        stage: "glitch_scanner",
        nodeStatus: "haunted",
        level: "warn",
        message: `  ${SEV_ICON[h.severity]} L${h.line} [${h.rule}] ${h.message}`,
        bug: true,
        delay: 320,
      });
    }
  }

  // ── Stage 3: Exorcism Reasoning ──────────────────────────────
  push({
    phase: "exorcising",
    stage: "exorcism_reasoning",
    nodeStatus: bugTotal > 0 ? "haunted" : "active",
    level: "haunt",
    message: "[exorcism_reasoning] chanting the debugging rites…",
    bug: bugTotal > 0,
    delay: 520,
  });

  if (bugTotal === 0) {
    push({
      phase: "exorcising",
      stage: "exorcism_reasoning",
      nodeStatus: "cleansed",
      level: "info",
      message: "  ↳ nothing to banish — spirits already at rest.",
      delay: 440,
    });
  } else {
    for (const h of result.hauntings) {
      push({
        phase: "exorcising",
        stage: "exorcism_reasoning",
        nodeStatus: "active",
        level: "info",
        message: `  ↳ banishing L${h.line} · ${h.fix}`,
        delay: 360,
      });
    }
  }
  push({
    phase: "exorcising",
    stage: "exorcism_reasoning",
    nodeStatus: "cleansed",
    level: "success",
    message: `[exorcism_reasoning] ✓ ${bugTotal} demon(s) banished`,
    delay: 460,
  });

  // ── Stage 4: Clean Code Output ───────────────────────────────
  push({
    phase: "exorcising",
    stage: "clean_output",
    nodeStatus: "active",
    level: "system",
    message: "[clean_output] inscribing the purified code…",
    delay: 440,
  });
  for (const codeLine of result.cleanedCode.split("\n")) {
    push({
      phase: "exorcising",
      stage: "clean_output",
      nodeStatus: "active",
      level: "code",
      message: codeLine.length > 0 ? codeLine : " ",
      delay: 150,
    });
  }
  push({
    phase: "exorcising",
    stage: "clean_output",
    nodeStatus: "cleansed",
    level: "success",
    message: "[clean_output] ✓ clean code emitted · mortal-safe",
    delay: 420,
  });

  // ── Complete ─────────────────────────────────────────────────
  push({
    phase: "complete",
    stage: null,
    nodeStatus: null,
    level: "haunt",
    message:
      bugTotal > 0
        ? `☨ The exorcism is complete — ${bugTotal} demon(s) sent back to the void. ☨`
        : "☨ The code was already pure. The crypt rests quiet. ☨",
    delay: 340,
  });

  return { steps, bugTotal };
}

const encoder = new TextEncoder();

function sse(event: AgentEvent): Uint8Array {
  return encoder.encode(`event: agent\ndata: ${JSON.stringify(event)}\n\n`);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handle(code: string): Promise<Response> {
  const { steps } = buildScript(code);
  const stageCount = WORKFLOW_STAGES.length;
  let completedStages = 0;
  let bugCount = 0;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let seq = 0;
        for (const step of steps) {
          await wait(step.delay);

          if (step.nodeStatus === "cleansed") completedStages += 1;
          if (step.bug) bugCount += 1;

          const progress =
            step.phase === "complete"
              ? 100
              : Math.min(99, Math.round((completedStages / stageCount) * 100));

          const payload: AgentEvent = {
            seq: seq++,
            phase: step.phase,
            stage: step.stage,
            nodeStatus: step.nodeStatus,
            level: step.level,
            message: step.message,
            bug: step.bug,
            bugCount,
            progress,
            ts: new Date().toISOString(),
          };

          controller.enqueue(sse(payload));
        }
        controller.close();
      } catch {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  const code = req.nextUrl.searchParams.get("code") ?? "";
  return handle(code);
}

export async function POST(req: NextRequest): Promise<Response> {
  let code = "";
  try {
    const body = (await req.json()) as { code?: unknown };
    if (typeof body.code === "string") code = body.code;
  } catch {
    /* No/invalid body — fall back to the sample cursed snippet. */
  }
  return handle(code);
}
