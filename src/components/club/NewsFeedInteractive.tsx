"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import type { NewsArticleRecord } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { formatMatchDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface NewsFeedInteractiveProps {
  locale: Locale;
  dict: Dictionary;
  articles: NewsArticleRecord[];
}

export function NewsFeedInteractive({
  locale,
  dict,
  articles,
}: NewsFeedInteractiveProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = articles.filter((a) => {
    const matchesCat = category === "all" || a.category === category;
    const title = (locale === "ar" ? a.titleAr : a.titleEn).toLowerCase();
    const excerpt = (locale === "ar" ? a.excerptAr : a.excerptEn).toLowerCase();
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || title.includes(q) || excerpt.includes(q);
    return matchesCat && matchesQuery;
  });

  const categories = [
    { id: "all", label: dict.news.allCategories },
    { id: "first_team", label: dict.news.categories.first_team },
    { id: "academy", label: dict.news.categories.academy },
    { id: "other_sports", label: dict.news.categories.other_sports },
    { id: "club_news", label: dict.news.categories.club_news },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer",
                category === c.id
                  ? "bg-[#0A2240] text-white"
                  : "border border-[#DCE3EE] bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.news.searchPlaceholder}
            className="bg-white ps-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#DCE3EE] bg-white p-12 text-center text-sm text-slate-500">
          {dict.news.noResults}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/news/${article.slug}`}
              className="group"
            >
              <Card className="flex h-full flex-col overflow-hidden border-[#DCE3EE] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#2678FF]/45">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A2240]">
                  <Image
                    src={article.imageUrl}
                    alt={locale === "ar" ? article.titleAr : article.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <Badge variant="blue">
                        {dict.news.categories[article.category] || article.category}
                      </Badge>
                      <span className="text-slate-500">
                        {formatMatchDate(article.publishedAt, locale)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-[#071426] group-hover:text-[#2678FF] transition-colors">
                      {locale === "ar" ? article.titleAr : article.titleEn}
                    </h3>
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {locale === "ar" ? article.excerptAr : article.excerptEn}
                    </p>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2678FF]">
                    <span>{dict.news.readArticle}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
