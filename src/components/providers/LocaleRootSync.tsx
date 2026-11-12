"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/dictionaries";

export function LocaleRootSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
