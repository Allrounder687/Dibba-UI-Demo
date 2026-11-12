import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dictionaries, isValidLocale, type Locale } from "@/lib/i18n/dictionaries";
import { ClubRepository } from "@/db/repository";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LocaleRootSync } from "@/components/providers/LocaleRootSync";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isValidLocale(locale) ? locale : "en";
  const dict = dictionaries[loc];

  return {
    title: {
      default: dict.meta.siteName,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = dictionaries[locale];
  const sponsors = await ClubRepository.getSponsors();

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#071426]"
    >
      <LocaleRootSync locale={locale} />
      <SiteHeader locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} dict={dict} sponsors={sponsors} />
    </div>
  );
}
