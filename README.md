# 🕯️ NecroCode — Cyberpunk AI Visual Agent Studio

> A neon, dark-themed HUD that visualizes an AI agent reasoning through a live
> workflow — **Input Parsing → Context Scanning → Kiro Hook Trigger → Code
> Generation** — streaming its thoughts to a translucent terminal while glowing
> nodes illuminate across an execution canvas.

Built with **Next.js 15 (App Router)**, **Tailwind CSS**, **Framer Motion**,
**lucide-react**, and real-time **Server-Sent Events (SSE)**.

![stack](https://img.shields.io/badge/Next.js-15-black) ![ts](https://img.shields.io/badge/TypeScript-strict-blue) ![deploy](https://img.shields.io/badge/Vercel-ready-00F0FF)

---

## ✨ Features

- **Multi-pane responsive HUD dashboard**
  - **Left** — Agent Control Panel with directive input & preset workflows.
  - **Center** — Live animated Execution Canvas with glowing Framer-Motion nodes.
  - **Right** — Translucent cyberpunk terminal streaming live logs & code output.
- **Real-time SSE streaming** of agent reasoning phases: `idle · thinking ·
  tool_call · executing · complete`.
- **One-click "Run Agent Exorcism"** button with animated neon glow that triggers
  node highlighting and step-by-step terminal output.
- **Glassmorphism + neon** design system (electric blue `#00F0FF`, neon purple
  `#A855F7`, emerald success `#10B981`) on a deep navy/black base.
- **Rich micro-interactions**
  - Pulsing glow borders on the active stage; neon trails flow between nodes.
  - Animated cyberpunk grid backdrop + CRT scanline overlay — both toggleable.
  - **Cyber Sound FX** — synthesized Web Audio blips on node transitions
    (no audio files, fully toggleable, off by default).
  - Quick-copy of generated code with a glowing **"Copied!"** badge.
  - Zero layout shift across `Idle → Scanning → Processing → Complete`.
- **Zero external setup** — the agent run is simulated server-side, so there are
  no API keys, secrets, or config required. Deploys to Vercel as-is.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the studio
# → http://localhost:3000

# Production build
npm run build && npm start
```

> Requires Node.js 18.18+ (Node 20/22 recommended).

---

## 🧠 How It Works

1. The browser opens an `EventSource` to `GET /api/agent/stream?directive=…`.
2. The route handler (`app/api/agent/stream/route.ts`) streams a scripted
   sequence of `AgentEvent`s as `text/event-stream`.
3. `lib/useAgentStream.ts` maps each event into UI state: node status, terminal
   lines, and a progress bar.
4. The canvas lights nodes `pending → active → done`; the terminal auto-scrolls.

The event contract and workflow stages are a single source of truth in
[`lib/types.ts`](./lib/types.ts).

---

## 🗂️ Project Structure

```
app/
  api/agent/stream/route.ts   # SSE route — streams agent reasoning events
  globals.css                 # Tailwind + neon/glass design helpers
  layout.tsx                  # Root layout & metadata
  page.tsx                    # HUD dashboard (assembles the 3 panes)
components/
  AgentCanvas.tsx             # Center execution canvas + animated nodes
  ControlPanel.tsx            # Left control panel & presets
  Terminal.tsx                # Right cyberpunk terminal
  NeonButton.tsx              # Glowing animated button
  StatusPill.tsx              # Live phase indicator
lib/
  types.ts                    # Shared types + WORKFLOW_STAGES
  presets.ts                  # Preset workflow directives
  useAgentStream.ts           # Client hook: EventSource → UI state
.kiro/
  steering/project-rules.md   # Architecture & tech-stack guidelines
  specs/visual-agent-studio.md# Workflow execution spec
```

---

## ⚡ Kiro Integration

- `.kiro/steering/project-rules.md` — architecture guidelines & authoritative
  tech stack applied to all AI interactions in this repo.
- `.kiro/specs/visual-agent-studio.md` — the workflow execution spec (phases,
  stages, SSE event contract, acceptance criteria).

The **Kiro Hook Trigger** stage in the canvas mirrors how Kiro fires configured
`.kiro` hooks during a run.

---

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new) — framework auto-detects as
   **Next.js**.
3. No environment variables needed. Click **Deploy**.

---

## 📄 License

MIT — summon responsibly. 🕯️
