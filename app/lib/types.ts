export type Archetype = "SPRINT" | "DISTANCE" | "UNIVERSAL" | "OTHER";

export type Gender = "M" | "F";

export type SlotType = "SPRINT" | "DISTANCE" | "UNIVERSAL" | "WILDCARD";

export type EventCode = string;

export type Stroke = "FREE" | "BACK" | "BREAST" | "FLY" | "IM";

export type Attributes = {
  start: number;
  speed: number;
  power: number;
  technique: number;
  endurance: number;
  consistency: number;
};

export type Swimmer = {
  id: string;
  name: string;
  country: string;
  gender: Gender;
  archetype: Archetype;
  events: EventCode[];
  attributes: Attributes;
  ovr: number;
  basePrice: number;
  photo?: string;
  color: string;
};

export type TournamentStatus = "upcoming" | "open" | "locked" | "live" | "finished";

export type Tournament = {
  id: string;
  name: string;
  shortName: string;
  location: string;
  startDate: string;
  endDate: string;
  deadlineAt: string;
  budget: number;
  status: TournamentStatus;
  participantSwimmerIds: string[];
};

export type TeamPick = {
  swimmerId: string;
  slot: SlotType;
};

export type Team = {
  id: string;
  userId: string;
  tournamentId: string;
  picks: TeamPick[];
  captainId: string | null;
  totalCost: number;
  createdAt: string;
  lockedAt: string | null;
  transfersUsed: number;
};

export type EventResult = {
  swimmerId: string;
  event: EventCode;
  place: number;
  time: string;
  waPoints: number;
  bonusPoints: number;
  totalFp: number;
};

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  teamName: string;
  totalPoints: number;
  isYou: boolean;
};
