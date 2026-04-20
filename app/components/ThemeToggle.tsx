"use client";

import dynamic from "next/dynamic";

const ThemeToggleContent = dynamic(
  () => import("./ThemeToggleContent").then((mod) => mod.ThemeToggleContent),
  { ssr: false }
);

export function ThemeToggle({ compact }: { compact?: boolean }) {
  return <ThemeToggleContent compact={compact} />;
}
