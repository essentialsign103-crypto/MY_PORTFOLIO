"use client";

import { useState } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import "./ThemeToggle.css";

export function ThemeToggleContent() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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
