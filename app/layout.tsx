import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NecroCode — Haunted AI Code Exorcist",
  description:
    "A haunted cyber-gothic AI Code Exorcist. Paste cursed JS/TS, run a bug exorcism, and watch ghostly nodes bleed red on hauntings and turn spectral when cleansed — streamed live over SSE.",
  keywords: [
    "AI agent",
    "code exorcist",
    "cyber-gothic",
    "horror UI",
    "Next.js",
    "Kiro",
    "Kiroween",
    "SSE",
    "bug fixing",
  ],
  authors: [{ name: "NecroCode" }],
  openGraph: {
    title: "NecroCode — Haunted AI Code Exorcist",
    description:
      "Paste cursed code, run a bug exorcism, and watch the haunted node graph cleanse your demons in real time.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#030508",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void font-sans text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
