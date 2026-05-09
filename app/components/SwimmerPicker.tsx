"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Dict } from "../lib/i18n";
import type { SlotType, Swimmer } from "../lib/types";
import { swimmers } from "../lib/swimmers";

type Filter = "ALL" | "SPRINT" | "DISTANCE" | "UNIVERSAL" | "F" | "M";

export function SwimmerPicker({
  slot,
  onPick,
  onClose,
  selectedIds,
  remainingBudget,
  participantIds,
  t,
}: {
  slot: SlotType;
  onPick: (swimmer: Swimmer) => void;
  onClose: () => void;
  selectedIds: string[];
  remainingBudget: number;
  participantIds: string[];
  t: Dict;
}) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = useMemo(() => {
    const inTournament = swimmers.filter((s) => participantIds.includes(s.id));
    let pool = inTournament;
    if (slot === "SPRINT") pool = pool.filter((s) => s.archetype === "SPRINT");
    if (slot === "DISTANCE") pool = pool.filter((s) => s.archetype === "DISTANCE");
    if (slot === "UNIVERSAL") pool = pool.filter((s) => s.archetype === "UNIVERSAL");

    if (filter === "SPRINT") pool = pool.filter((s) => s.archetype === "SPRINT");
    if (filter === "DISTANCE") pool = pool.filter((s) => s.archetype === "DISTANCE");
    if (filter === "UNIVERSAL") pool = pool.filter((s) => s.archetype === "UNIVERSAL");
    if (filter === "F") pool = pool.filter((s) => s.gender === "F");
    if (filter === "M") pool = pool.filter((s) => s.gender === "M");

    return [...pool].sort((a, b) => b.basePrice - a.basePrice);
  }, [filter, slot, participantIds]);

  const slotTitle =
    slot === "SPRINT"
      ? t.slotSprint
      : slot === "DISTANCE"
        ? t.slotDistance
        : slot === "UNIVERSAL"
          ? t.slotUniversal
          : t.slotWildcard;

  const showFilters = slot === "WILDCARD";

  return (
    <div className="modal-backdrop">
      <div className="modal-header">
        <h3 className="modal-title">
          {t.chooseSwimmer} · {slotTitle}
        </h3>

        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <div className="modal-body">
        {showFilters && (
          <div className="filter-row">
            {(
              [
                ["ALL", t.filterAll],
                ["SPRINT", t.filterSprint],
                ["DISTANCE", t.filterDistance],
                ["UNIVERSAL", t.filterUniversal],
                ["F", t.filterWomen],
                ["M", t.filterMen],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                className={`filter-chip ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {filtered.map((s) => {
          const isSelected = selectedIds.includes(s.id);
          const overBudget = !isSelected && s.basePrice > remainingBudget;
          return (
            <button
              key={s.id}
              className={`swimmer-row ${isSelected ? "selected" : ""} ${
                overBudget ? "disabled" : ""
              }`}
              onClick={() => {
                if (isSelected) return;
                if (overBudget) return;
                onPick(s);
              }}
              style={{ width: "100%", textAlign: "left", border: "1px solid transparent" }}
            >
              <div className="swimmer-avatar">{initials(s.name)}</div>

              <div className="swimmer-info">
                <p className="swimmer-name">{s.name}</p>

                <div className="swimmer-meta">
                  <span className="swimmer-tag">{s.country}</span>
                  <span className="swimmer-tag">{s.gender === "F" ? t.female : t.male}</span>
                  <span className={`archetype-tag ${s.archetype}`}>{s.archetype}</span>
                  <span className="swimmer-tag gold">OVR {s.ovr}</span>
                </div>
              </div>

              <div className="swimmer-price">
                {s.basePrice}
                <br />
                <span style={{ fontSize: 10, color: "#aaa" }}>{t.currency}</span>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && <p className="muted">—</p>}
      </div>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}
