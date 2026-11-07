import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NecroCode — AI Visual Agent Studio",
  description:
    "A cyberpunk dark-themed AI Visual Agent Studio. Watch an agent reason through a live workflow — input parsing, context scanning, Kiro hook triggers, and code generation — streamed in real time.",
  keywords: [
    "AI agent",
    "cyberpunk",
    "Next.js",
    "visual studio",
    "Kiro",
    "SSE",
  ],
  authors: [{ name: "NecroCode" }],
  openGraph: {
    title: "NecroCode — AI Visual Agent Studio",
    description:
      "Watch an AI agent reason through a live workflow in a neon cyberpunk HUD.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080B13",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void font-sans text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
