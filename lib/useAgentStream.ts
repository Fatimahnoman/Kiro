"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AgentEvent,
  type AgentPhase,
  type NodeStatus,
  type StageId,
  WORKFLOW_STAGES,
} from "@/lib/types";

export type NodeStatusMap = Record<StageId, NodeStatus>;

export interface AgentStreamState {
  phase: AgentPhase;
  progress: number;
  running: boolean;
  logs: AgentEvent[];
  nodes: NodeStatusMap;
  activeStage: StageId | null;
  bugCount: number;
  error: string | null;
}

function initialNodes(): NodeStatusMap {
  return WORKFLOW_STAGES.reduce((acc, s) => {
    acc[s.id] = "pending";
    return acc;
  }, {} as NodeStatusMap);
}

const INITIAL: AgentStreamState = {
  phase: "idle",
  progress: 0,
  running: false,
  logs: [],
  nodes: initialNodes(),
  activeStage: null,
  bugCount: 0,
  error: null,
};

/**
 * Drives a run against /api/agent/stream using the browser's native
 * EventSource, mapping each AgentEvent into UI state (nodes, logs, progress).
 */
export function useAgentStream() {
  const [state, setState] = useState<AgentStreamState>(INITIAL);
  const sourceRef = useRef<EventSource | null>(null);

  const close = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    close();
    setState({ ...INITIAL, nodes: initialNodes() });
  }, [close]);

  const run = useCallback(
    (code: string) => {
      // Always start from a clean slate so re-runs are safe.
      close();
      setState({
        ...INITIAL,
        nodes: initialNodes(),
        running: true,
        phase: "summoning",
      });

      const url = `/api/agent/stream?code=${encodeURIComponent(code)}`;
      const es = new EventSource(url);
      sourceRef.current = es;

      es.addEventListener("agent", (evt: MessageEvent<string>) => {
        let data: AgentEvent;
        try {
          data = JSON.parse(evt.data) as AgentEvent;
        } catch {
          return;
        }

        setState((prev) => {
          const nodes = { ...prev.nodes };
          if (data.stage && data.nodeStatus) {
            nodes[data.stage] = data.nodeStatus;
          }
          const activeStage =
            data.nodeStatus === "active" || data.nodeStatus === "haunted"
              ? data.stage
              : prev.activeStage;

          const done = data.phase === "complete";

          return {
            ...prev,
            phase: data.phase,
            progress: data.progress,
            logs: [...prev.logs, data],
            nodes,
            activeStage: done ? null : activeStage,
            bugCount: data.bugCount,
            running: !done,
          };
        });

        if (data.phase === "complete") {
          close();
        }
      });

      es.onerror = () => {
        setState((prev) => {
          if (prev.phase === "complete" || !prev.running) return prev;
          return {
            ...prev,
            running: false,
            error: "Séance interrupted — the connection to the spirit realm was severed.",
          };
        });
        close();
      };
    },
    [close],
  );

  useEffect(() => close, [close]);

  return { state, run, reset };
}
