/**
 * Shared types for the NecroCode Visual Agent Studio.
 * Used by both the SSE API route (server) and the UI (client).
 */

export type AgentPhase =
  | "idle"
  | "thinking"
  | "tool_call"
  | "executing"
  | "complete";

/** The four canonical workflow stages shown on the execution canvas. */
export type StageId =
  | "input_parsing"
  | "context_scanning"
  | "kiro_hook_trigger"
  | "code_generation";

export type NodeStatus = "pending" | "active" | "done" | "error";

/** Terminal log severities drive the color of each streamed line. */
export type LogLevel = "info" | "success" | "warn" | "error" | "system" | "code";

/** A single Server-Sent Event payload emitted by /api/agent/stream. */
export interface AgentEvent {
  /** Monotonic sequence number for ordering/debugging. */
  seq: number;
  /** High-level reasoning phase of the agent. */
  phase: AgentPhase;
  /** The workflow stage this event belongs to (null for lifecycle events). */
  stage: StageId | null;
  /** Status to apply to the stage node on the canvas. */
  nodeStatus: NodeStatus | null;
  /** Severity used to color the terminal line. */
  level: LogLevel;
  /** Human-readable terminal message. */
  message: string;
  /** 0..100 overall progress. */
  progress: number;
  /** ISO timestamp (server clock). */
  ts: string;
}

export interface StageDef {
  id: StageId;
  label: string;
  description: string;
}

/** Canonical ordered workflow definition — single source of truth. */
export const WORKFLOW_STAGES: StageDef[] = [
  {
    id: "input_parsing",
    label: "Input Parsing",
    description: "Tokenize the directive & extract intent vectors.",
  },
  {
    id: "context_scanning",
    label: "Context Scanning",
    description: "Scan repository graph & steering context.",
  },
  {
    id: "kiro_hook_trigger",
    label: "Kiro Hook Trigger",
    description: "Fire configured .kiro hooks on matched events.",
  },
  {
    id: "code_generation",
    label: "Code Generation",
    description: "Synthesize, validate & emit TypeScript-safe code.",
  },
];
