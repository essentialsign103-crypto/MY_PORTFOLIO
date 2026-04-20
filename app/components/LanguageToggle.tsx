"use client";

import dynamic from "next/dynamic";

const LanguageToggleContent = dynamic(
  () => import("./LanguageToggleContent").then((mod) => mod.LanguageToggleContent),
  { ssr: false }
);

export function LanguageToggle({ compact }: { compact?: boolean }) {
  return <LanguageToggleContent compact={compact} />;
}
