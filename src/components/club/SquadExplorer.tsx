"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, ChevronLeft, ChevronRight, Users, LayoutGrid } from "lucide-react";
import type { PlayerRecord } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LuxuryPlayerCard } from "@/components/club/LuxuryPlayerCard";
import { TacticalPitchBuilder } from "@/components/club/TacticalPitchBuilder";
import { cn } from "@/lib/utils";

interface SquadExplorerProps {
  locale: Locale;
  dict: Dictionary;
  players: PlayerRecord[];
}

export function SquadExplorer({ locale, dict, players }: SquadExplorerProps) {
  const [viewMode, setViewMode] = useState<"tactical" | "roster">("tactical");
  const [squadFilter, setSquadFilter] = useState<"all" | "first_team" | "u23" | "academy">("all");
  const [posFilter, setPosFilter] = useState<"ALL" | "GK" | "DEF" | "MID" | "FWD" | "STAFF">("ALL");
  const [activePlayer, setActivePlayer] = useState<PlayerRecord | null>(null);

  const filtered = players.filter((p) => {
    const matchSquad = squadFilter === "all" || p.squad === squadFilter;
    const matchPos = posFilter === "ALL" || p.position === posFilter;
    return matchSquad && matchPos;
  });

  const squadTabs = [
    { id: "all" as const, label: dict.squad.allPositions },
    { id: "first_team" as const, label: dict.squad.firstTeam },
    { id: "u23" as const, label: dict.squad.u23 },
    { id: "academy" as const, label: dict.squad.academy },
  ];

  const posTabs = [
    { id: "ALL" as const, label: dict.squad.allPositions },
    { id: "GK" as const, label: dict.squad.gk },
    { id: "DEF" as const, label: dict.squad.def },
    { id: "MID" as const, label: dict.squad.mid },
    { id: "FWD" as const, label: dict.squad.fwd },
    { id: "STAFF" as const, label: dict.squad.staff },
  ];

  function cyclePlayer(dir: -1 | 1) {
    if (!activePlayer || players.length === 0) return;
    const idx = players.findIndex((p) => p.id === activePlayer.id);
    const nextIdx = (idx + dir + players.length) % players.length;
    setActivePlayer(players[nextIdx]);
  }

  return (
    <div className="space-y-10">
      {/* Mode Switcher: Playable Pitch vs Full Roster */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-xl border border-[#DCE3EE] bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("tactical")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-extrabold transition-all cursor-pointer",
              viewMode === "tactical"
                ? "bg-[#0A2240] text-white shadow-sm"
                : "text-slate-600 hover:text-[#071426]"
            )}
          >
            <Users className="h-4 w-4 text-[#D5A84B]" />
            <span>{dict.interactive.tabTactical}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("roster")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-extrabold transition-all cursor-pointer",
              viewMode === "roster"
                ? "bg-[#0A2240] text-white shadow-sm"
                : "text-slate-600 hover:text-[#071426]"
            )}
          >
            <LayoutGrid className="h-4 w-4 text-[#2678FF]" />
            <span>{dict.interactive.tabRoster}</span>
          </button>
        </div>
      </div>

      {viewMode === "tactical" && (
        <TacticalPitchBuilder
          locale={locale}
          dict={dict}
          players={players}
          onInspectPlayer={(p) => setActivePlayer(p)}
        />
      )}

      {/* Squad Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-[#DCE3EE] pt-8">
        <div className="flex flex-wrap gap-2">
          {squadTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSquadFilter(t.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-colors cursor-pointer",
                squadFilter === t.id
                  ? "bg-[#0A2240] text-white shadow-xs"
                  : "border border-[#DCE3EE] bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {posTabs.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPosFilter(p.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer",
                posFilter === p.id
                  ? "bg-[#2678FF] text-white"
                  : "border border-[#DCE3EE] bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#DCE3EE] bg-white p-10 text-center text-sm text-slate-500">
          {dict.news.noResults}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((player) => (
            <LuxuryPlayerCard
              key={player.id}
              player={player}
              locale={locale}
              dict={dict}
              showStats
              onSelect={() => setActivePlayer(player)}
            />
          ))}
        </div>
      )}

      {/* Interactive Player Dossier Modal */}
      <Dialog
        open={Boolean(activePlayer)}
        onOpenChange={(open) => !open && setActivePlayer(null)}
      >
        <DialogContent className="bg-white text-[#071426] sm:max-w-xl">
          {activePlayer && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between gap-2 pe-8">
                  <div className="flex items-center gap-2">
                    <Badge variant="gold">#{activePlayer.number}</Badge>
                    <Badge variant="blue">{activePlayer.position}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => cyclePlayer(-1)}
                      aria-label="Previous player"
                      className="rounded-lg border border-[#DCE3EE] p-1.5 hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => cyclePlayer(1)}
                      aria-label="Next player"
                      className="rounded-lg border border-[#DCE3EE] p-1.5 hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
                <DialogTitle className="pt-2 text-2xl font-black">
                  {locale === "ar" ? activePlayer.nameAr : activePlayer.nameEn}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative h-48 w-40 shrink-0 overflow-hidden rounded-2xl border border-[#D5A84B]/40 bg-gradient-to-b from-[#17437E] to-[#071426] shadow-lg">
                  <Image
                    src={activePlayer.imageUrl}
                    alt={locale === "ar" ? activePlayer.nameAr : activePlayer.nameEn}
                    fill
                    unoptimized={activePlayer.imageUrl.startsWith("/uploads/")}
                    className="object-contain object-bottom pt-2"
                  />
                </div>
                <div className="space-y-3 text-center sm:text-start">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b8892a]">
                    {dict.squad.nationality}:{" "}
                    {locale === "ar"
                      ? activePlayer.nationalityAr
                      : activePlayer.nationalityEn}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {locale === "ar" ? activePlayer.bioAr : activePlayer.bioEn}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl border border-[#DCE3EE] bg-[#F5F7FA] p-4 text-center tabular-nums">
                <div>
                  <Award className="mx-auto mb-1 h-4 w-4 text-[#2678FF]" />
                  <span className="text-xl font-black text-[#071426]">
                    {activePlayer.appearances}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {dict.squad.appearances}
                  </span>
                </div>
                <div>
                  <span className="mt-5 block text-xl font-black text-[#2678FF]">
                    {activePlayer.goals}
                  </span>
                  <span className="block text-xs text-slate-500">{dict.squad.goals}</span>
                </div>
                <div>
                  <span className="mt-5 block text-xl font-black text-[#b8892a]">
                    {activePlayer.assists}
                  </span>
                  <span className="block text-xs text-slate-500">{dict.squad.assists}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
