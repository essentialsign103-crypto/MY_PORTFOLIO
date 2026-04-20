"use client";

import { useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import "./LanguageToggle.css";

export function LanguageToggleContent({ compact }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (compact) {
    return (
      <button
        onClick={() => setLanguage(language === "en" ? "om" : "en")}
        aria-label="Toggle language"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          padding: "2px",
          lineHeight: 1,
        }}
      >
        🌍
      </button>
    );
  }

  return (
    <div className="language-toggle-wrapper">
      <button
        className="language-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle language"
        title={`Current: ${language === "en" ? "English" : "Oromo"}`}
      >
        🌍
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <button
            className={`language-option ${language === "en" ? "active" : ""}`}
            onClick={() => {
              setLanguage("en");
              setIsOpen(false);
            }}
          >
            🇬🇧 English
          </button>
          <button
            className={`language-option ${language === "om" ? "active" : ""}`}
            onClick={() => {
              setLanguage("om");
              setIsOpen(false);
            }}
          >
            🇪🇹 Oromo
          </button>
        </div>
      )}
    </div>
  );
}
