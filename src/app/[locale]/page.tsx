import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Trophy,
  Users,
  Shield,
  ShoppingBag,
} from "lucide-react";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { ClubRepository } from "@/db/repository";
import { MERCHANDISE_CATALOG } from "@/db/seed-data";
import { formatMatchDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LuxuryHeroSection } from "@/components/club/LuxuryHeroSection";
import { LuxuryPlayerCard } from "@/components/club/LuxuryPlayerCard";
import { TacticalPitchBuilder } from "@/components/club/TacticalPitchBuilder";
import { LafcStadiumExperience } from "@/components/club/LafcStadiumExperience";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];
  const [matches, articles, players] = await Promise.all([
    ClubRepository.getMatches(),
    ClubRepository.getNews(false),
    ClubRepository.getPlayers(),
  ]);

  const nextMatch =
    matches.find((m) => m.isNextMatch) ||
    matches.find((m) => m.status === "scheduled") ||
    matches[0];
  const lastResult = matches.find((m) => m.status === "finished");
  const leadArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  const spotlightPlayers = players.filter((p) => p.position !== "STAFF").slice(0, 4);
  const featuredKits = MERCHANDISE_CATALOG.slice(0, 4);

  return (
    <div className="bg-[#F5F7FA] text-[#071426]">
      {/* 1. LUXURY STADIUM HERO + LIVE MATCHDAY COUNTDOWN */}
      <LuxuryHeroSection
        locale={locale}
        dict={dict}
        nextMatch={nextMatch}
        lastResult={lastResult}
      />

      {/* 2. LATEST CLUB NEWS — CRISP OFF-WHITE EDITORIAL CANVAS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#DCE3EE] pb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#2678FF]">
              {dict.news.eyebrow}
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-[#071426]">
              {dict.news.title}
            </h2>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/${locale}/news`}>
              <span>{dict.news.viewAll}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {leadArticle && (
            <Link
              href={`/${locale}/news/${leadArticle.slug}`}
              className="group lg:col-span-7"
            >
              <Card className="h-full overflow-hidden border-[#DCE3EE] bg-white transition-all duration-200 hover:shadow-xl hover:border-[#2678FF]/40">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A2240]">
                  <Image
                    src={leadArticle.imageUrl}
                    alt={locale === "ar" ? leadArticle.titleAr : leadArticle.titleEn}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="blue">
                      {dict.news.categories[leadArticle.category] || leadArticle.category}
                    </Badge>
                    <span className="font-medium text-slate-500">
                      {formatMatchDate(leadArticle.publishedAt, locale)}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold leading-snug text-[#071426] group-hover:text-[#2678FF] transition-colors">
                    {locale === "ar" ? leadArticle.titleAr : leadArticle.titleEn}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {locale === "ar" ? leadArticle.excerptAr : leadArticle.excerptEn}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )}

          <div className="flex flex-col gap-5 lg:col-span-5">
            {secondaryArticles.map((article) => (
              <Link
                key={article.id}
                href={`/${locale}/news/${article.slug}`}
                className="group flex-1"
              >
                <Card className="flex h-full flex-col sm:flex-row overflow-hidden border-[#DCE3EE] bg-white transition-all duration-200 hover:shadow-lg hover:border-[#2678FF]/40">
                  <div className="relative h-48 w-full sm:h-auto sm:w-44 shrink-0 overflow-hidden bg-[#0A2240]">
                    <Image
                      src={article.imageUrl}
                      alt={locale === "ar" ? article.titleAr : article.titleEn}
                      fill
                      sizes="(max-width: 640px) 100vw, 180px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex flex-col justify-between p-5">
                    <div className="space-y-2">
                      <Badge variant="blue">
                        {dict.news.categories[article.category] || article.category}
                      </Badge>
                      <h3 className="text-base font-bold leading-snug text-[#071426] group-hover:text-[#2678FF] transition-colors">
                        {locale === "ar" ? article.titleAr : article.titleEn}
                      </h3>
                      <p className="line-clamp-2 text-xs text-slate-600">
                        {locale === "ar" ? article.excerptAr : article.excerptEn}
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-semibold text-slate-500">
                      {formatMatchDate(article.publishedAt, locale)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LAFC-INSPIRED STADIUM & HOSPITALITY LEVELS (100 / 200 / ROYAL MAJLIS) */}
      <LafcStadiumExperience
        locale={locale}
        dict={dict}
        nextMatch={nextMatch}
      />

      {/* 4. FIRST TEAM SQUAD SHOWCASE — 3D HOLOGRAPHIC CUTOUT CARDS */}
      <section className="bg-[#071426] py-16 text-white luxury-floodlight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
                  {dict.squad.sectionEyebrow}
                </p>
                <h2 className="mt-1 text-3xl font-black tracking-tight text-white">
                  {dict.squad.sectionTitle}
                </h2>
              </div>
              <Button asChild variant="gold" size="sm">
                <Link href={`/${locale}/teams`}>
                  <span>{dict.squad.viewAllSquad}</span>
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {spotlightPlayers.map((player) => (
                <Link key={player.id} href={`/${locale}/teams`} className="block">
                  <LuxuryPlayerCard player={player} locale={locale} dict={dict} />
                </Link>
              ))}
            </div>
          </div>

          {/* PLAYABLE TACTICAL STARTING XI LAB */}
          <TacticalPitchBuilder locale={locale} dict={dict} players={players} />
        </div>
      </section>

      {/* 4. OFFICIAL 2026 KITS & MERCHANDISE — STUDIO PEDESTAL CARDS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#DCE3EE] pb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#2678FF]">
              {dict.nav.shop}
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-[#071426]">
              {dict.commercial.shopTitle}
            </h2>
          </div>
          <Button asChild variant="gold" size="sm">
            <Link href={`/${locale}/shop#kit-studio`}>
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{dict.interactive.kitStudioCta}</span>
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredKits.map((item) => (
            <Link key={item.id} href={`/${locale}/shop#kit-studio`} className="group">
              <Card className="h-full overflow-hidden border-[#DCE3EE] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#2678FF]/40">
                <div className="relative aspect-square w-full bg-[#EEF2F7] p-6">
                  <Image
                    src={item.imageUrl}
                    alt={locale === "ar" ? item.nameAr : item.nameEn}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  {(item.badgeEn || item.badgeAr) && (
                    <span className="absolute start-3 top-3 rounded-full bg-[#0A2240] px-2.5 py-0.5 text-[10px] font-bold text-[#D5A84B]">
                      {locale === "ar" ? item.badgeAr : item.badgeEn}
                    </span>
                  )}
                </div>
                <CardContent className="p-4 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2678FF]">
                      {locale === "ar" ? item.categoryAr : item.categoryEn}
                    </p>
                    <h3 className="text-sm font-bold text-[#071426]">
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </h3>
                  </div>
                  <span className="text-sm font-black text-[#0A2240] tabular-nums shrink-0">
                    {item.priceAed} AED
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. DIBBA ACADEMY & MULTI-SPORT */}
      <section className="bg-[#0A2240] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-5 lg:col-span-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
                {dict.academy.eyebrow}
              </p>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {dict.academy.title}
              </h2>
              <p className="text-sm leading-relaxed text-white/80">
                {dict.academy.subtitle}
              </p>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15">
                <Image
                  src="/assets/WhatsApp-Image-2026-11-07-at-6.46.04-PM-rw1ikln0ue4p1qrt90tc0o0ov31gxbeimlxpvp6bda.jpeg"
                  alt="Dibba Youth Academy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <Button asChild variant="gold" size="lg">
                <Link href={`/${locale}/academy`}>{dict.academy.registerCta}</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {dict.academy.programs.map((prog) => (
                <div
                  key={prog.title}
                  className="rounded-xl border border-white/10 bg-[#071426]/80 p-6 transition-colors hover:border-[#2678FF]/45"
                >
                  <Users className="mb-3 h-5 w-5 text-[#2678FF]" />
                  <h3 className="text-base font-bold text-white">{prog.title}</h3>
                  <p className="mt-1 text-xs font-bold text-[#D5A84B]">{prog.ageGroup}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/75">
                    {prog.description}
                  </p>
                </div>
              ))}
              {dict.academy.otherSports.slice(0, 1).map((sport) => (
                <div
                  key={sport.title}
                  className="rounded-xl border border-white/10 bg-[#071426]/80 p-6 transition-colors hover:border-[#D5A84B]/45"
                >
                  <Trophy className="mb-3 h-5 w-5 text-[#D5A84B]" />
                  <h3 className="text-base font-bold text-white">{sport.title}</h3>
                  <p className="mt-1 text-xs font-bold text-[#66A3FF]">{sport.subtitle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/75">
                    {sport.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CHAIRMAN'S MESSAGE & DIBBA STADIUM HERITAGE (LIGHT EDITORIAL) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-3xl border border-[#DCE3EE] bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-12">
          <div className="flex flex-col items-center gap-4 lg:col-span-4">
            <div className="relative h-72 w-56 overflow-hidden rounded-2xl border border-[#DCE3EE] bg-[#F5F7FA] shadow-md">
              <Image
                src="/assets/chairman-portrait.jpg"
                alt={dict.club.chairmanName}
                fill
                sizes="240px"
                className="object-cover object-top"
              />
            </div>
            <div className="text-center">
              <p className="text-base font-extrabold text-[#071426]">
                {dict.club.chairmanName}
              </p>
              <p className="text-xs font-bold text-[#b8892a]">{dict.club.chairmanRole}</p>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#2678FF]">
              <Shield className="h-4 w-4" />
              <span>{dict.club.eyebrow}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-[#071426]">
              {dict.club.chairmansTitle}
            </h2>
            <blockquote className="border-s-4 border-[#D5A84B] ps-4 text-lg font-semibold italic text-[#0A2240]">
              &ldquo;{dict.club.chairmanQuote}&rdquo;
            </blockquote>
            <p className="text-sm leading-relaxed text-slate-600">
              {dict.club.chairmanBody[0]}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="secondary">
                <Link href={`/${locale}/club`}>{dict.club.historyTitle}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/club#stadium`}>{dict.club.stadiumTitle}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
