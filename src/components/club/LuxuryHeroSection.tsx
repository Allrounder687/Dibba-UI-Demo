"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Shirt,
  Users,
  Sparkles,
} from "lucide-react";
import type { MatchRecord } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatMatchDate, formatMatchTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LuxuryHeroSectionProps {
  locale: Locale;
  dict: Dictionary;
  nextMatch?: MatchRecord;
  lastResult?: MatchRecord;
}

function getCountdownParts(targetIso?: string) {
  if (!targetIso) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export function LuxuryHeroSection({
  locale,
  dict,
  nextMatch,
  lastResult,
}: LuxuryHeroSectionProps) {
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    mins: number;
    secs: number;
  } | null>(null);

  useEffect(() => {
    if (!nextMatch?.kickoffAt) return;
    const tick = () => setCountdown(getCountdownParts(nextMatch.kickoffAt));
    const immediate = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(id);
    };
  }, [nextMatch?.kickoffAt]);

  return (
    <section className="relative bg-[#071426] text-white overflow-hidden">
      <div className="relative min-h-[560px] lg:min-h-[650px] flex items-end">
        <Image
          src="/assets/H0I0851-scaled-rv3cgnc8gmqjvxonfjgdm2gonr09jo6hte61rbflzi.jpg"
          alt="Dibba FC First Team Celebration at Dibba Stadium"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02]"
        />
        {/* Cinematic directional scrims + luxury stadium floodlight rays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071426] via-[#071426]/65 to-[#071426]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071426]/92 via-[#071426]/50 to-transparent rtl:bg-gradient-to-l" />
        <div className="pointer-events-none absolute inset-0 luxury-floodlight" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="space-y-5 lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D5A84B]/50 bg-[#071426]/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D5A84B] backdrop-blur-md shadow-lg">
                <Sparkles className="h-3 w-3" />
                <span>{dict.hero.established}</span>
              </div>

              <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.03]">
                {dict.hero.title}
              </h1>

              <p className="text-base leading-relaxed text-white/85 sm:text-lg max-w-xl">
                {dict.hero.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button asChild size="lg" className="shadow-lg shadow-[#2678FF]/25">
                  <Link href={`/${locale}/matches`}>
                    <span>{dict.hero.ctaPrimary}</span>
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button asChild variant="gold" size="lg">
                  <Link href={`/${locale}/teams#tactical-pitch`}>
                    <Users className="h-4 w-4" />
                    <span>{dict.interactive.buildXiCta}</span>
                  </Link>
                </Button>
                <Button asChild variant="outlineLight" size="lg">
                  <Link href={`/${locale}/shop#kit-studio`}>
                    <Shirt className="h-4 w-4" />
                    <span>{dict.interactive.kitStudioCta}</span>
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Floating Live Matchday Countdown Card */}
            {nextMatch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="lg:col-span-5"
              >
                <div className="rounded-2xl border border-white/15 bg-[#0A2240]/85 p-5 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D5A84B] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#D5A84B]" />
                      </span>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#D5A84B]">
                        {dict.interactive.matchdayLive}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-white/65">
                      {locale === "ar" ? nextMatch.competitionAr : nextMatch.competitionEn}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="my-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={nextMatch.homeLogo}
                        alt={nextMatch.homeTeamEn}
                        width={42}
                        height={42}
                        className="h-10 w-10 object-contain"
                      />
                      <span className="text-sm font-extrabold text-white">
                        {locale === "ar" ? nextMatch.homeTeamAr : nextMatch.homeTeamEn}
                      </span>
                    </div>
                    <span className="rounded-md bg-[#2678FF]/25 px-2.5 py-1 text-xs font-black text-[#66A3FF]">
                      {dict.matches.vs}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-extrabold text-white text-end">
                        {locale === "ar" ? nextMatch.awayTeamAr : nextMatch.awayTeamEn}
                      </span>
                      <Image
                        src={nextMatch.awayLogo}
                        alt={nextMatch.awayTeamEn}
                        width={42}
                        height={42}
                        className="h-10 w-10 object-contain"
                      />
                    </div>
                  </div>

                  {/* Ticking Countdown Tiles */}
                  <div className="grid grid-cols-4 gap-2 text-center tabular-nums">
                    {[
                      { val: countdown?.days ?? 0, label: dict.interactive.countdownDays },
                      { val: countdown?.hours ?? 0, label: dict.interactive.countdownHours },
                      { val: countdown?.mins ?? 0, label: dict.interactive.countdownMins },
                      { val: countdown?.secs ?? 0, label: dict.interactive.countdownSecs },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="rounded-xl border border-white/10 bg-[#071426]/90 py-2.5"
                      >
                        <span className="block text-xl font-black text-white">
                          {countdown ? String(unit.val).padStart(2, "0") : "--"}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D5A84B]">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3.5 flex items-center justify-between gap-2 text-[11px] text-white/70">
                    <span className="flex items-center gap-1.5 truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2678FF]" />
                      <span className="truncate">
                        {locale === "ar" ? nextMatch.venueAr : nextMatch.venueEn}
                      </span>
                    </span>
                    <Link
                      href={`/${locale}/tickets`}
                      className="shrink-0 font-bold text-[#D5A84B] hover:underline"
                    >
                      {dict.matches.reserveSeats}
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* INTEGRATED MATCHDAY STRIP */}
      <div className="border-t border-white/10 bg-[#0A2240]">
        <div className="mx-auto grid max-w-7xl divide-y divide-white/10 lg:grid-cols-2 lg:divide-y-0 lg:divide-x rtl:lg:divide-x-reverse">
          {nextMatch && (
            <Link
              href={`/${locale}/matches`}
              className="group flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 hover:bg-white/5 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#D5A84B]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D5A84B]">
                    {dict.matches.nextMatch}
                  </span>
                  <span className="text-[11px] text-white/50">· Demo</span>
                </div>
                <p className="text-xs text-white/75 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#2678FF]" />
                  <span>
                    {formatMatchDate(nextMatch.kickoffAt, locale)} ·{" "}
                    {formatMatchTime(nextMatch.kickoffAt, locale)}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 tabular-nums">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {locale === "ar" ? nextMatch.homeTeamAr : nextMatch.homeTeamEn}
                  </span>
                  <Image
                    src={nextMatch.homeLogo}
                    alt={nextMatch.homeTeamEn}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <span className="rounded bg-[#2678FF]/25 px-2.5 py-1 text-xs font-extrabold text-[#66A3FF]">
                  {dict.matches.vs}
                </span>
                <div className="flex items-center gap-2">
                  <Image
                    src={nextMatch.awayLogo}
                    alt={nextMatch.awayTeamEn}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                  <span className="text-sm font-bold text-white">
                    {locale === "ar" ? nextMatch.awayTeamAr : nextMatch.awayTeamEn}
                  </span>
                </div>
              </div>
            </Link>
          )}

          {lastResult && (
            <Link
              href={`/${locale}/matches`}
              className="group flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 hover:bg-white/5 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/65">
                    {dict.matches.lastResult}
                  </span>
                  <Badge variant="successDark">{dict.matches.fullTime}</Badge>
                </div>
                <p className="text-xs text-white/70 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#2678FF]" />
                  <span>{locale === "ar" ? lastResult.venueAr : lastResult.venueEn}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 tabular-nums">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {locale === "ar" ? lastResult.homeTeamAr : lastResult.homeTeamEn}
                  </span>
                  <Image
                    src={lastResult.homeLogo}
                    alt={lastResult.homeTeamEn}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <span className="rounded bg-white/10 px-3 py-1 text-base font-black text-white">
                  {lastResult.homeScore} – {lastResult.awayScore}
                </span>
                <div className="flex items-center gap-2">
                  <Image
                    src={lastResult.awayLogo}
                    alt={lastResult.awayTeamEn}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                  <span className="text-sm font-bold text-white">
                    {locale === "ar" ? lastResult.awayTeamAr : lastResult.awayTeamEn}
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
