"use client";

import type { Dict } from "../lib/i18n";
import type { LeaderboardEntry, Tournament } from "../lib/types";

export function LeaderboardScreen({
  entries,
  tournament,
  t,
}: {
  entries: LeaderboardEntry[];
  tournament: Tournament;
  t: Dict;
}) {
  return (
    <div>
      <p className="kicker">{t.leaderboard}</p>

      <h2 className="section-title" style={{ marginBottom: 12 }}>
        {tournament.shortName}
      </h2>

      <div className="banner-info">
        {t.points}: WA points + medals + records · {t.captain} ×2
      </div>

      {entries.map((entry) => (
        <div
          key={entry.userId + entry.rank}
          className={`leaderboard-row ${entry.isYou ? "you" : ""}`}
        >
          <div className={`leaderboard-rank ${entry.rank <= 3 ? `medal-${entry.rank}` : ""}`}>
            {entry.rank}
          </div>

          <div>
            <p className="leaderboard-name">
              {entry.username} {entry.isYou ? `· ${t.you}` : ""}
            </p>
            <p className="leaderboard-team">{entry.teamName}</p>
          </div>

          <div className="leaderboard-points">
            {entry.totalPoints}
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textAlign: "right" }}>
              {t.points}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
