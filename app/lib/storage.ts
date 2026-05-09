import type { Team } from "./types";

const KEY_TEAMS = "ss-fantasy.teams.v2";
const KEY_USER = "ss-fantasy.user.v2";

export type StoredUser = {
  id: string;
  username: string;
  photoUrl?: string;
  langOverride?: "en" | "ru";
};

export function loadTeams(): Record<string, Team> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY_TEAMS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveTeam(team: Team): void {
  if (typeof window === "undefined") return;
  const all = loadTeams();
  all[team.tournamentId] = team;
  localStorage.setItem(KEY_TEAMS, JSON.stringify(all));
}

export function loadTeamFor(tournamentId: string): Team | null {
  return loadTeams()[tournamentId] ?? null;
}

export function loadUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: StoredUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_USER, JSON.stringify(user));
}
