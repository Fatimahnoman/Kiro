import type { NextRequest } from "next/server";
import {
  type AgentEvent,
  type AgentPhase,
  type LogLevel,
  type NodeStatus,
  type StageId,
  WORKFLOW_STAGES,
} from "@/lib/types";

// Ensure this route is always dynamically rendered and never cached —
// SSE must stream, not be statically optimized.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** A scripted step the simulated agent emits over SSE. */
interface ScriptStep {
  phase: AgentPhase;
  stage: StageId | null;
  nodeStatus: NodeStatus | null;
  level: LogLevel;
  message: string;
  /** Milliseconds to wait before emitting this step. */
  delay: number;
}

function buildScript(directive: string): ScriptStep[] {
  const safeDirective =
    directive.trim().length > 0
      ? directive.trim().slice(0, 120)
      : "Run Agent Exorcism";

  return [
    {
      phase: "idle",
      stage: null,
      nodeStatus: null,
      level: "system",
      message: "// NecroCode runtime online — summoning agent core…",
      delay: 180,
    },
    {
      phase: "thinking",
      stage: null,
      nodeStatus: null,
      level: "info",
      message: `» Directive received: "${safeDirective}"`,
      delay: 360,
    },

    // ── Stage 1: Input Parsing ────────────────────────────────
    {
      phase: "thinking",
      stage: "input_parsing",
      nodeStatus: "active",
      level: "system",
      message: "[input_parsing] tokenizing directive stream…",
      delay: 420,
    },
    {
      phase: "thinking",
      stage: "input_parsing",
      nodeStatus: "active",
      level: "info",
      message: "  ↳ intent vector resolved: { action: 'generate', scope: 'module' }",
      delay: 520,
    },
    {
      phase: "executing",
      stage: "input_parsing",
      nodeStatus: "done",
      level: "success",
      message: "[input_parsing] ✓ 42 tokens parsed · 0 ambiguities",
      delay: 480,
    },

    // ── Stage 2: Context Scanning ─────────────────────────────
    {
      phase: "tool_call",
      stage: "context_scanning",
      nodeStatus: "active",
      level: "system",
      message: "[context_scanning] invoking tool: scan_repository_graph()",
      delay: 520,
    },
    {
      phase: "executing",
      stage: "context_scanning",
      nodeStatus: "active",
      level: "info",
      message: "  ↳ indexed 128 files · 14 steering rules · 3 specs",
      delay: 560,
    },
    {
      phase: "thinking",
      stage: "context_scanning",
      nodeStatus: "active",
      level: "warn",
      message: "  ⚠ stale embedding detected → re-vectorizing /lib",
      delay: 480,
    },
    {
      phase: "executing",
      stage: "context_scanning",
      nodeStatus: "done",
      level: "success",
      message: "[context_scanning] ✓ context graph assembled (99.2% coverage)",
      delay: 500,
    },

    // ── Stage 3: Kiro Hook Trigger ────────────────────────────
    {
      phase: "tool_call",
      stage: "kiro_hook_trigger",
      nodeStatus: "active",
      level: "system",
      message: "[kiro_hook_trigger] matching event → PreToolUse hooks…",
      delay: 520,
    },
    {
      phase: "executing",
      stage: "kiro_hook_trigger",
      nodeStatus: "active",
      level: "info",
      message: "  ↳ hook 'lint-guard' fired · hook 'spec-sync' fired",
      delay: 560,
    },
    {
      phase: "executing",
      stage: "kiro_hook_trigger",
      nodeStatus: "done",
      level: "success",
      message: "[kiro_hook_trigger] ✓ 2 hooks executed · exit 0",
      delay: 480,
    },

    // ── Stage 4: Code Generation ──────────────────────────────
    {
      phase: "thinking",
      stage: "code_generation",
      nodeStatus: "active",
      level: "system",
      message: "[code_generation] synthesizing TypeScript module…",
      delay: 520,
    },
    {
      phase: "executing",
      stage: "code_generation",
      nodeStatus: "active",
      level: "code",
      message: "export async function exorcise(ctx: AgentCtx): Promise<Result> {",
      delay: 320,
    },
    {
      phase: "executing",
      stage: "code_generation",
      nodeStatus: "active",
      level: "code",
      message: "  const plan = await ctx.plan(ctx.directive);",
      delay: 280,
    },
    {
      phase: "executing",
      stage: "code_generation",
      nodeStatus: "active",
      level: "code",
      message: "  return ctx.emit(plan); // ✨ clean, typed, deployable",
      delay: 280,
    },
    {
      phase: "executing",
      stage: "code_generation",
      nodeStatus: "active",
      level: "code",
      message: "}",
      delay: 260,
    },
    {
      phase: "executing",
      stage: "code_generation",
      nodeStatus: "active",
      level: "info",
      message: "  ↳ typecheck: tsc --noEmit → 0 errors",
      delay: 520,
    },
    {
      phase: "executing",
      stage: "code_generation",
      nodeStatus: "done",
      level: "success",
      message: "[code_generation] ✓ artifact emitted · 1 file · 0 warnings",
      delay: 480,
    },

    // ── Complete ──────────────────────────────────────────────
    {
      phase: "complete",
      stage: null,
      nodeStatus: null,
      level: "success",
      message: "◆ Workflow complete — the machine spirit is appeased. ◆",
      delay: 360,
    },
  ];
}

const encoder = new TextEncoder();

function sse(event: AgentEvent): Uint8Array {
  // Standard SSE framing: named event + JSON data line.
  return encoder.encode(
    `event: agent\ndata: ${JSON.stringify(event)}\n\n`,
  );
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handle(directive: string): Promise<Response> {
  const script = buildScript(directive);
  const stageCount = WORKFLOW_STAGES.length;
  // Progress is driven by how many stages have reached "done".
  let completedStages = 0;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let seq = 0;
        for (const step of script) {
          await wait(step.delay);

          if (step.nodeStatus === "done") {
            completedStages += 1;
          }

          const progress =
            step.phase === "complete"
              ? 100
              : Math.min(
                  99,
                  Math.round((completedStages / stageCount) * 100),
                );

          const payload: AgentEvent = {
            seq: seq++,
            phase: step.phase,
            stage: step.stage,
            nodeStatus: step.nodeStatus,
            level: step.level,
            message: step.message,
            progress,
            ts: new Date().toISOString(),
          };

          controller.enqueue(sse(payload));
        }
        controller.close();
      } catch {
        // If the client disconnects, the controller throws on enqueue —
        // closing silently is the correct behavior.
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
  const directive = req.nextUrl.searchParams.get("directive") ?? "";
  return handle(directive);
}

export async function POST(req: NextRequest): Promise<Response> {
  let directive = "";
  try {
    const body = (await req.json()) as { directive?: unknown };
    if (typeof body.directive === "string") {
      directive = body.directive;
    }
  } catch {
    // No/invalid body — fall back to the default directive.
  }
  return handle(directive);
}
