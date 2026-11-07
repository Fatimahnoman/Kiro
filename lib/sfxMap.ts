import type { AgentEvent } from "@/lib/types";
import type { CyberSfx } from "@/lib/useCyberSound";

/**
 * Decide which synthesized sound (if any) a streamed agent event should play.
 * Returning null means "stay silent" for that event.
 */
export function sfxForEvent(event: AgentEvent): CyberSfx | null {
  if (event.phase === "complete") return "complete";

  // A newly reported bug gets the ominous haunting sting.
  if (event.bug && event.nodeStatus === "haunted") return "haunt";
  if (event.level === "error") return "error";

  // A node completing / cleansed gets a confirmation chime.
  if (event.nodeStatus === "cleansed") return "success";

  // A node switching to active is an audible transition.
  if (event.nodeStatus === "active") return "node";

  return null;
}
