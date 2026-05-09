import type { EventResult, Team, Tournament, TeamPick, SlotType, Swimmer } from "./types";
import { getSimulatedResults } from "./tournaments";
import { swimmers } from "./swimmers";

export type TeamValidationError =
  | "WRONG_PICK_COUNT"
  | "BUDGET_EXCEEDED"
  | "MIN_WOMEN"
  | "MIN_MEN"
  | "MAX_PER_COUNTRY"
  | "BAD_SPRINT_SLOT"
  | "BAD_DISTANCE_SLOT"
  | "BAD_UNIVERSAL_SLOT"
  | "DUPLICATE"
  | "NO_CAPTAIN"
  | "CAPTAIN_NOT_IN_TEAM";

export const SLOT_LAYOUT: SlotType[] = [
  "SPRINT",
  "DISTANCE",
  "UNIVERSAL",
  "WILDCARD",
  "WILDCARD",
  "WILDCARD",
  "WILDCARD",
];

export const TEAM_RULES = {
  totalPicks: 7,
  minWomen: 2,
  minMen: 2,
  maxPerCountry: 3,
};

export function validateSlotMatch(swimmer: Swimmer, slot: SlotType): boolean {
  if (slot === "WILDCARD") return true;
  if (slot === "SPRINT") return swimmer.archetype === "SPRINT";
  if (slot === "DISTANCE") return swimmer.archetype === "DISTANCE";
  if (slot === "UNIVERSAL") return swimmer.archetype === "UNIVERSAL";
  return true;
}

export function validateTeam(
  picks: TeamPick[],
  captainId: string | null,
  budget: number
): TeamValidationError[] {
  const errors: TeamValidationError[] = [];

  if (picks.length !== TEAM_RULES.totalPicks) {
    errors.push("WRONG_PICK_COUNT");
    return errors;
  }

  const ids = picks.map((p) => p.swimmerId);
  if (new Set(ids).size !== ids.length) errors.push("DUPLICATE");

  const resolved = picks
    .map((p) => ({ pick: p, swimmer: swimmers.find((s) => s.id === p.swimmerId) }))
    .filter((x) => x.swimmer) as { pick: TeamPick; swimmer: Swimmer }[];

  const totalCost = resolved.reduce((sum, r) => sum + r.swimmer.basePrice, 0);
  if (totalCost > budget) errors.push("BUDGET_EXCEEDED");

  const women = resolved.filter((r) => r.swimmer.gender === "F").length;
  const men = resolved.filter((r) => r.swimmer.gender === "M").length;
  if (women < TEAM_RULES.minWomen) errors.push("MIN_WOMEN");
  if (men < TEAM_RULES.minMen) errors.push("MIN_MEN");

  const byCountry = new Map<string, number>();
  for (const r of resolved) {
    byCountry.set(r.swimmer.country, (byCountry.get(r.swimmer.country) ?? 0) + 1);
  }
  for (const count of byCountry.values()) {
    if (count > TEAM_RULES.maxPerCountry) errors.push("MAX_PER_COUNTRY");
  }

  for (const r of resolved) {
    if (!validateSlotMatch(r.swimmer, r.pick.slot)) {
      if (r.pick.slot === "SPRINT") errors.push("BAD_SPRINT_SLOT");
      if (r.pick.slot === "DISTANCE") errors.push("BAD_DISTANCE_SLOT");
      if (r.pick.slot === "UNIVERSAL") errors.push("BAD_UNIVERSAL_SLOT");
    }
  }

  if (!captainId) errors.push("NO_CAPTAIN");
  else if (!ids.includes(captainId)) errors.push("CAPTAIN_NOT_IN_TEAM");

  return Array.from(new Set(errors));
}

export function teamCost(picks: TeamPick[]): number {
  return picks.reduce((sum, p) => {
    const s = swimmers.find((sw) => sw.id === p.swimmerId);
    return sum + (s?.basePrice ?? 0);
  }, 0);
}

export type TeamScoreBreakdown = {
  total: number;
  perSwimmer: {
    swimmerId: string;
    isCaptain: boolean;
    rawPoints: number;
    finalPoints: number;
    events: { event: string; place: number; fp: number }[];
  }[];
};

export function scoreTeam(team: Team, tournament: Tournament): TeamScoreBreakdown {
  const results = getSimulatedResults(tournament.id);
  const resultsBySwimmer = new Map<string, EventResult[]>();
  for (const r of results) {
    if (!resultsBySwimmer.has(r.swimmerId)) resultsBySwimmer.set(r.swimmerId, []);
    resultsBySwimmer.get(r.swimmerId)!.push(r);
  }

  const perSwimmer = team.picks.map((pick) => {
    const swimmerResults = resultsBySwimmer.get(pick.swimmerId) ?? [];
    const rawPoints = swimmerResults.reduce((s, r) => s + r.totalFp, 0);
    const isCaptain = team.captainId === pick.swimmerId;
    const multiplier = isCaptain ? 2 : 1;
    return {
      swimmerId: pick.swimmerId,
      isCaptain,
      rawPoints,
      finalPoints: rawPoints * multiplier,
      events: swimmerResults.map((r) => ({ event: r.event, place: r.place, fp: r.totalFp })),
    };
  });

  const total = perSwimmer.reduce((s, x) => s + x.finalPoints, 0);
  return { total, perSwimmer };
}
