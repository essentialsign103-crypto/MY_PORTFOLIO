"use client";

import { useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import "./LanguageToggle.css";

export function LanguageToggleContent() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

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
