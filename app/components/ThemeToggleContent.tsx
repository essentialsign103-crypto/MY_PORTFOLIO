"use client";

import { useState } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import "./ThemeToggle.css";

export function ThemeToggleContent({ compact }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          padding: "2px",
          lineHeight: 1,
        }}
      >
        {theme === "light" ? "☀️" : "🌙"}
      </button>
    );
  }

  return (
    <div className="theme-toggle-wrapper">
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        title={`Current: ${theme} mode`}
      >
        {theme === "light" ? "☀️" : "🌙"}
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <button
            className={`theme-option ${theme === "light" ? "active" : ""}`}
            onClick={() => {
              if (theme !== "light") toggleTheme();
              setIsOpen(false);
            }}
          >
            ☀️ Light Mode
          </button>
          <button
            className={`theme-option ${theme === "dark" ? "active" : ""}`}
            onClick={() => {
              if (theme !== "dark") toggleTheme();
              setIsOpen(false);
            }}
          >
            🌙 Dark Mode
          </button>
        </div>
      )}
    </div>
  );
}
