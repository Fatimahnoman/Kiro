# Spec — Visual Agent Studio

Status: **Implemented**
Owner: NecroCode
Related steering: `#[[file:../steering/project-rules.md]]`
Shared types: `#[[file:../../lib/types.ts]]`

## 1. Overview

The Visual Agent Studio renders a live, animated representation of an AI agent
executing a workflow. A user triggers a run (the **"Run Agent Exorcism"**
button); the frontend opens a Server-Sent Events stream to
`app/api/agent/stream/route.ts`, which emits a scripted sequence of reasoning
events. Each event advances a progress bar, highlights a node on the execution
canvas, and appends a color-coded line to the cyberpunk terminal.

## 2. Agent Reasoning Phases

The agent moves through five lifecycle phases (`AgentPhase`):

| Phase        | Meaning                                                   |
| ------------ | --------------------------------------------------------- |
| `idle`       | Runtime online, no active work.                           |
| `thinking`   | Planning / reasoning about the directive.                 |
| `tool_call`  | Invoking a tool (repo scan, hook matcher, etc.).          |
| `executing`  | Performing work and producing output.                     |
| `complete`   | Workflow finished successfully.                           |

## 3. Workflow Execution Stages

Four ordered stages are visualized as nodes on the canvas. These map 1:1 to
`WORKFLOW_STAGES` in `lib/types.ts`.

1. **Input Parsing** (`input_parsing`)
   - Tokenize the directive, resolve the intent vector.
   - Exit: tokens parsed, 0 ambiguities.
2. **Context Scanning** (`context_scanning`)
   - Tool call: `scan_repository_graph()`; index files, steering rules, specs.
   - May emit warnings (e.g. stale embeddings) and recover.
   - Exit: context graph assembled.
3. **Kiro Hook Trigger** (`kiro_hook_trigger`)
   - Match event → fire configured `.kiro` hooks (e.g. `PreToolUse`).
   - Exit: hooks executed with exit code 0.
4. **Code Generation** (`code_generation`)
   - Synthesize TypeScript, stream code lines, typecheck.
   - Exit: artifact emitted, 0 warnings.

Each node carries a `NodeStatus`: `pending → active → done` (or `error`).

## 4. Event Contract (SSE)

Each SSE message uses event name `agent` with a JSON `AgentEvent` payload:

```ts
interface AgentEvent {
  seq: number;              // ordering
  phase: AgentPhase;        // lifecycle phase
  stage: StageId | null;    // which node (null for lifecycle events)
  nodeStatus: NodeStatus | null;
  level: LogLevel;          // terminal line color
  message: string;          // terminal text
  progress: number;         // 0..100 overall
  ts: string;               // ISO timestamp
}
```

Transport headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`,
`Connection: keep-alive`, `X-Accel-Buffering: no`.

## 5. Acceptance Criteria

- [x] Clicking **Execute Workflow** streams events end-to-end.
- [x] Canvas nodes transition `pending → active → done` in order.
- [x] Terminal appends color-coded lines and auto-scrolls.
- [x] Progress bar reaches 100% on `complete`.
- [x] Re-running resets canvas + terminal cleanly.
- [x] Builds with zero TypeScript errors; deploys to Vercel with no setup.

## 6. Visual Polish & Micro-interactions

- [x] **Pulsing glow borders** on the active stage node (`animate-border-pulse`).
- [x] **Neon trail effects** along connectors that flow while handing off from a
      completed node to the next active node (`animate-trail-flow`).
- [x] **Animated cyberpunk grid** backdrop (`animate-grid-drift`), toggleable.
- [x] **CRT scanline overlay** on the terminal, toggleable.
- [x] **Cyber Sound FX** — synthesized Web Audio blips per node/tool/success/
      complete/error/copy event, fully toggleable (off by default).
- [x] **Quick-copy** of generated code lines with a glowing "Copied!" badge.
- [x] **Zero layout shift** across `Idle → Scanning → Processing → Complete`:
      the node status slot is a fixed 1rem square and transitions animate only
      `box-shadow`, `border-color`, and `transform`.

The visual stage-transition contract is documented as trigger hooks in
`#[[file:../hooks/agent-execution.json]]`.
