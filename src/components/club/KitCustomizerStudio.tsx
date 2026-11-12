"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Shirt, Sparkles, ShoppingBag } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { MERCHANDISE_CATALOG } from "@/db/seed-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { cn } from "@/lib/utils";

interface KitCustomizerStudioProps {
  locale: Locale;
  dict: Dictionary;
}

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export function KitCustomizerStudio({ locale, dict }: KitCustomizerStudioProps) {
  const [selectedKit, setSelectedKit] = useState<"home" | "away">("home");
  const [customName, setCustomName] = useState("DIBBA 67");
  const [customNumber, setCustomNumber] = useState("10");
  const [selectedSize, setSelectedSize] = useState<(typeof SIZES)[number]>("L");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [prefill, setPrefill] = useState<{
    program?: string;
    subject?: string;
    message?: string;
  }>({});

  const homeKit = MERCHANDISE_CATALOG[0];
  const awayKit = MERCHANDISE_CATALOG[1];
  const activeKit = selectedKit === "home" ? homeKit : awayKit;

  const itemOptions = MERCHANDISE_CATALOG.map((item) =>
    locale === "ar"
      ? `${item.nameAr} (${item.priceAed} AED)`
      : `${item.nameEn} (${item.priceAed} AED)`
  );

  function formatOption(item: typeof homeKit) {
    return locale === "ar"
      ? `${item.nameAr} (${item.priceAed} AED)`
      : `${item.nameEn} (${item.priceAed} AED)`;
  }

  function handleReserveCustomKit() {
    const cleanName = customName.trim().toUpperCase() || "NONE";
    const cleanNum = customNumber.trim() || "10";
    setPrefill({
      program: formatOption(activeKit),
      subject: `Custom ${activeKit.nameEn} — #${cleanNum} ${cleanName} (${selectedSize})`,
      message: `Kit Reservation Request:\n- Item: ${activeKit.nameEn}\n- Size: ${selectedSize}\n- Custom Print Name: ${cleanName}\n- Squad Number: #${cleanNum}\n- Price: ${activeKit.priceAed} AED`,
    });
    document.getElementById("reserve-merch")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSelectCatalogItem(item: typeof homeKit) {
    setPrefill({
      program: formatOption(item),
      subject: `Merchandise Reservation: ${item.nameEn}`,
      message: `I would like to reserve "${item.nameEn}" (${item.priceAed} AED) for pickup or delivery.`,
    });
    document.getElementById("reserve-merch")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="space-y-12">
      {/* Interactive Luxury Kit Studio */}
      <section
        id="kit-studio"
        className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A2240] via-[#071426] to-[#050D1A] p-6 text-white shadow-2xl sm:p-10"
      >
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* 3D Spotlight Jersey Preview */}
          <div className="lg:col-span-6">
            <motion.div
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                setTilt({ x: (0.5 - py) * 14, y: (px - 0.5) * 16 });
              }}
              onPointerLeave={() => setTilt({ x: 0, y: 0 })}
              animate={{ rotateX: tilt.x, rotateY: tilt.y }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              style={{ transformStyle: "preserve-3d", perspective: 900 }}
              className="relative mx-auto flex aspect-square max-w-md items-center justify-center rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_50%_35%,rgba(38,120,255,0.28),rgba(7,20,38,0.95))] p-8 shadow-inner"
            >
              <div className="absolute start-4 top-4 flex items-center gap-2">
                <Badge variant="goldDark">
                  {selectedKit === "home"
                    ? dict.interactive.homeKitLabel
                    : dict.interactive.awayKitLabel}
                </Badge>
              </div>

              <div className="relative h-72 w-72 sm:h-80 sm:w-80">
                <Image
                  src={activeKit.imageUrl}
                  alt={locale === "ar" ? activeKit.nameAr : activeKit.nameEn}
                  fill
                  sizes="360px"
                  className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.65)]"
                />
              </div>

              {/* Live Athletic Print Stamp */}
              <div className="absolute bottom-5 inset-x-6 flex items-center justify-between rounded-2xl border border-[#D5A84B]/40 bg-[#050E1B]/90 px-4 py-2.5 backdrop-blur-md">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#D5A84B]">
                    {dict.interactive.backNameLabel} · {selectedSize}
                  </span>
                  <span className="text-base font-black uppercase tracking-[0.14em] text-white">
                    {customName.trim() || "DIBBA SCC"}
                  </span>
                </div>
                <span className="text-3xl font-black text-[#D5A84B] tabular-nums">
                  #{customNumber || "10"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Customizer Controls */}
          <div className="space-y-6 lg:col-span-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#D5A84B]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{dict.interactive.kitEyebrow}</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {dict.interactive.kitTitle}
              </h2>
              <p className="text-sm leading-relaxed text-white/75">
                {dict.interactive.kitSubtitle}
              </p>
            </div>

            {/* Kit Switcher */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedKit("home")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-start transition-all cursor-pointer",
                  selectedKit === "home"
                    ? "border-[#D5A84B] bg-[#D5A84B]/15 text-white"
                    : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
                )}
              >
                <Shirt className="h-5 w-5 text-[#2678FF]" />
                <div>
                  <span className="block text-xs font-extrabold">
                    {dict.interactive.homeKitLabel}
                  </span>
                  <span className="text-[11px] text-[#D5A84B] tabular-nums">
                    {homeKit.priceAed} AED
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedKit("away")}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-start transition-all cursor-pointer",
                  selectedKit === "away"
                    ? "border-[#D5A84B] bg-[#D5A84B]/15 text-white"
                    : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
                )}
              >
                <Shirt className="h-5 w-5 text-[#D5A84B]" />
                <div>
                  <span className="block text-xs font-extrabold">
                    {dict.interactive.awayKitLabel}
                  </span>
                  <span className="text-[11px] text-[#D5A84B] tabular-nums">
                    {awayKit.priceAed} AED
                  </span>
                </div>
              </button>
            </div>

            {/* Name & Number Inputs */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/70">
                  {dict.interactive.backNameLabel}
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#050D1A] px-3.5 py-2.5 text-sm font-bold uppercase tracking-wider text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/70">
                  {dict.interactive.squadNumberLabel}
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={customNumber}
                  onChange={(e) => setCustomNumber(e.target.value.slice(0, 2))}
                  className="w-full rounded-xl border border-white/15 bg-[#050D1A] px-3.5 py-2.5 text-sm font-black text-[#D5A84B] tabular-nums"
                />
              </div>
            </div>

            {/* Size Pills */}
            <div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">
                {dict.interactive.sizeLabel}
              </span>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={cn(
                      "h-10 min-w-[48px] rounded-lg border px-3 text-xs font-black transition-all cursor-pointer",
                      selectedSize === sz
                        ? "border-[#D5A84B] bg-[#D5A84B] text-[#071426]"
                        : "border-white/15 bg-white/5 text-white hover:border-[#2678FF]"
                    )}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handleReserveCustomKit}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{dict.interactive.lockKitButton}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Full Merchandise Catalog */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {MERCHANDISE_CATALOG.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#DCE3EE] bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2678FF]/45"
          >
            <div>
              <div className="relative aspect-square w-full bg-[#EEF2F7] p-4">
                <Image
                  src={item.imageUrl}
                  alt={locale === "ar" ? item.nameAr : item.nameEn}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain p-4 transition-transform duration-300 hover:scale-105"
                />
                {(item.badgeEn || item.badgeAr) && (
                  <span className="absolute start-3 top-3 rounded-full bg-[#0A2240] px-2.5 py-0.5 text-[10px] font-bold text-[#D5A84B]">
                    {locale === "ar" ? item.badgeAr : item.badgeEn}
                  </span>
                )}
              </div>

              <div className="p-4 pb-0 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#2678FF]">
                  {locale === "ar" ? item.categoryAr : item.categoryEn}
                </p>
                <h2 className="text-base font-extrabold text-[#071426]">
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </h2>
              </div>
            </div>

            <div className="m-4 mt-4 flex items-center justify-between border-t border-[#DCE3EE] pt-3">
              <span className="text-lg font-black text-[#0A2240] tabular-nums">
                {item.priceAed} AED
              </span>
              <button
                type="button"
                onClick={() => handleSelectCatalogItem(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A2240] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2678FF] transition-colors cursor-pointer"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{dict.commercial.reserveItem}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reservation Form */}
      <div
        id="reserve-merch"
        className="rounded-2xl border border-[#DCE3EE] bg-white p-6 shadow-xs sm:p-10"
      >
        <h2 className="mb-6 text-2xl font-black text-[#071426]">
          {dict.commercial.reserveItem}
        </h2>
        <EnquiryForm
          dict={dict}
          type="merch_order"
          programOptions={itemOptions}
          defaultSubject="Merchandise Reservation Request"
          prefilledProgram={prefill.program}
          prefilledSubject={prefill.subject}
          prefilledMessage={prefill.message}
        />
      </div>
    </div>
  );
}
