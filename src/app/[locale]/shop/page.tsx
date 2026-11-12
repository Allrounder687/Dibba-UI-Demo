import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Info } from "lucide-react";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import { KitCustomizerStudio } from "@/components/club/KitCustomizerStudio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  return { title: dictionaries[loc].nav.shop };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];

  return (
    <div>
      <div className="bg-[#0A2240] py-12 text-white luxury-floodlight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <Badge variant="goldDark">{dict.nav.shop}</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {dict.commercial.shopTitle}
          </h1>
          <p className="max-w-2xl text-base text-white/80">
            {dict.commercial.shopSubtitle}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span className="font-medium">{dict.commercial.foundationNotice}</span>
        </div>

        <KitCustomizerStudio locale={locale} dict={dict} />
      </div>
    </div>
  );
}
