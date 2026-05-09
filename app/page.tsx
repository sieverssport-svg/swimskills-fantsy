"use client";

import { useEffect, useMemo, useState } from "react";
import { dictionary, detectLang, type Lang } from "./lib/i18n";
import { initTelegram, getTelegram } from "./lib/telegram";
import { getActiveTournament, tournaments } from "./lib/tournaments";
import { loadTeamFor, saveTeam, loadUser, saveUser, type StoredUser } from "./lib/storage";
import type { Team } from "./lib/types";
import { buildLeaderboard } from "./lib/leaderboard";
import { BottomNav, type Tab } from "./components/BottomNav";
import { Topbar } from "./components/Topbar";
import { TournamentScreen } from "./components/TournamentScreen";
import { TeamBuilder } from "./components/TeamBuilder";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { ProfileScreen } from "./components/ProfileScreen";

type HydratedState = {
  lang: Lang;
  user: StoredUser;
  team: Team | null;
};

export default function Home() {
  const [hydrated, setHydrated] = useState<HydratedState | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("tournament");

  const tournament = useMemo(() => getActiveTournament(), []);

  useEffect(() => {
    const tgUser = initTelegram();
    const stored = loadUser();
    const id =
      stored?.id ??
      (tgUser?.id ? `tg-${tgUser.id}` : `local-${Math.random().toString(36).slice(2, 10)}`);
    const username = tgUser?.username
      ? `@${tgUser.username}`
      : (stored?.username ?? "@you");

    const newUser: StoredUser = {
      id,
      username,
      photoUrl: tgUser?.photo_url ?? stored?.photoUrl,
      langOverride: stored?.langOverride,
    };
    saveUser(newUser);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated({
      lang: newUser.langOverride ?? detectLang(),
      user: newUser,
      team: loadTeamFor(tournament.id),
    });
  }, [tournament.id]);

  const lang: Lang = hydrated?.lang ?? "en";
  const user = hydrated?.user ?? null;
  const team = hydrated?.team ?? null;
  const t = dictionary[lang];

  const setLang = (next: Lang) => {
    if (!hydrated) return;
    const updated = { ...hydrated.user, langOverride: next };
    saveUser(updated);
    setHydrated({ ...hydrated, lang: next, user: updated });
  };

  const handleLockTeam = (next: Team) => {
    saveTeam(next);
    if (hydrated) setHydrated({ ...hydrated, team: next });
  };

  const leaderboard = useMemo(
    () => buildLeaderboard(team, tournament, user?.username ?? "@you"),
    [team, tournament, user?.username]
  );

  const userEntry = leaderboard.find((e) => e.isYou);
  const rank = userEntry?.rank ?? null;
  const totalPlayers = leaderboard.length;

  const onShare = () => {
    if (!team) return;
    const tg = getTelegram();
    const url = "https://t.me/whoissievers";
    const text = `${t.shareText} ${tournament.shortName}: ${rank ? `#${rank}` : "—"}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      );
    } else if (typeof window !== "undefined" && navigator.share) {
      navigator.share({ title: "Swim Skills Fantasy", text, url }).catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {});
    }
  };

  if (!hydrated || !user) {
    return (
      <div className="app-shell">
        <Topbar username="@you" lang="en" setLang={() => {}} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Topbar
        username={user.username}
        lang={lang}
        setLang={setLang}
        rightSlot={
          <div className="budget-pill">
            {tournament.budget}
            <span className="label">{t.currency}</span>
          </div>
        }
      />

      {activeTab === "tournament" && (
        <TournamentScreen
          active={tournament}
          team={team}
          onGoToBuilder={() => setActiveTab("team")}
          t={t}
          rank={rank}
          totalPlayers={totalPlayers}
        />
      )}

      {activeTab === "team" && (
        <TeamBuilder
          tournament={tournament}
          initialTeam={team}
          onLock={handleLockTeam}
          t={t}
          userId={user.id}
          locked={false}
        />
      )}

      {activeTab === "leaderboard" && (
        <LeaderboardScreen entries={leaderboard} tournament={tournament} t={t} />
      )}

      {activeTab === "profile" && (
        <ProfileScreen
          username={user.username}
          photoUrl={user.photoUrl}
          team={team}
          tournament={tournament}
          rank={rank}
          totalPlayers={totalPlayers}
          lang={lang}
          setLang={setLang}
          t={t}
          onShare={onShare}
        />
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      {tournaments.length === 0 && <p className="muted">{t.noActive}</p>}
    </div>
  );
}
