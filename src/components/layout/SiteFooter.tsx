import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { SponsorRecord } from "@/db/seed-data";

interface SiteFooterProps {
  locale: Locale;
  dict: Dictionary;
  sponsors: SponsorRecord[];
}

export function SiteFooter({ locale, dict, sponsors }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#050D1A] text-white">
      {/* Sponsors Strip */}
      <div className="border-b border-white/10 bg-[#071426] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[#D5A84B]">
            {dict.footer.sponsorsTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#0A2240]/60 px-5 py-3 transition-all hover:border-[#2678FF]/50 hover:bg-[#0A2240]"
              >
                <Image
                  src={sponsor.logoUrl}
                  alt={locale === "ar" ? sponsor.nameAr : sponsor.nameEn}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-md object-contain"
                />
                <div className="text-start">
                  <p className="text-sm font-bold text-white">
                    {locale === "ar" ? sponsor.nameAr : sponsor.nameEn}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/55">
                    {sponsor.tier}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/dibba-fc-logo-glossly-750.png"
                alt={dict.meta.siteName}
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <div>
                <h2 className="text-base font-extrabold text-white">{dict.meta.siteName}</h2>
                <p className="text-xs font-medium text-[#D5A84B]">{dict.meta.tagline}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/65">{dict.footer.about}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#D5A84B]">
              {dict.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href={`/${locale}/matches`} className="hover:text-white transition-colors">
                  {dict.nav.matches}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/teams`} className="hover:text-white transition-colors">
                  {dict.nav.teams}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/academy`} className="hover:text-white transition-colors">
                  {dict.nav.academy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/news`} className="hover:text-white transition-colors">
                  {dict.nav.news}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop`} className="hover:text-white transition-colors">
                  {dict.nav.shop}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#D5A84B]">
              {dict.footer.governance}
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href={`/${locale}/club`} className="hover:text-white transition-colors">
                  {dict.club.chairmansTitle}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/club#history`} className="hover:text-white transition-colors">
                  {dict.club.historyTitle}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/club#stadium`} className="hover:text-white transition-colors">
                  {dict.club.stadiumTitle}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tickets`} className="hover:text-white transition-colors">
                  {dict.nav.tickets}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm text-white/70">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#D5A84B]">
              {dict.nav.contact}
            </h3>
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2678FF]" />
              <span>{dict.footer.address}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-[#2678FF]" />
              <a href="tel:+97192444216" dir="ltr" className="hover:text-white">
                +971 9 244 4216
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-[#2678FF]" />
              <a href="mailto:info@dibbaclub.ae" className="hover:text-white">
                info@dibbaclub.ae
              </a>
            </p>
            <a
              href="https://www.uaefa.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 pt-2 text-xs font-semibold text-[#66A3FF] hover:underline"
            >
              <span>UAE Football Association</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>{dict.footer.copyright}</p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/dibba.fc/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://twitter.com/FcDibba"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              X / Twitter
            </a>
            <a
              href="https://www.youtube.com/@dibbafc5691"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
