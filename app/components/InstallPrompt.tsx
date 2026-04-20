"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === "accepted") {
      setShowBanner(false);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "#0F4545",
      color: "#fff",
      padding: "14px 20px",
      borderRadius: "14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "14px",
      maxWidth: "340px",
      width: "90%",
    }}>
      <span style={{ fontSize: "28px" }}>📲</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>Install App</p>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.8 }}>Add to Home Screen for quick access</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          onClick={handleInstall}
          style={{
            background: "#fff",
            color: "#0F4545",
            border: "none",
            borderRadius: "8px",
            padding: "6px 14px",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "8px",
            padding: "4px 14px",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
