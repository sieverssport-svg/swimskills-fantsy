import type { LeaderboardEntry, Team, TeamPick, Tournament } from "./types";
import { swimmers } from "./swimmers";
import { scoreTeam } from "./scoring";

const FAKE_USERS = [
  { username: "@nikita_ss", teamName: "Sievers Selection" },
  { username: "@swimnerd", teamName: "Splash Squad" },
  { username: "@coach_anna", teamName: "Lane 4 Legends" },
  { username: "@parisfan26", teamName: "Tour Eiffel SC" },
  { username: "@distance_dad", teamName: "Mile High" },
  { username: "@flyqueen", teamName: "Butterfly Effect" },
  { username: "@imguru", teamName: "Medley Mode" },
  { username: "@usadream", teamName: "Stars & Stripes" },
  { username: "@aussiepool", teamName: "Dolphins United" },
  { username: "@frenchblue", teamName: "Bleu Profond" },
  { username: "@baltic_swim", teamName: "Cold Lane" },
  { username: "@speedo_kid", teamName: "Negative Splits" },
  { username: "@settler", teamName: "DQ Avoiders" },
  { username: "@whoissievers", teamName: "Channel Team" },
  { username: "@early_riser", teamName: "5am Practice" },
];

function buildBotTeam(seed: number, tournament: Tournament): Team {
  const pool = tournament.participantSwimmerIds
    .map((id) => swimmers.find((s) => s.id === id))
    .filter(Boolean)
    .sort((a, b) => {
      const aHash = ((a!.id.charCodeAt(0) + seed) * 31) % 997;
      const bHash = ((b!.id.charCodeAt(0) + seed) * 31) % 997;
      return aHash - bHash;
    });

  const picks: TeamPick[] = [];
  const usedCountries = new Map<string, number>();
  let cost = 0;

  const findFor = (predicate: (s: NonNullable<typeof pool[number]>) => boolean) =>
    pool.find((s) => {
      if (!s) return false;
      if (picks.find((p) => p.swimmerId === s.id)) return false;
      if ((usedCountries.get(s.country) ?? 0) >= 3) return false;
      if (cost + s.basePrice > tournament.budget) return false;
      return predicate(s);
    });

  const sprint = findFor((s) => s.archetype === "SPRINT");
  const distance = findFor((s) => s.archetype === "DISTANCE");
  const universal = findFor((s) => s.archetype === "UNIVERSAL");

  if (sprint) picks.push({ swimmerId: sprint.id, slot: "SPRINT" as const });
  if (distance) picks.push({ swimmerId: distance.id, slot: "DISTANCE" as const });
  if (universal) picks.push({ swimmerId: universal.id, slot: "UNIVERSAL" as const });

  for (const s of [sprint, distance, universal]) {
    if (s) {
      cost += s.basePrice;
      usedCountries.set(s.country, (usedCountries.get(s.country) ?? 0) + 1);
    }
  }

  while (picks.length < 7) {
    const wild = findFor(() => true);
    if (!wild) break;
    picks.push({ swimmerId: wild.id, slot: "WILDCARD" as const });
    cost += wild.basePrice;
    usedCountries.set(wild.country, (usedCountries.get(wild.country) ?? 0) + 1);
  }

  const women = picks.filter((p) => swimmers.find((s) => s.id === p.swimmerId)?.gender === "F").length;
  const men = picks.filter((p) => swimmers.find((s) => s.id === p.swimmerId)?.gender === "M").length;

  if (women < 2 || men < 2) {
    return buildBotTeam(seed + 11, tournament);
  }

  const captainId = picks[seed % picks.length]?.swimmerId ?? null;

  return {
    id: `bot-${seed}`,
    userId: `bot-${seed}`,
    tournamentId: tournament.id,
    picks,
    captainId,
    totalCost: cost,
    createdAt: new Date().toISOString(),
    lockedAt: tournament.deadlineAt,
    transfersUsed: 0,
  };
}

export function buildLeaderboard(
  userTeam: Team | null,
  tournament: Tournament,
  username: string
): LeaderboardEntry[] {
  const entries: { userId: string; username: string; teamName: string; total: number; isYou: boolean }[] = [];

  FAKE_USERS.forEach((u, i) => {
    const team = buildBotTeam(i + 1, tournament);
    const score = scoreTeam(team, tournament);
    entries.push({
      userId: team.userId,
      username: u.username,
      teamName: u.teamName,
      total: score.total,
      isYou: false,
    });
  });

  if (userTeam) {
    const score = scoreTeam(userTeam, tournament);
    entries.push({
      userId: userTeam.userId,
      username,
      teamName: "My Team",
      total: score.total,
      isYou: true,
    });
  }

  entries.sort((a, b) => b.total - a.total);

  return entries.map((e, i) => ({
    rank: i + 1,
    userId: e.userId,
    username: e.username,
    teamName: e.teamName,
    totalPoints: Math.round(e.total),
    isYou: e.isYou,
  }));
}
