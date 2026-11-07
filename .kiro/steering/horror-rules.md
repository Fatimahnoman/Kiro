# NecroCode — Horror UI/UX Rules (Haunted Cyber-Gothic)

> Steering context for the **Code Exorcist** revamp. These rules keep the
> haunted cyber-gothic theme consistent across every component and AI
> interaction. Workspace steering — applies to the whole repo.

## 🎭 Theme

NecroCode is a **Haunted Cyber-Gothic AI Code Exorcist**: a spooky HUD where a
user submits "cursed" JS/TS code and an AI exorcist hunts the bugs (demons),
reasons about each haunting, and emits purified, clean code. The mood is a
digital séance — candles, fog, runes, flickering CRT, and floating ghosts.

## 🎨 Palette (authoritative)

| Token        | Hex        | Role                                            |
| ------------ | ---------- | ----------------------------------------------- |
| `void`       | `#030508`  | Pitch-black background base                     |
| `abyss`      | `#07090F`  | Slightly lifted background                      |
| `panel`      | `#0A0D16`  | Panel background                                |
| `blood`      | `#EF4444`  | **Pulsing blood crimson** — bugs / hauntings    |
| `haunt`      | `#9333EA`  | **Haunted neon purple** — reasoning / code      |
| `spectral`   | `#06B6D4`  | **Spectral cyan** — scanning / active / info    |
| `ecto`       | `#10B981`  | Spectral green — cleansed / success             |
| `bone`       | `#E7E5E4`  | Bone-white body text                            |

- **Never** reintroduce the old neon blue `#00F0FF`. Spectral cyan `#06B6D4`
  replaces it. (Legacy `neon.*` tokens are remapped to the haunted palette for
  backwards-compat only — prefer the named tokens above.)
- Bugs/hauntings are **always** blood-red and must visibly **pulse**
  (`animate-blood-pulse`).
- Cleansed/fixed state is **spectral green/purple** (`ecto` + `haunt`).

## 🕯️ Visual language

- **Glassmorphism** panels (`.glass` / `.glass-strong`) with gothic purple tint.
- **Eerie fog** overlay: `bg-fog` + `animate-fog-drift`.
- **Flickering CRT scanlines**: `.scanlines` (toggleable) + `animate-flicker`.
- **Glowing rune borders**: `.rune-border` / `shadow-glow-*` utilities.
- **Floating** skull/ghost nodes: `animate-float`.
- Prefer the `shadow-glow-blood|haunt|spectral|ecto` (and `-xl`) utilities over
  ad-hoc shadows.
- Monospace for all HUD/terminal readouts.

## 🧩 Layout contract (3-pane HUD)

1. **Left** — _Ritual Spells & Bug Exorcism_: code editor window + haunted
   trigger buttons (preset cursed snippets).
2. **Center** — _Haunted Node Graph_: four floating ghost/skull nodes
   `Input Code → Glitch Scanner → Exorcism Reasoning → Clean Code Output`.
3. **Right** — _Cyber-Gothic Terminal_: translucent, red/purple glowing log
   stream with cleansed-code output + copy.

The canonical ordered stages live in `lib/types.ts` → `WORKFLOW_STAGES` and are
the single source of truth.

## ⚙️ Functional rules

- The exorcism is **real**: `lib/exorcist.ts` statically analyzes the submitted
  JS/TS for genuine bugs (loose equality, `var`, assignment-in-condition, stray
  `console.log`, unbalanced brackets, missing semicolons) and returns fixed code.
- The SSE route (`app/api/agent/stream/route.ts`) streams the actual findings —
  never fabricate bugs that the analyzer did not detect.
- A detected bug sets the node status to `haunted` (red pulse); finishing a
  stage sets `cleansed` (spectral). No bug → straight to `cleansed`.
- Keep **zero layout shift** across `idle → summoning → scanning → exorcising →
  complete` (fixed-size status slots; animate only transform/shadow/border).

## 🧷 Non-functional

- Strict TypeScript, no `any`. Shared types in `lib/types.ts`.
- Responsive: panes stack on mobile, 3-column on `lg+`.
- Accessible: real `<button>`s, `aria-*`, `prefers-reduced-motion` friendly.
- `npm install && npm run build` must pass with **zero errors**. No runtime
  secrets — the exorcism runs fully server-side.
