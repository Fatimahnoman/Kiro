# NecroCode — Project Rules & Architecture Guidelines

> Steering context for all AI interactions within this repository.
> These rules keep NecroCode clean, typed, and deploy-ready at all times.

## Mission

NecroCode is a **Cyberpunk Dark-Themed AI Visual Agent Studio** — a multi-pane
HUD dashboard that visualizes an AI agent reasoning through a workflow in real
time, streaming its thoughts to a translucent terminal while glowing nodes light
up across an execution canvas.

## Tech Stack (authoritative)

| Layer          | Choice                                   | Notes                                     |
| -------------- | ---------------------------------------- | ----------------------------------------- |
| Framework      | **Next.js 15** (App Router)              | Server + client components, route handlers |
| Language       | **TypeScript** (`strict: true`)          | No `any`; all public functions typed      |
| Styling        | **Tailwind CSS 3**                       | Design tokens live in `tailwind.config.ts` |
| Animation      | **Framer Motion**                        | Canvas nodes, buttons, transitions        |
| Icons          | **lucide-react**                         | Single icon source — no inline SVG icons  |
| Streaming      | **Server-Sent Events** via route handler | `app/api/agent/stream/route.ts`           |
| Runtime        | **Node.js** (route runtime)              | Deploy target: Vercel                     |

## Design System

- **Background:** deep dark navy/black — `#080B13` (`void`), `#0D111D` (`abyss`),
  `#0F1524` (`panel`). Use glassmorphism (`.glass` / `.glass-strong`) for panes.
- **Accents:** Electric Blue `#00F0FF` (`neon.blue`), Neon Purple `#A855F7`
  (`neon.purple`), Emerald Green `#10B981` (`neon.green`, used for success/complete).
- **Glow:** prefer the `shadow-glow-*` utilities and `.text-glow-*` helpers over
  ad-hoc box-shadows so glow stays consistent.
- **Typography:** monospace for terminal/HUD readouts, sans for prose.

## Layout Contract (HUD)

A three-pane responsive dashboard:

1. **Left Sidebar** — Agent Control Panel & Preset Workflows.
2. **Center** — Live animated Agent Execution Canvas (4 ordered nodes).
3. **Right Sidebar** — Translucent cyberpunk terminal streaming live logs.

The canonical, ordered workflow stages are the **single source of truth** in
`lib/types.ts` → `WORKFLOW_STAGES`:
`Input Parsing → Context Scanning → Kiro Hook Trigger → Code Generation`.

## Coding Conventions

- Shared types live in `lib/types.ts` and are imported by both server and client.
- Client components are marked with `"use client"`; keep them lean.
- The SSE route must set `dynamic = "force-dynamic"` and stream with proper
  `text/event-stream` headers — never cache it.
- No external network calls at runtime: the agent run is **simulated** server-side
  so the app deploys with zero configuration or secrets.
- Keep the project installable + buildable with `npm install && npm run build`
  with **zero errors** — this is a hard requirement.

## Non-Functional Requirements

- **Responsive:** panes collapse gracefully on mobile (stacked) and expand on `lg+`.
- **Accessible:** interactive controls are real `<button>`s with labels.
- **Resilient:** the UI handles SSE disconnects and lets the user re-run safely.
