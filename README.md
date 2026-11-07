<!-- ╔══════════════════════════════════════════════════════════════════════╗ -->
<!-- ║                        N E C R O C O D E                             ║ -->
<!-- ╚══════════════════════════════════════════════════════════════════════╝ -->

<div align="center">

```
 ███╗   ██╗███████╗ ██████╗██████╗  ██████╗  ██████╗ ██████╗ ██████╗ ███████╗
 ████╗  ██║██╔════╝██╔════╝██╔══██╗██╔═══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
 ██╔██╗ ██║█████╗  ██║     ██████╔╝██║   ██║██║     ██║   ██║██║  ██║█████╗
 ██║╚██╗██║██╔══╝  ██║     ██╔══██╗██║   ██║██║     ██║   ██║██║  ██║██╔══╝
 ██║ ╚████║███████╗╚██████╗██║  ██║╚██████╔╝╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═╝  ╚═══╝╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
```

### 🕯️ Cyberpunk AI **Visual Agent Studio** 🕯️

**`» summon the machine spirit · watch it reason · exorcise the legacy code «`**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Built with Kiro](https://img.shields.io/badge/Built_with-Kiro-A855F7?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-ready-00F0FF?style=for-the-badge&logo=vercel&logoColor=black)

**🏆 Submitted to Kiroween 2026 · UI/UX Track (Costume Contest)**

</div>

---

> **NecroCode** is a neon, dark-themed HUD that visualizes an AI agent reasoning
> through a live workflow —
> **Input Parsing → Context Scanning → Kiro Hook Trigger → Code Generation** —
> streaming its thoughts into a translucent cyberpunk terminal while glowing
> nodes illuminate across an animated execution canvas.
>
> One click of **Run Agent Exorcism** opens a real-time Server-Sent Events
> stream: borders pulse, neon trails flow between nodes, synthesized Web Audio
> blips fire on each transition, and generated code streams in line-by-line —
> all with **zero layout shift** and **zero external setup**.

---

## ✨ Features

| | |
| --- | --- |
| 🎛️ **Multi-pane HUD** | Left control panel · center execution canvas · right streaming terminal — fully responsive, collapses gracefully on mobile. |
| 📡 **Real-time SSE** | Agent reasoning streamed as `idle · thinking · tool_call · executing · complete` from a Next.js route handler. |
| 💫 **Micro-interactions** | Pulsing glow borders on the active stage, neon trails flowing between nodes, animated grid backdrop, CRT scanline overlay. |
| 🔊 **Cyber Sound FX** | Synthesized Web Audio blips per transition — **no audio assets**, fully toggleable (off by default). |
| 📋 **Quick-copy** | Copy generated code from the terminal with a glowing **"Copied!"** badge. |
| 🎨 **Neon glass design** | Electric blue `#00F0FF`, neon purple `#A855F7`, emerald `#10B981` on a deep navy/black base with glassmorphism. |
| 🧩 **Kiro-native** | Specs, Steering Docs, and Agent Hooks are first-class, committed artifacts that drive the architecture. |
| ☁️ **Zero setup** | The agent run is simulated server-side — no API keys, no secrets, no config. Deploys to Vercel as-is. |

---

## 🏛️ Architectural Overview

NecroCode is deliberately built **around Kiro's three core primitives** — Specs,
Steering Docs, and Agent Hooks — so the repository itself demonstrates a
Kiro-native workflow.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          NECROCODE  ·  HUD DASHBOARD                       │
│                                                                            │
│  ┌───────────────┐    ┌──────────────────────────┐    ┌────────────────┐  │
│  │ CONTROL PANEL │    │     EXECUTION CANVAS      │    │   TERMINAL     │  │
│  │ directive +   │    │  ⬡──▶⬡──▶⬡──▶⬡            │    │ live SSE logs  │  │
│  │ presets + run │    │  pulsing borders & trails │    │ + code + copy  │  │
│  └───────┬───────┘    └────────────▲─────────────┘    └───────▲────────┘  │
│          │                         │                          │           │
│          └──────────┬──────────────┴──────────────────────────┘           │
│                     │  useAgentStream()  (EventSource → UI state)          │
└─────────────────────┼──────────────────────────────────────────────────────┘
                      │  GET /api/agent/stream?directive=…
              ┌───────▼────────────────────────────────┐
              │  SSE Route Handler (text/event-stream)  │
              │  emits AgentEvent[] reasoning steps      │
              └─────────────────────────────────────────┘
```

### 🧠 Kiro Specs — _the blueprint_

[`.kiro/specs/visual-agent-studio.md`](.kiro/specs/visual-agent-studio.md)
formalizes the feature before a line of UI was written: the five agent **phases**,
the four workflow **stages**, the exact **SSE event contract** (`AgentEvent`),
and the **acceptance criteria**. The spec references the shared types file via
Kiro's file-link syntax (`#[[file:../../lib/types.ts]]`) so the contract stays a
single source of truth across server and client.

### 🧭 Steering Docs — _the guardrails_

[`.kiro/steering/project-rules.md`](.kiro/steering/project-rules.md) encodes the
**authoritative tech stack**, the **design system tokens**, the **HUD layout
contract**, and the **non-functional requirements** (responsive, accessible,
zero-error build). These rules are injected into every AI interaction in the
repo, keeping generated code consistent, typed, and deploy-ready.

### 🪝 Agent Hooks — _the triggers_

[`.kiro/hooks/agent-execution.json`](.kiro/hooks/agent-execution.json) defines
trigger hooks for each **visual stage transition**, mapped 1:1 to
`WORKFLOW_STAGES`. Each hook declares its target stage, agent phase, UI state
(`idle → scanning → processing → complete`), and the visual + audio effect to
apply (`pulse-border`, `neon-trail`, `complete-pulse` + synthesized SFX). The
**Kiro Hook Trigger** node on the canvas is a live visualization of this concept.

### 🔁 Runtime flow

1. The user enters a **directive** and clicks **Run Agent Exorcism**.
2. `lib/useAgentStream.ts` opens an `EventSource` to
   `GET /api/agent/stream?directive=…`.
3. The route handler ([`app/api/agent/stream/route.ts`](app/api/agent/stream/route.ts))
   streams a scripted sequence of `AgentEvent`s as `text/event-stream`.
4. Each event advances the progress bar, flips a canvas node
   `pending → active → done`, flows a neon trail to the next node, appends a
   color-coded terminal line, and (if enabled) fires a Web Audio blip.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
| --- | --- | --- |
| **Framework** | [Next.js 15](https://nextjs.org) (App Router) | Server components + route handlers for native SSE. |
| **Language** | TypeScript (`strict: true`) | Zero `any`, fully typed event contract. |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) | Design tokens + neon/glass utilities in `tailwind.config.ts`. |
| **Animation** | [Framer Motion 11](https://www.framer.com/motion/) | Node pulses, trail flows, badge pops, layout-stable transitions. |
| **Icons** | [lucide-react](https://lucide.dev) | Single, consistent icon source. |
| **Streaming** | **Server-Sent Events** | Real-time agent reasoning over a Node.js route handler. |
| **Audio** | **Web Audio API** | Synthesized SFX — no audio files shipped. |
| **Deploy** | [Vercel](https://vercel.com) | Zero-config, auto-detected Next.js. |

---

## 🚀 Local Setup & Installation

**Prerequisites:** Node.js **18.18+** (Node 20 or 22 recommended) and npm.

```bash
# 1 · Clone the repository
git clone https://github.com/<your-username>/necrocode.git
cd necrocode

# 2 · Install dependencies
npm install

# 3 · Start the dev server
npm run dev
#   → open http://localhost:3000

# 4 · Production build (optional)
npm run build && npm start
```

> **Tip:** click **Run Agent Exorcism** to start a run. Toggle **Cyber Sound FX**,
> **Scanlines**, and **Grid FX** in the top toolbar.

---

## 🗂️ Project Structure

```
app/
  api/agent/stream/route.ts     # SSE route — streams agent reasoning events
  globals.css                   # Tailwind + neon/glass design helpers
  layout.tsx                    # Root layout & metadata
  page.tsx                      # HUD dashboard (assembles the 3 panes + toggles)
components/
  AgentCanvas.tsx               # Center canvas — nodes, pulsing borders, neon trails
  ControlPanel.tsx              # Left panel — directive, presets, progress, run
  Terminal.tsx                  # Right terminal — logs, code, quick-copy badge
  NeonButton.tsx                # Glowing animated action button
  StatusPill.tsx                # Live agent-phase indicator
  ToggleButton.tsx              # Sound / scanline / grid toggle control
lib/
  types.ts                      # Shared types + WORKFLOW_STAGES (single source of truth)
  presets.ts                    # Preset workflow directives
  useAgentStream.ts             # Client hook: EventSource → UI state
  useCyberSound.ts              # Web Audio SFX engine (synth, no assets)
  sfxMap.ts                     # Maps AgentEvent → sound effect
  useUiSettings.ts              # Sound / scanline / grid toggle state
.kiro/
  specs/visual-agent-studio.md  # 📋 Spec — phases, stages, SSE contract
  steering/project-rules.md     # 🧭 Steering — stack, design, NFRs
  hooks/agent-execution.json    # 🪝 Hooks — stage-transition triggers
docs/
  DEVPOST.md                    # 🏆 Hackathon submission story + video script
```

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — framework auto-detects
   as **Next.js**.
3. No environment variables required. Click **Deploy**.

---

## 🏆 Kiroween 2026 Submission

See [`docs/DEVPOST.md`](docs/DEVPOST.md) for the full submission story
(Inspiration · What it does · How we built it with Kiro · Challenges ·
Accomplishments · What's next) and the timestamped **3-minute demo video script**.

---

## 📄 License

Released under the [MIT License](LICENSE) — summon responsibly. 🕯️

<div align="center">

**`« NecroCode — where legacy code goes to be reborn »`**

</div>
