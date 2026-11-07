/**
 * Shared types for the NecroCode "Code Exorcist" Visual Agent Studio.
 * Used by both the SSE API route (server) and the UI (client).
 */

export type AgentPhase =
  | "idle"
  | "summoning" // reading / parsing the submitted code
  | "scanning" // hunting for bugs (the glitch scanner)
  | "exorcising" // reasoning about + fixing each bug
  | "complete";

/** The four canonical exorcism stages shown on the haunted node graph. */
export type StageId =
  | "input_code"
  | "glitch_scanner"
  | "exorcism_reasoning"
  | "clean_output";

/**
 * Node lifecycle:
 *  - pending   : not reached yet
 *  - active    : currently working
 *  - haunted   : bug(s) detected here — pulses blood-red
 *  - cleansed  : finished successfully — spectral green/purple
 *  - error     : hard failure
 */
export type NodeStatus = "pending" | "active" | "haunted" | "cleansed" | "error";

/** Terminal log severities drive the color of each streamed line. */
export type LogLevel =
  | "info"
  | "success"
  | "warn"
  | "error"
  | "system"
  | "code"
  | "haunt"; // spooky narrative lines

/** A single Server-Sent Event payload emitted by /api/agent/stream. */
export interface AgentEvent {
  /** Monotonic sequence number for ordering/debugging. */
  seq: number;
  /** High-level reasoning phase of the agent. */
  phase: AgentPhase;
  /** The exorcism stage this event belongs to (null for lifecycle events). */
  stage: StageId | null;
  /** Status to apply to the stage node on the canvas. */
  nodeStatus: NodeStatus | null;
  /** Severity used to color the terminal line. */
  level: LogLevel;
  /** Human-readable terminal message. */
  message: string;
  /** True when this event reports a detected bug (drives red pulses). */
  bug: boolean;
  /** Running count of bugs detected so far. */
  bugCount: number;
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

/** Canonical ordered exorcism definition — single source of truth. */
export const WORKFLOW_STAGES: StageDef[] = [
  {
    id: "input_code",
    label: "Input Code",
    description: "Receive the cursed snippet & parse its structure.",
  },
  {
    id: "glitch_scanner",
    label: "Glitch Scanner",
    description: "Hunt the code for syntax & logic demons.",
  },
  {
    id: "exorcism_reasoning",
    label: "Exorcism Reasoning",
    description: "Reason about each haunting & banish it.",
  },
  {
    id: "clean_output",
    label: "Clean Code Output",
    description: "Emit the purified, mortal-safe code.",
  },
];
