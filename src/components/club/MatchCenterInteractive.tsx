"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Trophy, Info } from "lucide-react";
import type { MatchRecord, StandingRow } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatMatchDate, formatMatchTime, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MatchCenterInteractiveProps {
  locale: Locale;
  dict: Dictionary;
  matches: MatchRecord[];
  standings: StandingRow[];
}

export function MatchCenterInteractive({
  locale,
  dict,
  matches,
  standings,
}: MatchCenterInteractiveProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);
  const [predictions, setPredictions] = useState<Record<number, "home" | "draw" | "away">>({});

  const dibbaRow = standings.find((r) => r.teamEn === "Dibba FC");

  const upcoming = matches
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => new Date(a.kickoffAt).getTime() - new Date(b.kickoffAt).getTime());
  const results = matches
    .filter((m) => m.status === "finished")
    .sort((a, b) => new Date(b.kickoffAt).getTime() - new Date(a.kickoffAt).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2678FF]/25 bg-white px-4 py-3 text-xs text-slate-700 shadow-xs">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[#2678FF]" />
          <span className="font-medium">{dict.matches.demoBadge}</span>
        </div>
        <Badge variant="gold">UAE First Division</Badge>
      </div>

      {dibbaRow && (
        <div className="grid gap-3 rounded-2xl border border-[#0A2240]/15 bg-gradient-to-r from-[#071426] via-[#0A2240] to-[#071426] p-5 text-white shadow-lg sm:grid-cols-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D5A84B]">
              {dict.matches.pos}
            </span>
            <p className="mt-1 text-2xl font-black tabular-nums">#{dibbaRow.position}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#66A3FF]">
              {dict.matches.pts}
            </span>
            <p className="mt-1 text-2xl font-black tabular-nums">{dibbaRow.points}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              {dict.matches.gd}
            </span>
            <p className="mt-1 text-2xl font-black tabular-nums">
              {dibbaRow.goalDiff > 0 ? `+${dibbaRow.goalDiff}` : dibbaRow.goalDiff}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              {dict.matches.form}
            </span>
            <div className="mt-2 flex items-center gap-1.5">
              {dibbaRow.form.map((f, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-black",
                    f === "W" && "bg-emerald-500/25 text-emerald-300",
                    f === "D" && "bg-amber-500/25 text-amber-300",
                    f === "L" && "bg-red-500/25 text-red-300"
                  )}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="fixtures" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fixtures">
            {dict.matches.upcomingFixtures} ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="results">
            {dict.matches.recentResults} ({results.length})
          </TabsTrigger>
          <TabsTrigger value="table">{dict.matches.leagueTable}</TabsTrigger>
        </TabsList>

        <TabsContent value="fixtures" className="grid gap-5 md:grid-cols-2">
          {upcoming.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              locale={locale}
              dict={dict}
              onSelect={() => setSelectedMatch(match)}
            />
          ))}
        </TabsContent>

        <TabsContent value="results" className="grid gap-5 md:grid-cols-2">
          {results.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              locale={locale}
              dict={dict}
              onSelect={() => setSelectedMatch(match)}
            />
          ))}
        </TabsContent>

        <TabsContent value="table">
          <Card className="overflow-x-auto border-[#DCE3EE] bg-white">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-[#DCE3EE] bg-[#0A2240] text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-4 py-3.5 text-start">{dict.matches.pos}</th>
                  <th className="px-4 py-3.5 text-start">{dict.matches.club}</th>
                  <th className="px-3 py-3.5 text-center">{dict.matches.played}</th>
                  <th className="px-3 py-3.5 text-center">{dict.matches.won}</th>
                  <th className="px-3 py-3.5 text-center">{dict.matches.drawn}</th>
                  <th className="px-3 py-3.5 text-center">{dict.matches.lost}</th>
                  <th className="px-3 py-3.5 text-center">{dict.matches.gd}</th>
                  <th className="px-4 py-3.5 text-center">{dict.matches.pts}</th>
                  <th className="px-4 py-3.5 text-end">{dict.matches.form}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE3EE] tabular-nums">
                {standings.map((row) => {
                  const isDibba = row.teamEn === "Dibba FC";
                  return (
                    <tr
                      key={row.position}
                      className={cn(
                        "transition-colors hover:bg-slate-50",
                        isDibba && "bg-[#2678FF]/10 font-bold"
                      )}
                    >
                      <td className="px-4 py-3.5 font-extrabold text-[#0A2240]">
                        {row.position}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={row.logo}
                            alt={locale === "ar" ? row.teamAr : row.teamEn}
                            width={28}
                            height={28}
                            className="h-7 w-7 object-contain"
                          />
                          <span className="text-[#071426]">
                            {locale === "ar" ? row.teamAr : row.teamEn}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-center text-slate-700">{row.played}</td>
                      <td className="px-3 py-3.5 text-center text-slate-700">{row.won}</td>
                      <td className="px-3 py-3.5 text-center text-slate-700">{row.drawn}</td>
                      <td className="px-3 py-3.5 text-center text-slate-700">{row.lost}</td>
                      <td className="px-3 py-3.5 text-center text-slate-700">
                        {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                      </td>
                      <td className="px-4 py-3.5 text-center font-black text-[#071426]">
                        {row.points}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {row.form.map((f, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
                                f === "W" && "bg-emerald-500/20 text-emerald-700",
                                f === "D" && "bg-amber-500/20 text-amber-700",
                                f === "L" && "bg-red-500/20 text-red-700"
                              )}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Match Detail Modal */}
      <Dialog
        open={Boolean(selectedMatch)}
        onOpenChange={(open) => !open && setSelectedMatch(null)}
      >
        <DialogContent className="bg-white text-[#071426]">
          {selectedMatch && (
            <div className="space-y-5">
              <DialogHeader>
                <Badge variant="blue" className="w-fit">
                  {locale === "ar"
                    ? selectedMatch.competitionAr
                    : selectedMatch.competitionEn}
                </Badge>
                <DialogTitle className="pt-2 text-xl font-extrabold">
                  {locale === "ar" ? selectedMatch.homeTeamAr : selectedMatch.homeTeamEn}{" "}
                  {dict.matches.vs}{" "}
                  {locale === "ar" ? selectedMatch.awayTeamAr : selectedMatch.awayTeamEn}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-3 items-center gap-4 rounded-xl bg-[#0A2240] p-5 text-center text-white">
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={selectedMatch.homeLogo}
                    alt={selectedMatch.homeTeamEn}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-sm font-bold">
                    {locale === "ar" ? selectedMatch.homeTeamAr : selectedMatch.homeTeamEn}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 tabular-nums">
                  {selectedMatch.status === "finished" ? (
                    <div className="text-3xl font-black">
                      {selectedMatch.homeScore} : {selectedMatch.awayScore}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-[#D5A84B] px-3 py-1 text-sm font-black text-[#071426]">
                      {dict.matches.vs}
                    </div>
                  )}
                  <span className="text-xs text-white/70">
                    {selectedMatch.status === "finished"
                      ? dict.matches.fullTime
                      : formatMatchTime(selectedMatch.kickoffAt, locale)}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={selectedMatch.awayLogo}
                    alt={selectedMatch.awayTeamEn}
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-sm font-bold">
                    {locale === "ar" ? selectedMatch.awayTeamAr : selectedMatch.awayTeamEn}
                  </span>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-[#DCE3EE] bg-[#F5F7FA] p-4 text-xs text-slate-700">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#2678FF]" />
                  <span>{formatMatchDate(selectedMatch.kickoffAt, locale)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#2678FF]" />
                  <span>{locale === "ar" ? selectedMatch.venueAr : selectedMatch.venueEn}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#D5A84B]" />
                  <span>
                    {locale === "ar"
                      ? selectedMatch.competitionAr
                      : selectedMatch.competitionEn}
                  </span>
                </p>
              </div>

              {selectedMatch.status === "scheduled" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#DCE3EE] bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold uppercase tracking-wider text-[#0A2240]">
                        {dict.interactive.predictorTitle}
                      </span>
                      <span className="text-slate-500 tabular-nums">
                        {predictions[selectedMatch.id] ? "249" : "248"} {dict.interactive.fansVoted}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { key: "home" as const, label: dict.interactive.homeWin, base: 62 },
                          { key: "draw" as const, label: dict.interactive.draw, base: 20 },
                          { key: "away" as const, label: dict.interactive.awayWin, base: 18 },
                        ]
                      ).map((opt) => {
                        const chosen = predictions[selectedMatch.id] === opt.key;
                        const pct = chosen ? Math.min(88, opt.base + 4) : opt.base;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() =>
                              setPredictions((prev) => ({
                                ...prev,
                                [selectedMatch.id]: opt.key,
                              }))
                            }
                            className={cn(
                              "rounded-lg border p-2.5 text-center transition-all cursor-pointer",
                              chosen
                                ? "border-[#2678FF] bg-[#2678FF]/10 text-[#071426] ring-2 ring-[#2678FF]/30"
                                : "border-[#DCE3EE] bg-[#F5F7FA] text-slate-700 hover:border-[#2678FF]/50"
                            )}
                          >
                            <span className="block text-[11px] font-bold">{opt.label}</span>
                            <span className="mt-0.5 block text-sm font-black text-[#2678FF] tabular-nums">
                              {pct}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button asChild variant="gold" className="w-full">
                    <Link href={`/${locale}/tickets`}>{dict.matches.reserveSeats}</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MatchCard({
  match,
  locale,
  dict,
  onSelect,
}: {
  match: MatchRecord;
  locale: Locale;
  dict: Dictionary;
  onSelect: () => void;
}) {
  return (
    <Card className="flex flex-col justify-between border-[#DCE3EE] bg-white p-5 transition-all hover:shadow-md hover:border-[#2678FF]/40">
      <div className="mb-4 flex items-center justify-between gap-2 text-xs">
        <span className="font-bold text-[#2678FF]">
          {locale === "ar" ? match.competitionAr : match.competitionEn}
        </span>
        <Badge variant={match.status === "finished" ? "default" : "gold"}>
          {match.status === "finished" ? dict.matches.fullTime : dict.matches.scheduled}
        </Badge>
      </div>

      <div className="grid grid-cols-3 items-center gap-3 py-2">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src={match.homeLogo}
            alt={match.homeTeamEn}
            width={52}
            height={52}
            className="h-12 w-12 object-contain"
          />
          <span className="text-sm font-bold text-[#071426] leading-tight">
            {locale === "ar" ? match.homeTeamAr : match.homeTeamEn}
          </span>
        </div>

        <div className="text-center tabular-nums">
          {match.status === "finished" ? (
            <div className="text-2xl font-black text-[#071426]">
              {match.homeScore} – {match.awayScore}
            </div>
          ) : (
            <div className="space-y-1">
              <span className="inline-block rounded-md bg-[#0A2240] px-2.5 py-0.5 text-xs font-bold text-white">
                {formatMatchTime(match.kickoffAt, locale)}
              </span>
              <p className="text-[11px] font-medium text-slate-500">
                {formatMatchDate(match.kickoffAt, locale)}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src={match.awayLogo}
            alt={match.awayTeamEn}
            width={52}
            height={52}
            className="h-12 w-12 object-contain"
          />
          <span className="text-sm font-bold text-[#071426] leading-tight">
            {locale === "ar" ? match.awayTeamAr : match.awayTeamEn}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#DCE3EE] pt-3 text-xs text-slate-600">
        <span className="truncate flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2678FF]" />
          {locale === "ar" ? match.venueAr : match.venueEn}
        </span>
        <button
          type="button"
          onClick={onSelect}
          className="font-bold text-[#2678FF] hover:text-[#071426] transition-colors shrink-0 cursor-pointer"
        >
          {dict.matches.matchDetails}
        </button>
      </div>
    </Card>
  );
}
