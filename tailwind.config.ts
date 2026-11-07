import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Haunted Cyber-Gothic base (pitch black) ──
        void: "#030508",
        abyss: "#07090F",
        panel: "#0A0D16",
        crypt: "#0D0711", // faint purple-black for panels
        // ── Haunted accents ──
        blood: "#EF4444", // pulsing blood crimson (bugs / hauntings)
        haunt: "#9333EA", // haunted neon purple
        spectral: "#06B6D4", // spectral cyan
        ecto: "#10B981", // spectral green (cleansed)
        bone: "#E7E5E4", // bone-white text
        // Legacy neon accents (kept so existing utilities don't break)
        neon: {
          blue: "#06B6D4",
          purple: "#9333EA",
          green: "#10B981",
          rose: "#EF4444",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(0, 240, 255, 0.45), 0 0 40px rgba(0, 240, 255, 0.15)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.45), 0 0 40px rgba(168, 85, 247, 0.15)",
        "glow-green": "0 0 20px rgba(16, 185, 129, 0.45), 0 0 40px rgba(16, 185, 129, 0.15)",
        // Intense variants used for pulsing active-stage borders.
        "glow-blue-xl":
          "0 0 10px rgba(0,240,255,0.6), 0 0 28px rgba(0,240,255,0.4), 0 0 56px rgba(0,240,255,0.2)",
        "glow-purple-xl":
          "0 0 10px rgba(168,85,247,0.6), 0 0 28px rgba(168,85,247,0.4), 0 0 56px rgba(168,85,247,0.2)",
        "glow-green-xl":
          "0 0 10px rgba(16,185,129,0.6), 0 0 28px rgba(16,185,129,0.4), 0 0 56px rgba(16,185,129,0.2)",
        // ── Haunted glow shadows ──
        "glow-blood":
          "0 0 16px rgba(239,68,68,0.55), 0 0 36px rgba(239,68,68,0.25)",
        "glow-blood-xl":
          "0 0 12px rgba(239,68,68,0.7), 0 0 30px rgba(239,68,68,0.45), 0 0 64px rgba(239,68,68,0.25)",
        "glow-haunt":
          "0 0 16px rgba(147,51,234,0.55), 0 0 36px rgba(147,51,234,0.25)",
        "glow-haunt-xl":
          "0 0 12px rgba(147,51,234,0.7), 0 0 30px rgba(147,51,234,0.45), 0 0 64px rgba(147,51,234,0.25)",
        "glow-spectral":
          "0 0 16px rgba(6,182,212,0.55), 0 0 36px rgba(6,182,212,0.25)",
        "glow-spectral-xl":
          "0 0 12px rgba(6,182,212,0.7), 0 0 30px rgba(6,182,212,0.45), 0 0 64px rgba(6,182,212,0.25)",
        "glow-ecto":
          "0 0 16px rgba(16,185,129,0.55), 0 0 36px rgba(16,185,129,0.25)",
        "glow-ecto-xl":
          "0 0 12px rgba(16,185,129,0.7), 0 0 30px rgba(16,185,129,0.45), 0 0 64px rgba(16,185,129,0.25)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(147,51,234,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.07) 1px, transparent 1px)",
        // Eerie layered fog: three soft radial gradients.
        fog:
          "radial-gradient(60% 50% at 20% 30%, rgba(147,51,234,0.10), transparent 70%), radial-gradient(50% 60% at 80% 20%, rgba(6,182,212,0.08), transparent 70%), radial-gradient(70% 60% at 50% 100%, rgba(239,68,68,0.07), transparent 70%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
        "border-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // Slowly drifts the backdrop grid for a living cyberpunk feel.
        "grid-drift": {
          "0%": { backgroundPosition: "0px 0px" },
          "100%": { backgroundPosition: "40px 40px" },
        },
        // Runs a bright pulse of light along a connector / trail.
        "trail-flow": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        // Pulsing box-shadow glow for an active stage border.
        "border-pulse": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.012)" },
        },
        // Pop-in for the "Copied!" badge.
        "badge-pop": {
          "0%": { opacity: "0", transform: "scale(0.7) translateY(4px)" },
          "60%": { opacity: "1", transform: "scale(1.05) translateY(0)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        // ── Haunted keyframes ──
        // Violent blood-red pulse for a haunted (bug) node.
        "blood-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 10px rgba(239,68,68,0.5), 0 0 24px rgba(239,68,68,0.25)",
            borderColor: "rgba(239,68,68,0.6)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgba(239,68,68,0.9), 0 0 52px rgba(239,68,68,0.5)",
            borderColor: "rgba(239,68,68,1)",
          },
        },
        // Slow drifting fog overlay.
        "fog-drift": {
          "0%": { transform: "translate3d(0,0,0) scale(1.1)" },
          "50%": { transform: "translate3d(-3%,2%,0) scale(1.15)" },
          "100%": { transform: "translate3d(0,0,0) scale(1.1)" },
        },
        // Floating ghost/skull node bob.
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        // Rune-border rotating glow (hue via opacity shimmer).
        "rune-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        scanline: "scanline 6s linear infinite",
        flicker: "flicker 3s linear infinite",
        "border-flow": "border-flow 4s ease infinite",
        "grid-drift": "grid-drift 3s linear infinite",
        "trail-flow": "trail-flow 1.6s linear infinite",
        "border-pulse": "border-pulse 1.5s ease-in-out infinite",
        "badge-pop": "badge-pop 0.25s ease-out",
        "blood-pulse": "blood-pulse 1.1s ease-in-out infinite",
        "fog-drift": "fog-drift 18s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "rune-glow": "rune-glow 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
