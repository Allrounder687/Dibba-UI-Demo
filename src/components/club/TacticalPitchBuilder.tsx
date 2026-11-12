"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { RotateCcw, Sparkles, Shield, Zap, Flame } from "lucide-react";
import type { PlayerRecord } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormationKey = "4-3-3" | "4-2-3-1" | "3-5-2";

interface PitchSlot {
  slotId: string;
  role: "GK" | "DEF" | "MID" | "FWD";
  label: string;
  x: number; // 0..100
  y: number; // 0..100 (top = attack, bottom = GK)
}

const FORMATIONS: Record<FormationKey, PitchSlot[]> = {
  "4-3-3": [
    { slotId: "gk", role: "GK", label: "GK", x: 50, y: 88 },
    { slotId: "lb", role: "DEF", label: "LB", x: 18, y: 70 },
    { slotId: "lcb", role: "DEF", label: "CB", x: 38, y: 73 },
    { slotId: "rcb", role: "DEF", label: "CB", x: 62, y: 73 },
    { slotId: "rb", role: "DEF", label: "RB", x: 82, y: 70 },
    { slotId: "lcm", role: "MID", label: "CM", x: 28, y: 48 },
    { slotId: "cdm", role: "MID", label: "CDM", x: 50, y: 54 },
    { slotId: "rcm", role: "MID", label: "CM", x: 72, y: 48 },
    { slotId: "lw", role: "FWD", label: "LW", x: 22, y: 23 },
    { slotId: "st", role: "FWD", label: "ST", x: 50, y: 17 },
    { slotId: "rw", role: "FWD", label: "RW", x: 78, y: 23 },
  ],
  "4-2-3-1": [
    { slotId: "gk", role: "GK", label: "GK", x: 50, y: 88 },
    { slotId: "lb", role: "DEF", label: "LB", x: 18, y: 71 },
    { slotId: "lcb", role: "DEF", label: "CB", x: 38, y: 74 },
    { slotId: "rcb", role: "DEF", label: "CB", x: 62, y: 74 },
    { slotId: "rb", role: "DEF", label: "RB", x: 82, y: 71 },
    { slotId: "ldm", role: "MID", label: "CDM", x: 36, y: 55 },
    { slotId: "rdm", role: "MID", label: "CDM", x: 64, y: 55 },
    { slotId: "lam", role: "MID", label: "LAM", x: 22, y: 34 },
    { slotId: "cam", role: "MID", label: "CAM", x: 50, y: 36 },
    { slotId: "ram", role: "MID", label: "RAM", x: 78, y: 34 },
    { slotId: "st", role: "FWD", label: "ST", x: 50, y: 16 },
  ],
  "3-5-2": [
    { slotId: "gk", role: "GK", label: "GK", x: 50, y: 88 },
    { slotId: "lcb", role: "DEF", label: "CB", x: 26, y: 73 },
    { slotId: "cb", role: "DEF", label: "CB", x: 50, y: 75 },
    { slotId: "rcb", role: "DEF", label: "CB", x: 74, y: 73 },
    { slotId: "lwb", role: "MID", label: "LWB", x: 15, y: 49 },
    { slotId: "lcm", role: "MID", label: "CM", x: 36, y: 52 },
    { slotId: "cam", role: "MID", label: "CAM", x: 50, y: 38 },
    { slotId: "rcm", role: "MID", label: "CM", x: 64, y: 52 },
    { slotId: "rwb", role: "MID", label: "RWB", x: 85, y: 49 },
    { slotId: "lst", role: "FWD", label: "ST", x: 37, y: 19 },
    { slotId: "rst", role: "FWD", label: "ST", x: 63, y: 19 },
  ],
};

function buildDefaultLineup(
  players: PlayerRecord[],
  formation: FormationKey
): Record<string, PlayerRecord> {
  const activePool = players.filter((p) => p.position !== "STAFF");
  const fallback = activePool[0] || players[0];
  const slots = FORMATIONS[formation];
  const assigned: Record<string, PlayerRecord> = {};
  const usedIds = new Set<number>();

  // First pass: assign matching roles prioritizing unused players
  for (const slot of slots) {
    const exactUnused = activePool.find((p) => p.position === slot.role && !usedIds.has(p.id));
    if (exactUnused) {
      assigned[slot.slotId] = exactUnused;
      usedIds.add(exactUnused.id);
    }
  }

  // Second pass: fill remaining slots with best positional match
  for (const slot of slots) {
    if (assigned[slot.slotId]) continue;
    const anyUnused = activePool.find((p) => !usedIds.has(p.id));
    const roleMatch = activePool.find((p) => p.position === slot.role);
    const chosen = anyUnused || roleMatch || fallback;
    if (chosen) {
      assigned[slot.slotId] = chosen;
      usedIds.add(chosen.id);
    }
  }
  return assigned;
}

