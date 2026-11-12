"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Ticket,
  CheckCircle2,
  Users,
  Shield,
  Eye,
  Crown,
  Coffee,
  Car,
  Wifi,
  Tv,
  ArrowRight,
} from "lucide-react";
import type { MatchRecord } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { cn, formatMatchDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LafcStadiumExperienceProps {
  locale: Locale;
  dict: Dictionary;
  nextMatch?: MatchRecord;
}

interface StadiumTier {
  id: string;
  nameEn: string;
  nameAr: string;
  tagEn: string;
  tagAr: string;
  priceAed: number;
  capacityText: string;
  imageUrl: string;
  descriptionEn: string;
  descriptionAr: string;
  seatViewCoordinates: string;
  perksEn: string[];
  perksAr: string[];
  accentColor: string;
}

const STADIUM_TIERS: StadiumTier[] = [
  {
    id: "100-level",
    nameEn: "100 Level — Fieldside & Lower Bowl",
    nameAr: "المستوى 100 — المقاعد الميدانية والمدرج السفلي",
    tagEn: "PITCHSIDE INTENSITY",
    tagAr: "حماس خط التماس",
    priceAed: 40,
    capacityText: "5,400 Seats",
    imageUrl: "/assets/12222222-1024x585.jpg",
    descriptionEn:
      "Right along the touchline. Feel the thunder of every tackle and celebrate feet away from the Dibba first-team squad.",
    descriptionAr:
      "على خط التماس مباشرة. عِش حماس كل هجمة واحتفل على بعد أمتار قليلة من نجوم الفريق الأول لنادي دبا.",
    seatViewCoordinates: "Sec 104 • Row 3 • Pitchside North",
    perksEn: [
      "Unrestricted pitch-level sightlines",
      "Fast-track turnstiles at Gate 2",
      "Direct concourse food & merchandise access",
      "Kids & family cheering zone",
    ],
    perksAr: [
      "رؤية ميدانية مباشرة دون أي حواجز",
      "بوابات دخول سريعة عبر البوابة رقم 2",
      "وصول مباشر للمطاعم ومتجر النادي في البهو",
      "مناطق مخصصة للعائلات والأطفال",
    ],
    accentColor: "#2678FF",
  },
  {
    id: "200-level",
    nameEn: "200 Level — Club Terrace & Midfield",
    nameAr: "المستوى 200 — شرفة النادي ومنتصف الملعب",
    tagEn: "PREMIUM ELEVATION",
    tagAr: "إطلالة بانورامية راقية",
    priceAed: 80,
    capacityText: "2,800 Seats",
    imageUrl: "/assets/H0I0851-scaled-rv3cgnc8gmqjvxonfjgdm2gonr09jo6hte61rbflzi.jpg",
    descriptionEn:
      "The tactical command view. Elevated sightlines over midfield with climate-controlled concourse lounges and cushioned club seating.",
    descriptionAr:
      "الرؤية التكتيكية الشاملة. ارتفاع استراتيجي يكشف منتصف الملعب بالكامل مع صالات بهو مكيّفة ومقاعد جلدية مريحة.",
    seatViewCoordinates: "Club Sec 202 • Row 8 • Midfield High",
    perksEn: [
      "Panoramic midfield tactical sightline",
      "Cushioned wider luxury seating",
      "Exclusive air-conditioned Club Concourse",
      "Priority stadium parking pass",
    ],
    perksAr: [
      "رؤية بانورامية استراتيجية لكامل المستطيل الأخضر",
      "مقاعد جلدية مريحة ومتباعدة",
      "دخول حصري لبهو النادي المكيّف والمخصص",
      "تصريح مواقف سيارات قريبة من الاستاد",
    ],
    accentColor: "#0E8245",
  },
  {
    id: "royal-majlis",
    nameEn: "Royal Majlis & Skybox Hospitality",
    nameAr: "المجلس الملكي وأجنحة الضيافة الخاصة",
    tagEn: "VIP ULTIMATE LUXURY",
    tagAr: "الفخامة والضيافة الرفيعة",
    priceAed: 250,
    capacityText: "14 Private Suites • 800 Guests",
    imageUrl: "/assets/Screenshot-2026-10-25-190154.png",
    descriptionEn:
      "World-class Arabian hospitality. Private glass-fronted suites with dedicated butler service, live gourmet catering, and private lounge.",
    descriptionAr:
      "ضيافة عربية أصيلة بمستويات عالمية. أجنحة ملكية خاصة بواجهات زجاجية بانورامية، خدمة ضيافة مخصصة، وبوفيه فاخر متكامل.",
    seatViewCoordinates: "Royal Suite 07 • Private Terrace",
    perksEn: [
      "Private VIP glass-fronted luxury lounge",
      "Gourmet live buffet & Arabic hospitality",
      "Reserved VIP Valet parking at Royal Gate",
      "Pre-match pitch & tunnel tour access",
    ],
    perksAr: [
      "جناح خاص ومكيّف بواجهات زجاجية عازلة وإطلالة ملكية",
      "بوفيه ضيافة فاخر وقهوة عربية على مدار المباراة",
      "خدمة صف السيارات (فاليه) أمام البوابة الملكية",
      "جولة خاصة في النفق ومحيط الملعب قبل انطلاق الصافرة",
    ],
    accentColor: "#D5A84B",
  },
];

export function LafcStadiumExperience({
  locale,
  dict,
  nextMatch,
}: LafcStadiumExperienceProps) {
  const isAr = locale === "ar";
  const [activeTierId, setActiveTierId] = useState<string>("200-level");
  const activeTier =
    STADIUM_TIERS.find((t) => t.id === activeTierId) || STADIUM_TIERS[1];

  return (
    <section className="relative overflow-hidden bg-[#050D1A] py-20 text-white">
      {/* Ambient Floodlight Gradients */}
      <div className="pointer-events-none absolute -top-40 start-1/4 h-96 w-96 rounded-full bg-[#2678FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 end-1/4 h-96 w-96 rounded-full bg-[#D5A84B]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D5A84B]/30 bg-[#D5A84B]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isAr ? "تجربة الاستاد والضيافة" : "STADIUM & HOSPITALITY EXPERIENCE"}</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {isAr ? "اختر مقعدك في ستاد دبا الفجيرة" : "Choose Your Level at Dibba Stadium"}
            </h2>
            <p className="max-w-2xl text-sm text-white/70">
              {isAr
                ? "مستوحى من أرقى معايير الاستادات العالمية مثل BMO Stadium في لوس أنجلوس. تجربة استثنائية من خط التماس إلى أجنحة الضيافة الملكية."
                : "Inspired by premier franchise stadium design. From pitchside roar to private royal skybox hospitality, discover your matchday vantage point."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="gold" size="sm" className="font-bold">
              <Link href={`/${locale}/tickets`}>
                <Ticket className="h-4 w-4" />
                <span>{isAr ? "حجز تذاكر الموسم" : "Reserve Season Pass"}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Level Switcher Tabs (Magic UI Inspired) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STADIUM_TIERS.map((tier) => {
            const isActive = tier.id === activeTierId;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setActiveTierId(tier.id)}
                className={cn(
                  "relative group overflow-hidden rounded-2xl border p-5 text-start transition-all duration-300 cursor-pointer",
                  isActive
                    ? "border-[#D5A84B] bg-[#0A2240] shadow-2xl shadow-[#D5A84B]/15"
                    : "border-white/10 bg-[#071426]/75 hover:border-white/25 hover:bg-[#0A2240]/50"
                )}
              >
                {/* Magic UI Border Beam Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-stadium-tier-glow"
                    className="absolute inset-0 rounded-2xl border-2 border-[#D5A84B] pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: tier.accentColor }}
                  >
                    {isAr ? tier.tagAr : tier.tagEn}
                  </span>
                  <span className="text-xs font-extrabold text-[#D5A84B] tabular-nums">
                    {tier.priceAed} AED
                  </span>
                </div>

                <h3 className="mt-2 text-base font-black text-white">
                  {isAr ? tier.nameAr : tier.nameEn}
                </h3>

                <p className="mt-1 text-xs text-white/60">
                  {tier.capacityText}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Level Interactive Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTier.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0A2240] via-[#071426] to-[#050D1A] shadow-2xl"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center p-6 sm:p-10">
              {/* Left / Visual Viewport */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-black lg:col-span-7">
                <Image
                  src={activeTier.imageUrl}
                  alt={isAr ? activeTier.nameAr : activeTier.nameEn}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D1A] via-transparent to-black/40" />

                {/* View from Seat Badge */}
                <div className="absolute bottom-4 start-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3.5 py-1.5 backdrop-blur-md">
                  <Eye className="h-3.5 w-3.5 text-[#D5A84B]" />
                  <span className="text-xs font-mono font-bold text-white tracking-wide">
                    {activeTier.seatViewCoordinates}
                  </span>
                </div>

                <div className="absolute top-4 end-4 rounded-full bg-[#071426]/85 px-3 py-1 text-xs font-bold text-white border border-white/15 backdrop-blur-sm">
                  {activeTier.capacityText}
                </div>
              </div>

              {/* Right / Perks & Reservation */}
              <div className="space-y-6 lg:col-span-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#D5A84B]">
                    <Crown className="h-4 w-4" />
                    <span>{isAr ? activeTier.tagAr : activeTier.tagEn}</span>
                  </div>
                  <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                    {isAr ? activeTier.nameAr : activeTier.nameEn}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {isAr ? activeTier.descriptionAr : activeTier.descriptionEn}
                  </p>
                </div>

                {/* Perks Checklist */}
                <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-white/60">
                    {isAr ? "مزايا المقعد والتجربة:" : "INCLUDED LEVEL AMENITIES:"}
                  </span>
                  {(isAr ? activeTier.perksAr : activeTier.perksEn).map((perk, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-white/90">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D5A84B]" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & Booking Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div>
                    <span className="block text-[11px] font-bold text-white/60 uppercase">
                      {isAr ? "يبدأ من" : "STARTING FROM"}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#D5A84B] tabular-nums">
                        {activeTier.priceAed}
                      </span>
                      <span className="text-xs font-bold text-white/80">AED</span>
                      <span className="text-[11px] text-white/50">
                        {isAr ? "/ للمباراة" : "/ match"}
                      </span>
                    </div>
                  </div>

                  <Button asChild variant="gold" size="default" className="font-black px-6 shadow-lg shadow-[#D5A84B]/20">
                    <Link href={`/${locale}/tickets?stand=${activeTier.id}`}>
                      <span>{isAr ? "حجز المقاعد الآن" : "Book This Level"}</span>
                      <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stadium Architectural Bento Highlights */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <Users className="h-6 w-6 text-[#2678FF]" />
            <h4 className="mt-3 text-2xl font-black text-white tabular-nums">9,000</h4>
            <p className="text-xs text-white/65 font-medium mt-1">
              {isAr ? "السعة الرسمية الشاملة" : "Full Seating Capacity"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <Shield className="h-6 w-6 text-emerald-400" />
            <h4 className="mt-3 text-2xl font-black text-white">FIFA Standard</h4>
            <p className="text-xs text-white/65 font-medium mt-1">
              {isAr ? "عشب طبيعي ومواصفات آسيوية" : "Natural Hybrid Turf Pitch"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <Crown className="h-6 w-6 text-[#D5A84B]" />
            <h4 className="mt-3 text-2xl font-black text-white tabular-nums">14 Suites</h4>
            <p className="text-xs text-white/65 font-medium mt-1">
              {isAr ? "أجنحة ضيافة ملكية خاصة" : "Royal Majlis Skyboxes"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
            <Tv className="h-6 w-6 text-purple-400" />
            <h4 className="mt-3 text-2xl font-black text-white">4K Floodlights</h4>
            <p className="text-xs text-white/65 font-medium mt-1">
              {isAr ? "بث تلفزيوني فائق الدقة" : "Broadcast Grade Illumination"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
