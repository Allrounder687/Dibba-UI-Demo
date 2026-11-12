"use client";

import { useState } from "react";
import { Ticket, Sparkles, Check } from "lucide-react";
import type { MatchRecord } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatMatchDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

interface StadiumSeatSelectorProps {
  locale: Locale;
  dict: Dictionary;
  nextMatch?: MatchRecord;
}

export function StadiumSeatSelector({
  locale,
  dict,
  nextMatch,
}: StadiumSeatSelectorProps) {
  const stands = dict.commercial.stands;
  const [selectedStandId, setSelectedStandId] = useState(stands[0]?.id ?? "vip-box");
  const [prefill, setPrefill] = useState<{
    program?: string;
    subject?: string;
    message?: string;
  }>({});

  const activeStand = stands.find((s) => s.id === selectedStandId) || stands[0];
  const standOptions = stands.map((s) => `${s.name} (${s.price})`);

  function handleLockStand(stand: (typeof stands)[number]) {
    setSelectedStandId(stand.id);
    const fixtureText = nextMatch
      ? `${nextMatch.homeTeamEn} vs ${nextMatch.awayTeamEn}`
      : "Upcoming Dibba Stadium Fixture";
    setPrefill({
      program: `${stand.name} (${stand.price})`,
      subject: `Matchday Seat Reservation — ${stand.name}`,
      message: `Requesting seats in ${stand.name} (${stand.price}) for ${fixtureText}.`,
    });
    document.getElementById("ticket-reservation-form")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-12">
      {/* Interactive Stadium Bowl */}
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A2240] via-[#071426] to-[#050D1A] p-6 text-white shadow-2xl sm:p-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{dict.interactive.stadiumMapEyebrow}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {dict.interactive.stadiumMapTitle}
            </h2>
            <p className="max-w-2xl text-sm text-white/75">
              {dict.interactive.stadiumMapSubtitle}
            </p>
          </div>
          {nextMatch && (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs">
              <span className="block font-bold text-[#D5A84B]">
                {locale === "ar" ? nextMatch.homeTeamAr : nextMatch.homeTeamEn} {dict.matches.vs}{" "}
                {locale === "ar" ? nextMatch.awayTeamAr : nextMatch.awayTeamEn}
              </span>
              <span className="text-white/70">{formatMatchDate(nextMatch.kickoffAt, locale)}</span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Interactive Stadium Bowl Diagram */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#050D1A]/80 p-4 sm:p-6 space-y-3">
              {/* Top Tier: Main East Stand */}
              <button
                type="button"
                onClick={() => setSelectedStandId(stands[1]?.id ?? "cat-1")}
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-center transition-all cursor-pointer",
                  selectedStandId === (stands[1]?.id ?? "cat-1")
                    ? "border-[#2678FF] bg-[#2678FF]/30 text-white shadow-lg shadow-[#2678FF]/20"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-[#2678FF]/60"
                )}
              >
                <span className="block text-xs font-extrabold uppercase tracking-wider">
                  {stands[1]?.name}
                </span>
                <span className="text-[11px] font-bold text-[#66A3FF]">{stands[1]?.price}</span>
              </button>

              {/* Middle Row: North Curve + Pitch + VIP */}
              <div className="grid grid-cols-12 gap-3 items-stretch">
                <button
                  type="button"
                  onClick={() => setSelectedStandId(stands[2]?.id ?? "cat-2")}
                  className={cn(
                    "col-span-3 flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all cursor-pointer",
                    selectedStandId === (stands[2]?.id ?? "cat-2")
                      ? "border-emerald-400 bg-emerald-500/25 text-white shadow-lg"
                      : "border-white/15 bg-white/5 text-white/75 hover:border-emerald-400/60"
                  )}
                >
                  <span className="text-[11px] font-extrabold leading-tight">
                    {stands[2]?.name}
                  </span>
                  <span className="mt-1 text-[10px] font-bold text-emerald-300">
                    {stands[2]?.price}
                  </span>
                </button>

                {/* Turf Pitch */}
                <div className="col-span-9 relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/25 pitch-turf">
                  <svg
                    viewBox="0 0 160 100"
                    className="pointer-events-none h-full w-full opacity-45"
                  >
                    <rect x="6" y="6" width="148" height="88" fill="none" stroke="#fff" strokeWidth="1.2" />
                    <line x1="80" y1="6" x2="80" y2="94" stroke="#fff" strokeWidth="1" />
                    <circle cx="80" cy="50" r="14" fill="none" stroke="#fff" strokeWidth="1" />
                    <rect x="6" y="28" width="22" height="44" fill="none" stroke="#fff" strokeWidth="1" />
                    <rect x="132" y="28" width="22" height="44" fill="none" stroke="#fff" strokeWidth="1" />
                  </svg>
                  <span className="absolute rounded-full bg-[#050E1B]/80 px-3 py-1 text-[10px] font-black tracking-[0.2em] text-white/85 backdrop-blur-xs">
                    {dict.interactive.pitchLabel}
                  </span>
                </div>
              </div>

              {/* Bottom Tier: VIP Royal Box */}
              <button
                type="button"
                onClick={() => setSelectedStandId(stands[0]?.id ?? "vip-box")}
                className={cn(
                  "w-full rounded-xl border px-4 py-3.5 text-center transition-all cursor-pointer",
                  selectedStandId === (stands[0]?.id ?? "vip-box")
                    ? "border-[#D5A84B] bg-[#D5A84B]/25 text-white shadow-lg shadow-[#D5A84B]/20"
                    : "border-white/15 bg-white/5 text-white/75 hover:border-[#D5A84B]/60"
                )}
              >
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#D5A84B]">
                  {stands[0]?.name}
                </span>
                <span className="text-[11px] font-bold text-white/85">{stands[0]?.price}</span>
              </button>
            </div>
          </div>

          {/* Active Stand Details Card */}
          <div className="space-y-4 lg:col-span-5">
            {stands.map((stand) => {
              const selected = stand.id === activeStand?.id;
              return (
                <div
                  key={stand.id}
                  onClick={() => setSelectedStandId(stand.id)}
                  className={cn(
                    "rounded-2xl border p-5 transition-all cursor-pointer",
                    selected
                      ? "border-[#D5A84B] bg-[#0A2240] shadow-xl"
                      : "border-white/10 bg-[#050E1B]/70 opacity-80 hover:opacity-100"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Ticket className="h-5 w-5 text-[#D5A84B]" />
                      <h3 className="text-base font-extrabold text-white">{stand.name}</h3>
                    </div>
                    <span className="text-lg font-black text-[#D5A84B] tabular-nums">
                      {stand.price}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/75">{stand.desc}</p>
                  {selected && (
                    <Button
                      type="button"
                      variant="gold"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLockStand(stand);
                      }}
                    >
                      <Check className="h-4 w-4" />
                      <span>{dict.interactive.reserveStandButton}</span>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ticket Reservation Form */}
      <Card id="ticket-reservation-form" className="border-[#DCE3EE] bg-white">
        <CardContent className="p-6 sm:p-10">
          <h2 className="mb-6 text-2xl font-black text-[#071426]">
            {dict.matches.reserveSeats}
          </h2>
          <EnquiryForm
            dict={dict}
            type="ticket_interest"
            programOptions={standOptions}
            defaultSubject="Matchday Seat Reservation"
            prefilledProgram={prefill.program}
            prefilledSubject={prefill.subject}
            prefilledMessage={prefill.message}
          />
        </CardContent>
      </Card>
    </div>
  );
}
