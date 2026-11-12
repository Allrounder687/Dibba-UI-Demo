"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, Ticket } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SiteHeaderProps {
  locale: Locale;
  dict: Dictionary;
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/dibba.fc/" },
  { label: "X", href: "https://twitter.com/FcDibba" },
  { label: "Facebook", href: "https://www.facebook.com/Dibba.FC.Official" },
  { label: "YouTube", href: "https://www.youtube.com/@dibbafc5691" },
];

export function SiteHeader({ locale, dict }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || `/${locale}`;

  const targetLocale: Locale = locale === "en" ? "ar" : "en";
  const switchedPath = pathname.startsWith(`/${locale}`)
    ? pathname.replace(`/${locale}`, `/${targetLocale}`)
    : `/${targetLocale}`;

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/matches`, label: dict.nav.matches },
    { href: `/${locale}/teams`, label: dict.nav.teams },
    { href: `/${locale}/academy`, label: dict.nav.academy },
    { href: `/${locale}/club`, label: dict.nav.club },
    { href: `/${locale}/news`, label: dict.nav.news },
    { href: `/${locale}/shop`, label: dict.nav.shop },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#071426] text-white shadow-lg">
      {/* Top Club Bar */}
      <div className="border-b border-white/10 bg-[#050E1B] px-4 py-1.5 text-[11px] text-white/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <span className="truncate font-medium tracking-wider uppercase">
            {dict.meta.tagline}
          </span>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white transition-colors font-medium"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <Link
              href={switchedPath}
              data-testid="lang-switch"
              className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-white hover:border-[#2678FF] hover:bg-[#2678FF]/20 transition-colors"
            >
              <Globe className="h-3 w-3 text-[#2678FF]" />
              <span>{dict.nav.switchLang}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2678FF] rounded-lg"
        >
          <Image
            src="/assets/dibba-fc-logo-glossly-750.png"
            alt={dict.meta.siteName}
            width={42}
            height={42}
            className="h-10 w-10 object-contain"
            priority
          />
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white leading-none">
              {locale === "ar" ? "نادي دبا الرياضي" : "DIBBA FC"}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-[0.18em] uppercase text-[#D5A84B]">
              {locale === "ar" ? "تأسس 1967" : "SPORTS & CULTURAL CLUB"}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "text-white after:absolute after:bottom-0 after:start-3 after:end-3 after:h-0.5 after:bg-[#2678FF] after:rounded-full"
                    : "text-white/75 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex uppercase tracking-wider">
            <Link href={`/${locale}/tickets`}>
              <Ticket className="h-3.5 w-3.5" />
              <span>{dict.nav.tickets}</span>
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Full-width accessible Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#071426] px-4 py-5 shadow-2xl">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-semibold transition-colors",
                    active
                      ? "bg-[#2678FF]/20 text-white border-s-4 border-[#2678FF]"
                      : "text-white/80 hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild variant="gold" size="lg" className="mt-3 w-full">
              <Link href={`/${locale}/tickets`} onClick={() => setMobileOpen(false)}>
                <Ticket className="h-4 w-4" />
                <span>{dict.nav.tickets}</span>
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
