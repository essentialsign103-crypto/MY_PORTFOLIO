"use client";

import { LayoutDashboard, User, Phone, FolderOpen, MessageSquare, Clapperboard } from "lucide-react";

const adminTabs = [
  { key: "hero",      icon: Clapperboard,    label: "Hero" },
  { key: "about",     icon: User,            label: "About" },
  { key: "contact",   icon: Phone,           label: "Contact" },
  { key: "projects",  icon: FolderOpen,      label: "Projects" },
  { key: "inquiries", icon: MessageSquare,   label: "Inquiries" },
];

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
}

export function AdminMobileNav({ activeTab, onTabChange, unreadCount }: AdminMobileNavProps) {
  return (
    <nav
      aria-label="Admin mobile navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "10px 4px calc(10px + env(safe-area-inset-bottom))",
        background: "#0f4545",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.2)",
      }}
    >
      {adminTabs.map(({ key, icon: Icon, label }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "6px 10px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
              background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
              transition: "all 200ms ease",
              minWidth: "52px",
              position: "relative",
            }}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ transition: "all 200ms ease" }}
            />
            {/* Unread badge on Inquiries */}
            {key === "inquiries" && unreadCount > 0 && (
              <span style={{
                position: "absolute",
                top: "2px",
                right: "6px",
                background: "#ef4444",
                color: "#fff",
                fontSize: "0.6rem",
                fontWeight: 700,
                borderRadius: "999px",
                padding: "1px 5px",
                minWidth: "16px",
                textAlign: "center",
              }}>
                {unreadCount}
              </span>
            )}
            <span style={{
              fontSize: "0.62rem",
              fontWeight: isActive ? 700 : 500,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
