import type { AgentEvent } from "@/lib/types";
import type { CyberSfx } from "@/lib/useCyberSound";

/**
 * Decide which synthesized sound (if any) a streamed agent event should play.
 * Returning null means "stay silent" for that event.
 */
export function sfxForEvent(event: AgentEvent): CyberSfx | null {
  if (event.phase === "complete") return "complete";
  if (event.level === "error") return "error";

  // A node switching to "active" is the most audible transition.
  if (event.nodeStatus === "active") {
    return event.phase === "tool_call" ? "tool" : "node";
  }

  // A node completing gets a pleasant confirmation chime.
  if (event.nodeStatus === "done") return "success";

  return null;
}
