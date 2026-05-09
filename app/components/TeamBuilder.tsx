"use client";

import { useMemo, useState } from "react";
import { Crown, Plus, Lock } from "lucide-react";
import type { Dict } from "../lib/i18n";
import type { Swimmer, TeamPick, Tournament, SlotType, Team } from "../lib/types";
import { swimmers } from "../lib/swimmers";
import { SLOT_LAYOUT, teamCost, validateTeam, type TeamValidationError } from "../lib/scoring";
import { SwimmerPicker } from "./SwimmerPicker";
import { haptic } from "../lib/telegram";

export function TeamBuilder({
  tournament,
  initialTeam,
  onLock,
  t,
  userId,
  locked,
}: {
  tournament: Tournament;
  initialTeam: Team | null;
  onLock: (team: Team) => void;
  t: Dict;
  userId: string;
  locked: boolean;
}) {
  const [picks, setPicks] = useState<(TeamPick | null)[]>(() => {
    if (!initialTeam) return SLOT_LAYOUT.map(() => null);
    const result: (TeamPick | null)[] = SLOT_LAYOUT.map(() => null);
    initialTeam.picks.forEach((p) => {
      const idx = result.findIndex((r, i) => r === null && SLOT_LAYOUT[i] === p.slot);
      if (idx >= 0) result[idx] = p;
    });
    return result;
  });

  const [captainId, setCaptainId] = useState<string | null>(initialTeam?.captainId ?? null);
  const [pickerSlot, setPickerSlot] = useState<{ index: number; slot: SlotType } | null>(null);

  const compactPicks: TeamPick[] = useMemo(
    () =>
      picks
        .map((p, i) => (p ? { swimmerId: p.swimmerId, slot: SLOT_LAYOUT[i] } : null))
        .filter((p): p is TeamPick => p !== null),
    [picks]
  );

  const cost = teamCost(compactPicks);
  const remaining = tournament.budget - cost;

  const errors = validateTeam(compactPicks, captainId, tournament.budget);
  const isReady = errors.length === 0;

  const setPickAt = (index: number, swimmer: Swimmer) => {
    setPicks((prev) => {
      const next = [...prev];
      next[index] = { swimmerId: swimmer.id, slot: SLOT_LAYOUT[index] };
      return next;
    });
    haptic("light");
  };

  const removeAt = (index: number) => {
    setPicks((prev) => {
      const next = [...prev];
      const removed = next[index];
      next[index] = null;
      if (removed && captainId === removed.swimmerId) setCaptainId(null);
      return next;
    });
    haptic("light");
  };

  const toggleCaptain = (swimmerId: string) => {
    setCaptainId((prev) => (prev === swimmerId ? null : swimmerId));
    haptic("medium");
  };

  const handleLock = () => {
    if (!isReady) return;
    const team: Team = {
      id: initialTeam?.id ?? `team-${Date.now()}`,
      userId,
      tournamentId: tournament.id,
      picks: compactPicks,
      captainId,
      totalCost: cost,
      createdAt: initialTeam?.createdAt ?? new Date().toISOString(),
      lockedAt: new Date().toISOString(),
      transfersUsed: initialTeam?.transfersUsed ?? 0,
    };
    onLock(team);
    haptic("heavy");
  };

  return (
    <div>
      <div className="panel">
        <p className="kicker">{t.teamBuilder}</p>
        <h2 className="section-title" style={{ marginBottom: 6 }}>
          {tournament.shortName}
        </h2>
        <p className="muted" style={{ marginBottom: 12 }}>{t.rulesText}</p>

        <BudgetBar budget={tournament.budget} cost={cost} t={t} />
      </div>

      <div className="team-grid">
        {SLOT_LAYOUT.map((slot, i) => {
          const pick = picks[i];
          const swimmer = pick ? swimmers.find((s) => s.id === pick.swimmerId) : null;
          const isCaptain = swimmer?.id === captainId;

          return (
            <div
              key={i}
              className={`slot ${swimmer ? "filled" : ""} ${i < 3 ? "span-2" : ""}`}
              onClick={() => {
                if (locked) return;
                if (swimmer) {
                  removeAt(i);
                } else {
                  setPickerSlot({ index: i, slot });
                }
              }}
            >
              <div className="slot-label">
                {slot === "SPRINT"
                  ? t.slotSprint
                  : slot === "DISTANCE"
                    ? t.slotDistance
                    : slot === "UNIVERSAL"
                      ? t.slotUniversal
                      : t.slotWildcard}
              </div>

              {swimmer ? (
                <>
                  <div className="slot-name">{swimmer.name}</div>

                  <div className="slot-meta">
                    <span className="swimmer-tag">{swimmer.country}</span>
                    <span className={`archetype-tag ${swimmer.archetype}`}>{swimmer.archetype}</span>
                  </div>

                  <div className="slot-price">{swimmer.basePrice} {t.currency}</div>

                  {!locked && (
                    <button
                      className="slot-captain"
                      title={t.setCaptain}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCaptain(swimmer.id);
                      }}
                      style={
                        isCaptain
                          ? undefined
                          : { background: "rgba(255,255,255,0.08)", color: "#888" }
                      }
                    >
                      {isCaptain ? <Crown size={11} /> : "C"}
                    </button>
                  )}

                  {locked && isCaptain && (
                    <div className="slot-captain">
                      <Crown size={11} />
                    </div>
                  )}
                </>
              ) : (
                <div className="slot-empty">
                  <Plus size={24} strokeWidth={2} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!locked && (
        <>
          {errors.length > 0 && (
            <ul className="errors-list">
              {errors.map((e) => (
                <li key={e}>{errorMessage(e, t)}</li>
              ))}
            </ul>
          )}

          {isReady && <p className="success-msg">{t.teamComplete}</p>}

          <button className="btn btn-gold" disabled={!isReady} onClick={handleLock}>
            {initialTeam?.lockedAt ? t.save : t.submit}
          </button>
        </>
      )}

      {locked && (
        <div className="banner-info">
          <Lock size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
          {t.teamLocked}
        </div>
      )}

      {pickerSlot && (
        <SwimmerPicker
          slot={pickerSlot.slot}
          onPick={(s) => {
            setPickAt(pickerSlot.index, s);
            setPickerSlot(null);
          }}
          onClose={() => setPickerSlot(null)}
          selectedIds={compactPicks.map((p) => p.swimmerId)}
          remainingBudget={remaining}
          participantIds={tournament.participantSwimmerIds}
          t={t}
        />
      )}
    </div>
  );
}

function BudgetBar({ budget, cost, t }: { budget: number; cost: number; t: Dict }) {
  const ratio = Math.min(cost / budget, 1.4);
  const over = cost > budget;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800 }}>
        <span style={{ color: "var(--muted)" }}>{t.budget}</span>
        <span style={{ color: over ? "var(--danger)" : "var(--gold)" }}>
          {cost} / {budget} {t.currency}
        </span>
      </div>

      <div className="budget-bar">
        <div
          className={`budget-bar-fill ${over ? "over" : ""}`}
          style={{ width: `${Math.min(ratio * 100, 100)}%` }}
        />
      </div>

      <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>
        {t.remaining}: {budget - cost} {t.currency}
      </div>
    </div>
  );
}

function errorMessage(e: TeamValidationError, t: Dict): string {
  switch (e) {
    case "WRONG_PICK_COUNT":
      return t.errCount;
    case "BUDGET_EXCEEDED":
      return t.errBudget;
    case "MIN_WOMEN":
      return t.errWomen;
    case "MIN_MEN":
      return t.errMen;
    case "MAX_PER_COUNTRY":
      return t.errCountry;
    case "BAD_SPRINT_SLOT":
      return t.errSprint;
    case "BAD_DISTANCE_SLOT":
      return t.errDistance;
    case "BAD_UNIVERSAL_SLOT":
      return t.errUniversal;
    case "NO_CAPTAIN":
    case "CAPTAIN_NOT_IN_TEAM":
      return t.errCaptain;
    default:
      return e;
  }
}
