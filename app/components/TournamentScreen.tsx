"use client";

import { Calendar, MapPin, Lock as LockIcon } from "lucide-react";
import type { Dict } from "../lib/i18n";
import type { Tournament, Team } from "../lib/types";
import { tournaments } from "../lib/tournaments";

export function TournamentScreen({
  active,
  team,
  onGoToBuilder,
  t,
  rank,
  totalPlayers,
}: {
  active: Tournament;
  team: Team | null;
  onGoToBuilder: () => void;
  t: Dict;
  rank: number | null;
  totalPlayers: number;
}) {
  const upcoming = tournaments.filter((t) => t.id !== active.id);

  return (
    <div>
      <p className="kicker">{t.activeTournament}</p>

      <div className="tournament-card">
        <div className={`status-chip ${statusClass(active)}`}>{statusLabel(active, t)}</div>

        <h2 className="tournament-title">{active.shortName}</h2>

        <div className="tournament-meta">
          <span>
            <MapPin size={12} style={{ verticalAlign: "middle", marginRight: 6 }} />
            {active.location}
          </span>
          <span>
            <Calendar size={12} style={{ verticalAlign: "middle", marginRight: 6 }} />
            {formatRange(active.startDate, active.endDate)}
          </span>
        </div>

        <div className="deadline-row">
          <div>
            <div className="deadline-label">{t.deadline}</div>
            <div className="deadline-value">{formatDeadline(active.deadlineAt, t)}</div>
          </div>

          {team?.lockedAt && (
            <div style={{ color: "var(--success)", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
              <LockIcon size={14} />
              {t.teamLocked}
            </div>
          )}
        </div>

        {team ? (
          <div className="score-grid">
            <div className="score-tile">
              <div className="score-tile-value">{rank ?? "—"}</div>
              <div className="score-tile-label">{t.yourPosition}</div>
            </div>
            <div className="score-tile">
              <div className="score-tile-value">{team.totalCost}</div>
              <div className="score-tile-label">{t.budget}</div>
            </div>
            <div className="score-tile">
              <div className="score-tile-value">{totalPlayers}</div>
              <div className="score-tile-label">{t.team}s</div>
            </div>
          </div>
        ) : (
          <p style={{ color: "#aaa", fontSize: 13, marginBottom: 12 }}>
            {t.welcomeText}
          </p>
        )}

        <button className="btn btn-gold" onClick={onGoToBuilder}>
          {team ? t.edit : t.enterTournament}
        </button>
      </div>

      {upcoming.length > 0 && (
        <>
          <p className="kicker" style={{ marginTop: 18 }}>{t.upcomingTournaments}</p>

          {upcoming.map((tn) => (
            <div key={tn.id} className="tournament-card" style={{ opacity: 0.85 }}>
              <div className={`status-chip ${statusClass(tn)}`}>{statusLabel(tn, t)}</div>

              <h3 className="tournament-title" style={{ fontSize: 18 }}>{tn.shortName}</h3>

              <div className="tournament-meta">
                <span>
                  <MapPin size={12} style={{ verticalAlign: "middle", marginRight: 6 }} />
                  {tn.location}
                </span>
                <span>
                  <Calendar size={12} style={{ verticalAlign: "middle", marginRight: 6 }} />
                  {formatRange(tn.startDate, tn.endDate)}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function statusClass(t: Tournament): string {
  if (t.status === "live") return "live";
  if (t.status === "locked") return "locked";
  return "";
}

function statusLabel(tn: Tournament, t: Dict): string {
  switch (tn.status) {
    case "open":
      return t.open;
    case "upcoming":
      return t.upcoming;
    case "locked":
      return t.locked;
    case "live":
      return t.live;
    case "finished":
      return t.finished;
    default:
      return "";
  }
}

function formatRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString("en-GB", { ...opts, year: "numeric" })}`;
}

function formatDeadline(iso: string, t: Dict): string {
  const target = new Date(iso).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return t.countdownLocked;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 1) return `${days} ${t.daysLeft}`;
  if (days === 1) return `1 ${t.daysLeft} ${hours}${t.hoursLeft}`;
  return `${hours}${t.hoursLeft}`;
}
