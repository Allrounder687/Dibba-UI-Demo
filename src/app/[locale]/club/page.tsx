import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Award, Building2, Shield } from "lucide-react";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  return { title: dictionaries[loc].nav.club };
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];

  return (
    <div>
      <div className="bg-[#0A2240] py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <Badge variant="goldDark">{dict.club.eyebrow}</Badge>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {dict.club.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-20">
        {/* Chairman's Message */}
        <Card className="grid gap-10 border-[#DCE3EE] bg-white p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
          <div className="flex flex-col items-center gap-4 lg:col-span-4">
            <div className="relative h-80 w-64 overflow-hidden rounded-2xl border border-[#DCE3EE] bg-[#F5F7FA] shadow-md">
              <Image
                src="/assets/chairman-portrait.jpg"
                alt={dict.club.chairmanName}
                fill
                sizes="280px"
                className="object-cover object-top"
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-extrabold text-[#071426]">
                {dict.club.chairmanName}
              </h2>
              <p className="text-xs font-bold text-[#b8892a]">{dict.club.chairmanRole}</p>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <h2 className="text-3xl font-black text-[#071426]">
              {dict.club.chairmansTitle}
            </h2>
            <blockquote className="border-s-4 border-[#D5A84B] ps-5 text-xl font-semibold italic text-[#0A2240]">
              &ldquo;{dict.club.chairmanQuote}&rdquo;
            </blockquote>
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              {dict.club.chairmanBody.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </Card>

        {/* Heritage & 1967 Founding Emblem */}
        <section id="history" className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#2678FF]">
              <Award className="h-4 w-4" />
              <span>1967 – 2026</span>
            </div>
            <h2 className="text-3xl font-black text-[#071426]">{dict.club.historyTitle}</h2>
            <p className="text-base leading-relaxed text-slate-600">
              {dict.club.historyBody}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {dict.club.milestones.map((m) => (
                <Card key={m.year} className="border-[#DCE3EE] bg-white p-5">
                  <span className="text-lg font-black text-[#2678FF] tabular-nums">
                    {m.year}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-[#071426]">{m.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{m.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="overflow-hidden border-[#DCE3EE] bg-white p-5">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/assets/logo-dibba-fc.jpg"
                  alt={dict.club.heritageCaption}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain"
                />
              </div>
              <p className="mt-3 text-center text-xs font-bold text-slate-600">
                {dict.club.heritageCaption}
              </p>
            </Card>
          </div>
        </section>

        {/* Dibba Stadium */}
        <section
          id="stadium"
          className="overflow-hidden rounded-3xl bg-[#0A2240] text-white shadow-xl"
        >
          <div className="grid lg:grid-cols-12">
            <div className="relative min-h-[300px] lg:col-span-6">
              <Image
                src="/assets/12222222.jpg"
                alt={dict.club.stadiumTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 p-8 sm:p-10 lg:col-span-6">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#D5A84B]">
                <Building2 className="h-4 w-4" />
                <span>Dibba Al Fujairah</span>
              </div>
              <h2 className="text-3xl font-black text-white">{dict.club.stadiumTitle}</h2>
              <p className="text-sm leading-relaxed text-white/80">
                {dict.club.stadiumDesc}
              </p>
              <dl className="grid gap-4 sm:grid-cols-2 border-t border-white/15 pt-5">
                {dict.club.stadiumSpecs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#66A3FF]">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-white">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Governance & Board */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#2678FF]" />
            <h2 className="text-2xl font-black text-[#071426]">{dict.club.boardTitle}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dict.club.boardMembers.map((member) => (
              <Card key={member.name} className="border-[#DCE3EE] bg-white p-5">
                <h3 className="text-base font-bold text-[#071426]">{member.name}</h3>
                <p className="mt-2 text-xs font-semibold text-[#b8892a]">{member.role}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
