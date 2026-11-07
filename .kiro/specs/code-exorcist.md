# Spec — Code Exorcist

Status: **Implemented**
Owner: NecroCode
Theme steering: `#[[file:../steering/horror-rules.md]]`
Shared types: `#[[file:../../lib/types.ts]]`
Analyzer: `#[[file:../../lib/exorcist.ts]]`

## 1. Overview

The **Code Exorcist** lets a user paste a "cursed" JavaScript / TypeScript
snippet and run a **bug exorcism**. The frontend opens a Server-Sent Events
stream to `app/api/agent/stream/route.ts`, which performs a **real static
analysis** (no LLM, no external calls) of the submitted code, streams the
exorcist's reasoning step-by-step, highlights the haunted node graph, and emits
the purified clean code into the gothic terminal.

## 2. Agent Phases

| Phase        | Meaning                                                   |
| ------------ | --------------------------------------------------------- |
| `idle`       | Dormant — no séance in progress.                          |
| `summoning`  | Receiving & parsing the submitted snippet.                |
| `scanning`   | The Glitch Scanner hunts for syntax/logic demons.         |
| `exorcising` | Reasoning about each haunting and banishing it.           |
| `complete`   | The crypt rests — clean code emitted.                     |

## 3. Exorcism Stages (Haunted Node Graph)

Four ordered nodes, mapped 1:1 to `WORKFLOW_STAGES`:

1. **Input Code** (`input_code`) — receive & parse the cursed snippet.
2. **Glitch Scanner** (`glitch_scanner`) — detect hauntings. Node goes
   `haunted` (red pulse) if any bug is found.
3. **Exorcism Reasoning** (`exorcism_reasoning`) — explain & apply each fix.
4. **Clean Code Output** (`clean_output`) — stream the purified code.

Node lifecycle (`NodeStatus`): `pending → active → haunted → cleansed` (or
`error`). `haunted` renders blood-red and pulses; `cleansed` renders spectral.

## 4. Detected Hauntings (real analyzer)

`lib/exorcist.ts` detects and fixes:

| Rule                       | Severity | Fix                                        |
| -------------------------- | -------- | ------------------------------------------ |
| `loose-equality`           | logic    | `==`/`!=` → `===`/`!==`                     |
| `assignment-in-condition`  | logic    | `if (x = y)` → `if (x === y)`               |
| `no-var`                   | smell    | `var` → `let`                              |
| `no-console`               | smell    | comment out stray `console.log`/`.debug`   |
| `missing-semicolon`        | syntax   | append `;` to simple statements            |
| `unbalanced-brackets`      | syntax   | flag mismatched/unclosed brackets          |

String and comment contents are masked before matching to avoid false hits.

## 5. Event Contract (SSE)

Each SSE message uses event name `agent` with a JSON `AgentEvent`:

```ts
interface AgentEvent {
  seq: number;              // ordering
  phase: AgentPhase;        // lifecycle phase
  stage: StageId | null;    // which node (null for lifecycle events)
  nodeStatus: NodeStatus | null;
  level: LogLevel;          // terminal line color
  message: string;          // terminal text
  bug: boolean;             // true when reporting a detected bug
  bugCount: number;         // running total of hauntings
  progress: number;         // 0..100 overall
  ts: string;               // ISO timestamp
}
```

Request: `GET /api/agent/stream?code=<encoded>` (or `POST { code }`).
Transport headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`,
`Connection: keep-alive`, `X-Accel-Buffering: no`.

## 6. Acceptance Criteria

- [x] Pasting real JS/TS and running streams genuine, analyzer-backed findings.
- [x] Glitch Scanner node pulses **blood-red** when bugs are detected.
- [x] Nodes transition to **spectral** (`cleansed`) once fixed.
- [x] The exact fixed code streams into the terminal and is copyable.
- [x] A clean snippet reports "no hauntings" and goes straight to cleansed.
- [x] Bug counter reflects the real number of detected hauntings.
- [x] Zero layout shift across all phases; builds with zero TS errors.
