"use client";

import { useState, useEffect } from "react";
import { Home, User, Briefcase, FolderOpen, Mail } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

const navItems = [
  { key: "home",     href: "#home",     icon: Home,       labelKey: "nav.home" },
  { key: "about",    href: "#about",    icon: User,       labelKey: "nav.about" },
  { key: "services", href: "#services", icon: Briefcase,  labelKey: "nav.services" },
  { key: "work",     href: "#work",     icon: FolderOpen, labelKey: "nav.work" },
  { key: "contact",  href: "#contact",  icon: Mail,       labelKey: "nav.contact" },
];

export function MobileBottomNav() {
  const { t } = useLanguage();
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = navItems.map((item) =>
      document.querySelector(item.href) as HTMLElement | null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) setActive(id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-bottom-nav"
    >
      {navItems.map(({ key, href, icon: Icon, labelKey }) => {
        const isActive = active === key;
        return (
          <a
            key={key}
            href={href}
            onClick={() => setActive(key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              borderRadius: "14px",
              textDecoration: "none",
              color: isActive ? "var(--primary)" : "var(--muted)",
              background: isActive ? "rgba(15, 69, 69, 0.08)" : "transparent",
              transition: "all 200ms ease",
              minWidth: "48px",
            }}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ transition: "all 200ms ease" }}
            />
            <span style={{
              fontSize: "0.65rem",
              fontWeight: isActive ? 700 : 500,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}>
              {t(labelKey)}
            </span>
          </a>
        );
      })}

      {/* Theme + Language toggles in bottom bar */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        padding: "6px 4px",
      }}>
        <ThemeToggle compact />
        <LanguageToggle compact />
      </div>
    </nav>
  );
}
