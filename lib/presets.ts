import type { LucideIcon } from "lucide-react";
import { Bug, Ghost, Rocket, ScanLine, Wand2 } from "lucide-react";

/** Preset workflow directives surfaced in the left control panel. */
export interface WorkflowPreset {
  id: string;
  label: string;
  directive: string;
  icon: LucideIcon;
  accent: "blue" | "purple" | "green";
}

export const WORKFLOW_PRESETS: WorkflowPreset[] = [
  {
    id: "exorcism",
    label: "Agent Exorcism",
    directive: "Purge legacy spaghetti and regenerate a clean, typed module.",
    icon: Ghost,
    accent: "purple",
  },
  {
    id: "scaffold",
    label: "Scaffold Feature",
    directive: "Scaffold a new feature slice with route, component, and tests.",
    icon: Rocket,
    accent: "blue",
  },
  {
    id: "bughunt",
    label: "Bug Hunt",
    directive: "Trace the failing path and emit a minimal, verified fix.",
    icon: Bug,
    accent: "green",
  },
  {
    id: "audit",
    label: "Context Audit",
    directive: "Scan the repository graph and report drift from steering rules.",
    icon: ScanLine,
    accent: "blue",
  },
  {
    id: "refactor",
    label: "Refactor Spell",
    directive: "Refactor the selected surface for clarity without behavior change.",
    icon: Wand2,
    accent: "purple",
  },
];
