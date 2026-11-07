# 🕯️ NecroCode — Kiroween 2026 Devpost Submission

> **Cyberpunk AI Visual Agent Studio** · UI/UX Track (Costume Contest)
> Built with **Kiro** · Next.js 15 · Tailwind CSS · Framer Motion · SSE

| | |
| --- | --- |
| **Tagline** | Summon the machine spirit, watch it reason, and exorcise your legacy code. |
| **Track** | UI/UX (Costume Contest) |
| **Built with** | Kiro (Specs · Steering · Hooks), Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Web Audio API, Server-Sent Events |
| **Try it** | `npm install && npm run dev` → http://localhost:3000 |

---

## 💡 Inspiration

AI agents are everywhere, but their reasoning is almost always **invisible** —
a spinner, then an answer. We wanted to rip the cover off and make an agent's
inner monologue a **spectacle**: something you could *watch*, *hear*, and *feel*.

Kiroween's costume-contest energy pushed us toward a full cyberpunk "digital
séance" theme — the idea that running an agent is a kind of **exorcism**: you
feed it a cursed, legacy directive and it reasons its way to clean, reborn code.
Hence **NecroCode**, and its signature button: **Run Agent Exorcism**.

We also wanted the project to be a genuine showcase of a **Kiro-native
workflow** — not just an app built with an AI assistant, but an app whose
architecture is literally shaped by Kiro's **Specs**, **Steering Docs**, and
**Agent Hooks**.

---

## 🎛️ What it does

NecroCode is a responsive multi-pane HUD dashboard that visualizes an AI agent
executing a workflow in real time:

- **Left — Agent Control Panel.** Enter a directive or pick a preset workflow,
  then launch it with the glowing **Run Agent Exorcism** button. A live status
  pill and progress bar track the run.
- **Center — Execution Canvas.** Four glowing nodes —
  **Input Parsing → Context Scanning → Kiro Hook Trigger → Code Generation** —
  light up `pending → active → done`. The active node's border **pulses**, and a
  **neon trail** of light flows along the connector into the next node.
- **Right — Cyberpunk Terminal.** A translucent, CRT-scanlined terminal streams
  color-coded reasoning logs line-by-line, including the generated code, with a
  one-click **copy** button and a glowing **"Copied!"** badge.

Across the top, three toggles — **Cyber Sound FX**, **Scanlines**, and
**Grid FX** — let you tune the vibe. Sound FX are fully synthesized with the Web
Audio API (no audio files), firing subtle blips on each node transition.

Everything runs on a real **Server-Sent Events** stream and transitions with
**zero layout shift**, from `Idle → Scanning → Processing → Complete`.

---

## 🛠️ How we built it with Kiro

We leaned on all three of Kiro's core primitives, and committed them to the repo
as first-class artifacts:

### 📋 Specs — we designed before we built

We started in `.kiro/specs/code-exorcist.md`, formalizing the **five exorcist
phases**, **four exorcism stages**, the detected **hauntings**, and — crucially —
the exact **SSE event contract** (`AgentEvent`). The spec links to the shared
`lib/types.ts` and the `lib/exorcist.ts` analyzer via Kiro's
`#[[file:…]]` syntax, so the contract is a single source of truth that both the
server route and the React client import. This meant the backend and frontend
never drifted.

### 🧭 Steering Docs — we kept Kiro on-brand

`.kiro/steering/horror-rules.md` encodes the **haunted cyber-gothic theme**, the
**authoritative palette** (`#EF4444`, `#9333EA`, `#06B6D4`, `#10B981`), the **HUD
layout contract**, and hard **non-functional requirements** — strict TypeScript, full
responsiveness, and a zero-error build. Because steering is injected into every
interaction, Kiro consistently produced code that matched our design system
without us re-explaining it each turn.

### 🪝 Agent Hooks — we modeled the transitions

`.kiro/hooks/agent-execution.json` defines a trigger hook per visual stage
transition, each mapped to a `WORKFLOW_STAGES` entry and declaring its UI state
(`idle → scanning → processing → complete`) and its visual + audio effect
(`pulse-border`, `neon-trail`, `complete-pulse`). The **Kiro Hook Trigger** node
on the canvas is a direct, playful visualization of this very concept.

### ⚙️ Implementation

With the spec and steering in place, Kiro scaffolded the Next.js 15 App Router
project, the SSE route handler (`app/api/agent/stream/route.ts`), the
`useAgentStream` hook wrapping the browser's native `EventSource`, the
Framer-Motion canvas, and the Web Audio SFX engine — iterating pane by pane and
polishing the micro-interactions last.

---

## 🧗 Challenges we ran into

- **Streaming without a backend service.** We wanted a *real* real-time feel but
  **zero external setup** for judges. The fix: a self-contained SSE route handler
  that scripts the agent run server-side — genuinely streamed, but with no API
  keys, secrets, or third-party services.
- **Zero layout shift.** Swapping a spinner for a checkmark, or a node going
  active, kept nudging the layout. We solved it by reserving a fixed-size status
  slot and animating **only** `box-shadow`, `border-color`, and `transform`.
