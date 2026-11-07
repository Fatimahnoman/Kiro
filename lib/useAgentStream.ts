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
    (directive: string) => {
      // Always start from a clean slate so re-runs are safe.
      close();
      setState({
        ...INITIAL,
        nodes: initialNodes(),
        running: true,
        phase: "thinking",
      });

      const url = `/api/agent/stream?directive=${encodeURIComponent(directive)}`;
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
            data.nodeStatus === "active" ? data.stage : prev.activeStage;

          const done = data.phase === "complete";

          return {
            ...prev,
            phase: data.phase,
            progress: data.progress,
            logs: [...prev.logs, data],
            nodes,
            activeStage: done ? null : activeStage,
            running: !done,
          };
        });

        if (data.phase === "complete") {
          close();
        }
      });

      es.onerror = () => {
        // EventSource auto-reconnects by default; for a scripted finite stream
        // we treat an error after close as benign, but surface a live failure.
        setState((prev) => {
          if (prev.phase === "complete" || !prev.running) return prev;
          return {
            ...prev,
            running: false,
            error: "Stream interrupted — connection to agent core lost.",
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
