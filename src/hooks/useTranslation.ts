"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

export function useTranslation() {
  const { language } = useLanguage();

  return {
    t: (key: string, params?: Record<string, any>) => t(key, language, params),
    language,
  };
}
