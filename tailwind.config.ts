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
        // Deep dark navy / black base
        void: "#080B13",
        abyss: "#0D111D",
        panel: "#0F1524",
        // Neon accents
        neon: {
          blue: "#00F0FF",
          purple: "#A855F7",
          green: "#10B981",
          rose: "#F43F5E",
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
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(0,240,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.06) 1px, transparent 1px)",
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
      },
    },
  },
  plugins: [],
};

export default config;
