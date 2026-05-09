"use client";

import Image from "next/image";
import { Share2, Trophy, Crown } from "lucide-react";
import type { Dict, Lang } from "../lib/i18n";
import type { Team, Tournament } from "../lib/types";
import { swimmers } from "../lib/swimmers";
import { scoreTeam } from "../lib/scoring";

export function ProfileScreen({
  username,
  photoUrl,
  team,
  tournament,
  rank,
  totalPlayers,
  lang,
  setLang,
  t,
  onShare,
}: {
  username: string;
  photoUrl?: string;
  team: Team | null;
  tournament: Tournament;
  rank: number | null;
  totalPlayers: number;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
  onShare: () => void;
}) {
  const score = team ? scoreTeam(team, tournament) : null;

  return (
    <div>
      <div className="profile-card">
        {photoUrl ? (
          <div className="profile-avatar" style={{ overflow: "hidden", padding: 0 }}>
            <Image
              src={photoUrl}
              alt={username}
              width={64}
              height={64}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              unoptimized
            />
          </div>
        ) : (
          <div className="profile-avatar">{(username[0] ?? "S").toUpperCase()}</div>
        )}

        <div style={{ flex: 1 }}>
          <p className="profile-name">{username}</p>
          <p className="profile-meta">{tournament.shortName}</p>
        </div>

        <div className="lang-switch">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "ru" ? "active" : ""} onClick={() => setLang("ru")}>RU</button>
        </div>
      </div>

      {team ? (
        <>
          <div className="score-grid">
            <div className="score-tile">
              <div className="score-tile-value">{rank ?? "—"}</div>
              <div className="score-tile-label">{t.rank} / {totalPlayers}</div>
            </div>
            <div className="score-tile">
              <div className="score-tile-value">{Math.round(score?.total ?? 0)}</div>
              <div className="score-tile-label">{t.yourScore}</div>
            </div>
            <div className="score-tile">
              <div className="score-tile-value">{team.totalCost}</div>
              <div className="score-tile-label">{t.budget}</div>
            </div>
          </div>

          <p className="kicker" style={{ marginTop: 14 }}>{t.teamPreview}</p>

          {team.picks.map((pick) => {
            const swimmer = swimmers.find((s) => s.id === pick.swimmerId);
            if (!swimmer) return null;
            const isCaptain = pick.swimmerId === team.captainId;
            const breakdown = score?.perSwimmer.find((p) => p.swimmerId === pick.swimmerId);
            return (
              <div key={pick.swimmerId} className="swimmer-row">
                <div className="swimmer-avatar">
                  {isCaptain ? <Crown size={16} /> : initials(swimmer.name)}
                </div>

                <div className="swimmer-info">
                  <p className="swimmer-name">{swimmer.name}</p>

                  <div className="swimmer-meta">
                    <span className="swimmer-tag">{swimmer.country}</span>
                    <span className={`archetype-tag ${swimmer.archetype}`}>{swimmer.archetype}</span>
                    {isCaptain && <span className="swimmer-tag gold">{t.captain} ×2</span>}
                  </div>
                </div>

                <div className="swimmer-price">
                  {Math.round(breakdown?.finalPoints ?? 0)}
                  <div style={{ fontSize: 10, color: "#aaa" }}>{t.points}</div>
                </div>
              </div>
            );
          })}

          <button className="btn btn-ghost" onClick={onShare} style={{ marginTop: 16 }}>
            <Share2 size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
            {t.share}
          </button>
        </>
      ) : (
        <div className="welcome-screen">
          <Trophy size={56} color="var(--gold)" />
          <h2>{t.welcome}</h2>
          <p>{t.welcomeText}</p>
        </div>
      )}
    </div>
  );
}

function initials(name: string): string {
  const parts = name.split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}
