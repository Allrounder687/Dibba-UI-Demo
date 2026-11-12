"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { PlayerRecord } from "@/db/seed-data";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LuxuryPlayerCardProps {
  player: PlayerRecord;
  locale: Locale;
  dict: Dictionary;
  showStats?: boolean;
  onSelect?: () => void;
}

export function LuxuryPlayerCard({
  player,
  locale,
  dict,
  showStats = false,
  onSelect,
}: LuxuryPlayerCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 25 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 10;
    setTilt({
      rotateX,
      rotateY,
      glareX: Math.round(px * 100),
      glareY: Math.round(py * 100),
    });
  }

  function handlePointerLeave() {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 25 });
  }

  const cardInner = (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-[#17437E] via-[#0A2240] to-[#040B16] text-start text-white shadow-xl transition-colors duration-200 hover:border-[#D5A84B]/70"
      )}
    >
      {/* Interactive holographic specular glare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 220px at ${tilt.glareX}% ${tilt.glareY}%, rgba(213, 168, 75, 0.24), rgba(38, 120, 255, 0.14) 45%, transparent 75%)`,
        }}
      />

      {/* Giant watermark jersey number */}
      <span className="pointer-events-none select-none absolute end-4 top-2 text-7xl font-black tracking-tighter text-white/10 tabular-nums transition-all duration-300 group-hover:scale-110 group-hover:text-[#D5A84B]/25">
        {String(player.number).padStart(2, "0")}
      </span>

      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <Badge variant="goldDark">{player.position}</Badge>
        <span className="rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white/75">
          DIBBA 26
        </span>
      </div>

      {/* Transparent cutout player image */}
      <div className="relative z-10 mx-auto mt-2 h-60 w-full">
        <Image
          src={player.imageUrl}
          alt={locale === "ar" ? player.nameAr : player.nameEn}
          fill
          unoptimized={player.imageUrl.startsWith("/uploads/")}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain object-bottom drop-shadow-[0_14px_20px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="relative z-10 border-t-2 border-[#D5A84B] bg-[#050E1B]/95 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-lg font-extrabold text-white leading-tight">
            {locale === "ar" ? player.nameAr : player.nameEn}
          </h3>
          <span className="shrink-0 text-base font-black text-[#D5A84B] tabular-nums">
            #{player.number}
          </span>
        </div>
        <p className="mt-1 truncate text-xs font-medium text-white/60">
          {locale === "ar" ? player.nationalityAr : player.nationalityEn}
        </p>

        {showStats && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs tabular-nums">
            <div className="rounded-lg border border-white/5 bg-white/5 py-2">
              <span className="block font-bold text-white">{player.appearances}</span>
              <span className="text-[10px] text-white/55">{dict.squad.appearances}</span>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 py-2">
              <span className="block font-bold text-[#D5A84B]">{player.goals}</span>
              <span className="text-[10px] text-white/55">{dict.squad.goals}</span>
            </div>
            <div className="rounded-lg border border-white/5 bg-white/5 py-2">
              <span className="block font-bold text-[#66A3FF]">{player.assists}</span>
              <span className="text-[10px] text-white/55">{dict.squad.assists}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className="w-full text-start cursor-pointer">
        {cardInner}
      </button>
    );
  }

  return cardInner;
}
