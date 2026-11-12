import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Calendar } from "lucide-react";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { ClubRepository } from "@/db/repository";
import { formatMatchDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  const article = await ClubRepository.getNewsBySlug(slug);
  if (!article) return { title: dictionaries[loc].nav.news };
  return {
    title: loc === "ar" ? article.titleAr : article.titleEn,
    description: loc === "ar" ? article.excerptAr : article.excerptEn,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];
  const article = await ClubRepository.getNewsBySlug(slug);
  if (!article) notFound();

  const title = locale === "ar" ? article.titleAr : article.titleEn;
  const body = locale === "ar" ? article.bodyAr : article.bodyEn;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#2678FF] hover:text-[#071426] transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        <span>{dict.news.backToNews}</span>
      </Link>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="blue">
            {dict.news.categories[article.category] || article.category}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatMatchDate(article.publishedAt, locale)}
          </span>
        </div>
        <h1 className="text-3xl font-black leading-tight text-[#071426] sm:text-4xl">
          {title}
        </h1>
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#DCE3EE] bg-[#0A2240] shadow-md">
        <Image
          src={article.imageUrl}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      <div className="rounded-2xl border border-[#DCE3EE] bg-white p-6 sm:p-10 text-base leading-relaxed text-slate-700 whitespace-pre-line">
        {body}
      </div>
    </article>
  );
}