- **Audio that respects the browser.** Autoplay policies block sound until a user
  gesture. We built a lazy `AudioContext` that initializes on first interaction,
  resumes if suspended, and defaults the whole feature to **off**.
- **Dependency sanity for a clean deploy.** We pinned a stable Next.js 15 +
  React 19 combination and verified every file type-checks, so
  `npm install && npm run build` succeeds with zero errors on a fresh machine.

---

## 🏆 Accomplishments that we're proud of

- A genuinely **cinematic** agent-reasoning visualization — pulsing borders,
  flowing neon trails, synthesized audio — that still feels fast and smooth.
- **Fully synthesized sound design** with the Web Audio API: not a single audio
  file ships with the project.
- A repository that is a **living example of a Kiro-native workflow** — Specs,
  Steering, and Hooks are all real, committed, and load-bearing.
- **Zero-config deploy**: clone, install, run — or push to Vercel and it just
  works, no secrets required.
- Strict TypeScript throughout, responsive from mobile to ultrawide, with
  **zero layout shift** across every state transition.

---

## 🔮 What's next for NecroCode

- **Live model backend.** Swap the scripted SSE for a real LLM agent loop,
  streaming actual tool calls and generated diffs.
- **Pluggable workflows.** Let users define their own stages/nodes via a schema,
  so the canvas adapts to any agent pipeline.
- **Real Kiro hook execution.** Wire `agent-execution.json` to fire genuine Kiro
  hooks and surface their output in the terminal.
- **Replay & share.** Record a run and generate a shareable, replayable link of
  the agent "exorcism."
- **Theme packs.** Additional costume themes beyond cyberpunk — because it's a
  costume contest, after all. 🎃

---

## 🎬 3-Minute Demo Video Script

> **Total runtime target: ~3:00.** Timestamps are cumulative. Keep the screen
> recording at 1080p; enable **Cyber Sound FX** before recording so transitions
> are audible. Suggested tone: confident, playful, a little spooky.

### `0:00 – 0:20` — Cold open / hook

- **On screen:** The full NecroCode HUD at rest, neon grid drifting, scanlines
  glowing on the terminal.
- **Narration:** "Most AI agents hide their thinking behind a spinner. NecroCode
  rips the cover off. This is a cyberpunk visual agent studio — built entirely
  with Kiro — where you can *watch* an agent reason, in real time."

### `0:20 – 0:45` — The three panes

- **On screen:** Slowly mouse across left → center → right.
- **Narration:** "Three panes. On the left, the agent control panel — your
  directive and preset workflows. In the center, the live execution canvas. And
  on the right, a streaming cyberpunk terminal. Let's run an exorcism."

### `0:45 – 1:25` — Run the agent (the money shot)

- **On screen:** Click **Run Agent Exorcism**. Let the full run play: nodes light
  up one by one, borders pulse, neon trails flow, the terminal streams logs and
  code, SFX blip on each transition, progress bar fills to 100%.
- **Narration:** "One click opens a real Server-Sent Events stream. Watch each
  stage ignite — Input Parsing, Context Scanning, the Kiro Hook Trigger, and
  Code Generation. The active node pulses, a neon trail flows to the next, and
  every transition fires a synthesized Web Audio blip — no audio files, all
  code. The terminal streams the agent's reasoning and the generated module,
  line by line."

### `1:25 – 1:45` — Interactive polish

- **On screen:** Toggle **Scanlines** and **Grid FX** off/on; click the terminal
  **Copy** button and show the glowing **"Copied!"** badge.
- **Narration:** "Everything's tunable — scanlines, the animated grid, and the
  sound engine. Generated code copies in one click, with a glowing confirmation.
  And every transition is zero-layout-shift, so it stays buttery smooth."

### `1:45 – 2:35` — How Kiro built it

- **On screen:** Open `.kiro/specs/code-exorcist.md`, then
  `.kiro/steering/horror-rules.md`, then `.kiro/hooks/agent-execution.json`.
- **Narration:** "Here's the part we love. NecroCode is a Kiro-native project.
  We started with a **Spec** — the agent phases, the workflow stages, and the
  exact streaming event contract. A **Steering Doc** locked in our tech stack and
  neon design system so every generated file stayed on-brand. And **Agent Hooks**
  define each visual stage transition — that Kiro Hook Trigger node on the canvas
  is a live tribute to the concept. Kiro scaffolded the Next.js app, the SSE
  route, the canvas, and the audio engine from these three files."

### `2:35 – 3:00` — Close / call to action

- **On screen:** Back to the finished run with all nodes green and the
  "Workflow complete" line glowing; show the responsive layout by resizing.
- **Narration:** "Clone it, run it, deploy it to Vercel — zero config, no
  secrets. NecroCode: where legacy code goes to be reborn. Happy Kiroween."

---

<div align="center">

**`« NecroCode — Kiroween 2026 »`**

</div>
