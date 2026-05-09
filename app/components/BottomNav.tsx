"use client";

import { Trophy, Users, BarChart3, User } from "lucide-react";
import type { Dict } from "../lib/i18n";

export type Tab = "tournament" | "team" | "leaderboard" | "profile";

export function BottomNav({
  activeTab,
  setActiveTab,
  t,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  t: Dict;
}) {
  const items: { tab: Tab; label: string; icon: React.ReactNode }[] = [
    { tab: "tournament", label: t.tournament, icon: <Trophy size={20} strokeWidth={2.5} /> },
    { tab: "team", label: t.yourTeam, icon: <Users size={20} strokeWidth={2.5} /> },
    { tab: "leaderboard", label: t.leaderboard, icon: <BarChart3 size={20} strokeWidth={2.5} /> },
    { tab: "profile", label: t.profile, icon: <User size={20} strokeWidth={2.5} /> },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button
          key={it.tab}
          className={`nav-btn ${activeTab === it.tab ? "active" : ""}`}
          onClick={() => setActiveTab(it.tab)}
        >
          <span className="nav-icon">{it.icon}</span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