interface TacticalPitchBuilderProps {
  locale: Locale;
  dict: Dictionary;
  players: PlayerRecord[];
  onInspectPlayer?: (player: PlayerRecord) => void;
}

export function TacticalPitchBuilder({
  locale,
  dict,
  players,
  onInspectPlayer,
}: TacticalPitchBuilderProps) {
  const [formation, setFormation] = useState<FormationKey>("4-3-3");
  const [lineup, setLineup] = useState<Record<string, PlayerRecord>>(() =>
    buildDefaultLineup(players, "4-3-3")
  );
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const slots = FORMATIONS[formation];
  const selectablePlayers = players.filter((p) => p.position !== "STAFF");

  const metrics = useMemo(() => {
    const fielded = slots.map((s) => lineup[s.slotId]).filter(Boolean);
    const roleMatches = slots.filter((s) => lineup[s.slotId]?.position === s.role).length;
    const totalGoals = fielded.reduce((sum, p) => sum + p.goals, 0);
    const totalAssists = fielded.reduce((sum, p) => sum + p.assists, 0);
    const chemistry = Math.min(99, 68 + Math.round((roleMatches / 11) * 30));
    const attack = Math.min(96, 74 + Math.round((totalGoals + totalAssists) / 3));
    const defense = Math.min(95, 76 + roleMatches * 2);
    return { chemistry, attack, defense };
  }, [lineup, slots]);

  function handleFormationChange(next: FormationKey) {
    setFormation(next);
    setLineup(buildDefaultLineup(players, next));
    setActiveSlotId(null);
  }

  function handleAssignPlayer(slotId: string, player: PlayerRecord) {
    setLineup((prev) => ({ ...prev, [slotId]: player }));
    setActiveSlotId(null);
  }

  const activeSlot = slots.find((s) => s.slotId === activeSlotId) || null;
  const activeSlotPlayer = activeSlot ? lineup[activeSlot.slotId] : null;

  return (
    <div
      id="tactical-pitch"
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A2240] via-[#071426] to-[#050D1A] p-5 text-white shadow-2xl sm:p-8"
    >
      {/* Top Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{dict.interactive.tacticalEyebrow}</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {dict.interactive.tacticalTitle}
          </h2>
          <p className="max-w-2xl text-xs text-white/70 sm:text-sm">
            {dict.interactive.tacticalSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white/60">
            {dict.interactive.formationLabel}:
          </span>
          {(["4-3-3", "4-2-3-1", "3-5-2"] as FormationKey[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => handleFormationChange(fmt)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-black tabular-nums transition-all cursor-pointer",
                formation === fmt
                  ? "bg-[#D5A84B] text-[#071426] shadow-lg shadow-[#D5A84B]/20"
                  : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
              )}
            >
              {fmt}
            </button>
          ))}
          <Button
            type="button"
            variant="outlineLight"
            size="sm"
            onClick={() => setLineup(buildDefaultLineup(players, formation))}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{dict.interactive.autoPick}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Floodlit Pitch Canvas */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-2 border-[#D5A84B]/35 pitch-turf shadow-inner sm:aspect-[16/12] lg:col-span-8">
          {/* Pitch SVG Markings */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
          >
            <rect x="4" y="4" width="92" height="92" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
            <line x1="4" y1="50" x2="96" y2="50" stroke="#FFFFFF" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="0.9" fill="#FFFFFF" />
            <rect x="25" y="4" width="50" height="14" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            <rect x="25" y="82" width="50" height="14" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            <rect x="37" y="4" width="26" height="6" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            <rect x="37" y="90" width="26" height="6" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
          </svg>

          {/* Subtle Stadium Crest Watermark at Center Circle */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15">
            <Image
              src="/assets/dibba-fc-logo-glossly-750.png"
              alt=""
              width={90}
              height={90}
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* 11 Interactive Player Nodes */}
          {slots.map((slot) => {
            const p = lineup[slot.slotId];
            const isSelected = activeSlotId === slot.slotId;
            const roleMatched = p?.position === slot.role;

            return (
              <motion.button
                key={slot.slotId}
                type="button"
                layout
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                onClick={() => setActiveSlotId(isSelected ? null : slot.slotId)}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                className={cn(
                  "group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer focus-visible:outline-none"
                )}
              >
                <div
                  className={cn(
                    "relative h-12 w-12 overflow-hidden rounded-full border-2 bg-gradient-to-b from-[#17437E] to-[#071426] shadow-lg transition-transform group-hover:scale-110 sm:h-14 sm:w-14",
                    isSelected
                      ? "border-[#D5A84B] ring-4 ring-[#D5A84B]/40 scale-110"
                      : roleMatched
                      ? "border-[#2678FF]"
                      : "border-white/50"
                  )}
                >
                  {p && (
                    <Image
                      src={p.imageUrl}
                      alt={locale === "ar" ? p.nameAr : p.nameEn}
                      fill
                      unoptimized={p.imageUrl.startsWith("/uploads/")}
                      className="object-contain object-bottom pt-1"
                    />
                  )}
                  <span className="absolute bottom-0 end-0 rounded-tl bg-[#071426]/90 px-1 text-[9px] font-black text-[#D5A84B] tabular-nums">
                    {p?.number ?? ""}
                  </span>
                </div>

                <div className="mt-1 rounded-md border border-white/15 bg-[#050E1B]/90 px-2 py-0.5 text-center backdrop-blur-xs shadow">
                  <span className="block max-w-[82px] truncate text-[10px] font-bold text-white">
                    {p
                      ? (locale === "ar" ? p.nameAr : p.nameEn).split(" ").slice(-1)[0]
                      : slot.label}
                  </span>
                  <span className="block text-[8px] font-extrabold uppercase tracking-wider text-[#D5A84B]">
                    {slot.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Tactical Telemetry & Player Swap Drawer */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-[#050E1B]/80 p-5 space-y-4">
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#D5A84B]">
                    <Zap className="h-3.5 w-3.5" />
                    {dict.interactive.chemistryLabel}
                  </span>
                  <span className="tabular-nums text-white">{metrics.chemistry}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: `${metrics.chemistry}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-[#2678FF] to-[#D5A84B]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-[#66A3FF]">
                    <Flame className="h-3.5 w-3.5" />
                    {dict.interactive.attackLabel}
                  </span>
                  <span className="tabular-nums text-white">{metrics.attack}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: `${metrics.attack}%` }}
                    className="h-full rounded-full bg-[#2678FF]"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Shield className="h-3.5 w-3.5" />
                    {dict.interactive.defenseLabel}
                  </span>
                  <span className="tabular-nums text-white">{metrics.defense}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: `${metrics.defense}%` }}
                    className="h-full rounded-full bg-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {activeSlot && activeSlotPlayer ? (
            <div className="rounded-2xl border border-[#D5A84B]/40 bg-[#0A2240]/90 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Badge variant="gold">{activeSlot.label}</Badge>
                  <h3 className="mt-1 text-sm font-extrabold text-white">
                    {dict.interactive.swapPlayerTitle}
                  </h3>
                </div>
                {onInspectPlayer && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outlineLight"
                    onClick={() => onInspectPlayer(activeSlotPlayer)}
                  >
                    {dict.interactive.inspectDossier}
                  </Button>
                )}
              </div>

              <div className="max-h-56 space-y-1.5 overflow-y-auto pe-1">
                {selectablePlayers.map((candidate) => {
                  const current = activeSlotPlayer.id === candidate.id;
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => handleAssignPlayer(activeSlot.slotId, candidate)}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-start text-xs transition-colors cursor-pointer",
                        current
                          ? "border-[#D5A84B] bg-[#D5A84B]/15 text-white"
                          : "border-white/10 bg-[#071426]/80 text-white/80 hover:border-[#2678FF]"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-black text-[#D5A84B] tabular-nums">
                          #{candidate.number}
                        </span>
                        <span className="truncate font-bold">
                          {locale === "ar" ? candidate.nameAr : candidate.nameEn}
                        </span>
                      </div>
                      <Badge variant={candidate.position === activeSlot.role ? "blue" : "default"}>
                        {candidate.position}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#050E1B]/50 p-5 text-center text-xs text-white/65">
              {dict.interactive.tapSlotHint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
