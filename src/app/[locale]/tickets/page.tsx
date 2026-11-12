import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Info } from "lucide-react";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { ClubRepository } from "@/db/repository";
import { Badge } from "@/components/ui/badge";
import { StadiumSeatSelector } from "@/components/club/StadiumSeatSelector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  return { title: dictionaries[loc].nav.tickets };
}

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];
  const matches = await ClubRepository.getMatches();
  const nextMatch =
    matches.find((m) => m.isNextMatch) || matches.find((m) => m.status === "scheduled");

  return (
    <div>
      <div className="bg-[#0A2240] py-12 text-white luxury-floodlight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <Badge variant="goldDark">{dict.nav.tickets}</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {dict.commercial.ticketsTitle}
          </h1>
          <p className="max-w-2xl text-base text-white/80">
            {dict.commercial.ticketsSubtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-start gap-3 rounded-xl border border-[#2678FF]/25 bg-white p-4 text-xs text-slate-700 shadow-xs">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2678FF]" />
          <span className="font-medium">{dict.commercial.ticketsNotice}</span>
        </div>

        <StadiumSeatSelector locale={locale} dict={dict} nextMatch={nextMatch} />
      </div>
    </div>
  );
}
