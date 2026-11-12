import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Users, Trophy } from "lucide-react";
import { dictionaries, isValidLocale } from "@/lib/i18n/dictionaries";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = isValidLocale(locale) ? locale : "en";
  return { title: dictionaries[loc].nav.academy };
}

export default async function AcademyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = dictionaries[locale];
  const programOptions = [
    ...dict.academy.programs.map((p) => p.title),
    ...dict.academy.otherSports.map((s) => s.title),
  ];

  return (
    <div>
      <div className="bg-[#0A2240] py-14 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="space-y-4 lg:col-span-7">
            <Badge variant="goldDark">{dict.academy.eyebrow}</Badge>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {dict.academy.title}
            </h1>
            <p className="text-base leading-relaxed text-white/80">
              {dict.academy.subtitle}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
              <Image
                src="/assets/WhatsApp-Image-2026-11-07-at-6.46.04-PM-rw1ikln0ue4p1qrt90tc0o0ov31gxbeimlxpvp6bda.jpeg"
                alt={dict.academy.title}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-16">
        <section className="grid gap-6 md:grid-cols-3">
          {dict.academy.programs.map((prog) => (
            <Card key={prog.title} className="flex flex-col justify-between border-[#DCE3EE] bg-white p-6">
              <div className="space-y-3">
                <Users className="h-6 w-6 text-[#2678FF]" />
                <h2 className="text-xl font-extrabold text-[#071426]">{prog.title}</h2>
                <p className="text-xs font-bold uppercase tracking-wider text-[#b8892a]">
                  {prog.ageGroup}
                </p>
                <p className="text-sm leading-relaxed text-slate-600">{prog.description}</p>
              </div>
              <p className="mt-6 flex items-center gap-2 border-t border-[#DCE3EE] pt-4 text-xs font-medium text-slate-600">
                <Calendar className="h-4 w-4 text-[#2678FF]" />
                <span>{prog.schedule}</span>
              </p>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-[#071426]">
            {dict.academy.otherSportsTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {dict.academy.otherSports.map((sport) => (
              <Card key={sport.title} className="border-[#DCE3EE] bg-white p-6">
                <Trophy className="mb-3 h-6 w-6 text-[#D5A84B]" />
                <h3 className="text-lg font-extrabold text-[#071426]">{sport.title}</h3>
                <p className="text-xs font-bold text-[#2678FF]">{sport.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {sport.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <Card id="register" className="border-[#DCE3EE] bg-white">
          <CardContent className="p-6 sm:p-10">
            <div className="mb-8 max-w-2xl space-y-2">
              <h2 className="text-2xl font-black text-[#071426]">
                {dict.academy.formTitle}
              </h2>
              <p className="text-sm text-slate-600">{dict.academy.formSubtitle}</p>
            </div>

            <EnquiryForm
              dict={dict}
              type="academy"
              programOptions={programOptions}
              defaultSubject="Academy Enrollment"
              showAgeField
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
