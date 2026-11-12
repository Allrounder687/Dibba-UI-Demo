import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { ClubRepository } from "@/db/repository";
import { SquadExplorer } from "@/components/club/SquadExplorer";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  return { title: dictionaries[loc].nav.teams };
}

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];
  const players = await ClubRepository.getPlayers();

  return (
    <div>
      <div className="bg-[#0A2240] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
            {dict.squad.sectionEyebrow}
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {dict.squad.sectionTitle}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SquadExplorer locale={locale} dict={dict} players={players} />
      </div>
    </div>
  );
}
